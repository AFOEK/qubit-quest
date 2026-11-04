import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { courses, courseById, lessons, searchCourses, tracks, type TrackId } from './curriculum';

export function LearningTrail({
  completed,
  next,
  onOpen,
}: {
  completed: string[];
  next: number;
  onOpen: (index: number) => void;
}) {
  const nextCourse = lessons[next]?.courseId ?? courses[0].id;
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<TrackId | 'all'>('all');
  const [expanded, setExpanded] = useState(new Set([nextCourse]));
  const shown = searchCourses(query, track);
  const indices = new Map(lessons.map((lesson, index) => [lesson.id, index]));

  function changeQuery(value: string) {
    setQuery(value);
    setExpanded(
      new Set(value.trim() ? searchCourses(value, track).map((course) => course.id) : [nextCourse]),
    );
  }

  function jumpToCourse(id: string) {
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
          {completed.length} / {lessons.length} complete
        </span>
      </div>
      <p className="trail-intro">
        {courses.length} courses, one connected journey. Follow the order or choose a topic.
        Prerequisites are recommendations; every lesson is open.
      </p>
      <div className="path-overview" aria-label="Recommended learning progression">
        {tracks.map((item, index) => (
          <div key={item.id}>
            <span>{index + 1}</span>
            <strong>{item.title}</strong>
            {index < tracks.length - 1 && <ArrowRight size={14} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="course-filters" role="group" aria-label="Filter by learning path">
        <button aria-pressed={track === 'all'} onClick={() => setTrack('all')}>
          All courses
        </button>
        {tracks.map((item) => (
          <button key={item.id} aria-pressed={track === item.id} onClick={() => setTrack(item.id)}>
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
          <button className="icon-button" aria-label="Clear search" onClick={() => changeQuery('')}>
            <X size={17} />
          </button>
        )}
      </div>
      <p className="catalog-status" role="status">
        Showing {shown.length} of {courses.length} courses
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
            }}
          >
            Reset filters <ArrowRight size={16} />
          </button>
        </div>
      )}
      {shown.map((course) => {
        const done = course.lessons.filter((lesson) => completed.includes(lesson.id)).length;
        const isOpen = expanded.has(course.id);
        const number = courses.indexOf(course) + 1;
        return (
          <section
            className={`course-card ${isOpen ? 'expanded' : ''}`}
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
            <p className="course-description">{course.description}</p>
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
                  <div className="course-prerequisites">
                    <strong>Before this course</strong>
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
                  <div className="lesson-list">
                    {course.lessons.map((lesson) => {
                      const index = indices.get(lesson.id)!;
                      const isDone = completed.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          className={`lesson-row ${isDone ? 'done' : ''} ${next === index ? 'current' : ''}`}
                          onClick={() => onOpen(index)}
                        >
                          <span className={`lesson-icon ${course.color}`} aria-hidden="true">
                            {isDone ? <Check size={23} /> : course.icon}
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
    </section>
  );
}
