# Qubit Quest curriculum guide

University of Waterloo IBM Qiskit Fall Fest 2026

15 courses · 67 lessons · approximately 607 minutes of reading and short practice, before extended labs or projects. Times are estimates. This is a self-paced pathway; an event workshop can use a shorter selection.

## Recommended progression

1. **Mathematics:** an optional primer in complex numbers, linear algebra, tensor products, probability, eigenvalues, and calculus. Basic arithmetic is enough to start.
2. **Quantum fundamentals:** Quantum Mechanics Theories → Qubits Theories → Gates I → Gates II → Algorithm I → Algorithm II → Noises and Error Correction.
3. **Applications:** Algorithm III supplies the hybrid-computing bridge, then learners can choose Chemistry I–III, Machine Learning I–III, or both.

Prerequisites are recommendations. Lessons remain open so experienced learners can skip ahead and beginners can revisit earlier ideas. Repeated concepts first introduce the idea, then develop circuit mechanics or an application: entanglement leads to Bell/GHZ states, QPE leads to energy estimation, and VQE leads to molecular chemistry. Shor’s factoring algorithm and the Shor error-correcting code are separate topics.

## Course map

| Order | Course                      | Path                 | Lessons | Estimated minutes | Recommended before         |
| ----- | --------------------------- | -------------------- | ------- | ----------------- | -------------------------- |
| 1     | Mathematical foundations    | Mathematics          | 5       | 34                | Basic arithmetic           |
| 2     | Quantum Mechanics Theories  | Quantum fundamentals | 5       | 35                | Mathematical foundations   |
| 3     | Qubits Theories             | Quantum fundamentals | 4       | 28                | Quantum Mechanics Theories |
| 4     | Gates I                     | Quantum fundamentals | 5       | 34                | Qubits Theories            |
| 5     | Gates II                    | Quantum fundamentals | 4       | 31                | Gates I                    |
| 6     | Algorithm I                 | Quantum fundamentals | 9       | 80                | Gates II                   |
| 7     | Algorithm II                | Quantum fundamentals | 5       | 47                | Algorithm I                |
| 8     | Noises and Error Correction | Quantum fundamentals | 6       | 57                | Algorithm II               |
| 9     | Algorithm III               | Applications         | 4       | 39                | Algorithm II               |
| 10    | Chemistry I                 | Applications         | 6       | 63                | Algorithm III              |
| 11    | Chemistry II                | Applications         | 3       | 36                | Chemistry I                |
| 12    | Chemistry III               | Applications         | 2       | 23                | Chemistry II               |
| 13    | Machine Learning I          | Applications         | 3       | 29                | Algorithm III              |
| 14    | Machine Learning II         | Applications         | 2       | 23                | Machine Learning I         |
| 15    | Machine Learning III        | Applications         | 4       | 48                | Machine Learning II        |

## What a lesson contains

Every lesson has an introductory or application explanation, an equation with definitions, a worked example, a practice prompt with a revealable solution, and a knowledge check. Successful completion awards 25 XP once. Search finds course names and topic tags; path filters and expandable courses keep the larger syllabus navigable. Earlier completions migrate to stable lesson IDs.

### Executable experiments

- **Browser gate explorer:** exact pure-state H/X/Y/Z/S/T sequences, probabilities, and a Bloch vector. Compatible lessons preload their example sequence. Some gates are illustrated through decompositions, such as SX = HSH.
- **Existing Qiskit labs:** Bell-pair preparation, four-item Grover search, a two-qubit QFT, one-edge QAOA with a fixed mixer, and a manually swept toy spin energy experiment. Lesson buttons select the matching experiment.
- **Guided exercises:** rotations and larger circuits beyond the browser controls; hidden-problem reasoning; noisy channels and codes; molecular model preparation; kernels, classifiers, and neural architectures; photonic sampling. Their calculations and expected answers are included in the lessons. Full molecular execution, noisy simulation, automated optimization, photonic sampling, and ML training require additional implementations.

The toy spin energy experiment uses −ZI − IZ + 0.5XX in arbitrary units. Molecular lessons explicitly require a chemistry driver, declared geometry/basis/active space, mapping, energy offsets, and a validated reference. They do not relabel the toy model as H₂.

