"""Regenerate the judge walkthrough without notebook tooling dependencies."""
import json
from pathlib import Path


def cell(kind, text):
    data = {"cell_type": kind, "metadata": {}, "source": text.splitlines(keepends=True)}
    if kind == "code":
        data.update(execution_count=None, outputs=[])
    return data


cells = [
    cell("markdown", "# Qubit Quest: from intuition to Qiskit\nAn explainable Fall Fest demo. Run after installing `services/api/requirements.lock.txt`. These are ideal local simulations, not QPU runs."),
    cell("code", "from qiskit import QuantumCircuit\nfrom qiskit.quantum_info import Statevector, partial_trace, SparsePauliOp\nfrom qiskit.circuit.library import QFTGate\nfrom qiskit.primitives import StatevectorSampler\nimport numpy as np"),
    cell("markdown", "## Superposition and interference\nPredict H|0⟩, then H²|0⟩. Equal measurement probabilities do not imply a classical mixture."),
    cell("code", "qc = QuantumCircuit(1)\nqc.h(0)\nprint('After H:', Statevector(qc).probabilities_dict())\nqc.h(0)\nprint('After HH:', Statevector(qc).probabilities_dict())\nassert np.isclose(Statevector(qc).probabilities()[0], 1)"),
    cell("markdown", "## Bell correlations and reduced states\nBitstrings are q1q0. Tracing out qubit 1 leaves a maximally mixed qubit 0."),
    cell("code", "bell = QuantumCircuit(2)\nbell.h(0)\nbell.cx(0, 1)\nprint(Statevector(bell).probabilities_dict())\nprint(partial_trace(Statevector(bell), [1]))\nmeasured = bell.copy()\nmeasured.measure_all()\nprint(StatevectorSampler(seed=7).run([measured], shots=1024).result()[0].data.meas.get_counts())"),
    cell("markdown", "## Grover: mark 11 and amplify\nFor four candidates and one marked item, one iteration is sufficient. The oracle is supplied, not a free database lookup."),
    cell("code", "grover = QuantumCircuit(2)\ngrover.h([0, 1])\ngrover.cz(0, 1)\ngrover.h([0, 1])\ngrover.x([0, 1])\ngrover.cz(0, 1)\ngrover.x([0, 1])\ngrover.h([0, 1])\nprint(Statevector(grover).probabilities_dict())\nassert np.isclose(Statevector(grover).probabilities()[3], 1)"),
    cell("markdown", "## QFT: inspect amplitudes, not just histograms"),
    cell("code", "qft = QuantumCircuit(2)\nqft.x(0)\nqft.append(QFTGate(2), [0, 1])\nprint(Statevector(qft).data)\nassert np.allclose(Statevector(qft).data, [0.5, 0.5j, -0.5, -0.5j])"),
    cell("markdown", "## Optimization: one-edge MaxCut\n01 and 10 cut the edge. Sweep gamma while fixing beta=-pi/8."),
    cell("code", "best = (0, 0)\nfor gamma in np.linspace(0, 2*np.pi, 101):\n    circuit = QuantumCircuit(2)\n    circuit.h([0, 1])\n    circuit.rzz(gamma, 0, 1)\n    circuit.rx(-np.pi/4, [0, 1])\n    p = Statevector(circuit).probabilities()\n    score = p[1] + p[2]\n    if score > best[1]:\n        best = (gamma, score)\nprint('Best angle and expected cut:', best)\nassert np.isclose(best[1], 1)"),
    cell("markdown", "## Chemistry precursor: variational energy\nThis toy Hamiltonian is −ZI−IZ+0.5XX, in arbitrary units. It is not an ab initio molecule. Real chemistry needs a molecular geometry, basis, active space, mapping, and validated reference energies."),
    cell("code", "hamiltonian = SparsePauliOp.from_list([('ZI', -1), ('IZ', -1), ('XX', .5)])\nexact = np.linalg.eigvalsh(hamiltonian.to_matrix())[0]\nenergies = []\nfor theta in np.linspace(0, 2*np.pi, 201):\n    trial = QuantumCircuit(2)\n    trial.ry(theta, 0)\n    trial.cx(0, 1)\n    energies.append(Statevector(trial).expectation_value(hamiltonian).real)\nprint('Trial minimum:', min(energies), 'Exact ground:', exact)\nassert min(energies) >= exact - 1e-10"),
]
out = Path(__file__).resolve().parents[1] / "notebooks" / "judge_demo.ipynb"
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps({"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}}, "nbformat": 4, "nbformat_minor": 5}, indent=2), encoding="utf-8")
