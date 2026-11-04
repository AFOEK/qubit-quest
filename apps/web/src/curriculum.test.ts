import { describe, expect, it } from 'vitest';
import { courses, lessons, searchCourses } from './curriculum';

// These are the requested syllabus areas, kept per course so a topic cannot
// accidentally disappear into an unrelated lesson during later editing.
const requiredTopics: Record<string, string[]> = {
  'quantum-mechanics': [
    'Dirac notation',
    'Wave functions',
    'Schrödinger equation',
    'Quantum entanglement',
    'Bell’s theorem',
    'Quantum states',
  ],
  qubits: [
    'Hilbert space',
    'Superposition',
    'Superdense coding',
    'Bloch sphere',
    'Decoherence',
    'Interference',
  ],
  'gates-1': [
    'X gate',
    'Y gate',
    'Z gate',
    'CX gate',
    'CY gate',
    'CZ gate',
    'CCNOT',
    'SWAP gate',
    'Measurement',
    'H gate',
  ],
  'gates-2': [
    'RX gate',
    'RY gate',
    'RZ gate',
    'T gate',
    'S gate',
    'T dagger',
    'S dagger',
    'Unitary',
    'SX gate',
  ],
  'algorithms-1': [
    'Entanglement',
    'Bell states',
    'GHZ state',
    'Deutsch–Jozsa algorithm',
    'Bernstein–Vazirani algorithm',
    'Simon’s problem',
    'Hidden subgroup problem',
    'Hidden shift problem',
    'Hidden linear function problem',
  ],
  'algorithms-2': [
    'QFT',
    'QPE',
    'Shor’s algorithm',
    'Hadamard transform',
    'Parameterized quantum circuits',
  ],
  'algorithms-3': ['Optimization', 'QAOA', 'VQE', 'Phase estimation', 'Boson sampling'],
  'noise-qec': [
    'Amplitude damping',
    'Phase damping',
    'Bit flip',
    'Phase flip',
    'Depolarizing channels',
    'QEC',
    'Shor code',
    'Toric code',
  ],
  'chemistry-1': [
    'Born–Oppenheimer approximation',
    'Hartree–Fock',
    'Second quantization',
    'Jordan–Wigner transformation',
    'Bravyi–Kitaev transformation',
    'Parity transformation',
    'Molecular Hamiltonians',
  ],
  'chemistry-2': [
    'H2 molecular energy state',
    'LiH simulations',
    'BeH2 simulations',
    'UCCSD ansatz',
  ],
  'chemistry-3': ['Calculate excited states', 'Measuring observables'],
  'ml-1': [
    'Data encoding',
    'Angle encoding',
    'Amplitude encoding',
    'ZZ feature map',
    'Z feature map',
  ],
  'ml-2': ['Quantum kernels', 'QSVM'],
  'ml-3': ['QNNs', 'VQC', 'QLSTM', 'QCNN-1D', 'QCNN-2D'],
};

describe('expanded learning path', () => {
  it.each(Object.entries(requiredTopics))('keeps the requested topics in %s', (id, expected) => {
    const course = courses.find((item) => item.id === id);
    expect(course, `Missing course ${id}`).toBeDefined();
    const topics = course!.lessons
      .flatMap((lesson) => lesson.topics)
      .map((topic) => topic.toLowerCase());
    for (const topic of expected) expect(topics).toContain(topic.toLowerCase());
  });

  it('has unique stable IDs and valid prerequisite/follow-up links', () => {
    expect(new Set(courses.map((course) => course.id)).size).toBe(courses.length);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
    for (const [index, course] of courses.entries()) {
      for (const id of course.prerequisites) {
        const prerequisite = courses.findIndex((item) => item.id === id);
        expect(prerequisite, `${course.id} prerequisite ${id}`).toBeGreaterThanOrEqual(0);
        expect(prerequisite).toBeLessThan(index);
      }
    }
    for (const lesson of lessons) {
      for (const id of lesson.followUp ?? [])
        expect(lessons.some((item) => item.id === id)).toBe(true);
    }
  });

  it('provides a solvable quiz and worked practice for every lesson', () => {
    for (const lesson of lessons) {
      expect(lesson.answers.length).toBeGreaterThan(1);
      expect(new Set(lesson.answers).size).toBe(lesson.answers.length);
      expect(Number.isInteger(lesson.correct)).toBe(true);
      expect(lesson.correct).toBeGreaterThanOrEqual(0);
      expect(lesson.correct).toBeLessThan(lesson.answers.length);
      for (const content of [
        ...lesson.body,
        lesson.math.formula,
        lesson.math.explanation,
        lesson.example,
        lesson.practice.prompt,
        lesson.practice.answer,
        lesson.why,
      ])
        expect(content.trim().length).toBeGreaterThan(0);
    }
  });

  it('finds specialized topics within their application path', () => {
    expect(searchCourses('  uccsd  ', 'applications').map((course) => course.id)).toEqual([
      'chemistry-2',
    ]);
    expect(searchCourses('qLStM').map((course) => course.id)).toEqual(['ml-3']);
    expect(searchCourses('Simon', 'applications')).toEqual([]);
    expect(searchCourses('unknown-topic-123')).toEqual([]);
    expect(searchCourses('')).toHaveLength(courses.length);
  });
});
