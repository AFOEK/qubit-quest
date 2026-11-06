import { afterEach, describe, expect, it, vi } from 'vitest';
import { courses, lessons } from '../curriculum';
import { createAnimationController } from './animation-controller';
import { clickInteractions, incorrectMessages } from './mascot-messages';
import { completionReaction, spriteAnimation, type Reaction } from './mascot-state';
import {
  createDialogueSelector,
  courseDialogueTopics,
  detectDialogueTopic,
  dialogueEntries,
  lessonContext,
} from './contextual-dialogue';
import { createLessonPersonality } from './lesson-personality';
import { observeLessonSave } from './learning-events';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe('curriculum context and curated copy', () => {
  it('covers every actual course, with a profile for every lesson', () => {
    expect(Object.keys(courseDialogueTopics).sort()).toEqual(
      courses.map((course) => course.id).sort(),
    );
    for (const lesson of lessons) {
      const context = lessonContext(lesson.id)!;
      expect(context.courseId).toBe(lesson.courseId);
      expect(context.lessonTitle).toBe(lesson.title);
      expect(context.topics).toEqual(lesson.topics);
      expect(context.topic).not.toBe('generic');
      expect(dialogueEntries(context, 'open')).toHaveLength(3);
    }
  });
  it.each([
    ['complex-amplitudes', 'complexNumbers'],
    ['vectors-matrices', 'mathematics'],
    ['hadamard-gate', 'hadamard'],
    ['pauli-gates', 'gates'],
    ['grover-search', 'grover'],
    ['bell-states', 'algorithms'],
    ['born-oppenheimer', 'chemistry'],
    ['openqasm', 'software'],
  ])('uses stable lesson %s and its metadata to select %s', (id, topic) => {
    expect(lessonContext(id)?.topic).toBe(topic);
  });
  it('uses topics to recognize a specialized future lesson without indexing the catalog', () => {
    expect(
      detectDialogueTopic({
        id: 'future-lesson',
        courseId: 'gates-1',
        title: 'A basis lesson',
        topics: ['Hadamard gate'],
      }),
    ).toBe('hadamard');
    expect(
      detectDialogueTopic({
        id: 'unknown',
        courseId: 'future-course',
        title: 'New material',
        topics: [],
      }),
    ).toBe('generic');
    expect(lessonContext('missing-lesson')).toBeNull();
    expect(dialogueEntries(null, 'incorrect')[0].text).toContain('worked example');
  });
  it('varies topic copy without consecutive repeats and retains animation pairing', () => {
    const select = createDialogueSelector();
    const context = lessonContext('hadamard-gate');
    const ids = Array.from({ length: 9 }, () => select(context, 'open')!.id);
    for (let i = 1; i < ids.length; i++) expect(ids[i]).not.toBe(ids[i - 1]);
    expect(new Set(ids).size).toBe(3);
    for (const click of clickInteractions) {
      const entry = select(context, 'click', click.state)!;
      expect(entry.animation).toBe(click.state);
      expect(spriteAnimation(entry.animation).frames.length).toBeGreaterThan(0);
    }
    expect(select(context, 'click', 'happy')!.text).toContain('wave');
    expect(select(context, 'click', 'curious')!.text).toContain('head tilt');
  });
});
function fixture(visible = true) {
  const notify = vi.fn();
  const controller = createAnimationController(notify);
  const play = vi.fn((reaction: Reaction) => controller.play(reaction));
  const clearQuestion = vi.fn(() => controller.clearQuestion());
  const personality = createLessonPersonality({ play, clearQuestion, canSpeak: () => visible });
  return { controller, personality, notify, play, clearQuestion };
}
describe('contextual learning events', () => {
  it('introduces a lesson once, including StrictMode cleanup/setup, without render-driven speech', async () => {
    vi.useFakeTimers();
    const f = fixture();
    const release = f.personality.enter('complex-amplitudes');
    expect(f.play).toHaveBeenCalledTimes(1);
    const text = f.play.mock.calls[0][0].message;
    release();
    const releaseAgain = f.personality.enter('complex-amplitudes');
    await Promise.resolve();
    expect(f.play).toHaveBeenCalledTimes(1);
    expect(f.notify.mock.lastCall?.[0].message).toBe(text);
    releaseAgain();
    await Promise.resolve();
    f.personality.enter('complex-amplitudes');
    expect(f.play).toHaveBeenCalledTimes(1);
    f.controller.dispose();
  });
  it('updates context on rapid navigation and rejects stale lesson feedback', async () => {
    vi.useFakeTimers();
    const f = fixture();
    const oldCleanup = f.personality.enter('complex-amplitudes');
    oldCleanup();
    f.personality.enter('hadamard-gate');
    await Promise.resolve();
    expect(f.personality.answer('complex-amplitudes', false)).toBe(false);
    expect(f.personality.answer('hadamard-gate', false)).toBe(true);
    expect(f.controller.getBaseEmotion()).toBe('sad');
    expect(incorrectMessages).toContain(f.notify.mock.lastCall?.[0].message);
    f.controller.dispose();
  });
  it('keeps sad emotion through repeated incorrect checks and contextual petting, then clears on correct', () => {
    vi.useFakeTimers();
    const f = fixture();
    f.personality.enter('complex-amplitudes');
    f.personality.answer('complex-amplitudes', false);
    expect(incorrectMessages).toContain(f.notify.mock.lastCall?.[0].message);
    vi.advanceTimersByTime(31000);
    expect(f.controller.getBaseEmotion()).toBe('sad');
    f.personality.answer('complex-amplitudes', false);
    const retry = f.notify.mock.lastCall?.[0].message;
    expect(incorrectMessages).toContain(retry);
    f.personality.answer('complex-amplitudes', false);
    expect(incorrectMessages).toContain(f.notify.mock.lastCall?.[0].message);
    const click = f.personality.click({ state: 'curious', priority: 1 });
    expect(click.message).toContain('Complex numbers');
    f.play(click);
    vi.advanceTimersByTime(1530);
    expect(f.notify.mock.lastCall?.[0].state).toBe('sad');
    f.personality.answer('complex-amplitudes', true);
    expect(f.notify.mock.lastCall?.[0].state).toBe('happy');
    vi.advanceTimersByTime(720);
    expect(f.notify.mock.lastCall?.[0].state).toBe('idle');
    expect(vi.getTimerCount()).toBe(1);
    f.controller.dispose();
  });
  it('does not emit an introduction or reopen the pet while minimized', () => {
    vi.useFakeTimers();
    const f = fixture(false);
    f.personality.enter('hadamard-gate');
    expect(f.play).not.toHaveBeenCalled();
    f.personality.answer('hadamard-gate', false);
    expect(f.controller.getBaseEmotion()).toBe('sad');
    f.controller.dispose();
  });
  it('returns to general clicks after a lesson closes and preserves achievement priority', async () => {
    vi.useFakeTimers();
    const f = fixture();
    const cleanup = f.personality.enter('hadamard-gate');
    f.play({ state: 'celebrating', priority: 4, cycles: 7, message: 'Achievement unlocked' });
    const casual = f.personality.click({ state: 'happy', priority: 1 });
    expect(f.play(casual)).toBe(false);
    expect(f.notify.mock.lastCall?.[0].message).toBe('Achievement unlocked');
    cleanup();
    await Promise.resolve();
    const general: Reaction = { state: 'playful', priority: 1, message: 'General playful message' };
    expect(f.personality.click(general)).toBe(general);
    expect(f.notify.mock.lastCall?.[0].state).toBe('celebrating');
    f.controller.dispose();
  });
  it('invalidates deferred context cleanup when the provider is disposed', async () => {
    vi.useFakeTimers();
    const f = fixture();
    const release = f.personality.enter('complex-amplitudes');
    const clears = f.clearQuestion.mock.calls.length;
    release();
    f.personality.reset();
    f.controller.dispose();
    await Promise.resolve();
    expect(f.clearQuestion).toHaveBeenCalledTimes(clears);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('uses the saved lesson title only for new ordinary completions, retaining badge names', async () => {
    const lesson = lessons[0];
    const emit = vi.fn();
    await observeLessonSave(() => Promise.resolve([lesson.id]), [], lesson.id, emit);
    expect(emit.mock.calls[0][0].message).toContain(lesson.title);
    emit.mockClear();
    await expect(
      observeLessonSave(() => Promise.reject(Error('save failed')), [], lesson.id, emit),
    ).rejects.toThrow('save failed');
    expect(emit).not.toHaveBeenCalled();
    await observeLessonSave(() => Promise.resolve([lesson.id]), [lesson.id], lesson.id, emit);
    expect(emit).not.toHaveBeenCalled();
    const courseIds = courses[0].lessons.map((item) => item.id);
    await observeLessonSave(
      () => Promise.resolve(courseIds),
      courseIds.slice(0, -1),
      courseIds.at(-1)!,
      emit,
    );
    expect(emit.mock.calls[0][0]).toEqual(
      completionReaction(courseIds.slice(0, -1), courseIds, courseIds.at(-1)!),
    );
  });
});
