import bank from '../../../shared/quiz-bank.json';

export const QUIZ_TIMEZONE = 'America/Toronto';
export type FunQuestion = (typeof bank)[number];
export type DailyAnswer = { day: string; questionId: string; answer: number; correct: boolean };
export const dailyStorageKey = 'qq.daily.v1';

export function quizDay(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: QUIZ_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
function hash(value: string) {
  let result = 2166136261;
  for (let i = 0; i < value.length; i++)
    result = Math.imul(result ^ value.charCodeAt(i), 16777619) >>> 0;
  return result;
}
export function dailyQuestions(day = quizDay()) {
  return [...bank]
    .sort(
      (a, b) =>
        hash(`qubit-quest:${day}:${a.id}`) - hash(`qubit-quest:${day}:${b.id}`) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 3);
}
export function normalizeDaily(value: unknown): DailyAnswer[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .filter((item): item is DailyAnswer => {
      if (!item || typeof item !== 'object') return false;
      const { day, questionId, answer } = item;
      const question = bank.find((question) => question.id === questionId);
      if (
        typeof day !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
        !Number.isFinite(Date.parse(`${day}T12:00:00Z`)) ||
        new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) !== day ||
        !question ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer > 2 ||
        !dailyQuestions(day).some((question) => question.id === questionId)
      )
        return false;
      const key = `${day}:${questionId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((item) => ({
      ...item,
      correct: bank.find((question) => question.id === item.questionId)!.correct === item.answer,
    }));
}
export function readDaily(): DailyAnswer[] {
  try {
    return normalizeDaily(JSON.parse(localStorage.getItem(dailyStorageKey) || '[]'));
  } catch {
    return [];
  }
}
export function quizStats(answers: DailyAnswer[], today = quizDay()) {
  const days = [...new Set(answers.map((answer) => answer.day))]
    .filter((day) =>
      dailyQuestions(day).every((question) =>
        answers.some((answer) => answer.day === day && answer.questionId === question.id),
      ),
    )
    .sort();
  let cursor = new Date(`${today}T12:00:00Z`);
  if (!days.includes(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (days.includes(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return { completedDays: days, streak };
}
