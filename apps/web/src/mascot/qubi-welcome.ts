import { useCallback, useRef, useState, type RefObject } from 'react';
import type { createAnimationController } from './animation-controller';
import type { Reaction } from './mascot-state';

export const welcomeKey = 'qq.qubi.welcome.v1';
export const welcomeSteps = [
  { state: 'happy', message: "Psst... Hey there! I'm Qubi, your quantum companion!" },
  {
    state: 'happy',
    message: "I'll celebrate your victories and cheer you on when quantum stuff gets tricky!",
  },
  { state: 'playful', message: 'Give me a click anytime! I have a few quantum tricks up my paws.' },
] as const;
export type WelcomeStatus = 'shown' | 'completed' | 'dismissed';
export function readWelcome() {
  try {
    return ['shown', 'completed', 'dismissed'].includes(localStorage.getItem(welcomeKey) ?? '');
  } catch {
    return false;
  }
}
export function rememberWelcome(status: WelcomeStatus) {
  try {
    localStorage.setItem(welcomeKey, status);
  } catch {
    /* Shared in-memory state still prevents repeats in this visit. */
  }
}

/** Welcome steps use the existing controller; the provider owns their state across page mounts. */
export function useQubiWelcome(
  controller: ReturnType<typeof createAnimationController>,
  current: RefObject<Reaction>,
) {
  const [autoPending, setAutoPending] = useState(() => !readWelcome());
  const pending = useRef(autoPending);
  const [step, setStep] = useState<number | null>(null);
  const activeStep = useRef<number | null>(null);
  const animation = useRef<Reaction | null>(null);
  const showStep = useCallback(
    (index: number) => {
      if (document.hidden) return false;
      const reaction: Reaction = { ...welcomeSteps[index], priority: 0.5 };
      if (!controller.play(reaction)) return false;
      animation.current = reaction;
      activeStep.current = index;
      setStep(index);
      return true;
    },
    [controller],
  );
  const begin = useCallback(() => {
    if (!showStep(0)) return false;
    pending.current = false;
    setAutoPending(false);
    // Record the first display too, so a refresh midway does not prompt again.
    rememberWelcome('shown');
    return true;
  }, [showStep]);
  const startAutomatically = useCallback(() => {
    if (pending.current) begin();
  }, [begin]);
  const finish = useCallback(
    (status: 'completed' | 'dismissed') => {
      if (activeStep.current === null) return;
      if (current.current === animation.current) controller.rest();
      activeStep.current = null;
      animation.current = null;
      setStep(null);
      rememberWelcome(status);
    },
    [controller, current],
  );
  const dismiss = useCallback(() => finish('dismissed'), [finish]);
  const next = useCallback(() => {
    const index = activeStep.current;
    if (index === null || current.current === animation.current) return;
    if (index === welcomeSteps.length - 1) finish('completed');
    else showStep(index + 1);
  }, [current, finish, showStep]);
  const isOpen = useCallback(() => activeStep.current !== null, []);
  return { step, autoPending, begin, startAutomatically, next, dismiss, isOpen };
}
