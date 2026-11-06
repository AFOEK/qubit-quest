import {
  frameAt,
  idleReaction,
  spriteAnimation,
  type BaseEmotion,
  type Reaction,
} from './mascot-state';
/** One frame clock. Base emotion survives finite reactions and visibility changes. */
export function createAnimationController(onChange: (reaction: Reaction) => void) {
  let base: BaseEmotion = 'idle';
  let baseMessage: string | undefined;
  let temporary: Reaction | null = null;
  let generation = 0;
  let reduced = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let frame = frameAt('idle', 0);
  const listeners = new Set<() => void>();
  const resting = (): Reaction =>
    base === 'idle' ? idleReaction : { state: 'sad', priority: 0, message: baseMessage };
  function publishFrame(next: typeof frame) {
    if (next === frame) return;
    frame = next;
    listeners.forEach((listener) => listener());
  }
  function start() {
    clearInterval(timer);
    const token = ++generation;
    const reaction = temporary ?? resting();
    const animation = spriteAnimation(reaction.state);
    const finite = temporary !== null && reaction.state !== 'sleeping';
    const count = animation.frames.length * (reaction.cycles ?? 1);
    let index = 0;
    publishFrame(frameAt(reaction.state, 0, reduced));
    onChange(reaction);
    if (reaction.state === 'sleeping' || (reduced && !finite)) return;
    timer = setInterval(() => {
      if (token !== generation) return;
      index++;
      if (finite && index >= count) {
        temporary = null;
        start();
        return;
      }
      publishFrame(
        reduced ? animation.frames[0] : animation.frames[index % animation.frames.length],
      );
    }, animation.frameDurationMs);
  }
  function clearQuestion() {
    base = 'idle';
    baseMessage = undefined;
    if (!temporary || temporary.priority <= 2) {
      temporary = null;
      start();
    }
  }
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getFrame: () => frame,
    getBaseEmotion: () => base,
    reset() {
      base = 'idle';
      baseMessage = undefined;
      temporary = null;
      start();
    },
    clearQuestion,
    rest() {
      temporary = null;
      start();
    },
    setReduced(value: boolean) {
      if (value !== reduced) {
        reduced = value;
        start();
      }
    },
    dispose() {
      generation++;
      clearInterval(timer);
    },
    play(next: Reaction) {
      // Validated feedback updates the resting emotion even during a larger celebration.
      if (next.baseEmotion) {
        base = next.baseEmotion;
        baseMessage = base === 'sad' ? next.message : undefined;
      }
      if (
        temporary &&
        (next.priority < temporary.priority ||
          (next.priority <= 1 && next.priority === temporary.priority))
      )
        return false;
      if (next.priority === 0 && base === 'sad') return false;
      if (next.baseEmotion === 'sad') {
        temporary = null;
        start();
        return true;
      }
      temporary = next;
      start();
      return true;
    },
  };
}
export type SpriteSource = Pick<
  ReturnType<typeof createAnimationController>,
  'subscribe' | 'getFrame'
>;
