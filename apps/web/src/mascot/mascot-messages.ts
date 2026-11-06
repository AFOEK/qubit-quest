import type { MascotState, Reaction } from './mascot-state';

export const clickInteractions: readonly { state: MascotState; message: string }[] = [
  { state: 'happy', message: 'Wavefunction? I can wave!' },
  { state: 'idle', message: 'Blink and you’ll miss my next quantum thought.' },
  { state: 'curious', message: 'You observed me! What are you measuring?' },
  { state: 'lookAround', message: 'Any observers out there? Let me look around.' },
  { state: 'walking', message: 'A small step for a cat. A quantum leap for curiosity.' },
  { state: 'playful', message: 'Prrr… positively entangled.' },
];

/** Consume a shuffled pair only when playback accepts it; busy clicks cannot skip ahead. */
export function createClickInteractionPicker(random = Math.random) {
  let remaining: (typeof clickInteractions)[number][] = [];
  let previous: MascotState | undefined;
  return (play: (reaction: Reaction) => boolean) => {
    if (!remaining.length) {
      remaining = [...clickInteractions];
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      if (remaining.at(-1)?.state === previous) {
        [remaining[0], remaining[remaining.length - 1]] = [
          remaining[remaining.length - 1],
          remaining[0],
        ];
      }
    }
    const interaction = remaining[remaining.length - 1];
    if (!play({ ...interaction, priority: 1 })) return false;
    remaining.pop();
    previous = interaction.state;
    return true;
  };
}
