import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLearner } from '../LearnerProvider';
import {
  idleReaction,
  readVisibility,
  visibilityKey,
  type Reaction,
  type Visibility,
} from './mascot-state';
import { createAnimationController } from './animation-controller';
import { useQubiWelcome } from './qubi-welcome';
import { createLessonPersonality } from './lesson-personality';
const Context = createContext<ReturnType<typeof useController> | null>(null);
function useController() {
  const { user, initializing } = useLearner();
  const [reaction, setReaction] = useState(idleReaction);
  const current = useRef(idleReaction);
  const [readyFor, setReadyFor] = useState<string | null | undefined>(null);
  const [visibility, setVisibility] = useState(readVisibility);
  const visibilityRef = useRef(visibility);
  visibilityRef.current = visibility;
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 600px)').matches);
  const [started, setStarted] = useState(0);
  const activeAt = useRef(Date.now());
  const [controller] = useState(() =>
    createAnimationController((next) => {
      current.current = next;
      setReaction(next);
      setStarted((value) => value + 1);
    }),
  );
  const welcome = useQubiWelcome(controller, current);
  const reset = useCallback(() => {
    controller.reset();
    activeAt.current = Date.now();
  }, [controller]);
  const react = useCallback(
    (next: Reaction) => {
      if (next.priority > 0) activeAt.current = Date.now();
      if (next.priority >= 1) welcome.dismiss();
      return !document.hidden && controller.play(next);
    },
    [controller, welcome.dismiss],
  );
  const [personality] = useState(() =>
    createLessonPersonality({
      play: react,
      clearQuestion: () => controller.clearQuestion(),
      canSpeak: () => visibilityRef.current === 'shown' && !document.hidden,
    }),
  );
  const interact = useCallback(
    (next: Reaction) => react(personality.click(next)),
    [personality, react],
  );
  function changeVisibility(value: Visibility) {
    const normalized = value === 'shown' ? 'shown' : 'minimized';
    if (normalized === 'minimized') welcome.dismiss();
    setVisibility(normalized);
    try {
      localStorage.setItem(visibilityKey, normalized);
    } catch {
      /* Session controls still work. */
    }
  }
  useEffect(() => {
    welcome.dismiss();
    personality.reset();
    reset();
    setReadyFor(user?.id);
    return () => {
      personality.reset();
      controller.dispose();
    };
  }, [user?.id, reset, controller, welcome.dismiss, personality]);
  const clearQuestion = useCallback(() => controller.clearQuestion(), [controller]);
  useEffect(() => {
    const layout = window.matchMedia('(max-width: 600px)');
    const updateLayout = () => setCompact(layout.matches);
    layout.addEventListener('change', updateLayout);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      controller.setReduced(query.matches);
    };
    update();
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      layout.removeEventListener('change', updateLayout);
    };
  }, [controller]);
  useEffect(() => {
    function activity() {
      activeAt.current = Date.now();
      if (current.current.state === 'sleeping') reset();
    }
    function visible() {
      controller.rest();
    }
    window.addEventListener('pointerdown', activity);
    window.addEventListener('keydown', activity);
    document.addEventListener('visibilitychange', visible);
    let idleTimer: ReturnType<typeof setTimeout>;
    function schedule() {
      idleTimer = setTimeout(
        () => {
          if (
            !document.hidden &&
            visibility === 'shown' &&
            !welcome.isOpen() &&
            current.current.state === 'idle' &&
            controller.getBaseEmotion() === 'idle'
          ) {
            react(
              Date.now() - activeAt.current > 120000
                ? { state: 'sleeping', priority: 0 }
                : {
                    state: (['curious', 'walking', 'playful'] as const)[
                      Math.floor(Math.random() * 3)
                    ],
                    priority: 0,
                  },
            );
          }
          schedule();
        },
        15000 + Math.random() * 20000,
      );
    }
    schedule();
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('pointerdown', activity);
      window.removeEventListener('keydown', activity);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [react, reset, visibility, controller, welcome.isOpen]);
  return {
    reaction,
    react,
    interact,
    enterLesson: personality.enter,
    answerLesson: personality.answer,
    reset,
    clearQuestion,
    rest: controller.rest,
    visibility,
    changeVisibility,
    started,
    compact,
    playback: controller,
    welcome,
    welcomeReady: !initializing && readyFor === user?.id,
  };
}
export function MascotProvider({ children }: { children: ReactNode }) {
  const controller = useController();
  return <Context.Provider value={controller}>{children}</Context.Provider>;
}
export function useMascot() {
  const value = useContext(Context);
  if (!value) throw new Error('MascotProvider missing');
  return value;
}
