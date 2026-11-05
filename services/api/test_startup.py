"""The API must load UTF-8 curriculum files on non-UTF-8 Windows installations."""
import os
from pathlib import Path
import subprocess
import sys
import pytest

ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.parametrize("module_name", ["main", "services.api.main"])
def test_api_startup_with_windows_default_encoding(module_name):
    # A fresh interpreter exercises both Uvicorn's --app-dir import and Vercel's
    # package import. Simulate Windows' CP1252 default for the shared data files.
    script = """
import importlib
import json
from pathlib import Path

shared = Path.cwd() / 'shared'
original_open = Path.open
def windows_open(path, mode='r', buffering=-1, encoding=None, errors=None, newline=None):
    if path.parent == shared and 'b' not in mode and encoding in (None, 'locale'):
        encoding = 'cp1252'
    return original_open(path, mode, buffering, encoding, errors, newline)
Path.open = windows_open

api = importlib.import_module(MODULE_NAME)
learning = importlib.import_module('learning' if MODULE_NAME == 'main' else 'services.api.learning')
assert '/api/daily-quiz' in api.app.openapi()['paths']
assert learning.MANIFEST == json.loads((shared / 'learning-manifest.json').read_bytes())
assert learning.QUIZZES == json.loads((shared / 'quiz-bank.json').read_bytes())
""".replace("MODULE_NAME", repr(module_name))
    env = {**os.environ, "PYTHONPATH": os.pathsep.join([str(ROOT), str(ROOT / 'services' / 'api')])}
    result = subprocess.run([sys.executable, "-X", "utf8=0", "-c", script], cwd=ROOT,
        env=env, capture_output=True, text=True, encoding="utf-8", timeout=30)
    assert result.returncode == 0, result.stderr
