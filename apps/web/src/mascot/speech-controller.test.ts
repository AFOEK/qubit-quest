import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSpeechController, speechForReaction, speechPolicies } from './speech-controller';
import { createAnimationController } from './animation-controller';
import { createLessonPersonality } from './lesson-personality';
import { answerReaction, completionReaction, type Reaction } from './mascot-state';
import { courses } from '../curriculum';
import { incorrectMessages } from './mascot-messages';

afterEach(() => vi.useRealTimers());
describe('speech lifetimes independent of animation', () => {
  it('keeps educational speech after its animation returns to idle for over 30 seconds', () => {
    vi.useFakeTimers();
    const frames = vi.fn();
    const messages = vi.fn();
    const animation = createAnimationController(frames);
    const speech = createSpeechController(messages);
    const reaction: Reaction = {
      state: 'curious',
      priority: 0.25,
      message: 'A mathematical thought.',
      dialogue: { kind: 'educational', context: 'math' },
    };
    animation.play(reaction);
    speech.show(speechForReaction(reaction)!);
    vi.advanceTimersByTime(1530);
    expect(frames.mock.lastCall?.[0].state).toBe('idle');
    expect(speech.getSpeech()?.text).toBe(reaction.message);
    vi.advanceTimersByTime(30000);
    expect(speech.getSpeech()?.text).toBe(reaction.message);
    expect(messages).toHaveBeenCalledTimes(1);
    speech.dispose();
    animation.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each(['correct', 'completion', 'achievement', 'playful'] as const)(
    'expires %s speech at its own configured deadline',
    (kind) => {
      vi.useFakeTimers();
      const speech = createSpeechController(vi.fn());
      speech.show({ kind, text: 'Readable feedback.' });
      vi.advanceTimersByTime(speechPolicies[kind].duration - 1);
      expect(speech.getSpeech()?.text).toBe('Readable feedback.');
      vi.advanceTimersByTime(1);
      expect(speech.getSpeech()).toBeNull();
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it('uses the requested 6/8/10/5 second timing', () => {
    expect(speechPolicies.correct.duration).toBe(6000);
    expect(speechPolicies.completion.duration).toBe(8000);
    expect(speechPolicies.achievement.duration).toBe(10000);
    expect(speechPolicies.playful.duration).toBe(5000);
  });
  it('keeps incorrect feedback until a checked retry or question transition', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    speech.show(speechForReaction(answerReaction(false))!);
    vi.advanceTimersByTime(60000);
    expect(speech.getSpeech()?.kind).toBe('incorrect');
    speech.show({ kind: 'incorrect', text: 'A checked retry.' });
    expect(speech.getSpeech()?.text).toBe('A checked retry.');
    speech.show(speechForReaction(answerReaction(true))!);
    expect(speech.getSpeech()?.kind).toBe('correct');
    speech.clearQuestion();
    expect(speech.getSpeech()).toBeNull();
    speech.dispose();
  });
  it('dismissing speech does not clear a persistent sad emotion or allow it to reappear from frames', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    const animation = createAnimationController(vi.fn());
    const wrong = answerReaction(false);
    animation.play(wrong);
    speech.show(speechForReaction(wrong)!);
    speech.dismiss();
    vi.advanceTimersByTime(31000);
    expect(animation.getBaseEmotion()).toBe('sad');
    expect(speech.getSpeech()).toBeNull();
    animation.play({ state: 'playful', priority: 1 });
    vi.advanceTimersByTime(900);
    expect(animation.getBaseEmotion()).toBe('sad');
    expect(speech.getSpeech()).toBeNull();
    speech.dispose();
    animation.dispose();
  });
});
describe('incorrect-answer dialogue protection', () => {
  it('selects supportive quiz messages randomly, while correct feedback remains positive', () => {
    const random = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.34)
      .mockReturnValueOnce(0.67);
    try {
      const messages = [answerReaction(false), answerReaction(false), answerReaction(false)];
      expect(messages.map((reaction) => reaction.message)).toEqual([
        incorrectMessages[0],
        incorrectMessages[2],
        incorrectMessages[4],
      ]);
      expect(
        messages.every((reaction) => reaction.state === 'sad' && reaction.baseEmotion === 'sad'),
      ).toBe(true);
      expect(answerReaction(true)).toMatchObject({ state: 'happy', baseEmotion: 'idle' });
    } finally {
      random.mockRestore();
    }
  });
  it('blocks contextual speech for the entire incorrect state, including after dismissal', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    const animation = createAnimationController(vi.fn());
    const wrong = answerReaction(false);
    animation.play(wrong);
    speech.show(speechForReaction(wrong)!);
    const feedback = speech.getSpeech();
    expect(
      speech.show({ kind: 'educational', text: 'Random context.' }, { incorrectActive: true }),
    ).toBe(false);
    expect(speech.getSpeech()).toBe(feedback);
    speech.dismiss();
    vi.advanceTimersByTime(12000);
    for (const kind of ['educational', 'playful'] as const) {
      expect(
        speech.show(
          { kind, text: 'Casual context.' },
          { incorrectActive: animation.getBaseEmotion() === 'sad' },
        ),
      ).toBe(false);
    }
    expect(animation.getBaseEmotion()).toBe('sad');
    expect(speech.getSpeech()).toBeNull();
    const correct = answerReaction(true);
    animation.play(correct);
    expect(
      speech.show(speechForReaction(correct)!, {
        incorrectActive: animation.getBaseEmotion() === 'sad',
      }),
    ).toBe(true);
    expect(speech.getSpeech()?.kind).toBe('correct');
    speech.dismiss();
    expect(
      speech.show(
        { kind: 'educational', text: 'Normal context.' },
        { incorrectActive: animation.getBaseEmotion() === 'sad' },
      ),
    ).toBe(true);
    speech.dispose();
    animation.dispose();
  });
});
describe('speech priority, replacements, and cleanup', () => {
  it('blocks lower-priority text and never replays discarded educational speech', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    speech.show({ kind: 'educational', text: 'Study this idea.' });
    expect(speech.show({ kind: 'playful', text: 'A casual joke.' })).toBe(false);
    speech.show({ kind: 'correct', text: 'Correct!' });
    expect(speech.show({ kind: 'educational', text: 'Another study idea.' })).toBe(false);
    speech.show({ kind: 'achievement', text: 'A badge!' });
    expect(speech.show({ kind: 'incorrect', text: 'A quiz retry.' })).toBe(false);
    vi.advanceTimersByTime(6000);
    expect(speech.getSpeech()?.text).toBe('A badge!');
    vi.advanceTimersByTime(4000);
    expect(speech.getSpeech()).toBeNull();
  });
  it('reserves visual priority for an actively displayed welcome without queuing other messages', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    speech.show({ kind: 'educational', text: 'Old context.' });
    speech.setWelcomeActive(true);
    expect(speech.getSpeech()).toBeNull();
    expect(speech.show({ kind: 'achievement', text: 'A badge!' })).toBe(false);
    expect(speech.show({ kind: 'playful', text: 'A joke.' })).toBe(false);
    speech.setWelcomeActive(false);
    expect(speech.getSpeech()).toBeNull();
    expect(speech.show({ kind: 'correct', text: 'Fresh feedback.' })).toBe(true);
    speech.dispose();
  });
  it('invalidates replaced timers and stale close-button callbacks', () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    speech.show({ kind: 'playful', text: 'First.' });
    const oldId = speech.getSpeech()!.id;
    vi.advanceTimersByTime(1000);
    speech.show({ kind: 'correct', text: 'Newer.' });
    speech.dismiss(oldId);
    expect(speech.getSpeech()?.text).toBe('Newer.');
    vi.advanceTimersByTime(4000);
    expect(speech.getSpeech()?.text).toBe('Newer.');
    vi.advanceTimersByTime(2000);
    expect(speech.getSpeech()).toBeNull();
  });
  it('clears context-specific speech on transitions, preserving global saved rewards', () => {
    const speech = createSpeechController(vi.fn());
    speech.show({ kind: 'educational', context: 'lesson-a', text: 'Old lesson.' });
    speech.clearQuestion();
    expect(speech.getSpeech()).toBeNull();
    speech.show({ kind: 'completion', text: 'Saved lesson!' });
    speech.clearQuestion();
    expect(speech.getSpeech()?.kind).toBe('completion');
    speech.dispose();
  });
  it('disposes its single timer and prunes overdue messages after background throttling', () => {
    vi.useFakeTimers();
    let now = 0;
    const notify = vi.fn();
    const speech = createSpeechController(notify, () => now);
    speech.show({ kind: 'correct', text: 'Feedback.' });
    now = 7000;
    speech.prune();
    expect(speech.getSpeech()).toBeNull();
    speech.show({ kind: 'achievement', text: 'New feedback.' });
    expect(vi.getTimerCount()).toBe(1);
    speech.dispose();
    notify.mockClear();
    vi.advanceTimersByTime(20000);
    expect(notify).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });
  it('does not repeat dismissed lesson introductions on a StrictMode replay or reopen', async () => {
    vi.useFakeTimers();
    const speech = createSpeechController(vi.fn());
    const animation = createAnimationController(vi.fn());
    const personality = createLessonPersonality({
      clearQuestion: () => {
        animation.clearQuestion();
        speech.clearQuestion();
      },
      canSpeak: () => true,
      play: (reaction) => {
        const accepted = animation.play(reaction);
        if (accepted) speech.show(speechForReaction(reaction)!);
        return accepted;
      },
    });
    const leave = personality.enter('complex-amplitudes');
    leave();
    const leaveAgain = personality.enter('complex-amplitudes');
    await Promise.resolve();
    expect(speech.getSpeech()?.kind).toBe('educational');
    speech.dismiss();
    vi.advanceTimersByTime(2000);
    expect(speech.getSpeech()).toBeNull();
    leaveAgain();
    await Promise.resolve();
    personality.enter('complex-amplitudes');
    expect(speech.getSpeech()).toBeNull();
    personality.reset();
    speech.dispose();
    animation.dispose();
  });
  it('recognizes achievement/completion feedback without changing reward calculations', () => {
    const ids = courses[0].lessons.map((item) => item.id);
    const reaction = completionReaction(ids.slice(0, -1), ids, ids.at(-1)!)!;
    expect(speechForReaction(reaction)?.kind).toBe('achievement');
    expect(
      speechForReaction({ state: 'excited', priority: 3, message: 'Lesson saved.' })?.kind,
    ).toBe('completion');
  });
});
