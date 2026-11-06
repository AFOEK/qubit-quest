# ✳ Qubit Quest

**Make quantum click.** A quantum learning playground for the University of Waterloo IBM Qiskit Fall Fest 2026.

Our bridge is education: learners move from familiar bits and small experiments to quantum algorithms, optimization, and the variational principle behind chemistry simulation. Short lessons ask learners to predict an outcome, test it, and explain it. The visual identity and curriculum are original.

## Run locally

Use Node.js **22.x (22.12 or later) or 24.x**, and Python **3.12 or 3.13**. The locked NumPy and SciPy versions require Python 3.12 or newer; the deployment configuration selects Python 3.13. Local development needs no IBM account, cloud credits, API keys, or separate database installation.

Clone this fork and install the frontend dependencies:

```sh
git clone https://github.com/AFOEK/qubit-quest.git
cd qubit-quest
npm ci
```

Start the API from the repository root. These commands use the virtual environment directly, so activation is optional.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r services/api/requirements.lock.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --app-dir .\services\api --port 8000
```

**macOS / Linux:**

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r services/api/requirements.lock.txt
.venv/bin/python -m uvicorn main:app --app-dir services/api --port 8000
```

Check that `python --version` / `python3 --version` reports a supported version before creating the environment. With several Python versions installed, choose the 3.12 or 3.13 interpreter explicitly.

In a second terminal at the same repository root:

```sh
npm run dev
```

Open **http://127.0.0.1:5173** using the URL printed by Vite. The development server proxies `/api` to port 8000. API health: **http://127.0.0.1:8000/api/health**. Interactive API docs: **http://127.0.0.1:8000/docs**. If port 5173 is occupied, Vite may choose another port; close the other server or configure `ALLOWED_ORIGINS` for the actual frontend origin before using accounts.

SQLite storage is created at `data/learning.sqlite3` on the first account database operation. Guests can learn without signing in, and their progress stays in the browser. Production account saving requires a PostgreSQL `DATABASE_URL`; see [deployment](docs/deployment.md).

`.env.example` documents optional settings. Vite reads `QQ_API_TARGET` from a root `.env` file or the shell. The Python API reads exported process variables; copying `.env.example` alone does not configure the API.

## What works

- Twenty-seven courses and 119 lessons: a math primer, quantum mechanics, qubits, Gates I–II, Software and Compilation, Algorithm I–III, noise/error correction, error mitigation, Hardware I–IV, applied optimization, Classical–Quantum Boundaries I–III, Cryptography I–II, Chemistry I–III, and Machine Learning I–III. Algorithm II develops Grover search, amplitude amplification, quantum walks, and QAE alongside Fourier and phase-estimation methods. Each lesson includes explained mathematics or program syntax, a worked example, practice with a revealable answer, and a quiz. See the [curriculum guide](docs/curriculum.md) for the full syllabus and recommended paths.
- Choose one of seven goal-based trails, follow required courses in dependency order, and explore optional branches. Search and browse the full catalog at any time. New lessons unlock after prerequisite courses are complete; previously completed lessons remain reviewable.
- Earn 27 named course-completion badges and progress through Bronze, Silver, Gold, and Platinum journey tiers. The achievements page includes earned/in-progress filters, badge search, and links to continue or review each course. XP milestones advance beyond the original 50 XP goal through the full 2,975 XP trail. Existing saved completions count automatically; reviews never grant duplicate rewards. See [achievements and milestones](docs/achievements.md).
- Register and sign in with an email and password. Lessons, selected trail, and daily quiz history save to your account across devices. SQLite is used locally; deployment uses PostgreSQL. Guest lesson completions can be imported explicitly; guest daily quiz history stays in the browser. See [accounts and trails](docs/accounts-and-trails.md).
- Sign-in is optional throughout the app. Use **Continue as guest** from the account dialog, an expired session, or a slow/unavailable account check. Lessons, prerequisites, achievements, and daily quizzes work with browser-local guest progress.
- Three daily quantum fun-fact questions with explanations, a first-answer score, and a participation streak. Questions reset at midnight in Toronto. Daily participation stays separate from course XP and badges.
- Single-qubit H/X/Y/Z/S/T gate explorer with complex-valued statevector calculations, a Bloch visualization, and Qiskit verification with sampled counts.
- Qiskit two-qubit Bell, Grover search, QFT, single-edge QAOA, and a parameterized toy spin energy experiment.
- Interactive Three.js lab, desktop orbit controls, WebXR entry on compatible browsers, and controller-trigger gate cycling. Headset entry needs a secure context such as HTTPS; localhost is a development exception. **Physical headset operation remains unverified.**
- Unity scripts and scene generator for a native Quest 3 implementation. **Native Unity compilation and headset operation remain unverified.** See [Unity setup](apps/unity/README.md).

