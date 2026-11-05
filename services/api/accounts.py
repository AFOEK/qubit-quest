"""Cookie sessions, account-isolated learning progress, and daily quiz records."""
import base64
import hashlib
import hmac
import os
import re
import secrets
import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import and_, delete, insert, select, update
from sqlalchemy.exc import IntegrityError
try:
    from . import storage as db, learning
except ImportError:
    import storage as db
    import learning

router = APIRouter(prefix="/api")
SESSION_AGE = 30 * 24 * 60 * 60


def storage():
    try:
        return db.get_engine()
    except Exception:
        raise HTTPException(503, "Account saving is unavailable. Please try again later or continue as a guest.") from None


def secure_cookies():
    return os.getenv("COOKIE_SECURE", "true" if os.getenv("VERCEL") else "false").lower() == "true"


def cookie_name():
    return "__Host-qq_session" if secure_cookies() else "qq_session"


def password_hash(password):
    salt = secrets.token_bytes(16)
    value = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1, dklen=64)
    return "scrypt$" + base64.b64encode(salt).decode() + "$" + base64.b64encode(value).decode()


def password_matches(password, encoded):
    try:
        _, salt, expected = encoded.split("$")
        value = hashlib.scrypt(password.encode(), salt=base64.b64decode(salt), n=16384, r=8, p=1, dklen=64)
        return hmac.compare_digest(value, base64.b64decode(expected))
    except (ValueError, TypeError):
        return False


DUMMY_PASSWORD = password_hash("not-a-user-password")


def origin_check(request):
    origin = request.headers.get("origin")
    allowed = {value.strip().rstrip("/") for value in os.getenv(
        "ALLOWED_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173").split(",") if value.strip()}
    allowed.add(str(request.base_url).rstrip("/"))
    # Vercel can terminate HTTPS before the ASGI request reaches the function.
    for key in ("VERCEL_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_BRANCH_URL"):
        if os.getenv(key):
            allowed.add("https://" + os.environ[key].rstrip("/"))
    if origin and origin.rstrip("/") not in allowed:
        raise HTTPException(403, "This request came from an untrusted origin.")


def session(request: Request):
    token = request.cookies.get(cookie_name())
    if not token or len(token) > 128:
        raise HTTPException(401, "Please sign in to save account progress.")
    engine = storage()
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with engine.connect() as connection:
        record = connection.execute(select(db.sessions, db.users).join(
            db.users, db.sessions.c.user_id == db.users.c.id).where(
            db.sessions.c.token_hash == token_hash, db.sessions.c.expires_at > int(time.time()))).mappings().first()
    if not record:
        raise HTTPException(401, "Your session expired. Please sign in again.")
    return dict(record)


def mutation(request: Request, current=Depends(session)):
    origin_check(request)
    if not hmac.compare_digest(request.headers.get("x-csrf-token", ""), current["csrf"]):
        raise HTTPException(403, "Please refresh your session and try again.")
    return current


def snapshot(connection, user_id):
    user = connection.execute(select(db.users).where(db.users.c.id == user_id)).mappings().one()
    ids = connection.execute(select(db.completions.c.lesson_id).where(db.completions.c.user_id == user_id)).scalars().all()
    quiz = connection.execute(select(db.quiz_answers).where(db.quiz_answers.c.user_id == user_id)).mappings().all()
    return {"completedIds": [id for id in ids if id in learning.LESSONS], "pathId": user["path_id"],
            "dailyAnswers": [{"day": row["day"], "questionId": row["question_id"], "answer": row["answer"], "correct": row["correct"]} for row in quiz],
            **learning.quiz_summary(quiz)}


def public_user(record):
    return {"id": record["id"], "name": record["name"], "email": record["email"]}


