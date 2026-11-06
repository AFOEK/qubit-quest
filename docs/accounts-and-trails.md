# Accounts, learning trails, and daily quizzes

Guests can learn without registering. Their lesson IDs, selected goal, and daily answers remain in browser storage. Registering or signing in opens a separate account history; the form offers an explicit import of guest lesson completions. Importing is additive and deduplicated. Existing completions qualify for badges immediately, including lessons completed before prerequisites were enforced. Signing out returns to the browser's guest history. Account records never get copied into guest storage.

Sign-in is optional for every learning trail, lesson, achievement, and daily quiz. The account dialog has a **Continue as guest** button, and the same option is available while checking a saved session, after it expires, or when account sync is unavailable. Choosing guest mode restores this browser's guest history without altering account records. The choice lasts for this tab, including reloads; signing in returns to account progress. Guest mode leaves an existing server session available; **Sign out** invalidates that session.

## Storage and sessions

The local API creates `data/learning.sqlite3` on the first account database operation. The directory and SQLite files are excluded from Git and Vercel bundles. Restarting the API retains accounts. To use another SQLite location, export an absolute `DATABASE_URL`, such as `sqlite:////absolute/path/learning.sqlite3` on macOS/Linux or `sqlite:///C:/Users/you/Documents/learning.sqlite3` on Windows. The parent directory of a custom path must already exist; the default `data/` directory is created automatically.

Production uses PostgreSQL through SQLAlchemy and psycopg. Set `DATABASE_URL` in the Vercel project settings to your database provider's connection string, including its SSL options. Both `postgres://` and `postgresql://` schemes are supported. A provider's pooled endpoint is suitable for serverless execution; the application itself uses no persistent connection pool. Tables are created on first database use. The configured database role needs initial table/index creation privileges. This initial schema uses `create_all`; future schema changes need explicit migrations. Back up the PostgreSQL database through your provider.

Vercel never falls back to SQLite when `DATABASE_URL` is absent. Registration returns a helpful unavailable message while guest learning and simulations still work. For other HTTPS hosts, set `COOKIE_SECURE=true` and use a durable PostgreSQL URL. Keep the frontend and API on the same origin through a reverse proxy: the web client uses relative `/api` URLs and same-origin credentials. `ALLOWED_ORIGINS` is a comma-separated list of trusted frontend origins; it must not be a wildcard when cookies are used. The default development entries are `http://127.0.0.1:5173` and `http://localhost:5173`.

The API reads process environment variables; it does not automatically load a root `.env` file. For example, to permit a frontend on port 5190, set `$env:ALLOWED_ORIGINS='http://127.0.0.1:5190'` in PowerShell or `export ALLOWED_ORIGINS='http://127.0.0.1:5190'` in a POSIX shell before starting the API. `.env.example` lists the available settings. Never commit database credentials.

Passwords use salted scrypt hashes. Registration accepts a display name of 1–60 characters and a password of 8–128 characters; email addresses are trimmed and normalized to lowercase. Sessions last 30 days, use random opaque tokens, and store only token hashes. Cookies are HttpOnly, SameSite=Lax, and Secure by default on Vercel; secure cookies use the `__Host-` prefix. Leave `COOKIE_SECURE=false` for HTTP local development and use `true` for HTTPS production. Each authenticated mutation also requires the session's `X-CSRF-Token`. Sign-out invalidates that session. Login and registration have database-backed attempt limits. Recovery emails and email verification require an email provider and are not implemented.

Account lesson completion sends the selected quiz answer. The API checks the answer and course prerequisites before saving. Unique database keys make completions and daily answers idempotent. XP, badges, and tiers remain derived from saved unique lessons, so a failed account save does not award provisional rewards. The lesson remains open with a retry message. A returning session loads its saved history; focusing the tab refreshes it for changes from another device. Expired sessions require sign-in for further account saves, with guest learning always available as an alternative.

## Goal-based trails

All trails include their complete prerequisite chain. The shared foundation is mathematics → quantum mechanics → qubits → Gates I–II → Software and Compilation → Algorithms I–II. Catalog order places prerequisite courses first. Courses can be opened for inspection while locked; new lessons require all lessons of each prerequisite course. Completed lessons are always reviewable.

| Goal                         | Required specialization after its foundations   | Optional branches                                                   |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Quantum foundations          | Noise/QEC → Error Mitigation                    | Algorithm III                                                       |
| Quantum machine learning     | Noise/QEC → Machine Learning I–III              | Applied Optimization, Algorithm III, Error Mitigation, Boundaries I |
| Quantum chemistry            | Noise/QEC → Algorithm III → Chemistry I–III     | Applied Optimization, Error Mitigation, Boundaries I–II             |
| Quantum optimization         | Applied Optimization; Noise/QEC → Algorithm III | Error Mitigation, Boundaries I                                      |
| Quantum cryptography         | Cryptography I–II; Noise/QEC                    | Error Mitigation, Algorithm III                                     |
| Quantum hardware             | Noise/QEC → Hardware I–IV                       | Error Mitigation, Algorithm III, Boundaries I                       |
| Classical–quantum simulation | Noise/QEC → Algorithm III → Boundaries I–III    | Chemistry I, Applied Optimization, Hardware I–IV                    |

