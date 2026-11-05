import type { Course } from './types';

export const boundaries: Course[] = [
  {
    id: 'boundaries-1',
    title: 'Classical–Quantum Boundaries I',
    track: 'applications',
    icon: '⋈',
    color: 'lavender',
    description:
      'Read tensor diagrams, plan contractions, and use Schmidt spectra to understand when a quantum state can be represented accurately with limited classical resources.',
    prerequisites: ['algorithms-3'],
    outcomes: [
      'Translate Penrose-style tensor diagrams into index sums.',
      'Relate Schmidt rank and entropy to representation cost.',
      'Calculate discarded weight and normalized truncation fidelity.',
    ],
    lessons: [
      {
        id: 'penrose-calculus',
        title: 'Penrose graphical calculus: tensors as connected diagrams',
        time: 10,
        level: 'Introduction',
        topics: ['Penrose graphical calculus', 'Tensor diagrams', 'Tensor indices'],
        body: [
          'In tensor diagrams, a node represents a tensor and each attached leg represents an index with a declared dimension. Connecting compatible legs sums over the shared index. Unconnected legs label the resulting tensor; a completely closed network is a scalar.',
          'A state vector has one composite index, a matrix has two, and a many-qubit coefficient array can have one physical leg per qubit. For complex tensors, taking an adjoint requires conjugation and exchanging input/output roles. A diagram convention must specify those roles rather than infer conjugation from an undirected line.',
        ],
        math: {
          label: 'Read the tensor diagram',
          formula: 'i ── [A] ── j ── [B] ── k\nC[i,k] = Σⱼ A[i,j] B[j,k]',
          explanation:
            'The connected j leg is summed. The open i and k legs remain as the two indices of C. Connected dimensions must agree.',
        },
        example:
          'Connecting a bra ⟨ψ| with a ket |ψ⟩ gives the scalar ⟨ψ|ψ⟩. Connecting ⟨ψ|, an observable O, and |ψ⟩ gives its expectation value.',
        practice: {
          prompt:
            'A matrix A has shape 2×3 and B has shape 3×4. What is the shape after joining their dimension-three legs?',
          answer:
            '2×4. The joined index is summed over three values; the two open legs have dimensions two and four.',
        },
        question: 'What does an internal connected leg represent?',
        answers: [
          'An index being summed over',
          'A compulsory measurement',
          'An index that must always have dimension two',
        ],
        correct: 0,
        why: 'Tensor contraction sums the shared index. Its dimension depends on the tensors, not necessarily on qubit dimension.',
      },
      {
        id: 'tensor-contractions',
        title: 'Tensor contractions: the order changes the cost',
        time: 11,
        level: 'Core',
        topics: [
          'Tensor contractions',
          'Contraction order',
          'Intermediate tensors',
          'Classical simulation cost',
        ],
        body: [
          'Contraction evaluates sums over connected indices. A network can describe a circuit compactly even when evaluating it requires large intermediate arrays. Equivalent contraction orders can have dramatically different memory and arithmetic costs.',
          'Matrix-chain multiplication is a useful starting example. More general networks require choosing which tensors to combine and which indices to eliminate. Compact notation alone does not establish efficient classical simulation, and finding a good contraction order is itself a computational task.',
        ],
        math: {
          formula: '(AB)C = A(BC);  dense (m×k)(k×n) multiplication costs O(mkn)',
          explanation:
            'The result is mathematically identical, but the dimensions of the intermediate product determine memory and work.',
        },
        example:
          'Let A be 1000×2, B be 2×1000, and C be 1000×2. AB has one million entries, whereas BC has only four. Computing A(BC) avoids that large intermediate.',
        practice: {
          prompt:
            'For A of shape 10×2, B of shape 2×10, and C of shape 10×2, compare the intermediate shapes of (AB)C and A(BC).',
          answer:
            'AB is 10×10; BC is 2×2. Both final results are 10×2, but the second order uses a much smaller intermediate.',
        },
        question: 'What can make a compact tensor-network description expensive to evaluate?',
        answers: [
          'The absence of any closed legs',
          'Large intermediate tensors during contraction',
          'Having fewer than three qubits',
        ],
        correct: 1,
        why: 'Contraction cost depends on intermediate index dimensions and connectivity, not just how short the diagram is.',
      },
      {
        id: 'schmidt-decomposition',
        title: 'Schmidt decomposition: expose bipartite structure',
        time: 12,
        level: 'Core',
        topics: [
          'Schmidt decomposition',
          'Singular value decomposition',
          'Schmidt rank',
          'Reduced density matrices',
        ],
        body: [
          'Divide a pure state into subsystems A and B, reshape its coefficients into a matrix, and perform a singular value decomposition. The nonzero singular values are the Schmidt coefficients, paired with orthonormal states on each side.',
          'A product state has Schmidt rank one. Entanglement requires more than one nonzero coefficient, and the squared coefficients are the eigenvalues of either subsystem’s reduced density matrix. The cut matters: the same multipartite state can have different spectra for different bipartitions.',
        ],
        math: {
          formula: '|ψ⟩ = Σₐ₌₁ʳ sₐ |uₐ⟩A |vₐ⟩B;  sₐ ≥ 0;  Σₐ sₐ² = 1;  λₐ(ρA) = sₐ²',
          explanation:
            'The Schmidt rank r counts nonzero coefficients. In a coefficient-matrix SVD, account for complex conjugation when forming the right-hand basis states.',
        },
        example:
          'A Bell pair has coefficients 1/√2 and 1/√2 across its one-qubit cut, so rank two and reduced-state eigenvalues 1/2,1/2. A product |00⟩ has one coefficient equal to one.',
        practice: {
          prompt:
            'Find the Schmidt coefficients of √0.9|00⟩ + √0.1|11⟩ in this already paired orthonormal basis.',
          answer:
            '√0.9 and √0.1. The reduced density matrix is diagonal with eigenvalues 0.9 and 0.1; the state is entangled even though one coefficient dominates.',
        },
        question: 'Which spectrum consists of the squared Schmidt coefficients?',
        answers: [
          'The list of gate durations',
          'The amplitudes of a classical bitstring',
          'The eigenvalues of a reduced density matrix',
        ],
        correct: 2,
        why: 'Tracing out one side leaves an incoherent sum of Schmidt basis projectors weighted by sₐ².',
      },
      {
        id: 'entanglement-scaling',
        title: 'Entanglement scaling: area laws and volume laws',
        time: 12,
        level: 'Core',
        topics: ['Entanglement scaling', 'Area law', 'Volume law', 'Entanglement entropy'],
        body: [
          'For a pure bipartite state, entanglement entropy measures how broadly its Schmidt weight is distributed. An area law scales with the boundary of a region, while a volume law scales with its size. Many gapped local one-dimensional ground states have bounded entropy across a cut; critical states and time-evolved states can behave differently.',
          'This helps explain why some quantum systems admit useful tensor-network simulations while others become expensive. A low-entropy observation is not a complete accuracy certificate: the Schmidt tail, network geometry, contraction cost, and desired observable must also be checked.',
        ],
        math: {
          formula: 'SA = −Σₐ sₐ² log₂(sₐ²);  SA ≤ log₂ r;  r ≤ 2^min(nA,nB)',
          explanation:
            'Rank r can be exponentially large in the smaller subsystem. A rank-χ representation can carry at most log₂χ bits of entanglement across that cut.',
        },
        example:
          'A GHZ state has entropy one bit across any nonempty bipartition, regardless of system size. A product of k Bell pairs crossing a chosen cut has entropy k bits and Schmidt rank 2ᵏ.',
        practice: {
          prompt:
            'Can a bond of dimension χ = 4 represent five independent Bell pairs crossing that bond exactly?',
          answer:
            'No. It supports at most log₂4 = 2 entanglement bits, whereas five crossing Bell pairs require rank 32 and entropy five bits.',
        },
        question:
          'What typically makes exact fixed-bond tensor representations difficult for volume-law states?',
        answers: [
          'The required bond dimension can grow exponentially',
          'All amplitudes become zero',
          'Classical computers cannot store any complex number',
        ],
        correct: 0,
        why: 'The entanglement bound S ≤ log₂χ forces large χ when entropy grows with subsystem size.',
      },
      {
        id: 'schmidt-truncation',
        title: 'Schmidt truncation: accuracy has a measurable price',
        time: 12,
        level: 'Core',
        topics: [
          'Schmidt truncation',
          'Schmidt decomposition and truncation',
          'Discarded weight',
          'Truncation fidelity',
        ],
        body: [
          'Sort Schmidt coefficients from largest to smallest and retain the leading χ. Singular-value truncation is the best rank-χ approximation in coefficient-matrix Frobenius norm, equivalent to the pure-state vector norm for a fixed cut.',
          'The retained vector must be normalized before interpreting its predictions. Discarded weight quantifies this one-cut approximation, but repeated truncations and time integration introduce further errors. Compare observables and convergence as χ increases rather than treating one small discarded-weight report as a global guarantee.',
        ],
        math: {
          formula: 'εδisc = Σₐ>χ sₐ²;  |ψχ⟩ = [Σₐ≤χ sₐ|uₐvₐ⟩]/√(1−εδisc);  |⟨ψ|ψχ⟩|² = 1−εδisc',
          explanation:
            'This assumes a normalized original state and nonzero retained weight. The normalized fidelity differs from a raw unnormalized vector norm.',
        },
        example:
          'For √0.9|00⟩ + √0.1|11⟩, retaining one Schmidt coefficient gives normalized state |00⟩, discarded weight 0.1, and fidelity 0.9.',
        practice: {
          prompt:
            'Squared Schmidt coefficients are 0.7,0.2,0.1. Retain the largest two. Find discarded weight and normalized truncation fidelity.',
          answer:
            'Discarded weight is 0.1, retained norm is √0.9, and fidelity after normalization is 0.9.',
        },
        question:
          'What should be done after discarding Schmidt components before using the state for normalized predictions?',
        answers: [
          'Measure every retained index',
          'Renormalize the retained state',
          'Replace all coefficients by equal values',
        ],
        correct: 1,
        why: 'Discarding weight reduces the norm. Dividing by the retained norm restores a valid normalized state.',
        followUp: ['mps', 'tebd'],
      },
    ],
  },
  {
    id: 'boundaries-2',
    title: 'Classical–Quantum Boundaries II',
    track: 'applications',
    icon: '⋯',
    color: 'lavender',
    description:
      'Use one-dimensional tensor networks to represent states and operators, optimize ground states with DMRG, and follow time evolution with TEBD.',
    prerequisites: ['boundaries-1'],
    outcomes: [
      'Distinguish MPS state tensors from MPO operator tensors.',
      'Explain variational DMRG sweeps and their convergence checks.',
      'Separate time-step, bond-dimension, and truncation errors in TEBD.',
    ],
    lessons: [
      {
        id: 'mps',
        title: 'MPS: a chain representation of a quantum state',
        time: 12,
        level: 'Core',
        topics: ['Matrix product states', 'MPS', 'Bond dimension', 'Canonical forms'],
        body: [
          'A matrix product state factors a many-body coefficient array into a chain of local tensors. Each tensor carries a physical state index and neighboring virtual bond indices. Open boundaries have one-dimensional outer bonds.',
          'The bond dimension limits the Schmidt rank across the corresponding chain cut. Product states need only χ = 1; GHZ states can use χ = 2. General states can require exponentially growing χ, so the useful compression depends on the state and site ordering. Canonical forms simplify normalization and local calculations.',
        ],
        math: {
          formula: 'cᵢ₁…ᵢₙ = A₁[i₁]A₂[i₂]…Aₙ[iₙ];  storage O(n d χ²)',
          explanation:
            'The boundary dimensions make the matrix product a scalar. d is the local physical dimension and χ bounds the virtual dimensions; this is a parameter-count estimate.',
        },
        example:
          'An n-qubit product state uses one local two-component vector per site. An MPS with χ = 1 stores those local factors without listing all 2ⁿ amplitudes.',
        practice: {
          prompt: 'Does increasing χ change the number of physical qubits being modeled?',
          answer:
            'No. It enlarges the variational representation and the allowed entanglement across virtual bonds, at greater classical storage and contraction cost.',
        },
        question: 'What does an MPS virtual bond dimension bound?',
        answers: [
          'The number of shots on a hardware backend',
          'The local microwave frequency',
          'The Schmidt rank across that chain cut',
        ],
        correct: 2,
        why: 'Cutting one virtual bond separates the chain into at most χ paired components.',
      },
      {
        id: 'mpo',
        title: 'MPO: represent observables and Hamiltonians',
        time: 11,
        level: 'Core',
        topics: ['Matrix product operators', 'MPO', 'Operator tensors', 'Expectation contractions'],
        body: [
          'A matrix product operator factors an operator into a chain with two physical legs per site: an input and an output index. Virtual bonds carry the correlations needed to connect the local operator factors.',
          'MPOs often compactly represent local Hamiltonians and support contractions such as ⟨ψ|H|ψ⟩ with an MPS. Applying an MPO can increase the state’s virtual dimensions and require compression. Operator bond dimension and state bond dimension are different quantities.',
        ],
        math: {
          formula: 'Oᵢ₁…ᵢₙ,ⱼ₁…ⱼₙ = W₁[i₁,j₁]…Wₙ[iₙ,jₙ];  storage O(n d² D²)',
          explanation:
            'D bounds MPO virtual dimensions. A generic dense operator still needs an exponentially costly representation; compactness follows from structure.',
        },
        example:
          'The product Z⊗Z⊗…⊗Z has MPO bond dimension one: each site contributes a local Z matrix. Sums and interacting terms generally need additional virtual structure.',
        practice: {
          prompt:
            'How many physical indices does one MPS site tensor have, and how many does one MPO site tensor have?',
          answer:
            'An MPS site has one physical index for the state. An MPO site has two physical indices corresponding to input and output states, alongside its virtual bonds.',
        },
        question: 'Which object naturally represents a Hamiltonian acting on a chain?',
        answers: ['An MPO', 'A classical measurement bit alone', 'A waveform port'],
        correct: 0,
        why: 'The MPO carries input/output physical indices and encodes the linear operator.',
      },
      {
        id: 'dmrg',
        title: 'DMRG: variational ground-state sweeps',
        time: 13,
        level: 'Application',
        topics: [
          'Density matrix renormalization group',
          'DMRG',
          'Variational tensor networks',
          'Ground-state optimization',
        ],
        body: [
          'Modern DMRG optimizes an MPS to approximate a Hamiltonian’s ground state. A sweep updates one or two neighboring site tensors while contracting the rest into effective environments. Two-site methods can adjust the represented bond space through a subsequent SVD and truncation.',
          'As with VQE, ansatz restrictions and optimization affect the answer; here the trial state is a classical tensor network. Examine energy, variance or residual diagnostics, conserved quantities, bond dimension, discarded weight, and sweep convergence. Local updates do not guarantee the exact global ground state.',
        ],
        math: {
          formula: 'EMPS = minA ⟨ψ(A)|H|ψ(A)⟩ / ⟨ψ(A)|ψ(A)⟩',
          explanation:
            'The minimization is within a chosen MPS family. Canonical gauges help formulate well-conditioned local eigenproblems.',
        },
        example:
          'For H = −Z₁−Z₂, the product state |00⟩ has exact ground energy −2 and fits χ = 1. No entangled ansatz is needed for this model, making it a useful small validation case.',
        practice: {
          prompt:
            'If energy stops changing at χ = 8, does that alone prove the MPS is the exact ground state?',
          answer:
            'No. It may indicate convergence within a limited or locally optimized ansatz. Increase χ, inspect other diagnostics, and compare exact small-system or trusted reference results when available.',
        },
        question: 'What is held as an effective environment during a local DMRG update?',
        answers: [
          'Only a hardware shot histogram',
          'The rest of the tensor network',
          'A copied unknown quantum state',
        ],
        correct: 1,
        why: 'Contracting unchanged tensors into left/right environments makes a local variational update possible.',
      },
      {
        id: 'tebd',
        title: 'TEBD: local gates, SVDs, and time evolution',
        time: 13,
        level: 'Application',
        topics: [
          'Time-evolving block decimation',
          'TEBD',
          'Suzuki–Trotter decomposition',
          'Entanglement growth',
        ],
        body: [
          'TEBD approximates local Hamiltonian evolution by a sequence of short-time local gates applied to an MPS. A two-site update joins neighboring tensors, applies the gate, and splits them again with an SVD, truncating the bond when needed.',
          'For nearest-neighbor chains, split terms into nonoverlapping even and odd bonds. Time-discretization error and Schmidt truncation are separate. Dynamics can generate enough entanglement that an initially economical MPS becomes costly; smaller time steps alone do not fix an inadequate bond dimension.',
        ],
        math: {
          formula: 'exp(−iHΔt) ≈ exp(−iHevenΔt/2) exp(−iHoddΔt) exp(−iHevenΔt/2)',
          explanation:
            'In units ħ = 1, this symmetric second-order splitting has local error O(Δt³) under standard bounded finite-system assumptions. Truncation adds a different error source.',
        },
        example:
          'After applying a nearest-neighbor gate, retain the largest singular values to restore the chosen χ. Compare results at smaller Δt and larger χ independently to identify the dominant error.',
        practice: {
          prompt:
            'An observable changes strongly when χ is doubled but barely when Δt is halved. Which limitation is suggested?',
          answer:
            'Bond truncation or representation limits are likely significant. This is a convergence diagnostic, not a proof; both parameters and other checks should be assessed.',
        },
        question: 'Which two error sources must be distinguished in truncated TEBD?',
        answers: [
          'Only display order and font size',
          'Authentication and encryption',
          'Time-step splitting and bond truncation',
        ],
        correct: 2,
        why: 'The product-formula approximation and the compression of the resulting state are separate approximations.',
      },
    ],
  },
  {
    id: 'boundaries-3',
    title: 'Classical–Quantum Boundaries III',
    track: 'applications',
    icon: '⋔',
    color: 'lavender',
    description:
      'Compare tree, multiscale, and two-dimensional tensor networks: TTN, MERA, and PEPS. Match geometry and entanglement structure to contraction and optimization costs.',
    prerequisites: ['boundaries-2'],
    outcomes: [
      'Explain tree and multiscale structures and the purpose of disentanglers.',
      'Relate PEPS geometry to two-dimensional area-law states.',
      'Separate compact representability from efficient contraction.',
    ],
    lessons: [
      {
        id: 'ttn',
        title: 'TTN: hierarchical tree tensor networks',
        time: 11,
        level: 'Core',
        topics: ['TTN', 'Tree tensor networks', 'Isometries', 'Hierarchical contraction'],
        body: [
          'A tree tensor network groups physical degrees of freedom hierarchically. Internal tensors combine smaller blocks into larger effective indices. Without loops, contraction and gauge choices can be simpler than in a general network with the same tensor sizes.',
          'An isometric tensor preserves inner products from its smaller input space into a larger output space. Tree geometry determines which physical partitions cross which virtual bonds; a low-rank tree representation is therefore sensitive to the ordering and grouping of sites.',
        ],
        math: {
          formula: 'W†W = I  for an isometry W;  rcut ≤ ∏b∈cut χb',
          explanation:
            'The product of dimensions of cut virtual bonds bounds the Schmidt rank of the separated physical regions.',
        },
        example:
          'A balanced tree for eight sites can group pairs, then groups of four, then the whole system. This gives a logarithmic number of hierarchical layers, while actual contraction cost still depends on tensor dimensions.',
        practice: {
          prompt:
            'If separating a region cuts two bonds of dimension four each, what upper bound follows for its Schmidt rank?',
          answer:
            'At most 4×4 = 16, corresponding to at most log₂16 = 4 entanglement bits. The bound need not be saturated.',
        },
        question:
          'What distinguishes the network connectivity of a TTN from a generic looped network?',
        answers: [
          'It contains no internal loops',
          'It never contains entanglement',
          'Every bond has dimension one',
        ],
        correct: 0,
        why: 'The tree structure eliminates loops; the chosen bond dimensions still allow nontrivial entanglement.',
      },
      {
        id: 'mera',
        title: 'MERA: disentangle before coarse-graining',
        time: 12,
        level: 'Core',
        topics: [
          'MERA',
          'Multiscale entanglement renormalization ansatz',
          'Disentanglers',
          'Causal cones',
        ],
        body: [
          'MERA adds local unitary disentanglers between coarse-graining layers. They remove selected short-range entanglement across block boundaries before isometries compress the description, supporting useful multiscale descriptions of some critical systems.',
          'Its structured causal cones can keep the tensor region needed for local observables manageable in standard constructions. Costs still depend on bond dimension, geometry, and optimization. A MERA is an ansatz with constraints, not a universal guarantee of an efficient exact representation.',
        ],
        math: {
          formula: 'u†u = uu† = I;  w†w = I',
          explanation:
            'u is a unitary disentangler and w is an isometry. Their cancellation outside a suitable observable’s causal cone reduces the contraction.',
        },
        example:
          'When evaluating a local observable, many pairs of tensors and adjoints cancel by unitarity or isometry, leaving a limited causal cone rather than the entire expanded state vector.',
        practice: {
          prompt:
            'How does adding disentanglers change the basic idea of a simple tree coarse-graining?',
          answer:
            'It adjusts entanglement between neighboring blocks before compressing them, improving which correlations the chosen hierarchy can retain at a given bond dimension.',
        },
        question: 'What is the role of a MERA disentangler?',
        answers: [
          'Perform a mandatory destructive measurement',
          'Transform short-range entanglement before coarse-graining',
          'Make every critical state a product state',
        ],
        correct: 1,
        why: 'Disentanglers redistribute or remove selected boundary entanglement so a following isometry can compress more effectively.',
      },
      {
        id: 'peps',
        title: 'PEPS: networks shaped like a two-dimensional lattice',
        time: 12,
        level: 'Core',
        topics: [
          'PEPS',
          'Projected entangled pair states',
          'Two-dimensional tensor networks',
          'Approximate contraction',
        ],
        body: [
          'PEPS attaches local tensors to a lattice, with virtual bonds connecting neighboring sites and a physical leg at each site. In two dimensions, a region’s boundary can cross many bonds, naturally supporting an area-law entanglement structure.',
          'Loops make general exact contraction difficult even when storage is compact. Practical calculations often approximate environments or boundary networks, introducing a contraction-accuracy parameter beyond the PEPS bond dimension. Check both approximation levels and the intended observables.',
        ],
        math: {
          formula: 'Sregion ≤ Ncut log₂D',
          explanation:
            'D is a uniform virtual bond dimension and Ncut counts cut bonds. The bound describes entanglement capacity, not the cost of contracting the network.',
        },
        example:
          'On a square lattice, a simply connected block cuts a number of nearest-neighbor bonds proportional to its perimeter. A fixed-D PEPS can therefore support entanglement proportional to that boundary length.',
        practice: {
          prompt:
            'If a region cuts six virtual bonds with D = 2, what is the entropy upper bound? Does that bound make exact contraction cheap?',
          answer:
            'At most six bits. No: the bound concerns representable entanglement; contracting a looped network can still be expensive.',
        },
        question: 'Which statement separates PEPS representation from evaluation?',
        answers: [
          'Compact storage guarantees easy exact contraction',
          'All two-dimensional states have fixed-D exact PEPS',
          'A compact PEPS may still require costly or approximate contraction',
        ],
        correct: 2,
        why: 'The network’s loops and intermediate contraction dimensions create computational costs beyond parameter storage.',
      },
    ],
  },
];
