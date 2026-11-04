import type { Course } from './types';

export const noise: Course[] = [
  {
    id: 'noise-qec',
    title: 'Noises and Error Correction',
    track: 'fundamentals',
    icon: '⛨',
    color: 'blue',
    description:
      'Connect decoherence to concrete noise channels, then learn how redundancy and syndrome measurements protect quantum information.',
    prerequisites: ['algorithms-2'],
    outcomes: [
      'Compare damping, Pauli-flip, and depolarizing channels.',
      'Use density matrices to describe noisy states.',
      'Explain syndrome extraction, the Shor code, and toric-code topology.',
    ],
    lessons: [
      {
        id: 'noise-channels',
        title: 'Density matrices and quantum channels',
        time: 8,
        level: 'Core',
        topics: ['Density matrices', 'Noise channels', 'Kraus operators', 'Decoherence'],
        body: [
          'A density matrix represents both pure states and mixtures. Its diagonal entries are computational-basis probabilities; off-diagonal entries carry coherence in that basis. A physical density matrix is positive semidefinite and has trace one.',
          'A quantum channel describes an allowed state transformation, including interaction with an unobserved environment. Kraus operators generalize the single unitary gate. The current browser gate explorer uses pure-state evolution, so the noise exercises here are calculations rather than noisy API simulations.',
        ],
        math: {
          formula: 'ρ = Σₖ pₖ|ψₖ⟩⟨ψₖ|;  E(ρ) = Σⱼ KⱼρKⱼ†;  Σⱼ Kⱼ†Kⱼ = I',
          explanation:
            'The last condition preserves trace. A unitary channel has one Kraus operator U.',
        },
        example:
          '|+⟩ has density matrix [[1/2,1/2],[1/2,1/2]]. The equally weighted mixture of |0⟩ and |1⟩ has [[1/2,0],[0,1/2]].',
        practice: {
          prompt: 'For a mixture with 75% |0⟩ and 25% |1⟩, write ρ and calculate its trace.',
          answer: 'ρ = [[0.75,0],[0,0.25]], and Tr(ρ) = 1.',
        },
        question: 'Which entries reveal coherence in the chosen basis?',
        answers: ['Only the trace', 'The off-diagonal entries', 'The number of rows'],
        correct: 1,
        why: 'Off-diagonal terms distinguish coherent superpositions from mixtures with matching populations.',
      },
      {
        id: 'damping-channels',
        title: 'Amplitude damping and phase damping',
        time: 10,
        level: 'Core',
        topics: ['Amplitude damping', 'Phase damping', 'T1', 'T2'],
        body: [
          'Amplitude damping models relaxation from an excited |1⟩ state toward |0⟩. With damping probability γ, excited population shrinks by 1−γ and coherence by √(1−γ). This is a simplified zero-temperature relaxation model.',
          'Phase damping removes coherence without changing computational-basis populations. Here λ means the fraction of off-diagonal coherence lost, so ρ₀₁ becomes (1−λ)ρ₀₁. Parameter conventions differ across libraries. T₁ describes relaxation time; T₂ includes coherence loss from relaxation and dephasing.',
        ],
        math: {
          formula: 'Amplitude: ρ₁₁ → (1−γ)ρ₁₁, ρ₀₀ → ρ₀₀+γρ₁₁;  Phase: ρ₀₁ → (1−λ)ρ₀₁',
          explanation:
            'Both maps also act on the conjugate off-diagonal entry. Phase damping preserves both diagonal entries.',
        },
        example:
          'With input |1⟩ and γ = 0.2, amplitude damping gives p(0) = 0.2 and p(1) = 0.8. Phase damping leaves the same input unchanged because it has no off-diagonal coherence.',
        practice: {
          prompt:
            'Apply complete phase damping (λ = 1) to |+⟩. Give its density matrix and Z probabilities.',
          answer:
            'ρ becomes I/2, with p(0) = p(1) = 1/2. Its X expectation drops from 1 to 0 despite the unchanged Z probabilities.',
        },
        question: 'Which channel can remove coherence while leaving Z-basis populations unchanged?',
        answers: ['Amplitude damping on |1⟩', 'An ideal X gate', 'Phase damping'],
        correct: 2,
        why: 'Phase damping suppresses off-diagonal entries; amplitude damping also changes excited-state population.',
      },
      {
        id: 'bit-phase-flip',
        title: 'Bit flips and phase flips',
        time: 8,
        level: 'Core',
        topics: ['Bit flip', 'Phase flip', 'Pauli errors'],
        body: [
          'A bit-flip channel applies X with probability p, and otherwise does nothing. A phase-flip channel instead applies Z with probability p. These are classical mixtures of quantum operations, not coherent superpositions of doing and not doing a gate.',
          'A phase flip is invisible when testing only |0⟩ and |1⟩ in the Z basis, but it switches |+⟩ and |−⟩. Error correction must handle both bit and phase information. A Y error combines both kinds up to phase.',
        ],
        math: {
          formula: 'Eₓ(ρ) = (1−p)ρ + pXρX;  E_z(ρ) = (1−p)ρ + pZρZ',
          explanation:
            'At p = 1/2, phase flips completely erase off-diagonal coherence in the Z basis. At p = 1, Z is a deterministic reversible gate.',
        },
        example:
          'A bit-flip channel on |0⟩ gives p(1) = p. A phase-flip channel on |+⟩ gives X expectation 1−2p.',
        practice: {
          prompt: 'For p = 1/4 phase flips on |+⟩, find ⟨X⟩.',
          answer: '⟨X⟩ = (3/4)(+1) + (1/4)(−1) = 1/2.',
        },
        question: 'Which pure states are exchanged by a Z phase flip?',
        answers: ['|+⟩ and |−⟩', '|0⟩ and |1⟩', 'Every state and the maximally mixed state'],
        correct: 0,
        why: 'Z changes the relative sign, converting the X-basis eigenstates into each other.',
      },
      {
        id: 'depolarizing',
        title: 'Depolarizing channels and Bloch contraction',
        time: 8,
        level: 'Core',
        topics: ['Depolarizing channels', 'Bloch vector contraction', 'Noise models'],
        body: [
          'A common single-qubit depolarizing convention replaces a fraction p of the state by the maximally mixed state I/2. Every Bloch-vector component shrinks by the same factor 1−p.',
          'This isotropic model is useful for simple comparisons but does not capture all real device behavior. Relaxation is directional, errors may be correlated, and gate-dependent noise can differ from a uniform depolarizing channel. Check a simulator’s parameter convention before comparing error rates.',
        ],
        math: {
          formula: 'E(ρ) = (1−p)ρ + pI/2;  (x,y,z) → (1−p)(x,y,z)',
          explanation: 'In this lesson 0 ≤ p ≤ 1, with p = 1 meaning complete depolarization.',
        },
        example: 'Start in |0⟩ and set p = 0.4. The output is [[0.8,0],[0,0.2]], with z = 0.6.',
        practice: {
          prompt:
            'Apply p = 0.2 depolarization to |+⟩. What are its Bloch vector and Z probabilities?',
          answer:
            'The vector becomes (0.8,0,0), while Z probabilities remain 1/2 each. Its X statistics reveal the loss of purity.',
        },
        question: 'Under complete depolarization in this convention, what is the output?',
        answers: ['Always |0⟩', 'I/2 for any input', 'An exact copy of the input'],
        correct: 1,
        why: 'At p = 1, the input contribution disappears and the output is maximally mixed.',
      },
      {
        id: 'qec-shor-code',
        title: 'QEC and the nine-qubit Shor code',
        time: 12,
        level: 'Core',
        topics: ['QEC', 'Quantum error correction', 'Syndromes', 'Shor code', 'Repetition code'],
        body: [
          'Quantum error correction encodes one logical qubit across several physical qubits. It avoids cloning by encoding α|0⟩+β|1⟩ as α|0L⟩+β|1L⟩, not as independent copies. Ancilla-based syndrome measurements reveal an error class without revealing α or β.',
          'The three-qubit repetition code corrects one X error but not arbitrary single-qubit noise. Shor’s nine-qubit code combines bit- and phase-error protection and has distance three, correcting any one physical-qubit error in the ideal correction model. It differs from Shor’s factoring algorithm.',
        ],
        math: {
          formula: '|0L⟩ = [(|000⟩+|111⟩)/√2]⊗³;  |1L⟩ = [(|000⟩−|111⟩)/√2]⊗³',
          explanation:
            'For the bit-flip repetition code, parity checks Z₀Z₁ and Z₁Z₂ locate one X error without reading the logical amplitudes.',
        },
        example:
          'In the three-qubit repetition code, an X error on the middle qubit flips both neighboring parity checks. The syndrome (−1,−1) identifies that location.',
        practice: {
          prompt:
            'Why does measuring every encoded data qubit in Z fail as a general correction method?',
          answer:
            'It reveals logical information and destroys the superposition. Stabilizer parity measurements reveal error syndromes while preserving the logical state.',
        },
        question: 'What should an error syndrome reveal?',
        answers: [
          'The unknown amplitudes α and β',
          'A duplicate of the logical qubit',
          'Which correctable error class occurred',
        ],
        correct: 2,
        why: 'Correction needs information about the error while preserving the encoded quantum information.',
      },
      {
        id: 'toric-code',
        title: 'Toric code: local checks, global information',
        time: 11,
        level: 'Core',
        topics: ['Toric code', 'Stabilizers', 'Topological codes', 'Surface code'],
        body: [
          'The toric code places physical qubits on edges of a periodic square lattice. Star checks multiply X around a vertex, while plaquette checks multiply Z around a face. All checks commute, allowing repeated syndrome extraction.',
          'Local error strings create detectable endpoints; a noncontractible loop around the torus can act on logical information without producing a syndrome. The code protects information through topology and distance. A torus encodes two logical qubits; practical surface-code layouts use boundaries with different encoding details.',
        ],
        math: {
          formula: 'Aᵥ = ∏ₑ∋ᵥ Xₑ;  Bₚ = ∏ₑ∈∂ₚ Zₑ;  [Aᵥ,Bₚ] = 0',
          explanation:
            'On an L×L torus the standard code distance is L. Increasing distance needs more physical qubits and a decoder.',
        },
        example:
          'A single Z on an edge anticommutes with the two adjacent star checks, creating two −1 syndrome values. It commutes with the Z plaquette checks.',
        practice: {
          prompt:
            'Why can a loop winding around the torus be dangerous even if all local checks return +1?',
          answer:
            'It has no local endpoints but can be a nontrivial logical operator. A decoder must infer error chains, and sufficiently long chains can cause logical errors.',
        },
        question: 'In the toric code, what does a single Z edge error flip?',
        answers: [
          'The adjacent X-type star checks',
          'Every logical qubit’s measured value directly',
          'Only the Z-type plaquette checks',
        ],
        correct: 0,
        why: 'Z anticommutes with X on the same edge and commutes with Z, so the neighboring star checks detect it.',
      },
    ],
  },
];
