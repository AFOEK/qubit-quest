import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  Trophy,
  X,
  LockKeyhole,
} from 'lucide-react';
import { courses, courseById, lessons, searchCourses, tracks, type TrackId } from './curriculum';
import type { Achievement } from './achievements';
import {
  learningPaths,
  pathCourses,
  courseFinished,
  missingPrerequisites,
  lessonAvailable,
  type PathId,
} from './learning-paths';

export function LearningTrail({
  completed,
  next,
  onOpen,
  achievements,
  pathId,
  onPathChange,
  saving,
  focusCourse,
  onFocused,
}: {
  completed: string[];
  next: number;
  onOpen: (index: number) => void;
  achievements: Achievement[];
  pathId: PathId;
  onPathChange: (id: PathId) => void;
  saving: boolean;
  focusCourse: string | null;
  onFocused: () => void;
}) {
  const nextCourse = lessons[next]?.courseId ?? courses[0].id;
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState(pathId === 'all');
  const [includeOptional, setIncludeOptional] = useState(false);
  const path = learningPaths.find((item) => item.id === pathId);
  const scope = pathCourses(pathId);
  const requiredLessons = lessons.filter((lesson) => scope.required.includes(lesson.courseId));
  const doneRequired = requiredLessons.filter((lesson) => completed.includes(lesson.id)).length;
  const stages = [
    { title: 'Basics', ids: ['math', 'quantum-mechanics', 'qubits', 'gates-1', 'gates-2'] },
    { title: 'Compilation', ids: ['software-compilation'] },
    { title: 'Algorithms', ids: ['algorithms-1', 'algorithms-2'] },
    { title: 'Noise', ids: ['noise-qec', 'error-mitigation'] },
    {
      title: 'Specialization',
      ids: scope.required.filter(
        (id) =>
          ![
            'math',
            'quantum-mechanics',
            'qubits',
            'gates-1',
            'gates-2',
            'software-compilation',
            'algorithms-1',
            'algorithms-2',
            'noise-qec',
            'error-mitigation',
          ].includes(id),
      ),
    },
  ]
    .map((stage) => ({ ...stage, ids: stage.ids.filter((id) => scope.required.includes(id)) }))
    .filter((stage) => stage.ids.length);
  useEffect(() => {
    setCatalog(pathId === 'all');
    setQuery('');
    setTrack('all');
    setIncludeOptional(false);
  }, [pathId]);
  useEffect(() => {
    setExpanded((previous) => new Set([...previous, nextCourse]));
  }, [nextCourse]);
  useEffect(() => {
    if (!focusCourse) return;
    setCatalog(true);
    setQuery('');
    setTrack('all');
    setExpanded((previous) => new Set([...previous, focusCourse]));
    requestAnimationFrame(() =>
      document
        .getElementById(`course-${focusCourse}`)
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
    );
    onFocused();
  }, [focusCourse]);
  const [track, setTrack] = useState<TrackId | 'all'>('all');
  const [expanded, setExpanded] = useState(new Set([nextCourse]));
  const shown = searchCourses(query, track)
    .filter(
      (course) =>
        catalog ||
        pathId === 'all' ||
        scope.required.includes(course.id) ||
        (includeOptional && scope.optional.includes(course.id)),
    )
    .sort((a, b) =>
      catalog || pathId === 'all'
        ? 0
        : Number(scope.required.includes(b.id)) - Number(scope.required.includes(a.id)),
    );
  const indices = new Map(lessons.map((lesson, index) => [lesson.id, index]));

  function changeQuery(value: string) {
    setQuery(value);
    setExpanded(
      new Set(value.trim() ? searchCourses(value, track).map((course) => course.id) : [nextCourse]),
    );
  }

  function jumpToCourse(id: string) {
    if (!shown.some((course) => course.id === id)) setCatalog(true);
    setTrack('all');
    setQuery('');
    setExpanded((previous) => new Set([...previous, id]));
    requestAnimationFrame(() =>
      document
        .getElementById(`course-${id}`)
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' }),
    );
  }

  return (
    <section className="trail" aria-label="Course catalog">
      <div className="section-title">
        <h2>Your learning trail</h2>
        <span>
          {doneRequired} / {requiredLessons.length} {path ? 'required lessons' : 'lessons'} complete
        </span>
      </div>
      <p className="trail-intro">Follow the signal. Each course brings the next one into focus.</p>
      <div className="path-choice">
        <label>
          Your learning goal
          <select
            aria-label="Learning goal"
            value={pathId}
            disabled={saving}
            onChange={(event) => onPathChange(event.target.value as PathId)}
          >
            <option value="all">Explore the full catalog</option>
            {learningPaths.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        {path && (
          <>
            <p>{path.description}</p>
            <div className="path-summary">
              <strong>
                {scope.required.filter((id) => courseFinished(id, completed)).length} /{' '}
                {scope.required.length} required courses complete
              </strong>
              <span>{scope.optional.length} optional courses</span>
            </div>
            <div
              className="goal-track"
              role="progressbar"
              aria-label={`${path.title} required progress`}
              aria-valuemin={0}
              aria-valuemax={requiredLessons.length}
              aria-valuenow={doneRequired}
            >
              <span style={{ width: `${(100 * doneRequired) / requiredLessons.length}%` }} />
            </div>
          </>
        )}
      </div>
      {path && (
        <div className="path-overview goal-stages" aria-label="Your path stages">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className={
                stage.ids.every((id) => courseFinished(id, completed)) ? 'stage-complete' : ''
              }
            >
              <span>
                {stage.ids.every((id) => courseFinished(id, completed)) ? (
                  <Check size={13} />
                ) : (
                  index + 1
                )}
              </span>
              <strong>{stage.title}</strong>
              {index < stages.length - 1 && <ArrowRight size={13} aria-hidden="true" />}
            </div>
          ))}
        </div>
      )}
      {path && (
        <div className="path-view-controls">
          <button aria-pressed={!catalog} onClick={() => setCatalog(false)}>
            My required trail
          </button>
          <button aria-pressed={catalog} onClick={() => setCatalog(true)}>
            Browse all {courses.length} courses
          </button>
          {!catalog && scope.optional.length > 0 && (
            <label>
              <input
                type="checkbox"
                checked={includeOptional}
                onChange={(event) => setIncludeOptional(event.target.checked)}
              />
              Show optional branches
            </label>
          )}
        </div>
      )}
      <details className="catalog-tools">
        <summary>
          <Search size={16} /> Find a course or topic <ChevronDown size={15} />
        </summary>
        <div className="course-filters" role="group" aria-label="Filter by learning path">
          <button aria-pressed={track === 'all'} onClick={() => setTrack('all')}>
            All courses
          </button>
          {tracks.map((item) => (
            <button
              key={item.id}
              aria-pressed={track === item.id}
              onClick={() => setTrack(item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="course-search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search courses and topics"
            placeholder="Search a course or topic, e.g. Bell, UCCSD, QLSTM…"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => changeQuery('')}
            >
              <X size={17} />
            </button>
          )}
        </div>
      </details>
      <p className="catalog-status" role="status">
        Showing {shown.length} {catalog || pathId === 'all' ? 'catalog' : 'trail'} courses
        {track !== 'all' && ` · ${tracks.find((item) => item.id === track)?.title}`}
      </p>
      {shown.length === 0 && (
        <div className="empty-courses">
          <h3>No courses match this search.</h3>
          <p>Try a broader topic or browse all courses.</p>
          <button
            className="text-button"
            onClick={() => {
              setTrack('all');
              changeQuery('');
              setCatalog(true);
            }}
          >
            Reset filters <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="course-grid">
        {shown.map((course) => {
          const achievement = achievements.find((item) => item.courseId === course.id)!;
          const done = course.lessons.filter((lesson) => completed.includes(lesson.id)).length;
          const isOpen = expanded.has(course.id);
          const optional = Boolean(
            path && !scope.required.includes(course.id) && scope.optional.includes(course.id),
          );
          const number =
            catalog || pathId === 'all'
              ? courses.indexOf(course) + 1
              : (optional ? scope.optional : scope.required).indexOf(course.id) + 1;
          const missing = missingPrerequisites(course.id, completed);
          const locked = missing.length > 0 && !achievement.earned;
          return (
            <section
              className={`course-card ${isOpen ? 'expanded' : ''} ${locked ? 'prerequisite-locked' : ''} ${course.id === nextCourse ? 'current-course' : ''}`}
              key={course.id}
              id={`course-${course.id}`}
              aria-labelledby={`title-${course.id}`}
            >
              <h3 id={`title-${course.id}`} className="course-card-title">
                <button
                  className="course-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`content-${course.id}`}
                  onClick={() =>
                    setExpanded((previous) => {
                      const updated = new Set(previous);
                      if (updated.has(course.id)) updated.delete(course.id);
                      else updated.add(course.id);
                      return updated;
                    })
                  }
                >
                  <span className={`unit-number ${course.color}`}>
                    {String(number).padStart(2, '0')}
                  </span>
                  <span className="course-heading">
                    <span className="course-track">
                      {tracks.find((item) => item.id === course.track)?.title}
                    </span>
                    <span className="course-title">{course.title}</span>
                    <span className="course-route-label">
                      {optional ? 'Optional branch' : path && !catalog ? 'Required' : 'Course'}
                      {locked && (
                        <>
                          {' '}
                          · <LockKeyhole size={10} />
                          Locked
                        </>
                      )}
                    </span>
                    <small>
                      {course.lessons.length} lessons ·{' '}
                      {course.lessons.reduce((sum, lesson) => sum + lesson.time, 0)} min · {done}/
                      {course.lessons.length} complete
                    </small>
                  </span>
                  {done === course.lessons.length ? (
                    <Check size={20} aria-label="Course complete" />
                  ) : (
                    <ChevronDown size={19} className={isOpen ? 'rotated' : ''} aria-hidden="true" />
                  )}
                </button>
              </h3>
              {isOpen && <p className="course-description">{course.description}</p>}
              {locked && isOpen && (
                <p className="course-lock-note">
                  <LockKeyhole size={13} />
                  Finish {missing.map((id) => courseById.get(id)?.title).join(', ')} to unlock new
                  lessons.
                </p>
              )}
              <div
                className="course-progress"
                role="progressbar"
                aria-label={`${course.title} progress`}
                aria-valuemin={0}
                aria-valuemax={course.lessons.length}
                aria-valuenow={done}
              >
                <span style={{ width: `${(100 * done) / course.lessons.length}%` }} />
              </div>
              <div id={`content-${course.id}`} className="course-content" hidden={!isOpen}>
                {isOpen && (
                  <>
                    <details className="course-about">
                      <summary>
                        About this course <ChevronDown size={15} />
                      </summary>
                      <div className="course-prerequisites">
                        <strong>Required first</strong>
                        {course.prerequisites.length ? (
                          course.prerequisites.map((id) => (
                            <button key={id} onClick={() => jumpToCourse(id)}>
                              {courseById.get(id)?.title}
                              <ChevronRight size={12} />
                            </button>
                          ))
                        ) : (
                          <span>No quantum background needed. Basic arithmetic is enough.</span>
                        )}
                      </div>
                      <div className="course-outcomes">
                        <h4>You’ll be able to</h4>
                        <ul>
                          {course.outcomes.map((outcome) => (
                            <li key={outcome}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={`course-badge-preview ${achievement.earned ? 'earned' : ''}`}>
                        <Trophy size={21} aria-hidden="true" />
                        <div>
                          <span>
                            {achievement.earned ? 'Course badge earned' : 'Your course badge'}
                          </span>
                          <strong>{achievement.title}</strong>
                          <small>
                            {achievement.earned
                              ? 'Every lesson complete.'
                              : `Complete all ${achievement.total} lessons to unlock.`}
                          </small>
                        </div>
                        {achievement.earned && <Check size={18} aria-label="Earned" />}
                      </div>
                    </details>
                    <div className="lesson-list">
                      {course.lessons.map((lesson) => {
                        const index = indices.get(lesson.id)!;
                        const isDone = completed.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            className={`lesson-row ${isDone ? 'done' : ''} ${next === index ? 'current' : ''}`}
                            disabled={!lessonAvailable(lesson.id, completed) || saving}
                            onClick={() => onOpen(index)}
                          >
                            <span className={`lesson-icon ${course.color}`} aria-hidden="true">
                              {isDone ? (
                                <Check size={21} />
                              ) : (
                                <span>
                                  {course.lessons.findIndex((item) => item.id === lesson.id) + 1}
                                </span>
                              )}
                            </span>
                            <span className="lesson-name">
                              <strong>{lesson.title}</strong>
                              <small>
                                {lesson.time} min <span>·</span> {lesson.level}
                                {isDone && ' · Complete'}
                              </small>
                              <span className="lesson-topics">{lesson.topics.join(' · ')}</span>
                            </span>
                            {next === index ? (
                              <span className="start-tag">Next</span>
                            ) : (
                              <ChevronRight size={18} aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
