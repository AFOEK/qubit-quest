import type { Lesson } from './types';

export const searchAndWalkLessons: Lesson[] = [
  {
    id: 'grover-geometry',
    title: 'Grover’s algorithm: geometry and iteration counts',
    time: 10,
    level: 'Core',
    topics: ['Grover’s algorithm', 'Search', 'Oracle queries', 'Grover iterations'],
    body: [
      'Build on Algorithm I’s four-item demonstration. A phase oracle marks M solutions among N candidates, while diffusion reflects about the uniform state. Together these reflections rotate the state toward the solution subspace.',
      'Success oscillates rather than increasing forever. Choose the iteration count using the marked fraction, or use a method designed for an unknown solution count. The familiar quadratic query improvement assumes an available coherent oracle; constructing that oracle and preparing inputs still cost resources.',
    ],
    math: {
      formula: 'sin²θ = M/N;  Psuccess(r) = sin²[(2r+1)θ];  r ≈ π/(4θ) − 1/2',
      explanation:
        'r is a nonnegative integer chosen near the first success peak. The nearest useful integer depends on M/N; extra iterations can overshoot.',
    },
    example:
      'For N = 8 and M = 1, two Grover iterations give success probability 121/128 ≈ 94.5%. The existing N = 4, M = 1 lab reaches 100% after one iteration.',
    practice: {
      prompt: 'For N = 4 and M = 1, calculate success after zero, one, and two iterations.',
      answer:
        'θ = π/6. The probabilities are sin²(π/6) = 1/4, sin²(π/2) = 1, and sin²(5π/6) = 1/4. A second iteration overshoots.',
    },
    question: 'Why can running more Grover iterations reduce success?',
    answers: [
      'The oracle deletes valid solutions',
      'The state rotates past the solution direction',
      'Hadamard gates stop being unitary',
    ],
    correct: 1,
    why: 'The two reflections generate a rotation. Success follows sin²[(2r+1)θ], so it rises and falls.',
    lab: { kind: 'algorithm', name: 'grover' },
    followUp: ['amplitude-amplification'],
  },
  {
    id: 'amplitude-amplification',
    title: 'Amplitude amplification beyond uniform search',
    time: 10,
    level: 'Core',
    topics: ['Amplitude amplification', 'Good-state reflections', 'State preparation'],
    body: [
      'Amplitude amplification generalizes Grover search to a state prepared by any suitable unitary A. Mark a useful outcome as “good” and coherently reflect both about that outcome subspace and about the prepared state.',
      'If the starting success probability is a, amplification can increase it using A, its inverse, and a coherent good-state test. This applies to structured searches and subroutines with biased starting distributions. It is more than repeating a classical trial because the reflections preserve coherence between attempts.',
    ],
    math: {
      formula: 'A|0⟩ = sin θ|good⟩ + cos θ|bad⟩;  Q = −A S₀ A† Sgood;  a = sin²θ',
      explanation:
        'S₀ = I−2|0⟩⟨0| and Sgood = I−2Πgood. These reflections give the same sin²[(2r+1)θ] success rule as Grover.',
    },
    example:
      'Let A = RY(π/3) on one qubit and mark |1⟩ as good. Initially a = 1/4. One ideal amplification iteration raises the success probability to 1, even though A is not a uniform multi-qubit Hadamard preparation.',
    practice: {
      prompt:
        'Why is access only to samples from A insufficient for this reflection-based implementation?',
      answer:
        'The implementation needs coherent A, A†, and a good-state phase oracle. A classical sampler does not supply an inverse circuit or coherent reflections.',
    },
    question:
      'What does amplitude amplification allow that the simplest Grover presentation does not assume?',
    answers: [
      'An arbitrary suitable starting unitary A',
      'Copying unknown quantum states',
      'Free access to every classical input',
    ],
    correct: 0,
    why: 'It amplifies a good component of a general prepared state, provided the needed coherent operations are available.',
    followUp: ['qae'],
  },
  {
    id: 'quantum-random-walks',
    title: 'Quantum random walks: coherent motion on a graph',
    time: 10,
    level: 'Introduction',
    topics: [
      'Quantum random walks',
      'Quantum walks',
      'Discrete-time walks',
      'Continuous-time walks',
    ],
    body: [
      'A classical random walk samples transitions between graph vertices. An unmeasured quantum walk evolves amplitudes coherently, so paths can interfere. A discrete-time coined walk alternates a coin unitary and a shift; a continuous-time walk evolves under a graph-based Hamiltonian.',
      'Walks support specialized search and graph algorithms, but the useful behavior depends on the graph, initial state, and measurement rule. Measuring position after every step changes the process and can remove the interference that makes the walk quantum. The current lab does not implement a graph-walk simulator.',
    ],
    math: {
      formula: 'Ustep = S(C ⊗ I);  |ψ(t)⟩ = exp(−iγGt)|ψ(0)⟩',
      explanation:
        'C acts on a coin register, S shifts conditionally, and G is a graph adjacency matrix in this continuous-time convention. Units set ħ = 1.',
    },
    example:
      'For two vertices connected by one edge, G = X. Starting at vertex 0 gives P(1,t) = sin²(γt): the particle is certainly at vertex 1 when γt = π/2 and returns to vertex 0 when γt = π.',
    practice: {
      prompt: 'For this two-vertex continuous-time walk, find P(1,t) when γt = π/4.',
      answer:
        'P(1,t) = sin²(π/4) = 1/2. The coherent state still contains phase information that a position histogram alone omits.',
    },
    question: 'What lets paths reinforce or cancel in an unmeasured quantum walk?',
    answers: [
      'Classical probabilities becoming negative',
      'Reading every intermediate vertex',
      'Coherent amplitudes and relative phase',
    ],
    correct: 2,
    why: 'Amplitudes interfere before a final measurement converts them to probabilities.',
  },
];

