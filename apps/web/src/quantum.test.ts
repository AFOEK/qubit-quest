import { describe as suite, it, expect } from 'vitest';
import { apply, initial, describe } from './quantum';
suite('single-qubit teaching model', () => {
  it('retains interference through two Hadamards', () =>
    expect(describe(apply(apply(initial(), 'H'), 'H')).p0).toBeCloseTo(1));
  it('distinguishes phase from probability', () => {
    const d = describe(apply(apply(initial(), 'H'), 'S'));
    expect(d.y).toBeCloseTo(1);
    expect(d.p0).toBeCloseTo(0.5);
  });
  it('preserves normalization through a long circuit', () => {
    let s = initial();
    for (let i = 0; i < 100; i++) for (const g of ['H', 'T', 'Y', 'S'] as const) s = apply(s, g);
    const d = describe(s);
    expect(d.p0 + d.p1).toBeCloseTo(1);
  });
});
