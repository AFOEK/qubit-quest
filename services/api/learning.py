"""Shared curriculum rules and daily questions, independent of database state."""
import json
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

SHARED = Path(__file__).resolve().parents[2] / "shared"
MANIFEST = json.loads((SHARED / "learning-manifest.json").read_text(encoding="utf-8"))
COURSES = {course["id"]: course for course in MANIFEST["courses"]}
LESSONS = {lesson["id"]: {**lesson, "course_id": course["id"]}
           for course in MANIFEST["courses"] for lesson in course["lessons"]}
PATHS = {path["id"] for path in MANIFEST["paths"]} | {"all"}
QUIZZES = json.loads((SHARED / "quiz-bank.json").read_text(encoding="utf-8"))
TIMEZONE = ZoneInfo("America/Toronto")


def day_key():
    return datetime.now(TIMEZONE).date().isoformat()


def daily_questions(day=None):
    day = day or day_key()
    def order(question):
        value = 2166136261
        for char in f"qubit-quest:{day}:{question['id']}".encode():
            value = ((value ^ char) * 16777619) & 0xffffffff
        return value, question["id"]
    return sorted(QUIZZES, key=order)[:3]


def unmet_prerequisites(lesson_id, completed):
    course = COURSES[LESSONS[lesson_id]["course_id"]]
    return [course_id for course_id in course["prerequisites"]
            if not all(lesson["id"] in completed for lesson in COURSES[course_id]["lessons"])]


def quiz_summary(records, today=None):
    today = today or day_key()
    by_day = {}
    for record in records:
        by_day.setdefault(record["day"], set()).add(record["question_id"])
    finished = {day for day, ids in by_day.items()
                if {question["id"] for question in daily_questions(day)} <= ids}
    cursor = datetime.fromisoformat(today).date()
    if cursor.isoformat() not in finished:
        cursor -= timedelta(days=1)
    streak = 0
    while cursor.isoformat() in finished:
        streak += 1
        cursor -= timedelta(days=1)
    return {"completedDays": sorted(finished), "streak": streak}
