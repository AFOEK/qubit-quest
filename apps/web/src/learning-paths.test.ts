import { describe, expect, it } from 'vitest';
import { courseById, courses, lessons } from './curriculum';
import manifest from '../../../shared/learning-manifest.json';
import {
  courseFinished,
  learningPaths,
  lessonAvailable,
  missingPrerequisites,
  nextPathLesson,
  pathCourses,
  prerequisiteClosure,
} from './learning-paths';

const completedCourses = (ids: string[]) =>
  lessons.filter((lesson) => ids.includes(lesson.courseId)).map((lesson) => lesson.id);

describe('goal-dependent learning trails', () => {
  it('shares exactly the same curriculum and path rules with the API', () => {
    expect(manifest.courses).toEqual(
      courses.map((course) => ({
        id: course.id,
        title: course.title,
        prerequisites: course.prerequisites,
        lessons: course.lessons.map(({ id, correct }) => ({ id, correct })),
      })),
    );
    expect(manifest.paths).toEqual(learningPaths);
  });
  it.each(learningPaths)('$title includes prerequisites before dependent courses', (path) => {
    const { required, optional } = pathCourses(path.id);
    for (const [index, id] of required.entries()) {
      for (const parent of courseById.get(id)!.prerequisites) {
        expect(required.indexOf(parent)).toBeGreaterThanOrEqual(0);
        expect(required.indexOf(parent)).toBeLessThan(index);
      }
    }
    expect(required.every((id) => !optional.includes(id))).toBe(true);
    expect(path.goals.every((id) => required.includes(id))).toBe(true);
  });
  it('routes QML through basics, compilation, algorithms, noise, and ML', () => {
    const { required, optional } = pathCourses('qml');
    expect(required).toEqual([
      'math',
      'quantum-mechanics',
      'qubits',
      'gates-1',
      'gates-2',
      'software-compilation',
      'algorithms-1',
      'algorithms-2',
      'noise-qec',
      'ml-1',
      'ml-2',
      'ml-3',
    ]);
    expect(optional).toContain('applied-optimization');
    expect(required).not.toContain('algorithms-3');
    expect(nextPathLesson('qml', completedCourses(required))).toBe(-1);
  });
  it('covers every course through a required or elective branch', () => {
    const covered = learningPaths.flatMap((path) => {
      const { required, optional } = pathCourses(path.id);
      return [...required, ...optional];
    });
    expect(new Set(covered)).toEqual(new Set(courses.map((course) => course.id)));
    expect(pathCourses('all').required).toEqual(courses.map((course) => course.id));
  });
  it('requires whole prerequisite courses, keeps old completions reviewable, and rejects unknown IDs', () => {
    const target = courseById.get('quantum-mechanics')!.lessons[0].id;
    const math = completedCourses(['math']);
    expect(lessonAvailable(target, math.slice(1))).toBe(false);
    expect(missingPrerequisites('quantum-mechanics', [])).toEqual(['math']);
    expect(lessonAvailable(target, math)).toBe(true);
    expect(lessonAvailable(target, [target])).toBe(true);
    expect(lessonAvailable('unknown', [])).toBe(false);
    expect(courseFinished('math', math.slice(1))).toBe(false);
    expect(courseFinished('math', math)).toBe(true);
  });
  it('advances to the first available required lesson and never an elective', () => {
    const completed = completedCourses(['math']);
    const next = lessons[nextPathLesson('qml', completed)];
    expect(next.courseId).toBe('quantum-mechanics');
    expect(prerequisiteClosure(['ml-3', 'ml-3'])).toEqual(pathCourses('qml').required);
    expect(() => prerequisiteClosure(['missing'])).toThrow('Unknown course');
  });
});
