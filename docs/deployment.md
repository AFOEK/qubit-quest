# Deploy to Vercel

Import `minhajuddinm/qubit-quest` into Vercel with the repository root as the project root. Keep the Vite preset. The tracked `vercel.json` defines `npm ci`, `npm run build`, and the `dist` output. Choose Node 22 or newer.

The frontend and Python API share the production domain. `/api/*` routes to `api/index.py`, which exports the existing FastAPI service. Vercel installs the runtime-only root `requirements.txt` with Python 3.13. The full local development lock remains in `services/api/requirements.lock.txt`. Unity caches, frontend assets, notebook files, and development dependencies are excluded from the Python function bundle.

No tokens or IBM credentials are needed. The simulations run on Vercel's CPU, not quantum hardware. First use can incur a Python/Qiskit cold start. Requests remain bounded to six qubits, 64 gates, and 8192 shots.

After deployment, verify the homepage, `GET /api/health`, an H/S request to `/api/simulate`, and a Grover request to `/api/algorithm`. Confirm the Qiskit buttons work from the actual deployed frontend. Use the production domain for sharing; preview links can have Vercel authentication enabled.

Future pushes to the connected GitHub production branch deploy automatically. Native Unity builds remain separate from this web deployment; point Unity's API Base URL to the production HTTPS origin.