## Suggested event sampler

For an introductory workshop, use Meet your first qubit → Superposition and interference → X/Y/Z → H → Build and decode the four Bell states, then demonstrate one application such as QAOA or variational energy. Insert the math primer when participants need it. Reserve the specialist oracle, chemistry, QEC, and ML sequences for follow-up sessions and independent study.

## Full syllabus

### Mathematical foundations

An optional bridge from school mathematics to the language of quantum computing. Start here if vectors, complex numbers, or probability feel unfamiliar.

**Recommended before:** Basic arithmetic; no quantum background.

**Learning outcomes:**

- Read complex amplitudes and calculate probabilities.
- Multiply small matrices and build joint states.
- Recognize eigenvalues, derivatives, and expectation values.

| Lesson                                | Depth        | Topics                                                                   | Minutes | Activity                               |
| ------------------------------------- | ------------ | ------------------------------------------------------------------------ | ------- | -------------------------------------- |
| Complex numbers: magnitude and phase  | Introduction | Complex numbers; Amplitudes; Relative phase                              | 6       | Guided practice + worked answer        |
| Vectors, inner products, and matrices | Introduction | Linear algebra; Vectors; Matrices; Inner products                        | 7       | Worked practice + browser gate circuit |
| Tensor products: put systems together | Introduction | Tensor products; Composite systems; Bit ordering                         | 7       | Guided practice + worked answer        |
| Probability, shots, and averages      | Introduction | Probability; Normalization; Expectation values; Sampling                 | 6       | Guided practice + worked answer        |
| Eigenvalues and a little calculus     | Introduction | Eigenvalues; Eigenvectors; Derivatives; Optimization; Modular arithmetic | 8       | Guided practice + worked answer        |

### Quantum Mechanics Theories

Learn what a quantum state predicts, how it evolves, and why quantum correlations differ from classical ones. This is the conceptual introduction; circuits come later.

**Recommended before:** Mathematical foundations.

**Learning outcomes:**

- Read Dirac notation and Born’s rule.
- Connect wave functions and Schrödinger evolution to states.
- Explain entanglement and Bell’s theorem without faster-than-light claims.

| Lesson                                  | Depth        | Topics                                                  | Minutes | Activity                        |
| --------------------------------------- | ------------ | ------------------------------------------------------- | ------- | ------------------------------- |
| Quantum states and Dirac notation       | Introduction | Quantum states; Dirac notation; Bras and kets           | 6       | Guided practice + worked answer |
| Wave functions and Born’s rule          | Introduction | Wave functions; Born rule; Measurement                  | 7       | Guided practice + worked answer |
| How states evolve: Schrödinger equation | Introduction | Schrödinger equation; Hamiltonians; Time evolution      | 8       | Guided practice + worked answer |
| Entanglement: the introductory picture  | Introduction | Quantum entanglement; Product states; Correlations      | 6       | Guided practice + worked answer |
| Bell’s theorem and the CHSH test        | Introduction | Bell’s theorem; CHSH inequality; Local hidden variables | 8       | Guided practice + worked answer |

### Qubits Theories

Translate the mechanics into a working qubit model: Hilbert space, superposition, interference, the Bloch sphere, decoherence, and superdense coding.

**Recommended before:** Quantum Mechanics Theories.

**Learning outcomes:**

- Interpret a qubit state and its Bloch vector.
- Distinguish coherence from classical uncertainty.
- Trace how shared entanglement supports superdense coding.

| Lesson                                      | Depth        | Topics                                                | Minutes | Activity                               |
| ------------------------------------------- | ------------ | ----------------------------------------------------- | ------- | -------------------------------------- |
| Meet your first qubit: Hilbert space        | Introduction | Qubits; Hilbert space; Quantum states                 | 6       | Worked practice + browser gate circuit |
| Superposition and interference              | Introduction | Superposition; Interference; Coherence                | 6       | Worked practice + browser gate circuit |
| Bloch sphere, mixtures, and decoherence     | Core         | Bloch sphere; Mixed states; Decoherence               | 8       | Worked practice + browser gate circuit |
| Superdense coding: two bits, one sent qubit | Introduction | Superdense coding; Bell states; Quantum communication | 8       | Guided practice + worked answer        |

