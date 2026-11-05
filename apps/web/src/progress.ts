import { lessons } from './curriculum';

export const progressKey = 'qq.progress.v2';
export const XP_PER_LESSON = 25;
const validIds = new Set(lessons.map((lesson) => lesson.id));
// v1 used array positions. Keep this historical order independent of the new trail.
const legacyLessonIds = [
  'first-qubit',
  'superposition',
  'pauli-gates',
  'bell-states',
  'grover-search',
  'qft',
  'qaoa',
  'variational-energy',
];

export function normalizeProgress(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(value.filter((id): id is string => typeof id === 'string' && validIds.has(id))),
  ];
}

export function migrateLegacyProgress(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return normalizeProgress(
    value
      .filter(
        (i): i is number =>
          Number.isInteger(i) && Number(i) >= 0 && Number(i) < legacyLessonIds.length,
      )
      .map((i) => legacyLessonIds[i]),
  );
}

export function readProgress(storage?: Pick<Storage, 'getItem'>): string[] {
  try {
    const source = storage ?? localStorage;
    const current = source.getItem(progressKey);
    if (current !== null) return normalizeProgress(JSON.parse(current));
    return migrateLegacyProgress(JSON.parse(source.getItem('qq.progress.v1') || '[]'));
  } catch {
    return [];
  }
}
