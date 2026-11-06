import { useEffect, useId, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Award, Check, ChevronRight, LockKeyhole, Sparkles, X } from 'lucide-react';
import { courseById, lessons } from './curriculum';
import { LearningTrail } from './LearningTrail';
import type { Achievement } from './achievements';
import { learningPaths, pathCourses, courseFinished, missingPrerequisites, lessonAvailable, type PathId } from './learning-paths';
import './QuantumJourney.css';

type JourneyProps = {
  completed: string[];
  next: number;
  onOpen: (index: number) => void;
  achievements: Achievement[];
  pathId: PathId;
  onPathChange: (id: PathId) => void;
  saving: boolean;
  focusCourse: string | null;
  onFocused: () => void;
};
type Vector = [number, number, number];
const STATE_VECTORS: Vector[] = [
  [0, 0, 1], [1, 0, 0], [0, 1, 0], [0, 0, -1], [-1, 0, 0], [0, -1, 0],
  [0.58, 0.58, 0.58], [-0.68, 0.26, 0.68], [0.32, -0.92, 0.22],
];
const ARROW_COLORS = ['#8ef6ff', '#ffb4eb', '#bdb4ff', '#ffcf91', '#9ae9be', '#ffb7a9', '#9bc7ff'];

// A lightweight SVG version of the crystal Bloch sphere. The glass stays cyan;
// the state arrow alone changes color between course nodes.
function JourneyQubit({ index = 0, locked = false, complete = false }: { index?: number; locked?: boolean; complete?: boolean }) {
  const key = useId().replace(/:/g, '');
  const [vx, vy, vz] = STATE_VECTORS[index % STATE_VECTORS.length];
  const arrowColor = ARROW_COLORS[index % ARROW_COLORS.length];
  const x = 95 + vx * 59 + vy * 19;
  const y = 95 - vz * 61 - vy * 17;
  return (
    <svg className={`qj-qubit ${locked ? 'qj-qubit--locked' : ''}`} viewBox="0 0 190 190" aria-hidden="true">
      <defs>
        <radialGradient id={`qj-glass-${key}`} cx="40%" cy="37%" r="70%">
          <stop offset="0%" stopColor="#defeff" stopOpacity=".30" />
          <stop offset="50%" stopColor="#42dfff" stopOpacity=".16" />
          <stop offset="100%" stopColor="#0c5889" stopOpacity=".10" />
        </radialGradient>
        <filter id={`qj-glow-${key}`} x="-65%" y="-65%" width="230%" height="230%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <linearGradient id={`qj-arrow-${key}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={arrowColor} stopOpacity=".65" />
          <stop offset="100%" stopColor="#f4ffff" />
        </linearGradient>
      </defs>
      <circle cx="95" cy="95" r="72" fill={`url(#qj-glass-${key})`} stroke="#9eebfb" strokeOpacity=".72" strokeWidth="1.4" />
      <ellipse cx="95" cy="95" rx="72" ry="21" fill="none" stroke="#aafaff" strokeWidth="1.5" strokeOpacity=".74" />
      <ellipse cx="95" cy="95" rx="31" ry="72" fill="none" stroke="#7fdaed" strokeOpacity=".46" />
      <ellipse cx="95" cy="95" rx="57" ry="72" fill="none" stroke="#50b4d2" strokeOpacity=".22" />
      <ellipse cx="95" cy="95" rx="72" ry="35" fill="none" stroke="#51cbe6" strokeOpacity=".18" />
      <ellipse cx="95" cy="95" rx="75" ry="57" transform="rotate(-22 95 95)" fill="none" stroke="#a1efff" strokeOpacity=".35" />
      <ellipse cx="95" cy="95" rx="77" ry="61" transform="rotate(28 95 95)" fill="none" stroke="#a1efff" strokeOpacity=".22" />
      {Array.from({ length: 17 }, (_, j) => {
        const a = j * 2.39996;
        return <circle key={j} cx={95 + Math.cos(a) * (38 + j % 4 * 8)} cy={95 + Math.sin(a) * (33 + j % 5 * 7)} r={j % 4 === 0 ? 1.6 : 0.9} fill="#d3ffff" opacity={.24 + (j % 4) * .13} />;
      })}
      <path d={`M95 95 L${x} ${y}`} stroke={arrowColor} strokeWidth="9" opacity=".56" filter={`url(#qj-glow-${key})`} />
      <path d={`M95 95 L${x} ${y}`} stroke={`url(#qj-arrow-${key})`} strokeWidth="3.8" strokeLinecap="round" />
      <circle cx={x} cy={y} r="7" fill={arrowColor} opacity=".55" filter={`url(#qj-glow-${key})`} />
      <circle cx={x} cy={y} r="4.4" fill="#f2ffff" />
      <circle cx="95" cy="95" r="3.8" fill="#d9ffff" />
      {complete && <g><circle cx="152" cy="37" r="17" fill="#0b5963" stroke="#9bf9dd" strokeWidth="1.5" /><path d="M143 37 L150 44 L161 31" fill="none" stroke="#c8ffe9" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></g>}
    </svg>
  );
}