### Gates I

Build a circuit vocabulary with Pauli gates, Hadamard, controlled operations, Toffoli, SWAP, and measurement.

**Recommended before:** Qubits Theories.

**Learning outcomes:**

- Predict X, Y, Z, and H on simple states.
- Read controlled gates and distinguish them from measurement.
- Track reversible logic and changes of measurement basis.

| Lesson                                     | Depth | Topics                                                 | Minutes | Activity                               |
| ------------------------------------------ | ----- | ------------------------------------------------------ | ------- | -------------------------------------- |
| X, Y, and Z: the Pauli gates               | Core  | X gate; Y gate; Z gate                                 | 6       | Worked practice + browser gate circuit |
| H: change basis with Hadamard              | Core  | H gate; Hadamard gate; Basis changes                   | 6       | Worked practice + browser gate circuit |
| CX, CY, and CZ: coherent controls          | Core  | CX gate; CY gate; CZ gate; Controlled gates            | 8       | Worked practice + bell Qiskit lab      |
| CCNOT and SWAP: reversible building blocks | Core  | CCNOT; Toffoli gate; SWAP gate                         | 7       | Guided practice + worked answer        |
| Measurement: from amplitudes to records    | Core  | Measurement; Projective measurement; Measurement basis | 7       | Guided practice + worked answer        |

### Gates II

Move from fixed gates to rotations, phase gates and their daggers, arbitrary unitaries, and the square root of X.

**Recommended before:** Gates I.

**Learning outcomes:**

- Calculate parameterized single-qubit rotations.
- Distinguish relative phase from global phase and invert S and T.
- Check unitarity and understand SX compositions.

| Lesson                              | Depth | Topics                                          | Minutes | Activity                               |
| ----------------------------------- | ----- | ----------------------------------------------- | ------- | -------------------------------------- |
| RX, RY, and RZ: angles become gates | Core  | RX gate; RY gate; RZ gate; Rotation gates       | 8       | Guided practice + worked answer        |
| S, T, S dagger, and T dagger        | Core  | S gate; T gate; S dagger; T dagger; Phase gates | 8       | Worked practice + browser gate circuit |
| Unitary gates and inverse circuits  | Core  | Unitary; Unitary matrices; Circuit inverses     | 8       | Guided practice + worked answer        |
| SX: the square root of X            | Core  | SX gate; Square root of X; Native gates         | 7       | Worked practice + browser gate circuit |

### Algorithm I

Construct entangled states, then use oracles and interference to reveal hidden structure. Specialized hidden-problem lessons introduce their promises and limits rather than assuming a full complexity-theory background.

**Recommended before:** Gates II.

**Learning outcomes:**

- Build Bell and GHZ states and predict their measurements.
- Explain the promises behind Deutsch–Jozsa, Bernstein–Vazirani, and Simon.
- Recognize subgroup, shift, and linear-function problems and oracle costs.

| Lesson                                        | Depth        | Topics                                                          | Minutes | Activity                            |
| --------------------------------------------- | ------------ | --------------------------------------------------------------- | ------- | ----------------------------------- |
| Build and decode the four Bell states         | Core         | Entanglement; Bell’s state; Bell states; Bell-state preparation | 8       | Worked practice + bell Qiskit lab   |
| GHZ: entangle three or more qubits            | Core         | GHZ state; Multipartite entanglement                            | 8       | Guided practice + worked answer     |
| Deutsch–Jozsa: constant or balanced?          | Core         | Deutsch–Jozsa algorithm; Phase kickback; Oracles                | 9       | Guided practice + worked answer     |
| Bernstein–Vazirani: recover a hidden string   | Core         | Bernstein–Vazirani algorithm; Binary dot product; Phase oracle  | 9       | Guided practice + worked answer     |
| Simon’s problem: collect hidden constraints   | Core         | Simon’s problem; Simon’s algorithm; Linear equations over GF(2) | 10      | Guided practice + worked answer     |
| Hidden subgroup problem: the common pattern   | Introduction | Hidden subgroup problem; Abelian groups; Cosets                 | 9       | Guided practice + worked answer     |
| Hidden shift: find a displaced function       | Introduction | Hidden shift problem; Function promises; Fourier methods        | 9       | Guided practice + worked answer     |
| Hidden linear function: a structured relation | Introduction | Hidden linear function problem; Quadratic forms; Circuit depth  | 10      | Guided practice + worked answer     |
| Find it with Grover: an extra search lesson   | Core         | Grover’s algorithm; Amplitude amplification; Search             | 8       | Worked practice + grover Qiskit lab |

