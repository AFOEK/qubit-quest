import { useEffect, useState } from 'react';
import map from '../../public/pets/bd-cat/animation-map.json';
import { frameAt, spriteAnimation, type MascotState } from './mascot-state';
export function CatSprite({
  state,
  reduced,
  started,
}: {
  state: MascotState;
  reduced: boolean;
  started: number;
}) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    setElapsed(0);
    if (reduced || state === 'sleeping') return;
    const start = performance.now();
    const animation = spriteAnimation(state);
    const timer = setInterval(() => {
      const time = performance.now() - start;
      setElapsed(time);
      if (!animation.loop && time >= animation.frames.length * animation.frameDurationMs)
        clearInterval(timer);
    }, animation.frameDurationMs);
    return () => clearInterval(timer);
  }, [state, reduced, started]);
  const frame = frameAt(state, elapsed, reduced);
  return (
    <svg
      className="bd-cat-sprite"
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      aria-hidden="true"
    >
      <svg
        width={frame.width}
        height={frame.height}
        viewBox={`${frame.x} ${frame.y} ${frame.width} ${frame.height}`}
        overflow="hidden"
      >
        <image
          href={`/pets/bd-cat/${map.image}`}
          width={map.grid.sheetWidth}
          height={map.grid.sheetHeight}
        />
      </svg>
    </svg>
  );
}
