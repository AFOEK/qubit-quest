"""ASGI entrypoint for the Qiskit service on Vercel."""
from services.api.main import app

__all__ = ["app"]
