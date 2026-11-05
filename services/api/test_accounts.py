import hashlib
import os
import time
import uuid
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import insert, select, update, text
from sqlalchemy.exc import OperationalError
from main import app
import accounts
import learning
import storage as db

PASSWORD = "learn-quantum-2026"


@pytest.fixture(params=["sqlite"] + (["postgres"] if os.getenv("QQ_TEST_POSTGRES_URL") else []))
def store(request, tmp_path, monkeypatch):
    if request.param == "postgres":
        base = db.make_engine(os.environ["QQ_TEST_POSTGRES_URL"])
        schema = "test_" + uuid.uuid4().hex
        with base.begin() as connection:
            connection.execute(text(f'CREATE SCHEMA "{schema}"'))
        engine = base.execution_options(schema_translate_map={None: schema})
        db.metadata.create_all(engine)
    else:
        engine = db.make_engine(f"sqlite:///{tmp_path / 'learners.sqlite3'}")
    monkeypatch.setattr(accounts, "storage", lambda: engine)
    monkeypatch.setenv("COOKIE_SECURE", "false")
    yield engine
    if request.param == "postgres":
        with base.begin() as connection:
            connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        base.dispose()
    else:
        engine.dispose()


@pytest.fixture
def client(store):
    with TestClient(app) as client:
        yield client


def register(client, email="learner@example.com", **extra):
    response = client.post("/api/account/register", json={
        "email": email, "name": "Quantum Explorer", "password": PASSWORD, **extra})
    assert response.status_code == 200, response.text
    data = response.json()
    client.headers["X-CSRF-Token"] = data["csrfToken"]
    return data


def test_register_hashes_password_and_cookie_session(client, store):
    data = register(client, "  Learner@Example.com ", path_id="qml")
    assert data["user"]["email"] == "learner@example.com"
    assert data["progress"]["pathId"] == "qml"
    assert data["progress"]["completedIds"] == []
    with store.connect() as connection:
        user = connection.execute(select(db.users)).mappings().one()
        session = connection.execute(select(db.sessions)).mappings().one()
    assert user["password_hash"].startswith("scrypt$")
    assert PASSWORD not in user["password_hash"]
    assert accounts.password_matches(PASSWORD, user["password_hash"])
    token = client.cookies.get("qq_session")
    assert session["token_hash"] == hashlib.sha256(token.encode()).hexdigest()
    assert token not in str(data) and "password_hash" not in str(data)
    restored = client.get("/api/account/session")
    assert restored.json()["user"] == data["user"]
    assert restored.headers["cache-control"] == "no-store"


def test_cookie_flags_local_and_https(store, monkeypatch):
    with TestClient(app, base_url="https://learn.example") as client:
        monkeypatch.setenv("COOKIE_SECURE", "true")
        response = client.post("/api/account/register", json={
            "name": "Learner", "email": "secure@example.com", "password": PASSWORD})
        cookie = response.headers["set-cookie"]
        assert cookie.startswith("__Host-qq_session=")
        for flag in ("HttpOnly", "Secure", "SameSite=lax", "Path=/", "Max-Age=2592000"):
            assert flag in cookie
        assert "Domain=" not in cookie
        assert client.get("/api/account/session").status_code == 200


def test_duplicate_registration_and_bad_credentials(client):
    register(client)
    duplicate = client.post("/api/account/register", json={
        "email": "LEARNER@example.com", "name": "Another", "password": PASSWORD})
    assert duplicate.status_code == 409
    messages = []
    for email in ("learner@example.com", "absent@example.com"):
        response = client.post("/api/account/login", json={"email": email, "password": "wrong-password"})
        assert response.status_code == 401
        messages.append(response.json())
    assert messages[0] == messages[1]


def test_vercel_https_origin_after_proxy_termination(client, monkeypatch):
    monkeypatch.setenv("VERCEL_PROJECT_PRODUCTION_URL", "learn.example")
    response = client.post("/api/account/register", headers={"Origin": "https://learn.example"}, json={
        "email": "proxy@example.com", "name": "Learner", "password": PASSWORD})
    assert response.status_code == 200


