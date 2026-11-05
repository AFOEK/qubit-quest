"""Durable account storage: SQLite for development, PostgreSQL for deployment."""
import os
from functools import lru_cache
from pathlib import Path
from sqlalchemy import (Boolean, Column, ForeignKey, Integer, MetaData, String, Table,
                        create_engine, event)
from sqlalchemy.pool import NullPool, StaticPool

ROOT = Path(__file__).resolve().parents[2]
metadata = MetaData()
users = Table("learners", metadata,
    Column("id", String(36), primary_key=True), Column("email", String(254), unique=True, nullable=False),
    Column("name", String(60), nullable=False), Column("password_hash", String(512), nullable=False),
    Column("path_id", String(40), nullable=False, default="foundations"), Column("created_at", Integer, nullable=False))
sessions = Table("learner_sessions", metadata,
    Column("token_hash", String(64), primary_key=True),
    Column("user_id", String(36), ForeignKey("learners.id", ondelete="CASCADE"), nullable=False, index=True),
    Column("csrf", String(64), nullable=False), Column("expires_at", Integer, nullable=False, index=True))
completions = Table("lesson_completions", metadata,
    Column("user_id", String(36), ForeignKey("learners.id", ondelete="CASCADE"), primary_key=True),
    Column("lesson_id", String(100), primary_key=True), Column("completed_at", Integer, nullable=False))
quiz_answers = Table("daily_quiz_answers", metadata,
    Column("user_id", String(36), ForeignKey("learners.id", ondelete="CASCADE"), primary_key=True),
    Column("day", String(10), primary_key=True), Column("question_id", String(80), primary_key=True),
    Column("answer", Integer, nullable=False), Column("correct", Boolean, nullable=False),
    Column("answered_at", Integer, nullable=False))
attempts = Table("auth_rate_windows", metadata,
    Column("key", String(64), primary_key=True), Column("started_at", Integer, nullable=False),
    Column("count", Integer, nullable=False))


def make_engine(url: str):
    if url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    if url.startswith("sqlite:"):
        options = {"connect_args": {"check_same_thread": False, "timeout": 15}}
        if url.endswith(":memory:"):
            options["poolclass"] = StaticPool
        engine = create_engine(url, **options)
        @event.listens_for(engine, "connect")
        def configure_sqlite(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")
    elif url.startswith("postgresql+psycopg://"):
        engine = create_engine(url, poolclass=NullPool, pool_pre_ping=True, connect_args={"connect_timeout": 5})
    else:
        raise ValueError("Use SQLite or PostgreSQL for account storage")
    metadata.create_all(engine)
    return engine


@lru_cache(maxsize=1)
def get_engine():
    url = os.getenv("DATABASE_URL")
    if not url:
        if os.getenv("VERCEL"):
            raise RuntimeError("Production accounts require DATABASE_URL")
        directory = ROOT / "data"
        directory.mkdir(exist_ok=True)
        url = f"sqlite:///{directory / 'learning.sqlite3'}"
    return make_engine(url)
