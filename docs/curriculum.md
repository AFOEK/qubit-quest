# Qubit Quest curriculum guide

University of Waterloo IBM Qiskit Fall Fest 2026

27 courses · 119 lessons · approximately 1190 minutes of reading and short practice, before extended labs or projects. Times are estimates. This is a self-paced pathway; an event workshop can use a shorter selection.

## Recommended progression

1. **Mathematics:** an optional primer in complex numbers, linear algebra, tensor products, probability, eigenvalues, and calculus. Basic arithmetic is enough to start.
2. **Quantum fundamentals:** Quantum Mechanics Theories → Qubits Theories → Gates I → Gates II → Software and Compilation → Algorithm I → Algorithm II → Noises and Error Correction → Error Mitigation → Hardware I–IV. Hardware is a specialist branch after the software/noise prerequisites; learners can follow the recommended prerequisite links to choose another branch.
3. **Applications:** Applied Optimization explains QUBO/Ising modeling before Algorithm III introduces QAOA and other applications. After Algorithm III, choose Classical–Quantum Boundaries I–III, Cryptography I–II, Chemistry I–III, Machine Learning I–III, or several branches. These branches do not require one another.

Prerequisites are recommendations. Lessons remain open so experienced learners can skip ahead and beginners can revisit earlier ideas. Cryptography I uses the state, entanglement, and Bell-test foundations; Cryptography II also builds on the Shor/Grover material. Chemistry and ML use the hybrid-computing ideas in Algorithm III. Classical–Quantum Boundaries uses its variational-energy background, introduces diagrams and Schmidt tools first, then MPS/MPO and DMRG/TEBD, then TTN/MERA/PEPS. Hardware proceeds from microwave physics through pulse descriptions, characterization, and effective-Hamiltonian models.

Repeated concepts first introduce the idea, then develop circuit mechanics or an application: entanglement leads to Bell/GHZ states, introductory Grover search leads to iteration geometry and amplitude amplification, QPE leads to QAE and energy estimation, and VQE leads to molecular chemistry. Algorithm II places amplification and QPE before QAE. Shor’s factoring algorithm and the Shor error-correcting code are separate topics. OpenPulse first appears as a software introduction and becomes a detailed control-language study in Hardware II. Existing lesson IDs remain stable as sections are inserted.

## Course map

| Order | Course                           | Path                 | Lessons | Estimated minutes | Recommended before                                    |
| ----- | -------------------------------- | -------------------- | ------- | ----------------- | ----------------------------------------------------- |
| 1     | Mathematical foundations         | Mathematics          | 5       | 34                | Basic arithmetic                                      |
| 2     | Quantum Mechanics Theories       | Quantum fundamentals | 5       | 35                | Mathematical foundations                              |
| 3     | Qubits Theories                  | Quantum fundamentals | 4       | 28                | Quantum Mechanics Theories                            |
| 4     | Gates I                          | Quantum fundamentals | 5       | 34                | Qubits Theories                                       |
| 5     | Gates II                         | Quantum fundamentals | 4       | 31                | Gates I                                               |
| 6     | Software and Compilation         | Quantum fundamentals | 4       | 40                | Gates II                                              |
| 7     | Algorithm I                      | Quantum fundamentals | 9       | 80                | Gates II                                              |
| 8     | Algorithm II                     | Quantum fundamentals | 9       | 89                | Algorithm I                                           |
| 9     | Noises and Error Correction      | Quantum fundamentals | 6       | 57                | Algorithm II                                          |
| 10    | Error Mitigation                 | Quantum fundamentals | 5       | 57                | Noises and Error Correction                           |
| 11    | Hardware I                       | Quantum fundamentals | 3       | 34                | Software and Compilation, Noises and Error Correction |
| 12    | Hardware II                      | Quantum fundamentals | 4       | 44                | Hardware I                                            |
| 13    | Hardware III                     | Quantum fundamentals | 4       | 47                | Hardware II                                           |
| 14    | Hardware IV                      | Quantum fundamentals | 3       | 39                | Hardware III                                          |
| 15    | Applied Optimization             | Applications         | 3       | 34                | Algorithm II                                          |
| 16    | Algorithm III                    | Applications         | 4       | 39                | Applied Optimization                                  |
| 17    | Classical–Quantum Boundaries I   | Applications         | 5       | 57                | Algorithm III                                         |
| 18    | Classical–Quantum Boundaries II  | Applications         | 4       | 49                | Classical–Quantum Boundaries I                        |
| 19    | Classical–Quantum Boundaries III | Applications         | 3       | 35                | Classical–Quantum Boundaries II                       |
| 20    | Cryptography I                   | Applications         | 6       | 62                | Algorithm I                                           |
| 21    | Cryptography II                  | Applications         | 4       | 43                | Cryptography I, Algorithm II                          |
| 22    | Chemistry I                      | Applications         | 6       | 63                | Algorithm III                                         |
| 23    | Chemistry II                     | Applications         | 3       | 36                | Chemistry I                                           |
| 24    | Chemistry III                    | Applications         | 2       | 23                | Chemistry II                                          |
| 25    | Machine Learning I               | Applications         | 3       | 29                | Algorithm III                                         |
| 26    | Machine Learning II              | Applications         | 2       | 23                | Machine Learning I                                    |
| 27    | Machine Learning III             | Applications         | 4       | 48                | Machine Learning II                                   |