@pytest.mark.parametrize("extra", [
    {"email": "bad"}, {"password": "short"}, {"name": "   "}, {"path_id": "missing"},
])
def test_registration_validation(client, extra):
    response = client.post("/api/account/register", json={
        "email": "valid@example.com", "name": "Learner", "password": PASSWORD, **extra})
    assert response.status_code == 422


def test_csrf_origin_and_account_isolation(client, store):
    first = register(client)
    assert client.post("/api/progress/path", json={"path_id": "qml"},
        headers={"X-CSRF-Token": "invalid"}).status_code == 403
    assert client.post("/api/progress/path", json={"path_id": "qml"},
        headers={"Origin": "https://untrusted.example"}).status_code == 403
    assert client.post("/api/account/login", json={"email": "learner@example.com", "password": PASSWORD},
        headers={"Origin": "https://untrusted.example"}).status_code == 403
    with TestClient(app) as other:
        register(other, "other@example.com")
        assert other.get("/api/progress").json()["completedIds"] == []
        assert other.post("/api/progress/path", json={"path_id": "qml"},
            headers={"X-CSRF-Token": first["csrfToken"]}).status_code == 403
    with TestClient(app) as guest:
        assert guest.get("/api/progress").status_code == 401
        assert guest.post("/api/progress/import", json={"completed_ids": []}).status_code == 401


def test_completion_checks_answer_and_prerequisites_and_is_idempotent(client, store):
    register(client)
    target = learning.COURSES["quantum-mechanics"]["lessons"][0]
    response = client.post("/api/progress/lesson", json={"lesson_id": target["id"], "answer": target["correct"]})
    assert response.status_code == 409
    math = learning.COURSES["math"]["lessons"]
    lesson = math[0]
    assert client.post("/api/progress/lesson", json={"lesson_id": lesson["id"],
        "answer": (lesson["correct"] + 1) % 3}).status_code == 422
    assert client.post("/api/progress/lesson", json={"lesson_id": "missing", "answer": 0}).status_code == 422
    for lesson in math:
        assert client.post("/api/progress/lesson", json={"lesson_id": lesson["id"], "answer": lesson["correct"]}).status_code == 200
    for _ in range(2):
        result = client.post("/api/progress/lesson", json={"lesson_id": target["id"], "answer": target["correct"]})
        assert len(result.json()["completedIds"]) == len(math) + 1
    with store.connect() as connection:
        assert len(connection.execute(select(db.completions)).all()) == len(math) + 1


def test_legacy_import_is_explicit_validated_and_deduplicated(client):
    old = next(iter(learning.LESSONS))
    data = register(client, import_ids=[old, old, "stale"])
    assert data["progress"]["completedIds"] == [old]
    legacy = learning.COURSES["ml-3"]["lessons"][0]["id"]
    result = client.post("/api/progress/import", json={"completed_ids": [legacy, old, legacy, "unknown"]})
    assert set(result.json()["completedIds"]) == {legacy, old}
    # Historical achievements remain reviewable after prerequisites were introduced.
    assert client.post("/api/progress/lesson", json={"lesson_id": legacy,
        "answer": learning.LESSONS[legacy]["correct"]}).status_code == 200


def test_progress_path_and_daily_answers_survive_login_on_another_device(client):
    first = register(client)
    lesson = learning.COURSES["math"]["lessons"][0]
    client.post("/api/progress/lesson", json={"lesson_id": lesson["id"], "answer": lesson["correct"]})
    assert client.post("/api/progress/path", json={"path_id": "qml"}).status_code == 200
    assert client.post("/api/progress/path", json={"path_id": "missing"}).status_code == 422
    with TestClient(app) as device:
        login = device.post("/api/account/login", json={"email": "LEARNER@example.com", "password": PASSWORD})
        assert login.status_code == 200
        assert login.json()["user"] == first["user"]
        assert login.json()["progress"]["completedIds"] == [lesson["id"]]
        assert login.json()["progress"]["pathId"] == "qml"
        assert login.json()["csrfToken"] != first["csrfToken"]