### Algorithm II

Connect transforms and eigenphases to period finding, then prepare for hybrid computation with parameterized circuits.

**Recommended before:** Algorithm I.

**Learning outcomes:**

- Distinguish the Hadamard transform from the QFT.
- Trace QPE and the quantum part of Shor’s algorithm.
- Define an ansatz, parameters, and a measured objective.

| Lesson                                      | Depth | Topics                                                                       | Minutes | Activity                         |
| ------------------------------------------- | ----- | ---------------------------------------------------------------------------- | ------- | -------------------------------- |
| Hadamard transform over bit strings         | Core  | Hadamard transform; Walsh–Hadamard transform; Binary Fourier transform       | 8       | Guided practice + worked answer  |
| QFT: read the rhythm of phases              | Core  | QFT; Quantum Fourier transform; Fourier basis                                | 9       | Worked practice + qft Qiskit lab |
| QPE: estimate a unitary eigenphase          | Core  | QPE; Quantum phase estimation; Controlled powers; Inverse QFT                | 10      | Guided practice + worked answer  |
| Shor’s algorithm: period finding to factors | Core  | Shor’s algorithm; Order finding; Modular exponentiation; Continued fractions | 11      | Guided practice + worked answer  |
| Parameterized quantum circuits              | Core  | Parameterized quantum circuits; PQC; Ansatz; Parameter-shift rule            | 9       | Guided practice + worked answer  |

### Noises and Error Correction

Connect decoherence to concrete noise channels, then learn how redundancy and syndrome measurements protect quantum information.

**Recommended before:** Algorithm II.

**Learning outcomes:**

- Compare damping, Pauli-flip, and depolarizing channels.
- Use density matrices to describe noisy states.
- Explain syndrome extraction, the Shor code, and toric-code topology.

| Lesson                                       | Depth | Topics                                                               | Minutes | Activity                        |
| -------------------------------------------- | ----- | -------------------------------------------------------------------- | ------- | ------------------------------- |
| Density matrices and quantum channels        | Core  | Density matrices; Noise channels; Kraus operators; Decoherence       | 8       | Guided practice + worked answer |
| Amplitude damping and phase damping          | Core  | Amplitude damping; Phase damping; T1; T2                             | 10      | Guided practice + worked answer |
| Bit flips and phase flips                    | Core  | Bit flip; Phase flip; Pauli errors                                   | 8       | Guided practice + worked answer |
| Depolarizing channels and Bloch contraction  | Core  | Depolarizing channels; Bloch vector contraction; Noise models        | 8       | Guided practice + worked answer |
| QEC and the nine-qubit Shor code             | Core  | QEC; Quantum error correction; Syndromes; Shor code; Repetition code | 12      | Guided practice + worked answer |
| Toric code: local checks, global information | Core  | Toric code; Stabilizers; Topological codes; Surface code             | 11      | Guided practice + worked answer |

### Algorithm III

Use the circuit tools for optimization, variational energy, and spectral estimation, then compare them with the photonic model of boson sampling.

**Recommended before:** Algorithm II.

**Learning outcomes:**

- Interpret QAOA and VQE objectives and resource costs.
- Apply phase estimation to energy with a declared convention.
- Explain what boson sampling samples and why it is a distinct model.

| Lesson                                    | Depth        | Topics                                                                        | Minutes | Activity                                            |
| ----------------------------------------- | ------------ | ----------------------------------------------------------------------------- | ------- | --------------------------------------------------- |
| Optimization with QAOA                    | Application  | Optimization; QAOA; MaxCut; Cost and mixer unitaries                          | 10      | Worked practice + optimization Qiskit lab           |
| VQE: optimize a trial energy              | Application  | VQE; Variational quantum eigensolver; Variational principle; Hamiltonians     | 10      | Worked practice + toy variational energy Qiskit lab |
| Phase estimation as an energy measurement | Application  | Phase estimation; Energy estimation; Hamiltonian simulation; Spectral methods | 10      | Guided practice + worked answer                     |
| Boson sampling: a photonic sampling task  | Introduction | Boson sampling; Linear optics; Photons; Permanents                            | 9       | Guided practice + worked answer                     |