export const amplitudeEstimationLesson: Lesson = {
  id: 'qae',
  title: 'QAE: estimate an amplitude using eigenphases',
  time: 12,
  level: 'Core',
  topics: ['Quantum amplitude estimation', 'QAE', 'Amplitude estimation', 'Monte Carlo estimation'],
  body: [
    'Suppose A prepares a state whose good outcome has probability a. Amplitude estimation estimates a rather than merely producing a good outcome. The standard construction applies QPE to the amplitude-amplification operator, whose eigenphases encode the angle θ with a = sin²θ.',
    'In the ideal coherent-query model, standard QAE can reach additive error ε with order 1/ε oracle uses, compared with order 1/ε² independent classical samples at fixed confidence. Controlled powers, state loading, and noise can dominate actual cost. Iterative variants avoid the QFT while retaining a need for suitable coherent queries and statistical analysis.',
  ],
  math: {
    formula: 'Q eigenvalues: e±²ⁱθ;  φ = θ/π or 1−θ/π;  â = sin²(πφ̂)',
    explanation:
      'Q is the reflection operator from amplitude amplification. Either eigenphase branch yields the same good-outcome probability.',
  },
  example:
    'If a = 1/2, then θ = π/4. QPE can return phase 1/4 or 3/4; both decode to sin²(π/4) = 1/2. Two evaluation bits represent these phases exactly in this ideal case.',
  practice: {
    prompt:
      'A phase estimate is φ̂ = 1/6. What amplitude probability does it imply, and would φ̂ = 5/6 give a different value?',
    answer:
      'â = sin²(π/6) = 1/4. Phase 5/6 gives sin²(5π/6) = 1/4 too; the phase branches encode the same probability.',
  },
  question: 'How does QAE differ from amplitude amplification?',
  answers: [
    'QAE makes every oracle implementation free',
    'QAE estimates the good-outcome probability',
    'QAE copies the full amplitude vector into classical memory',
  ],
  correct: 1,
  why: 'Amplification increases success probability; estimation learns its numerical value using phase information or related inference methods.',
};
