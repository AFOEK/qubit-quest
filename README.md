# ✳ Qubit Quest

**Make quantum click.** A quantum learning playground for the University of Waterloo IBM Qiskit Fall Fest 2026.

Our bridge is education: learners move from familiar bits and small experiments to quantum algorithms, optimization, and the variational principle behind chemistry simulation. Short lessons ask learners to predict an outcome, test it, and explain it. The visual identity and curriculum are original.

## Run locally

Requires Node 22+ and Python 3.11–3.13. No IBM account, cloud credits, or API keys are needed.

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

- Fifteen courses and 67 lessons: an optional math primer, quantum mechanics, qubits, Gates I–II, Algorithm I–III, noise/error correction, Chemistry I–III, and Machine Learning I–III. Each lesson includes explained mathematics, a worked example, practice with a revealable answer, and a quiz. See the [curriculum guide](docs/curriculum.md) for the full syllabus and recommended paths.
- Search by topic, filter by learning path, expand courses, and follow recommended prerequisites. Quizzes award XP once; stable lesson IDs preserve browser-local progress, including migration from the original eight lessons.
- Single-qubit H/X/Y/Z/S/T gate explorer with exact complex arithmetic, a Bloch visualization, and Qiskit verification with sampled counts.
- Qiskit two-qubit Bell, Grover search, QFT, single-edge QAOA, and a parameterized toy spin energy experiment.
- Interactive Three.js lab, desktop orbit controls, WebXR entry on compatible devices, and controller-trigger gate cycling.
- Unity scripts and scene generator for a native Quest 3 implementation. **Native Unity compilation and headset operation remain unverified.** See [Unity setup](apps/unity/README.md).

The curriculum distinguishes live lab experiments from guided calculations and model-design exercises. Molecular chemistry, noisy channels/QEC, and machine-learning workflows are taught through worked exercises; the simulation API still offers the original bounded ideal circuits and toy spin model. Full molecular solvers, optimizers, photonic sampling, and ML training remain implementation milestones.

## Repository map

```text
apps/web/src/       React app, curriculum, statevector model, WebXR
apps/unity/        Native Unity source and setup instructions
services/api/      FastAPI, Qiskit circuits, physics/API tests
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

This is a hackathon MVP, with local profiles rather than authentication or a shared database. Public production deployment needs an API host, HTTPS, explicit allowed origins, resource limits, and a frontend `/api` reverse proxy. `npm run build` alone creates only the web frontend. No real quantum hardware jobs are submitted.
