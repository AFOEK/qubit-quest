import { acceptsReaction, idleReaction, type Reaction } from './mascot-state';
/** One deadline, no queued reactions: newer events replace equal or lower priorities. */
export function createAnimationController(onChange: (reaction: Reaction) => void) {
  let current = idleReaction;
  let timer: ReturnType<typeof setTimeout> | undefined;
  function reset() {
    clearTimeout(timer);
    current = idleReaction;
    onChange(current);
  }
  return {
    reset,
    dispose() {
      clearTimeout(timer);
    },
    play(next: Reaction) {
      if (!acceptsReaction(current, next)) return false;
      clearTimeout(timer);
      current = next;
      onChange(next);
      if (next.duration) timer = setTimeout(reset, next.duration);
      return true;
    },
  };
}