## What a lesson contains

Every lesson has an explanation, an equation or program excerpt with definitions, a worked example, a practice prompt with a revealable solution, and a knowledge check. Successful completion awards 25 XP once. Search finds course names and topic tags; path filters and expandable courses keep the larger syllabus navigable. Earlier completions migrate to stable lesson IDs.

### Executable experiments

- **Browser gate explorer:** exact pure-state H/X/Y/Z/S/T sequences, probabilities, and a Bloch vector. Compatible lessons preload their example sequence. Some gates are illustrated through decompositions, such as SX = HSH.
- **Existing Qiskit labs:** Bell-pair preparation, four-item Grover search, a two-qubit QFT, one-edge QAOA with a fixed mixer, and a manually swept toy spin energy experiment. Lesson buttons select the matching experiment. The deeper Grover lesson explicitly distinguishes its eight-item calculation from the existing four-item executable lab.
- **Guided exercises:** OpenQASM program reading and compilation reasoning; tensor diagrams/contractions, Schmidt truncation, MPS/MPO and tensor solvers; microwave/pulse models, characterization, and Hamiltonian engineering; larger algorithms and quantum walks; QAE; QKD and post-quantum cryptography; QUBO/Ising construction; noise and mitigation calculations; molecular model preparation; kernels, classifiers, neural architectures, and photonic sampling. Their reasoning and expected answers are included in the lessons. QASM execution, tensor-network solvers, hardware pulse execution, full protocol implementations, calibrated noisy simulations, molecular execution, automated optimization, photonic sampling, and ML training require additional implementations.

The toy spin energy experiment uses −ZI − IZ + 0.5XX in arbitrary units. Molecular lessons explicitly require a chemistry driver, declared geometry/basis/active space, mapping, energy offsets, and a validated reference.

Error Mitigation distinguishes dynamical decoupling (suppression), Pauli twirling (noise tailoring), and readout/ZNE/PEC estimators (bias reduction with calibration and sampling tradeoffs). These methods do not replace encoded quantum error correction. Cryptography distinguishes QKD with authenticated classical messages from post-quantum algorithms running on classical computers.

## Software and hardware compatibility

OpenQASM is a language family; compiler/importer coverage and device execution support are separate. OpenPulse is an evolving target-dependent calibration grammar, distinct from the historical JSON wire format. The software/hardware exercises include program interpretation and analytic models; they submit no hardware jobs and install no additional dependencies. Qiskit Pulse was removed in Qiskit 2.0. The Qiskit Dynamics upstream repository is archived and marked deprecated, so its lesson is a historical, version-specific reference. A future executable pulse-model lab must select a compatible supported stack and validate its assumptions.

