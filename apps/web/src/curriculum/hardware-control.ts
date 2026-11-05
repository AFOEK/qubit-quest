import type { Course } from './types';

export const hardwareControl: Course[] = [
  {
    id: 'hardware-1',
    title: 'Hardware I',
    track: 'fundamentals',
    icon: '∿',
    color: 'blue',
    description:
      'Connect two-level energy splittings to microwave resonance, rotating-frame drives, and shaped pulse envelopes. Examples use an explicitly simplified superconducting-qubit model.',
    prerequisites: ['software-compilation', 'noise-qec'],
    outcomes: [
      'Distinguish carrier frequency, detuning, and Rabi rate with consistent units.',
      'Relate resonant control Hamiltonians to RX/RY rotations.',
      'Compare square, Gaussian, Gaussian-square, and DRAG pulse ideas.',
    ],
    lessons: [
      {
        id: 'microwave-resonance',
        title: 'Microwave resonance: match an energy transition',
        time: 10,
        level: 'Introduction',
        topics: [
          'Microwave drives and resonance',
          'Microwave resonance',
          'Transition frequency',
          'Detuning',
        ],
        body: [
          'A driven two-level system responds near the frequency corresponding to its energy splitting. In many superconducting devices that transition lies in the microwave band. A classical control signal couples the levels, with its frequency, amplitude, phase, and duration affecting the response.',
          'Distinguish ordinary frequency f in hertz from angular frequency ω in radians per second. Carrier frequency selects a transition; it is not the Rabi rate determining how quickly population oscillates under a calibrated drive. Real devices have additional levels and couplings beyond this simple model.',
        ],
        math: {
          formula: 'E₁−E₀ = ħωq = h fq;  ω = 2πf;  Δ = ωd−ωq',
          explanation:
            'q labels the qubit transition, d the drive, and Δ is the signed angular-frequency detuning in the convention used here.',
        },
        example:
          'A drive at 5.001 GHz applied near a 5.000 GHz transition has detuning +1 MHz in ordinary frequency, or Δ = 2π×10⁶ rad/s.',
        practice: {
          prompt: 'If a transition frequency is 5 GHz, is its angular frequency 5×10⁹ rad/s?',
          answer:
            'No. It is 2π×5×10⁹ rad/s. Mixing these conventions creates a factor-of-2π error in time-evolution calculations.',
        },
        question:
          'Which quantity describes the mismatch between the drive and transition frequencies?',
        answers: ['The Schmidt rank', 'The detuning', 'The shot count'],
        correct: 1,
        why: 'Detuning measures the frequency mismatch; the carrier and Rabi rate have different roles.',
      },
      {
        id: 'rotating-frame-drives',
        title: 'Microwave drives: rotations in a rotating frame',
        time: 12,
        level: 'Core',
        topics: [
          'Microwave drives',
          'Rotating frame',
          'Rotating-wave approximation',
          'Quadrature control',
        ],
        body: [
          'A rotating frame removes a rapidly oscillating reference motion so the driven dynamics can be expressed with slower detuning and envelope terms. A rotating-wave approximation drops suitably fast terms when its scale-separation assumptions are valid.',
          'Calibrated quadratures set an effective X/Y drive axis. On resonance with a fixed X-axis drive, the time-integrated Rabi rate sets the RX angle. Off resonance the rotation axis tilts, so simply doubling pulse area does not repair a frequency error. Signs of phase and detuning must match the chosen frame convention.',
        ],
        math: {
          formula: 'Hrot/ħ = (ΔZ + Ωx(t)X + Ωy(t)Y)/2;  Δ = Ωy = 0 ⇒ θ = ∫ Ωx(t)dt',
          explanation:
            'This defines the effective-model convention. Ωx, Ωy, and Δ are angular frequencies; conversion from laboratory I/Q voltages requires calibration.',
        },
        example:
          'For a resonant constant X drive with Ωx/(2π) = 25 MHz lasting 20 ns, θ = 2π×25×10⁶×20×10⁻⁹ = π, an ideal RX(π) up to the stated frame convention.',
        practice: {
          prompt: 'At the same ideal Rabi rate, what duration gives RX(π/2)?',
          answer:
            '10 ns. This uses an ideal constant resonant effective drive; actual hardware also imposes timing granularity, rise/fall shapes, and calibration constraints.',
        },
        question: 'When is pulse area alone sufficient to determine this model’s RX angle?',
        answers: [
          'For a resonant drive along a fixed X axis',
          'For every detuned multilevel device',
          'Only after measuring the qubit continuously',
        ],
        correct: 0,
        why: 'With no detuning and a fixed axis, the Hamiltonians commute at different times and the integrated angular rate sets the rotation.',
      },
      {
        id: 'pulse-envelopes',
        title: 'Pulse envelopes: shapes, bandwidth, and leakage',
        time: 12,
        level: 'Core',
        topics: [
          'Pulse envelopes',
          'Pulse shapes',
          'Gaussian pulses',
          'Gaussian-square pulses',
          'DRAG',
        ],
        body: [
          'An envelope specifies how a control amplitude changes over time. Square pulses are simple but have sharp edges; Gaussian and Gaussian-square shapes trade duration, bandwidth, and implementation constraints differently. A chosen shape must be sampled on the controller’s timing grid.',
          'For weakly anharmonic devices, DRAG adds a derivative-related quadrature intended to reduce selected leakage and phase errors. Its sign and scale depend on the model and calibration. Equal ideal pulse area does not guarantee equal real-device fidelity, especially with noncommuting quadratures or higher levels.',
        ],
        math: {
          formula: 'Ωx(t) = A exp[−(t−T/2)²/(2σ²)];  Ωy(t) = β dΩx(t)/dt;  T = Nsamples·dt',
          explanation:
            'This is an illustrative Gaussian/DRAG model. β has time units here; waveform amplitude units and hardware conventions must be declared.',
        },
        example:
          'For a timing grid dt = 0.2 ns, a 100-sample envelope lasts 20 ns. Changing sample count changes duration even when the peak amplitude stays fixed.',
        practice: {
          prompt:
            'An ideal resonant square drive has Ωx/(2π) = 10 MHz and duration 25 ns. What rotation angle results?',
          answer:
            'θ = 2π×10⁷×25×10⁻⁹ = π/2. A shaped pulse requires integrating its envelope and checking the same ideal-model assumptions.',
        },
        question: 'Why is the peak amplitude alone insufficient to specify a pulse’s effect?',
        answers: [
          'Pulse duration and shape never matter',
          'Every waveform is a measurement',
          'The full time dependence and system response matter',
        ],
        correct: 2,
        why: 'Rotation area, spectral content, leakage, timing, and device calibration depend on more than the envelope maximum.',
        followUp: ['openpulse-control', 'rabi-experiments'],
      },
    ],
  },
  {
    id: 'hardware-2',
    title: 'Hardware II',
    track: 'fundamentals',
    icon: '⌁',
    color: 'blue',
    description:
      'Develop the OpenPulse introduction into ports, frames, timed instructions, and defcal bindings. Read provider-dependent control descriptions without assuming an available pulse backend.',
    prerequisites: ['hardware-1'],
    outcomes: [
      'Distinguish physical ports, stateful frames, and waveforms.',
      'Track instruction timing and acquisition separately from gate semantics.',
      'Explain calibration selection and compile-time duration requirements.',
    ],
    lessons: [
      {
        id: 'openpulse-control',
        title: 'OpenPulse: a target-dependent control description',
        time: 10,
        level: 'Core',
        topics: ['OpenPulse', 'OpenPulse grammar', 'Control stack', 'Pulse scheduling'],
        body: [
          'Revisit OpenPulse after the microwave model. A waveform supplies an envelope, a frame supplies timing and carrier bookkeeping, and a port connects these controls to resources exposed by the device. The controller and physical response complete the interpretation.',
          'The textual OpenPulse grammar is selected inside the OpenQASM calibration model and continues to evolve. Provider-defined resources and extern functions are essential. This language-level study is separate from the removed qiskit.pulse SDK and from whether a service permits user-defined pulses.',
        ],
        math: {
          formula: 'Envelope + frame state + port mapping + device response → driven evolution',
          explanation:
            'A waveform array by itself does not specify frequency, phase, scheduling, transfer functions, or the Hamiltonian it produces.',
        },
        example:
          'The same sampled envelope played on two frames with different carrier frequencies produces different laboratory signals, even though its stored complex samples are identical.',
        practice: {
          prompt:
            'What extra information is needed to interpret an envelope as a physical qubit rotation?',
          answer:
            'The frame frequency/phase and timing, port-to-device mapping, amplitude units and transfer response, and the qubit/control Hamiltonian with calibration parameters.',
        },
        question: 'Which statement correctly describes OpenPulse support?',
        answers: [
          'A compatible grammar implementation and target resources are needed',
          'Installing current Qiskit guarantees pulse access',
          'Every waveform automatically means RX(π)',
        ],
        correct: 0,
        why: 'The control language describes a model whose compilation and execution depend on the chosen implementation and hardware capabilities.',
      },
      {
        id: 'ports-frames',
        title: 'Ports and frames: resources, clocks, and phase',
        time: 11,
        level: 'Core',
        topics: ['Ports and frames', 'Ports', 'Frames', 'Carrier phase', 'Virtual Z'],
        body: [
          'A port is an abstraction for a vendor-exposed input/output resource. It need not correspond one-to-one with a qubit. A frame attaches to a port and tracks a carrier frequency, phase, and program time; multiple frames can share a port subject to device limits.',
          'Frame phase shifts can implement a virtual-Z convention by changing the phase reference of later pulses. The sign connecting a frame update to a logical RZ depends on the defined control convention. Sharing a port also creates resource constraints that the compiler and scheduler must respect.',
        ],
        math: {
          formula: 's(t) = Re[w(t) exp(i(2πft+φ))]',
          explanation:
            'w(t) is a complex envelope, f is the frame carrier frequency in Hz, and φ is its phase reference. The real signal here is an illustrative laboratory convention.',
        },
        example:
          'A frame declared conceptually as newframe(drive0, 5e9, 0.0) associates the drive0 resource with a 5 GHz carrier and zero initial phase. It does not itself play a pulse.',
        practice: {
          prompt:
            'If two frames refer to the same port, does that prove their pulses can run independently at the same time?',
          answer:
            'No. The vendor’s resource mapping and controller limits determine concurrency. Frames are stateful abstractions, not automatically independent physical signal generators.',
        },
        question: 'What does a frame track beyond its associated port?',
        answers: [
          'The full unknown quantum state',
          'Frequency, phase, and time bookkeeping',
          'The number of classical SVM support vectors',
        ],
        correct: 1,
        why: 'The frame supplies the timing and carrier reference used to interpret waveform playback and capture.',
      },
      {
        id: 'pulse-instructions',
        title: 'Instructions: play, capture, delay, and synchronize',
        time: 11,
        level: 'Core',
        topics: ['Instructions', 'OpenPulse instructions', 'Play', 'Capture', 'Delay', 'Barrier'],
        body: [
          'Pulse-level instructions describe actions on frames and resources. Playback emits an envelope; capture acquires data through a target-defined measurement operation. Delays advance timing, while synchronization constraints coordinate participating resources. Frequency and phase updates change the frame reference.',
          'Readout data can be raw or processed depending on the declared capture function and return type. A pulse-level description must handle resource conflicts and duration granularity. A timing barrier coordinates execution; it does not itself entangle qubits or remove physical noise.',
        ],
        math: {
          formula: 'Sequential frame timeline: 20 ns play + 40 ns delay + 20 ns play = 80 ns',
          explanation:
            'This example assumes these operations advance the same frame sequentially and excludes any additional synchronization or target-specific acquisition latency.',
        },
        example:
          'An instantaneous phase update between the two plays changes the axis of the second pulse without adding duration in the grammar’s ideal frame-update model. A target must support that model or reject the program.',
        practice: {
          prompt: 'Why is capture different from simply playing a readout envelope?',
          answer:
            'Playback supplies a stimulus, while capture obtains and processes a response using the target’s acquisition resources and declared measurement function. Both roles must be accounted for.',
        },
        question: 'Which pulse-level action obtains measurement response data?',
        answers: [
          'A pure phase shift',
          'An unused waveform declaration',
          'A target-defined capture operation',
        ],
        correct: 2,
        why: 'Capture describes acquisition; the waveform and frame declarations alone do not produce measurement records.',
      },
      {
        id: 'defcal',
        title: 'Defcal: bind an instruction to a calibration',
        time: 12,
        level: 'Core',
        topics: [
          'Defcal',
          'Define calibration',
          'Calibration definitions',
          'Physical qubit binding',
        ],
        body: [
          'An OpenQASM defcal associates a named gate or measurement with an implementation in the selected calibration grammar. It can specialize physical qubits and parameter values. Unlike a gate decomposition, it binds to target-specific control operations.',
          'The compiler selects an applicable calibration, favoring more specific matches under the language’s lookup rules. Defining the binding does not discover correct device parameters: those come from characterization and calibration. Defcal bodies must have a definite duration resolvable at compile time under the specification’s restrictions.',
        ],
        math: {
          label: 'Read a calibration signature',
          formula:
            'defcalgrammar "openpulse";\ndefcal rx(pi / 2) $0 { /* target-specific control body */ }',
          explanation:
            'This is an illustrative signature, not a working pulse implementation. $0 binds physical qubit zero; the body needs the provider’s ports, frames, waveforms, and a valid duration.',
        },
        example:
          'A specialized RX(π/2) calibration for physical qubit zero can override a more general RX parameterization. The same gate on qubit one can select a different definition.',
        practice: {
          prompt: 'If a defcal branches on a parameter, why must branch timing be constrained?',
          answer:
            'The compiler needs a definite duration to schedule enclosing operations and resolve duration queries. The specified branches must satisfy the language’s compile-time duration requirements.',
        },
        question: 'Does writing a defcal automatically calibrate the physical gate?',
        answers: [
          'No, it binds an implementation using parameters that must be established separately',
          'Yes, the compiler measures the hardware by definition',
          'Only if the function name is rx',
        ],
        correct: 0,
        why: 'A calibration definition connects instructions to controls; hardware characterization determines whether those controls realize the desired operation.',
        followUp: ['hardware-calibration'],
      },
    ],
  },
];
