# Shared web / Unity API

All endpoints use JSON. Development base URL: `http://127.0.0.1:8000`. Interactive schema: `/docs`. An actual headset uses the development machine's LAN address or an HTTPS API host.

## Gate simulation

`POST /api/simulate`

```json
{
  "qubits": 1,
  "gates": [
    { "name": "h", "target": 0 },
    { "name": "s", "target": 0 }
  ],
  "shots": 1024,
  "seed": 7
}
```

Supported names: `h`, `x`, `y`, `z`, `s`, `t`, `rx`, `ry`, `rz`, `cx`. Rotation gates accept `angle` in radians, default π/2. CX accepts `control` and `target`, which must differ. All indices are zero-based. Limits: 1–6 qubits, 0–64 gates, 1–8192 shots. Invalid workloads return HTTP 422 with validation details.

The response includes:

| Field           | Meaning                                                      |
| --------------- | ------------------------------------------------------------ |
| `probabilities` | Exact Z-basis probabilities, keyed by basis bitstring        |
| `counts`        | Finite-shot measurement counts; absent keys mean zero counts |
| `amplitudes`    | Basis-ordered `{real, imag}` complex amplitudes              |
| `bloch`         | `{x,y,z}` coordinates of qubit 0's reduced state             |
| `steps`         | Initial state and a snapshot after every gate                |
| `circuit`       | Human-readable Qiskit text drawing                           |
| `engine`        | `Qiskit StatevectorSampler`                                  |
| `bit_order`     | Highest-index qubit on the left; qubit 0 on the right        |

For H followed by S, the Bloch vector is approximately `(0,1,0)` and both measurement probabilities are 0.5. Simulation numbers may contain floating point residuals near zero.

## Algorithm experiments

`POST /api/algorithm`

```json
{ "name": "optimization", "parameter": 1.5707963267948966, "shots": 1024 }
```

Names: `bell`, `grover`, `qft`, `optimization`, `chemistry`. Parameter ranges from 0 to 2π and is used for the QAOA cost angle or the variational ansatz rotation. Each algorithm uses two qubits. The response adds an `explanation`, plus `expected_cut` for optimization or `energy` and `exact_ground_energy` for the chemistry precursor. Algorithm responses currently have no intermediate steps.

`GET /api/health` returns `{ "status": "ok", "engine": "qiskit", "version": "0.1.0" }`.

Simulation endpoints are public and bounded. Account/progress mutations use cookie sessions, CSRF tokens, and an explicit origin policy. Authentication attempts are rate limited. Public hosting also needs HTTPS and platform resource limits. See [accounts and trails](accounts-and-trails.md) for the account API. Nothing in this API executes arbitrary Python or submits hardware jobs.
