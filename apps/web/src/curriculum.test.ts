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
    'Grover’s algorithm',
    'Amplitude amplification',
    'Quantum amplitude estimation',
    'QAE',
    'Quantum random walks',
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
  'error-mitigation': [
    'Zero-noise extrapolation',
    'ZNE',
    'Probabilistic error cancellation',
    'PEC',
    'Readout error mitigation',
    'Twirled readout',
    'Dynamical decoupling',
    'Pauli twirling',
  ],
  'applied-optimization': ['QUBO', 'Ising', 'Mapping classical problems to Hamiltonians'],
  'cryptography-1': ['No-cloning theorem', 'QKD', 'BB84', 'E91', 'B92', 'Device-independent QKD'],
  'cryptography-2': [
    'Post-quantum cryptography',
    'Lattice-based cryptography',
    'Hash-based signatures',
    'Code-based cryptography',
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

  it('teaches prerequisite ideas before the new advanced applications', () => {
    const courseOrder = (id: string) => courses.findIndex((course) => course.id === id);
    expect(courseOrder('noise-qec')).toBeLessThan(courseOrder('error-mitigation'));
    expect(courseOrder('applied-optimization')).toBeLessThan(courseOrder('algorithms-3'));
    expect(courseOrder('cryptography-1')).toBeLessThan(courseOrder('cryptography-2'));
    const algorithmLessons = courses.find((course) => course.id === 'algorithms-2')!.lessons;
    const lessonOrder = (id: string) => algorithmLessons.findIndex((lesson) => lesson.id === id);
    expect(lessonOrder('grover-geometry')).toBeLessThan(lessonOrder('amplitude-amplification'));
    expect(lessonOrder('amplitude-amplification')).toBeLessThan(lessonOrder('qae'));
    expect(lessonOrder('qpe')).toBeLessThan(lessonOrder('qae'));
    expect(lessons.find((lesson) => lesson.id === 'grover-search')?.level).toBe('Introduction');
  });

  it('finds specialized topics within their application path', () => {
    expect(searchCourses('  uccsd  ', 'applications').map((course) => course.id)).toEqual([
      'chemistry-2',
    ]);
    expect(searchCourses('qLStM').map((course) => course.id)).toEqual(['ml-3']);
    expect(searchCourses('BB84', 'applications').map((course) => course.id)).toEqual([
      'cryptography-1',
    ]);
    expect(searchCourses('twirled readout').map((course) => course.id)).toEqual([
      'error-mitigation',
    ]);
    expect(searchCourses('QAE').map((course) => course.id)).toEqual(['algorithms-2']);
    expect(searchCourses('Simon', 'applications')).toEqual([]);
    expect(searchCourses('unknown-topic-123')).toEqual([]);
    expect(searchCourses('')).toHaveLength(courses.length);
  });
});