## Suggested event sampler

For an introductory workshop, use Meet your first qubit → Superposition and interference → X/Y/Z → H → Build and decode the four Bell states, then demonstrate one application such as QAOA or variational energy. Insert the math primer when participants need it. Use the QUBO/Ising lessons before asking learners to construct an optimization Hamiltonian. BB84 offers a communication-focused follow-up. Reserve the specialist oracle, mitigation, QEC, chemistry, and ML sequences for follow-up sessions and independent study.

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

### Software and Compilation

Connect gate circuits to portable program descriptions, target-aware transpilation, OpenQASM 3 control flow, and the introductory role of pulse-level calibration.

**Recommended before:** Gates II.

**Learning outcomes:**

- Read a small OpenQASM 2 circuit and distinguish source formats from device support.
- Explain decomposition, layout, routing, optimization, and scheduling.
- Compare OpenQASM 3 programs with target-specific OpenPulse calibrations.

| Lesson                                              | Depth        | Topics                                                                          | Minutes | Activity                          |
| --------------------------------------------------- | ------------ | ------------------------------------------------------------------------------- | ------- | --------------------------------- |
| OpenQASM: a language for circuit exchange           | Introduction | OpenQASM; OpenQASM 2; Quantum assembly; Circuit interchange                     | 9       | Worked practice + bell Qiskit lab |
| Transpilation: make a circuit fit its target        | Core         | Transpilation; Basis gates; Layout; Routing; Scheduling                         | 11      | Guided practice + worked answer   |
| OpenQASM 3.0: classical control and timing          | Core         | OpenQASM 3.0; OpenQASM3.0; OpenQASM 3; Dynamic circuits; Classical control flow | 11      | Guided practice + worked answer   |
| OpenPulse: where circuit instructions meet controls | Introduction | OpenPulse; Pulse-level programming; Calibration grammar                         | 9       | Guided practice + worked answer   |

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
| Find it with Grover: the introductory picture | Introduction | Grover’s algorithm; Amplitude amplification; Search             | 8       | Worked practice + grover Qiskit lab |

### Algorithm II

Develop Grover search, amplitude amplification, and quantum walks, then connect Fourier transforms and phase estimation to QAE, period finding, and parameterized circuits.

**Recommended before:** Algorithm I.

**Learning outcomes:**

- Choose Grover iteration counts and distinguish amplification from amplitude estimation.
- Explain coherent quantum walks and their graph-dependent behavior.
- Distinguish the Hadamard transform from the QFT.
- Trace QPE and the quantum part of Shor’s algorithm.
- Define an ansatz, parameters, and a measured objective.

| Lesson                                            | Depth        | Topics                                                                          | Minutes | Activity                            |
| ------------------------------------------------- | ------------ | ------------------------------------------------------------------------------- | ------- | ----------------------------------- |
| Hadamard transform over bit strings               | Core         | Hadamard transform; Walsh–Hadamard transform; Binary Fourier transform          | 8       | Guided practice + worked answer     |
| Grover’s algorithm: geometry and iteration counts | Core         | Grover’s algorithm; Search; Oracle queries; Grover iterations                   | 10      | Worked practice + grover Qiskit lab |
| Amplitude amplification beyond uniform search     | Core         | Amplitude amplification; Good-state reflections; State preparation              | 10      | Guided practice + worked answer     |
| Quantum random walks: coherent motion on a graph  | Introduction | Quantum random walks; Quantum walks; Discrete-time walks; Continuous-time walks | 10      | Guided practice + worked answer     |
| QFT: read the rhythm of phases                    | Core         | QFT; Quantum Fourier transform; Fourier basis                                   | 9       | Worked practice + qft Qiskit lab    |
| QPE: estimate a unitary eigenphase                | Core         | QPE; Quantum phase estimation; Controlled powers; Inverse QFT                   | 10      | Guided practice + worked answer     |
| QAE: estimate an amplitude using eigenphases      | Core         | Quantum amplitude estimation; QAE; Amplitude estimation; Monte Carlo estimation | 12      | Guided practice + worked answer     |
| Shor’s algorithm: period finding to factors       | Core         | Shor’s algorithm; Order finding; Modular exponentiation; Continued fractions    | 11      | Guided practice + worked answer     |
| Parameterized quantum circuits                    | Core         | Parameterized quantum circuits; PQC; Ansatz; Parameter-shift rule               | 9       | Guided practice + worked answer     |

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

