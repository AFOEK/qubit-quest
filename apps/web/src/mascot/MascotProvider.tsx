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
const Context = createContext<ReturnType<typeof useController> | null>(null);
function useController() {
  const { user } = useLearner();
  const [reaction, setReaction] = useState(idleReaction);
  const current = useRef(idleReaction);
  const [visibility, setVisibility] = useState(readVisibility);
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
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
  const reset = useCallback(() => {
    controller.reset();
    activeAt.current = Date.now();
  }, [controller]);
  const react = useCallback(
    (next: Reaction) => {
      if (next.priority > 0) activeAt.current = Date.now();
      if (!document.hidden) controller.play(next);
    },
    [controller],
  );
  function changeVisibility(value: Visibility) {
    reset();
    setVisibility(value);
    try {
      localStorage.setItem(visibilityKey, value);
    } catch {
      /* Session controls still work. */
    }
  }
  useEffect(() => {
    reset();
    return () => controller.dispose();
  }, [user?.id, reset, controller]);
  useEffect(() => {
    const layout = window.matchMedia('(max-width: 600px)');
    const updateLayout = () => setCompact(layout.matches);
    layout.addEventListener('change', updateLayout);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      layout.removeEventListener('change', updateLayout);
    };
  }, []);
  useEffect(() => {
    function activity() {
      activeAt.current = Date.now();
      if (current.current.state === 'sleeping') reset();
    }
    function visible() {
      reset();
    }
    window.addEventListener('pointerdown', activity);
    window.addEventListener('keydown', activity);
    document.addEventListener('visibilitychange', visible);
    let idleTimer: ReturnType<typeof setTimeout>;
    function schedule() {
      idleTimer = setTimeout(
        () => {
          if (!document.hidden && visibility === 'shown' && current.current.priority === 0) {
            react(
              Date.now() - activeAt.current > 120000
                ? { state: 'sleeping', priority: 0, duration: 0 }
                : {
                    state: (['curious', 'walking', 'playful'] as const)[
                      Math.floor(Math.random() * 3)
                    ],
                    priority: 0,
                    duration: 2000,
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
  }, [react, reset, visibility]);
  return { reaction, react, reset, visibility, changeVisibility, reduced, started, compact };
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
