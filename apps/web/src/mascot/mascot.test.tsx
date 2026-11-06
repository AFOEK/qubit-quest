import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { courses, lessons } from '../curriculum';
import { CatSprite } from './CatSprite';
import { createAnimationController } from './animation-controller';
import { observeLessonSave } from './learning-events';
import { clickInteractions, createClickInteractionPicker } from './mascot-messages';
import {
  animations,
  answerReaction,
  completionReaction,
  frameAt,
  spriteAnimation,
  idleReaction,
  readVisibility,
  visibilityKey,
  type MascotState,
} from './mascot-state';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe('Qubi sprite geometry', () => {
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
    const html = renderToStaticMarkup(<CatSprite state={state} />);
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
describe('sequence completion and persistent emotion', () => {
  it('plays every playful frame once, then returns to idle at the sequence boundary', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play({ state: 'playful', priority: 1 });
    const animation = animations.playful;
    for (let i = 0; i < animation.frames.length; i++) {
      expect(controller.getFrame()).toEqual(animation.frames[i]);
      expect(notify.mock.lastCall?.[0].state).toBe('playful');
      vi.advanceTimersByTime(animation.frameDurationMs);
    }
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    expect(controller.getFrame()).toEqual(animations.idle.frames[0]);
    controller.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('ignores rapid clicks without truncating or restarting the sequence', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play({ state: 'playful', priority: 1 });
    vi.advanceTimersByTime(300);
    for (let i = 0; i < 30; i++)
      expect(controller.play({ state: 'playful', priority: 1 })).toBe(false);
    expect(controller.getFrame()).toEqual(animations.playful.frames[2]);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(600);
    expect(notify.mock.lastCall?.[0].state).toBe('idle');
    expect(controller.play({ state: 'playful', priority: 1 })).toBe(true);
    controller.dispose();
  });
  it('keeps sadness for 30 seconds, across repeat wrong checks and temporary petting', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play(answerReaction(false));
    vi.advanceTimersByTime(31000);
    expect(controller.getBaseEmotion()).toBe('sad');
    expect(notify.mock.lastCall?.[0].state).toBe('sad');
    expect(controller.play({ state: 'curious', priority: 0 })).toBe(false);
    controller.play(answerReaction(false));
    controller.play({ state: 'playful', priority: 1 });
    vi.advanceTimersByTime(900);
    expect(notify.mock.lastCall?.[0].state).toBe('sad');
    controller.rest();
    expect(controller.getBaseEmotion()).toBe('sad');
    controller.dispose();
  });
  it('clears sadness on correct feedback and returns to idle after the full wave', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play(answerReaction(false));
    controller.play(answerReaction(true));
    expect(controller.getBaseEmotion()).toBe('idle');
    vi.advanceTimersByTime(719);
    expect(notify.mock.lastCall?.[0].state).toBe('happy');
    vi.advanceTimersByTime(1);
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    controller.dispose();
  });
  it('question changes clear sadness without cancelling an important completion celebration', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play(answerReaction(false));
    controller.clearQuestion();
    expect(controller.getBaseEmotion()).toBe('idle');
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    controller.play({ state: 'excited', priority: 3, cycles: 5 });
    controller.clearQuestion();
    vi.advanceTimersByTime(3999);
    expect(notify.mock.lastCall?.[0].state).toBe('excited');
    vi.advanceTimersByTime(1);
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    controller.dispose();
  });
  it('stale frames cannot end a higher-priority celebration', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.play({ state: 'playful', priority: 1 });
    vi.advanceTimersByTime(300);
    controller.play({ state: 'celebrating', priority: 4, cycles: 7 });
    expect(controller.play(answerReaction(false))).toBe(false);
    expect(controller.play({ state: 'playful', priority: 1 })).toBe(false);
    vi.advanceTimersByTime(900);
    expect(notify.mock.lastCall?.[0].state).toBe('celebrating');
    vi.advanceTimersByTime(4700);
    expect(notify.mock.lastCall?.[0].state).toBe('sad');
    controller.dispose();
  });
  it('reduced motion is static but finite reactions still complete from their frame count', () => {
    vi.useFakeTimers();
    const notify = vi.fn();
    const controller = createAnimationController(notify);
    controller.setReduced(true);
    controller.play({ state: 'playful', priority: 1 });
    vi.advanceTimersByTime(750);
    expect(controller.getFrame()).toEqual(animations.playful.frames[0]);
    vi.advanceTimersByTime(150);
    expect(notify.mock.lastCall?.[0]).toEqual(idleReaction);
    expect(vi.getTimerCount()).toBe(0);
    controller.dispose();
  });
  it('unsubscribes frame observers and disposes the only playback timer', () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    const controller = createAnimationController(vi.fn());
    const unsubscribe = controller.subscribe(listener);
    controller.play({ state: 'playful', priority: 1 });
    expect(listener).toHaveBeenCalled();
    unsubscribe();
    listener.mockClear();
    vi.advanceTimersByTime(150);
    expect(listener).not.toHaveBeenCalled();
    controller.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('crops the real idle sprite into an accessible-control-sized face view', () => {
    const html = renderToStaticMarkup(<CatSprite state="idle" face />);
    expect(html).toContain('viewBox="32 4 128 128"');
    expect(html).toContain('/pets/bd-cat/spritesheet.webp');
  });
});
describe('visibility preferences', () => {
  it.each(['hidden', 'minimized'])(
    'normalizes legacy %s preferences to the circular avatar',
    (value) => {
      const getItem = vi.fn(() => value);
      vi.stubGlobal('localStorage', { getItem });
      expect(readVisibility()).toBe('minimized');
      expect(getItem).toHaveBeenCalledWith(visibilityKey);
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

describe('paired shuffled click interactions', () => {
  it('visits every animation once per bag without repeating at bag boundaries', () => {
    const pick = createClickInteractionPicker(() => 0);
    const played: string[] = [];
    for (let i = 0; i < clickInteractions.length * 4; i++) {
      expect(
        pick((reaction) => {
          played.push(reaction.state);
          return true;
        }),
      ).toBe(true);
    }
    for (let i = 1; i < played.length; i++) expect(played[i]).not.toBe(played[i - 1]);
    for (let start = 0; start < played.length; start += clickInteractions.length) {
      expect(new Set(played.slice(start, start + clickInteractions.length)).size).toBe(
        clickInteractions.length,
      );
    }
    expect(played.filter((state) => state === 'walking')).toHaveLength(4);
  });
  it('does not consume or replace a pair rejected by busy/important playback', () => {
    const pick = createClickInteractionPicker(() => 0.5);
    const offered: unknown[] = [];
    for (let i = 0; i < 10; i++)
      expect(
        pick((reaction) => {
          offered.push(reaction);
          return false;
        }),
      ).toBe(false);
    expect(
      offered.every((reaction) => JSON.stringify(reaction) === JSON.stringify(offered[0])),
    ).toBe(true);
    pick((reaction) => {
      expect(reaction).toEqual(offered[0]);
      return true;
    });
    pick((reaction) => {
      expect(reaction).not.toEqual(offered[0]);
      return true;
    });
  });
  it('pairs wave, observation, and blink dialogue with their actual mapped poses', () => {
    expect(clickInteractions.find((item) => item.message.includes('I can wave'))?.state).toBe(
      'happy',
    );
    expect(frameAt('happy', 0).y).toBe(624);
    expect(clickInteractions.find((item) => item.message.includes('measuring'))?.state).toBe(
      'curious',
    );
    expect(frameAt('curious', 0).y).toBe(1248);
    expect(clickInteractions.find((item) => item.message.includes('look around'))?.state).toBe(
      'lookAround',
    );
    expect(frameAt('lookAround', 0).y).toBe(1664);
    expect(clickInteractions.find((item) => item.message.includes('Blink'))?.state).toBe('idle');
  });
  it.each(clickInteractions)(
    'plays $state once, then resumes either resting emotion',
    (interaction) => {
      vi.useFakeTimers();
      for (const sad of [false, true]) {
        const notify = vi.fn();
        const controller = createAnimationController(notify);
        if (sad) controller.play(answerReaction(false));
        expect(controller.play({ ...interaction, priority: 1 })).toBe(true);
        const animation = spriteAnimation(interaction.state);
        expect(animation).toBeDefined();
        expect(controller.getFrame()).toEqual(animation.frames[0]);
        vi.advanceTimersByTime(animation.frames.length * animation.frameDurationMs - 1);
        expect(notify.mock.lastCall?.[0].message).toBe(interaction.message);
        vi.advanceTimersByTime(1);
        expect(notify.mock.lastCall?.[0].state).toBe(sad ? 'sad' : 'idle');
        controller.dispose();
        expect(vi.getTimerCount()).toBe(0);
      }
    },
  );
});
