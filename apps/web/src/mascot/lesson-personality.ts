import { answerReaction, type Reaction } from './mascot-state';
import { createDialogueSelector, lessonContext } from './contextual-dialogue';

/** Only presentation bookkeeping: no answer validation, progress, or reward ownership. */
export function createLessonPersonality({
  play,
  clearQuestion,
  canSpeak,
}: {
  play: (reaction: Reaction) => boolean;
  clearQuestion: () => void;
  canSpeak: () => boolean;
}) {
  const select = createDialogueSelector();
  const introduced = new Set<string>();
  let active: string | null = null;
  let generation = 0;
  return {
    enter(lessonId: string) {
      const token = ++generation;
      if (active !== lessonId) {
        active = lessonId;
        clearQuestion();
      }
      if (!introduced.has(lessonId)) {
        introduced.add(lessonId);
        const line = select(lessonContext(lessonId), 'open');
        if (canSpeak() && line)
          play({
            state: line.animation,
            message: line.text,
            priority: 0.25,
            dialogue: { kind: 'educational', context: lessonId },
          });
      }
      // StrictMode's cleanup/setup rehearsal must not cancel or repeat the first introduction.
      return () =>
        queueMicrotask(() => {
          if (token !== generation) return;
          active = null;
          clearQuestion();
        });
    },
    answer(lessonId: string, correct: boolean) {
      if (active !== lessonId) return false;
      const line = correct ? select(lessonContext(lessonId), 'correct') : undefined;
      return play({
        ...answerReaction(correct),
        ...(line ? { message: line.text } : {}),
        dialogue: { kind: correct ? 'correct' : 'incorrect', context: lessonId },
      });
    },
    click(reaction: Reaction): Reaction {
      if (!active) return reaction;
      const line = select(lessonContext(active), 'click', reaction.state);
      return line
        ? { ...reaction, message: line.text, dialogue: { kind: 'educational', context: active } }
        : reaction;
    },
    reset() {
      generation++;
      active = null;
    },
  };
}