export function QuantumJourney({ completed, next, onOpen, achievements, pathId, onPathChange, saving, focusCourse, onFocused }: JourneyProps) {
  const [activePath, setActivePath] = useState<PathId | null>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [burst, setBurst] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const indices = useMemo(() => new Map(lessons.map((lesson, index) => [lesson.id, index])), []);
  const selected = learningPaths.find((p) => p.id === activePath);
  const required = activePath ? pathCourses(activePath).required : [];
  const finishedCount = required.filter((id) => courseFinished(id, completed)).length;
  const pathCompleted = required.length > 0 && finishedCount === required.length;
  const displayCourse = activeCourse ? courseById.get(activeCourse) : undefined;
  const displayCourseIndex = required.indexOf(activeCourse ?? '');
  const prerequisiteMissing = displayCourse ? missingPrerequisites(displayCourse.id, completed) : [];
  const sequenceBlocked = displayCourseIndex > 0 && required.slice(0, displayCourseIndex).some((id) => !courseFinished(id, completed));
  const courseLocked = prerequisiteMissing.length > 0 || sequenceBlocked;
  const courseAchievement = achievements.find((a) => a.courseId === activeCourse);

  useEffect(() => {
    if (!focusCourse) return;
    const owner = learningPaths.find((p) => pathCourses(p.id).required.includes(focusCourse));
    if (owner) {
      setShowCatalog(false);
      setActivePath(owner.id);
      setActiveCourse(focusCourse);
    }
    onFocused();
  }, [focusCourse, onFocused]);

  function openPath(id: PathId) {
    if (burst) return;
    setBurst(id);
    setReturning(false);
    // Purely visual transition; no progress values are reset.
    window.setTimeout(() => {
      setActivePath(id);
      setActiveCourse(null);
      setBurst(null);
    }, 540);
  }
  function closePath() {
    setReturning(true);
    window.setTimeout(() => {
      setActivePath(null);
      setActiveCourse(null);
      setReturning(false);
    }, 270);
  }
  return (
    <section className="qj" aria-label="Quantum learning paths">
      <div className="qj-view-switch">
        <span>LEARN YOUR WAY</span>
        <button type="button" aria-pressed={!showCatalog} className={!showCatalog ? "qj-view-active" : ""} onClick={() => setShowCatalog(false)}>Crystal journey</button>
        <button type="button" aria-pressed={showCatalog} className={showCatalog ? "qj-view-active" : ""} onClick={() => setShowCatalog(true)}>Full course catalog</button>
      </div>
      {showCatalog ? (
        <LearningTrail completed={completed} next={next} onOpen={onOpen} achievements={achievements} pathId={pathId} onPathChange={onPathChange} saving={saving} focusCourse={focusCourse} onFocused={onFocused} />
      ) : <>
      <div className="qj-heading">
        <div>
          <span className="qj-kicker"><Sparkles size={15} /> QUANTUMVERSE LEARNING</span>
          <h2>{selected ? selected.title : 'Choose your quantum journey'}</h2>
          <p>{selected ? selected.description : 'Seven interconnected learning paths. Choose a crystal to reveal the courses inside.'}</p>
        </div>
        {selected ? <button className="qj-back" onClick={closePath}><ArrowLeft size={17}/> All learning paths</button> :
          <span className="qj-counter">{learningPaths.length} learning paths</span>}
      </div>

      {!selected ? (
        <div className={`qj-certifications ${burst ? 'qj-certifications--bursting' : ''}`}>
          {learningPaths.map((path, index) => {
            const ids = pathCourses(path.id).required;
            const done = ids.filter((id) => courseFinished(id, completed)).length;
            const achieved = ids.length > 0 && done === ids.length;
            return <button key={path.id} type="button" className={`qj-certificate ${burst === path.id ? 'qj-certificate--burst' : ''}`}
              onClick={() => openPath(path.id)} aria-label={`${path.title}: ${path.description}. ${done} of ${ids.length} courses completed.`}>
              <span className="qj-certificate-visual"><JourneyQubit index={index} complete={achieved} />
                {burst === path.id && <span className="qj-shard-field" aria-hidden="true">{Array.from({length: 24},(_,i)=><i key={i} style={{'--a': `${i*15}deg`, '--d': `${60+i%5*12}px`} as CSSProperties}/>)}</span>}
              </span>
              <strong>{path.title.replace(/^Quantum /, '')}</strong>
              <span className="qj-cert-progress">{achieved ? 'Path completed' : `${done} / ${ids.length} courses`}</span>
              <span className="qj-preview"><b>{path.title}</b><span>{path.description}</span><small>Click to explore <ChevronRight size={13}/></small></span>
            </button>;
          })}
        </div>
      ) : (
        <div className={`qj-path-view ${returning ? 'qj-path-view--leaving' : ''}`}>
          <div className="qj-progress-panel">
            <span><Award size={19}/>{pathCompleted ? 'PATH COMPLETED' : `${finishedCount} OF ${required.length} COURSES COMPLETED`}</span>
            <div className="qj-progress-track"><div style={{width:`${required.length ? (finishedCount/required.length)*100 : 0}%`}} /></div>
            {pathCompleted ? <p><Check size={18}/> All required courses completed. This learning path is finished.</p> :
              <p>Follow the connected qubits from top to bottom. Finish a course's lessons to unlock the next.</p>}
<button
  className="qj-goal"
  disabled={saving || !activePath || pathId === activePath}
  onClick={() => {
    if (activePath) void onPathChange(activePath);
  }}
>              {pathId === activePath ? 'Your selected learning goal' : 'Set as my learning goal'}
            </button>
          </div>
          <div className="qj-trail-and-detail">
            <div className="qj-trail-track" aria-label={`${selected.title} course sequence`}>
              {required.map((id, index) => {
                const course = courseById.get(id)!;
                const done = courseFinished(id, completed);
                const blockedBySequence = index > 0 && required.slice(0,index).some((prev) => !courseFinished(prev,completed));
                const locked = blockedBySequence || missingPrerequisites(id,completed).length > 0;
                const active = activeCourse === id;
                return <div key={id} className={`qj-node-row qj-node-row--${index % 4} ${done ? 'qj-node-row--done' : ''} ${locked ? 'qj-node-row--locked' : ''}`} style={{animationDelay:`${Math.min(index*55,550)}ms`}}>
                  {index>0 && <span className="qj-node-connector" aria-hidden="true"/>}
                  <button type="button" className={`qj-course-node ${active ? 'qj-course-node--active' : ''}`} onClick={() => setActiveCourse(id)}
                    aria-expanded={active} aria-controls="qj-course-detail" title={course.description}>
                    <span className="qj-course-orb"><JourneyQubit index={index} locked={locked} complete={done} />
                      {locked && <span className="qj-lock"><LockKeyhole size={16}/></span>}
                    </span>
                    <strong>{course.title}</strong>
                    <small>{done ? 'Complete ✓' : locked ? 'Locked' : 'Ready to learn'}</small>
                    <span className="qj-node-tooltip">{course.description}</span>
                  </button>
                </div>;
              })}
              <div className={`qj-finish ${pathCompleted ? 'qj-finish--earned' : ''}`}><Award size={31}/><strong>{pathCompleted ? 'Learning path completed!' : 'Complete the path'}</strong><small>{pathCompleted ? selected.title : 'Finish every course above'}</small></div>
            </div>
            <aside className="qj-detail" id="qj-course-detail" aria-label="Selected course details">
              {displayCourse ? <>
                <div className="qj-detail-title"><span>COURSE {displayCourseIndex+1} / {required.length}</span><button aria-label="Close course detail" onClick={()=>setActiveCourse(null)}><X size={18}/></button></div>
                <h3>{displayCourse.title}</h3><p>{displayCourse.description}</p>
                <div className="qj-course-stats"><span>{displayCourse.lessons.length} lessons</span><span>{displayCourse.lessons.reduce((s,l)=>s+l.time,0)} min</span><span>{courseAchievement?.completed ?? 0}/{displayCourse.lessons.length} done</span></div>
                <div className="qj-progress-track"><div style={{width:`${courseAchievement?.percent ?? 0}%`}}/></div>
                {courseLocked && <p className="qj-prereq"><LockKeyhole size={15}/> Complete earlier courses to unlock these lessons.</p>}
                {courseAchievement?.earned && <p className="qj-earned"><Award size={17}/> Badge earned: {courseAchievement.title}</p>}
                <div className="qj-lessons">
                  {displayCourse.lessons.map((lesson, index) => {
                    const lessonIndex=indices.get(lesson.id);
                    const done=completed.includes(lesson.id);
                    const enabled=!courseLocked && lessonAvailable(lesson.id,completed) && !saving;
                    return <button key={lesson.id} disabled={!enabled || lessonIndex===undefined} onClick={()=>{if(lessonIndex!==undefined)onOpen(lessonIndex);}}>
                      <span className="qj-lesson-count">{done?<Check size={14}/>:index+1}</span>
                      <span><strong>{lesson.title}</strong><small>{lesson.time} min · {lesson.level}</small></span>
                      {enabled?<ChevronRight size={17}/>:<LockKeyhole size={15}/>}
                    </button>;
                  })}
                </div>
              </> : <div className="qj-empty-selection"><Sparkles size={33}/><h3>Pick a glowing qubit</h3><p>Select any course node to see its overview and lessons. Complete them to progress down the trail.</p></div>}
            </aside>
          </div>
        </div>
      )}
      <button type="button" className="qj-classic-toggle" onClick={()=>setShowOverview(v=>!v)}>
        {showOverview?'Hide learning path details':'How do certificates work?'} <ChevronRight size={15}/>
      </button>
      {showOverview && <p className="qj-help">Each path is built from the existing required courses. Completing every lesson in a course unlocks the next course in the visual trail and earns its course badge. Completing all required courses finishes the learning path. This is an in-app completion journey, not an externally accredited certificate.</p>}
      </>}
    </section>
  );
}