### Error Mitigation

Build on noise channels and QEC to distinguish noise suppression, noise tailoring, and statistical mitigation. Learn dynamical decoupling, Pauli twirling, twirled readout, ZNE, and PEC with their calibration and sampling costs.

**Recommended before:** Noises and Error Correction.

**Learning outcomes:**

- Explain which error sources each method targets and how it differs from QEC.
- Calculate simple twirled-readout and zero-noise estimates.
- Interpret quasiprobability weights and the sampling overhead of PEC.

| Lesson                                             | Depth       | Topics                                                                                                 | Minutes | Activity                        |
| -------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ | ------- | ------------------------------- |
| Dynamical decoupling: refocus idle evolution       | Core        | Dynamical decoupling; Spin echo; Noise suppression; Idle errors                                        | 10      | Guided practice + worked answer |
| Pauli twirling: tailor the effective noise         | Core        | Pauli twirling; Randomized compiling; Noise tailoring; Pauli channels                                  | 11      | Guided practice + worked answer |
| Readout error mitigation with twirled measurements | Application | Readout error mitigation; Twirled readout; Twirled Readout Error eXtinction; TREX; Assignment matrices | 12      | Guided practice + worked answer |
| ZNE: extrapolate toward zero noise                 | Application | Zero-noise extrapolation; ZNE; Noise scaling; Gate folding                                             | 12      | Guided practice + worked answer |
| PEC: cancel a calibrated noise model statistically | Application | Probabilistic error cancellation; PEC; Quasiprobabilities; Sampling overhead                           | 12      | Guided practice + worked answer |

### Hardware I

Connect two-level energy splittings to microwave resonance, rotating-frame drives, and shaped pulse envelopes. Examples use an explicitly simplified superconducting-qubit model.

**Recommended before:** Software and Compilation, Noises and Error Correction.

**Learning outcomes:**

- Distinguish carrier frequency, detuning, and Rabi rate with consistent units.
- Relate resonant control Hamiltonians to RX/RY rotations.
- Compare square, Gaussian, Gaussian-square, and DRAG pulse ideas.

| Lesson                                          | Depth        | Topics                                                                              | Minutes | Activity                        |
| ----------------------------------------------- | ------------ | ----------------------------------------------------------------------------------- | ------- | ------------------------------- |
| Microwave resonance: match an energy transition | Introduction | Microwave drives and resonance; Microwave resonance; Transition frequency; Detuning | 10      | Guided practice + worked answer |
| Microwave drives: rotations in a rotating frame | Core         | Microwave drives; Rotating frame; Rotating-wave approximation; Quadrature control   | 12      | Guided practice + worked answer |
| Pulse envelopes: shapes, bandwidth, and leakage | Core         | Pulse envelopes; Pulse shapes; Gaussian pulses; Gaussian-square pulses; DRAG        | 12      | Guided practice + worked answer |

### Hardware II

Develop the OpenPulse introduction into ports, frames, timed instructions, and defcal bindings. Read provider-dependent control descriptions without assuming an available pulse backend.

**Recommended before:** Hardware I.

**Learning outcomes:**

