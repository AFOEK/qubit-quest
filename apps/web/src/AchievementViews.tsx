import { useState } from 'react';
import {
  ArrowRight,
  Award,
  Crown,
  Diamond,
  Shield,
  Sparkles,
  Check,
  ChevronDown,
  LockKeyhole,
  Search,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { journeyTiers, type LearningProgress, type RewardNotice } from './achievements';
import { XP_PER_LESSON } from './progress';
import './AchievementGallery.css';

export function LearningSpark({
  progress,
  onView,
  savingAvailable = true,
  accountSaved = false,
  saving = false,
}: {
  progress: LearningProgress;
  onView: () => void;
  savingAvailable?: boolean;
  accountSaved?: boolean;
  saving?: boolean;
}) {
  const target = progress.nextMilestone ?? progress.milestones.at(-1);
  return (
    <div className="goal learning-spark">
      <div className="section-title">
        <h3>Your learning spark</h3>
        <Zap size={21} />
      </div>
      <p>
        {progress.totalCourses} courses · {progress.totalLessons} lessons.
        <br />
        Every lesson moves you forward.
      </p>
      <div
        className="goal-track"
        role="progressbar"
        aria-label={progress.allComplete ? 'Total learning XP' : 'XP toward your next milestone'}
        aria-valuemin={0}
        aria-valuemax={target?.xp ?? 1}
        aria-valuenow={progress.xp}
      >
        <span style={{ width: `${target?.xp ? (100 * progress.xp) / target.xp : 0}%` }} />
      </div>
      <div className="goal-caption">
        <strong>
          {progress.xp.toLocaleString()} / {target?.xp.toLocaleString() ?? 0} XP
        </strong>
        <span>{progress.allComplete ? 'Trail complete' : `Next: ${target?.lessons} lessons`}</span>
      </div>
      <p className="spark-next">
        {progress.allComplete
          ? 'Every lesson and course badge is complete.'
          : `${(target?.lessons ?? 0) - progress.completedLessons} more ${(target?.lessons ?? 0) - progress.completedLessons === 1 ? 'lesson' : 'lessons'} to your next milestone.`}
      </p>
      <div className="spark-achievements">
        <span className={`tier-pill tier-${progress.tier.id}`}>
          <Award size={14} />
          {progress.tier.name}
        </span>
        <span>
          {progress.earnedCount} / {progress.totalCourses} badges
        </span>
      </div>
      {progress.nextAchievement && (
        <p className="spark-badge">
          <Trophy size={15} />
          <span>
            Next badge<strong>{progress.nextAchievement.title}</strong>
          </span>
        </p>
      )}
      <button className="spark-view" onClick={onView}>
        View achievements <ArrowRight size={15} />
      </button>
      <small>
        {saving
          ? 'Saving to your account…'
          : accountSaved
            ? 'Progress is saved to your account.'
            : savingAvailable
              ? 'Progress is saved on this browser.'
              : 'Available for this session. Browser saving is unavailable.'}
      </small>
    </div>
  );
}

const rankIcons = {
  bronze: Shield,
  silver: Diamond,
  gold: Crown,
  platinum: Sparkles,
} as const;

export function AchievementsPage({
  progress,
  onOpenLesson,
}: {
  progress: LearningProgress;
  onOpenLesson: (id: string) => void;
}) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [pendingCourse, setPendingCourse] = useState<LearningProgress['achievements'][number] | null>(null);
  const normalize = (value: string) => value.toLocaleLowerCase().replace(/[‐‑‒–—−]/g, '-');
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const shown = progress.achievements.filter((achievement) => {
    const text = normalize(`${achievement.title} ${achievement.courseTitle}`);
    return (
      terms.every((term) => text.includes(term)) &&
      (filter === 'all' ||
        (filter === 'earned' && achievement.earned) ||
        (filter === 'progress' && !achievement.earned && achievement.completed > 0) ||
        (filter === 'locked' && achievement.completed === 0))
    );
  });
  return (
    <div className="qv-achievements">
      <div className="page-heading">
        <div>
          <p className="hello">Every course counts.</p>
          <h1>Your achievements.</h1>
          <p>Collect course badges, reach the next rank, and see how far you've come.</p>
        </div>
      </div>
      <section className={`achievement-hero tier-${progress.tier.id}`} aria-labelledby="journey-tier-title">
        <div className="journey-medal" aria-hidden="true"><Award size={46} /></div>
        <div className="journey-copy">
          <span className="reward-eyebrow">Your journey tier</span>
          <h2 id="journey-tier-title">{progress.tier.name}</h2>
          <p>{progress.nextTier
            ? `${progress.nextTier.courses - progress.earnedCount} more ${progress.nextTier.courses - progress.earnedCount === 1 ? 'course' : 'courses'} to ${progress.nextTier.name}.`
            : 'Highest tier unlocked. Every course badge is yours.'}</p>
          <div className="journey-progress" role="progressbar"
            aria-label="Journey tier progress" aria-valuemin={0}
            aria-valuemax={progress.nextTier?.courses ?? progress.totalCourses}
            aria-valuenow={progress.earnedCount}>
            <span style={{ width: `${(100 * progress.earnedCount) / (progress.nextTier?.courses ?? progress.totalCourses)}%` }} />
          </div>
          <small>{progress.earnedCount} / {progress.nextTier?.courses ?? progress.totalCourses} courses
            {progress.nextTier ? ` toward ${progress.nextTier.name}` : ' complete'}</small>
        </div>
        <div className="achievement-stats">
          <div><strong>{progress.xp.toLocaleString()}</strong><span>XP earned</span></div>
          <div><strong>{progress.earnedCount} / {progress.totalCourses}</strong><span>Course badges</span></div>
          <div><strong>{progress.completedLessons} / {progress.totalLessons}</strong><span>Lessons complete</span></div>
        </div>
      </section>

      <section className="qv-rank-gallery" aria-labelledby="qv-rank-title">
        <div className="qv-gallery-heading">
          <div><h2 id="qv-rank-title">Journey ranks</h2><p>Complete courses to unlock each rank.</p></div>
        </div>
        <div className="qv-rank-row">
          {journeyTiers.filter((tier) => tier.courses > 0).map((tier) => {
            const reached = progress.earnedCount >= tier.courses;
            const Icon = rankIcons[tier.id as keyof typeof rankIcons];
            return (
              <div key={tier.id} className={`qv-rank qv-rank-${tier.id} ${reached ? 'is-reached' : ''}`}>
                <div className="qv-rank-emblem" aria-hidden="true">
                  <svg className="qv-rank-frame" viewBox="0 0 120 138" focusable="false">
                    <path className="qv-rank-halo" d="M60 5 104 30 112 85 60 132 8 85 16 30Z" />
                    <path className="qv-rank-inner" d="M60 18 94 37 101 81 60 116 19 81 26 37Z" />
                    <path className="qv-rank-detail" d="M60 15V3M14 30 3 23M106 30 117 23M60 134v-10" />
                  </svg>
                  <Icon size={49} strokeWidth={1.65} />
                  {reached && <span className="qv-rank-check"><Check size={13}/></span>}
                </div>
                <h3>{tier.name}</h3>
                <p>{reached ? 'Rank unlocked' : `${tier.courses - progress.earnedCount} more ${tier.courses - progress.earnedCount === 1 ? 'course' : 'courses'} to unlock`}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="qv-xp-panel" aria-labelledby="qv-xp-title">
        <div className="qv-gallery-heading">
          <div><h2 id="qv-xp-title">Learning milestones</h2>
            <p>{progress.milestones.filter((m) => m.reached).length} of {progress.milestones.length} reached · {XP_PER_LESSON} XP per lesson</p></div>
          <Zap size={24} aria-hidden="true" />
        </div>
        <ol className="qv-xp-grid">
          {progress.milestones.map((milestone) => {
            const next = progress.nextMilestone?.id === milestone.id;
            return <li key={milestone.id} className={`${milestone.reached ? 'is-reached' : ''} ${next ? 'is-next' : ''}`}
              aria-current={next ? 'step' : undefined}>
              <span className="qv-xp-symbol" aria-hidden="true">{milestone.reached ? <Check size={26} /> : <Zap size={26} />}</span>
              <strong>{milestone.xp.toLocaleString()} XP</strong>
              <small>{milestone.lessons} lessons{milestone.final ? ' · Final' : ''}</small>
              <span className="qv-xp-status">{milestone.reached ? 'Reached' : next ? 'Up next' : 'Ahead'}</span>
            </li>;
          })}
        </ol>
      </section>

      <section className="badge-collection qv-badge-collection" aria-labelledby="badges-title">
        <div className="section-title">
          <h2 id="badges-title">Your course badges</h2>
          <span>{progress.earnedCount} / {progress.totalCourses} earned</span>
        </div>
        <div className="badge-controls">
          <div className="course-filters" role="group" aria-label="Filter achievements">
            {[
              {id:'all', label:'All badges'}, {id:'earned',label:'Earned'},
              {id:'progress',label:'In progress'}, {id:'locked',label:'Not started'},
            ].map(item => <button key={item.id} aria-pressed={filter===item.id} onClick={()=>setFilter(item.id)}>{item.label}</button>)}
          </div>
          <div className="course-search">
            <Search size={17} aria-hidden="true" />
            <input aria-label="Search achievements" placeholder="Find a badge or course…" value={query} onChange={e=>setQuery(e.target.value)}/>
            {query && <button className="icon-button" aria-label="Clear achievement search" onClick={()=>setQuery('')}><X size={16}/></button>}
          </div>
        </div>
        <p className="catalog-status" role="status">Showing {shown.length} of {progress.totalCourses} badges</p>
        {shown.length === 0 && <div className="empty-courses">
          <h3>No badges match these filters.</h3><p>Try a different course name or filter.</p>
          <button className="text-button" onClick={()=>{setQuery('');setFilter('all');}}>Show all badges <ArrowRight size={15}/></button>
        </div>}
        <div className="qv-badge-grid">
          {shown.map((achievement) => (
            <div className={`qv-badge-item ${achievement.earned ? 'is-earned' : ''}`} key={achievement.id}>
              <button className="qv-badge-tile" type="button" onClick={()=>setPendingCourse(achievement)}
                aria-label={`${achievement.title}. ${achievement.completed} of ${achievement.total} lessons complete. View course details.`}>
                <span className={`qv-badge-emblem ${achievement.color}`} aria-hidden="true">
                  <span className="qv-badge-emblem-inner">{achievement.earned ? <Trophy size={46} strokeWidth={1.6} /> : achievement.icon}</span>
                  {achievement.earned && <span className="qv-badge-earned"><Check size={14}/></span>}
                </span>
                <strong>{achievement.title}</strong>
                <small>{achievement.earned ? 'Earned' : achievement.completed ? `${achievement.completed}/${achievement.total} lessons` : 'Not started'}</small>
              </button>
              <div className="qv-badge-tooltip" role="tooltip">
                <strong>{achievement.courseTitle}</strong>
                <span>{achievement.completed} of {achievement.total} lessons complete</span>
                <span>{achievement.earned ? 'Badge unlocked · click to review' : 'Complete all lessons to earn this badge · click for details'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {pendingCourse && <div className="qv-confirm-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)setPendingCourse(null);}}>
        <div className="qv-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="qv-confirm-title" aria-describedby="qv-confirm-description">
          <button type="button" className="qv-confirm-close" aria-label="Close" onClick={()=>setPendingCourse(null)}><X size={21}/></button>
          <span className={`qv-confirm-emblem ${pendingCourse.color}`} aria-hidden="true">{pendingCourse.earned ? <Trophy size={34}/> : pendingCourse.icon}</span>
          <span className="qv-confirm-eyebrow">{pendingCourse.courseTitle}</span>
          <h2 id="qv-confirm-title">{pendingCourse.title}</h2>
          <p id="qv-confirm-description">{pendingCourse.completed} of {pendingCourse.total} lessons complete. {pendingCourse.earned
            ? 'You have earned this badge. Want to review the course?'
            : pendingCourse.completed ? 'Ready to continue working toward this badge?' : 'Would you like to start this course? Prerequisites must be completed first.'}</p>
          <div className="qv-confirm-actions">
            <button type="button" className="qv-confirm-cancel" onClick={()=>setPendingCourse(null)}>Not now</button>
            <button type="button" className="qv-confirm-start" onClick={()=>{
              const lessonId=pendingCourse.nextLessonId;
              setPendingCourse(null);
              if(lessonId)onOpenLesson(lessonId);
            }}>{pendingCourse.earned ? 'Review course' : pendingCourse.completed ? 'Continue course' : 'Start course'} <ArrowRight size={17}/></button>
          </div>
        </div>
      </div>}
    </div>
  );
}

export function RewardToast({
  notice,
  onClose,
  onView,
}: {
  notice: RewardNotice;
  onClose: () => void;
  onView: () => void;
}) {
  return (
    <aside className="reward-toast" aria-label="Learning reward">
      <span className="reward-toast-icon" aria-hidden="true">
        <Trophy size={25} />
      </span>
      <div>
        <div role="status">
          <strong>{notice.title}</strong>
          <p>{notice.message}</p>
          {notice.detail && <small>{notice.detail}</small>}
        </div>
        <button className="text-button" onClick={onView}>
          View achievements <ArrowRight size={14} />
        </button>
      </div>
      <button
        className="icon-button reward-toast-close"
        aria-label="Dismiss reward notification"
        onClick={onClose}
      >
        <X size={17} />
      </button>
    </aside>
  );
}
