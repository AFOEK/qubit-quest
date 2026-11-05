import { useEffect, useRef, useState } from 'react';
import { Cloud, LogOut, UserRound, X } from 'lucide-react';
import { useLearner } from './LearnerProvider';

export function AccountPanel({
  initialMode,
  onClose,
}: {
  initialMode: 'login' | 'register';
  onClose: () => void;
}) {
  const learner = useLearner();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState(initialMode),
    [name, setName] = useState(''),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [importGuest, setImportGuest] = useState(initialMode === 'register'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await action();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  const profile = learner.user && !learner.expired;
  return (
    <dialog
      ref={dialog}
      className="account-modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="account-title"
    >
      <button className="close icon-button" aria-label="Close account" onClick={onClose}>
        <X />
      </button>
      <span className="account-symbol">
        <UserRound size={28} />
      </span>
      <h2 id="account-title">
        {profile
          ? 'Your learning account'
          : mode === 'register'
            ? 'Make your journey yours.'
            : 'Welcome back.'}
      </h2>
      {profile ? (
        <>
          <p>
            Signed in as <strong>{learner.user!.name}</strong>
          </p>
          <p className="account-email">{learner.user!.email}</p>
          <div className="account-saved">
            <Cloud size={19} />
            <span>
              Your lessons, badges, path choice, and daily quizzes are saved to this account.
            </span>
          </div>
          {learner.guestCount > 0 && (
            <div className="guest-import">
              <p>This browser also has {learner.guestCount} guest lesson completions.</p>
              <button
                className="text-button"
                disabled={busy || learner.saving}
                onClick={() => run(learner.importGuest)}
              >
                Import guest progress
              </button>
            </div>
          )}
          <button
            className="primary"
            disabled={busy || learner.saving}
            onClick={() => run(learner.logout)}
          >
            <LogOut size={17} />
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </>
      ) : (
        <>
          <p>
            {learner.expired
              ? 'Your session expired. Sign in to sync your account, or continue as a guest.'
              : 'Sign-in is optional. An account saves your learning progress across devices.'}
          </p>
          <div className="auth-tabs" role="group" aria-label="Account action">
            {(['login', 'register'] as const).map((value) => (
              <button
                key={value}
                aria-pressed={mode === value}
                onClick={() => {
                  setMode(value);
                  setError('');
                  setPassword('');
                  setImportGuest(value === 'register');
                }}
              >
                {value === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void run(() => learner.authenticate(mode, { name, email, password, importGuest }));
            }}
          >
            {mode === 'register' && (
              <label className="auth-field">
                Display name
                <input
                  autoComplete="nickname"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={1}
                  maxLength={60}
                />
              </label>
            )}
            <label className="auth-field">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
              />
            </label>
            <label className="auth-field">
              Password
              <input
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                maxLength={128}
              />
              <small>
                {mode === 'register'
                  ? 'Use at least 8 characters.'
                  : 'Your password is case-sensitive.'}
              </small>
            </label>
            {learner.guestCount > 0 && (
              <label className="import-choice">
                <input
                  type="checkbox"
                  checked={importGuest}
                  onChange={(event) => setImportGuest(event.target.checked)}
                />
                <span>Bring {learner.guestCount} guest lesson completions into this account.</span>
              </label>
            )}
            <button className="primary" disabled={busy || learner.initializing}>
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </>
      )}
      <button
        className="text-button guest-mode-button"
        disabled={busy || learner.saving}
        onClick={() => {
          learner.continueAsGuest();
          onClose();
        }}
      >
        Continue as guest
      </button>
      <p className="account-guest-note">
        {learner.user
          ? 'Guest mode uses this browser’s history. Your account progress stays saved. Use Sign out to end your account session.'
          : 'Lessons, learning trails, achievements, and daily quizzes are available without an account. Guest progress stays in this browser.'}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </dialog>
  );
}
