import { completionReaction, type Reaction } from './mascot-state';
import { dialogueEntries, lessonContext } from './contextual-dialogue';
/** Observe the existing save promise. Never mutate progress or swallow save errors. */
export async function observeLessonSave(
  save: () => Promise<string[]>,
  before: string[],
  lessonId: string,
  emit: (reaction: Reaction) => void,
) {
  const after = await save();
  const reaction = completionReaction(before, after, lessonId);
  if (reaction) {
    const context = lessonContext(lessonId);
    const line =
      context && reaction.state === 'excited' ? dialogueEntries(context, 'complete')[0] : null;
    emit(line ? { ...reaction, message: line.text } : reaction);
  }
  return after;
}