Optional branches include any additional prerequisites they need, and never contribute to the required-trail completion target. Choosing another goal reuses completed lessons. Browsing all courses changes the displayed catalog without changing the saved goal. The global achievements collection and 2,975 XP milestone still cover all 27 courses / 119 lessons.

| Goal                         | Required courses | Required lessons |
| ---------------------------- | ---------------- | ---------------- |
| Quantum foundations          | 10               | 56               |
| Quantum machine learning     | 12               | 60               |
| Quantum chemistry            | 13               | 66               |
| Quantum optimization         | 11               | 58               |
| Quantum cryptography         | 11               | 61               |
| Quantum hardware             | 13               | 65               |
| Classical–quantum simulation | 13               | 67               |

These totals include the prerequisite foundations. Applied Optimization remains optional for QML; completing its 12 required courses finishes that goal even when electives are unfinished.

Trail definitions live in `apps/web/src/learning-paths.ts`. The prerequisite closure is computed from curriculum metadata. Run `npm run learning:sync` after editing paths, prerequisites, lesson IDs, or correct answers; this updates the API's shared manifest. Tests and production builds reject drift.

## Daily quantum facts

Each Toronto calendar day selects three deterministic questions from a shared bank. The quiz explains each answer and records the first choice only. Answering all three counts as participation regardless of score. Streaks continue across consecutive completed days; yesterday's streak remains visible while today's quiz is incomplete. A missed full day breaks the active streak. Questions reset at midnight in `America/Toronto`, including daylight-saving changes.

Guest daily answers stay in the browser. Sign in before answering to retain daily history across devices; the guest import currently covers lesson completions. Daily quizzes do not grant course XP or course badges.

## API

| Method | Route                    | Behavior                                                               |
| ------ | ------------------------ | ---------------------------------------------------------------------- |
| POST   | `/api/account/register`  | `{name,email,password,path_id?,import_ids?}`; creates session          |
| POST   | `/api/account/login`     | `{email,password,import_ids?}`; creates session                        |
| GET    | `/api/account/session`   | Current user, CSRF token, and progress; 401 for guests                 |
| POST   | `/api/account/logout`    | Invalidates current session and clears cookie                          |
| GET    | `/api/progress`          | Account's completed IDs, selected path, daily answers, and streak      |
| POST   | `/api/progress/lesson`   | `{lesson_id,answer}`; validates prerequisites and answer               |
| POST   | `/api/progress/import`   | `{completed_ids}`; additive import of known historical IDs             |
| POST   | `/api/progress/path`     | `{path_id}`; saves learning goal                                       |
| GET    | `/api/daily-quiz`        | Current Toronto day and three public questions                         |
| POST   | `/api/daily-quiz/answer` | `{day,question_id,answer}`; saves first answer and returns explanation |

All progress routes and daily answer writes require a session. Authenticated POSTs require `X-CSRF-Token`; register and login instead check the request origin. Errors use a readable `detail` and status 401 (sign in), 403 (CSRF/origin), 409 (prerequisite/day conflict or duplicate registration), 422 (invalid input), 429 (attempt limit), or 503 (storage unavailable).

Registration, login, and the session endpoint return `{user, csrfToken, progress}`. `user` contains `id`, `name`, and `email`. `progress` contains `completedIds`, `pathId`, `dailyAnswers`, `completedDays`, and `streak`. The progress POSTs return the updated progress object; the daily-answer POST returns `{correct, explanation, progress}`. `correct` is the correct choice index; each stored daily answer also includes a boolean `correct` indicating whether the learner's first answer was right. Choice indices are zero-based.

## Verification

Run `.venv/bin/python -m pytest services/api -q` on macOS/Linux, or `.\.venv\Scripts\python.exe -m pytest services/api -q` in PowerShell, from the repository root. Local tests exercise the SQLite account API. When `QQ_TEST_POSTGRES_URL` points to a dedicated test database, the same account tests also run against PostgreSQL using a fresh schema per test. CI is configured with a PostgreSQL 16 service to run both database variants. The test role needs schema creation privileges.

Frontend tests cover prerequisite closures, QML's required/elective split, legacy review access, shared-manifest parity, Toronto midnight boundaries, deterministic daily questions, first-answer deduplication, and participation streaks. Browser verification covers account registration/import, separate-device sign-in, failed-save retries, daily answers, expiry, guest fallback, achievements, and mobile layouts.
