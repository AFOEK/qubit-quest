import { mathematics } from './curriculum/mathematics';
import { foundations } from './curriculum/foundations';
import { qubitsAndGates } from './curriculum/qubits-gates';
import { algorithms } from './curriculum/algorithms';
import { noise } from './curriculum/noise';
import { errorMitigation } from './curriculum/error-mitigation';
import { appliedOptimization } from './curriculum/optimization';
import { cryptography } from './curriculum/cryptography';
import { chemistry } from './curriculum/chemistry';
import { machineLearning } from './curriculum/machine-learning';
import type { Course, TrackId } from './curriculum/types';

export type { Course, Lesson, Lab, TrackId } from './curriculum/types';

export const tracks: { id: TrackId; title: string; description: string }[] = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'The language you need, introduced gently.',
  },
  {
    id: 'fundamentals',
    title: 'Quantum fundamentals',
    description: 'From physical ideas to gates, algorithms, and reliable computation.',
  },
  {
    id: 'applications',
    title: 'Applications',
    description:
      'Explore optimization, cryptography, chemistry, and machine learning with explicit assumptions and meaningful baselines.',
  },
];

// Keep the recommended foundations together before branching into applications.
export const courses: Course[] = [
  ...mathematics,
  ...foundations,
  ...qubitsAndGates,
  ...algorithms.filter((c) => c.track === 'fundamentals'),
  ...noise,
  ...errorMitigation,
  ...appliedOptimization,
  ...algorithms.filter((c) => c.track === 'applications'),
  ...cryptography,
  ...chemistry,
  ...machineLearning,
];

export const lessons = courses.flatMap((course) =>
  course.lessons.map((lesson) => ({
    ...lesson,
    courseId: course.id,
    unit: course.title,
    track: course.track,
    color: course.color,
    icon: course.icon,
  })),
);

export const courseById = new Map(courses.map((course) => [course.id, course]));
export const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export function searchCourses(query: string, track: TrackId | 'all' = 'all') {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return courses.filter((course) => {
    if (track !== 'all' && course.track !== track) return false;
    const text = [
      course.title,
      course.description,
      ...course.outcomes,
      ...course.lessons.flatMap((lesson) => [lesson.title, ...lesson.topics]),
    ]
      .join(' ')
      .toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
