import type { Reaction } from './mascot-state';

export type SpeechKind =
  'achievement' | 'completion' | 'correct' | 'incorrect' | 'educational' | 'playful';
export type SpeechOptions = { kind: SpeechKind; context?: string };
export type Speech = SpeechOptions & { id: number; text: string; expiresAt: number | null };
export const speechPolicies = {
  achievement: { priority: 4, duration: 10000 },
  completion: { priority: 4, duration: 8000 },
  correct: { priority: 3, duration: 6000 },
  incorrect: { priority: 3, duration: null },
  educational: { priority: 2, duration: null },
  playful: { priority: 1, duration: 5000 },
} as const;

export function speechForReaction(reaction: Reaction): (SpeechOptions & { text: string }) | null {
  if (!reaction.message) return null;
  const kind =
    reaction.dialogue?.kind ??
    (reaction.priority >= 4
      ? 'achievement'
      : reaction.priority >= 3
        ? 'completion'
        : reaction.priority >= 2
          ? reaction.baseEmotion === 'sad'
            ? 'incorrect'
            : 'correct'
          : reaction.priority >= 1
            ? 'playful'
            : 'educational');
  return { ...reaction.dialogue, kind, text: reaction.message };
}

/** Speech owns one deadline, independently of the sprite frame clock. Replaced speech is discarded. */
export function createSpeechController(onChange: (speech: Speech | null) => void, now = Date.now) {
  let current: Speech | null = null;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let welcomeActive = false;
  function dismiss(id?: number) {
    if (id !== undefined && current?.id !== id) return;
    generation++;
    clearTimeout(timer);
    current = null;
    onChange(null);
  }
  function prune() {
    if (current && current.expiresAt !== null && current.expiresAt <= now()) dismiss(current.id);
  }
  return {
    getSpeech: () => current,
    dismiss,
    prune,
    setWelcomeActive(active: boolean) {
      if (active && !welcomeActive) dismiss();
      welcomeActive = active;
    },
    clearQuestion() {
      if (current && speechPolicies[current.kind].priority < 4) dismiss(current.id);
    },
    show(next: SpeechOptions & { text: string }, { incorrectActive = false } = {}) {
      prune();
      if (
        welcomeActive ||
        (incorrectActive && (next.kind === 'educational' || next.kind === 'playful')) ||
        (current && speechPolicies[current.kind].priority > speechPolicies[next.kind].priority)
      )
        return false;
      clearTimeout(timer);
      const token = ++generation;
      const duration = speechPolicies[next.kind].duration;
      current = { ...next, id: token, expiresAt: duration === null ? null : now() + duration };
      onChange(current);
      if (duration !== null)
        timer = setTimeout(() => {
          if (token === generation) dismiss(token);
        }, duration);
      return true;
    },
    dispose() {
      generation++;
      clearTimeout(timer);
      welcomeActive = false;
    },
  };
}
