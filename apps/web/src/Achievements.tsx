import { useState } from 'react';
import {
  ArrowRight,
  Award,
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

export function LearningSpark({
  progress,
  onView,
  savingAvailable = true,
}: {
  progress: LearningProgress;
  onView: () => void;
  savingAvailable?: boolean;
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
        {savingAvailable
          ? 'Progress is saved on this browser.'
          : 'Available for this session. Browser saving is unavailable.'}
      </small>
    </div>
  );
}

export function AchievementsPage({
  progress,
  onOpenLesson,
}: {
  progress: LearningProgress;
  onOpenLesson: (id: string) => void;
}) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
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
    <>
      <div className="page-heading">
        <div>
          <p className="hello">Every course counts.</p>
          <h1>Your achievements.</h1>
          <p>
            Finish every lesson in a course to earn its badge. Complete more courses to reach the
            next tier.
          </p>
        </div>
      </div>
      <section
        className={`achievement-hero tier-${progress.tier.id}`}
        aria-labelledby="journey-tier-title"
      >
        <div className="journey-medal" aria-hidden="true">
          <Award size={46} />
        </div>
        <div className="journey-copy">
          <span className="reward-eyebrow">Your journey tier</span>
          <h2 id="journey-tier-title">{progress.tier.name}</h2>
          <p>
            {progress.nextTier
              ? `${progress.nextTier.courses - progress.earnedCount} more ${progress.nextTier.courses - progress.earnedCount === 1 ? 'course' : 'courses'} to ${progress.nextTier.name}.`
              : 'You’ve reached the highest journey tier. Keep exploring your collection.'}
          </p>
          <div
            className="journey-progress"
            role="progressbar"
            aria-label="Journey tier progress"
            aria-valuemin={0}
            aria-valuemax={progress.nextTier?.courses ?? progress.totalCourses}
            aria-valuenow={progress.earnedCount}
          >
            <span
              style={{
                width: `${(100 * progress.earnedCount) / (progress.nextTier?.courses ?? progress.totalCourses)}%`,
              }}
            />
          </div>
          <small>
            {progress.earnedCount} / {progress.nextTier?.courses ?? progress.totalCourses} courses
            {progress.nextTier ? ` toward ${progress.nextTier.name}` : ' complete'}
          </small>
        </div>
        <div className="achievement-stats">
          <div>
            <strong>{progress.xp.toLocaleString()}</strong>
            <span>XP earned</span>
          </div>
          <div>
            <strong>
              {progress.earnedCount} / {progress.totalCourses}
            </strong>
            <span>Course badges</span>
          </div>
          <div>
            <strong>
              {progress.completedLessons} / {progress.totalLessons}
            </strong>
            <span>Lessons complete</span>
          </div>
        </div>
      </section>
      <section className="tier-roadmap" aria-label="Journey tier requirements">
        {journeyTiers
          .filter((tier) => tier.courses > 0)
          .map((tier) => {
            const reached = progress.earnedCount >= tier.courses;
            return (
              <div
                key={tier.id}
                className={`tier-step tier-${tier.id} ${reached ? 'reached' : ''} ${progress.tier.id === tier.id ? 'current-tier' : ''}`}
              >
                <span className="tier-step-icon" aria-hidden="true">
                  {reached ? <Check size={18} /> : <Award size={20} />}
                </span>
                <div>
                  <strong>{tier.name}</strong>
                  <small>
                    {tier.courses} {tier.courses === 1 ? 'course' : 'courses'}
                  </small>
                </div>
                <span className="tier-step-status">
                  {progress.tier.id === tier.id ? 'Current' : reached ? 'Reached' : 'Upcoming'}
                </span>
              </div>
            );
          })}
      </section>
      <section className="milestones-section" aria-labelledby="milestones-title">
        <details open>
          <summary>
            <h2 id="milestones-title" className="milestones-heading">
              <span>
                Learning milestones
                <small>
                  {progress.milestones.filter((milestone) => milestone.reached).length} /{' '}
                  {progress.milestones.length} reached · {XP_PER_LESSON} XP per lesson
                </small>
              </span>
              <ChevronDown size={19} />
            </h2>
          </summary>
          <ol className="milestone-list">
            {progress.milestones.map((milestone) => (
              <li
                key={milestone.id}
                className={`${milestone.reached ? 'reached' : ''} ${progress.nextMilestone?.id === milestone.id ? 'next-milestone' : ''}`}
                aria-current={progress.nextMilestone?.id === milestone.id ? 'step' : undefined}
              >
                <span className="milestone-marker" aria-hidden="true">
                  {milestone.reached ? <Check size={15} /> : <Zap size={15} />}
                </span>
                <strong>{milestone.xp.toLocaleString()} XP</strong>
                <small>
                  {milestone.lessons} lessons{milestone.final ? ' · Full trail' : ''}
                </small>
                <span className="milestone-state">
                  {milestone.reached
                    ? 'Reached'
                    : progress.nextMilestone?.id === milestone.id
                      ? 'Up next'
                      : 'Ahead'}
                </span>
              </li>
            ))}
          </ol>
        </details>
      </section>
      <section className="badge-collection" aria-labelledby="badges-title">
        <div className="section-title">
          <h2 id="badges-title">Your course badges</h2>
          <span>
            {progress.earnedCount} / {progress.totalCourses} earned
          </span>
        </div>
        <div className="badge-controls">
          <div className="course-filters" role="group" aria-label="Filter achievements">
            {[
              { id: 'all', label: 'All badges' },
              { id: 'earned', label: 'Earned' },
              { id: 'progress', label: 'In progress' },
              { id: 'locked', label: 'Not started' },
            ].map((item) => (
              <button
                key={item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="course-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search achievements"
              placeholder="Find a badge or course…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Clear achievement search"
                onClick={() => setQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="catalog-status" role="status">
          Showing {shown.length} of {progress.totalCourses} badges
        </p>
        {shown.length === 0 && (
          <div className="empty-courses">
            <h3>No badges match these filters.</h3>
            <p>Earned badges appear here as you finish courses.</p>
            <button
              className="text-button"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
            >
              Show all badges <ArrowRight size={15} />
            </button>
          </div>
        )}
        <div className="achievement-grid">
          {shown.map((achievement) => (
            <article
              className={`achievement-card ${achievement.earned ? 'earned' : ''}`}
              key={achievement.id}
              data-course={achievement.courseId}
              aria-labelledby={`badge-${achievement.courseId}`}
            >
              <div className="achievement-card-top">
                <span className={`badge-stamp ${achievement.color}`} aria-hidden="true">
                  {achievement.earned ? <Trophy size={27} /> : achievement.icon}
                </span>
                <span className={`badge-state ${achievement.earned ? 'earned' : ''}`}>
                  {achievement.earned ? (
                    <>
                      <Check size={13} />
                      Earned
                    </>
                  ) : achievement.completed ? (
                    'In progress'
                  ) : (
                    <>
                      <LockKeyhole size={12} />
                      Not started
                    </>
                  )}
                </span>
              </div>
              <h3 id={`badge-${achievement.courseId}`}>{achievement.title}</h3>
              <p className="badge-course">{achievement.courseTitle}</p>
              <p className="badge-requirement">
                {achievement.earned
                  ? 'Every lesson complete. This badge is yours.'
                  : `Complete all ${achievement.total} lessons to earn this badge.`}
              </p>
              <div
                className="badge-progress"
                role="progressbar"
                aria-label={`${achievement.title} progress`}
                aria-valuemin={0}
                aria-valuemax={achievement.total}
                aria-valuenow={achievement.completed}
              >
                <span style={{ width: `${achievement.percent}%` }} />
              </div>
              <div className="badge-progress-caption">
                <span>
                  {achievement.completed} / {achievement.total} lessons
                </span>
                <span>
                  {achievement.earned
                    ? 'Complete'
                    : `${achievement.total - achievement.completed} left`}
                </span>
              </div>
              <button
                className="badge-action"
                onClick={() => achievement.nextLessonId && onOpenLesson(achievement.nextLessonId)}
              >
                {achievement.earned
                  ? 'Review course'
                  : achievement.completed
                    ? 'Continue course'
                    : 'Start course'}
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
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
