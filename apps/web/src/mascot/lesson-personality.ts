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
  let wrongAttempts = 0;
  let generation = 0;
  return {
    enter(lessonId: string) {
      const token = ++generation;
      if (active !== lessonId) {
        active = lessonId;
        wrongAttempts = 0;
        clearQuestion();
      }
      if (!introduced.has(lessonId)) {
        introduced.add(lessonId);
        const line = select(lessonContext(lessonId), 'open');
        if (canSpeak() && line) play({ state: line.animation, message: line.text, priority: 0.25 });
      }
      // StrictMode's cleanup/setup rehearsal must not cancel or repeat the first introduction.
      return () =>
        queueMicrotask(() => {
          if (token !== generation) return;
          active = null;
          wrongAttempts = 0;
          clearQuestion();
        });
    },
    answer(lessonId: string, correct: boolean) {
      if (active !== lessonId) return false;
      wrongAttempts = correct ? 0 : wrongAttempts + 1;
      const line = select(
        lessonContext(lessonId),
        correct ? 'correct' : wrongAttempts > 1 ? 'retry' : 'incorrect',
      );
      return play({ ...answerReaction(correct), ...(line ? { message: line.text } : {}) });
    },
    click(reaction: Reaction): Reaction {
      if (!active) return reaction;
      const line = select(lessonContext(active), 'click', reaction.state);
      return line ? { ...reaction, message: line.text } : reaction;
    },
    reset() {
      generation++;
      active = null;
      wrongAttempts = 0;
    },
  };
}
