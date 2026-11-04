import { describe, expect, it } from 'vitest';
import { migrateLegacyProgress, normalizeProgress, progressKey, readProgress } from './progress';

describe('stable lesson progress', () => {
  it('preserves all eight historical completions after inserting the new courses', () => {
    expect(migrateLegacyProgress([0, 1, 2, 3, 4, 5, 6, 7])).toEqual([
      'first-qubit',
      'superposition',
      'pauli-gates',
      'bell-states',
      'grover-search',
      'qft',
      'qaoa',
      'variational-energy',
    ]);
  });

  it('drops duplicate, stale, and malformed values so XP cannot be inflated', () => {
    expect(migrateLegacyProgress([0, 0, 7, 8, -1, 1.5, '1', null])).toEqual([
      'first-qubit',
      'variational-energy',
    ]);
    expect(normalizeProgress(['qft', 'qft', 'removed-lesson', 0, null, 'qaoa'])).toEqual([
      'qft',
      'qaoa',
    ]);
    expect(migrateLegacyProgress({ 0: true })).toEqual([]);
  });

  it('prefers current stable IDs and reads legacy data only when needed', () => {
    const data: Record<string, string> = { [progressKey]: '["qft"]', 'qq.progress.v1': '[0]' };
    const storage = { getItem: (key: string) => data[key] ?? null };
    expect(readProgress(storage)).toEqual(['qft']);
    delete data[progressKey];
    expect(readProgress(storage)).toEqual(['first-qubit']);
  });

  it('keeps learning available when browser storage is corrupted or blocked', () => {
    expect(readProgress({ getItem: () => 'broken JSON' })).toEqual([]);
    expect(
      readProgress({
        getItem: () => {
          throw new Error('Storage blocked');
        },
      }),
    ).toEqual([]);
    expect(readProgress({ getItem: () => null })).toEqual([]);
  });
});
