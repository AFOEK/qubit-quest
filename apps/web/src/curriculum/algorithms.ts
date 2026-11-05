import type { Course } from './types';
import { searchAndWalkLessons, amplitudeEstimationLesson } from './algorithm-extensions';

export const algorithms: Course[] = [
  {
    id: 'algorithms-1',
    title: 'Algorithm I',
    track: 'fundamentals',
    icon: '∞',
    color: 'blue',
    description:
      'Construct entangled states, then use oracles and interference to reveal hidden structure. Specialized hidden-problem lessons introduce their promises and limits rather than assuming a full complexity-theory background.',
    prerequisites: ['software-compilation'],
    outcomes: [
      'Build Bell and GHZ states and predict their measurements.',
      'Explain the promises behind Deutsch–Jozsa, Bernstein–Vazirani, and Simon.',
      'Recognize subgroup, shift, and linear-function problems and oracle costs.',
    ],
    lessons: [
      {
        id: 'bell-states',
        title: 'Build and decode the four Bell states',
        time: 8,
        level: 'Core',
        topics: ['Entanglement', 'Bell’s state', 'Bell states', 'Bell-state preparation'],
        body: [
          'Now build the entanglement introduced in Quantum Mechanics. H on q₀ followed by CX(0,1) prepares |Φ⁺⟩. Applying local X and Z operations generates the other three Bell states. All four are maximally entangled.',
          'A Bell measurement reverses the preparation: apply CX(0,1) then H on q₀ and measure both qubits. This converts Bell-state labels to classical bits and supplies the decoder for superdense coding. The built-in Bell lab prepares |Φ⁺⟩.',
        ],
        math: {
          formula: '|Φ±⟩ = (|00⟩ ± |11⟩)/√2;  |Ψ±⟩ = (|01⟩ ± |10⟩)/√2',
          explanation:
            'The sign is a relative phase. Equal Z-basis histograms cannot distinguish + from − within each pair.',
        },
        example:
          'The |Φ⁺⟩ lab gives only 00 and 11, each with probability 1/2. Its individual qubits are mixed, with Bloch vector (0,0,0).',
        practice: {
          prompt:
            'Would a Z-basis histogram distinguish |Φ⁺⟩ from |Φ⁻⟩? What should you do instead?',
          answer:
            'No. Both give 00 and 11 equally. Apply the inverse Bell preparation and then measure, making their relative-phase difference observable.',
        },
        question: 'Which outcome can the ideal |Φ⁺⟩ Bell-pair lab produce?',
        answers: ['01', '10', '11'],
        correct: 2,
        why: 'Only 00 and 11 have nonzero amplitudes in |Φ⁺⟩.',
        lab: { kind: 'algorithm', name: 'bell' },
      },
      {
        id: 'ghz',
        title: 'GHZ: entangle three or more qubits',
        time: 8,
        level: 'Core',
        topics: ['GHZ state', 'Multipartite entanglement'],
        body: [
          'A Greenberger–Horne–Zeilinger state extends the Bell pattern to several qubits. Start with all zeros, apply H to one qubit, then CX from that qubit to each of the others.',
          'For three qubits, all Z outcomes agree. But if one qubit is lost and ignored, the remaining pair is a classical mixture of 00 and 11, without pairwise entanglement. This shows why multipartite entanglement needs more than a list of pair correlations.',
        ],
        math: {
          formula: '|GHZₙ⟩ = (|0…0⟩ + |1…1⟩)/√2',
          explanation:
            'For n = 3, use H(0), CX(0,1), CX(0,2). A relative minus sign changes phase-sensitive measurements.',
        },
        example:
          'In a three-qubit GHZ state, p(000) = p(111) = 1/2. A 001 count would indicate a departure from this ideal preparation or readout.',
        practice: {
          prompt: 'Write a four-qubit GHZ preparation starting from |0000⟩.',
          answer:
            'Apply H(0), then CX(0,1), CX(0,2), CX(0,3). The only ideal Z outcomes are 0000 and 1111.',
        },
        question: 'Which ideal Z outcome is possible for |GHZ₃⟩?',
        answers: ['111', '001', '010'],
        correct: 0,
        why: 'The GHZ₃ amplitudes are nonzero only at 000 and 111.',
      },
      {
        id: 'deutsch-jozsa',
        title: 'Deutsch–Jozsa: constant or balanced?',
        time: 9,
        level: 'Core',
        topics: ['Deutsch–Jozsa algorithm', 'Phase kickback', 'Oracles'],
        body: [
          'You are promised a Boolean function f on n bits is either constant or balanced: half its outputs are 0 and half are 1. The task is to decide which, using queries to a reversible oracle.',
          'Prepare the input in |+⟩ states and an output ancilla in |−⟩. The oracle kicks a factor (−1)ᶠ⁽ˣ⁾ onto each input. Apply H to the input again: all zeros means constant; any other result means balanced, under the promise and ideal operations. This compares exact oracle-query counts, not total practical runtime.',
        ],
        math: {
          formula: 'amplitude(0ⁿ) = (1/2ⁿ) Σₓ (−1)ᶠ⁽ˣ⁾',
          explanation:
            'Constant phases add to ±1. Balanced positive and negative terms cancel to zero.',
        },
        example:
          'For f(x) = x₀, the phases cancel and the final input register has a nonzero bit. For f(x) = 0, it returns all zeros.',
        practice: {
          prompt: 'For n = 2 and f values [0,1,1,0], calculate the final amplitude of 00.',
          answer: '(1 − 1 − 1 + 1)/4 = 0. This function is balanced.',
        },
        question:
          'Under the Deutsch–Jozsa promise, what does a final all-zero input register indicate?',
        answers: ['A balanced function', 'A constant function', 'An invalid oracle'],
        correct: 1,
        why: 'Only a constant function makes all the oracle phases identical and reconstructs |0ⁿ⟩.',
      },
      {
        id: 'bernstein-vazirani',
        title: 'Bernstein–Vazirani: recover a hidden string',
        time: 9,
        level: 'Core',
        topics: ['Bernstein–Vazirani algorithm', 'Binary dot product', 'Phase oracle'],
        body: [
          'The oracle computes fₛ(x) = s · x modulo two for an unknown bit string s. Each classical query returns one parity bit. Quantum phase kickback encodes the string into a pattern that a final Hadamard transform decodes.',
          'Prepare n input |+⟩ states and a |−⟩ output ancilla, query once, then apply H to each input. The ideal output is s. Building the oracle can still require many gates; the one-query statement assumes oracle access.',
        ],
        math: {
          formula: 'fₛ(x) = s₀x₀ ⊕ … ⊕ sₙ₋₁xₙ₋₁;  H⊗ⁿ[2⁻ⁿ/² Σₓ (−1)ˢ·ˣ|x⟩] = |s⟩',
          explanation: 'The binary dot product is parity, not an ordinary real-valued dot product.',
        },
        example:
          'For a written hidden string 101, the oracle parity uses the first and third written bits. The final ideal register is 101 in the same declared order.',
        practice: {
          prompt: 'Let s = 101 and x = 110 in written order. Find fₛ(x).',
          answer: '(1×1) ⊕ (0×1) ⊕ (1×0) = 1.',
        },
        question: 'What does the ideal Bernstein–Vazirani output register reveal?',
        answers: [
          'All values of an arbitrary function',
          'A molecular energy',
          'The hidden parity string s',
        ],
        correct: 2,
        why: 'The promise restricts the function to a linear parity, allowing interference to decode s.',
      },
      {
        id: 'simon',
        title: 'Simon’s problem: collect hidden constraints',
        time: 10,
        level: 'Core',
        topics: ['Simon’s problem', 'Simon’s algorithm', 'Linear equations over GF(2)'],
        body: [
          'Simon’s oracle is promised to satisfy f(x) = f(y) exactly when y = x or y = x ⊕ s, for a fixed nonzero hidden bit string s. The goal is to discover this XOR period.',
          'Hadamards, an oracle query, and another input Hadamard transform produce samples y satisfying y · s = 0 modulo two. Repeat to collect independent equations, solve them over binary arithmetic, and verify the candidate. One sample generally does not identify s.',
        ],
        math: {
          formula: 'y · s = 0 mod 2;  f(x) = f(x ⊕ s)',
          explanation:
            'Each measured y supplies a linear constraint. XOR is addition in the vector space over GF(2).',
        },
        example:
          'If s = 11, allowed y values are 00 and 11 because both have even binary dot product with s. The value 01 is forbidden ideally.',
        practice: {
          prompt:
            'For a three-bit s, samples 110 and 011 are obtained. Find the nonzero s consistent with both.',
          answer: 'The constraints give s₀ = s₁ and s₁ = s₂, so s = 111.',
        },
        question: 'What does each ideal Simon sample provide?',
        answers: [
          'A constraint orthogonal to s',
          'The full truth table',
          'A copy of the hidden string every time',
        ],
        correct: 0,
        why: 'Interference suppresses y with y · s = 1; repeated samples supply equations for classical post-processing.',
      },
      {
        id: 'hidden-subgroup',
        title: 'Hidden subgroup problem: the common pattern',
        time: 9,
        level: 'Introduction',
        topics: ['Hidden subgroup problem', 'Abelian groups', 'Cosets'],
        body: [
          'A group supplies a consistent way to combine elements. A subgroup is a subset closed under that operation. In the hidden subgroup problem, an oracle is constant on each coset of a hidden subgroup and distinct on different cosets.',
          'Simon’s XOR period and the periodic functions used by Shor fit this framework. Fourier sampling is powerful for many abelian groups. This introduction does not imply efficient algorithms for every nonabelian hidden subgroup problem.',
        ],
        math: {
          formula: 'f(g₁) = f(g₂) ⇔ g₁H = g₂H',
          explanation:
            'H denotes the hidden subgroup here, not a Hadamard gate. A coset gH is a translated copy of that subgroup.',
        },
        example:
          'In integers modulo 8 under addition, H = {0,4}. An oracle hiding H has matching outputs for pairs {0,4}, {1,5}, {2,6}, and {3,7}, distinct between pairs.',
        practice: {
          prompt: 'For that modulo-8 example, list the coset containing 2.',
          answer: '2 + H = {2,6}, using arithmetic modulo 8.',
        },
        question:
          'Does the hidden subgroup framework guarantee an efficient quantum solution for every group?',
        answers: [
          'Yes, by definition',
          'No, the group structure matters',
          'Only if the group is written in binary',
        ],
        correct: 1,
        why: 'Known efficient Fourier-sampling methods do not solve all nonabelian cases.',
        followUp: ['shor'],
      },
      {
        id: 'hidden-shift',
        title: 'Hidden shift: find a displaced function',
        time: 9,
        level: 'Introduction',
        topics: ['Hidden shift problem', 'Function promises', 'Fourier methods'],
        body: [
          'In a hidden shift problem, two related functions differ by an unknown translation s. Given appropriate access to both, the task is to recover that shift. The group operation might be XOR or modular addition.',
          'The complexity depends strongly on the functions, group, and oracle access. Special promised functions admit useful quantum algorithms; arbitrary hidden shifts are not automatically easy. This differs from Simon, which seeks a period of one function.',
        ],
        math: {
          formula: 'g(x) = f(x ⊕ s)  (on bit strings)',
          explanation:
            'On cyclic groups, replace XOR with addition modulo N. The goal is the translation s, not all function values.',
        },
        example:
          'Over integers modulo 4, let f = [a,b,c,d] and g(x) = f(x+1). Then g = [b,c,d,a] and the shift is 1 with this convention.',
        practice: {
          prompt: 'With f = [a,b,c,d] and g = [c,d,a,b] modulo 4, find s in g(x) = f(x+s).',
          answer: 's = 2. Declaring the direction of the shift avoids sign ambiguity.',
        },
        question: 'Which statement describes a hidden shift task?',
        answers: [
          'Minimize any circuit’s energy',
          'Copy an unknown quantum state',
          'Recover the translation relating two promised functions',
        ],
        correct: 2,
        why: 'The shift relates function arguments; the promises determine whether recovery is efficient.',
      },
      {
        id: 'hidden-linear-function',
        title: 'Hidden linear function: a structured relation',
        time: 10,
        level: 'Introduction',
        topics: ['Hidden linear function problem', 'Quadratic forms', 'Circuit depth'],
        body: [
          'The hidden linear function problem used in shallow-circuit research starts with a binary quadratic form specified by a symmetric binary matrix A. It asks for a bit string z that represents the form as a linear function on a particular subspace.',
          'This is a relation problem: several z values may be valid. It differs from Bernstein–Vazirani’s unknown parity string. Some restricted instances separate shallow quantum circuits from bounded-fan-in classical circuits, a more specific statement than a general runtime advantage.',
        ],
        math: {
          formula: 'qₐ(x) = xᵀAx mod 4;  Lₐ = {x : Ax = 0 mod 2};  qₐ(x) = 2zᵀx mod 4 on Lₐ',
          explanation:
            'Use integer arithmetic before reducing q modulo 4. On Lₐ, the quadratic form restricts to an even-valued linear function.',
        },
        example:
          'For the 3×3 matrix with zero diagonal and ones everywhere else, Lₐ = {000,111}. Here qₐ(111) = 6 mod 4 = 2, so z must have odd parity. Strings 100, 010, 001, and 111 are all valid outputs.',
        practice: {
          prompt: 'For A = [[1,0],[0,0]], find Lₐ and a valid z.',
          answer:
            'Lₐ consists of 00 and 01 in written vector order. q is zero there, so z = 00 is valid; z = 10 is also valid.',
        },
        question:
          'How does this hidden linear function formulation differ from Bernstein–Vazirani?',
        answers: [
          'It asks for any valid linear representative on a specified subspace',
          'It always returns a unique unknown parity string',
          'It uses no mathematical promise',
        ],
        correct: 0,
        why: 'The task is a relation defined by A and its associated subspace, rather than recovering a unique oracle string.',
      },
      {
        id: 'grover-search',
        title: 'Find it with Grover: the introductory picture',
        time: 8,
        level: 'Introduction',
        topics: ['Grover’s algorithm', 'Amplitude amplification', 'Search'],
        body: [
          'Keep the original app’s search experiment as a bridge from phase oracles to amplitude amplification. Search four candidates with one marked item, 11. The oracle flips its phase; diffusion turns the phase pattern into a larger solution amplitude.',
          'One iteration gives probability 1 for 11 in this ideal two-qubit example. In larger spaces the iteration count matters; too many iterations overshoot. Oracle implementation and readout costs matter when evaluating a real application.',
        ],
        math: {
          formula: 'D = 2|s⟩⟨s| − I;  |s⟩ = (1/√N) Σₓ |x⟩',
          explanation:
            'The diffusion operator reflects about the uniform state. Alternating reflections rotates amplitude toward the marked subspace.',
        },
        example:
          'For N = 4 and one solution, the initial solution probability is 1/4. One oracle-plus-diffusion iteration raises it to 1.',
        practice: {
          prompt:
            'Run the four-item Grover lab and compare exact probabilities with the 1,024 sampled counts.',
          answer:
            'The ideal probability of 11 is 1, so all shots should be 11 up to numerical rounding in the exact amplitudes.',
        },
        question: 'What does the phase oracle do to the marked basis state?',
        answers: ['Measures it', 'Flips its phase', 'Deletes the other states'],
        correct: 1,
        why: 'The oracle marks by phase; diffusion amplifies the resulting amplitude pattern.',
        lab: { kind: 'algorithm', name: 'grover' },
        followUp: ['grover-geometry', 'amplitude-amplification'],
      },
    ],
  },
  {
    id: 'algorithms-2',
    title: 'Algorithm II',
    track: 'fundamentals',
    icon: '≋',
    color: 'blue',
    description:
      'Develop Grover search, amplitude amplification, and quantum walks, then connect Fourier transforms and phase estimation to QAE, period finding, and parameterized circuits.',
    prerequisites: ['algorithms-1'],
    outcomes: [
      'Choose Grover iteration counts and distinguish amplification from amplitude estimation.',
      'Explain coherent quantum walks and their graph-dependent behavior.',
      'Distinguish the Hadamard transform from the QFT.',
      'Trace QPE and the quantum part of Shor’s algorithm.',
      'Define an ansatz, parameters, and a measured objective.',
    ],
    lessons: [
      {
        id: 'hadamard-transform',
        title: 'Hadamard transform over bit strings',
        time: 8,
        level: 'Core',
        topics: ['Hadamard transform', 'Walsh–Hadamard transform', 'Binary Fourier transform'],
        body: [
          'Applying H independently to n qubits implements the Walsh–Hadamard transform. It is the Fourier transform over bit strings combined by XOR, the group (ℤ₂)ⁿ.',
          'This explains the shared interference pattern in Deutsch–Jozsa, Bernstein–Vazirani, and Simon. It differs from the QFT over integers modulo 2ⁿ, whose phases include more than just +1 and −1.',
        ],
        math: {
          formula: 'H⊗ⁿ|x⟩ = 2⁻ⁿ/² Σᵧ (−1)ˣ·ʸ |y⟩',
          explanation: 'The phase is determined by the parity of the binary dot product x · y.',
        },
        example:
          'For written x = 01, amplitudes in order 00,01,10,11 are [1,−1,1,−1]/2. The signs encode the input even though all probabilities are 1/4.',
        practice: {
          prompt: 'Write the signs for H⊗²|11⟩ in basis order 00,01,10,11.',
          answer: '[+,−,−,+], each with magnitude 1/2.',
        },
        question: 'Which group operation underlies the bit-string Hadamard transform?',
        answers: ['Ordinary real multiplication', 'Addition modulo 2ⁿ with carries', 'Bitwise XOR'],
        correct: 2,
        why: 'The characters of (ℤ₂)ⁿ have phases (−1)ˣ·ʸ.',
      },
      ...searchAndWalkLessons,
      {
        id: 'qft',
        title: 'QFT: read the rhythm of phases',
        time: 9,
        level: 'Core',
        topics: ['QFT', 'Quantum Fourier transform', 'Fourier basis'],
        body: [
          'The quantum Fourier transform maps computational basis labels to a regular phase pattern. Its circuit uses Hadamards, controlled phase rotations, and an ordering convention for the output qubits.',
          'For input |01⟩, the two-qubit QFT gives equal probabilities with different complex phases. A histogram alone misses this structure. The QFT is useful inside algorithms that turn periodic structure into measurable information; it does not output every Fourier coefficient as a classical table.',
        ],
        math: {
          formula: 'QFTₙ|x⟩ = (1/√N) Σᵧ₌₀ᴺ⁻¹ e²πⁱˣʸ/ᴺ |y⟩;  N = 2ⁿ',
          explanation:
            'For x = 1 and N = 4, the output amplitudes are [1,i,−1,−i]/2 in numerical basis order.',
        },
        example:
          'The QFT lab prepares |01⟩ and returns these four complex amplitudes alongside four equal probabilities. Expand the circuit and amplitude readout after running.',
        practice: {
          prompt: 'Predict the amplitudes for QFT on |00⟩. How do they differ from input |01⟩?',
          answer:
            'All four amplitudes are +1/2. The probabilities match the |01⟩ case, but the phase pattern differs.',
        },
        question: 'What distinguishes the QFT outputs for input |01⟩?',
        answers: ['Their phases', 'Their total probability', 'Their qubit count'],
        correct: 0,
        why: 'All four probabilities equal 1/4, but the complex amplitudes have different phases.',
        lab: { kind: 'algorithm', name: 'qft' },
      },
      {
        id: 'qpe',
        title: 'QPE: estimate a unitary eigenphase',
        time: 10,
        level: 'Core',
        topics: ['QPE', 'Quantum phase estimation', 'Controlled powers', 'Inverse QFT'],
        body: [
          'Suppose U|u⟩ = e²πⁱφ|u⟩. Prepare an evaluation register in |+⟩ states and a target in |u⟩. Controlled powers U, U², U⁴, and so on kick the eigenphase into the evaluation register.',
          'An inverse QFT turns this phase pattern into an approximation of φ. If φ has an exact m-bit binary expansion, the ideal m-bit estimate is exact. Otherwise the result is a distribution near the phase. Preparing the eigenstate and implementing large controlled powers are major costs.',
        ],
        math: {
          formula: 'U|u⟩ = e²πⁱφ|u⟩;  φ ≈ k/2ᵐ',
          explanation:
            'The measured integer k encodes an m-bit phase estimate. Extra bits of resolution require larger controlled evolution powers.',
        },
        example:
          'For φ = 3/8 = 0.011₂, three evaluation qubits ideally return the binary fraction 011, with bit order interpreted according to the circuit convention.',
        practice: {
          prompt: 'What phase does a four-bit estimate 0101 represent?',
          answer: '5/16 = 0.3125, when the string is written in most-significant-bit order.',
        },
        question: 'Which transform decodes the standard QPE evaluation register?',
        answers: ['A SWAP alone', 'The inverse QFT', 'A measurement before the controlled powers'],
        correct: 1,
        why: 'The inverse QFT converts the phase gradient into an estimate in the computational basis.',
        followUp: ['qae', 'phase-estimation-energy'],
      },
      amplitudeEstimationLesson,
      {
        id: 'shor',
        title: 'Shor’s algorithm: period finding to factors',
        time: 11,
        level: 'Core',
        topics: [
          'Shor’s algorithm',
          'Order finding',
          'Modular exponentiation',
          'Continued fractions',
        ],
        body: [
          'For a composite integer N, pick a coprime base a and find its order r: the smallest positive r with aʳ ≡ 1 mod N. Quantum order finding uses controlled modular arithmetic and phase estimation; classical continued fractions recover candidate periods.',
          'If r is even and aʳ/² is not −1 modulo N, greatest-common-divisor calculations can yield factors. Unhelpful choices require another attempt. Large-scale factoring needs fault-tolerant resources; a tiny compiled demonstration does not establish practical cryptographic capability.',
        ],
        math: {
          formula: 'aʳ ≡ 1 (mod N);  factors from gcd(aʳ/² ± 1, N)',
          explanation:
            'The classical reduction turns an appropriate even period into nontrivial divisors.',
        },
        example:
          'For N = 15 and a = 2, r = 4 because 2⁴ = 16 ≡ 1. gcd(4−1,15) = 3 and gcd(4+1,15) = 5.',
        practice: {
          prompt: 'For N = 15 and a = 4, use r = 2 to calculate candidate factors.',
          answer: '4¹ = 4. gcd(4−1,15) = 3 and gcd(4+1,15) = 5.',
        },
        question: 'What is the central quantum subroutine in this factoring approach?',
        answers: [
          'Trying every factor and printing them all',
          'Directly measuring N’s digits',
          'Order finding using phase estimation',
        ],
        correct: 2,
        why: 'Quantum interference helps reveal a modular period; classical post-processing turns it into factors.',
      },
      {
        id: 'parameterized-circuits',
        title: 'Parameterized quantum circuits',
        time: 9,
        level: 'Core',
        topics: ['Parameterized quantum circuits', 'PQC', 'Ansatz', 'Parameter-shift rule'],
        body: [
          'A parameterized circuit U(θ) has adjustable angles. Its structure is an ansatz: a chosen family of trial states. A hybrid loop runs the circuit, measures an objective, and updates the angles classically.',
          'The same pattern powers VQE, QAOA, and many quantum learning models. A flexible ansatz is not automatically trainable; noise, sampling, circuit depth, and flat gradients can limit learning. Data parameters and trainable parameters have different roles.',
        ],
        math: {
          formula: 'f(θ) = ⟨0|U†(θ)OU(θ)|0⟩;  f′(θ) = [f(θ+π/2) − f(θ−π/2)]/2',
          explanation:
            'This shift formula applies when θ appears in one rotation e⁻ⁱθᴾ/² with P² = I; shared parameters require summing occurrence contributions.',
        },
        example:
          'For U = RY(θ) and O = Z, f(θ) = cos θ. Two shifted circuit expectations recover its derivative −sin θ.',
        practice: {
          prompt: 'Evaluate the parameter-shift derivative of cos θ at θ = π/2.',
          answer: '[cos π − cos 0]/2 = (−1 − 1)/2 = −1.',
        },
        question: 'What does an ansatz specify?',
        answers: [
          'A parameterized family of trial circuits or states',
          'A promise of quantum advantage',
          'The number of classical training labels',
        ],
        correct: 0,
        why: 'The ansatz defines the states the optimizer can explore; objective and optimizer are additional choices.',
      },
    ],
  },
  {
    id: 'algorithms-3',
    title: 'Algorithm III',
    track: 'applications',
    icon: '◇',
    color: 'peach',
    description:
      'Use the circuit tools for optimization, variational energy, and spectral estimation, then compare them with the photonic model of boson sampling.',
    prerequisites: ['algorithms-2', 'noise-qec'],
    outcomes: [
      'Interpret QAOA and VQE objectives and resource costs.',
      'Apply phase estimation to energy with a declared convention.',
      'Explain what boson sampling samples and why it is a distinct model.',
    ],
    lessons: [
      {
        id: 'qaoa',
        title: 'Optimization with QAOA',
        time: 10,
        level: 'Application',
        topics: ['Optimization', 'QAOA', 'MaxCut', 'Cost and mixer unitaries'],
        body: [
          'MaxCut partitions a graph to maximize edges crossing the partition. QAOA alternates a cost unitary with a mixer, then measures candidate bit strings. A classical optimizer updates both sets of angles in a full implementation.',
          'Our existing lab has one edge and two vertices. It fixes the mixer and lets you sweep one cost angle, so it teaches a layer’s mechanics rather than running an optimizer. Compare against the classical optimum of one cut edge; larger applications need strong classical baselines.',
        ],
        math: {
          formula: 'C = Σ₍ᵢⱼ₎ (I − ZᵢZⱼ)/2;  |γ,β⟩ = exp(−iβ Σᵢ Xᵢ) exp(−iγC)|+⟩⊗ⁿ',
          explanation:
            'For one edge, exp(−iγC) equals RZZ(−γ) up to global phase. The lab instead uses RZZ(angle) and RX(−π/4) on both qubits.',
        },
        example:
          'With the lab’s sign convention, angle = π/2 makes outcomes 01 and 10 certain as a group, so the expected cut is 1.',
        practice: {
          prompt:
            'Sweep the lab angle from 0 to π/2 and compare expected cut to the one-edge classical optimum.',
          answer:
            'At 0 the expected cut is 1/2; at π/2 it reaches 1. This small example validates the mechanics, not a speedup.',
        },
        question: 'Which bit assignment cuts a single edge?',
        answers: ['00', '11', '01'],
        correct: 2,
        why: 'An edge is cut when its endpoints have different bit values.',
        lab: { kind: 'algorithm', name: 'optimization' },
      },
      {
        id: 'variational-energy',
        title: 'VQE: optimize a trial energy',
        time: 10,
        level: 'Application',
        topics: ['VQE', 'Variational quantum eigensolver', 'Variational principle', 'Hamiltonians'],
        body: [
          'VQE estimates a Hamiltonian’s expected energy in a parameterized trial state, then uses a classical optimizer to lower it. With exact expectations for a normalized physical state, the trial energy is at least the Hamiltonian’s ground energy.',
          'The current lab manually sweeps an RY/CX ansatz for a toy spin Hamiltonian −ZI − IZ + 0.5XX in arbitrary units. It is a precursor to chemistry, not a molecular calculation or a complete VQE optimizer. Finite-sample estimates can fluctuate below an exact bound.',
        ],
        math: {
          formula: 'E(θ) = ⟨ψ(θ)|Ĥ|ψ(θ)⟩ ≥ E₀;  Ĥ = Σⱼ cⱼPⱼ',
          explanation:
            'Pauli strings Pⱼ are measured and combined with coefficients cⱼ. Ansatz choice controls which trial states are reachable.',
        },
        example:
          'The toy Hamiltonian has exact ground energy −√4.25 ≈ −2.0616. Its |00⟩ trial state has energy −2, above the ground value.',
        practice: {
          prompt:
            'Run the toy energy lab at angle 0, then sweep the angle. Compare each exact trial energy to the exact ground energy.',
          answer:
            'At 0 the trial energy is −2. Every exact normalized-state trial remains at or above the ground energy. A complete VQE would automate parameter updates.',
        },
        question: 'What does VQE try to minimize?',
        answers: ['The expected energy', 'The speed of light', 'Only the number of measurements'],
        correct: 0,
        why: 'Its objective is the Hamiltonian expectation. The variational principle connects a low trial energy to the ground state.',
        lab: { kind: 'algorithm', name: 'chemistry' },
        followUp: ['molecular-hamiltonians', 'h2-energy', 'uccsd'],
      },
      {
        id: 'phase-estimation-energy',
        title: 'Phase estimation as an energy measurement',
        time: 10,
        level: 'Application',
        topics: [
          'Phase estimation',
          'Energy estimation',
          'Hamiltonian simulation',
          'Spectral methods',
        ],
        body: [
          'Revisit QPE as an application rather than repeating the introductory circuit. Choose a reference energy Eref and an evolution time t, and apply QPE to U = exp[−i(Ĥ−Eref I)t/ħ]. An energy eigenstate then produces a phase encoding its energy.',
          'Energy is only determined modulo 2πħ/t unless an energy range resolves aliasing. A superposition of eigenstates yields their phases with probabilities set by the input overlaps. Accurate controlled evolution and good state preparation can be expensive.',
        ],
        math: {
          formula: 'φ = −(E − Eref)t/(2πħ) mod 1;  ΔE ≈ 2πħ/(t·2ᵐ)',
          explanation:
            'm evaluation bits set the phase resolution. The energy range and sign convention must be declared before decoding.',
        },
        example:
          'In units ħ = 1 with t = 1 and Eref = 0, energy E = π/2 produces phase −1/4 mod 1 = 3/4. A two-bit phase output is 11.',
        practice: {
          prompt:
            'For the same convention, E = π gives what phase? Why can another energy share it?',
          answer:
            'φ = 1/2. Energies differing by 2π at t = ħ = 1 give the same phase, so an energy-range assumption is needed.',
        },
        question:
          'For a superposition of energy eigenstates, what determines which phase QPE returns?',
        answers: [
          'Only the number of gates',
          'The squared overlaps with the eigenstates',
          'The alphabetical order of eigenstate names',
        ],
        correct: 1,
        why: 'Phase estimation correlates the readout with eigencomponents; Born’s rule weights the outcomes.',
        followUp: ['excited-states'],
      },
      {
        id: 'boson-sampling',
        title: 'Boson sampling: a photonic sampling task',
        time: 9,
        level: 'Introduction',
        topics: ['Boson sampling', 'Linear optics', 'Photons', 'Permanents'],
        body: [
          'Boson sampling sends indistinguishable photons through a network of passive linear-optical elements and samples output occupation counts. The modes can contain several photons, so this is not the same model as a fixed register of ideal two-level qubits.',
          'Ideal probabilities involve matrix permanents, which motivates complexity-theory evidence for difficult classical sampling under specific assumptions. Loss, distinguishability, noise, and sample validation matter. Boson sampling is not a general-purpose optimization routine, and the current qubit lab does not implement it.',
        ],
        math: {
          formula: 'P(t|s) = |Per(Uₜ,ₛ)|² / [∏ᵢ sᵢ! ∏ⱼ tⱼ!]',
          explanation:
            's and t are input/output mode occupation counts. Uₜ,ₛ repeats rows and columns according to those counts.',
        },
        example:
          'Two identical photons entering different ports of an ideal balanced beam splitter bunch: the coincidence output with one photon in each port is suppressed by interference (the Hong–Ou–Mandel effect).',
        practice: {
          prompt:
            'For two photons and two modes, list possible output occupation patterns. Which is suppressed in the ideal balanced-beam-splitter example?',
          answer:
            '(2,0), (1,1), and (0,2). The (1,1) coincidence is suppressed for indistinguishable input photons.',
        },
        question: 'What does a boson-sampling device primarily produce?',
        answers: [
          'A guaranteed optimal graph cut',
          'A list of molecular orbitals',
          'Samples of photon occupation patterns',
        ],
        correct: 2,
        why: 'The task is to sample a specified optical distribution; interpreting usefulness requires additional context.',
      },
    ],
  },
];
