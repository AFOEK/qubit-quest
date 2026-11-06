import map from '../../public/pets/bd-cat/animation-map.json';
import { getLearningProgress } from '../achievements';
export type MascotState =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'excited'
  | 'curious'
  | 'walking'
  | 'sleeping'
  | 'playful'
  | 'celebrating';
export type Reaction = { state: MascotState; message?: string; priority: number; duration: number };
export const animations = map.animations;
export function spriteAnimation(state: MascotState) {
  return animations[
    state === 'happy'
      ? 'wave'
      : state === 'celebrating'
        ? 'excited'
        : state === 'walking'
          ? 'walkLeft'
          : state === 'sleeping'
            ? 'sad'
            : state
  ];
}
export function frameAt(state: MascotState, elapsed: number, reduced = false) {
  const animation = spriteAnimation(state);
  const index =
    state === 'sleeping' ? 3 : reduced ? 0 : Math.floor(elapsed / animation.frameDurationMs);
  return animation.frames[
    animation.loop ? index % animation.frames.length : Math.min(index, animation.frames.length - 1)
  ];
}
export function answerReaction(correct: boolean): Reaction {
  return {
    state: correct ? 'happy' : 'sad',
    message: correct
      ? 'You got it! Curiosity looks good on you.'
      : 'Almost! Let’s try another approach.',
    priority: 2,
    duration: 3200,
  };
}
export function completionReaction(
  beforeIds: string[],
  afterIds: string[],
  lessonId: string,
): Reaction | null {
  if (beforeIds.includes(lessonId) || !afterIds.includes(lessonId)) return null;
  const before = getLearningProgress(beforeIds),
    after = getLearningProgress(afterIds);
  const earned = after.achievements.filter(
    (item) => item.earned && !before.achievements.some((old) => old.id === item.id && old.earned),
  );
  const milestone = after.milestones.some(
    (item) => item.reached && !before.milestones.some((old) => old.id === item.id && old.reached),
  );
  return earned.length || before.tier.id !== after.tier.id || milestone
    ? {
        state: 'celebrating',
        message: earned.length
          ? `Achievement unlocked: ${earned.map((item) => item.title).join(' · ')}!`
          : `Quantum milestone! ${after.xp} XP discovered.`,
        priority: 4,
        duration: 5500,
      }
    : {
        state: 'excited',
        message: 'Lesson complete! One quantum leap forward.',
        priority: 3,
        duration: 4000,
      };
}
export function acceptsReaction(current: Reaction, next: Reaction) {
  return next.priority >= current.priority;
}
export const idleReaction: Reaction = { state: 'idle', priority: 0, duration: 0 };
export type Visibility = 'shown' | 'minimized' | 'hidden';
export const visibilityKey = 'qq.bd-cat.visibility.v1';
export function readVisibility(): Visibility {
  try {
    const value = localStorage.getItem(visibilityKey);
    return value === 'hidden' || value === 'minimized' ? value : 'shown';
  } catch {
    return 'shown';
  }
}
