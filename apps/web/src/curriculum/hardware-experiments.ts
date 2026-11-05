import type { Course } from './types';

export const hardwareExperiments: Course[] = [
  {
    id: 'hardware-3',
    title: 'Hardware III',
    track: 'fundamentals',
    icon: '⌖',
    color: 'blue',
    description:
      'Design a characterization sequence: establish readout and device parameters, locate transitions with spectroscopy, fit Rabi rotations, and distinguish relaxation from coherence decay.',
    prerequisites: ['hardware-2'],
    outcomes: [
      'Separate fitting, calibration updates, and independent validation.',
      'Interpret spectroscopy and Rabi traces with explicit units.',
      'Distinguish T₁, Ramsey T₂*, echo T₂, and model-dependent dephasing relations.',
    ],
    lessons: [
      {
        id: 'hardware-calibration',
        title: 'Hardware calibration and characterization: close the loop',
        time: 11,
        level: 'Application',
        topics: [
          'Hardware calibration & characterization',
          'Hardware calibration',
          'Characterization',
          'Calibration validation',
        ],
        body: [
          'Characterization estimates properties of a device; calibration adjusts controls to realize a desired operation. A useful loop specifies a model and experiment, collects data, fits parameters with uncertainty, updates controls, and validates on independent checks.',
          'Record device identity, configuration, timestamps, units, model assumptions, and calibration versions. Readout errors can distort every later fit, while drift can invalidate an earlier parameter set. This course supplies guided experimental reasoning; the app does not connect to a pulse controller or perform hardware calibration.',
        ],
        math: {
          formula:
            'observations yⱼ = f(settingⱼ; θ) + noise;  estimate θ → update controls → validate',
          explanation:
            'A good fit describes the measured data; validation tests whether the updated controls produce the intended behavior on suitable checks.',
        },
        example:
          'After fitting a Rabi period, select a candidate π-pulse duration. Then test state preparation and repeated rotations rather than treating the fit’s minimum residual as proof of a high-fidelity gate.',
        practice: {
          prompt: 'Why save the readout calibration together with the fitted drive parameters?',
          answer:
            'The readout model affects inferred populations and fitted parameters. Keeping the configuration and versions makes results reproducible and helps distinguish drift from analysis changes.',
        },
        question: 'What distinguishes calibration from characterization?',
        answers: [
          'Calibration adjusts controls toward a target operation',
          'Characterization always changes the hardware',
          'Calibration requires no measured model',
        ],
        correct: 0,
        why: 'Characterization estimates behavior; calibration uses that information to set and validate controls.',
      },
      {
        id: 'spectroscopy',
        title: 'Spectroscopy: locate and fit a transition',
        time: 11,
        level: 'Application',
        topics: ['Spectroscopy', 'Frequency sweeps', 'Resonance fitting', 'Linewidth'],
        body: [
          'Spectroscopy sweeps a probe frequency and measures a response to locate a transition. Choose probe strength, duration, frequency range, and readout carefully enough to resolve the feature without confusing it with another transition or a readout resonance.',
          'A fitted line center estimates a transition frequency under the experimental conditions. The line can be a peak or dip depending on the measured signal. Power broadening and other effects mean a fitted linewidth cannot automatically be interpreted as an intrinsic coherence time.',
        ],
        math: {
          formula: 'L(f) = B + A/[1+4(f−f₀)²/Γ²]',
          explanation:
            'This illustrative Lorentzian has center f₀ and full width at half of its contrast Γ. A can be positive or negative; other physical models may fit better.',
        },
        example:
          'With f₀ = 5.000 GHz and Γ = 2 MHz, the half-contrast frequencies are 4.999 and 5.001 GHz. The full width spans 2 MHz.',
        practice: {
          prompt: 'If A is negative in the model, does the dip minimum move away from f₀?',
          answer:
            'No. The extremum remains at f₀; negative A reverses the feature’s contrast. Backgrounds, nearby lines, and noise can still affect a real fit.',
        },
        question: 'What does the fitted f₀ represent in this spectroscopy model?',
        answers: [
          'The complete gate error rate',
          'The resonance center under the measured conditions',
          'The Schmidt truncation threshold',
        ],
        correct: 1,
        why: 'The center locates the response feature; it does not by itself characterize gate fidelity or every decoherence mechanism.',
      },
      {
        id: 'rabi-experiments',
        title: 'Rabi experiments: calibrate rotation angles',
        time: 12,
        level: 'Application',
        topics: ['Rabi experiments', 'Rabi oscillations', 'π pulse', 'π/2 pulse'],
        body: [
          'After locating a transition, apply a near-resonant drive and vary duration or amplitude. The measured population oscillates as the drive rotates the state. Fit the oscillation using a declared frequency convention, contrast, offset, and any required damping model.',
          'In the ideal resonant two-level case, half a full population-oscillation period gives a π pulse and a quarter gives π/2. Detuning, finite pulse edges, leakage, and readout errors can shift the practical calibration. Oscillation contrast alone is not a complete gate-fidelity measure.',
        ],
        math: {
          formula: 'P₁(t) = sin²(Ωt/2);  TRabi = 2π/Ω;  tπ = TRabi/2',
          explanation:
            'Ω is the angular Rabi rate. A fitted model for real data may include damping, phase, and readout offsets.',
        },
        example:
          'A fitted ideal Rabi period of 40 ns implies Ω/(2π) = 25 MHz, tπ = 20 ns, and tπ/₂ = 10 ns for a constant resonant drive.',
        practice: {
          prompt:
            'If the population returns to its initial value after 80 ns, what ideal duration gives the first full inversion?',
          answer:
            '40 ns: a full population period contains two π rotations. Check resonance and the pulse model before applying this inference to hardware.',
        },
        question:
          'Which duration gives the first ideal π rotation relative to a full Rabi population period?',
        answers: ['The full period', 'Twice the period', 'Half the period'],
        correct: 2,
        why: 'P₁ reaches one at Ωt = π and returns to zero at Ωt = 2π.',
      },
      {
        id: 'coherence-measurements',
        title: 'Coherence measurements: T₁, Ramsey, and echo',
        time: 13,
        level: 'Application',
        topics: ['Coherence measurements', 'T1 measurements', 'Ramsey', 'T2 star', 'Spin echo'],
        body: [
          'A T₁ experiment prepares an excited population, waits, and measures its relaxation. Ramsey prepares a superposition with a π/2 pulse, waits, and uses a second pulse to turn phase accumulation into oscillating population. Its decay commonly defines T₂* under the chosen fit model.',
          'An echo adds refocusing pulses to suppress some slow phase noise, giving a different coherence measurement. Fit assumptions matter: decays need not be single exponentials, pulses add errors, and thermal equilibrium can produce a nonzero population offset. The usual T₂ relation below assumes a simple Markovian relaxation-plus-pure-dephasing model.',
        ],
        math: {
          formula: 'P₁(t) = Peq + [P₁(0)−Peq]exp(−t/T₁);  1/T₂ = 1/(2T₁)+1/Tφ',
          explanation:
            'Tφ is the pure-dephasing time in this model. Ramsey signals also oscillate with detuning and may have an inhomogeneous T₂* envelope.',
        },
        example:
          'If T₁ = 40 μs and Tφ = 80 μs in the stated model, T₂ = 40 μs. With no pure dephasing, the same T₁ would allow T₂ = 80 μs.',
        practice: {
          prompt: 'Does a long T₁ guarantee a long Ramsey T₂*?',
          answer:
            'No. Slow frequency fluctuations or other phase noise can shorten Ramsey coherence without comparable excited-population relaxation. Compare the measured experiments and their fit models.',
        },
        question: 'Which experiment directly probes excited-population relaxation?',
        answers: [
          'T₁ preparation–wait–readout',
          'Only a static OpenQASM export',
          'An MPS bond truncation',
        ],
        correct: 0,
        why: 'T₁ measures relaxation of population; Ramsey and echo primarily probe coherence with different sensitivity to phase noise.',
      },
    ],
  },
  {
    id: 'hardware-4',
    title: 'Hardware IV',
    track: 'fundamentals',
    icon: '∫',
    color: 'blue',
    description:
      'Build and validate driven Hamiltonian models, understand the cross-resonance interaction, and study Qiskit Dynamics as an archived, version-specific simulation toolkit.',
    prerequisites: ['hardware-3'],
    outcomes: [
      'Explain frame changes and effective-Hamiltonian approximations.',
      'Distinguish a desired cross-resonance ZX term from unwanted couplings.',
      'Specify and validate a time-dependent simulation without assuming current pulse execution support.',
    ],
    lessons: [
      {
        id: 'hamiltonian-engineering',
        title: 'Advanced Hamiltonian engineering and simulation',
        time: 13,
        level: 'Core',
        topics: [
          'Advanced Hamiltonian engineering & simulation',
          'Hamiltonian engineering',
          'Average Hamiltonian',
          'Toggling frames',
        ],
        body: [
          'Hamiltonian engineering chooses controls to produce a desired effective interaction while managing unwanted terms. A model combines a drift Hamiltonian with control operators weighted by time-dependent signals. Frame transformations and average-Hamiltonian reasoning help expose the resulting dynamics.',
          'The leading time average is generally an approximation when transformed Hamiltonians at different times do not commute. Simulation should include the levels, couplings, dissipation, and control bandwidth needed for the question, with explicit units and convergence checks. An accurate solution of the wrong model is still an inaccurate device prediction.',
        ],
        math: {
          formula: 'H(t) = Hdrift + Σₖ uₖ(t)Hₖ;  H̄⁽⁰⁾ = (1/T)∫₀ᵀ Htoggling(t)dt',
          explanation:
            'Htoggling is the Hamiltonian in the chosen control frame. Higher-order commutator terms matter outside the leading average approximation.',
        },
        example:
          'An ideal echo can alternate +δZ/2 and −δZ/2 for equal times, giving zero average drift. These two terms commute, so this ideal cancellation is stronger than a generic first-order averaging claim.',
        practice: {
          prompt:
            'Can alternating X and Z Hamiltonians always be replaced exactly by their ordinary average?',
          answer:
            'No. X and Z do not commute. Higher-order terms and the control time scale determine the approximation error.',
        },
        question: 'What can invalidate a leading average-Hamiltonian approximation?',
        answers: [
          'Using any complex amplitude',
          'Significant noncommuting higher-order effects',
          'Writing units next to parameters',
        ],
        correct: 1,
        why: 'Time ordering produces commutator corrections when the Hamiltonian changes along noncommuting directions.',
      },
      {
        id: 'cross-resonance',
        title: 'Cross-resonance: drive one qubit near another’s transition',
        time: 13,
        level: 'Core',
        topics: [
          'Cross-resonance effect',
          'CR',
          'Cross-resonance',
          'ZX interaction',
          'Echoed cross-resonance',
        ],
        body: [
          'In a coupled superconducting-qubit setting, a cross-resonance drive addresses the control qubit near the target qubit’s transition frequency. The effective dynamics can include a conditional target rotation, represented by a Zcontrol Xtarget term.',
          'Unwanted IX, ZI, ZZ, and other terms can accompany the desired interaction, depending on the device and drive. Echoed and cancellation-tone constructions aim to isolate useful dynamics, but their full sequence and phases must be calibrated. A pure ZX model explains the mechanism; it is not a complete calibrated two-qubit gate.',
        ],
        math: {
          formula:
            'HCR/ħ = ½[ΩZX ZcXt + ΩIX IcXt + δZI ZcIt + ζZZ ZcZt + …];  UZX(θ) = exp(−iθ ZcXt/2)',
          explanation:
            'c and t explicitly label control and target. Rates are angular frequencies; for a constant isolated ZX term, θ = ΩZX·T.',
        },
        example:
          'If the control has Z eigenvalue +1, pure ZX evolution rotates the target by RX(θ); with eigenvalue −1, by RX(−θ). At appropriate nontrivial angles this can entangle a superposed control with the target.',
        practice: {
          prompt:
            'Which transition frequency is used for the characteristic CR drive, and what extra terms should a model check?',
          answer:
            'The control is driven near the target transition. Check the desired ZX rate plus unwanted local/coupled terms, drive-induced shifts, leakage, and decoherence relevant to the device.',
        },
        question: 'What makes the ZX term a conditional target rotation?',
        answers: [
          'It measures the control after every infinitesimal step',
          'It always removes all local errors',
          'The target’s X rotation changes sign with the control’s Z eigenvalue',
        ],
        correct: 2,
        why: 'Zc contributes ±1 in its eigenbasis, producing opposite target rotation angles coherently.',
      },
      {
        id: 'qiskit-dynamics',
        title: 'Qiskit Dynamics: model-driven simulation and version boundaries',
        time: 13,
        level: 'Application',
        topics: [
          'Qiskit Dynamics',
          'Time-dependent simulation',
          'Lindblad models',
          'Simulation validation',
        ],
        body: [
          'Qiskit Dynamics provided model and solver abstractions for time-dependent Hamiltonians, signals, frame transformations, and dissipative dynamics. Its upstream repository is now archived and marked deprecated; this lesson treats that interface as a historical, version-pinned reference rather than an actively maintained addition to this app.',
          'The transferable workflow is to declare the model, state, signal conventions, dissipation, solver accuracy, and observables, then validate against analytic limits and convergence checks. Qiskit Pulse was removed in Qiskit 2.0; neither an old Dynamics example nor an OpenPulse description establishes current hardware pulse access. The guided exercise uses the equations below and changes no project dependencies.',
        ],
        math: {
          formula: 'dρ/dt = −i[H(t),ρ] + Σₖ γₖ[LₖρLₖ† − ½{Lₖ†Lₖ,ρ}]',
          explanation:
            'This Lindblad form uses ħ = 1, nonnegative rates γₖ, and dimensionless collapse operators Lₖ in a declared model. A closed pure-state model instead solves i d|ψ⟩/dt = H(t)|ψ⟩.',
        },
        example:
          'With H = ΩX/2 and no dissipation, a numerical solver starting in |0⟩ should reproduce P₁(t) = sin²(Ωt/2), preserve normalization, and converge as numerical tolerances are tightened.',
        practice: {
          prompt:
            'What should be checked before trusting a simulated CR pulse or a legacy Dynamics notebook?',
          answer:
            'Verify software versions and supported APIs, basis/units and frame conventions, signal definitions, device-model assumptions, numerical convergence, and reference limits. Hardware execution support requires a separate compatible target.',
        },
        question: 'What is an appropriate validation step for a time-dependent solver?',
        answers: [
          'Compare an analytic limit and test numerical convergence',
          'Assume a successful installation proves device fidelity',
          'Ignore the units because the solver uses arrays',
        ],
        correct: 0,
        why: 'Reference limits and convergence checks test the calculation; separate experiments and model checks are needed to validate a physical prediction.',
      },
    ],
  },
];
