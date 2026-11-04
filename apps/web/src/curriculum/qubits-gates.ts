import type { Course } from './types';

export const qubitsAndGates: Course[] = [
  {
    id: 'qubits',
    title: 'Qubits Theories',
    track: 'fundamentals',
    icon: '◉',
    color: 'mint',
    description:
      'Translate the mechanics into a working qubit model: Hilbert space, superposition, interference, the Bloch sphere, decoherence, and superdense coding.',
    prerequisites: ['quantum-mechanics'],
    outcomes: [
      'Interpret a qubit state and its Bloch vector.',
      'Distinguish coherence from classical uncertainty.',
      'Trace how shared entanglement supports superdense coding.',
    ],
    lessons: [
      {
        id: 'first-qubit',
        title: 'Meet your first qubit: Hilbert space',
        time: 6,
        level: 'Introduction',
        topics: ['Qubits', 'Hilbert space', 'Quantum states'],
        body: [
          'A classical bit has value 0 or 1. A pure qubit state is a normalized vector in a two-dimensional complex Hilbert space. Hilbert space supplies vector addition and an inner product, so we can calculate overlaps and probabilities.',
          'The basis vectors |0⟩ and |1⟩ are reference states. A physical qubit might use two energy levels of an atom or a superconducting circuit. Its state-space dimension is two regardless of the device’s physical shape.',
        ],
        math: {
          formula: '|ψ⟩ = α|0⟩ + β|1⟩ ∈ ℂ²;  |α|² + |β|² = 1',
          explanation:
            'Two complex amplitudes describe a pure qubit; normalization and an unobservable global phase remove redundant parameters.',
        },
        example:
          'For |0⟩, α = 1 and β = 0. A Z-basis measurement always returns 0. X swaps the amplitudes to prepare |1⟩.',
        practice: {
          prompt: 'A qubit has α = 3/5 and β = 4/5. Calculate the Z-basis probabilities.',
          answer: 'p(0) = 9/25 and p(1) = 16/25. They add to one.',
        },
        question: 'A qubit is prepared in |0⟩. What does a Z-basis measurement return?',
        answers: ['Always 0', 'Always 1', 'Half 0, half 1'],
        correct: 0,
        why: 'The squared magnitude of the |0⟩ amplitude is 1.',
        lab: { kind: 'gates', sequence: ['X'] },
      },
      {
        id: 'superposition',
        title: 'Superposition and interference',
        time: 6,
        level: 'Introduction',
        topics: ['Superposition', 'Interference', 'Coherence'],
        body: [
          'The Hadamard gate takes |0⟩ to |+⟩ = (|0⟩ + |1⟩)/√2. Both Z-basis outcomes have probability 1/2. Superposition is a coherent sum of amplitudes with a relative phase, rather than a hidden classical coin value.',
          'Interference adds amplitudes before taking squared magnitudes. Amplitudes can reinforce or cancel. A second Hadamard converts the phase relations into a certain 0 outcome. This is the mechanism that later algorithms arrange across many states.',
        ],
        math: {
          formula: 'H|0⟩ = |+⟩;  H|+⟩ = |0⟩;  H|−⟩ = |1⟩',
          explanation:
            '|−⟩ = (|0⟩ − |1⟩)/√2 differs from |+⟩ only in relative phase, yet H distinguishes them.',
        },
        example:
          'After H then H, the |1⟩ amplitude is (1 − 1)/2 = 0, and the |0⟩ amplitude is (1 + 1)/2 = 1.',
        practice: {
          prompt:
            'Compare H,H with H,Z,H in the gate explorer. Predict the final bit before opening the lab.',
          answer:
            'H,H produces 0 with certainty. H,Z,H produces 1 with certainty because Z changes |+⟩ to |−⟩.',
        },
        question: 'Apply H and then H to |0⟩. What is the final state?',
        answers: ['An unknown random bit', '|0⟩', '|1⟩'],
        correct: 1,
        why: 'H is its own inverse; destructive interference cancels the |1⟩ amplitude.',
        lab: { kind: 'gates', sequence: ['H', 'H'] },
      },
      {
        id: 'bloch-decoherence',
        title: 'Bloch sphere, mixtures, and decoherence',
        time: 8,
        level: 'Core',
        topics: ['Bloch sphere', 'Mixed states', 'Decoherence'],
        body: [
          'A pure qubit can be represented by a point on the Bloch sphere. The north and south poles are |0⟩ and |1⟩; equatorial points have equal Z-basis probabilities and different relative phases. Mixed states occupy the interior.',
          'Decoherence describes loss of quantum coherence through interaction with an environment. A 50/50 classical mixture of |0⟩ and |1⟩ is at the center, unlike the pure state |+⟩ on the equator. Their Z histograms match, but X measurements distinguish them.',
        ],
        math: {
          formula: '|ψ⟩ = cos(θ/2)|0⟩ + eⁱφ sin(θ/2)|1⟩;  ρ = (I + xX + yY + zZ)/2',
          explanation:
            'θ and φ locate a pure state; a mixed-state Bloch vector has length less than one. ρ is a density matrix.',
        },
        example:
          '|+⟩ has Bloch vector (1,0,0). The maximally mixed state I/2 has (0,0,0). The browser explorer tracks pure states, so it does not simulate a decohering mixed state.',
        practice: {
          prompt: 'Compare measuring X on |+⟩ with measuring X on I/2.',
          answer: '|+⟩ always gives X eigenvalue +1. I/2 gives +1 and −1 equally often.',
        },
        question: 'Where is a maximally mixed single qubit on the Bloch sphere model?',
        answers: ['At the north pole', 'At every surface point at once', 'At the center'],
        correct: 2,
        why: 'Its X, Y, and Z expectation values are all zero.',
        lab: { kind: 'gates', sequence: ['H', 'S'] },
        followUp: ['damping-channels', 'depolarizing'],
      },
      {
        id: 'superdense-coding',
        title: 'Superdense coding: two bits, one sent qubit',
        time: 8,
        level: 'Introduction',
        topics: ['Superdense coding', 'Bell states', 'Quantum communication'],
        body: [
          'Alice and Bob first share a Bell pair. Alice chooses one of four local operations on her half, creating one of four orthogonal Bell states, then sends that qubit to Bob. Bob now holds both halves and decodes two classical bits.',
          'The resource accounting matters: one entangled pair was distributed beforehand, and one qubit is physically transmitted during encoding. Neither local half by itself reveals the message. Bell-state preparation and decoding are developed in Algorithm I.',
        ],
        math: {
          formula: '(I ⊗ I)|Φ⁺⟩, (X ⊗ I)|Φ⁺⟩, (Z ⊗ I)|Φ⁺⟩, (XZ ⊗ I)|Φ⁺⟩',
          explanation:
            'These four operations on the first written subsystem yield four distinguishable Bell states, up to global phase.',
        },
        example:
          'X on the first written qubit maps (|00⟩ + |11⟩)/√2 to (|10⟩ + |01⟩)/√2. Bob can distinguish this from the original state with a joint decoding circuit.',
        practice: {
          prompt:
            'What happens if Bob measures only his original half before Alice sends her qubit?',
          answer:
            'He sees the same maximally mixed state for every message. He needs both qubits to decode.',
        },
        question:
          'What additional resource lets one transmitted qubit encode two classical bits here?',
        answers: [
          'A previously shared Bell pair',
          'A faster-than-light channel',
          'An extra classical bit hidden in measurement',
        ],
        correct: 0,
        why: 'Pre-shared entanglement plus transmission and joint decoding enable the protocol.',
        followUp: ['bell-states'],
      },
    ],
  },
  {
    id: 'gates-1',
    title: 'Gates I',
    track: 'fundamentals',
    icon: '↻',
    color: 'mint',
    description:
      'Build a circuit vocabulary with Pauli gates, Hadamard, controlled operations, Toffoli, SWAP, and measurement.',
    prerequisites: ['qubits'],
    outcomes: [
      'Predict X, Y, Z, and H on simple states.',
      'Read controlled gates and distinguish them from measurement.',
      'Track reversible logic and changes of measurement basis.',
    ],
    lessons: [
      {
        id: 'pauli-gates',
        title: 'X, Y, and Z: the Pauli gates',
        time: 6,
        level: 'Core',
        topics: ['X gate', 'Y gate', 'Z gate'],
        body: [
          'X exchanges |0⟩ and |1⟩. Z leaves |0⟩ unchanged and multiplies |1⟩ by −1. Y combines a flip with phases: Y|0⟩ = i|1⟩ and Y|1⟩ = −i|0⟩.',
          'Phase changes may be invisible to an immediate Z measurement. Their effect appears when another gate mixes the amplitudes. Each Pauli gate is its own inverse. On the Bloch sphere, each is a π rotation about its named axis, up to global phase.',
        ],
        math: {
          formula: 'X = [[0,1],[1,0]];  Y = [[0,−i],[i,0]];  Z = [[1,0],[0,−1]]',
          explanation:
            'Each row gives one output amplitude after multiplying the input state column.',
        },
        example:
          'Z|+⟩ = |−⟩. Both states have 50/50 Z outcomes, but H maps them to different computational basis states.',
        practice: {
          prompt: 'Run H,Z,H. Then replace Z with X. Explain the final Z-basis probabilities.',
          answer: 'H,Z,H gives |1⟩. H,X,H gives |0⟩ because X|+⟩ = |+⟩.',
        },
        question: 'Apply Z to |+⟩. What changes immediately?',
        answers: [
          'Only the relative phase',
          'The chance of 0 becomes 100%',
          'The qubit is measured',
        ],
        correct: 0,
        why: 'Z changes |+⟩ to |−⟩ without changing their Z-basis probabilities.',
        lab: { kind: 'gates', sequence: ['H', 'Z'] },
      },
      {
        id: 'hadamard-gate',
        title: 'H: change basis with Hadamard',
        time: 6,
        level: 'Core',
        topics: ['H gate', 'Hadamard gate', 'Basis changes'],
        body: [
          'H maps the computational basis to the X basis: |0⟩ becomes |+⟩ and |1⟩ becomes |−⟩. Applying it twice returns the original state. It does not create randomness by itself; randomness appears when a measurement samples its output.',
          'Putting H before a Z measurement measures the original qubit in the X basis. Basis changes are central to interference algorithms and to measuring Hamiltonian terms in chemistry.',
        ],
        math: {
          formula: 'H = (1/√2)[[1,1],[1,−1]];  HZH = X;  H² = I',
          explanation: 'Conjugating by H exchanges the roles of X and Z.',
        },
        example:
          'To distinguish |+⟩ and |−⟩, apply H then measure Z. The results are 0 and 1 respectively with certainty.',
        practice: {
          prompt: 'Prepare |1⟩ with X. Apply H twice. Which bit is measured?',
          answer: '1. The two H gates cancel, leaving the initial X preparation.',
        },
        question: 'Which gate before a Z measurement lets you measure in the X basis?',
        answers: ['Z', 'H', 'X'],
        correct: 1,
        why: 'H maps X eigenstates |+⟩ and |−⟩ onto computational basis states.',
        lab: { kind: 'gates', sequence: ['X', 'H', 'H'] },
        followUp: ['hadamard-transform', 'measuring-observables'],
      },
      {
        id: 'controlled-gates',
        title: 'CX, CY, and CZ: coherent controls',
        time: 8,
        level: 'Core',
        topics: ['CX gate', 'CY gate', 'CZ gate', 'Controlled gates'],
        body: [
          'A controlled-U applies U to a target when the control basis value is 1, and does nothing when it is 0. It acts coherently on a superposed control; there is no intermediate readout or classical if statement.',
          'CX flips a target, CY applies Y including its phases, and CZ applies a −1 phase to |11⟩. A controlled gate can create entanglement from a product input, although it does not entangle every possible input.',
        ],
        math: {
          formula: 'CU = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ U',
          explanation:
            'This formula writes control first and target second. In the Qiskit lab, CX(0,1) uses q₀ as control and q₁ as target.',
        },
        example:
          'H on q₀ followed by CX(0,1) transforms |00⟩ into (|00⟩ + |11⟩)/√2. The Bell experiment runs exactly this preparation.',
        practice: {
          prompt: 'Using written order |control,target⟩, apply CX, CY, and CZ separately to |10⟩.',
          answer:
            'CX gives |11⟩. CY gives i|11⟩. CZ leaves |10⟩ unchanged. Track relative phase if the input is a superposition.',
        },
        question: 'Which basis component receives a minus sign from CZ?',
        answers: ['|00⟩', '|01⟩', '|11⟩'],
        correct: 2,
        why: 'CZ applies Z to the target only when the control is 1, so only |11⟩ gains −1.',
        lab: { kind: 'algorithm', name: 'bell' },
      },
      {
        id: 'toffoli-swap',
        title: 'CCNOT and SWAP: reversible building blocks',
        time: 7,
        level: 'Core',
        topics: ['CCNOT', 'Toffoli gate', 'SWAP gate'],
        body: [
          'CCNOT, also called Toffoli or CCX, flips a target only when both control qubits are 1. It implements reversible Boolean logic and appears in arithmetic circuits such as those used by Shor’s algorithm.',
          'SWAP exchanges two qubit states, including their correlations with other systems. It does not copy a state. A common decomposition uses three CX gates, which can be costly on a noisy device.',
        ],
        math: {
          formula: 'CCX|a,b,c⟩ = |a,b,c ⊕ ab⟩;  SWAP|a,b⟩ = |b,a⟩',
          explanation:
            '⊕ is addition modulo two. The displayed state labels are in the written control/target order.',
        },
        example: 'CCX maps |110⟩ to |111⟩ and leaves |100⟩ unchanged. SWAP maps |01⟩ to |10⟩.',
        practice: {
          prompt: 'Apply CCX twice to |110⟩. Does this erase the controls?',
          answer:
            'The first gives |111⟩ and the second restores |110⟩. The controls are preserved, so the operation is reversible.',
        },
        question: 'What does SWAP do to two unknown qubit states?',
        answers: ['Exchanges them', 'Copies the first onto the second', 'Measures both'],
        correct: 0,
        why: 'SWAP exchanges the states without cloning them or reading them out.',
      },
      {
        id: 'measurement-gate',
        title: 'Measurement: from amplitudes to records',
        time: 7,
        level: 'Core',
        topics: ['Measurement', 'Projective measurement', 'Measurement basis'],
        body: [
          'A Z-basis measurement returns a classical bit with probabilities given by Born’s rule. Conditioned on the result, the qubit is in the corresponding basis state. Ignoring the result gives a mixture.',
          'Measurement is not a reversible unitary gate. It can remove coherence in the measured basis. To estimate a state’s statistics, prepare a fresh copy for each shot; repeatedly measuring the same unchanged qubit does not create fresh independent samples of its original state.',
        ],
        math: {
          formula: 'P(0) = ⟨ψ|P₀|ψ⟩,  P₀ = |0⟩⟨0|;  |ψ₀⟩ = P₀|ψ⟩/√P(0)',
          explanation:
            'The conditional-state formula applies when P(0) is nonzero. P₀ projects onto the 0 outcome.',
        },
        example:
          'Prepare |+⟩, measure Z, and obtain 1. A second Z measurement with no intervening operation returns 1 with certainty.',
        practice: {
          prompt: 'How do you estimate ⟨X⟩ with hardware that measures Z?',
          answer:
            'Prepare a fresh state each shot, apply H, measure Z, and average +1 for 0 and −1 for 1.',
        },
        question:
          'What happens after obtaining 1 from a Z measurement and immediately measuring Z again?',
        answers: ['The result must flip', 'The result is 1 again', 'It is always 50/50'],
        correct: 1,
        why: 'The first measurement prepares the corresponding eigenstate, assuming no intervening noise or gates.',
      },
    ],
  },
  {
    id: 'gates-2',
    title: 'Gates II',
    track: 'fundamentals',
    icon: '∠',
    color: 'mint',
    description:
      'Move from fixed gates to rotations, phase gates and their daggers, arbitrary unitaries, and the square root of X.',
    prerequisites: ['gates-1'],
    outcomes: [
      'Calculate parameterized single-qubit rotations.',
      'Distinguish relative phase from global phase and invert S and T.',
      'Check unitarity and understand SX compositions.',
    ],
    lessons: [
      {
        id: 'rotation-gates',
        title: 'RX, RY, and RZ: angles become gates',
        time: 8,
        level: 'Core',
        topics: ['RX gate', 'RY gate', 'RZ gate', 'Rotation gates'],
        body: [
          'Rotation gates turn a Bloch vector about the X, Y, or Z axis by an angle θ in radians. RX can introduce imaginary amplitudes; RY has real entries; RZ changes phase without changing Z-basis probabilities immediately.',
          'The half-angle in the matrix is essential. RX(π) equals X up to a global phase, while RX(2π) gives a global −1. These rotations provide adjustable parameters for variational algorithms. This lesson’s arithmetic practice is separate from the fixed-gate browser explorer.',
        ],
        math: {
          formula: 'Rₐ(θ) = cos(θ/2)I − i sin(θ/2)σₐ;  RY(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩',
          explanation: 'σₐ is X, Y, or Z. For RZ, the diagonal entries are e⁻ⁱθ/² and eⁱθ/².',
        },
        example:
          'RY(π/2)|0⟩ = |+⟩ and RY(π)|0⟩ = |1⟩. RX(π)|0⟩ = −i|1⟩, which has the same measurement predictions as |1⟩.',
        practice: {
          prompt: 'Find p(1) after RY(π/3) on |0⟩.',
          answer: 'p(1) = sin²(π/6) = 1/4; p(0) = 3/4.',
        },
        question: 'What is p(1) after RY(π) on |0⟩?',
        answers: ['0', '1/2', '1'],
        correct: 2,
        why: 'sin²(π/2) = 1. The rotation reaches the south pole of the Bloch sphere.',
      },
      {
        id: 'phase-daggers',
        title: 'S, T, S dagger, and T dagger',
        time: 8,
        level: 'Core',
        topics: ['S gate', 'T gate', 'S dagger', 'T dagger', 'Phase gates'],
        body: [
          'S multiplies the |1⟩ amplitude by i, a phase of π/2. T multiplies it by eⁱπ/⁴. They preserve Z-basis probabilities but alter later interference. T² = S and S² = Z.',
          'A dagger means conjugate transpose. For a unitary it is the inverse: S† removes an S phase and T† removes a T phase. Qiskit names these gates sdg and tdg. Here you can test their identities using repeated S or T in the explorer.',
        ],
        math: {
          formula: 'S = diag(1,i);  T = diag(1,eⁱπ/⁴);  S†S = T†T = I',
          explanation: 'S† = diag(1,−i) = S³ and T† = diag(1,e⁻ⁱπ/⁴) = T⁷.',
        },
        example: 'H,S,S,H prepares |1⟩ because S² = Z. Eight T gates compose to I.',
        practice: {
          prompt:
            'Starting in |+⟩, apply S then S†. What state returns? How could the current explorer reproduce S†?',
          answer: 'The result is |+⟩. Three S gates implement S†, so four S gates together give I.',
        },
        question: 'Which operation undoes a T gate?',
        answers: ['T†', 'Another T', 'Measurement'],
        correct: 0,
        why: 'T†T = I. T² = S, so a second T does not undo the first.',
        lab: { kind: 'gates', sequence: ['H', 'S', 'S', 'H'] },
      },
      {
        id: 'unitary-gates',
        title: 'Unitary gates and inverse circuits',
        time: 8,
        level: 'Core',
        topics: ['Unitary', 'Unitary matrices', 'Circuit inverses'],
        body: [
          'A unitary matrix preserves inner products, normalization, and distinguishability. Its inverse is its conjugate transpose. Every ideal closed-system gate must be unitary; an arbitrary matrix need not be a physically valid gate.',
          'To invert a circuit, reverse the gate order and replace every gate by its inverse. Matrix multiplication generally does not commute: changing execution order can change the state. General single-qubit unitaries can be assembled from rotations and a global phase.',
        ],
        math: {
          formula: 'U†U = I;  (U₂U₁)† = U₁†U₂†',
          explanation:
            'A circuit executing U₁ then U₂ has total matrix U₂U₁, since matrices act on column vectors from the right.',
        },
        example:
          'Execute H then S. To undo it, execute S† then H. Executing H then S† instead generally gives a different result.',
        practice: {
          prompt: 'Invert the time-ordered circuit X, H, T.',
          answer: 'Apply T†, H, X in that execution order. H and X are their own inverses.',
        },
        question: 'Which property must a unitary matrix satisfy?',
        answers: ['All its entries are positive', 'U†U = I', 'It always makes 50/50 outcomes'],
        correct: 1,
        why: 'This identity guarantees norm preservation and gives U† as the inverse.',
      },
      {
        id: 'sx-gate',
        title: 'SX: the square root of X',
        time: 7,
        level: 'Core',
        topics: ['SX gate', 'Square root of X', 'Native gates'],
        body: [
          'SX is a gate whose square is X. It is common in hardware gate sets, where a compiler rewrites a circuit into available operations. A mathematical square root of a matrix is not found by taking the square root of each entry.',
          'Qiskit’s SX convention differs from RX(π/2) by a global phase. This is harmless for an isolated single-qubit operation, but global phases must be tracked when constructing controlled versions.',
        ],
        math: {
          formula: 'SX = ½[[1+i, 1−i], [1−i, 1+i]];  SX² = X;  SX = eⁱπ/⁴ RX(π/2)',
          explanation:
            'The convention also satisfies SX = HSH, which can be tried in the fixed-gate explorer.',
        },
        example:
          'SX|0⟩ = ((1+i)|0⟩ + (1−i)|1⟩)/2. Both Z outcomes have probability 1/2; applying SX again produces |1⟩.',
        practice: {
          prompt: 'Run H,S,H,H,S,H. Why is the final outcome 1?',
          answer:
            'Each H,S,H block is SX. Their product is SX² = X, so the circuit maps |0⟩ to |1⟩.',
        },
        question: 'Which gate equals two SX gates in succession?',
        answers: ['I', 'H', 'X'],
        correct: 2,
        why: 'SX is defined so that SX² = X in this convention.',
        lab: { kind: 'gates', sequence: ['H', 'S', 'H', 'H', 'S', 'H'] },
      },
    ],
  },
];