- Distinguish physical ports, stateful frames, and waveforms.
- Track instruction timing and acquisition separately from gate semantics.
- Explain calibration selection and compile-time duration requirements.

| Lesson                                              | Depth | Topics                                                                      | Minutes | Activity                        |
| --------------------------------------------------- | ----- | --------------------------------------------------------------------------- | ------- | ------------------------------- |
| OpenPulse: a target-dependent control description   | Core  | OpenPulse; OpenPulse grammar; Control stack; Pulse scheduling               | 10      | Guided practice + worked answer |
| Ports and frames: resources, clocks, and phase      | Core  | Ports and frames; Ports; Frames; Carrier phase; Virtual Z                   | 11      | Guided practice + worked answer |
| Instructions: play, capture, delay, and synchronize | Core  | Instructions; OpenPulse instructions; Play; Capture; Delay; Barrier         | 11      | Guided practice + worked answer |
| Defcal: bind an instruction to a calibration        | Core  | Defcal; Define calibration; Calibration definitions; Physical qubit binding | 12      | Guided practice + worked answer |

### Hardware III

Design a characterization sequence: establish readout and device parameters, locate transitions with spectroscopy, fit Rabi rotations, and distinguish relaxation from coherence decay.

**Recommended before:** Hardware II.

**Learning outcomes:**

- Separate fitting, calibration updates, and independent validation.
- Interpret spectroscopy and Rabi traces with explicit units.
- Distinguish T₁, Ramsey T₂*, echo T₂, and model-dependent dephasing relations.

| Lesson                                                    | Depth       | Topics                                                                                                  | Minutes | Activity                        |
| --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| Hardware calibration and characterization: close the loop | Application | Hardware calibration & characterization; Hardware calibration; Characterization; Calibration validation | 11      | Guided practice + worked answer |
| Spectroscopy: locate and fit a transition                 | Application | Spectroscopy; Frequency sweeps; Resonance fitting; Linewidth                                            | 11      | Guided practice + worked answer |
| Rabi experiments: calibrate rotation angles               | Application | Rabi experiments; Rabi oscillations; π pulse; π/2 pulse                                                 | 12      | Guided practice + worked answer |
| Coherence measurements: T₁, Ramsey, and echo              | Application | Coherence measurements; T1 measurements; Ramsey; T2 star; Spin echo                                     | 13      | Guided practice + worked answer |

### Hardware IV

Build and validate driven Hamiltonian models, understand the cross-resonance interaction, and study Qiskit Dynamics as an archived, version-specific simulation toolkit.

**Recommended before:** Hardware III.

**Learning outcomes:**

- Explain frame changes and effective-Hamiltonian approximations.
- Distinguish a desired cross-resonance ZX term from unwanted couplings.
- Specify and validate a time-dependent simulation without assuming current pulse execution support.

| Lesson                                                          | Depth       | Topics                                                                                                       | Minutes | Activity                        |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------- |
| Advanced Hamiltonian engineering and simulation                 | Core        | Advanced Hamiltonian engineering & simulation; Hamiltonian engineering; Average Hamiltonian; Toggling frames | 13      | Guided practice + worked answer |
| Cross-resonance: drive one qubit near another’s transition      | Core        | Cross-resonance effect; CR; Cross-resonance; ZX interaction; Echoed cross-resonance                          | 13      | Guided practice + worked answer |
| Qiskit Dynamics: model-driven simulation and version boundaries | Application | Qiskit Dynamics; Time-dependent simulation; Lindblad models; Simulation validation                           | 13      | Guided practice + worked answer |

### Applied Optimization

Translate a classical objective and its constraints into QUBO and Ising costs, then verify the mapping before running QAOA or another solver.

**Recommended before:** Algorithm II.

**Learning outcomes:**

- Construct a binary quadratic objective with explicit penalty terms.
- Convert binary variables to Ising spins and Pauli-Z operators.
- Validate a problem Hamiltonian by checking feasible assignments and exact small-instance energies.

