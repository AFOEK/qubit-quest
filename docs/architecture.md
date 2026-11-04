# How it works

The React client owns navigation, lesson quizzes, and browser-local progress. `quantum.ts` evaluates 2x2 complex gate matrices for immediate feedback. It is intentionally restricted to one qubit. Probabilities follow Born's rule and Bloch coordinates retain relative phase.

The FastAPI service constructs allowlisted Qiskit circuits. `/api/simulate` returns initial and per-gate state snapshots, final exact amplitudes and probabilities, qubit-0 Bloch coordinates, circuit text, and finite-shot `StatevectorSampler` counts. `/api/algorithm` constructs the named two-qubit teaching circuits. Validation rejects invalid indices, unsupported gates, excessive shots, and oversized circuits. No user-supplied code is executed.

For a pure state α|0⟩ + β|1⟩, the Bloch coordinates are x=2 Re(α*β), y=2 Im(α*β), z=|α|²−|β|². For multiple qubits the API traces out the other qubits before computing qubit 0's vector. This is essential: a Bell pair's individual qubits are mixed, at the center, not pure arrows on the surface.

The QFT input is |01⟩, making the complex phase pattern observable in the returned amplitudes. The Grover oracle marks |11⟩ with CZ; one diffusion iteration suffices for this four-item case. QAOA uses RZZ(γ), then RX(−π/4) on both qubits for a one-edge MaxCut example. At γ=π/2, the cut probability reaches 1. The energy lab uses −ZI−IZ+0.5XX and an RY/CX ansatz; it is a toy model, not molecular chemistry or a complete optimizer. Angles are swept manually.

WebXR uses Three.js and the same browser statevector functions; it does not call itself a Qiskit execution. Unity calls the Python API through a bounded JSON request. Both map the Bloch z axis to world up. The native Unity starter requires an XR rig, interactables, platform settings, and hardware validation.

Progress schema: `qq.progress.v1`, an array of completed lesson indices. XP is derived from unique completions. No backend account exists. The learning spark reflects cumulative local progress capped at the first 50 XP milestone; a date-based daily counter is a roadmap item.

References: [Qiskit Statevector](https://docs.quantum.ibm.com/api/qiskit/qiskit.quantum_info.Statevector), [Qiskit primitives](https://quantum.cloud.ibm.com/docs/en/api/qiskit/primitives), [Unity Meta OpenXR example](https://github.com/Unity-Technologies/mr-example-meta-openxr).
