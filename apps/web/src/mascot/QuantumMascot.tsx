import { useEffect, useRef } from 'react';
import { Minus, X } from 'lucide-react';
import { CatSprite } from './CatSprite';
import { MascotEffects } from './MascotEffects';
import { useMascot } from './MascotProvider';
import { petMessages } from './mascot-messages';
import './mascot.css';
export function QuantumMascot({
  hidden = false,
  inline = false,
  layout,
}: {
  hidden?: boolean;
  inline?: boolean;
  layout?: 'desktop' | 'mobile';
}) {
  const { reaction, react, reset, visibility, changeVisibility, reduced, started, compact } =
    useMascot();
  const clicks = useRef(0);
  const control = useRef<HTMLButtonElement>(null);
  const focusRequested = useRef(false);
  useEffect(() => {
    if (focusRequested.current) {
      control.current?.focus();
      focusRequested.current = false;
    }
  }, [visibility]);
  if (hidden || (layout === 'desktop' && compact) || (layout === 'mobile' && !compact)) return null;
  function preference(value: 'shown' | 'hidden' | 'minimized') {
    focusRequested.current = true;
    changeVisibility(value);
  }
  if (visibility !== 'shown')
    return (
      <div className={`bd-cat-dock ${inline ? 'inline' : ''}`}>
        <button
          ref={control}
          className="bd-cat-restore"
          onClick={() => preference('shown')}
          aria-label="Restore BD Cat"
        >
          {visibility === 'hidden' ? 'Show BD Cat' : 'BD Cat · Restore'}
        </button>
      </div>
    );
  return (
    <aside className={`bd-cat-dock ${inline ? 'inline' : ''}`} aria-label="BD Cat companion">
      <div className="bd-cat-message" role="status" aria-live="polite" aria-atomic="true">
        {reaction.message}
      </div>
      <div className="bd-cat-stage">
        <div className="bd-cat-controls">
          <button aria-label="Minimize BD Cat" onClick={() => preference('minimized')}>
            <Minus size={16} />
          </button>
          <button aria-label="Hide BD Cat" onClick={() => preference('hidden')}>
            <X size={16} />
          </button>
        </div>
        <button
          ref={control}
          className={`bd-cat-character state-${reaction.state}`}
          aria-label={reaction.state === 'sleeping' ? 'Wake and pet BD Cat' : 'Pet BD Cat'}
          onClick={() => {
            const index = clicks.current++;
            react({
              state: index % 4 === 3 ? 'happy' : 'playful',
              message: petMessages[index % petMessages.length],
              priority: 1,
              duration: 2800,
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              reset();
            }
          }}
        >
          <CatSprite state={reaction.state} reduced={reduced} started={started} />
          <MascotEffects state={reaction.state} />
        </button>
      </div>
    </aside>
  );
}
