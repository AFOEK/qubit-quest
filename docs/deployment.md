# Deploy to Vercel

Import **`AFOEK/qubit-quest`** into Vercel with `main` as the production branch and the repository root as the project root. Keep the Vite preset. The tracked `vercel.json` defines `npm ci`, `npm run build`, and the `dist` output. Choose Node.js 22.x (22.12 or later) or 24.x. A Vercel project connected to another fork will not receive pushes made only to this repository.

The frontend and Python API share the production domain. `/api/*` routes to `api/index.py`, which exports the existing FastAPI service. The root `.python-version` selects Python 3.13, and Vercel installs the runtime-only root `requirements.txt`. The full local development lock remains in `services/api/requirements.lock.txt`. Unity caches, frontend assets, notebook files, and development dependencies are excluded from the Python function bundle. Keep `shared/learning-manifest.json` and `shared/quiz-bank.json` in the function bundle: the API reads them at startup.

No tokens or IBM credentials are needed. The simulations run on Vercel's CPU, not quantum hardware. First use can incur a Python/Qiskit cold start. Requests remain bounded to six qubits, 64 gates, and 8192 shots.

For registration and cross-device progress, provision PostgreSQL and set `DATABASE_URL` in Vercel's environment variables before deploying. Use your provider's connection string and SSL parameters, such as `postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require`. Apply it to each environment that needs accounts, then redeploy. Keep preview databases separate from production data. Secure session cookies are enabled automatically on Vercel; other HTTPS hosts must set `COOKIE_SECURE=true`. The frontend and API should share their origin. No database credentials belong in Git or client-side Vite variables.

The API creates its initial tables when a database is first used. Without a configured PostgreSQL URL on Vercel, guest learning remains available and account requests report that saving is unavailable. Local SQLite files are excluded from the function bundle; they are never used as temporary production storage. See [accounts and trails](accounts-and-trails.md).

After deployment, verify the homepage, `GET /api/health`, an H/S request to `/api/simulate`, and a Grover request to `/api/algorithm`. Confirm the Qiskit buttons work from the actual deployed frontend. Use the production domain for sharing; preview links can have Vercel authentication enabled.

Also register a test account, finish a lesson, change its learning goal, and answer a daily question. Sign in from a separate browser/device and verify those records load. Confirm the session cookie has HttpOnly, Secure, SameSite=Lax, and the `__Host-` prefix, then sign out and verify the session is invalidated.

Future pushes to the connected GitHub production branch deploy automatically. Native Unity builds remain separate from this web deployment; point Unity's API Base URL to the production HTTPS origin.

`npm run preview` serves the built frontend locally and still needs the separately running Python API. Vite's preview server inherits the configured `/api` proxy; it does not execute `api/index.py` itself. Its default origin is `http://127.0.0.1:4173`, so include the actual preview origin in the API's `ALLOWED_ORIGINS` before testing accounts. WebXR headset entry also needs a compatible browser and a secure context, normally HTTPS; a plain HTTP LAN address is insufficient for headset mode.
