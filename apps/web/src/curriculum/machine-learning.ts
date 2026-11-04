import type { Course } from './types';

export const machineLearning: Course[] = [
  {
    id: 'ml-1',
    title: 'Machine Learning I',
    track: 'applications',
    icon: '⌁',
    color: 'peach',
    description:
      'Encode classical data into quantum states, then construct Z and ZZ feature maps. Include preprocessing and state-preparation costs in the model.',
    prerequisites: ['algorithms-3'],
    outcomes: [
      'Compare angle and amplitude encoding with worked inputs.',
      'Explain Z and ZZ feature maps.',
      'Avoid data leakage when preparing training and evaluation sets.',
    ],
    lessons: [
      {
        id: 'angle-encoding',
        title: 'Angle encoding: features become rotations',
        time: 9,
        level: 'Application',
        topics: ['Data encoding', 'Angle encoding', 'Feature scaling', 'Train/test split'],
        body: [
          'Angle encoding uses classical features as rotation angles, such as RY(xⱼ) on qubit j. Repeated data-encoding layers can express richer functions, but they also add circuit depth.',
          'Fit scaling or normalization choices using the training set, then reuse them for validation and test data. Keep data angles x separate from trainable model angles θ. Start with a small classical baseline so you can judge whether the quantum representation helps.',
        ],
        math: {
          formula: '|φ(x)⟩ = ⊗ⱼ RY(xⱼ)|0⟩;  P(qⱼ=1) = sin²(xⱼ/2)',
          explanation:
            'Scaling maps feature ranges to chosen angles. Rotations are periodic, so careless scaling can identify distinct inputs.',
        },
        example:
          'For a feature mapped to angle π/3, one RY gate gives p(1) = 1/4. A feature mapped to π gives p(1) = 1.',
        practice: {
          prompt:
            'If you inspect the test set to choose a feature-scaling range, what can go wrong?',
          answer:
            'The test set influences training decisions, creating leakage. Fit preprocessing on training data and reserve the test set for final evaluation.',
        },
        question: 'In angle encoding, what directly carries a classical feature?',
        answers: ['A rotation angle', 'The shot count alone', 'The backend URL'],
        correct: 0,
        why: 'The input feature sets a gate parameter; measurement then depends on the encoded state.',
      },
      {
        id: 'amplitude-encoding',
        title: 'Amplitude encoding and preparation cost',
        time: 10,
        level: 'Application',
        topics: ['Data encoding', 'Amplitude encoding', 'State preparation'],
        body: [
          'Amplitude encoding normalizes a vector and uses its entries as state amplitudes. A length-2ⁿ vector fits into n qubits; shorter vectors can be padded. A zero vector cannot be normalized and needs an explicit handling rule.',
          'Compact storage does not imply free loading or full readout. Preparing an arbitrary dense state can require resources scaling with the vector length, and measurement does not reveal all amplitudes at once. A claimed advantage must account for input access and output requirements.',
        ],
        math: {
          formula: '|φ(x)⟩ = (1/‖x‖₂) Σⱼ xⱼ|j⟩;  ‖x‖₂ = √Σⱼ |xⱼ|²',
          explanation:
            'For real data, negative entries become relative phases. The normalization factor can discard overall scale unless stored separately.',
        },
        example: 'The vector [3,4] becomes (3/5)|0⟩ + (4/5)|1⟩, with probabilities 9/25 and 16/25.',
        practice: {
          prompt:
            'How many qubits store eight normalized amplitudes? Does that guarantee efficient end-to-end processing?',
          answer:
            'Three qubits. No: state preparation, repeated sampling, and the desired output can dominate the cost.',
        },
        question: 'Which input requires special handling before amplitude encoding?',
        answers: [
          'Any vector containing a negative entry',
          'The all-zero vector',
          'Every vector of length four',
        ],
        correct: 1,
        why: 'Its norm is zero, so dividing by the norm is undefined.',
      },
      {
        id: 'z-zz-feature-maps',
        title: 'Z and ZZ feature maps',
        time: 10,
        level: 'Core',
        topics: ['Z feature map', 'ZZ feature map', 'Feature maps', 'Data-dependent entanglement'],
        body: [
          'A feature map is a data-dependent circuit x → |φ(x)⟩. Z feature maps commonly start with Hadamards and add data-dependent Z phases. Adding ZZ interactions can represent pairwise relationships and can entangle the qubits.',
          'Gate order and angle conventions vary across libraries. Define your exact circuit before comparing kernels. Applying only Z phases to |0…0⟩ changes no relative amplitudes, so the initial basis change is essential. A ZZ feature map is a representation choice, not a guarantee of useful features.',
        ],
        math: {
          formula: '|φ(x)⟩ = exp[−i Σⱼ aⱼ(x)Zⱼ − i Σⱼ<ₖ bⱼₖ(x)ZⱼZₖ] H⊗ⁿ|0ⁿ⟩',
          explanation:
            'This declares one convention. The b terms encode pair interactions; software RZ/RZZ angles include a factor of two relative to the coefficients above.',
        },
        example:
          'A simple pair interaction uses b₀₁(x) = x₀x₁. The phase on a basis component depends on whether its two Z eigenvalues agree or differ.',
        practice: {
          prompt:
            'If you omit H and apply only diagonal Z/ZZ gates to |00⟩, do you obtain data-dependent measurement probabilities or distinguishable states?',
          answer:
            'No. |00⟩ is a simultaneous eigenstate, so the circuit adds only a global phase. A nontrivial superposition or other mixing gates are needed.',
        },
        question: 'What distinguishes a ZZ feature interaction from independent Z phases?',
        answers: [
          'It must measure every qubit',
          'It removes all phase dependence',
          'It introduces a two-qubit data-dependent term',
        ],
        correct: 2,
        why: 'The ZZ term couples basis-state phases across a pair and can create entanglement.',
      },
    ],
  },
  {
    id: 'ml-2',
    title: 'Machine Learning II',
    track: 'applications',
    icon: '⋈',
    color: 'peach',
    description:
      'Turn feature-state overlaps into kernels, then train and evaluate a support-vector classifier without overstating quantum benefits.',
    prerequisites: ['ml-1'],
    outcomes: [
      'Calculate fidelity-kernel entries and construct train/test matrices.',
      'Explain the quantum and classical parts of a QSVM workflow.',
    ],
    lessons: [
      {
        id: 'quantum-kernels',
        title: 'Quantum kernels: similarity from overlap',
        time: 11,
        level: 'Application',
        topics: ['Quantum kernels', 'Fidelity kernels', 'Kernel matrices', 'Compute–uncompute'],
        body: [
          'A fidelity kernel defines similarity by the squared overlap of two encoded states. Prepare U(x)|0⟩, apply U†(z), and estimate the probability of measuring all zeros. This compute–uncompute circuit evaluates one pairwise kernel entry.',
          'A training set of M examples generally needs O(M²) pair evaluations for a dense Gram matrix. Sampling and noise can disturb symmetry or positive semidefiniteness; assess these effects and record any correction. Strong kernel values alone do not demonstrate better generalization.',
        ],
        math: {
          formula: 'K(x,z) = |⟨φ(z)|φ(x)⟩|² = P(0ⁿ after U†(z)U(x))',
          explanation:
            'The ideal fidelity Gram matrix is symmetric and positive semidefinite, with K(x,x) = 1 for normalized pure feature states.',
        },
        example:
          'For one-qubit RY angle encoding, K(x,z) = cos²((x−z)/2). Identical angles give 1, while a π difference gives 0.',
        practice: {
          prompt: 'Find the ideal two-example kernel matrix for angles 0 and π.',
          answer: '[[1,0],[0,1]]. The feature states are |0⟩ and |1⟩, which are orthogonal.',
        },
        question: 'What probability estimates a compute–uncompute fidelity kernel?',
        answers: [
          'The all-zero output probability',
          'The all-one output probability in every convention',
          'The chance of any single qubit being 1',
        ],
        correct: 0,
        why: 'Undoing U(z) after U(x) leaves an all-zero amplitude equal to the feature-state overlap.',
      },
      {
        id: 'qsvm',
        title: 'QSVM: a kernel classification workflow',
        time: 12,
        level: 'Application',
        topics: ['QSVM', 'Quantum support vector machine', 'Classification', 'Classical baselines'],
        body: [
          'In a common QSVM workflow, quantum circuits estimate a kernel while a classical support-vector machine learns the decision boundary. Separate the feature-map design, kernel evaluation, and classical optimization steps.',
          'Split data before preprocessing. Build a train-by-train kernel for fitting and a test-by-train kernel for prediction. Tune the SVM regularization and feature-map choices on training/validation data. Compare held-out metrics with linear and radial-basis-function SVMs under comparable tuning effort.',
        ],
        math: {
          formula: 'f(x) = sign[Σᵢ αᵢyᵢ K(xᵢ,x) + b]',
          explanation:
            'The classical optimizer finds weights αᵢ and bias b. Labels yᵢ are typically ±1; only support vectors need nonzero weights.',
        },
        example:
          'With 20 training examples and 5 test examples, the fit kernel has shape 20×20 and the prediction kernel has shape 5×20.',
        practice: {
          prompt:
            'Design a fair small experiment comparing a quantum fidelity kernel and a classical RBF kernel.',
          answer:
            'Use the same train/validation/test split, training-only preprocessing, comparable tuning budgets, fixed random seeds, and held-out accuracy plus runtime/shot costs. Report uncertainty across repeated splits if feasible.',
        },
        question: 'What is the usual quantum component in this QSVM workflow?',
        answers: [
          'The entire classical SVM solver',
          'Kernel-entry estimation',
          'Automatic label generation',
        ],
        correct: 1,
        why: 'The feature-state overlap is evaluated by circuits, then supplied to a classical kernel classifier.',
      },
    ],
  },
  {
    id: 'ml-3',
    title: 'Machine Learning III',
    track: 'applications',
    icon: '⋮',
    color: 'peach',
    description:
      'Build intuition for trainable quantum models, recurrent hybrids, and one- and two-dimensional convolutional designs. These are model families with explicit design choices, not single standardized architectures.',
    prerequisites: ['ml-2'],
    outcomes: [
      'Explain QNN and VQC training from encoded inputs and measurements.',
      'Trace a hybrid QLSTM time step.',
      'Compare QCNN-1D and QCNN-2D connectivity, pooling, and evaluation.',
    ],
    lessons: [
      {
        id: 'qnn-vqc',
        title: 'QNNs and variational quantum classifiers',
        time: 12,
        level: 'Application',
        topics: [
          'QNNs',
          'Quantum neural networks',
          'VQC',
          'Variational quantum classifier',
          'Barren plateaus',
        ],
        body: [
          'A quantum neural network is a trainable circuit-based model whose outputs are measured expectations or probabilities. A variational quantum classifier combines data encoding, a parameterized ansatz, measurement, and a loss on labeled examples.',
          'A classical loop updates the trainable angles. Parameter-shift rules can estimate suitable gradients, but each update may require many circuit evaluations. Barren plateaus, noise, overfitting, and data-loading costs can limit performance. Training loss alone does not establish useful generalization.',
        ],
        math: {
          formula: 'fθ(x) = ⟨φ(x)|U†(θ)ZU(θ)|φ(x)⟩;  pθ(y=1|x) = [1−fθ(x)]/2',
          explanation:
            'This declares a binary-output convention: measuring 1 corresponds to Z eigenvalue −1.',
        },
        example:
          'If the model estimates ⟨Z⟩ = 0.6, then the probability assigned to class 1 is 0.2. A classical loss compares that probability with the training label.',
        practice: {
          prompt:
            'Which parameters should an optimizer update: a held-out example’s input features x, or the model angles θ?',
          answer:
            'The model angles θ. Input features are supplied by the dataset; held-out data should not drive fitting or model selection.',
        },
        question: 'Which result is needed to assess classifier generalization?',
        answers: [
          'Only the lowest training loss',
          'Only the number of qubits',
          'Performance on held-out data',
        ],
        correct: 2,
        why: 'A model may fit training examples without learning patterns that transfer to new data.',
      },
      {
        id: 'qlstm',
        title: 'QLSTM: a hybrid recurrent model',
        time: 12,
        level: 'Introduction',
        topics: [
          'QLSTM',
          'Quantum long short-term memory',
          'Time series',
          'Hybrid recurrent networks',
        ],
        body: [
          'An LSTM uses input, forget, output, and candidate updates to maintain a classical memory across time. A hybrid QLSTM can replace some learned gate functions with parameterized quantum circuits whose measured outputs feed classical nonlinearities.',
          'There is no single universal QLSTM design. Specify encoding, number of qubits, circuit sharing, output scaling, and whether memory is classical. For time series, split chronologically and prevent future information from entering preprocessing or input windows. Quantum gates in a circuit differ from the named LSTM gate functions.',
        ],
        math: {
          formula: 'cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ gₜ;  hₜ = oₜ ⊙ tanh(cₜ)',
          explanation:
            'Measured circuit outputs can help form fₜ, iₜ, gₜ, and oₜ after classical transforms. ⊙ means elementwise multiplication.',
        },
        example:
          'A small hybrid cell encodes the current observation and prior hidden state into angles, measures a few expectations, and uses classical affine maps and sigmoid/tanh functions to produce the recurrent updates.',
        practice: {
          prompt: 'Why can a random train/test split be misleading when forecasting a time series?',
          answer:
            'It may place overlapping windows or future observations in training. Use a chronological split and fit preprocessing only on the training period.',
        },
        question:
          'In the hybrid QLSTM described here, where is the recurrent cell state cₜ stored?',
        answers: [
          'Classically, between measured circuit evaluations',
          'Necessarily in a fault-tolerant quantum memory',
          'In an oracle containing future labels',
        ],
        correct: 0,
        why: 'This design uses quantum circuits as trainable functions inside a classical recurrent update.',
      },
      {
        id: 'qcnn-1d',
        title: 'QCNN-1D: local circuits and pooling',
        time: 12,
        level: 'Introduction',
        topics: ['QCNN-1D', 'Quantum convolutional neural network', 'Pooling', 'Parameter sharing'],
        body: [
          'A one-dimensional QCNN arranges qubits along a line. Repeated local parameterized blocks combine neighboring information, and pooling reduces the active register until a small readout remains.',
          'Pooling may use measurement with conditional operations or a specified unitary-and-discard construction. It is not automatically the same as classical max pooling. For classical sequences, define the encoder and compare with a classical 1D CNN; for quantum-state classification, the input can already be a quantum state.',
        ],
        math: {
          formula: 'n → n/2 → n/4 → … active qubits  (one possible pooling schedule)',
          explanation:
            'The schedule, neighborhood blocks, sharing rules, and treatment of discarded qubits define the architecture.',
        },
        example:
          'An eight-qubit line can apply shared two-qubit blocks on neighboring pairs, pool to four active qubits, repeat to two, and finally measure one output qubit.',
        practice: {
          prompt:
            'What must be declared before comparing a QCNN-1D with a classical sequence model?',
          answer:
            'Input representation and encoding cost, neighborhood and pooling rules, parameter budget, train/test protocol, sampling budget, and a comparable classical baseline.',
        },
        question: 'What is the purpose of pooling in the described QCNN?',
        answers: [
          'To reveal all amplitudes at once',
          'To reduce active degrees of freedom while retaining useful information',
          'To make data encoding free',
        ],
        correct: 1,
        why: 'Pooling compresses the representation according to a designed quantum channel or conditional process.',
      },
      {
        id: 'qcnn-2d',
        title: 'QCNN-2D: image neighborhoods and hardware',
        time: 12,
        level: 'Introduction',
        topics: ['QCNN-2D', 'Quantum convolution', 'Image classification', 'Hardware connectivity'],
        body: [
          'A two-dimensional design uses grid neighborhoods, for example local blocks on 2×2 patches followed by pooling. It can act directly on an encoded quantum grid or as a hybrid patch circuit that returns classical features to an image model.',
          'These variants have different resource costs. A full image may need many qubits or expensive amplitude preparation; patch models reuse a small circuit many times. Hardware connectivity can add SWAP gates. Declare which version you use and compare with a classical 2D CNN or patch model.',
        ],
        math: {
          formula: '4×4 active grid → 2×2 grid → 1 output  (illustrative pooling)',
          explanation:
            'For a patch hybrid, total circuit evaluations also scale with the number of patches, images, shots, and training updates.',
        },
        example:
          'A 2×2 patch circuit can encode four pixel values with four RY angles, apply entangling layers, and return Z expectations as classical image features. This hybrid differs from a 16-qubit full-grid QCNN.',
        practice: {
          prompt:
            'A patch model uses 100 patches per image and 1,000 shots per patch. How many shots are needed per image for one circuit evaluation of every patch?',
          answer:
            '100,000 shots, before repeated observables, gradients, epochs, or validation. Reusing four qubits does not eliminate repeated execution cost.',
        },
        question: 'Why should a full-grid QCNN and a patch hybrid be reported separately?',
        answers: [
          'Because only one can use angles',
          'Because images cannot be encoded',
          'Their input representations and resource costs differ',
        ],
        correct: 2,
        why: 'Qubit count alone misses repeated patch execution, preparation, measurements, and classical processing.',
      },
    ],
  },
];
