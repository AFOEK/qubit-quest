import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { courses, lessons } from '../curriculum';
import { CatSprite } from './CatSprite';
import { createAnimationController } from './animation-controller';
import { observeLessonSave } from './learning-events';
import {
  animations,
  answerReaction,
  completionReaction,
  frameAt,
  idleReaction,
  readVisibility,
  visibilityKey,
  type MascotState,
} from './mascot-state';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('BD Cat sprite geometry', () => {
  it('keeps every mapped frame within the original sheet', () => {
    for (const animation of Object.values(animations))
      for (const frame of animation.frames) {
        expect(frame.width).toBe(192);
        expect(frame.height).toBe(208);
        expect(frame.x + frame.width).toBeLessThanOrEqual(1536);
        expect(frame.y + frame.height).toBeLessThanOrEqual(1872);
      }
  });
  it('loops idle blinking and clamps one-shot reactions', () => {
    expect(frameAt('idle', 3 * 430)).toEqual(animations.idle.frames[3]);
    expect(frameAt('idle', 6 * 430)).toEqual(animations.idle.frames[0]);
    expect(frameAt('happy', 99999)).toEqual(animations.wave.frames.at(-1));
    expect(frameAt('sleeping', 0)).toEqual(animations.sad.frames[3]);
  });
  it.each([
    'idle',
    'happy',
    'sad',
    'excited',
    'curious',
    'walking',
    'sleeping',
    'playful',
    'celebrating',
  ] as MascotState[])('renders a clipped, proportionate %s frame with reduced motion', (state) => {
    expect(frameAt(state, 0, true)).toEqual(frameAt(state, 9999, true));
    const html = renderToStaticMarkup(<CatSprite state={state} reduced started={0} />);
    expect(html).toContain('viewBox="0 0 192 208"');
    expect(html).toContain('overflow="hidden"');
    expect(html).toContain('/pets/bd-cat/spritesheet.webp');
  });
});
describe('learning event boundaries', () => {
  it('encourages both correct answers and retries without reward events', () => {
    expect(answerReaction(true).state).toBe('happy');
    expect(answerReaction(false).state).toBe('sad');
    expect(answerReaction(false).message).toContain('another approach');
  });
  it.each(['guest', 'account'])('waits for the existing %s save to resolve', async () => {
    let resolve!: (ids: string[]) => void;
    const save = vi.fn(
      () =>
        new Promise<string[]>((done) => {
          resolve = done;
        }),
    );
    const emit = vi.fn();
    const id = lessons[0].id;
    const result = observeLessonSave(save, [], id, emit);
    expect(emit).not.toHaveBeenCalled();
    resolve([id]);
    expect(await result).toEqual([id]);
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ state: 'excited' }));
    expect(save).toHaveBeenCalledTimes(1);
  });
  it('propagates failed saves without celebrating', async () => {
    const emit = vi.fn();
    await expect(
      observeLessonSave(() => Promise.reject(new Error('save failed')), [], lessons[0].id, emit),
    ).rejects.toThrow('save failed');
    expect(emit).not.toHaveBeenCalled();
  });
  it('does not replay completion rewards on review or an unchanged snapshot', () => {
    const id = lessons[0].id;
    expect(completionReaction([id], [id], id)).toBeNull();
    expect(completionReaction([], [], id)).toBeNull();
  });
  it('celebrates the actual earned badge name', () => {
    const ids = courses[0].lessons.map((item) => item.id);
    const reaction = completionReaction(ids.slice(0, -1), ids, ids.at(-1)!);
    expect(reaction?.state).toBe('celebrating');
    expect(reaction?.message).toContain('Back to Basic');
  });
});
describe('reaction scheduling and visibility', () => {
  it('lets achievements interrupt feedback and prevents petting or idle from replacing them', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play(answerReaction(false));
    controller.play({ state: 'celebrating', priority: 4, duration: 5500 });
    expect(controller.play({ state: 'playful', priority: 1, duration: 2800 })).toBe(false);
    vi.advanceTimersByTime(3200);
    expect(notify.mock.lastCall?.[0].state).toBe('celebrating');
    vi.advanceTimersByTime(2300);
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    expect(vi.getTimerCount()).toBe(0);
  });
  it('rapid equal-priority reactions retain only the newest deadline', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    for (let i = 0; i < 30; i++)
      controller.play({ state: 'playful', priority: 1, duration: 2800, message: String(i) });
    expect(vi.getTimerCount()).toBe(1);
    expect(notify.mock.lastCall?.[0].message).toBe('29');
    controller.reset();
    expect(vi.getTimerCount()).toBe(0);
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    controller.play(answerReaction(true));
    controller.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each(['hidden', 'minimized'])(
    'reads %s preferences independently from learning storage',
    (value) => {
      const getItem = vi.fn(() => value);
      vi.stubGlobal('localStorage', { getItem });
      expect(readVisibility()).toBe(value);
      expect(getItem).toHaveBeenCalledWith(visibilityKey);
      expect(getItem).toHaveBeenCalledTimes(1);
    },
  );
  it('tolerates unavailable or malformed browser storage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    expect(readVisibility()).toBe('shown');
    vi.stubGlobal('localStorage', { getItem: () => 'invalid' });
    expect(readVisibility()).toBe('shown');
  });
});
