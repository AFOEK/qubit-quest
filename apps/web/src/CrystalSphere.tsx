import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

type Vec3 = { x: number; y: number; z: number };
type Orientation = { yaw: number; pitch: number };
const HOME: Orientation = { yaw: -0.32, pitch: 0.19 };
const SCALE = 106;
const CENTER = 160;

function rotate(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const x = p.x * cy + p.z * sy;
  const zz = -p.x * sy + p.z * cy;
  const cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  return { x, y: p.y * cp - zz * sp, z: p.y * sp + zz * cp };
}
function project(p: Vec3, o: Orientation): [number, number, number] {
  const r = rotate(p, o.yaw, o.pitch);
  return [CENTER + r.x * SCALE, CENTER - r.y * SCALE, r.z];
}
function circlePoints(plane: 'xy' | 'xz' | 'yz', r: number, tilt = 0): Vec3[] {
  return Array.from({ length: 121 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2 + tilt;
    const u = Math.cos(a) * r,
      v = Math.sin(a) * r;
    return plane === 'xy'
      ? { x: u, y: v, z: 0 }
      : plane === 'xz'
        ? { x: u, y: 0, z: v }
        : { x: 0, y: u, z: v };
  });
}
const ringDefs: { plane: 'xy' | 'xz' | 'yz'; radius: number; opacity: number; dash?: string }[] = [
  { plane: 'xz', radius: 1, opacity: 0.85 },
  { plane: 'xy', radius: 1, opacity: 0.42 },
  { plane: 'yz', radius: 1, opacity: 0.42 },
  { plane: 'xz', radius: 0.74, opacity: 0.22, dash: '3 5' },
  { plane: 'xy', radius: 1.055, opacity: 0.35 },
  { plane: 'yz', radius: 1.09, opacity: 0.25 },
];
const SHIMMER = Array.from({ length: 28 }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / 28;
  const a = i * 2.399963229728653;
  const r = Math.sqrt(1 - y * y) * 0.995;
  return { x: r * Math.cos(a), y, z: r * Math.sin(a) };
});