The curriculum distinguishes live lab experiments from guided calculations and model-design exercises. Molecular chemistry, noisy channels/QEC, mitigation, cryptography, optimization modeling, and machine-learning workflows are taught through worked exercises; the simulation API still offers the original bounded ideal circuits and toy spin model. Full molecular solvers, optimizers, mitigation experiments, protocol implementations, photonic sampling, and ML training remain implementation milestones.

Software, tensor-network, and hardware courses add guided program-reading, contraction, truncation, pulse-model, and characterization exercises. They do not add a QASM execution service, tensor-network solver, or hardware pulse access. OpenPulse is taught as an evolving, target-dependent calibration grammar. Qiskit Pulse was removed in Qiskit 2.0; Qiskit Dynamics is archived/deprecated and is covered as a version-specific historical model/solver reference. These lessons do not change project dependencies.

## Repository map

```text
apps/web/src/       React app, curriculum, statevector model, WebXR
apps/unity/        Native Unity source and setup instructions
services/api/      FastAPI, accounts, database, Qiskit circuits, API tests
shared/            Generated learning manifest and daily question bank
notebooks/         Explainable judge demo
docs/              Architecture, demo, and roadmap
.github/workflows/ Web checks and API tests against SQLite and PostgreSQL
```

## Verify

```sh
npm test
npm run build
npm run format:check
```

Run API tests with `.venv/bin/python -m pytest services/api -q` on macOS/Linux, or `.\.venv\Scripts\python.exe -m pytest services/api -q` in Windows PowerShell. Local tests use temporary SQLite databases. CI also runs account tests against PostgreSQL; [the account guide](docs/accounts-and-trails.md#verification) explains the optional local PostgreSQL test setting.

After changing course IDs, quiz answers, prerequisites, or goal definitions, run `npm run learning:sync`. The build checks that the API's generated manifest matches the curriculum. The [demo guide](docs/demo.md) covers the notebook and a short presentation flow.

The API limits circuits to six qubits, 64 gates, and 8,192 shots. Simulations are local and ideal. Qiskit bitstrings put qubit 0 at the right. `StatevectorSampler` results are samples; exact probabilities and amplitudes are also returned. See [architecture](docs/architecture.md) and [judge demo](docs/demo.md).

## Team workflow

This fork is **[AFOEK/qubit-quest](https://github.com/AFOEK/qubit-quest)**. Check `git remote -v` before pulling or pushing so you update the intended repository. From a clean `main` checkout, use `git pull --ff-only origin main`; then rerun `npm ci` and the Python dependency-install command for your platform. Pulling source does not install new dependencies.

Create a branch such as `feat/quest-interactions` and open a PR against this fork. Keep generated builds, Python environments, Unity caches, credentials, and large recordings out of Git. Run `npm run format` after editing web code or docs, then the checks above before merging.

Local accounts automatically create `data/learning.sqlite3` (excluded from Git). For production, configure `DATABASE_URL` with a PostgreSQL connection string in Vercel before using accounts. See [deployment](docs/deployment.md). Public hosting needs HTTPS, explicit allowed origins, resource limits, and a frontend `/api` reverse proxy. `npm run build` alone creates only the web frontend. No real quantum hardware jobs are submitted.

## Troubleshooting

- **API import or missing-package error after updating:** reinstall `services/api/requirements.lock.txt` using the same virtual-environment interpreter that starts Uvicorn.
- **Windows `UnicodeDecodeError` while loading shared JSON:** update to the current `AFOEK/qubit-quest:main`; both data files are explicitly read as UTF-8. Recreating a working environment is unnecessary for that fix.
- **Lessons work but Qiskit requests fail:** check `/api/health` and keep the API terminal running. Guest lessons and daily quizzes can run without the API.
- **Account requests fail:** local SQLite needs a writable data directory; Vercel needs PostgreSQL `DATABASE_URL`. For HTTP localhost, leave `COOKIE_SECURE=false` (the local default). For HTTPS production, use `true`.
