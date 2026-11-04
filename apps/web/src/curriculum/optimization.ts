import type { Course } from './types';

export const appliedOptimization: Course[] = [
  {
    id: 'applied-optimization',
    title: 'Applied Optimization',
    track: 'applications',
    icon: '◇',
    color: 'peach',
    description:
      'Translate a classical objective and its constraints into QUBO and Ising costs, then verify the mapping before running QAOA or another solver.',
    prerequisites: ['algorithms-2'],
    outcomes: [
      'Construct a binary quadratic objective with explicit penalty terms.',
      'Convert binary variables to Ising spins and Pauli-Z operators.',
      'Validate a problem Hamiltonian by checking feasible assignments and exact small-instance energies.',
    ],
    lessons: [
      {
        id: 'qubo',
        title: 'QUBO: objectives, binary variables, and constraints',
        time: 11,
        level: 'Core',
        topics: [
          'QUBO',
          'Quadratic unconstrained binary optimization',
          'Constraint penalties',
          'Binary variables',
        ],
        body: [
          'A QUBO minimizes a quadratic polynomial in binary variables. Define what each bit means, write the objective, then absorb constraints into penalties. The resulting optimization is unconstrained in form even when its low-energy solutions are designed to satisfy the original constraints.',
          'State the coefficient convention. Here each pair coefficient appears once with i < j; a symmetric matrix in xᵀQx would split that coefficient between Qᵢⱼ and Qⱼᵢ. Penalties should outweigh benefits from violating constraints without needlessly overwhelming the useful objective scale.',
        ],
        math: {
          formula: 'C(x) = c + Σᵢ Qᵢᵢxᵢ + Σᵢ<ⱼ Qᵢⱼxᵢxⱼ;  xᵢ ∈ {0,1};  penalty = A(Σᵢ xᵢ − 1)²',
          explanation:
            'Because xᵢ² = xᵢ, the exactly-one constraint expands to a quadratic binary expression. A > 0 sets its penalty scale.',
        },
        example:
          'Choose exactly one of two options with costs 1 and 2. Using A = 3 gives C = x₀ + 2x₁ + 3(x₀+x₁−1)². Costs for assignments (0,0), (1,0), (0,1), (1,1) are 3, 1, 2, 6 respectively.',
        practice: {
          prompt: 'Expand the example into the one-pair-coefficient convention.',
          answer:
            'C = 3 − 2x₀ − x₁ + 6x₀x₁. The minimum is the feasible assignment (1,0) with cost 1.',
        },
        question: 'Why is it important to declare the QUBO matrix convention?',
        answers: [
          'A QUBO never has pair terms',
          'Otherwise pair coefficients can be double-counted',
          'It changes binary variables into photons',
        ],
        correct: 1,
        why: 'A symmetric xᵀQx includes both off-diagonal entries, while the stated i<j polynomial includes each pair once.',
        followUp: ['ising-mapping'],
      },
      {
        id: 'ising-mapping',
        title: 'Ising: from binary costs to Pauli Z',
        time: 11,
        level: 'Core',
        topics: ['Ising', 'Ising Hamiltonian', 'QUBO-to-Ising mapping', 'Pauli Z'],
        body: [
          'An Ising objective uses spins zᵢ ∈ {+1,−1}, with local fields and pair couplings. The substitution xᵢ = (1−zᵢ)/2 converts a QUBO into an equivalent Ising polynomial. Replacing spins with Pauli-Z operators produces a diagonal problem Hamiltonian.',
          'The computational states |0⟩ and |1⟩ have Z eigenvalues +1 and −1, so this convention maps bit 0 to spin +1. Keep the constant energy offset when comparing numerical costs. Also declare whether the original objective is minimized or maximized; a ground-state solver minimizes the Hamiltonian energy.',
        ],
        math: {
          formula: 'xᵢ = (1−zᵢ)/2;  Hcost = c₀I + Σᵢ hᵢZᵢ + Σᵢ<ⱼ JᵢⱼZᵢZⱼ',
          explanation:
            'Each computational-basis eigenvalue equals its mapped classical cost when the offset and sign are included consistently.',
        },
        example:
          'The cost C = x₀+x₁−2x₀x₁ becomes H = (I−Z₀Z₁)/2. Equal bits have energy 0; different bits have energy 1. To maximize this cut value with a ground-energy objective, minimize −H instead.',
        practice: {
          prompt: 'For H = (I−Z₀Z₁)/2, calculate the energy of assignments (0,0) and (0,1).',
          answer:
            '(0,0) has z₀z₁ = +1, so energy 0. (0,1) has z₀z₁ = −1, so energy 1. Qiskit display strings place q₀ on the right; keep assignment indices explicit.',
        },
        question: 'Under xᵢ = (1−zᵢ)/2, which spin represents binary value 1?',
        answers: ['zᵢ = −1', 'zᵢ = +1', 'zᵢ = 0'],
        correct: 0,
        why: 'Substituting zᵢ = −1 gives xᵢ = (1+1)/2 = 1.',
      },
      {
        id: 'classical-problem-hamiltonians',
        title: 'Map a classical problem to a Hamiltonian',
        time: 12,
        level: 'Application',
        topics: [
          'Mapping classical problems to Hamiltonians',
          'Problem Hamiltonians',
          'Maximum-weight independent set',
          'Penalty validation',
        ],
        body: [
          'Make the modeling chain explicit: define decision bits, encode the objective, add penalties, convert to Pauli operators, and check the resulting energies before choosing a solver. A quantum optimizer cannot repair an incorrectly modeled objective.',
          'For maximum-weight independent set, bit xᵢ selects a vertex. Reward selected weights with negative costs and penalize selecting both endpoints of an edge. Enumerate a tiny instance to check the feasible optimum, then compare any sampled quantum candidates with the original constraints and a classical baseline.',
        ],
        math: {
          formula:
            'C(x) = −Σᵢ wᵢxᵢ + A Σ₍ᵢⱼ₎ xᵢxⱼ;  choose A > maxᵢ wᵢ for this positive-weight edge-penalty model',
          explanation:
            'If adjacent vertices are selected, removing an offending selected vertex saves at least A while losing at most its weight, so a minimizer is feasible under this sufficient condition.',
        },
        example:
          'For one edge, weights (1,2), and A = 3: C = −x₀−2x₁+3x₀x₁. The mapped Hamiltonian is −0.75I−0.25Z₀+0.25Z₁+0.75Z₀Z₁. Assignment (0,1) has energy −2 and is the optimal feasible selection.',
        practice: {
          prompt:
            'Enumerate costs for assignments (0,0), (1,0), (0,1), (1,1). Does selecting both vertices help?',
          answer:
            'The costs are 0, −1, −2, and 0. Selecting both violates the edge constraint and is worse than selecting only the weight-two vertex. The constant offset ensures the mapped quantum energies match these costs.',
        },
        question: 'What should be checked before running QAOA on a new problem Hamiltonian?',
        answers: [
          'Only whether the circuit has many qubits',
          'Whether every coefficient is positive',
          'Whether low energies represent the intended feasible classical solutions',
        ],
        correct: 2,
        why: 'Correct objectives, signs, variable conventions, and penalties are prerequisites for interpreting solver output.',
        followUp: ['qaoa'],
      },
    ],
  },
];