/** Display-only rotation: gate probabilities continue to use the true statevector. */
export function CrystalSphere({
  x,
  y,
  z,
  className = '',
  showHint = true,
}: Vec3 & { className?: string; showHint?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const [frame, setFrame] = useState({ o: HOME, v: { x, y, z } });
  const angles = useRef<Orientation>({ ...HOME });
  const value = useRef<Vec3>({ x, y, z });
  const desired = useRef<Vec3>({ x, y, z });
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const request = useRef<number | null>(null);
  const tick = useRef<(t: number) => void>(() => {});

  useEffect(() => {
    desired.current = { x, y, z };
  }, [x, y, z]);
  useEffect(() => {
    let last = performance.now();
    let alive = true;
    tick.current = (now) => {
      if (!alive) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const lerp = 1 - Math.exp(-dt * 8);
      // A gentle return to the exact default viewpoint after pointer release.
      if (!gesture.current) {
        const settle = 1 - Math.exp(-dt * 5.3);
        angles.current.yaw += (HOME.yaw - angles.current.yaw) * settle;
        angles.current.pitch += (HOME.pitch - angles.current.pitch) * settle;
      }
      for (const axis of ['x', 'y', 'z'] as const) {
        value.current[axis] += (desired.current[axis] - value.current[axis]) * lerp;
      }
      setFrame({ o: { ...angles.current }, v: { ...value.current } });
      request.current = requestAnimationFrame(tick.current);
    };
    request.current = requestAnimationFrame(tick.current);
    return () => {
      alive = false;
      if (request.current !== null) cancelAnimationFrame(request.current);
    };
  }, []);

  const pointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (gesture.current) return;
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const pointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    angles.current.yaw += (e.clientX - g.x) * 0.01;
    angles.current.pitch = Math.max(
      -1.36,
      Math.min(1.36, angles.current.pitch - (e.clientY - g.y) * 0.01),
    );
    gesture.current = { ...g, x: e.clientX, y: e.clientY };
  };
  const pointerEnd = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (gesture.current?.id !== e.pointerId) return;
    gesture.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const { o, v } = frame;
  const path = (pts: Vec3[]) =>
    pts
      .map((p, i) => {
        const [px, py] = project(p, o);
        return `${i ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`;
      })
      .join(' ');
  const origin = project({ x: 0, y: 0, z: 0 }, o);
  // Single-qubit Bloch vector: physical vertical axis corresponds to quantum Z.
  const magnitude = Math.hypot(v.x, v.y, v.z);
  const tip = project({ x: v.x, y: v.z, z: v.y }, o);
  const deltaX = tip[0] - origin[0],
    deltaY = tip[1] - origin[1];
  const angle = Math.atan2(deltaY, deltaX);
  const arrowHead = 11;
  const ha = [
    tip[0] - Math.cos(angle - 0.5) * arrowHead,
    tip[1] - Math.sin(angle - 0.5) * arrowHead,
  ];
  const hb = [
    tip[0] - Math.cos(angle + 0.5) * arrowHead,
    tip[1] - Math.sin(angle + 0.5) * arrowHead,
  ];
  return (
    <div className={`qv-crystal-stage ${className}`.trim()}>
      <svg
        className="qv-crystal-svg"
        viewBox="0 0 320 320"
        role="img"
        aria-label={`Interactive Bloch sphere. State vector x ${x.toFixed(2)}, y ${y.toFixed(2)}, z ${z.toFixed(2)}. Drag to rotate; release to reset.`}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={() => {
          gesture.current = null;
        }}
      >
        <defs>
          <radialGradient id={`${uid}-body`} cx="40%" cy="33%" r="70%">
            <stop offset="0%" stopColor="#dcffff" stopOpacity=".23" />
            <stop offset="41%" stopColor="#44dfff" stopOpacity=".10" />
            <stop offset="88%" stopColor="#0f6b9b" stopOpacity=".07" />
            <stop offset="100%" stopColor="#00eaff" stopOpacity=".05" />
          </radialGradient>
          <radialGradient id={`${uid}-light`}>
            <stop stopColor="#e7ffff" stopOpacity=".65" />
            <stop offset="22%" stopColor="#6df2ff" stopOpacity=".30" />
            <stop offset="100%" stopColor="#01baf5" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-arrow`} x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#12b6dd" />
            <stop offset="100%" stopColor="#c9ffff" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <circle
          cx="160"
          cy="160"
          r="111"
          fill={`url(#${uid}-body)`}
          stroke="#8fefff"
          strokeWidth=".9"
          strokeOpacity=".73"
        />
        <circle cx="120" cy="115" r="108" fill={`url(#${uid}-light)`} pointerEvents="none" />
        {ringDefs.map((ring, i) => (
          <path
            key={i}
            d={path(circlePoints(ring.plane, ring.radius))}
            fill="none"
            stroke={i === 0 ? '#c3ffff' : '#61d8ee'}
            strokeWidth={i === 0 ? 1.9 : 1.05}
            strokeOpacity={ring.opacity}
            strokeDasharray={ring.dash}
            pointerEvents="none"
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI;
          return (
            <path
              key={`arc-${i}`}
              d={path(
                Array.from({ length: 39 }, (_, j) => {
                  const t = (j / 38) * Math.PI * 2;
                  return {
                    x: Math.sin(a) * Math.cos(t),
                    y: Math.cos(a),
                    z: Math.sin(a) * Math.sin(t),
                  };
                }),
              )}
              fill="none"
              stroke="#62bfe1"
              strokeOpacity=".16"
              strokeWidth=".8"
              pointerEvents="none"
            />
          );
        })}
        {SHIMMER.map((dot, i) => {
          const [px, py, depth] = project(dot, o);
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={depth > 0 ? 1.55 : 1.05}
              fill="#d0ffff"
              opacity={depth > 0 ? 0.54 : 0.18}
              pointerEvents="none"
            />
          );
        })}
        <circle cx="160" cy="160" r="29" fill={`url(#${uid}-light)`} pointerEvents="none" />
        <circle cx="160" cy="160" r="5" fill="#a9ffff" opacity=".9" pointerEvents="none" />
        {magnitude > 0.025 && (
          <g pointerEvents="none">
            <path
              d={`M${origin[0]} ${origin[1]} L${tip[0]} ${tip[1]}`}
              stroke="#00dfff"
              strokeWidth="9"
              opacity=".46"
              filter={`url(#${uid}-glow)`}
            />
            <path
              d={`M${origin[0]} ${origin[1]} L${tip[0]} ${tip[1]}`}
              stroke={`url(#${uid}-arrow)`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d={`M${ha[0]} ${ha[1]} L${tip[0]} ${tip[1]} L${hb[0]} ${hb[1]}`}
              fill="none"
              stroke="#caffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={tip[0]} cy={tip[1]} r="17" fill={`url(#${uid}-light)`} />
            <circle cx={tip[0]} cy={tip[1]} r="4.7" fill="#e9ffff" />
          </g>
        )}
        {(
          [
            ['|0⟩', { x: 0, y: 1.18, z: 0 }],
            ['|1⟩', { x: 0, y: -1.18, z: 0 }],
          ] as const
        ).map(([label, p]) => {
          const [px, py] = project(p, o);
          return (
            <text
              key={label}
              x={px}
              y={py}
              fill="#a6dfea"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="middle"
              pointerEvents="none"
            >
              {label}
            </text>
          );
        })}
      </svg>
      {showHint && (
        <div className="qv-crystal-hint" aria-hidden="true">
          <span className="qv-crystal-dot" /> Drag to rotate <span>·</span> Release to reset
        </div>
      )}
    </div>
  );
}
