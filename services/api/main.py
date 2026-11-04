"""Bounded, credential-free Qiskit simulations shared by web and Unity."""
import math
import os
from typing import Literal

import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from qiskit import QuantumCircuit
from qiskit.circuit.library import QFTGate
from qiskit.primitives import StatevectorSampler
from qiskit.quantum_info import Statevector, partial_trace, SparsePauliOp

app = FastAPI(title="Qubit Quest simulation API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv(
    "ALLOWED_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173"
).split(","), allow_methods=["GET", "POST"], allow_headers=["Content-Type"])


class Gate(BaseModel):
    name: Literal["h", "x", "y", "z", "s", "t", "rx", "ry", "rz", "cx"]
    target: int = Field(default=0, ge=0, le=5)
    control: int = Field(default=0, ge=0, le=5)
    angle: float = Field(default=math.pi / 2, ge=-2 * math.pi, le=2 * math.pi)


class Simulation(BaseModel):
    qubits: int = Field(default=1, ge=1, le=6)
    gates: list[Gate] = Field(default_factory=list, max_length=64)
    shots: int = Field(default=1024, ge=1, le=8192)
    seed: int = Field(default=7, ge=0, le=2**32 - 1)

    @model_validator(mode="after")
    def validate_targets(self):
        for gate in self.gates:
            if gate.target >= self.qubits or (gate.name == "cx" and (
                gate.control >= self.qubits or gate.control == gate.target
            )):
                raise ValueError("Gate targets must exist; CX needs two distinct qubits")
        return self


class AlgorithmRequest(BaseModel):
    name: Literal["bell", "grover", "qft", "optimization", "chemistry"]
    parameter: float = Field(default=math.pi / 2, ge=0, le=2 * math.pi)
    shots: int = Field(default=1024, ge=1, le=8192)


def describe_state(circuit):
    state = Statevector.from_instruction(circuit)
    # Partial trace preserves mixed reduced states for entangled qubits.
    rho = partial_trace(state, list(range(1, circuit.num_qubits))) if circuit.num_qubits > 1 else np.outer(state.data, state.data.conj())
    rho = np.asarray(rho.data if hasattr(rho, "data") else rho)
    return {"probabilities": {format(i, f"0{circuit.num_qubits}b"): float(p)
                              for i, p in enumerate(state.probabilities())},
            "amplitudes": [{"real": float(a.real), "imag": float(a.imag)} for a in state.data],
            "bloch": {"x": float(2 * rho[0, 1].real), "y": float(-2 * rho[0, 1].imag),
                      "z": float((rho[0, 0] - rho[1, 1]).real)}}


def result(circuit, shots, seed=7, steps=None):
    data = describe_state(circuit)
    measured = circuit.copy()
    measured.measure_all()
    counts = StatevectorSampler(seed=seed).run([measured], shots=shots).result()[0].data.meas.get_counts()
    return {**data, "counts": counts, "shots": shots, "engine": "Qiskit StatevectorSampler",
            "bit_order": "q[n-1]...q[0] (qubit 0 is rightmost)",
            "circuit": str(circuit.draw(output="text")), "steps": steps or []}


@app.get("/api/health")
def health():
    return {"status": "ok", "engine": "qiskit", "version": "0.1.0"}


@app.post("/api/simulate")
def simulate(request: Simulation):
    circuit = QuantumCircuit(request.qubits)
    steps = [{"label": "Initial state", **describe_state(circuit)}]
    for gate in request.gates:
        if gate.name == "cx":
            circuit.cx(gate.control, gate.target)
        elif gate.name in ("rx", "ry", "rz"):
            getattr(circuit, gate.name)(gate.angle, gate.target)
        else:
            getattr(circuit, gate.name)(gate.target)
        steps.append({"label": gate.name.upper(), **describe_state(circuit)})
    return result(circuit, request.shots, request.seed, steps)


@app.post("/api/algorithm")
def algorithm(request: AlgorithmRequest):
    circuit = QuantumCircuit(2)
    extra = {}
    if request.name == "bell":
        circuit.h(0)
        circuit.cx(0, 1)
        explanation = "Entangled outcomes: 00 and 11. Each individual qubit has a mixed reduced state."
    elif request.name == "grover":
        circuit.h([0, 1])
        circuit.cz(0, 1)  # Phase oracle marks |11>.
        circuit.h([0, 1]); circuit.x([0, 1]); circuit.cz(0, 1)
        circuit.x([0, 1]); circuit.h([0, 1])
        explanation = "One Grover iteration amplifies the marked item 11 to probability 1 in an ideal four-item search."
    elif request.name == "qft":
        circuit.x(0)  # |01>, not |00>, so output phases are visible.
        circuit.append(QFTGate(2), [0, 1])
        explanation = "QFT on |01> produces equal probabilities with phases 0, pi/2, pi, -pi/2. Phase carries information."
    elif request.name == "optimization":
        circuit.h([0, 1])
        circuit.rzz(request.parameter, 0, 1)
        circuit.rx(-math.pi / 4, [0, 1])
        state = Statevector.from_instruction(circuit)
        extra["expected_cut"] = float(state.probabilities()[1] + state.probabilities()[2])
        explanation = "One-edge MaxCut QAOA: 01 and 10 cut the edge. Sweep the cost angle; the mixer angle is fixed at -pi/8."
    else:
        # Explicit toy spin Hamiltonian, not an ab initio molecular calculation.
        circuit.ry(request.parameter, 0)
        circuit.cx(0, 1)
        hamiltonian = SparsePauliOp.from_list([("ZI", -1.0), ("IZ", -1.0), ("XX", 0.5)])
        extra["energy"] = float(Statevector.from_instruction(circuit).expectation_value(hamiltonian).real)
        extra["exact_ground_energy"] = float(np.linalg.eigvalsh(hamiltonian.to_matrix())[0])
        explanation = "Variational chemistry precursor: minimize a toy two-spin Hamiltonian -ZI - IZ + 0.5 XX. Energy is in arbitrary units; this is not a molecular H2 prediction."
    return {**result(circuit, request.shots), **extra, "explanation": explanation}
