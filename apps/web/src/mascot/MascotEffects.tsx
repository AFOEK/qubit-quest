import type { MascotState } from './mascot-state';
export function MascotEffects({ state }: { state: MascotState }) {
  if (state === 'sleeping')
    return (
      <span className="bd-cat-sleep" aria-hidden="true">
        z z Z
      </span>
    );
  if (state === 'playful')
    return (
      <span className="bd-cat-purr" aria-hidden="true">
        ♡ prrr…
      </span>
    );
  if (state !== 'excited' && state !== 'celebrating') return null;
  return (
    <span className={`bd-cat-particles ${state}`} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <i key={i} style={{ left: `${8 + i * 9}%`, animationDelay: `${i * 65}ms` }}>
          {state === 'celebrating' && i % 2 ? '✧' : '▪'}
        </i>
      ))}
    </span>
  );
}
