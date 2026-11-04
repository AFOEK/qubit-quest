import type { Course } from './types';

export const foundations: Course[] = [
  {
    id: 'quantum-mechanics',
    title: 'Quantum Mechanics Theories',
    track: 'fundamentals',
    icon: 'ψ',
    color: 'mint',
    description:
      'Learn what a quantum state predicts, how it evolves, and why quantum correlations differ from classical ones. This is the conceptual introduction; circuits come later.',
    prerequisites: ['math'],
    outcomes: [
      'Read Dirac notation and Born’s rule.',
      'Connect wave functions and Schrödinger evolution to states.',
      'Explain entanglement and Bell’s theorem without faster-than-light claims.',
    ],
    lessons: [
      {
        id: 'dirac-states',
        title: 'Quantum states and Dirac notation',
        time: 6,
        level: 'Introduction',
        topics: ['Quantum states', 'Dirac notation', 'Bras and kets'],
        body: [
          'A ket |ψ⟩ names a state vector; a bra ⟨ψ| is its conjugate transpose. A state summarizes probabilities for all the measurements we could choose. A basis is a set of reference vectors, like coordinate axes.',
          'Writing |ψ⟩ = α|0⟩ + β|1⟩ gives the coordinates in the computational basis. The overlap ⟨0|ψ⟩ is α. States differing only by a global phase describe the same physical pure state.',
        ],
        math: {
          formula: '|ψ⟩ = α|0⟩ + β|1⟩;  ⟨ψ|ψ⟩ = |α|² + |β|² = 1',
          explanation: 'The normalization condition makes all outcome probabilities sum to one.',
        },
        example:
          'For |ψ⟩ = (√3/2)|0⟩ + (i/2)|1⟩, the overlaps with 0 and 1 have squared magnitudes 3/4 and 1/4.',
        practice: {
          prompt: 'Is |0⟩ + |1⟩ normalized? If not, fix it.',
          answer: 'Its squared length is 2. Divide by √2 to obtain (|0⟩ + |1⟩)/√2.',
        },
        question: 'What is ⟨0|ψ⟩ when |ψ⟩ = α|0⟩ + β|1⟩?',
        answers: ['α', '|α|²', 'β'],
        correct: 0,
        why: 'An overlap gives an amplitude. Squaring its magnitude gives a probability.',
      },
      {
        id: 'wave-functions',
        title: 'Wave functions and Born’s rule',
        time: 7,
        level: 'Introduction',
        topics: ['Wave functions', 'Born rule', 'Measurement'],
        body: [
          'A wave function ψ(x) expresses a state in the position basis. Position is continuous, unlike the two labels of a qubit, but both descriptions use amplitudes and squared magnitudes.',
          'The quantity |ψ(x)|² is a probability density. A finite interval has probability given by the area under that density. A wave function is a mathematical description of a state, not a literal drawing of a particle spread through a computer.',
        ],
        math: {
          formula: 'P(a ≤ x ≤ b) = ∫ₐᵇ |ψ(x)|² dx;  ∫ |ψ(x)|² dx = 1',
          explanation:
            'The integral adds probability density across an interval. Discrete qubit states use a sum instead.',
        },
        example:
          'A constant normalized wave function on an interval of length L has density 1/L there. The left half of that interval has probability 1/2.',
        practice: {
          prompt:
            'If a detector region contains one quarter of the total area under |ψ(x)|², what is its detection probability?',
          answer:
            '1/4. The amplitude itself can be complex; its squared magnitude is the probability density.',
        },
        question: 'What is |ψ(x)|² for a continuous position wave function?',
        answers: ['The particle’s velocity', 'A probability density', 'A quantum gate'],
        correct: 1,
        why: 'Integrating the density over a region gives the probability of a position result in that region.',
      },
      {
        id: 'schrodinger',
        title: 'How states evolve: Schrödinger equation',
        time: 8,
        level: 'Introduction',
        topics: ['Schrödinger equation', 'Hamiltonians', 'Time evolution'],
        body: [
          'The Schrödinger equation describes how an isolated quantum state changes with time. Its Hamiltonian Ĥ represents energy and determines the motion. The h-bar constant ħ connects energy and time.',
          'For a time-independent Hamiltonian, evolution is a unitary operator. Quantum gates are controlled examples of unitary evolution. Measurement and open-system noise need additional rules. The Hamiltonian symbol Ĥ here differs from the Hadamard gate H.',
        ],
        math: {
          formula: 'iħ ∂|ψ(t)⟩/∂t = Ĥ|ψ(t)⟩;  U(t) = exp(−iĤt/ħ)',
          explanation:
            'The exponential is a matrix exponential. An energy eigenstate acquires a phase e⁻ⁱᴱᵗ/ħ.',
        },
        example:
          'For Ĥ = (ħω/2)Z, evolution is RZ(ωt). On |+⟩ it changes relative phase; on |0⟩ it adds only a global phase.',
        practice: {
          prompt:
            'Does an isolated energy eigenstate’s energy measurement distribution change as its phase evolves?',
          answer:
            'No. Its phase changes, but it remains the same energy eigenstate with a certain energy outcome.',
        },
        question: 'What determines isolated-system evolution in the Schrödinger equation?',
        answers: ['The number of shots', 'The browser’s random seed', 'The Hamiltonian'],
        correct: 2,
        why: 'The Hamiltonian generates time evolution and connects dynamics to energy.',
        followUp: ['rotation-gates', 'phase-estimation-energy'],
      },
      {
        id: 'entanglement-intro',
        title: 'Entanglement: the introductory picture',
        time: 6,
        level: 'Introduction',
        topics: ['Quantum entanglement', 'Product states', 'Correlations'],
        body: [
          'A pure joint state is entangled when it cannot be written as a product of individual states. For (|00⟩ + |11⟩)/√2, neither qubit has its own pure state even though the pair does.',
          'Correlated measurements alone do not prove entanglement: a classical pair of matching coins is correlated too. To see the difference, compare measurements in different bases. Local results remain random, so entanglement cannot transmit a message faster than light.',
        ],
        math: {
          formula: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 ≠ |a⟩ ⊗ |b⟩',
          explanation: 'No choice of single-qubit vectors |a⟩ and |b⟩ produces this joint state.',
        },
        example:
          'Z-basis measurements of this Bell pair agree every time in an ideal experiment. Each side separately sees 0 or 1 with probability 1/2.',
        practice: {
          prompt:
            'Compare the entangled Bell state with the product state |+⟩ ⊗ |+⟩. Which has a nonzero probability of 01?',
          answer:
            'The product state has probability 1/4 for 01. The Bell state |Φ⁺⟩ has probability zero for 01.',
        },
        question:
          'Can one person choose the local measurement result of a Bell pair to send a message instantly?',
        answers: [
          'No, local outcomes remain random',
          'Yes, by choosing outcome 1',
          'Yes, with enough shots',
        ],
        correct: 0,
        why: 'Entanglement changes joint correlations, but does not let either person control the other’s local outcome distribution.',
        followUp: ['bell-states', 'ghz'],
      },
      {
        id: 'bells-theorem',
        title: 'Bell’s theorem and the CHSH test',
        time: 8,
        level: 'Introduction',
        topics: ['Bell’s theorem', 'CHSH inequality', 'Local hidden variables'],
        body: [
          'Bell’s theorem places a limit on correlations explained by local hidden-variable models with independent measurement choices. The CHSH test combines correlations from two measurement choices on each side.',
          'Quantum theory predicts violations of this limit for suitable entangled states and measurement settings. A meaningful experiment also addresses detection, locality, and measurement-choice assumptions. This is an introduction to the test, not a claim that one correlated histogram proves a violation.',
        ],
        math: {
          formula: 'S = E(A₀B₀) + E(A₀B₁) + E(A₁B₀) − E(A₁B₁);  |S| ≤ 2',
          explanation:
            'Each outcome is ±1. Local hidden-variable models obey the bound; quantum predictions can reach 2√2.',
        },
        example:
          'For |Φ⁺⟩, choose A₀ = Z, A₁ = X, B₀ = (Z + X)/√2 and B₁ = (Z − X)/√2. The ideal correlations give S = 2√2 ≈ 2.828.',
        practice: {
          prompt:
            'Compute S from correlations 0.70, 0.71, 0.69, and −0.70, in the order in the formula.',
          answer:
            'S = 0.70 + 0.71 + 0.69 − (−0.70) = 2.80. Statistical uncertainty and experimental assumptions still need assessment.',
        },
        question: 'Which ideal CHSH value exceeds the local hidden-variable bound?',
        answers: ['1', '2.8', '0'],
        correct: 1,
        why: 'The local bound is |S| ≤ 2. A value near 2.8 is compatible with quantum predictions using appropriate measurements.',
      },
    ],
  },
];
