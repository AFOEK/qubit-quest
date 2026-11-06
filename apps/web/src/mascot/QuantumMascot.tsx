import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const { reaction, react, rest, visibility, changeVisibility, started, compact, playback } =
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
  if (visibility !== 'shown') {
    const avatar = (
      <button
        ref={control}
        className="bd-cat-avatar"
        onClick={() => preference('shown')}
        aria-label="Restore Qubi"
        title="Restore Qubi"
      >
        <CatSprite state="idle" face />
      </button>
    );
    // Escape the fixed sidebar's stacking context; lesson avatars stay in their focus trap.
    return (
      <div className={`bd-cat-dock ${inline ? 'inline' : ''}`}>
        {inline ? avatar : createPortal(avatar, document.body)}
      </div>
    );
  }
  return (
    <aside className={`bd-cat-dock ${inline ? 'inline' : ''}`} aria-label="Qubi companion">
      <div className="bd-cat-message" role="status" aria-live="polite" aria-atomic="true">
        {reaction.message}
      </div>
      <div className="bd-cat-stage">
        <div className="bd-cat-controls">
          <button aria-label="Minimize Qubi" onClick={() => preference('minimized')}>
            <Minus size={16} />
          </button>
          <button
            aria-label="Minimize Qubi to circular avatar"
            title="Minimize Qubi"
            onClick={() => preference('minimized')}
          >
            <X size={16} />
          </button>
        </div>
        <button
          ref={control}
          className={`bd-cat-character state-${reaction.state}`}
          aria-label={reaction.state === 'sleeping' ? 'Wake and pet Qubi' : 'Pet Qubi'}
          onClick={() => {
            const index = clicks.current++;
            react({
              state: 'playful',
              message: petMessages[index % petMessages.length],
              priority: 1,
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              rest();
            }
          }}
        >
          <CatSprite state={reaction.state} playback={playback} />
          <MascotEffects key={started} state={reaction.state} />
        </button>
      </div>
    </aside>
  );
}