def start_session(connection, user, response):
    token, csrf = secrets.token_urlsafe(32), secrets.token_urlsafe(24)
    connection.execute(insert(db.sessions).values(token_hash=hashlib.sha256(token.encode()).hexdigest(),
        user_id=user["id"], csrf=csrf, expires_at=int(time.time()) + SESSION_AGE))
    response.set_cookie(cookie_name(), token, httponly=True, secure=secure_cookies(), samesite="lax", max_age=SESSION_AGE, path="/")
    return {"user": public_user(user), "csrfToken": csrf, "progress": snapshot(connection, user["id"])}


def rate_limit(request, email):
    engine = storage()
    now = int(time.time())
    ip = request.client.host if request.client else "unknown"
    with engine.begin() as connection:
        connection.execute(delete(db.attempts).where(db.attempts.c.started_at < now - 900))
        connection.execute(delete(db.sessions).where(db.sessions.c.expires_at <= now))
        for scope, limit in ((f"ip:{ip}", 60), (f"login:{ip}:{email}", 12)):
            key = hashlib.sha256(scope.encode()).hexdigest()
            def increment():
                return connection.execute(update(db.attempts).where(db.attempts.c.key == key)
                    .values(count=db.attempts.c.count + 1).returning(db.attempts.c.count)).scalar_one_or_none()
            count = increment()
            if count is None:
                try:
                    with connection.begin_nested():
                        connection.execute(insert(db.attempts).values(key=key, started_at=now, count=1))
                    count = 1
                except IntegrityError:
                    count = increment()
            if count > limit:
                raise HTTPException(429, "Too many attempts. Please wait 15 minutes before trying again.")


class Credentials(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=8, max_length=128)
    import_ids: list[str] = Field(default_factory=list, max_length=500)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        value = value.strip().casefold()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("Enter a valid email address")
        return value


class Registration(Credentials):
    name: str = Field(min_length=1, max_length=60)
    path_id: str = "foundations"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()
        if not value or any(ord(char) < 32 for char in value):
            raise ValueError("Enter a display name")
        return value

    @field_validator("path_id")
    @classmethod
    def validate_path(cls, value):
        if value not in learning.PATHS:
            raise ValueError("Unknown learning path")
        return value


@router.post("/account/register")
def register(payload: Registration, request: Request, response: Response):
    origin_check(request)
    rate_limit(request, payload.email)
    user = {"id": str(uuid.uuid4()), "email": payload.email, "name": payload.name,
            "password_hash": password_hash(payload.password), "path_id": payload.path_id, "created_at": int(time.time())}
    try:
        with storage().begin() as connection:
            connection.execute(insert(db.users).values(**user))
            for lesson_id in set(payload.import_ids) & learning.LESSONS.keys():
                add_completion(connection, user["id"], lesson_id)
            return start_session(connection, user, response)
    except IntegrityError:
        raise HTTPException(409, "An account with that email already exists. Please sign in.") from None


@router.post("/account/login")
def login(payload: Credentials, request: Request, response: Response):
    origin_check(request)
    rate_limit(request, payload.email)
    with storage().begin() as connection:
        user = connection.execute(select(db.users).where(db.users.c.email == payload.email)).mappings().first()
        if not password_matches(payload.password, user["password_hash"] if user else DUMMY_PASSWORD):
            raise HTTPException(401, "Email or password is incorrect.")
        for lesson_id in set(payload.import_ids) & learning.LESSONS.keys():
            add_completion(connection, user["id"], lesson_id)
        return start_session(connection, user, response)


@router.get("/account/session")
def current_session(current=Depends(session)):
    with storage().connect() as connection:
        return {"user": public_user(current), "csrfToken": current["csrf"], "progress": snapshot(connection, current["id"])}


@router.post("/account/logout")
def logout(response: Response, current=Depends(mutation)):
    with storage().begin() as connection:
        connection.execute(delete(db.sessions).where(db.sessions.c.token_hash == current["token_hash"]))
    response.delete_cookie(cookie_name(), path="/", secure=secure_cookies(), httponly=True, samesite="lax")
    return {"ok": True}


