# Achievements and learning milestones

Each course awards its named badge when every lesson in that course is complete. Partial progress appears on the badge card and in the learning trail. The Achievements page supports search and earned/in-progress/not-started filters, and opens the next unfinished lesson or a completed course for review. Existing saved completions qualify automatically.

## Journey tiers

| Tier     | Completed courses required |
| -------- | -------------------------- |
| Explorer | 0                          |
| Bronze   | 1                          |
| Silver   | 9                          |
| Gold     | 18                         |
| Platinum | 27                         |

These are collection-wide tiers. A course badge requires all of that course’s lessons. The course thresholds are fixed so adding courses does not increase existing tier requirements.

## Course badges

| Course                           | Achievement              | Lessons to complete |
| -------------------------------- | ------------------------ | ------------------- |
| Mathematical foundations         | Back to Basic            | 5                   |
| Quantum Mechanics Theories       | The is Cat still Alive?! | 5                   |
| Qubits Theories                  | Fancy Spheres            | 4                   |
| Gates I                          | Gated Community I        | 5                   |
| Gates II                         | Gated Community II       | 4                   |
| Software and Compilation         | Assembled? or Assembly?  | 4                   |
| Algorithm I                      | IF x == y? I             | 9                   |
| Algorithm II                     | IF x == y? II            | 9                   |
| Noises and Error Correction      | Please keep quite!       | 6                   |
| Error Mitigation                 | Mitigate the discord     | 5                   |
| Hardware I                       | Hard like metal I        | 3                   |
| Hardware II                      | Hard like metal II       | 4                   |
| Hardware III                     | Hard like metal III      | 4                   |
| Hardware IV                      | Hard like metal IV       | 3                   |
| Applied Optimization             | Optimizer beam!          | 3                   |
| Algorithm III                    | IF x == y? III           | 4                   |
| Classical–Quantum Boundaries I   | Tensor X Matrix I        | 5                   |
| Classical–Quantum Boundaries II  | Tensor X Matrix II       | 4                   |
| Classical–Quantum Boundaries III | Tensor X Matrix III      | 3                   |
| Cryptography I                   | Shhh... it's a secret I  | 6                   |
| Cryptography II                  | Shhh... it's a secret II | 4                   |
| Chemistry I                      | Fancy molecules I        | 6                   |
| Chemistry II                     | Fancy molecules II       | 3                   |
| Chemistry III                    | Fancy molecules III      | 2                   |
| Machine Learning I               | It's learning! I         | 3                   |
| Machine Learning II              | It's learning! II        | 2                   |
| Machine Learning III             | It's learning! III       | 4                   |

Algorithm III uses “IF x == y? III”.

## XP checkpoints

A unique completed lesson earns 25 XP. Course badges and tiers do not award extra XP. Repeating a completed lesson cannot add XP or duplicate a reward.

| Checkpoint            | Lessons complete |
| --------------------- | ---------------- |
| 50 XP                 | 2                |
| 125 XP                | 5                |
| 250 XP                | 10               |
| 500 XP                | 20               |
| 1,000 XP              | 40               |
| 1,500 XP              | 60               |
| 2,000 XP              | 80               |
| 2,500 XP              | 100              |
| 2,975 XP (full trail) | 119              |

The learning spark displays actual accumulated XP against the next unreached checkpoint. At 50 XP it advances to a 125 XP goal; at 125 XP it advances to 250 XP. Completing all 119 lessons shows 2,975 / 2,975 XP and “Trail complete”. The final checkpoint follows the current curriculum size. These are cumulative learning milestones rather than daily goals.

## Saving and announcements

Badges, tiers, and milestones are derived from validated unique lesson IDs from account progress, or qq.progress.v2 for a guest. No second reward ledger is needed. The existing migration from qq.progress.v1 still applies. Reloading recomputes earned rewards without replaying unlock announcements. A new completion can show a dismissible badge/tier or milestone notice; a review shows no new notice. If guest browser saving fails, rewards remain available for the current session with a notice. An account save must succeed before XP or rewards are shown; a failed request leaves the lesson open for retry. Daily fun-fact quizzes build a separate participation streak and do not grant course XP.

## Validation

The reward tests cover all course completion boundaries, duplicate/stale IDs, old progress, tier thresholds, exact XP milestone boundaries, complete progress, and announcements. Browser checks exercise unlocks, reviews, reloads, filters/search, course navigation, session-only saving, and mobile layouts.
