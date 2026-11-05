import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  accountRequest,
  ApiError,
  type LearnerUser,
  type SavedProgress,
  type SessionSnapshot,
} from './learner-api';
import { normalizeProgress, progressKey, readProgress } from './progress';
import {
  dailyQuestions,
  dailyStorageKey,
  normalizeDaily,
  quizDay,
  readDaily,
  type DailyAnswer,
} from './daily-quiz';
import { isPathId, lessonAvailable, type PathId } from './learning-paths';

const pathKey = 'qq.path.v1';
const guestModeKey = 'qq.guest-mode.v1';
function guestModeSelected() {
  try {
    return sessionStorage.getItem(guestModeKey) === 'true';
  } catch {
    return false;
  }
}
function rememberGuestMode(enabled: boolean) {
  try {
    if (enabled) sessionStorage.setItem(guestModeKey, 'true');
    else sessionStorage.removeItem(guestModeKey);
  } catch {
    // The current tab can still use guest mode when browser storage is blocked.
  }
}
function guestPath(): PathId {
  try {
    const value = localStorage.getItem(pathKey);
    return isPathId(value) ? value : 'foundations';
  } catch {
    return 'foundations';
  }
}
function useLearnerState() {
  const [user, setUser] = useState<LearnerUser | null>(null),
    [completed, setCompleted] = useState(readProgress),
    [pathId, setPathId] = useState<PathId>(guestPath),
    [dailyAnswers, setDailyAnswers] = useState<DailyAnswer[]>(readDaily),
    [initializing, setInitializing] = useState(() => !guestModeSelected()),
    [expired, setExpired] = useState(false),
    [saving, setSaving] = useState(false),
    [storageError, setStorageError] = useState(''),
    [connectionError, setConnectionError] = useState('');
  const csrf = useRef(''),
    identity = useRef(0),
    pending = useRef(false),
    initialRequest = useRef<AbortController | null>(null);
  function applyProgress(progress: SavedProgress) {
    setCompleted(normalizeProgress(progress.completedIds));
    setPathId(isPathId(progress.pathId) ? progress.pathId : 'foundations');
    setDailyAnswers(normalizeDaily(progress.dailyAnswers));
  }
  function applySession(session: SessionSnapshot) {
    identity.current++;
    rememberGuestMode(false);
    csrf.current = session.csrfToken;
    setUser(session.user);
    setExpired(false);
    setConnectionError('');
    setStorageError('');
    applyProgress(session.progress);
  }
  useEffect(() => {
    if (guestModeSelected()) return;
    const controller = new AbortController();
    initialRequest.current = controller;
    const version = identity.current;
    accountRequest<SessionSnapshot>('/account/session', {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
    })
      .then((session) => {
        if (version === identity.current) applySession(session);
      })
      .catch((error) => {
        if (
          version === identity.current &&
          !controller.signal.aborted &&
          !(error instanceof ApiError && error.status === 401)
        )
          setConnectionError('Account saving is unavailable. You can continue as a guest.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setInitializing(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!user) return;
    async function refresh() {
      if (pending.current || document.visibilityState === 'hidden') return;
      const version = identity.current;
      try {
        const session = await accountRequest<SessionSnapshot>('/account/session');
        if (version === identity.current && !pending.current) {
          csrf.current = session.csrfToken;
          applyProgress(session.progress);
          setExpired(false);
          setConnectionError('');
        }
      } catch (error) {
        if (version !== identity.current) return;
        if (error instanceof ApiError && error.status === 401) setExpired(true);
        else
          setConnectionError(
            'Unable to refresh account progress. Your last saved progress is shown.',
          );
      }
    }
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [user?.id]);
  async function mutate<T>(path: string, body: unknown): Promise<T> {
    if (expired) throw new Error('Your session expired. Sign in again to save progress.');
    if (pending.current) throw new Error('A save is already in progress. Please try again.');
    // Invalidate refreshes started before this write so they cannot restore stale progress.
    identity.current++;
    pending.current = true;
    setSaving(true);
    const version = identity.current;
    try {
      const data = await accountRequest<T>(path, { body, csrf: csrf.current });
      if (version !== identity.current) throw new Error('Your account changed. Please try again.');
      setConnectionError('');
      return data;
    } catch (error) {
      if (version === identity.current && error instanceof ApiError && error.status === 401)
        setExpired(true);
      throw error;
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }
  function saveGuest(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError('');
    } catch {
      setStorageError('Progress is available for this session. Browser storage is unavailable.');
    }
  }
  async function completeLesson(id: string, answer: number) {
    if (initializing) throw new Error('Checking your account. Please try again in a moment.');
    if (completed.includes(id)) return completed;
    if (!lessonAvailable(id, completed))
      throw new Error('Complete the required courses before starting this one.');
    if (user) {
      const progress = await mutate<SavedProgress>('/progress/lesson', { lesson_id: id, answer });
      applyProgress(progress);
      return normalizeProgress(progress.completedIds);
    }
    const ids = normalizeProgress([...completed, id]);
    setCompleted(ids);
    saveGuest(progressKey, ids);
    return ids;
  }
  async function choosePath(id: PathId) {
    if (initializing) throw new Error('Checking your account. Please try again in a moment.');
    if (user) {
      const progress = await mutate<SavedProgress>('/progress/path', { path_id: id });
      applyProgress(progress);
    } else {
      setPathId(id);
      try {
        localStorage.setItem(pathKey, id);
      } catch {
        setStorageError('This path choice is available for this session only.');
      }
    }
  }
  async function authenticate(
    mode: 'login' | 'register',
    fields: { name: string; email: string; password: string; importGuest: boolean },
  ) {
    const guestIds = user ? readProgress() : completed;
    const session = await accountRequest<SessionSnapshot>(`/account/${mode}`, {
      body: {
        name: fields.name,
        email: fields.email,
        password: fields.password,
        path_id: pathId,
        import_ids: fields.importGuest ? guestIds : [],
      },
    });
    applySession(session);
    setInitializing(false);
  }
  async function logout() {
    try {
      await accountRequest('/account/logout', { body: {}, csrf: csrf.current });
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) throw error;
    }
    continueAsGuest();
  }
  function continueAsGuest() {
    identity.current++;
    initialRequest.current?.abort();
    rememberGuestMode(true);
    csrf.current = '';
    // Keep unsaved guest work in memory; account work remains only in its account.
    if (user) {
      setCompleted(readProgress());
      setPathId(guestPath());
      setDailyAnswers(readDaily());
      setStorageError('');
    }
    setUser(null);
    setExpired(false);
    setInitializing(false);
    setConnectionError('');
  }
  async function importGuest() {
    const progress = await mutate<SavedProgress>('/progress/import', {
      completed_ids: readProgress(),
    });
    applyProgress(progress);
  }
  async function answerDaily(day: string, questionId: string, answer: number) {
    if (day !== quizDay()) throw new Error('A new daily quiz is ready. Refresh for today’s facts.');
    const question = dailyQuestions(day).find((question) => question.id === questionId);
    if (!question) throw new Error('Unknown daily question.');
    if (dailyAnswers.some((item) => item.day === day && item.questionId === questionId)) return;
    if (user) {
      const result = await mutate<{ progress: SavedProgress }>('/daily-quiz/answer', {
        day,
        question_id: questionId,
        answer,
      });
      applyProgress(result.progress);
    } else {
      const updated = normalizeDaily([
        ...dailyAnswers,
        { day, questionId, answer, correct: answer === question.correct },
      ]);
      setDailyAnswers(updated);
      saveGuest(dailyStorageKey, updated);
    }
  }
  return {
    user,
    completed,
    pathId,
    dailyAnswers,
    initializing,
    expired,
    saving,
    storageError,
    connectionError,
    completeLesson,
    answerDaily,
    choosePath,
    authenticate,
    continueAsGuest,
    logout,
    importGuest,
    guestCount: user ? readProgress().length : completed.length,
  };
}
type LearnerState = ReturnType<typeof useLearnerState>;
const LearnerContext = createContext<LearnerState | null>(null);
export function LearnerProvider({ children }: { children: ReactNode }) {
  const learner = useLearnerState();
  return <LearnerContext.Provider value={learner}>{children}</LearnerContext.Provider>;
}
export function useLearner() {
  const learner = useContext(LearnerContext);
  if (!learner) throw new Error('LearnerProvider is missing');
  return learner;
}
