import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { CatSprite } from './CatSprite';
import { MascotEffects } from './MascotEffects';
import { useMascot } from './MascotProvider';
import { createClickInteractionPicker } from './mascot-messages';
import { welcomeSteps } from './qubi-welcome';
import './mascot.css';

const SINGLE_CLICK_DELAY = 500;
export function QuantumMascot({
  hidden = false,
  inline = false,
  layout,
}: {
  hidden?: boolean;
  inline?: boolean;
  layout?: 'desktop' | 'mobile';
}) {
  const {
    reaction,
    dialogue,
    dismissDialogue,
    setWelcomeSpeechActive,
    interact,
    rest,
    visibility,
    changeVisibility,
    started,
    compact,
    playback,
    welcome,
    welcomeReady,
  } = useMascot();
  const [playClickInteraction] = useState(() => createClickInteractionPicker());
  const control = useRef<HTMLButtonElement>(null);
  const pendingClick = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function cancelPendingClick() {
    clearTimeout(pendingClick.current);
    pendingClick.current = undefined;
  }
  const focusRequested = useRef(false);
  const name = useRef<HTMLButtonElement>(null);
  const focusNameRequested = useRef(false);
  const bubbleId = useId();
  const visible =
    !hidden && !(layout === 'desktop' && compact) && !(layout === 'mobile' && !compact);
  useEffect(() => cancelPendingClick, [visible, visibility]);
  const canIntroduce =
    visible && visibility === 'shown' && welcomeReady && (!inline || layout === 'mobile');
  useEffect(() => {
    if (canIntroduce && welcome.autoPending && reaction.priority === 0)
      welcome.startAutomatically();
  }, [canIntroduce, welcome.autoPending, welcome.startAutomatically, reaction]);
  const introduction = canIntroduce && welcome.step !== null;
  useEffect(() => {
    setWelcomeSpeechActive(introduction);
    return () => setWelcomeSpeechActive(false);
  }, [introduction, setWelcomeSpeechActive]);
  useEffect(() => {
    if (welcome.step === null && focusNameRequested.current) {
      name.current?.focus({ preventScroll: true });
      focusNameRequested.current = false;
    }
  }, [welcome.step]);
  function finishIntroduction() {
    focusNameRequested.current = true;
    welcome.dismiss();
  }
  function nextIntroduction() {
    if (welcome.step === welcomeSteps.length - 1) focusNameRequested.current = true;
    welcome.next();
  }
  useEffect(() => {
    if (focusRequested.current) {
      control.current?.focus();
      focusRequested.current = false;
    }
  }, [visibility]);
  if (!visible) return null;
  function preference(value: 'shown' | 'hidden' | 'minimized') {
    cancelPendingClick();
    focusRequested.current = true;
    changeVisibility(value);
  }
  if (visibility !== 'shown') {
    const avatar = (
      <button
        ref={control}
        className="bd-cat-avatar"
        onClick={() => preference('shown')}
        aria-label="Qubi — Your quantum companion"
        title="Qubi — Your quantum companion"
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
      <div
        className={`bd-cat-message${!introduction && dialogue ? ' has-dialogue' : ''}`}
        id={bubbleId}
      >
        {introduction ? (
          <>
            <p role="status" aria-live="polite" aria-atomic="true">
              {welcomeSteps[welcome.step!].message}
            </p>
            <div className="bd-cat-welcome-actions">
              <small>
                {welcome.step! + 1} / {welcomeSteps.length}
              </small>
              <button onClick={finishIntroduction} aria-label="Dismiss Qubi introduction">
                Skip
              </button>
              <button disabled={reaction.priority > 0} onClick={nextIntroduction}>
                {welcome.step === welcomeSteps.length - 1 ? 'Got it' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          dialogue && (
            <>
              <span role="status" aria-live="polite" aria-atomic="true">
                {dialogue.text}
              </span>
              <button
                className="bd-cat-dismiss"
                aria-label="Dismiss Qubi message"
                title="Dismiss message"
                onClick={() => {
                  dismissDialogue(dialogue.id);
                  control.current?.focus({ preventScroll: true });
                }}
              >
                <X size={14} />
              </button>
            </>
          )
        )}
      </div>
      <div className="bd-cat-stage">
        <button
          ref={control}
          className={`bd-cat-character state-${reaction.state}`}
          aria-label={reaction.state === 'sleeping' ? 'Wake and pet Qubi' : 'Pet Qubi'}
          aria-description="Click to interact. Double-click to minimize. Right-click to close."
          onMouseDown={(event) => {
            if (event.detail > 1) cancelPendingClick();
          }}
          onClick={(event) => {
            cancelPendingClick();
            if (event.detail === 0) {
              playClickInteraction(interact);
              return;
            }
            if (event.detail === 1)
              pendingClick.current = setTimeout(() => {
                pendingClick.current = undefined;
                playClickInteraction(interact);
              }, SINGLE_CLICK_DELAY);
          }}
          onDoubleClick={() => preference('minimized')}
          onContextMenu={(event) => {
            event.preventDefault();
            preference('minimized');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              cancelPendingClick();
              event.stopPropagation();
              rest();
            }
          }}
        >
          <CatSprite state={reaction.state} playback={playback} />
          <MascotEffects key={started} state={reaction.state} />
        </button>
        <button
          ref={name}
          className="bd-cat-name"
          aria-label="Meet Qubi"
          title="Meet Qubi"
          aria-expanded={introduction}
          aria-controls={introduction ? bubbleId : undefined}
          disabled={!canIntroduce || reaction.priority > 0}
          onClick={() => welcome.begin()}
        >
          Qubi
        </button>
      </div>
    </aside>
  );
}
