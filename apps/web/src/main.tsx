import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import {
  FlaskConical,
  Glasses,
  Flame,
  Zap,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  Map,
  Atom,
  Menu,
  Trophy,
  Lightbulb,
  UserRound,
  Cloud,
} from 'lucide-react';
import { apply, initial, describe, type GateName } from './quantum';
import { lessons, courseById, type Lab } from './curriculum';
import { LearningTrail } from './LearningTrail';
import { LessonDialog } from './LessonDialog';
import { XP_PER_LESSON } from './progress';
import { LearnerProvider, useLearner } from './LearnerProvider';
import { AccountPanel } from './AccountPanel';
import { DailyQuizView } from './DailyQuizView';
import { QuantumMascot } from './mascot/QuantumMascot';
import { MascotProvider, useMascot } from './mascot/MascotProvider';
import { observeLessonSave } from './mascot/learning-events';
import {
  learningPaths,
  lessonAvailable,
  missingPrerequisites,
  nextPathLesson,
  type PathId,
} from './learning-paths';
import { getLearningProgress, getRewardNotice, type RewardNotice } from './achievements';
import { AchievementsPage, LearningSpark, RewardToast } from './AchievementViews';
import './style.css';
const Immersive = lazy(() => import('./vr'));
const gates: GateName[] = ['H', 'X', 'Y', 'Z', 'S', 'T'];
type Result = {
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  amplitudes: { real: number; imag: number }[];
  explanation?: string;
  circuit: string;
  energy?: number;
  exact_ground_energy?: number;
  expected_cut?: number;
};
function Sphere({ x, y, z, large = false }: { x: number; y: number; z: number; large?: boolean }) {
  const px = 150 + x * 92 - y * 38,
    py = 147 - z * 95 + y * 23;
  return (
    <svg
      className={large ? 'sphere large' : 'sphere'}
      viewBox="0 0 300 300"
      role="img"
      aria-label={`Bloch vector: x ${x.toFixed(2)}, y ${y.toFixed(2)}, z ${z.toFixed(2)}`}
    >
      <defs>
        <radialGradient id="orb">
          <stop stopColor="#e7fff1" />
          <stop offset="1" stopColor="#a1d3bd" stopOpacity=".32" />
        </radialGradient>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6" fill="#205e4b" />
        </marker>
      </defs>
      <circle cx="150" cy="147" r="101" fill="url(#orb)" stroke="#80b69f" />
      <ellipse
        cx="150"
        cy="147"
        rx="101"
        ry="29"
        fill="none"
        stroke="#80b69f"
        strokeDasharray="4 5"
      />
      <ellipse cx="150" cy="147" rx="37" ry="101" fill="none" stroke="#80b69f" />
      <path d="M150 32V262M35 147H265M99 177L201 117" stroke="#8db6a5" strokeWidth="1" />
      <path d={`M150 147L${px} ${py}`} stroke="#205e4b" strokeWidth="4" markerEnd="url(#arrow)" />
      <circle cx={px} cy={py} r="8" fill="#275f4d" />
      <circle cx={px - 2} cy={py - 2} r="2" fill="white" />
      <g fill="#3a6657" fontSize="14" fontFamily="sans-serif">
        <text x="138" y="22">
          |0⟩
        </text>
        <text x="139" y="282">
          |1⟩
        </text>
        <text x="271" y="152">
          x
        </text>
        <text x="203" y="112">
          y
        </text>
      </g>
    </svg>
  );
}
function App() {
  const learner = useLearner();
  const mascot = useMascot();
  const { completed, storageError } = learner;
  const requestVersion = useRef(0);
  const [page, setPage] = useState('learn'),
    [lesson, setLesson] = useState<number | null>(null),
    [sequence, setSequence] = useState<GateName[]>(['H']),
    [tab, setTab] = useState('gates'),
    [algorithm, setAlgorithm] = useState('grover'),
    [angle, setAngle] = useState(Math.PI / 2),
    [result, setResult] = useState<Result | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [vr, setVr] = useState(false),
    [mobile, setMobile] = useState(false),
    [notice, setNotice] = useState<RewardNotice | null>(null),
    [accountOpen, setAccountOpen] = useState(false),
    [accountMode, setAccountMode] = useState<'login' | 'register'>('login'),
    [lessonSaving, setLessonSaving] = useState(false),
    [lessonError, setLessonError] = useState(''),
    [learningMessage, setLearningMessage] = useState(''),
    [focusCourse, setFocusCourse] = useState<string | null>(null);
  useEffect(() => {
    requestVersion.current += 1;
    setBusy(false);
    setResult(null);
    setError('');
  }, [sequence, tab, algorithm, angle]);
  useEffect(() => {
    setNotice(null);
    setLesson(null);
    setLessonError('');
    setLearningMessage('');
  }, [learner.user?.id]);

  const state = sequence.reduce((s, g) => apply(s, g), initial()),
    d = describe(state),
    next = nextPathLesson(learner.pathId, completed);
  const pathTitle =
    learningPaths.find((path) => path.id === learner.pathId)?.title ?? 'Full learning trail';
  function openAccount(mode: 'login' | 'register' = 'login') {
    setAccountMode(mode);
    setAccountOpen(true);
  }
  async function choosePath(id: PathId) {
    setLearningMessage('');
    try {
      await learner.choosePath(id);
    } catch (error) {
      setLearningMessage(error instanceof Error ? error.message : 'Could not save your path.');
    }
  }
  const rewards = getLearningProgress(completed);
  function viewAchievements() {
    setNotice(null);
    setPage('achievements');
    setMobile(false);
  }
  function openLesson(i: number) {
    if (lessonSaving) return;
    const item = lessons[i];
    if (!item) return;
    setNotice(null);
    setLessonError('');
    if (!lessonAvailable(item.id, completed)) {
      const missing = missingPrerequisites(item.courseId, completed);
      setLearningMessage(
        `Finish ${missing.map((id) => courseById.get(id)?.title).join(', ')} to unlock ${item.unit}.`,
      );
      setLesson(null);
      setPage('learn');
      setFocusCourse(missing[0] ?? null);
      return;
    }
    setLearningMessage('');
    mascot.reset();
    setLesson(i);
  }
  async function complete(answer: number) {
    if (lesson === null) return;
    if (completed.includes(lessons[lesson].id)) {
      setLesson(null);
      return;
    }
    setLessonSaving(true);
    setLessonError('');
    try {
      const updated = await observeLessonSave(
        () => learner.completeLesson(lessons[lesson].id, answer),
        completed,
        lessons[lesson].id,
        mascot.react,
      );
      const reward = getRewardNotice(rewards, getLearningProgress(updated));
      if (reward) setNotice(reward);
      setLesson(null);
    } catch (error) {
      setLessonError(
        error instanceof Error ? error.message : 'Could not save your lesson. Try again.',
      );
    } finally {
      setLessonSaving(false);
    }
  }
  async function run() {
    const request = ++requestVersion.current;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`/api/${tab === 'gates' ? 'simulate' : 'algorithm'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          tab === 'gates'
            ? { gates: sequence.map((name) => ({ name: name.toLowerCase() })) }
            : { name: algorithm, parameter: angle },
        ),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw Error('Simulation failed. Check the API terminal and try again.');
      const data = await response.json();
      if (request === requestVersion.current) setResult(data);
    } catch (e) {
      if (request !== requestVersion.current) return;
      setError(
        e instanceof TypeError
          ? 'Start the Qiskit API on port 8000 to run this experiment.'
          : e instanceof Error
            ? e.message
            : 'Could not run simulation.',
      );
    } finally {
      if (request === requestVersion.current) setBusy(false);
    }
  }

  function changeSequence(s: GateName[]) {
    setSequence(s);
    setResult(null);
    setError('');
  }
  function launchLab(lab: Lab) {
    if (lessonSaving) return;
    setLesson(null);
    setPage('lab');
    setResult(null);
    setError('');
    if (lab.kind === 'gates') {
      setTab('gates');
      changeSequence([...lab.sequence]);
    } else {
      setTab('algorithms');
      setAlgorithm(lab.name);
      setAngle(Math.PI / 2);
    }
  }
  const nav = [
    { id: 'learn', label: 'Learning trail', Icon: Map },
    { id: 'achievements', label: 'Achievements', Icon: Trophy },
    { id: 'daily', label: 'Daily quiz', Icon: Lightbulb },
    { id: 'lab', label: 'Quantum lab', Icon: FlaskConical },
    { id: 'immersive', label: 'Immersive lab', Icon: Glasses },
  ];
  return (
    <div className="app">
      <aside
        inert={lesson !== null || vr || accountOpen}
        className={mobile ? 'sidebar visible' : 'sidebar'}
      >
        <a href="#" className="brand" onClick={() => setPage('learn')}>
          <span className="brand-icon">
            <Atom size={28} />
          </span>
          <span>
            qubit<span className="brand-light">quest</span>
            <small>A little curiosity. A quantum leap.</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={page === id ? 'nav active' : 'nav'}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => {
                setPage(id);
                setMobile(false);
                setNotice(null);
              }}
            >
              <Icon size={21} />
              {label}
              {id === 'achievements' && (
                <span className="nav-count">
                  {rewards.earnedCount}/{rewards.totalCourses}
                </span>
              )}
              {id === 'immersive' && <span className="tiny">VR</span>}
            </button>
          ))}
        </nav>
        <div className="bd-cat-sidebar">
          <QuantumMascot layout="desktop" hidden={lesson !== null || vr || accountOpen} />
        </div>
        <button
          className="side-bottom learner-profile"
          onClick={() => openAccount()}
          disabled={learner.initializing || learner.saving}
        >
          <div className="avatar">{learner.user?.name[0]?.toUpperCase() ?? 'Q'}</div>
          <div>
            <span>{learner.user?.name ?? 'Guest explorer'}</span>
            <small>
              {learner.initializing
                ? 'Checking account…'
                : learner.expired
                  ? 'Session expired · Sign in'
                  : learner.user
                    ? `${rewards.tier.name} · Your account`
                    : 'Guest progress · Sign in'}
            </small>
          </div>
        </button>
      </aside>
      <div className="workspace" inert={lesson !== null || vr || accountOpen}>
        <header>
          <button
            className="mobile-menu icon-button"
            aria-label="Toggle navigation"
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </button>
          <span className="breadcrumb">
            Your quantum journey <ChevronRight size={14} />{' '}
            <b>{nav.find((item) => item.id === page)?.label}</b>
          </span>
          <div className="stats">
            <span title="Completed lessons">
              <Flame size={19} /> {completed.length} <small>lessons</small>
            </span>
            <span>
              <Zap size={19} /> {rewards.xp} <small>XP</small>
            </span>
            <button
              className="avatar small account-avatar"
              aria-label={learner.user ? 'Open your account' : 'Sign in or register'}
              title={learner.user ? learner.user.name : 'Sign in or register'}
              onClick={() => openAccount()}
              disabled={learner.initializing || learner.saving}
            >
              {learner.user?.name[0]?.toUpperCase() ?? <UserRound size={18} />}
            </button>
          </div>
        </header>
        <div className="bd-cat-mobile">
          <QuantumMascot
            layout="mobile"
            hidden={lesson !== null || vr || accountOpen || mobile || page === 'daily'}
          />
        </div>
        <main>
          {learner.initializing && (
            <div className="account-status account-choice" role="status">
              <span>Checking for a saved account. You can start learning as a guest.</span>
              <button className="text-button" onClick={learner.continueAsGuest}>
                Continue as guest
              </button>
            </div>
          )}
          {learner.connectionError && (
            <div className="account-status account-choice" role="status">
              <span>{learner.connectionError}</span>
              {learner.user && (
                <button
                  className="text-button"
                  disabled={learner.saving}
                  onClick={learner.continueAsGuest}
                >
                  Continue as guest
                </button>
              )}
            </div>
          )}
          {learner.expired && (
            <div className="account-expired" role="alert">
              <span>
                Your session expired. Sign in to sync your account, or keep learning as a guest.
              </span>
              <button className="text-button" onClick={() => openAccount()}>
                Sign in
              </button>
              <button
                className="text-button"
                disabled={learner.saving}
                onClick={learner.continueAsGuest}
              >
                Continue as guest
              </button>
            </div>
          )}
          {learningMessage && (
            <p className="learning-message" role="status">
              {learningMessage}
            </p>
          )}
          {storageError && (
            <p role="status" className="storage-warning">
              {storageError}
            </p>
          )}
          {page === 'learn' ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="hello">Hey, explorer ✺</p>
                  <h1>Make quantum click.</h1>
                  <p>
                    From the math to quantum mechanics, then into real applications. No physics
                    degree required.
                  </p>
                </div>
                <span className="edition">
                  Fall Fest ’26
                  <br />
                  <b>Learning by doing</b>
                </span>
              </div>
              {!learner.user && !learner.initializing && (
                <div className="account-save-banner">
                  <Cloud size={25} />
                  <div>
                    <strong>No account needed. Start exploring.</strong>
                    <p>
                      Guest progress is saved in this browser. An optional account keeps your path,
                      lessons, and daily quizzes across devices.
                    </p>
                  </div>
                  <button className="primary" onClick={() => openAccount('register')}>
                    Create account
                  </button>
                  <button className="text-button" onClick={() => openAccount()}>
                    Sign in
                  </button>
                </div>
              )}
              <section className="hero">
                <div className="hero-copy">
                  <span className="pill">
                    <span />
                    Your next discovery
                  </span>
                  <h2>{next < 0 ? `${pathTitle} complete.` : lessons[next].title}</h2>
                  <p>
                    {next < 0
                      ? 'You’ve finished the required lessons in this trail. Explore optional branches, review a lesson, or choose another goal.'
                      : courseById.get(lessons[next].courseId)!.description}
                  </p>
                  <button className="primary" onClick={() => openLesson(next < 0 ? 0 : next)}>
                    {next < 0
                      ? 'Review a lesson'
                      : completed.length
                        ? 'Continue learning'
                        : 'Start your journey'}
                    <ArrowRight size={18} />
                  </button>
                  <div className="hero-meta">
                    <span>◷ {next < 0 ? lessons[0].time : lessons[next].time} min</span>
                    <span>{next < 0 ? '✧ Required trail complete' : `✧ +${XP_PER_LESSON} XP`}</span>
                    <span>{next < 0 ? 'Review at your pace' : lessons[next].unit}</span>
                  </div>
                </div>
                <div className="hero-art">
                  <span className="floating-label">a world of possibilities</span>
                  <Sphere {...describe(apply(initial(), 'H'))} large />
                  <span className="ket-label">α|0⟩ + β|1⟩</span>
                  <span className="art-spark">✧</span>
                </div>
              </section>
              <div className="trail-layout">
                <LearningTrail
                  completed={completed}
                  next={next}
                  onOpen={openLesson}
                  achievements={rewards.achievements}
                  pathId={learner.pathId}
                  onPathChange={(id) => void choosePath(id)}
                  saving={learner.saving || learner.initializing}
                  focusCourse={focusCourse}
                  onFocused={() => setFocusCourse(null)}
                />
                <aside className="right-rail">
                  <LearningSpark
                    progress={rewards}
                    onView={viewAchievements}
                    savingAvailable={!storageError}
                    accountSaved={Boolean(learner.user)}
                    saving={learner.saving}
                  />
                  <div className="lab-invite">
                    <span className="mini-orbit">✳</span>
                    <h3>
                      What if you
                      <br />
                      could see a qubit?
                    </h3>
                    <p>Flip a gate. Watch the state change. Let your intuition take over.</p>
                    <button onClick={() => setPage('lab')}>
                      Open quantum lab <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="vr-invite">
                    <Glasses size={29} />
                    <h3>A new perspective</h3>
                    <p>Step inside the Bloch sphere with immersive VR.</p>
                    <button onClick={() => setPage('immersive')}>
                      Explore the VR lab <ArrowRight size={16} />
                    </button>
                    <span>Built for curiosity · Quest 3</span>
                  </div>
                </aside>
              </div>
            </>
          ) : page === 'daily' ? (
            <DailyQuizView
              onSignIn={() => openAccount()}
              mascotHidden={lesson !== null || vr || accountOpen || mobile}
            />
          ) : page === 'achievements' ? (
            <AchievementsPage
              progress={rewards}
              onOpenLesson={(id) => {
                const index = lessons.findIndex((item) => item.id === id);
                if (index >= 0) {
                  openLesson(index);
                }
              }}
            />
          ) : page === 'lab' ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="hello">Observe. Predict. Experiment.</p>
                  <h1>Your quantum playground.</h1>
                  <p>Make a change and discover what happens to the state.</p>
                </div>
              </div>
              <div className="tabs">
                <button
                  className={tab === 'gates' ? 'selected' : ''}
                  onClick={() => {
                    setTab('gates');
                    setResult(null);
                    setError('');
                  }}
                >
                  Gate explorer
                </button>
                <button
                  className={tab === 'algorithms' ? 'selected' : ''}
                  onClick={() => {
                    setTab('algorithms');
                    setResult(null);
                    setError('');
                  }}
                >
                  Algorithm experiments
                </button>
              </div>
              <div className="lab-grid">
                <section className="panel">
                  <h2>
                    {tab === 'gates' ? 'One qubit. Many possibilities.' : 'From idea to algorithm'}
                  </h2>
                  {tab === 'gates' ? (
                    <>
                      <Sphere {...d} large />
                      <div className="probabilities">
                        {[
                          ['0', d.p0],
                          ['1', d.p1],
                        ].map(([label, p]) => (
                          <div key={String(label)}>
                            <span>|{label}⟩</span>
                            <div>
                              <i style={{ width: `${Number(p) * 100}%` }} />
                            </div>
                            <strong>{(Number(p) * 100).toFixed(1)}%</strong>
                          </div>
                        ))}
                      </div>
                      <p className="muted">Exact browser statevector • Z-basis probabilities</p>
                      <p>
                        A Bloch sphere depicts a single qubit’s state. The arrow is not a particle
                        moving in space.
                      </p>
                    </>
                  ) : (
                    <>
                      <label className="field">
                        Choose an experiment
                        <select
                          value={algorithm}
                          onChange={(e) => {
                            setAlgorithm(e.target.value);
                            setResult(null);
                          }}
                        >
                          <option value="grover">Grover · search four items</option>
                          <option value="qft">QFT · discover phase</option>
                          <option value="bell">Bell pair · entanglement</option>
                          <option value="optimization">QAOA · single-edge MaxCut</option>
                          <option value="chemistry">Variational energy · toy spin model</option>
                        </select>
                      </label>
                      {['optimization', 'chemistry'].includes(algorithm) && (
                        <label className="field">
                          Circuit angle: {angle.toFixed(2)} radians
                          <input
                            type="range"
                            min="0"
                            max={2 * Math.PI}
                            step="0.02"
                            value={angle}
                            onChange={(e) => {
                              setAngle(Number(e.target.value));
                              setResult(null);
                            }}
                          />
                        </label>
                      )}
                      <div className="algorithm-art">
                        <Atom size={80} />
                        <p>
                          Real circuits.
                          <br />
                          Real Qiskit simulations.
                        </p>
                      </div>
                      <p>
                        These small, ideal simulations teach algorithm mechanics. They do not
                        demonstrate practical quantum advantage.
                      </p>
                    </>
                  )}
                </section>
                <section className="panel">
                  <h2>{tab === 'gates' ? 'Build your experiment' : 'Run the experiment'}</h2>
                  {tab === 'gates' ? (
                    <>
                      <p>Start in |0⟩. Add gates from left to right.</p>
                      <div className="gate-buttons">
                        {gates.map((g) => (
                          <button
                            key={g}
                            disabled={sequence.length >= 32}
                            onClick={() => changeSequence([...sequence, g])}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      <div className="circuit" aria-label="Circuit in execution order">
                        <span>|0⟩</span>
                        {sequence.map((g, i) => (
                          <button
                            key={i}
                            title={`Remove gate ${i + 1}`}
                            onClick={() => changeSequence(sequence.filter((_, j) => i !== j))}
                          >
                            {g}
                          </button>
                        ))}
                        <span>→</span>
                      </div>
                      <button className="text-button" onClick={() => changeSequence([])}>
                        <RotateCcw size={15} />
                        Reset to |0⟩
                      </button>
                      <div className="tip">
                        <strong>Try this</strong>
                        <p>
                          Apply H twice. A quantum superposition can interfere back into a certain
                          outcome. Then try H, S: same probabilities, different phase.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p>
                      Qiskit prepares and evolves a two-qubit circuit, then samples 1,024
                      measurements. Exact probabilities and complex amplitudes appear alongside
                      sampled counts.
                    </p>
                  )}
                  <button className="primary" disabled={busy} onClick={run}>
                    {busy ? 'Simulating…' : 'Run with Qiskit'}
                    <FlaskConical size={18} />
                  </button>
                  {error && (
                    <p role="alert" className="error">
                      {error}
                    </p>
                  )}
                  {result && (
                    <div className="results" aria-live="polite">
                      <h3>Simulation results</h3>
                      {result.explanation && <p>{result.explanation}</p>}
                      {Object.entries(result.probabilities)
                        .sort(([a], [b]) => parseInt(a, 2) - parseInt(b, 2))
                        .map(([key, p]) => (
                          <div className="result-row" key={key}>
                            <code>|{key}⟩</code>
                            <meter min="0" max="1" value={p} />
                            <strong>{(p * 100).toFixed(1)}%</strong>
                            <small>{result.counts[key] || 0} shots</small>
                          </div>
                        ))}
                      {result.energy !== undefined && (
                        <p>
                          Energy: <b>{result.energy.toFixed(4)}</b> · Exact ground:{' '}
                          {result.exact_ground_energy?.toFixed(4)} (arbitrary units)
                        </p>
                      )}
                      {result.expected_cut !== undefined && (
                        <p>
                          Expected cut: <b>{result.expected_cut.toFixed(4)}</b> / 1
                        </p>
                      )}
                      <details>
                        <summary>Complex amplitudes and circuit</summary>
                        <p>Basis order: q₁q₀ for two qubits. The rightmost bit is qubit 0.</p>
                        {result.amplitudes.map((a, i) => (
                          <p key={i}>
                            <code>
                              {i}: {a.real.toFixed(3)} {a.imag < 0 ? '−' : '+'}{' '}
                              {Math.abs(a.imag).toFixed(3)}i
                            </code>
                          </p>
                        ))}
                        <pre>{result.circuit}</pre>
                      </details>
                    </div>
                  )}
                </section>
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <p className="hello">Change your point of view</p>
                  <h1>Quantum, all around you.</h1>
                  <p>Explore the same qubit state in an immersive 3D lab.</p>
                </div>
              </div>
              <section className="immersive-hero">
                <div>
                  <Glasses size={48} />
                  <h2>Step into the Bloch sphere.</h2>
                  <p>
                    Inspect a qubit in 3D. Apply H, X, and S to see how its state changes. A
                    supported headset can enter WebXR; the Unity starter is included for native
                    Quest 3 development.
                  </p>
                  <button className="primary" onClick={() => setVr(true)}>
                    Open immersive lab <ArrowRight size={18} />
                  </button>
                  <p className="muted">Headset mode needs WebXR and HTTPS or localhost.</p>
                </div>
                <Sphere {...d} large />
              </section>
              <section className="panel vr-info">
                <h3>A visual model, grounded in the math.</h3>
                <p>
                  Superposition describes amplitudes of possible outcomes. Measurement yields one
                  outcome. The sphere is a state-space visualization, not a picture of a qubit being
                  in two physical places.
                </p>
                <p>
                  Native Unity setup and the shared simulation contract live in the repository’s{' '}
                  <code>apps/unity</code> and <code>docs</code> folders.
                </p>
              </section>
            </>
          )}
          <footer>
            <span className="footer-brand">✳ qubitquest</span>
            <span>Made for curious minds. Built with Qiskit.</span>
            <a href="https://github.com/minhajuddinm/qubit-quest" target="_blank" rel="noreferrer">
              Project on GitHub
            </a>
          </footer>
        </main>
      </div>
      {notice && lesson === null && !vr && (
        <RewardToast notice={notice} onClose={() => setNotice(null)} onView={viewAchievements} />
      )}
      {accountOpen && (
        <AccountPanel initialMode={accountMode} onClose={() => setAccountOpen(false)} />
      )}
      {lesson !== null && (
        <LessonDialog
          key={lessons[lesson].id}
          lesson={lessons[lesson]}
          courseId={lessons[lesson].courseId}
          completed={completed.includes(lessons[lesson].id)}
          onClose={() => {
            if (!lessonSaving) {
              mascot.reset();
              setLesson(null);
            }
          }}
          onComplete={(answer) => void complete(answer)}
          saving={lessonSaving || learner.initializing}
          saveError={lessonError}
          onLab={launchLab}
          onNavigate={(id) => {
            const index = lessons.findIndex((item) => item.id === id);
            if (index >= 0) openLesson(index);
          }}
        />
      )}
      {vr && (
        <Suspense
          fallback={
            <div className="modal-backdrop">
              <p>Opening the immersive lab…</p>
            </div>
          }
        >
          <Immersive onClose={() => setVr(false)} />
        </Suspense>
      )}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LearnerProvider>
      <MascotProvider>
        <App />
      </MascotProvider>
    </LearnerProvider>
  </React.StrictMode>,
);