| Lesson                                              | Depth       | Topics                                                                                                               | Minutes | Activity                        |
| --------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| QUBO: objectives, binary variables, and constraints | Core        | QUBO; Quadratic unconstrained binary optimization; Constraint penalties; Binary variables                            | 11      | Guided practice + worked answer |
| Ising: from binary costs to Pauli Z                 | Core        | Ising; Ising Hamiltonian; QUBO-to-Ising mapping; Pauli Z                                                             | 11      | Guided practice + worked answer |
| Map a classical problem to a Hamiltonian            | Application | Mapping classical problems to Hamiltonians; Problem Hamiltonians; Maximum-weight independent set; Penalty validation | 12      | Guided practice + worked answer |

### Algorithm III

Use the circuit tools for optimization, variational energy, and spectral estimation, then compare them with the photonic model of boson sampling.

**Recommended before:** Applied Optimization.

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

### Classical–Quantum Boundaries I

Read tensor diagrams, plan contractions, and use Schmidt spectra to understand when a quantum state can be represented accurately with limited classical resources.

**Recommended before:** Algorithm III.

**Learning outcomes:**

- Translate Penrose-style tensor diagrams into index sums.
- Relate Schmidt rank and entropy to representation cost.
- Calculate discarded weight and normalized truncation fidelity.

| Lesson                                                    | Depth        | Topics                                                                                          | Minutes | Activity                        |
| --------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| Penrose graphical calculus: tensors as connected diagrams | Introduction | Penrose graphical calculus; Tensor diagrams; Tensor indices                                     | 10      | Guided practice + worked answer |
| Tensor contractions: the order changes the cost           | Core         | Tensor contractions; Contraction order; Intermediate tensors; Classical simulation cost         | 11      | Guided practice + worked answer |
| Schmidt decomposition: expose bipartite structure         | Core         | Schmidt decomposition; Singular value decomposition; Schmidt rank; Reduced density matrices     | 12      | Guided practice + worked answer |
| Entanglement scaling: area laws and volume laws           | Core         | Entanglement scaling; Area law; Volume law; Entanglement entropy                                | 12      | Guided practice + worked answer |
| Schmidt truncation: accuracy has a measurable price       | Core         | Schmidt truncation; Schmidt decomposition and truncation; Discarded weight; Truncation fidelity | 12      | Guided practice + worked answer |

### Classical–Quantum Boundaries II

Use one-dimensional tensor networks to represent states and operators, optimize ground states with DMRG, and follow time evolution with TEBD.

**Recommended before:** Classical–Quantum Boundaries I.

**Learning outcomes:**

- Distinguish MPS state tensors from MPO operator tensors.
- Explain variational DMRG sweeps and their convergence checks.
- Separate time-step, bond-dimension, and truncation errors in TEBD.

| Lesson                                         | Depth       | Topics                                                                                             | Minutes | Activity                        |
| ---------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| MPS: a chain representation of a quantum state | Core        | Matrix product states; MPS; Bond dimension; Canonical forms                                        | 12      | Guided practice + worked answer |
| MPO: represent observables and Hamiltonians    | Core        | Matrix product operators; MPO; Operator tensors; Expectation contractions                          | 11      | Guided practice + worked answer |
| DMRG: variational ground-state sweeps          | Application | Density matrix renormalization group; DMRG; Variational tensor networks; Ground-state optimization | 13      | Guided practice + worked answer |
| TEBD: local gates, SVDs, and time evolution    | Application | Time-evolving block decimation; TEBD; Suzuki–Trotter decomposition; Entanglement growth            | 13      | Guided practice + worked answer |

### Classical–Quantum Boundaries III

Compare tree, multiscale, and two-dimensional tensor networks: TTN, MERA, and PEPS. Match geometry and entanglement structure to contraction and optimization costs.

**Recommended before:** Classical–Quantum Boundaries II.

**Learning outcomes:**