### Chemistry I

Build the chain from a molecule and its electronic approximations to a fermionic Hamiltonian and a qubit operator.

**Recommended before:** Algorithm III.

**Learning outcomes:**

- Explain Born–Oppenheimer and Hartree–Fock assumptions.
- Read second-quantized creation and annihilation operators.
- Compare fermion-to-qubit mappings and specify a reproducible molecular model.

| Lesson                                       | Depth | Topics                                                                          | Minutes | Activity                        |
| -------------------------------------------- | ----- | ------------------------------------------------------------------------------- | ------- | ------------------------------- |
| Born–Oppenheimer: separate electronic motion | Core  | Born–Oppenheimer approximation; Electronic structure; Potential energy surfaces | 9       | Guided practice + worked answer |
| Hartree–Fock: the mean-field reference       | Core  | Hartree–Fock; HF theory; Slater determinants; Electron correlation              | 10      | Guided practice + worked answer |
| Second quantization: count occupied orbitals | Core  | Second quantization; Fermions; Creation operators; Annihilation operators       | 11      | Guided practice + worked answer |
| Jordan–Wigner: fermions become Pauli strings | Core  | Jordan–Wigner transformation; Fermion-to-qubit mapping; Parity strings          | 11      | Guided practice + worked answer |
| Bravyi–Kitaev and parity transformations     | Core  | Bravyi–Kitaev transformation; Parity transformation; Qubit tapering             | 10      | Guided practice + worked answer |
| Molecular Hamiltonians: specify the model    | Core  | Molecular Hamiltonians; Electronic integrals; Active space; Energy units        | 12      | Guided practice + worked answer |

### Chemistry II

Plan reproducible H₂, LiH, and BeH₂ studies and understand the UCCSD ansatz. Guided molecular exercises build on the toy energy lab; full molecular execution needs a chemistry driver and solver.

**Recommended before:** Chemistry I.

**Learning outcomes:**

- Design a small molecular energy workflow with classical references.
- Choose explicit active spaces for larger molecules.
- Explain single/double excitations in UCCSD and their costs.

| Lesson                               | Depth       | Topics                                                                       | Minutes | Activity                        |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------- | ------- | ------------------------------- |
| H₂ molecular energy and a bond curve | Application | H2 molecular energy state; H₂; Ground-state energy; Bond dissociation curve  | 12      | Guided practice + worked answer |
| LiH and BeH₂: choose an active space | Application | LiH simulations; BeH2 simulations; BeH₂; Frozen core; Active-space selection | 12      | Guided practice + worked answer |
| UCCSD: single and double excitations | Core        | Unitary Coupled Cluster; UCCSD ansatz; Excitation operators; Trotterization  | 12      | Guided practice + worked answer |

### Chemistry III

Measure molecular properties and move beyond the ground state with explicit excited-state methods and validation.

**Recommended before:** Chemistry II.

**Learning outcomes:**

- Turn Pauli measurements into observable estimates with uncertainty.
- Compare variational deflation, subspace methods, and QPE for excited states.

| Lesson                                | Depth       | Topics                                                                                          | Minutes | Activity                        |
| ------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| Measuring observables and uncertainty | Application | Measuring observables; Pauli measurements; Measurement grouping; Shot allocation                | 11      | Guided practice + worked answer |
| Calculate excited states              | Application | Calculate excited states; Excited-state energies; VQD; Quantum subspace expansion; Spectroscopy | 12      | Guided practice + worked answer |

### Machine Learning I

Encode classical data into quantum states, then construct Z and ZZ feature maps. Include preprocessing and state-preparation costs in the model.

**Recommended before:** Algorithm III.

**Learning outcomes:**

- Compare angle and amplitude encoding with worked inputs.
- Explain Z and ZZ feature maps.
- Avoid data leakage when preparing training and evaluation sets.