def test_daily_quiz_first_answer_is_final_and_wrong_answers_count_toward_streak(client, monkeypatch):
    monkeypatch.setattr(learning, "day_key", lambda: "2026-11-05")
    register(client)
    public = client.get("/api/daily-quiz").json()
    assert [q["id"] for q in public["questions"]] == ["schmidt", "energy", "qubo"]
    assert "correct" not in public["questions"][0]
    questions = learning.daily_questions()
    for question in questions:
        wrong = (question["correct"] + 1) % 3
        body = {"day": public["day"], "question_id": question["id"], "answer": wrong}
        first = client.post("/api/daily-quiz/answer", json=body)
        assert first.status_code == 200
        assert first.json()["explanation"] == question["explanation"]
        retry = client.post("/api/daily-quiz/answer", json={**body, "answer": question["correct"]})
        stored = next(item for item in retry.json()["progress"]["dailyAnswers"] if item["questionId"] == question["id"])
        assert stored["answer"] == wrong and stored["correct"] is False
    progress = client.get("/api/progress").json()
    assert progress["streak"] == 1 and progress["completedDays"] == ["2026-11-05"]
    assert progress["completedIds"] == []  # Daily facts cannot inflate course XP.
    assert client.post("/api/daily-quiz/answer", json={"day": "2026-11-04", "question_id": questions[0]["id"], "answer": 0}).status_code == 409
    assert client.post("/api/daily-quiz/answer", json={"day": "2026-11-05", "question_id": "absent", "answer": 0}).status_code == 422
    with TestClient(app) as device:
        result = device.post("/api/account/login", json={"email": "learner@example.com", "password": PASSWORD})
        assert result.json()["progress"]["dailyAnswers"] == progress["dailyAnswers"]


def test_streak_tolerates_today_incomplete_and_breaks_after_a_missed_day():
    rows = [{"day": day, "question_id": q["id"]}
        for day in ("2026-11-03", "2026-11-04") for q in learning.daily_questions(day)]
    assert learning.quiz_summary(rows, "2026-11-05")["streak"] == 2
    assert learning.quiz_summary(rows, "2026-11-06")["streak"] == 0


def test_logout_and_expiration_invalidate_sessions(client, store):
    register(client)
    token = client.cookies.get("qq_session")
    assert client.post("/api/account/logout").status_code == 200
    client.cookies.set("qq_session", token)
    assert client.get("/api/account/session").status_code == 401
    login = client.post("/api/account/login", json={"email": "learner@example.com", "password": PASSWORD})
    assert login.status_code == 200
    with store.begin() as connection:
        connection.execute(update(db.sessions).values(expires_at=int(time.time()) - 1))
    assert client.get("/api/account/session").status_code == 401


def test_auth_attempts_are_rate_limited(client):
    body = {"email": "absent@example.com", "password": PASSWORD}
    for _ in range(12):
        assert client.post("/api/account/login", json=body).status_code == 401
    assert client.post("/api/account/login", json=body).status_code == 429


def test_sqlite_data_survives_engine_restart(tmp_path):
    url = f"sqlite:///{tmp_path / 'durable.sqlite3'}"
    first = db.make_engine(url)
    with first.begin() as connection:
        connection.execute(insert(db.users).values(id="persist", email="persist@example.com", name="Persist",
            password_hash="test", path_id="qml", created_at=0))
    first.dispose()
    second = db.make_engine(url)
    with second.connect() as connection:
        assert connection.execute(select(db.users.c.path_id)).scalar_one() == "qml"
    second.dispose()


def test_production_requires_database_url(monkeypatch):
    monkeypatch.setenv("VERCEL", "1")
    monkeypatch.delenv("DATABASE_URL", raising=False)
    db.get_engine.cache_clear()
    with pytest.raises(RuntimeError, match="DATABASE_URL"):
        db.get_engine()
    with TestClient(app) as client:
        assert client.post("/api/account/register", json={"email": "test@example.com", "name": "Test", "password": PASSWORD}).status_code == 503
    db.get_engine.cache_clear()


def test_database_connection_failure_is_a_safe_retryable_error(client, monkeypatch):
    register(client)
    class BrokenEngine:
        def connect(self):
            raise OperationalError("query", {}, Exception("private-database-credentials"))
    monkeypatch.setattr(accounts, "storage", lambda: BrokenEngine())
    response = client.get("/api/account/session")
    assert response.status_code == 503
    assert "private-database-credentials" not in response.text
