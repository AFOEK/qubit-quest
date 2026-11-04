export type Complex = [number, number];
export type Qubit = [Complex, Complex];
export type GateName = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T';
const add = (a: Complex, b: Complex): Complex => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Complex, b: Complex): Complex => [
  a[0] * b[0] - a[1] * b[1],
  a[0] * b[1] + a[1] * b[0],
];
export const initial = (): Qubit => [
  [1, 0],
  [0, 0],
];
export function apply(state: Qubit, gate: GateName): Qubit {
  const r = Math.SQRT1_2;
  const matrices: Record<GateName, Complex[][]> = {
    H: [
      [
        [r, 0],
        [r, 0],
      ],
      [
        [r, 0],
        [-r, 0],
      ],
    ],
    X: [
      [
        [0, 0],
        [1, 0],
      ],
      [
        [1, 0],
        [0, 0],
      ],
    ],
    Y: [
      [
        [0, 0],
        [0, -1],
      ],
      [
        [0, 1],
        [0, 0],
      ],
    ],
    Z: [
      [
        [1, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [-1, 0],
      ],
    ],
    S: [
      [
        [1, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 1],
      ],
    ],
    T: [
      [
        [1, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [r, r],
      ],
    ],
  };
  return matrices[gate].map((row) => add(mul(row[0], state[0]), mul(row[1], state[1]))) as Qubit;
}
export function describe(s: Qubit) {
  const [a, b] = s;
  const p0 = a[0] ** 2 + a[1] ** 2,
    p1 = b[0] ** 2 + b[1] ** 2;
  return {
    p0,
    p1,
    x: 2 * (a[0] * b[0] + a[1] * b[1]),
    y: 2 * (a[0] * b[1] - a[1] * b[0]),
    z: p0 - p1,
  };
}