| Lesson                                    | Depth       | Topics                                                                   | Minutes | Activity                        |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------ | ------- | ------------------------------- |
| Angle encoding: features become rotations | Application | Data encoding; Angle encoding; Feature scaling; Train/test split         | 9       | Guided practice + worked answer |
| Amplitude encoding and preparation cost   | Application | Data encoding; Amplitude encoding; State preparation                     | 10      | Guided practice + worked answer |
| Z and ZZ feature maps                     | Core        | Z feature map; ZZ feature map; Feature maps; Data-dependent entanglement | 10      | Guided practice + worked answer |

### Machine Learning II

Turn feature-state overlaps into kernels, then train and evaluate a support-vector classifier without overstating quantum benefits.

**Recommended before:** Machine Learning I.

**Learning outcomes:**

- Calculate fidelity-kernel entries and construct train/test matrices.
- Explain the quantum and classical parts of a QSVM workflow.

| Lesson                                   | Depth       | Topics                                                                    | Minutes | Activity                        |
| ---------------------------------------- | ----------- | ------------------------------------------------------------------------- | ------- | ------------------------------- |
| Quantum kernels: similarity from overlap | Application | Quantum kernels; Fidelity kernels; Kernel matrices; Compute–uncompute     | 11      | Guided practice + worked answer |
| QSVM: a kernel classification workflow   | Application | QSVM; Quantum support vector machine; Classification; Classical baselines | 12      | Guided practice + worked answer |

### Machine Learning III

Build intuition for trainable quantum models, recurrent hybrids, and one- and two-dimensional convolutional designs. These are model families with explicit design choices, not single standardized architectures.

**Recommended before:** Machine Learning II.

**Learning outcomes:**

- Explain QNN and VQC training from encoded inputs and measurements.
- Trace a hybrid QLSTM time step.
- Compare QCNN-1D and QCNN-2D connectivity, pooling, and evaluation.

| Lesson                                    | Depth        | Topics                                                                              | Minutes | Activity                        |
| ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------- | ------- | ------------------------------- |
| QNNs and variational quantum classifiers  | Application  | QNNs; Quantum neural networks; VQC; Variational quantum classifier; Barren plateaus | 12      | Guided practice + worked answer |
| QLSTM: a hybrid recurrent model           | Introduction | QLSTM; Quantum long short-term memory; Time series; Hybrid recurrent networks       | 12      | Guided practice + worked answer |
| QCNN-1D: local circuits and pooling       | Introduction | QCNN-1D; Quantum convolutional neural network; Pooling; Parameter sharing           | 12      | Guided practice + worked answer |
| QCNN-2D: image neighborhoods and hardware | Introduction | QCNN-2D; Quantum convolution; Image classification; Hardware connectivity           | 12      | Guided practice + worked answer |

## Further reading and implementation references

- [IBM: Basics of Quantum Information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information) — states, measurements, circuits, and entanglement.
- [IBM: Fundamentals of Quantum Algorithms](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms) — algorithmic background and query models.
- [IBM: Foundations of Quantum Error Correction](https://quantum.cloud.ibm.com/learning/en/courses/foundations-of-quantum-error-correction) — error correction and stabilizers.
- [Qiskit Nature documentation](https://qiskit-community.github.io/qiskit-nature/) — molecular drivers, electronic structure, mappings, and solvers.
- [Qiskit Machine Learning documentation](https://qiskit-community.github.io/qiskit-machine-learning/) — kernels, neural networks, and classifiers.
- [Bravyi, Gosset, and König: Quantum advantage with shallow circuits](https://arxiv.org/abs/1704.00690) — the specialized hidden linear function relation introduced in Algorithm I.
- [Aaronson and Arkhipov: The Computational Complexity of Linear Optics](https://arxiv.org/abs/1011.3245) — ideal boson-sampling complexity assumptions.

## Maintaining the curriculum

The source of truth is apps/web/src/curriculum.ts and the typed modules in apps/web/src/curriculum/. Keep lesson IDs stable. New lessons need substantive worked practice and a correct, unique quiz answer. Lab links must select an experiment the application can execute. Run npm test and npm run build; the curriculum checks protect requested-topic coverage, references, and the historical progress migration. If lesson order, counts, or scope changes, update this guide alongside the code.
