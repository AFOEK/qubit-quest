import { useSyncExternalStore } from 'react';
import map from '../../public/pets/bd-cat/animation-map.json';
import { frameAt, type MascotState } from './mascot-state';
import type { SpriteSource } from './animation-controller';
const noSubscribe = () => () => {};
/** Rendering observes the shared frame clock; remounting cannot restart a reaction. */
export function CatSprite({
  state,
  playback,
  face = false,
}: {
  state: MascotState;
  playback?: SpriteSource;
  face?: boolean;
}) {
  const staticFrame = frameAt(state, 0);
  const frame = useSyncExternalStore(
    playback?.subscribe ?? noSubscribe,
    playback?.getFrame ?? (() => staticFrame),
    () => staticFrame,
  );
  return (
    <svg
      className="bd-cat-sprite"
      viewBox={face ? '32 4 128 128' : `0 0 ${frame.width} ${frame.height}`}
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
