import { describe, expect, it } from 'vitest';
import { courses, lessons } from './curriculum';
import {
  achievementNames,
  createMilestones,
  getLearningProgress,
  getRewardNotice,
} from './achievements';
import { migrateLegacyProgress } from './progress';

const courseIds = (count: number) =>
  courses.slice(0, count).flatMap((course) => course.lessons.map((lesson) => lesson.id));

describe('course achievements', () => {
  it('maps every course to a distinct chosen badge title, including Algorithm III', () => {
    expect(Object.keys(achievementNames).sort()).toEqual(courses.map((course) => course.id).sort());
    expect(new Set(Object.values(achievementNames)).size).toBe(courses.length);
    expect(achievementNames['algorithms-3']).toBe('IF x == y? III');
    expect(achievementNames.math).toBe('Back to Basic');
    expect(achievementNames['noise-qec']).toBe('Please keep quite!');
    expect(achievementNames['quantum-mechanics']).toBe('The is Cat still Alive?!');
  });

  it.each(courses)('awards $title only after every lesson is complete', (course) => {
    const ids = course.lessons.map((lesson) => lesson.id);
    const partial = getLearningProgress(ids.slice(0, -1));
    expect(partial.earnedCount).toBe(0);
    expect(partial.achievements.find((item) => item.courseId === course.id)?.earned).toBe(false);
    const full = getLearningProgress(ids);
    expect(full.earnedCount).toBe(1);
    const badge = full.achievements.find((item) => item.courseId === course.id)!;
    expect(badge.earned).toBe(true);
    expect(badge.title).toBe(achievementNames[course.id]);
    expect(badge.percent).toBe(100);
  });

  it('deduplicates completions and ignores stale IDs when calculating XP and badges', () => {
    const ids = courseIds(1);
    const progress = getLearningProgress([...ids, ...ids, 'deleted-lesson', null, 0]);
    expect(progress.completedLessons).toBe(ids.length);
    expect(progress.xp).toBe(ids.length * 25);
    expect(progress.earnedCount).toBe(1);
    expect(progress.tier.id).toBe('bronze');
  });

  it('derives rewards from legacy and current saved progress without a second reward store', () => {
    const legacy = getLearningProgress(migrateLegacyProgress([0, 3, 7]));
    expect(legacy.xp).toBe(75);
    expect(legacy.nextMilestone?.xp).toBe(125);
    const restored = getLearningProgress(JSON.parse(JSON.stringify(courseIds(9))));
    expect(restored.earnedCount).toBe(9);
    expect(restored.tier.id).toBe('silver');
  });
});

describe('journey tiers', () => {
  it.each([
    [0, 'explorer', 'bronze'],
    [1, 'bronze', 'silver'],
    [8, 'bronze', 'silver'],
    [9, 'silver', 'gold'],
    [17, 'silver', 'gold'],
    [18, 'gold', 'platinum'],
    [26, 'gold', 'platinum'],
    [27, 'platinum', null],
  ] as const)('uses the correct tier after %i courses', (count, current, next) => {
    const progress = getLearningProgress(courseIds(count));
    expect(progress.tier.id).toBe(current);
    expect(progress.nextTier?.id ?? null).toBe(next);
  });
});

describe('learning milestones', () => {
  it('advances beyond the old 50 XP cap immediately at the boundary', () => {
    const progress = getLearningProgress(lessons.slice(0, 2).map((lesson) => lesson.id));
    expect(progress.xp).toBe(50);
    expect(progress.milestones.find((item) => item.xp === 50)?.reached).toBe(true);
    expect(progress.nextMilestone?.xp).toBe(125);
  });

  it('accounts for all crossed checkpoints when restoring a longer learning history', () => {
    const progress = getLearningProgress(lessons.slice(0, 11).map((lesson) => lesson.id));
    expect(progress.xp).toBe(275);
    expect(progress.milestones.filter((item) => item.reached).map((item) => item.xp)).toEqual([
      50, 125, 250,
    ]);
    expect(progress.nextMilestone?.xp).toBe(500);
  });

  it('uses the full curriculum for the final checkpoint and handles complete progress', () => {
    const progress = getLearningProgress(lessons.map((lesson) => lesson.id));
    expect(progress.xp).toBe(lessons.length * 25);
    expect(progress.milestones.at(-1)?.xp).toBe(progress.xp);
    expect(progress.milestones.every((item) => item.reached)).toBe(true);
    expect(progress.earnedCount).toBe(courses.length);
    expect(progress.nextMilestone).toBe(null);
    expect(progress.nextAchievement).toBe(null);
    expect(progress.allComplete).toBe(true);
  });

  it('builds unique reachable checkpoints for small or expanded catalogs', () => {
    expect(createMilestones(1).map((item) => item.xp)).toEqual([25]);
    expect(createMilestones(2).map((item) => item.xp)).toEqual([50]);
    const expanded = createMilestones(140);
    expect(expanded.at(-1)?.xp).toBe(3500);
    expect(new Set(expanded.map((item) => item.xp)).size).toBe(expanded.length);
    expect(expanded.every((item) => item.lessons <= 140)).toBe(true);
    expect(createMilestones(0)).toEqual([]);
  });
});

describe('reward announcements', () => {
  it('announces a completed course and its tier together', () => {
    const math = courses[0].lessons.map((lesson) => lesson.id);
    const notice = getRewardNotice(
      getLearningProgress(math.slice(0, -1)),
      getLearningProgress(math),
    );
    expect(notice?.title).toBe('Achievement unlocked!');
    expect(notice?.message).toBe('Back to Basic');
    expect(notice?.detail).toContain('Bronze tier reached');
  });

  it('does not reannounce rewards or grant XP for a duplicate review', () => {
    const ids = courseIds(9);
    const before = getLearningProgress(ids);
    const after = getLearningProgress([...ids, ...ids]);
    expect(getRewardNotice(before, after)).toBe(null);
    expect(after.xp).toBe(before.xp);
  });

  it('announces an XP milestone when no course was completed', () => {
    const ids = lessons.slice(0, 2).map((lesson) => lesson.id);
    const notice = getRewardNotice(getLearningProgress(ids.slice(0, 1)), getLearningProgress(ids));
    expect(notice?.title).toBe('50 XP milestone reached!');
    expect(notice?.message).toBe('2 lessons complete');
  });
});
