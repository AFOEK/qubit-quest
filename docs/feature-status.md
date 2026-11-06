# Feature status

This inventory distinguishes working application features, educational course content, and execution tools that are still outside the implemented scope. It describes the code in this fork; a separately hosted site may run a different version.

Source entry points: [curriculum](../apps/web/src/curriculum.ts), [journey UI](../apps/web/src/QuantumJourney.tsx), [account API](../services/api/accounts.py), [database storage](../services/api/storage.py), [simulation API](../services/api/main.py), [local 3D lab](../apps/web/src/vr.tsx), and [Qubi provider](../apps/web/src/mascot/MascotProvider.tsx).

## Implemented application features

| Feature                 | Implementation and behavior                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Optional accounts       | Registration, password sign-in, sign-out, and an explicit guest mode. Lessons, trails, quizzes, and achievements remain available without an account. See [accounts and trails](accounts-and-trails.md).                              |
| Saved progress          | Guests use browser storage. Accounts save lesson completions, the chosen goal, and daily answers through the API, using SQLite locally or configured PostgreSQL. Guest lesson import is explicit; guest quiz history is not imported. |
| Curriculum              | 27 courses and 119 lessons with explanations, mathematical/program examples, worked practice, and knowledge checks. All requested syllabus areas are covered in [the curriculum guide](curriculum.md).                                |
| Learning paths          | Seven paths with required prerequisite courses and optional branches. QML has 12 required courses / 60 lessons, with Applied Optimization optional. The crystal view and catalog share progress.                                      |
| Rewards                 | 27 named course badges, four earned journey ranks, and cumulative XP checkpoints through 2,975 XP. Reviews do not grant duplicate rewards. See [achievements](achievements.md).                                                       |
| Daily facts             | Three deterministic Toronto-date questions, explanations, first-answer scoring, and a separate participation streak.                                                                                                                  |
| Qubi                    | Animated local sprite companion, contextual teaching messages, checked-answer reactions, accepted-save celebrations, welcome tour, and minimize/restore preferences. No external AI service or audio. See [mascot](mascot.md).        |
| Gate explorer           | Immediate single-qubit H/X/Y/Z/S/T statevector feedback with a Bloch visualization and optional Qiskit verification.                                                                                                                  |
| Simulation API          | Bounded ideal circuits for the allowlisted gates, plus Bell, four-item Grover, two-qubit QFT, single-edge QAOA, and toy variational energy. See [API](api.md).                                                                        |
| Local immersive lab     | Three.js desktop controls, H/X/S gates, and WebXR entry through **Open local 3D lab**. WebXR headset operation is confirmed working by the project maintainer.                                                                        |
| External Quest launcher | **Launch on Meta Quest** opens an Oculus handoff to the hosted WebXR experience. The external site's source is separate, and learning progress is not automatically shared with this app.                                             |
| Notebooks               | Standalone Qiskit examples plus a root embedded-demo notebook with a live-site iframe. Notebook UI/embedding requires the tooling and conditions in [the demo guide](demo.md).                                                        |

## Course content with execution tools still missing

These topics are taught in the lessons. The following interactive engines and integrations are not implemented:

| Area                         | Current execution limit                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chemistry                    | No molecular driver, H₂/LiH/BeH₂ solver, automatic UCCSD optimization, or molecular excited-state workflow. The existing energy lab uses a toy two-spin Hamiltonian.       |
| Machine learning             | No runnable quantum-kernel/QSVM training, QNN/VQC training, QLSTM, or QCNN training pipeline. These are guided model-design exercises.                                     |
| Noise, QEC, mitigation       | No noisy-channel simulator, syndrome-extraction lab, or calibrated ZNE/PEC/readout-mitigation experiment.                                                                  |
| Additional algorithms        | QPE, Shor, QAE, quantum walks, GHZ/oracle algorithms, and boson sampling have course material rather than dedicated interactive API experiments.                           |
| Optimization                 | QUBO/Ising modeling is guided. The QAOA lab uses one fixed graph edge and a manual parameter sweep, without a classical optimizer.                                         |
| Cryptography                 | No executable BB84/E91/B92/DIQKD protocol or post-quantum cryptography implementation.                                                                                     |
| Software and tensor networks | No OpenQASM compiler sandbox or executable MPS/MPO/DMRG/TEBD/PEPS/MERA/TTN solver.                                                                                         |
| Hardware                     | No device connection, pulse execution, automated calibration, or hardware job submission. OpenPulse and historical Qiskit Dynamics interfaces are taught through examples. |

## Setup and validation limits

- Production account saving requires PostgreSQL `DATABASE_URL`. Local tests do not establish that a particular Vercel deployment is configured correctly.
- Email verification and password recovery are not implemented; no email provider is configured by the application.
- Unity supplies optional native source and a scene generator. This is a separate delivery path; the confirmed working WebXR experience does not require Unity compilation or an APK.
- Learning-path completion labels are in-app milestones, not externally accredited certificates.

The [roadmap](roadmap.md) tracks these remaining execution and deployment tasks. Add a UI entry, executable implementation, and relevant verification before describing a future lab as working.
