import type { Course } from './types';

export const software: Course[] = [
  {
    id: 'software-compilation',
    title: 'Software and Compilation',
    track: 'fundamentals',
    icon: '⌘',
    color: 'blue',
    description:
      'Connect gate circuits to portable program descriptions, target-aware transpilation, OpenQASM 3 control flow, and the introductory role of pulse-level calibration.',
    prerequisites: ['gates-2'],
    outcomes: [
      'Read a small OpenQASM 2 circuit and distinguish source formats from device support.',
      'Explain decomposition, layout, routing, optimization, and scheduling.',
      'Compare OpenQASM 3 programs with target-specific OpenPulse calibrations.',
    ],
    lessons: [
      {
        id: 'openqasm',
        title: 'OpenQASM: a language for circuit exchange',
        time: 9,
        level: 'Introduction',
        topics: ['OpenQASM', 'OpenQASM 2', 'Quantum assembly', 'Circuit interchange'],
        body: [
          'OpenQASM is a family of languages for describing quantum programs. OpenQASM 2 represents circuits with quantum and classical registers, gates, measurement, and limited classical conditions. A readable circuit description is useful for exchanging and inspecting experiments.',
          'Language syntax is separate from execution support. An importer may accept only part of a standard, and a valid circuit still needs compilation for its target. This example prepares the same Bell pair as the existing lab; it does not add a source-code execution service.',
        ],
        math: {
          label: 'Read the program',
          formula:
            'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\ncreg c[2];\nh q[0];\ncx q[0], q[1];\nmeasure q -> c;',
          explanation:
            'q and c are two-element quantum/classical registers. H on q[0] followed by CX prepares a Bell pair; measurement records each qubit in its corresponding classical bit.',
        },
        example:
          'The ideal measurement distribution has 00 and 11 with probability 1/2 each. In Qiskit-style bitstrings, c[0] is the rightmost displayed bit.',
        practice: {
          prompt:
            'Which two source lines create entanglement, and which line produces classical records?',
          answer:
            'h q[0]; and cx q[0], q[1]; prepare entanglement from |00⟩. measure q -> c; records the measurement outcomes.',
        },
        question:
          'Does a valid OpenQASM file guarantee that any quantum device can execute it directly?',
        answers: [
          'Yes, syntax determines all device capabilities',
          'No, importer and target capabilities still matter',
          'Only when it contains two qubits',
        ],
        correct: 1,
        why: 'Program validity, supported language features, and device compilation/execution are separate requirements.',
        lab: { kind: 'algorithm', name: 'bell' },
        followUp: ['transpilation'],
      },
      {
        id: 'transpilation',
        title: 'Transpilation: make a circuit fit its target',
        time: 11,
        level: 'Core',
        topics: ['Transpilation', 'Basis gates', 'Layout', 'Routing', 'Scheduling'],
        body: [
          'A transpiler rewrites a program for a target’s supported instructions, qubit connectivity, timing, and other constraints. Typical stages include gate decomposition, logical-to-physical layout, routing, optimization, and scheduling when requested and supported.',
          'Track the final qubit layout and classical-bit mapping when checking results. Fewer gates alone need not mean a better physical implementation: two-qubit error rates, depth, durations, and idle time also matter. For dynamic programs, validation must respect measurements and branches rather than compare only a final unitary.',
        ],
        math: {
          formula:
            'Logical circuit + target constraints → compiled circuit + layout/timing metadata',
          explanation:
            'For an ideal unitary circuit, compare the implemented transformation up to allowed layout changes and global phase; preserve the meaning of classical outputs as well.',
        },
        example:
          'On a bidirectional line 0–1–2, logical CX(0,2) needs routing or another supported decomposition. Swapping the state at 2 onto 1 permits a neighboring CX, but changes the physical location of the logical qubit.',
        practice: {
          prompt: 'Why might omitting a final SWAP still produce a valid compiled circuit?',
          answer:
            'The compiler may keep the changed final layout and account for it in later operations and readout. Comparing raw physical wire positions without the layout can misinterpret a correct result.',
        },
        question: 'Which information is essential when interpreting a routed circuit?',
        answers: [
          'The final logical-to-physical mapping',
          'Only the original number of H gates',
          'The browser’s color theme',
        ],
        correct: 0,
        why: 'Routing can move logical states between physical qubits. The output mapping carries that information forward.',
      },
      {
        id: 'openqasm-3',
        title: 'OpenQASM 3.0: classical control and timing',
        time: 11,
        level: 'Core',
        topics: [
          'OpenQASM 3.0',
          'OpenQASM3.0',
          'OpenQASM 3',
          'Dynamic circuits',
          'Classical control flow',
        ],
        body: [
          'OpenQASM 3 extends the programming model with richer classical types and expressions, control flow, subroutines, and timing features. A program can use a measured bit to choose a later quantum operation when the compiler and execution target support that feature.',
          'OpenQASM 3 is a language specification, not a promise that every backend supports every construct. Import/export coverage and real-time feed-forward capabilities must be checked independently. Calibration hooks connect to pulse descriptions; Hardware II develops those details.',
        ],
        math: {
          label: 'Read the program',
          formula:
            'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit q;\nbit b;\nh q;\nb = measure q;\nif (b == 1) { x q; }',
          explanation:
            'Measurement supplies a classical condition. In an ideal supported execution, this feedback leaves q in |0⟩ while b still records the original random outcome.',
        },
        example:
          'If the measurement returns 0, the program leaves |0⟩ alone. If it returns 1, X maps |1⟩ to |0⟩. This behavior combines measurement and conditional correction, not a single reversible unitary.',
        practice: {
          prompt: 'After the ideal program finishes, is b always 0 because q is reset to |0⟩?',
          answer:
            'No. b remains the recorded measurement bit and is 0 or 1 with equal probability. The conditional X changes q, not the stored bit.',
        },
        question: 'What additional capability does measurement-conditioned execution require?',
        answers: [
          'Copying the unknown input state',
          'Real-time measurement and feed-forward support',
          'All gates commuting',
        ],
        correct: 1,
        why: 'The controller must obtain a classical measurement result and use it to choose the subsequent operation.',
        followUp: ['defcal'],
      },
      {
        id: 'openpulse-intro',
        title: 'OpenPulse: where circuit instructions meet controls',
        time: 9,
        level: 'Introduction',
        topics: ['OpenPulse', 'Pulse-level programming', 'Calibration grammar'],
        body: [
          'A logical RX names an intended state transformation; its physical realization needs controls tailored to a device. The textual OpenPulse calibration grammar describes concepts such as ports, frames, waveforms, playback, and capture within the OpenQASM calibration model. It is distinct from the earlier OpenPulse JSON wire format.',
          'This is the introductory view; Hardware I–II supply the physics and detailed programming model. The OpenPulse grammar is evolving and target-dependent. Qiskit Pulse was removed in Qiskit 2.0, so these language concepts do not imply that the current Qiskit API or IBM services expose pulse execution.',
        ],
        math: {
          formula:
            'Circuit instruction → selected calibration → timed control waveform → physical evolution',
          explanation:
            'Each arrow depends on the target, its supported calibration grammar, and the device’s calibrated response.',
        },
        example:
          'Two physical qubits may need different drive frequencies and amplitudes for the same logical RX(π/2). A calibration associates the desired gate with the appropriate device-specific controls.',
        practice: {
          prompt:
            'Does learning OpenPulse syntax make an old qiskit.pulse tutorial runnable in a Qiskit 2 installation?',
          answer:
            'No. OpenPulse is a control-description grammar, while qiskit.pulse was an SDK component removed in 2.0. A compatible implementation and target are separate requirements.',
        },
        question:
          'Why can the same logical gate need different pulse calibrations on different qubits?',
        answers: [
          'Their physical frequencies and control responses can differ',
          'A logical gate has no mathematical meaning',
          'OpenQASM forbids physical qubit labels',
        ],
        correct: 0,
        why: 'A gate specifies an intended transformation; calibration accounts for the physical system that implements it.',
        followUp: ['microwave-resonance', 'openpulse-control'],
      },
    ],
  },
];
