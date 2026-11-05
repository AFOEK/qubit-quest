import { mathematics } from './curriculum/mathematics';
import { foundations } from './curriculum/foundations';
import { qubitsAndGates } from './curriculum/qubits-gates';
import { software } from './curriculum/software';
import { algorithms } from './curriculum/algorithms';
import { noise } from './curriculum/noise';
import { errorMitigation } from './curriculum/error-mitigation';
import { appliedOptimization } from './curriculum/optimization';
import { cryptography } from './curriculum/cryptography';
import { chemistry } from './curriculum/chemistry';
import { machineLearning } from './curriculum/machine-learning';
import { hardwareControl } from './curriculum/hardware-control';
import { hardwareExperiments } from './curriculum/hardware-experiments';
import { boundaries } from './curriculum/boundaries';
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
    description:
      'From physical ideas to gates, compilation, algorithms, noise, and hardware control.',
  },
  {
    id: 'applications',
    title: 'Applications',
    description:
      'Explore simulation boundaries, optimization, cryptography, chemistry, and machine learning with explicit assumptions and meaningful baselines.',
  },
];

// Keep the recommended foundations together before branching into applications.
export const courses: Course[] = [
  ...mathematics,
  ...foundations,
  ...qubitsAndGates,
  ...software,
  ...algorithms.filter((c) => c.track === 'fundamentals'),
  ...noise,
  ...errorMitigation,
  ...hardwareControl,
  ...hardwareExperiments,
  ...appliedOptimization,
  ...algorithms.filter((c) => c.track === 'applications'),
  ...boundaries,
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

const searchText = (value: string) => value.toLocaleLowerCase().replace(/[‐‑‒–—−]/g, '-');

export function searchCourses(query: string, track: TrackId | 'all' = 'all') {
  const terms = searchText(query).trim().split(/\s+/).filter(Boolean);
  return courses.filter((course) => {
    if (track !== 'all' && course.track !== track) return false;
    const text = searchText(
      [
        course.title,
        course.description,
        ...course.outcomes,
        ...course.lessons.flatMap((lesson) => [lesson.title, ...lesson.topics]),
      ].join(' '),
    );
    return terms.every((term) => text.includes(term));
  });
}
