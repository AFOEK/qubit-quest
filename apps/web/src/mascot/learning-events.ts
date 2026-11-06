import { completionReaction, type Reaction } from './mascot-state';
/** Observe the existing save promise. Never mutate progress or swallow save errors. */
export async function observeLessonSave(
  save: () => Promise<string[]>,
  before: string[],
  lessonId: string,
  emit: (reaction: Reaction) => void,
) {
  const after = await save();
  const reaction = completionReaction(before, after, lessonId);
  if (reaction) emit(reaction);
  return after;
}
