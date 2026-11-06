# Qubi companion

Qubi uses the original assets in `apps/web/public/pets/bd-cat/`. `CatSprite.tsx` reads the explicit rectangles in `animation-map.json` and clips the sheet with an SVG viewport, preserving its 192 × 208 frame proportions and transparency. It does not recolor the artwork. `pet.json` remains the asset metadata.

The companion occupies the sidebar's former motivational-card space on desktop. Mobile uses reserved document space; lesson reactions live inside the lesson dialog. This avoids floating over answers, navigation, or reward notices. The account and immersive overlays hide the companion. Only the appropriate desktop or mobile sprite is mounted.

## Modules

- `mascot-state.ts`: typed reactions, sprite selection, read-only reward comparisons, and visibility storage parsing.
- `animation-controller.ts`: one shared sprite frame clock, priority-based interruption, persistent idle/sad base emotion, and sequence-completion transitions. Repeated clicks cannot restart a running click sequence; stale interval callbacks are generation-guarded.
- `MascotProvider.tsx`: shared transient state, randomized ambient scheduling, inactivity/wake handling, media preferences, and account-change resets.
- `CatSprite.tsx`: subscribes to the shared frame clock and renders the original mapped frames. It owns no intervals, so hiding/restoring the sprite cannot restart a reaction. The avatar uses a static first-idle-frame face crop.
- `QuantumMascot.tsx`: keyboard-accessible petting, minimize/restore controls, focus restoration, and live messages. Both minimize controls collapse to a 52px floating face avatar; only this avatar floats, while full-size placement stays unchanged.
- `mascot-messages.ts` and `MascotEffects.tsx`: local personality copy and decorative effects. There is no audio or external conversation service.
- `learning-events.ts`: observes the existing lesson save promise and emits a reaction only after it resolves with a new completion.

Happy uses the wave row; celebrating uses excited poses and particles; walking uses left-facing walking poses and a small horizontal translation. Sleeping holds frame 3 of the sad row, which depicts a closed-eye resting pose, with a sleep indicator. These are visual interpretations of the supplied poses, not new sprite artwork. The other states use their corresponding mapped rows.

## Event boundaries

`LessonDialog.tsx` dispatches answer feedback only when the learner checks an answer. `main.tsx` observes the existing `completeLesson` call, then derives new badges, tiers, and milestones from the same progress selectors used by the reward UI. Reviews never produce a completion reaction. Failed saves propagate to the original error UI and produce no completion or failure reaction.

`DailyQuizView.tsx` waits for a successful submission, then looks up the accepted answer in learner state. It never awards course XP or changes daily scoring. Guest and account persistence, prerequisite rules, achievement selectors, and backend APIs are unchanged.

Priorities are ambient (0), petting (1), answer feedback (2), completion (3), and achievement/milestone (4). Temporary reactions return to the active idle/sad base after all mapped frames finish. Clicks play one full playful sequence; happy feedback plays one wave sequence. Completion and achievement effects retain multiple whole-sequence celebration cycles. Wrong checked answers set sadness without a deadline. Selection alone does not clear it; correct checked answers and question/lesson transitions do. Petting while sad returns to sadness. Idle variations run at randomized 15–35 second intervals without speech. After two minutes without pointer/keyboard activity or a learning event, the cat rests until activity resumes. Hidden tabs clear temporary feedback while preserving base emotion; no reactions are replayed later. Minimizing/restoring preserves base emotion and does not restart playback. Legacy hidden preferences now show the circular avatar. Visibility preferences use only `qq.bd-cat.visibility.v1`, with in-memory fallback if storage is blocked.

## Verification

Run `npm test`, `npm run build`, and `npm run format:check`. Mascot tests cover frame geometry and clipping, reduced-motion frames, answer feedback, successful guest/account save promises, rejected saves, reviews, badge names, priority interruption, rapid interactions, timer cleanup, persistent sadness, natural sequence completion, rapid-click suppression, face cropping, and visibility parsing.

Browser verification should cover desktop and narrow mobile layouts, keyboard controls/focus, reduced motion, petting, persisted hide/restore, real lesson retries and reviews, daily answer feedback, and achievement announcements. Account transport may be mocked for UI verification; this does not replace end-to-end verification against an authenticated backend.

Reduced motion keeps the artwork static while finite reactions still complete after their mapped frame durations. No sprite assets, animation-map frame definitions, progress rules, or backend APIs are changed.
