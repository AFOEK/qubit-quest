import type { Course } from './types';

export const chemistry: Course[] = [
  {
    id: 'chemistry-1',
    title: 'Chemistry I',
    track: 'applications',
    icon: '⚛',
    color: 'lavender',
    description:
      'Build the chain from a molecule and its electronic approximations to a fermionic Hamiltonian and a qubit operator.',
    prerequisites: ['algorithms-3'],
    outcomes: [
      'Explain Born–Oppenheimer and Hartree–Fock assumptions.',
      'Read second-quantized creation and annihilation operators.',
      'Compare fermion-to-qubit mappings and specify a reproducible molecular model.',
    ],
    lessons: [
      {
        id: 'born-oppenheimer',
        title: 'Born–Oppenheimer: separate electronic motion',
        time: 9,
        level: 'Core',
        topics: [
          'Born–Oppenheimer approximation',
          'Electronic structure',
          'Potential energy surfaces',
        ],
        body: [
          'Nuclei are much heavier than electrons, motivating an approximate separation of their motions. In a basic electronic-structure calculation, choose fixed nuclear positions and solve for electronic energy at that geometry.',
          'Repeating over geometries traces a potential energy surface. Include nuclear repulsion to get a molecular energy for each geometry. The approximation can fail near strong nonadiabatic coupling or intersecting energy surfaces.',
        ],
        math: {
          formula: 'Ĥₑ(R)ψₑ = Eₑ(R)ψₑ;  Etotal(R) = Eₑ(R) + Enuc(R)',
          explanation:
            'R labels the fixed nuclear geometry. Clearly distinguish electronic energy from total energy including nuclear repulsion.',
        },
        example:
          'For H₂, hold the proton separation R fixed, solve the electronic problem, add proton–proton repulsion, then repeat at other separations to draw a bond-energy curve.',
        practice: {
          prompt: 'What must remain specified when comparing two energies on an H₂ bond curve?',
          answer:
            'Geometry units, electronic basis, charge, spin/electron count, approximation level, and whether nuclear repulsion is included.',
        },
        question: 'What is held fixed in the basic electronic Born–Oppenheimer problem?',
        answers: [
          'All electron positions',
          'Nuclear positions',
          'Every molecular orbital coefficient',
        ],
        correct: 1,
        why: 'The electronic state is solved for a chosen arrangement of nuclei.',
      },
      {
        id: 'hartree-fock',
        title: 'Hartree–Fock: the mean-field reference',
        time: 10,
        level: 'Core',
        topics: ['Hartree–Fock', 'HF theory', 'Slater determinants', 'Electron correlation'],
        body: [
          'Hartree–Fock approximates the many-electron state by one Slater determinant of spin orbitals. The determinant enforces fermionic antisymmetry. Orbitals are optimized self-consistently in the average field of the other electrons.',
          'HF provides a useful classical reference and often an initial state for VQE. It includes exchange but misses correlation beyond one determinant. Stretched bonds and near-degenerate states can require multiple important determinants.',
        ],
        math: {
          formula: '|ΦHF⟩ = a†ᵢ₁ a†ᵢ₂ … a†ᵢₙ |vac⟩',
          explanation:
            'The occupied spin orbitals define one determinant. The order of fermionic creation operators fixes a sign convention.',
        },
        example:
          'In a minimal H₂ basis, a closed-shell HF reference occupies the two lowest-energy spin orbitals. Its single determinant can be insufficient as the bond is stretched.',
        practice: {
          prompt:
            'Why compare a variational quantum energy with HF as well as an exact active-space result?',
          answer:
            'HF supplies a practical classical baseline. An exact result in the same finite model reveals how much correlation the ansatz captures.',
        },
        question: 'What is the basic wave-function approximation in Hartree–Fock?',
        answers: [
          'An arbitrary exact superposition of all determinants',
          'A photon occupation sampler',
          'A single optimized Slater determinant',
        ],
        correct: 2,
        why: 'HF optimizes one antisymmetric product state, leaving correlation beyond that approximation untreated.',
      },
      {
        id: 'second-quantization',
        title: 'Second quantization: count occupied orbitals',
        time: 11,
        level: 'Core',
        topics: ['Second quantization', 'Fermions', 'Creation operators', 'Annihilation operators'],
        body: [
          'Second quantization describes states by which spin orbitals are occupied, rather than assigning a coordinate label to each electron. A creation operator a†ₚ adds a fermion in orbital p; an annihilation operator aₚ removes one.',
          'Fermionic operators anticommute. Reordering them can change signs, and attempting to create a second electron in the same spin orbital gives zero. This algebra is the reason mappings to qubits require parity information.',
        ],
        math: {
          formula: '{aₚ,a†q} = δₚq;  {aₚ,aq} = 0;  nₚ = a†ₚaₚ',
          explanation: '{A,B} = AB + BA. The occupation number nₚ has eigenvalues 0 and 1.',
        },
        example:
          'In a two-spin-orbital occupation basis, a†₀|vac⟩ occupies orbital 0. Reversing the order of a†₀ and a†₁ changes a two-electron state’s sign.',
        practice: {
          prompt: 'What does a†ₚ do to a determinant whose spin orbital p is already occupied?',
          answer:
            'It gives the zero vector, enforcing Pauli exclusion. The zero vector is not a normalized quantum state.',
        },
        question: 'What is the occupation number of an already occupied spin orbital?',
        answers: ['1', '2', 'Any positive integer'],
        correct: 0,
        why: 'Each fermionic spin orbital can contain at most one electron.',
      },
      {
        id: 'jordan-wigner',
        title: 'Jordan–Wigner: fermions become Pauli strings',
        time: 11,
        level: 'Core',
        topics: ['Jordan–Wigner transformation', 'Fermion-to-qubit mapping', 'Parity strings'],
        body: [
          'Jordan–Wigner stores each spin-orbital occupation in one qubit: |0⟩ is empty and |1⟩ is occupied. A string of Z operators tracks the sign from preceding occupied orbitals.',
          'The mapping preserves fermionic anticommutation. It is direct to understand, but some mapped operators have long strings. In Qiskit a Pauli label writes the highest-index qubit on the left, so the index in a formula is more reliable than guessing from a printed string.',
        ],
        math: {
          formula: 'aₚ = (∏ⱼ<ₚ Zⱼ)(Xₚ + iYₚ)/2;  a†ₚ = (∏ⱼ<ₚ Zⱼ)(Xₚ − iYₚ)/2;  nₚ = (I − Zₚ)/2',
          explanation:
            'The Z string supplies fermionic parity signs, while the X/Y combination changes occupation.',
        },
        example:
          'For orbital 0 there is no preceding Z string. Its number operator is (I−Z₀)/2, giving 0 on |0⟩ and 1 on |1⟩.',
        practice: {
          prompt: 'Map a₁ with two spin orbitals, using indexed Pauli operators.',
          answer: 'a₁ = Z₀(X₁ + iY₁)/2. The Z₀ factor records the occupation parity of orbital 0.',
        },
        question: 'Why are Z strings needed in Jordan–Wigner?',
        answers: [
          'To increase measurement randomness',
          'To preserve fermionic sign relations',
          'To store extra electrons per orbital',
        ],
        correct: 1,
        why: 'The parity strings make mapped creation and annihilation operators anticommute correctly.',
      },
      {
        id: 'bravyi-kitaev-parity',
        title: 'Bravyi–Kitaev and parity transformations',
        time: 10,
        level: 'Core',
        topics: ['Bravyi–Kitaev transformation', 'Parity transformation', 'Qubit tapering'],
        body: [
          'The parity mapping stores cumulative occupation parity instead of individual orbital occupation. Bravyi–Kitaev distributes occupation and parity information using a hierarchical encoding, reducing the asymptotic length of many operator strings.',
          'No mapping is universally best. Gate connectivity, operator counts, state preparation, and symmetries affect performance. With known symmetry eigenvalues, compatible mappings can allow qubit tapering, but removing qubits requires checking that the selected sector represents the desired physical system.',
        ],
        math: {
          formula: 'Parity bits: bⱼ = n₀ ⊕ n₁ ⊕ … ⊕ nⱼ;  JW support O(N), BK support O(log N)',
          explanation:
            'The scaling refers to mapped individual fermionic ladder operators in standard constructions, not a guarantee for total circuit runtime.',
        },
        example:
          'For written occupations (n₀,n₁,n₂) = (1,1,0), the cumulative parity bits are (1,0,0). These bits no longer equal local occupations.',
        practice: {
          prompt: 'Recover n from parity bits b = (1,0,1), with n₀ = b₀ and nⱼ = bⱼ₋₁ ⊕ bⱼ.',
          answer:
            'n = (1,1,1). A mapping must be interpreted consistently when preparing and measuring states.',
        },
        question: 'Does changing to Bravyi–Kitaev automatically guarantee a faster calculation?',
        answers: [
          'Yes, for every molecule',
          'Yes, because all two-qubit gates vanish',
          'No, the full workload and hardware matter',
        ],
        correct: 2,
        why: 'Operator support is only one cost; compilation, measurements, and model choices also contribute.',
      },
      {
        id: 'molecular-hamiltonians',
        title: 'Molecular Hamiltonians: specify the model',
        time: 12,
        level: 'Core',
        topics: ['Molecular Hamiltonians', 'Electronic integrals', 'Active space', 'Energy units'],
        body: [
          'Choose a geometry, basis, charge, spin, and an active space. A classical chemistry driver computes one- and two-electron integrals. Second quantization packages these into an electronic Hamiltonian, and a mapping turns it into weighted Pauli strings.',
          'Record constant energy offsets, including nuclear repulsion and contributions from frozen orbitals. State whether energies are electronic or total and use declared units such as hartree. A result is only meaningful relative to this model and a reference calculation using the same choices.',
        ],
        math: {
          formula: 'Ĥₑ = Σₚq hₚq a†ₚaq + ½Σₚqrs gₚqrs a†ₚa†q as ar;  Ĥqubit = Σⱼ cⱼPⱼ',
          explanation:
            'Here gₚqrs multiplies the explicitly written operator order; integral conventions must match that order. Constants are added separately.',
        },
        example:
          'Four active spin orbitals usually map to four qubits before symmetry reduction. Freezing core orbitals changes the active Hamiltonian and adds an offset; it is not simply deleting rows from a matrix.',
        practice: {
          prompt: 'List the minimum information needed to reproduce a reported H₂ energy.',
          answer:
            'Atomic geometry and units, basis, charge, spin/electron count, active space and frozen orbitals, mapping/symmetry sector, energy offsets and units, solver and tolerances.',
        },
        question: 'What must be included when comparing total molecular energies?',
        answers: [
          'Consistent nuclear and frozen-orbital offsets',
          'Only the number of qubits',
          'Only a circuit screenshot',
        ],
        correct: 0,
        why: 'Different omitted constants or physical models can make numerically similar energies incomparable.',
      },
    ],
  },
  {
    id: 'chemistry-2',
    title: 'Chemistry II',
    track: 'applications',
    icon: '⚗',
    color: 'lavender',
    description:
      'Plan reproducible H₂, LiH, and BeH₂ studies and understand the UCCSD ansatz. Guided molecular exercises build on the toy energy lab; full molecular execution needs a chemistry driver and solver.',
    prerequisites: ['chemistry-1'],
    outcomes: [
      'Design a small molecular energy workflow with classical references.',
      'Choose explicit active spaces for larger molecules.',
      'Explain single/double excitations in UCCSD and their costs.',
    ],
    lessons: [
      {
        id: 'h2-energy',
        title: 'H₂ molecular energy and a bond curve',
        time: 12,
        level: 'Application',
        topics: [
          'H2 molecular energy state',
          'H₂',
          'Ground-state energy',
          'Bond dissociation curve',
        ],
        body: [
          'Start with neutral singlet H₂ at positions (0,0,0) and (0,0,0.735 Å) in the STO-3G basis. This minimal model has two electrons and four spin orbitals before reductions. Generate integrals, map the Hamiltonian, prepare HF, and compare a variational result with exact diagonalization in the same particle-number sector.',
          'Repeat across bond lengths and include nuclear repulsion to obtain total energies in hartree. The familiar equilibrium total energy near −1.137 hartree is a useful rough check for this minimal model, not a universal exact H₂ energy. This course is a guided workflow; the existing lab still executes a toy spin model.',
        ],
        math: {
          formula: 'Etotal(R) = minθ ⟨ψ(θ;R)|Ĥₑ(R)|ψ(θ;R)⟩ + Enuc(R)',
          explanation:
            'Regenerate the geometry-dependent Hamiltonian at each R and preserve consistent reference conventions.',
        },
        example:
          'At one geometry, tabulate HF, exact active-space, and variational total energies. Compare the variational error in millihartree, then repeat to see where the ansatz becomes less accurate as the bond stretches.',
        practice: {
          prompt:
            'Why is a toy spin energy of −2 arbitrary units not evidence of an H₂ calculation?',
          answer:
            'It has no declared H₂ geometry, orbital basis, electronic integrals, or molecular energy offsets. A molecular Hamiltonian and validated units must be supplied first.',
        },
        question: 'Which reference makes a minimal-basis H₂ variational result interpretable?',
        answers: [
          'An unrelated toy Hamiltonian',
          'Exact diagonalization of the same molecular model and sector',
          'Any negative number in any units',
        ],
        correct: 1,
        why: 'Matching the model, sector, and energy offsets isolates the solver or ansatz error.',
      },
      {
        id: 'lih-beh2',
        title: 'LiH and BeH₂: choose an active space',
        time: 12,
        level: 'Application',
        topics: [
          'LiH simulations',
          'BeH2 simulations',
          'BeH₂',
          'Frozen core',
          'Active-space selection',
        ],
        body: [
          'Larger molecules quickly increase orbital, qubit, and measurement costs. Neutral LiH has four electrons; neutral BeH₂ has six. In STO-3G, the unreduced models have twelve and fourteen spin orbitals respectively, assuming the usual minimal basis.',
          'For a study, declare geometry first, then consider frozen core and an active-space approximation. LiH might freeze the Li 1s core and use two active electrons in three spatial orbitals. BeH₂ might freeze Be 1s and use four active electrons in four spatial orbitals. These are explicit example models, not accuracy guarantees.',
        ],
        math: {
          formula: 'Nqubits = 2 × Nactive spatial orbitals  (before symmetry reduction)',
          explanation:
            'Each spatial orbital supplies two spin orbitals. Frozen-core energy offsets must be restored for total-energy comparisons.',
        },
        example:
          'An example LiH geometry is Li(0,0,0), H(0,0,1.6 Å), singlet, STO-3G. Its illustrative 2-electron/3-spatial-orbital active model uses six qubits before tapering.',
        practice: {
          prompt:
            'Use linear BeH₂ with Be at 0 and H at ±1.3 Å on z. For the illustrative four-spatial-orbital active space, how many spin orbitals and qubits are needed before reduction?',
          answer:
            'Eight spin orbitals and eight qubits. Record four active electrons and the frozen Be-core offset. This exceeds the current API’s six-qubit cap and requires a separate chemistry workflow.',
        },
        question: 'Does freezing core orbitals eliminate the need to record an energy offset?',
        answers: [
          'Yes, core energy is always zero',
          'Yes, if the mapping is Jordan–Wigner',
          'No, it contributes to the total energy',
        ],
        correct: 2,
        why: 'A frozen-core approximation modifies the active Hamiltonian and leaves a constant contribution to restore.',
      },
      {
        id: 'uccsd',
        title: 'UCCSD: single and double excitations',
        time: 12,
        level: 'Core',
        topics: [
          'Unitary Coupled Cluster',
          'UCCSD ansatz',
          'Excitation operators',
          'Trotterization',
        ],
        body: [
          'UCCSD prepares trial states from an HF reference using single and double fermionic excitations. The combination T−T† is anti-Hermitian, so its exponential is unitary.',
          'After mapping to qubits, a practical circuit typically approximates the exponential by an ordered product of parameterized factors. Ordering, number of repetitions, excitation selection, and symmetry constraints affect the result. UCCSD can be costly and is not exact for every molecule.',
        ],
        math: {
          formula: '|ψ(θ)⟩ = exp[T₁(θ)+T₂(θ)−T₁†(θ)−T₂†(θ)]|ΦHF⟩',
          explanation:
            'T₁ excites occupied orbitals into virtual orbitals; T₂ excites pairs. Parameters weight the allowed excitations.',
        },
        example:
          'A single excitation replaces one occupied spin orbital i with a virtual orbital a through a†ₐaᵢ. The anti-Hermitian pair a†ₐaᵢ−a†ᵢaₐ generates a unitary rotation between determinants.',
        practice: {
          prompt:
            'Why is exp(T) alone generally not a unitary ansatz when T contains only excitations?',
          answer:
            'T is not generally anti-Hermitian. Including −T† makes the generator anti-Hermitian and its exponential unitary.',
        },
        question: 'What makes the UCCSD exponential unitary?',
        answers: [
          'Its generator is anti-Hermitian',
          'It contains only real matrix entries',
          'It has no adjustable parameters',
        ],
        correct: 0,
        why: 'For A† = −A, (eᴬ)†eᴬ = e⁻ᴬeᴬ = I.',
      },
    ],
  },
  {
    id: 'chemistry-3',
    title: 'Chemistry III',
    track: 'applications',
    icon: '✧',
    color: 'lavender',
    description:
      'Measure molecular properties and move beyond the ground state with explicit excited-state methods and validation.',
    prerequisites: ['chemistry-2'],
    outcomes: [
      'Turn Pauli measurements into observable estimates with uncertainty.',
      'Compare variational deflation, subspace methods, and QPE for excited states.',
    ],
    lessons: [
      {
        id: 'measuring-observables',
        title: 'Measuring observables and uncertainty',
        time: 11,
        level: 'Application',
        topics: [
          'Measuring observables',
          'Pauli measurements',
          'Measurement grouping',
          'Shot allocation',
        ],
        body: [
          'An observable such as energy or a dipole component is represented by a Hermitian operator. After mapping, estimate each Pauli-string expectation from many fresh circuit preparations and combine the results with its real coefficient.',
          'For X, apply H before Z readout. For Y, apply S† then H. For a product string, multiply the ±1 outcomes on its nonidentity qubits. Compatible terms may share measurements, but grouping and covariance must be treated consistently. Report statistical uncertainty alongside estimates.',
        ],
        math: {
          formula: '⟨O⟩ = Σⱼ cⱼ⟨Pⱼ⟩;  Var(Ô) = Σⱼ cⱼ² Var(P̂ⱼ)  for independent estimates',
          explanation:
            'A Pauli outcome is ±1, so its single-shot variance is 1−⟨Pⱼ⟩². Grouped estimates may introduce covariance terms.',
        },
        example:
          'For O = −Z + 0.5X, estimates ⟨Z⟩ = 0.8 and ⟨X⟩ = 0.2 give ⟨O⟩ = −0.7. Both coefficients and measured signs matter.',
        practice: {
          prompt: 'For a measured two-qubit ZZ string, assign values to 00,01,10,11.',
          answer:
            '00 and 11 give +1; 01 and 10 give −1. Average these parity values over shots to estimate ⟨ZZ⟩.',
        },
        question: 'Which gate sequence before Z readout measures Y?',
        answers: ['H then S†', 'S† then H', 'X then Z'],
        correct: 1,
        why: 'Executing S† then H maps Y eigenstates to Z eigenstates: the effective observable is SHZH S† = Y.',
      },
      {
        id: 'excited-states',
        title: 'Calculate excited states',
        time: 12,
        level: 'Application',
        topics: [
          'Calculate excited states',
          'Excited-state energies',
          'VQD',
          'Quantum subspace expansion',
          'Spectroscopy',
        ],
        body: [
          'Ground-state VQE alone tends to return the lowest state accessible to the ansatz. Variational quantum deflation adds overlap penalties with previously found states, encouraging the next optimization to find an orthogonal state. Penalties and overlap estimates need careful tuning.',
          'Quantum subspace expansion builds Hamiltonian and overlap matrices in a chosen excitation subspace and solves a generalized eigenproblem classically. QPE can also sample excited energies when the input has overlap with those eigenstates. Validate particle number, symmetry, and excitation gaps against a reference model.',
        ],
        math: {
          formula: 'Fₖ(θ) = ⟨ψ(θ)|Ĥ|ψ(θ)⟩ + Σⱼ<ₖ βⱼ|⟨ψⱼ|ψ(θ)⟩|²;  ΔE = Eexcited − Eground',
          explanation:
            'Positive βⱼ penalize overlap. The excitation energy ΔE is the difference between consistent energy estimates.',
        },
        example:
          'For an exact two-level Hamiltonian with energies −1 and +1, suppressing overlap with the −1 ground state directs a sufficiently expressive deflated ansatz toward +1. The excitation gap is 2 in the same units.',
        practice: {
          prompt:
            'Why does rerunning ground-state VQE with a different random seed not reliably calculate an excited state?',
          answer:
            'The objective still favors the lowest energy. Excited-state methods need orthogonality, subspace, symmetry, or spectral constraints that select the intended state.',
        },
        question: 'What does the overlap penalty in variational deflation discourage?',
        answers: [
          'All entanglement',
          'Every state with negative energy',
          'Returning to an already found state',
        ],
        correct: 2,
        why: 'Penalizing overlap with previous eigenstate approximations helps target additional orthogonal states.',
      },
    ],
  },
];
