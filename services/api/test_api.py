import math
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_gate_interference_and_phase():
    data = client.post('/api/simulate', json={"gates": [{"name": "h"}, {"name": "s"}]}).json()
    assert data['bloch']['y'] == pytest.approx(1)
    assert data['probabilities']['0'] == pytest.approx(.5)
    data = client.post('/api/simulate', json={"gates": [{"name": "h"}, {"name": "h"}]}).json()
    assert data['probabilities']['0'] == pytest.approx(1)


def test_bell_mixed_state():
    data = client.post('/api/algorithm', json={"name": "bell"}).json()
    assert data['probabilities']['00'] == pytest.approx(.5)
    assert all(abs(v) < 1e-8 for v in data['bloch'].values())
    assert sum(data['counts'].values()) == 1024


def test_grover():
    data = client.post('/api/algorithm', json={"name": "grover"}).json()
    assert data['probabilities']['11'] == pytest.approx(1)


def test_qft_relative_phases():
    data = client.post('/api/algorithm', json={"name": "qft"}).json()
    assert list(data['probabilities'].values()) == pytest.approx([.25] * 4)
    assert data['amplitudes'][1]['imag'] == pytest.approx(.5)


def test_optimization_and_variational_bound():
    opt = client.post('/api/algorithm', json={"name": "optimization", "parameter": math.pi / 2}).json()
    assert opt['expected_cut'] == pytest.approx(1)
    for angle in [0, 1, 2, 3]:
        chem = client.post('/api/algorithm', json={"name": "chemistry", "parameter": angle}).json()
        assert chem['energy'] >= chem['exact_ground_energy'] - 1e-8


@pytest.mark.parametrize('body', [{"qubits": 7}, {"shots": 0}, {"gates": [{"name": "cx"}]}, {"gates": [{"name": "x", "target": 1}]}, {"gates": [{"name": "evil"}]}])
def test_reject_invalid_workloads(body):
    assert client.post('/api/simulate', json=body).status_code == 422
