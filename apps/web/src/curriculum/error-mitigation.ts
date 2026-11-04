import type { Course } from './types';

export const errorMitigation: Course[] = [
  {
    id: 'error-mitigation',
    title: 'Error Mitigation',
    track: 'fundamentals',
    icon: '≈',
    color: 'blue',
    description:
      'Build on noise channels and QEC to distinguish noise suppression, noise tailoring, and statistical mitigation. Learn dynamical decoupling, Pauli twirling, twirled readout, ZNE, and PEC with their calibration and sampling costs.',
    prerequisites: ['noise-qec'],
    outcomes: [
      'Explain which error sources each method targets and how it differs from QEC.',
      'Calculate simple twirled-readout and zero-noise estimates.',
      'Interpret quasiprobability weights and the sampling overhead of PEC.',
    ],
    lessons: [
      {
        id: 'dynamical-decoupling',
        title: 'Dynamical decoupling: refocus idle evolution',
        time: 10,
        level: 'Core',
        topics: ['Dynamical decoupling', 'Spin echo', 'Noise suppression', 'Idle errors'],
        body: [
          'Dynamical decoupling inserts carefully timed control pulses during idle periods to suppress certain unwanted couplings. A spin-echo sequence can reverse a quasistatic Z phase accumulated before an X pulse by accumulating the opposite effective phase afterward.',
          'This is noise suppression, rather than a statistical correction to measured results or an encoded QEC scheme. Pulse timing, hardware scheduling, and the noise spectrum matter. Extra imperfect pulses can hurt, and this simple echo does not reverse irreversible amplitude damping. The current ideal gate lab has no idle-time noise model.',
        ],
        math: {
          formula: 'X RZ(φ) X RZ(φ) = I',
          explanation:
            'Read matrix products from right to left: idle phase RZ(φ), X, the same idle phase, then X. The ideal instantaneous pulses cancel a fixed Z drift because XZX = −Z.',
        },
        example:
          'An idle qubit acquires an unknown but constant phase rate. Two equal idle intervals separated by an ideal X, with a final X restoring the logical frame, cancel the net phase evolution.',
        practice: {
          prompt:
            'Would the same echo guarantee cancellation if the drift changes unpredictably between the two intervals?',
          answer:
            'No. Perfect cancellation uses matched phase accumulation and ideal pulses. Time-varying noise, pulse errors, and relaxation require a more realistic model and a measured comparison.',
        },
        question: 'Which error mechanism does the simple echo example target?',
        answers: [
          'Copying unknown states',
          'Quasistatic Z dephasing during idles',
          'Every possible relaxation event',
        ],
        correct: 1,
        why: 'Conjugation by X reverses the sign of a Z drift, allowing matched intervals to cancel in the ideal model.',
      },
      {
        id: 'pauli-twirling',
        title: 'Pauli twirling: tailor the effective noise',
        time: 11,
        level: 'Core',
        topics: ['Pauli twirling', 'Randomized compiling', 'Noise tailoring', 'Pauli channels'],
        body: [
          'Pauli twirling averages a channel over randomized Pauli conjugations. In its ideal mathematical form, it converts a single-qubit noise channel into a Pauli channel, which can make coherent errors easier to model and mitigate.',
          'To dress a gate while preserving the desired computation, the random operations must be compiled with matching corrections. Clifford gates map Paulis to Paulis; arbitrary gates need more care. Twirling changes the effective error structure and does not by itself remove errors or guarantee lower average infidelity.',
        ],
        math: {
          formula: 'Etwirl(ρ) = ¼ ΣP∈{I,X,Y,Z} P† E(PρP†) P',
          explanation:
            'For a coherent RZ(ε) error this average becomes cos²(ε/2)ρ + sin²(ε/2)ZρZ, a stochastic Z-error channel.',
        },
        example:
          'A small coherent phase rotation can build up systematically when repeated. Randomizing its effective sign across circuit instances changes how the errors combine, while matching corrections preserve the intended ideal circuit.',
        practice: {
          prompt:
            'If a Clifford U is dressed with input Pauli Pin, what output correction preserves U?',
          answer:
            'Choose Pout = U Pin† U†, so Pout U Pin = U, up to irrelevant global phase. For a Clifford, this correction is again a Pauli.',
        },
        question: 'What does Pauli twirling primarily change?',
        answers: [
          'The effective structure of the noise',
          'Every noisy result into an exact result',
          'The number of logical qubits encoded by a code',
        ],
        correct: 0,
        why: 'The randomized average tailors the channel toward a Pauli-noise description; it is not itself an inverse-noise operation.',
        followUp: ['twirled-readout', 'pec'],
      },
      {
        id: 'twirled-readout',
        title: 'Readout error mitigation with twirled measurements',
        time: 12,
        level: 'Application',
        topics: [
          'Readout error mitigation',
          'Twirled readout',
          'Twirled Readout Error eXtinction',
          'TREX',
          'Assignment matrices',
        ],
        body: [
          'Readout errors can flip the recorded classical bit after the quantum state is prepared. Calibrating known basis preparations estimates an assignment model linking true probabilities to observed ones. Inverting a well-conditioned model can reduce readout bias, while amplifying sampling and calibration uncertainty.',
          'Twirled-readout methods randomize X operations before measurement and relabel the recorded bits to preserve the ideal outcome. Averaging symmetrizes the effective readout; TREX-style methods calibrate how selected Pauli expectations are scaled. This does not correct arbitrary state-preparation or gate errors, and the calibration must match the experiment.',
        ],
        math: {
          formula: 'pobs = A ptrue;  symmetric one-qubit readout: ⟨Z⟩obs = (1−2ε)⟨Z⟩true',
          explanation:
            'A has measured outcomes as rows and prepared true outcomes as columns. For ideal X randomization, asymmetric flip rates ε₀ and ε₁ average to ε = (ε₀+ε₁)/2.',
        },
        example:
          'With symmetric readout error ε = 0.1 and true probabilities (0.75,0.25), observed probabilities are (0.70,0.30). The observed Z expectation 0.4 is corrected to 0.4/0.8 = 0.5.',
        practice: {
          prompt:
            'After ideal twirling, ε₀ = 0.1 and ε₁ = 0.3 average to what ε? If ⟨Z⟩obs = 0.3, estimate ⟨Z⟩true.',
          answer:
            'ε = 0.2, giving scale 1−2ε = 0.6. The corrected expectation is 0.3/0.6 = 0.5 under this calibrated model.',
        },
        question: 'Why can readout mitigation increase statistical uncertainty?',
        answers: [
          'It clones measured states',
          'It makes all calibration errors vanish',
          'Model inversion or rescaling can magnify fluctuations',
        ],
        correct: 2,
        why: 'Removing a calibrated bias can require dividing by a small response factor, which also enlarges sampling and calibration errors.',
      },
      {
        id: 'zne',
        title: 'ZNE: extrapolate toward zero noise',
        time: 12,
        level: 'Application',
        topics: ['Zero-noise extrapolation', 'ZNE', 'Noise scaling', 'Gate folding'],
        body: [
          'Zero-noise extrapolation measures an observable at several deliberately increased noise levels, then extrapolates an assumed response model to zero noise. Gate folding can increase physical gate executions while preserving the ideal unitary, for example replacing U with U U† U.',
          'Mitigation estimates an observable; it does not create an encoded logical qubit or guarantee an error-free state. Its reliability depends on the noise-scaling procedure, the extrapolation model, and statistical precision. More noise levels or a higher-degree fit do not automatically improve the answer.',
        ],
        math: {
          formula: 'E(s) ≈ E₀ + bs;  Ê₀ = [3E(1) − E(3)]/2',
          explanation:
            's is a declared noise scale. This two-point linear intercept is justified only when the effective response is approximately linear over the measured range.',
        },
        example:
          'If E(1) = 0.80 and E(3) = 0.68, the linear zero-noise estimate is (2.40−0.68)/2 = 0.86. It is an inferred value, not a direct noiseless measurement.',
        practice: {
          prompt:
            'Assuming independent estimates with variances v₁ and v₃, find the variance of this linear intercept.',
          answer:
            'Var(Ê₀) = (9/4)v₁ + (1/4)v₃. The coefficients can amplify measurement uncertainty even when the bias is reduced.',
        },
        question: 'What must be justified before trusting a ZNE intercept?',
        answers: [
          'The noise-scaling behavior and extrapolation model',
          'That more noise is always beneficial',
          'That finite-shot uncertainty is zero',
        ],
        correct: 0,
        why: 'An extrapolated intercept only estimates the desired zero-noise value when the scaled experiments and response model support that inference.',
      },
      {
        id: 'pec',
        title: 'PEC: cancel a calibrated noise model statistically',
        time: 12,
        level: 'Application',
        topics: [
          'Probabilistic error cancellation',
          'PEC',
          'Quasiprobabilities',
          'Sampling overhead',
        ],
        body: [
          'Probabilistic error cancellation expresses an ideal observable estimate as a signed combination of experimentally available noisy circuits. Sample circuit variants using probabilities proportional to the absolute coefficients, then attach signed weights to the measurement results.',
          'Negative coefficients mean this is statistical inference, not a deterministic physical inverse channel. With an exact implementable model, the estimator can be unbiased; inaccurate or drifting calibration introduces residual bias. The absolute coefficient sum controls sampling overhead and can grow rapidly with circuit size.',
        ],
        math: {
          formula:
            'Eideal = Σₖ ηₖ Enoisy,k;  γ = Σₖ |ηₖ|;  sample k with |ηₖ|/γ and weight γ sign(ηₖ)',
          explanation:
            'For bounded outcomes, the enlarged weights can lead to an overhead scaling like γ² at fixed precision. Coefficient sums compound across mitigated operations.',
        },
        example:
          'For a known bit-flip channel with p = 0.1, its formal inverse is 1.125 times the identity channel minus 0.125 times an X conjugation. Thus γ = 1.25, sample probabilities are 0.9 and 0.1, and measurement weights are +1.25 and −1.25.',
        practice: {
          prompt:
            'For that toy inverse, calculate the indicative γ² sampling factor. Is the negative coefficient itself a physical probability?',
          answer:
            'γ² = 1.5625 for this one-channel example. The negative coefficient is a signed estimator weight; actual circuit-selection probabilities remain nonnegative.',
        },
        question: 'What is essential to interpreting a PEC estimate?',
        answers: [
          'Every coefficient being positive',
          'A suitable calibrated noise model and its sampling overhead',
          'An assumption that gates contain no noise',
        ],
        correct: 1,
        why: 'The cancellation coefficients come from a model, and signed reweighting trades reduced modeled bias for increased sampling cost.',
      },
    ],
  },
];
