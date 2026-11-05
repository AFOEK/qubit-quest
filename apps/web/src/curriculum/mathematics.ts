import type { Course } from './types';

export const mathematics: Course[] = [
  {
    id: 'math',
    title: 'Mathematical foundations',
    track: 'mathematics',
    icon: '∑',
    color: 'mint',
    description:
      'A bridge from school mathematics to the language of quantum computing. Build confidence with vectors, complex numbers, and probability before starting quantum theory.',
    prerequisites: [],
    outcomes: [
      'Read complex amplitudes and calculate probabilities.',
      'Multiply small matrices and build joint states.',
      'Recognize eigenvalues, derivatives, and expectation values.',
    ],
    lessons: [
      {
        id: 'complex-amplitudes',
        title: 'Complex numbers: magnitude and phase',
        time: 6,
        level: 'Introduction',
        topics: ['Complex numbers', 'Amplitudes', 'Relative phase'],
        body: [
          'A complex number a + bi has a real part a and an imaginary part b, where i² = −1. Quantum amplitudes are complex numbers. Their squared magnitudes become probabilities, while their relative phases affect interference.',
          'Multiplying every amplitude by the same phase leaves observable predictions unchanged. Changing the phase of just one component can change what a later gate does.',
        ],
        math: {
          formula: '|a + bi|² = a² + b²;  eⁱθ = cos θ + i sin θ',
          explanation:
            'The magnitude sets a probability weight. The angle θ describes phase in radians.',
        },
        example:
          'The amplitude i/√2 has squared magnitude 1/2, just like 1/√2. The states (|0⟩ + |1⟩)/√2 and (|0⟩ + i|1⟩)/√2 give the same Z-basis probabilities, but differ in relative phase.',
        practice: {
          prompt: 'Find the squared magnitude of (3 + 4i)/5.',
          answer: '(3/5)² + (4/5)² = 1. This amplitude alone has probability weight 1.',
        },
        question: 'Which quantity gives the probability weight of an amplitude α?',
        answers: ['The imaginary part of α', '|α|²', 'The phase angle alone'],
        correct: 1,
        why: 'Born’s rule uses squared magnitude; phase matters when amplitudes combine.',
      },
      {
        id: 'vectors-matrices',
        title: 'Vectors, inner products, and matrices',
        time: 7,
        level: 'Introduction',
        topics: ['Linear algebra', 'Vectors', 'Matrices', 'Inner products'],
        body: [
          'A state vector lists amplitudes in a chosen basis. A matrix acts on that vector: each output entry is a row multiplied by the input column. This is the calculation behind a quantum gate.',
          'The inner product conjugates the first vector before multiplying and adding. A vector has length one when its inner product with itself is one. Orthogonal vectors have inner product zero and represent perfectly distinguishable pure states.',
        ],
        math: {
          formula: '⟨u|v⟩ = Σⱼ uⱼ* vⱼ;  X = [[0, 1], [1, 0]]',
          explanation:
            'The star means complex conjugation: replace i by −i. X exchanges the two entries of a qubit vector.',
        },
        example:
          'Write |0⟩ as [1, 0]ᵀ. Multiplying X[1, 0]ᵀ gives [0, 1]ᵀ = |1⟩. The inner product ⟨0|1⟩ = 0.',
        practice: {
          prompt: 'Apply X to [0, 1]ᵀ, then compute its squared length.',
          answer: 'The result is [1, 0]ᵀ. Its squared length is 1² + 0² = 1.',
        },
        question: 'What does ⟨0|1⟩ = 0 tell us?',
        answers: [
          'Both states have zero probability',
          'The states are identical',
          'The basis states are orthogonal',
        ],
        correct: 2,
        why: 'Zero overlap means these pure states can be distinguished by an appropriate measurement.',
        lab: { kind: 'gates', sequence: ['X'] },
      },
      {
        id: 'tensor-products',
        title: 'Tensor products: put systems together',
        time: 7,
        level: 'Introduction',
        topics: ['Tensor products', 'Composite systems', 'Bit ordering'],
        body: [
          'A tensor product combines state spaces. Two qubits need four amplitudes, one for each basis label 00, 01, 10, 11. With n qubits, a general pure state has 2ⁿ amplitudes; measurement still returns only one n-bit result.',
          'A product state factors into separate qubit states. Entangled states cannot be factored this way. In Qiskit display strings, qubit 0 is the rightmost bit, so always state the register order before doing arithmetic.',
        ],
        math: {
          formula: '(a|0⟩ + b|1⟩) ⊗ |0⟩ = a|00⟩ + b|10⟩',
          explanation:
            'Here the first written factor is the left bit. Qiskit basis labels for two qubits are written |q₁q₀⟩.',
        },
        example:
          '|+⟩ ⊗ |0⟩ has amplitudes [1/√2, 0, 1/√2, 0] in the written basis order. It is a product state despite having two nonzero amplitudes.',
        practice: {
          prompt: 'Expand |0⟩ ⊗ (|0⟩ + |1⟩)/√2.',
          answer: '(|00⟩ + |01⟩)/√2. Only the right written bit varies.',
        },
        question: 'How many complex amplitudes describe a general pure state of three qubits?',
        answers: ['8', '3', '6'],
        correct: 0,
        why: 'Each additional qubit doubles the state-space dimension: 2³ = 8.',
      },
      {
        id: 'probability-expectation',
        title: 'Probability, shots, and averages',
        time: 6,
        level: 'Introduction',
        topics: ['Probability', 'Normalization', 'Expectation values', 'Sampling'],
        body: [
          'Probabilities are nonnegative and add to one. A shot is one preparation followed by measurement. Repeating shots estimates probabilities; a finite histogram fluctuates even when the circuit is ideal.',
          'An expectation value is a probability-weighted average of possible measurement values. This connects quantum results to familiar statistics and later to energy and machine-learning objectives.',
        ],
        math: {
          formula: 'Σₓ p(x) = 1;  E[f] = Σₓ p(x)f(x)',
          explanation:
            'For a Z measurement, assign +1 to outcome 0 and −1 to outcome 1, giving ⟨Z⟩ = p(0) − p(1).',
        },
        example:
          'If p(0) = 3/4 and p(1) = 1/4, then ⟨Z⟩ = 1/2. Across 100 shots, 75 zeros is the expected count, not a guarantee.',
        practice: {
          prompt: 'You measure 60 zeros and 40 ones. Estimate ⟨Z⟩.',
          answer:
            '(60 − 40)/100 = 0.2. More shots usually reduce statistical uncertainty; they do not remove device bias.',
        },
        question: 'Does an ideal 50/50 state always give exactly 50 zeros in 100 shots?',
        answers: [
          'Yes, normalization guarantees it',
          'No, finite sampling fluctuates',
          'Only if the amplitudes are real',
        ],
        correct: 1,
        why: 'Exact probabilities describe the distribution; counts are random samples from it.',
      },
      {
        id: 'eigenvalues-calculus',
        title: 'Eigenvalues and a little calculus',
        time: 8,
        level: 'Introduction',
        topics: [
          'Eigenvalues',
          'Eigenvectors',
          'Derivatives',
          'Optimization',
          'Modular arithmetic',
        ],
        body: [
          'An eigenvector keeps its direction when a matrix acts on it; the eigenvalue is its scale factor. For a quantum observable, eigenvalues are possible measurement values. For a unitary, eigenvalues are phases of magnitude one.',
          'A derivative measures how a quantity changes with a parameter. An optimizer uses this information to improve a trial answer. We will also use modular arithmetic: integers wrap around after a chosen modulus, as on a clock.',
        ],
        math: {
          formula: 'A|v⟩ = λ|v⟩;  d(cos θ)/dθ = −sin θ;  7 mod 3 = 1',
          explanation:
            'λ is an eigenvalue. θ is a circuit parameter. The remainder after division defines modular arithmetic.',
        },
        example:
          'Z|0⟩ = +|0⟩ and Z|1⟩ = −|1⟩, so Z has eigenvalues +1 and −1. If E(θ) = cos θ, its minimum is −1 at θ = π.',
        practice: {
          prompt: 'For E(θ) = cos θ at θ = π/2, does increasing θ slightly lower the energy?',
          answer: 'Yes. The derivative is −sin(π/2) = −1, so a small positive step lowers E.',
        },
        question: 'If U|v⟩ = e²πⁱφ|v⟩, what does quantum phase estimation try to learn?',
        answers: ['Every entry of U', 'The length of |v⟩', 'The eigenphase φ'],
        correct: 2,
        why: 'QPE estimates the phase in a unitary eigenvalue. The algorithm course will derive the circuit.',
        followUp: ['qpe'],
      },
    ],
  },
];