@router.get("/progress")
def get_progress(current=Depends(session)):
    with storage().connect() as connection:
        return snapshot(connection, current["id"])


class LessonCompletion(BaseModel):
    lesson_id: str = Field(max_length=100)
    answer: int = Field(ge=0, le=2)


def add_completion(connection, user_id, lesson_id):
    exists = connection.execute(select(db.completions.c.lesson_id).where(
        db.completions.c.user_id == user_id, db.completions.c.lesson_id == lesson_id)).first()
    if not exists:
        # A unique key and a savepoint make retries/concurrent tabs idempotent.
        try:
            with connection.begin_nested():
                connection.execute(insert(db.completions).values(user_id=user_id, lesson_id=lesson_id, completed_at=int(time.time())))
        except IntegrityError:
            pass


@router.post("/progress/lesson")
def complete_lesson(payload: LessonCompletion, current=Depends(mutation)):
    lesson = learning.LESSONS.get(payload.lesson_id)
    if not lesson:
        raise HTTPException(422, "Unknown lesson.")
    if payload.answer != lesson["correct"]:
        raise HTTPException(422, "Check the lesson answer before completing it.")
    with storage().begin() as connection:
        progress = snapshot(connection, current["id"])
        if payload.lesson_id not in progress["completedIds"] and learning.unmet_prerequisites(payload.lesson_id, progress["completedIds"]):
            raise HTTPException(409, "Complete this course’s prerequisites first.")
        add_completion(connection, current["id"], payload.lesson_id)
        return snapshot(connection, current["id"])


class ProgressImport(BaseModel):
    completed_ids: list[str] = Field(max_length=500)


@router.post("/progress/import")
def import_guest(payload: ProgressImport, current=Depends(mutation)):
    with storage().begin() as connection:
        for lesson_id in set(payload.completed_ids) & learning.LESSONS.keys():
            add_completion(connection, current["id"], lesson_id)
        return snapshot(connection, current["id"])


class PathChoice(BaseModel):
    path_id: str


@router.post("/progress/path")
def choose_path(payload: PathChoice, current=Depends(mutation)):
    if payload.path_id not in learning.PATHS:
        raise HTTPException(422, "Unknown learning path.")
    with storage().begin() as connection:
        connection.execute(update(db.users).where(db.users.c.id == current["id"]).values(path_id=payload.path_id))
        return snapshot(connection, current["id"])


@router.get("/daily-quiz")
def daily_quiz():
    return {"day": learning.day_key(), "timezone": "America/Toronto", "questions": [
        {key: question[key] for key in ("id", "title", "question", "answers")} for question in learning.daily_questions()]}


class DailyAnswer(BaseModel):
    day: str = Field(max_length=10)
    question_id: str = Field(max_length=80)
    answer: int = Field(ge=0, le=2)


@router.post("/daily-quiz/answer")
def answer_daily(payload: DailyAnswer, current=Depends(mutation)):
    if payload.day != learning.day_key():
        raise HTTPException(409, "A new daily quiz is ready. Refresh to get today’s questions.")
    question = next((question for question in learning.daily_questions() if question["id"] == payload.question_id), None)
    if not question:
        raise HTTPException(422, "This question is not in today’s quiz.")
    with storage().begin() as connection:
        where = and_(db.quiz_answers.c.user_id == current["id"], db.quiz_answers.c.day == payload.day, db.quiz_answers.c.question_id == question["id"])
        previous = connection.execute(select(db.quiz_answers).where(where)).mappings().first()
        if not previous:
            try:
                with connection.begin_nested():
                    connection.execute(insert(db.quiz_answers).values(user_id=current["id"], day=payload.day, question_id=question["id"], answer=payload.answer, correct=payload.answer == question["correct"], answered_at=int(time.time())))
            except IntegrityError:
                pass
        return {"correct": question["correct"], "explanation": question["explanation"], "progress": snapshot(connection, current["id"])}
