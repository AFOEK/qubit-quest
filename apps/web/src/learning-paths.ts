import { courses, courseById, lessons } from './curriculum';

export const learningPaths = [
  {
    id: 'foundations',
    title: 'Quantum foundations',
    icon: '◉',
    description: 'Build the math, circuit, algorithm, and noise foundations.',
    goals: ['error-mitigation'],
    optional: ['algorithms-3'],
  },
  {
    id: 'qml',
    title: 'Quantum machine learning',
    icon: '⌁',
    description: 'From first qubits to encodings, quantum kernels, and trainable models.',
    goals: ['ml-3'],
    optional: ['applied-optimization', 'algorithms-3', 'error-mitigation', 'boundaries-1'],
  },
  {
    id: 'chemistry',
    title: 'Quantum chemistry',
    icon: '⚛',
    description: 'Prepare for molecular Hamiltonians, variational energies, and excited states.',
    goals: ['chemistry-3'],
    optional: ['applied-optimization', 'error-mitigation', 'boundaries-2'],
  },
  {
    id: 'optimization',
    title: 'Quantum optimization',
    icon: '◇',
    description: 'Model classical problems, then understand QAOA and variational algorithms.',
    goals: ['applied-optimization', 'algorithms-3'],
    optional: ['error-mitigation', 'boundaries-1'],
  },
  {
    id: 'cryptography',
    title: 'Quantum cryptography',
    icon: '⌘',
    description: 'Learn the foundations of QKD and classical post-quantum cryptography.',
    goals: ['cryptography-2', 'noise-qec'],
    optional: ['error-mitigation', 'algorithms-3'],
  },
  {
    id: 'hardware',
    title: 'Quantum hardware',
    icon: '∿',
    description:
      'Progress from circuits and compilation to pulse control and device characterization.',
    goals: ['hardware-4'],
    optional: ['error-mitigation', 'algorithms-3', 'boundaries-1'],
  },
  {
    id: 'simulation',
    title: 'Classical–quantum simulation',
    icon: '⋈',
    description:
      'Study tensor representations, entanglement limits, and classical simulation methods.',
    goals: ['boundaries-3'],
    optional: ['chemistry-1', 'applied-optimization', 'hardware-4'],
  },
] as const;
export type PathId = (typeof learningPaths)[number]['id'] | 'all';
export const isPathId = (value: unknown): value is PathId =>
  value === 'all' || learningPaths.some((path) => path.id === value);

export function prerequisiteClosure(goals: readonly string[]) {
  const included = new Set<string>();
  function add(id: string) {
    if (included.has(id)) return;
    const course = courseById.get(id);
    if (!course) throw new Error(`Unknown course ${id}`);
    included.add(id);
    course.prerequisites.forEach(add);
  }
  goals.forEach(add);
  return courses.filter((course) => included.has(course.id)).map((course) => course.id);
}

export function pathCourses(id: PathId) {
  const path = learningPaths.find((item) => item.id === id);
  if (!path) return { required: courses.map((course) => course.id), optional: [] as string[] };
  const required = prerequisiteClosure(path.goals);
  const optional = prerequisiteClosure(path.optional).filter(
    (course) => !required.includes(course),
  );
  return { required, optional };
}

export function courseFinished(id: string, completed: readonly string[]) {
  const course = courseById.get(id);
  return Boolean(
    course?.lessons.length && course.lessons.every((lesson) => completed.includes(lesson.id)),
  );
}
export function missingPrerequisites(id: string, completed: readonly string[]) {
  return (courseById.get(id)?.prerequisites ?? []).filter(
    (prerequisite) => !courseFinished(prerequisite, completed),
  );
}
export function lessonAvailable(id: string, completed: readonly string[]) {
  const lesson = lessons.find((item) => item.id === id);
  return Boolean(
    lesson &&
    (completed.includes(id) || missingPrerequisites(lesson.courseId, completed).length === 0),
  );
}
export function nextPathLesson(id: PathId, completed: readonly string[]) {
  const required = pathCourses(id).required;
  return lessons.findIndex(
    (lesson) =>
      required.includes(lesson.courseId) &&
      !completed.includes(lesson.id) &&
      lessonAvailable(lesson.id, completed),
  );
}
