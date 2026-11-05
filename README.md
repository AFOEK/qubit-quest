# ✳ Qubit Quest

**Make quantum click.** A quantum learning playground for the University of Waterloo IBM Qiskit Fall Fest 2026.

Our bridge is education: learners move from familiar bits and small experiments to quantum algorithms, optimization, and the variational principle behind chemistry simulation. Short lessons ask learners to predict an outcome, test it, and explain it. The visual identity and curriculum are original.

## Run locally

Requires Node 22+ and Python 3.11–3.13. Local development needs no IBM account, cloud credits, or API keys. Production account saving requires PostgreSQL.

```sh
npm ci
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install -r services/api/requirements.lock.txt
python -m uvicorn main:app --app-dir services/api --port 8000
```

In another terminal, run `npm run dev` and open **http://127.0.0.1:5173**. The development server proxies `/api` to port 8000. API docs: **http://127.0.0.1:8000/docs**.

## What works

- Twenty-seven courses and 119 lessons: a math primer, quantum mechanics, qubits, Gates I–II, Software and Compilation, Algorithm I–III, noise/error correction, error mitigation, Hardware I–IV, applied optimization, Classical–Quantum Boundaries I–III, Cryptography I–II, Chemistry I–III, and Machine Learning I–III. Algorithm II develops Grover search, amplitude amplification, quantum walks, and QAE alongside Fourier and phase-estimation methods. Each lesson includes explained mathematics or program syntax, a worked example, practice with a revealable answer, and a quiz. See the [curriculum guide](docs/curriculum.md) for the full syllabus and recommended paths.
- Choose one of seven goal-based trails, follow required courses in dependency order, and explore optional branches. Search and browse the full catalog at any time. New lessons unlock after prerequisite courses are complete; previously completed lessons remain reviewable.
- Earn 27 named course-completion badges and progress through Bronze, Silver, Gold, and Platinum journey tiers. The achievements page includes earned/in-progress filters, badge search, and links to continue or review each course. XP milestones advance beyond the original 50 XP goal through the full 2,975 XP trail. Existing saved completions count automatically; reviews never grant duplicate rewards. See [achievements and milestones](docs/achievements.md).
- Register and sign in with an email and password. Lessons, selected trail, and daily quiz history save to your account across devices. SQLite is used locally; deployment uses PostgreSQL. Guest learning remains available with browser storage and an explicit lesson import. See [accounts and trails](docs/accounts-and-trails.md).
- Three daily quantum fun-fact questions with explanations, a first-answer score, and a participation streak. Questions reset at midnight in Toronto. Daily participation stays separate from course XP and badges.
- Single-qubit H/X/Y/Z/S/T gate explorer with exact complex arithmetic, a Bloch visualization, and Qiskit verification with sampled counts.
- Qiskit two-qubit Bell, Grover search, QFT, single-edge QAOA, and a parameterized toy spin energy experiment.
- Interactive Three.js lab, desktop orbit controls, WebXR entry on compatible devices, and controller-trigger gate cycling.
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
.github/workflows/ Build and physics checks on pushes and PRs
```

## Verify

```sh
npm test
npm run build
python -m pytest services/api -q
npm run format:check
```

The API limits circuits to six qubits, 64 gates, and 8,192 shots. Simulations are local and ideal. Qiskit bitstrings put qubit 0 at the right. `StatevectorSampler` results are samples; exact probabilities and amplitudes are also returned. See [architecture](docs/architecture.md) and [judge demo](docs/demo.md).

## Team workflow

Clone `https://github.com/minhajuddinm/qubit-quest.git`, create a branch such as `feat/quest-interactions`, and open a small PR. Keep generated builds, Python environments, Unity caches, credentials, and large recordings out of Git. Agree on ownership before changing shared files. Run `npm run format` after editing web code or docs, then the checks above before merging. The creator's GitHub account owns the repository; collaborator invitations require acceptance.

Local accounts automatically create `data/learning.sqlite3` (excluded from Git). For production, configure `DATABASE_URL` with a PostgreSQL connection string in Vercel before using accounts. See [deployment](docs/deployment.md). Public hosting needs HTTPS, explicit allowed origins, resource limits, and a frontend `/api` reverse proxy. `npm run build` alone creates only the web frontend. No real quantum hardware jobs are submitted.