- Explain tree and multiscale structures and the purpose of disentanglers.
- Relate PEPS geometry to two-dimensional area-law states.
- Separate compact representability from efficient contraction.

| Lesson                                               | Depth | Topics                                                                                          | Minutes | Activity                        |
| ---------------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------- | ------- | ------------------------------- |
| TTN: hierarchical tree tensor networks               | Core  | TTN; Tree tensor networks; Isometries; Hierarchical contraction                                 | 11      | Guided practice + worked answer |
| MERA: disentangle before coarse-graining             | Core  | MERA; Multiscale entanglement renormalization ansatz; Disentanglers; Causal cones               | 12      | Guided practice + worked answer |
| PEPS: networks shaped like a two-dimensional lattice | Core  | PEPS; Projected entangled pair states; Two-dimensional tensor networks; Approximate contraction | 12      | Guided practice + worked answer |

### Cryptography I

Use nonorthogonal states and entanglement to understand quantum key distribution, from BB84 and B92 to E91 and device-independent security.

**Recommended before:** Algorithm I.

**Learning outcomes:**

- Explain no-cloning and the role of authenticated classical communication.
- Trace sifting, testing, reconciliation, and privacy amplification in QKD.
- Compare prepare-and-measure, entanglement-based, and device-independent protocols.

| Lesson                                                 | Depth        | Topics                                                                              | Minutes | Activity                        |
| ------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------- | ------- | ------------------------------- |
| No-cloning: why unknown states cannot be copied        | Core         | No-cloning theorem; No-cloning theorems; Nonorthogonal states; Quantum cryptography | 8       | Guided practice + worked answer |
| QKD: from quantum signals to a secret key              | Introduction | QKD; Quantum key distribution; Sifting; Privacy amplification; Authentication       | 9       | Guided practice + worked answer |
| BB84: two bases, four signal states                    | Application  | BB84; Prepare-and-measure QKD; Quantum bit error rate; QBER                         | 11      | Guided practice + worked answer |
| E91: distribute entanglement, test correlations        | Application  | E91; Entanglement-based QKD; Bell tests; Singlet state                              | 11      | Guided practice + worked answer |
| B92: two nonorthogonal states and inconclusive results | Application  | B92; Nonorthogonal signal states; Unambiguous state discrimination                  | 11      | Guided practice + worked answer |
| Device-independent QKD: security from tested behavior  | Introduction | Device-independent QKD; DIQKD; CHSH; Detection loophole                             | 12      | Guided practice + worked answer |

### Cryptography II

Compare post-quantum algorithms running on classical computers: lattice-based key establishment/signatures, hash-based signatures, and code-based cryptography.

**Recommended before:** Cryptography I, Algorithm II.

**Learning outcomes:**

- Distinguish post-quantum cryptography from QKD and quantum hardware.
- Explain the mathematical assumptions behind lattice, hash, and code families.
- Separate key encapsulation from signatures and recognize standardized scheme names.

