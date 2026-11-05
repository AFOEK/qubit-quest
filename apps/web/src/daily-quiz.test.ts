import { describe, expect, it } from 'vitest';
import bank from '../../../shared/quiz-bank.json';
import { dailyQuestions, normalizeDaily, quizDay, quizStats } from './daily-quiz';

const finish = (day: string) =>
  dailyQuestions(day).map((question) => ({
    day,
    questionId: question.id,
    answer: (question.correct + 1) % 3,
    correct: false,
  }));

describe('daily quantum fun facts', () => {
  it('contains unique factual questions with explanations and three choices', () => {
    expect(bank.length).toBeGreaterThanOrEqual(20);
    expect(new Set(bank.map((question) => question.id)).size).toBe(bank.length);
    for (const question of bank) {
      expect(question.answers).toHaveLength(3);
      expect(question.answers[question.correct]).toBeTruthy();
      expect(question.explanation.length).toBeGreaterThan(30);
    }
  });
  it('chooses three distinct questions deterministically, matching the API fixture', () => {
    expect(dailyQuestions('2026-11-05').map((question) => question.id)).toEqual([
      'schmidt',
      'energy',
      'qubo',
    ]);
    const sets = new Set(
      Array.from({ length: 28 }, (_, i) =>
        dailyQuestions(`2026-11-${String(i + 1).padStart(2, '0')}`)
          .map((q) => q.id)
          .join(','),
      ),
    );
    expect(sets.size).toBeGreaterThan(20);
  });
  it('resets at Toronto midnight, including daylight-saving transitions', () => {
    expect(quizDay(new Date('2026-11-05T04:59:59Z'))).toBe('2026-11-04');
    expect(quizDay(new Date('2026-11-05T05:00:00Z'))).toBe('2026-11-05');
    expect(quizDay(new Date('2026-07-05T03:59:59Z'))).toBe('2026-07-04');
    expect(quizDay(new Date('2026-07-05T04:00:00Z'))).toBe('2026-07-05');
  });
  it('validates stored records, keeps the first answer, and recomputes correctness', () => {
    const day = '2026-11-05',
      question = dailyQuestions(day)[0];
    const first = { day, questionId: question.id, answer: question.correct, correct: false };
    expect(
      normalizeDaily([
        null,
        {},
        first,
        { ...first, answer: 2 },
        { ...first, day: '2026-99-99' },
        { ...first, answer: -1 },
        { ...first, questionId: 'unknown' },
        { ...first, day: '2026-02-30' },
      ]),
    ).toEqual([{ ...first, correct: true }]);
    expect(normalizeDaily('invalid')).toEqual([]);
  });
  it('counts participation regardless of score and preserves yesterday’s streak until today ends', () => {
    const answers = [...finish('2026-11-03'), ...finish('2026-11-04')];
    expect(quizStats(answers, '2026-11-05').streak).toBe(2);
    expect(quizStats([...answers, finish('2026-11-05')[0]], '2026-11-05').streak).toBe(2);
    expect(quizStats([...answers, ...finish('2026-11-05')], '2026-11-05').streak).toBe(3);
    expect(quizStats(answers, '2026-11-06').streak).toBe(0);
  });
});
