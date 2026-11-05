import { courses, lessons } from './curriculum';
import { normalizeProgress, XP_PER_LESSON } from './progress';

// Keep the learner's chosen badge titles separate from course and lesson IDs.
export const achievementNames: Record<string, string> = {
  math: 'Back to Basic',
  'quantum-mechanics': 'The is Cat still Alive?!',
  qubits: 'Fancy Spheres',
  'gates-1': 'Gated Community I',
  'gates-2': 'Gated Community II',
  'software-compilation': 'Assembled? or Assembly?',
  'algorithms-1': 'IF x == y? I',
  'algorithms-2': 'IF x == y? II',
  'algorithms-3': 'IF x == y? III',
  'noise-qec': 'Please keep quite!',
  'error-mitigation': 'Mitigate the discord',
  'hardware-1': 'Hard like metal I',
  'hardware-2': 'Hard like metal II',
  'hardware-3': 'Hard like metal III',
  'hardware-4': 'Hard like metal IV',
  'applied-optimization': 'Optimizer beam!',
  'boundaries-1': 'Tensor X Matrix I',
  'boundaries-2': 'Tensor X Matrix II',
  'boundaries-3': 'Tensor X Matrix III',
  'cryptography-1': "Shhh... it's a secret I",
  'cryptography-2': "Shhh... it's a secret II",
  'chemistry-1': 'Fancy molecules I',
  'chemistry-2': 'Fancy molecules II',
  'chemistry-3': 'Fancy molecules III',
  'ml-1': "It's learning! I",
  'ml-2': "It's learning! II",
  'ml-3': "It's learning! III",
};

// Fixed thresholds preserve earned tiers when the catalog later grows.
export const journeyTiers = [
  { id: 'explorer', name: 'Explorer', courses: 0 },
  { id: 'bronze', name: 'Bronze', courses: 1 },
  { id: 'silver', name: 'Silver', courses: 9 },
  { id: 'gold', name: 'Gold', courses: 18 },
  { id: 'platinum', name: 'Platinum', courses: 27 },
] as const;

export function createMilestones(totalLessons: number) {
  if (!Number.isInteger(totalLessons) || totalLessons < 1) return [];
  const checkpoints = new Set([2, 5, 10, 20]);
  for (let count = 40; count < totalLessons; count += 20) checkpoints.add(count);
  checkpoints.add(totalLessons);
  return [...checkpoints]
    .filter((count) => count <= totalLessons)
    .sort((a, b) => a - b)
    .map((count) => ({
      id: `lessons-${count}`,
      lessons: count,
      xp: count * XP_PER_LESSON,
      final: count === totalLessons,
    }));
}

export function getLearningProgress(value: unknown) {
  const completed = new Set(normalizeProgress(value));
  const achievements = courses.map((course) => {
    const done = course.lessons.filter((lesson) => completed.has(lesson.id)).length;
    return {
      id: `course-${course.id}`,
      courseId: course.id,
      courseTitle: course.title,
      title: achievementNames[course.id] ?? course.title,
      track: course.track,
      icon: course.icon,
      color: course.color,
      completed: done,
      total: course.lessons.length,
      earned: course.lessons.length > 0 && done === course.lessons.length,
      percent: course.lessons.length ? (100 * done) / course.lessons.length : 0,
      nextLessonId:
        course.lessons.find((lesson) => !completed.has(lesson.id))?.id ?? course.lessons[0]?.id,
    };
  });
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;
  const tier = [...journeyTiers].reverse().find((item) => earnedCount >= item.courses)!;
  const nextTier = journeyTiers.find((item) => item.courses > earnedCount) ?? null;
  const milestones = createMilestones(lessons.length).map((milestone) => ({
    ...milestone,
    reached: completed.size >= milestone.lessons,
  }));
  const nextMilestone = milestones.find((milestone) => !milestone.reached) ?? null;
  const nextAchievement =
    achievements
      .filter((achievement) => !achievement.earned)
      .sort((a, b) => b.percent - a.percent)[0] ?? null;
  return {
    achievements,
    earnedCount,
    tier,
    nextTier,
    milestones,
    nextMilestone,
    nextAchievement,
    completedLessons: completed.size,
    totalLessons: lessons.length,
    totalCourses: courses.length,
    xp: completed.size * XP_PER_LESSON,
    totalXp: lessons.length * XP_PER_LESSON,
    allComplete: completed.size === lessons.length,
  };
}

export type LearningProgress = ReturnType<typeof getLearningProgress>;
export type Achievement = LearningProgress['achievements'][number];
export type RewardNotice = { title: string; message: string; detail?: string };

export function getRewardNotice(
  before: LearningProgress,
  after: LearningProgress,
): RewardNotice | null {
  const newlyEarned = after.achievements.filter(
    (achievement) =>
      achievement.earned &&
      !before.achievements.some((previous) => previous.id === achievement.id && previous.earned),
  );
  const newMilestones = after.milestones.filter(
    (milestone) =>
      milestone.reached &&
      !before.milestones.some((previous) => previous.id === milestone.id && previous.reached),
  );
  const tierChanged = before.tier.id !== after.tier.id;
  if (newlyEarned.length)
    return {
      title: 'Achievement unlocked!',
      message: newlyEarned.map((achievement) => achievement.title).join(' · '),
      detail: tierChanged
        ? `${after.tier.name} tier reached · ${after.earnedCount} ${after.earnedCount === 1 ? 'course' : 'courses'} complete`
        : `${after.earnedCount} / ${after.totalCourses} course badges earned`,
    };
  if (tierChanged)
    return {
      title: `${after.tier.name} tier reached!`,
      message: `${after.earnedCount} courses complete`,
    };
  const milestone = newMilestones.at(-1);
  return milestone
    ? {
        title: milestone.final
          ? 'Every lesson complete!'
          : `${milestone.xp.toLocaleString()} XP milestone reached!`,
        message: `${milestone.lessons} lessons complete`,
      }
    : null;
}