| Lesson                                                               | Depth        | Topics                                                                       | Minutes | Activity                        |
| -------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------- | ------- | ------------------------------- |
| Post-quantum cryptography: classical algorithms for a quantum threat | Introduction | Post-quantum cryptography; PQC; Key encapsulation; Digital signatures        | 10      | Guided practice + worked answer |
| Lattice-based cryptography and noisy equations                       | Core         | Lattice-based cryptography; Learning with errors; LWE; ML-KEM; ML-DSA        | 11      | Guided practice + worked answer |
| Hash-based signatures and one-time key logic                         | Core         | Hash-based signatures; Lamport signatures; Merkle trees; SLH-DSA             | 11      | Guided practice + worked answer |
| Code-based cryptography and syndrome decoding                        | Core         | Code-based cryptography; Syndrome decoding; McEliece; Error-correcting codes | 11      | Guided practice + worked answer |

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
- [Brassard et al.: Quantum Amplitude Amplification and Estimation](https://arxiv.org/abs/quant-ph/0005055) — amplification and standard QAE.
- [IBM: Foundations of Quantum Error Correction](https://quantum.cloud.ibm.com/learning/en/courses/foundations-of-quantum-error-correction) — error correction and stabilizers.
- [IBM: Error mitigation and suppression techniques](https://quantum.cloud.ibm.com/docs/en/guides/error-mitigation-and-suppression-techniques) — dynamical decoupling, twirling, readout mitigation, ZNE, and PEC in a hardware execution context.
- [Ekert: Quantum cryptography based on Bell’s theorem](https://doi.org/10.1103/PhysRevLett.67.661) — E91.
- [Bennett: Quantum cryptography using any two nonorthogonal states](https://doi.org/10.1103/PhysRevLett.68.3121) — B92.
- [NIST FIPS 203: ML-KEM](https://csrc.nist.gov/pubs/fips/203/final), [FIPS 204: ML-DSA](https://csrc.nist.gov/pubs/fips/204/final), and [FIPS 205: SLH-DSA](https://csrc.nist.gov/pubs/fips/205/final) — standardized classical post-quantum constructions and their distinct roles.
- [Qiskit Optimization documentation](https://qiskit-community.github.io/qiskit-optimization/) — quadratic programs and optimization workflows.
- [Qiskit Nature documentation](https://qiskit-community.github.io/qiskit-nature/) — molecular drivers, electronic structure, mappings, and solvers.
- [Qiskit Machine Learning documentation](https://qiskit-community.github.io/qiskit-machine-learning/) — kernels, neural networks, and classifiers.
- [Bravyi, Gosset, and König: Quantum advantage with shallow circuits](https://arxiv.org/abs/1704.00690) — the specialized hidden linear function relation introduced in Algorithm I.
- [Aaronson and Arkhipov: The Computational Complexity of Linear Optics](https://arxiv.org/abs/1011.3245) — ideal boson-sampling complexity assumptions.

- [OpenQASM 3.0 specification](https://openqasm.com/versions/3.0/index.html), [pulse-level calibration definitions](https://openqasm.com/language/pulses.html), and [OpenPulse grammar](https://openqasm.com/language/openpulse.html) — language features, ports, frames, instructions, and defcal.
- [Qiskit 2.0 Pulse removal note](https://github.com/Qiskit/qiskit/blob/main/releasenotes/notes/2.0/remove-pulse-eb43f66499092489.yaml) — the SDK version boundary.
- [Qiskit Dynamics repository](https://github.com/qiskit-community/qiskit-dynamics) — archived/deprecated status and historical solver documentation.
- [Schollwöck: The density-matrix renormalization group in the age of matrix product states](https://arxiv.org/abs/1008.3477) — MPS/MPO, DMRG, and tensor-network foundations.
- [Vidal: Efficient simulation of one-dimensional quantum many-body systems](https://arxiv.org/abs/quant-ph/0310089) — local updates and TEBD.
- [Vidal: Entanglement renormalization](https://doi.org/10.1103/PhysRevLett.99.220405) — disentanglers and multiscale networks.
- [Verstraete and Cirac: Renormalization algorithms for quantum-many body systems in two and higher dimensions](https://arxiv.org/abs/cond-mat/0407066) — PEPS.
- [Motzoi et al.: Simple pulses for elimination of leakage in weakly nonlinear qubits](https://doi.org/10.1103/PhysRevLett.103.110501) — DRAG motivation.

## Maintaining the curriculum

The source of truth is apps/web/src/curriculum.ts and the typed modules in apps/web/src/curriculum/. Keep lesson IDs stable. New lessons need substantive worked practice and a correct, unique quiz answer. Lab links must select an experiment the application can execute. Run npm test, npm run format:check, and npm run build; the curriculum checks protect requested-topic coverage, prerequisite ordering, references, and historical progress migration. If lesson order, counts, or scope changes, update this guide alongside the code.
