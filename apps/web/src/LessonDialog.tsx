import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, FlaskConical, X } from 'lucide-react';
import { courseById, lessonById, type Lab, type Lesson } from './curriculum';
import { XP_PER_LESSON } from './progress';

const labNames = {
  bell: 'Bell pair',
  grover: 'Grover search',
  qft: 'QFT',
  optimization: 'QAOA',
  chemistry: 'toy variational energy',
};

export function LessonDialog({
  lesson,
  courseId,
  completed,
  onClose,
  onComplete,
  onLab,
  onNavigate,
}: {
  lesson: Lesson;
  courseId: string;
  completed: boolean;
  onClose: () => void;
  onComplete: () => void;
  onLab: (lab: Lab) => void;
  onNavigate: (id: string) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState(false);
  const dialog = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const closeAction = useRef(onClose);
  closeAction.current = onClose;
  const course = courseById.get(courseId)!;
  const position = course.lessons.findIndex((item) => item.id === lesson.id) + 1;
  const correct = answer === lesson.correct;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeAction.current();
      if (event.key !== 'Tab') return;
      const items = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], summary') ??
          [],
      );
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <section
        ref={dialog}
        className="lesson-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-title"
      >
        <div className="lesson-toolbar">
          <span className="pill">
            {course.title} · {lesson.time} min
          </span>
          <button
            ref={closeButton}
            className="close icon-button"
            aria-label="Close lesson"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <p className="lesson-position">
          Lesson {position} of {course.lessons.length} · {lesson.level}
          {completed && ' · Completed'}
        </p>
        <h2 id="lesson-title">{lesson.title}</h2>
        <div className="topic-tags">
          {lesson.topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        {lesson.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <section className="math-card" aria-label="Mathematical explanation">
          <h3>{lesson.math.label ?? 'The math, unpacked'}</h3>
          <pre>{lesson.math.formula}</pre>
          <p>{lesson.math.explanation}</p>
        </section>
        <section className="worked-example">
          <h3>A worked example</h3>
          <p>{lesson.example}</p>
        </section>
        <section className="lesson-practice">
          <h3>Try it yourself</h3>
          <p>{lesson.practice.prompt}</p>
          <details>
            <summary>Reveal the worked answer</summary>
            <p>{lesson.practice.answer}</p>
          </details>
        </section>
        {lesson.lab && (
          <button className="text-button lesson-lab-link" onClick={() => onLab(lesson.lab!)}>
            <FlaskConical size={18} />
            {lesson.lab.kind === 'gates'
              ? 'Try this circuit in the gate explorer'
              : `Open the ${labNames[lesson.lab.name]} experiment`}
            <ChevronRight size={16} />
          </button>
        )}
        <section className="lesson-quiz" aria-label="Knowledge check">
          <span className="quiz-eyebrow">Check your understanding</span>
          <h3>{lesson.question}</h3>
          <div className="answers" role="group" aria-label="Answer choices">
            {lesson.answers.map((choice, index) => (
              <button
                key={choice}
                aria-pressed={answer === index}
                className={answer === index ? 'chosen' : ''}
                onClick={() => {
                  setAnswer(index);
                  setFeedback(false);
                }}
              >
                {choice}
              </button>
            ))}
          </div>
          {feedback && (
            <p role="status" className={correct ? 'success' : 'error'}>
              {correct ? 'Exactly. ' : 'Not quite. '}
              {lesson.why}
            </p>
          )}
          <button
            className="primary"
            disabled={answer === null}
            onClick={() => (feedback && correct ? onComplete() : setFeedback(true))}
          >
            {feedback && correct
              ? completed
                ? 'Finish review'
                : `Complete lesson · +${XP_PER_LESSON} XP`
              : 'Check my answer'}
            <Check size={18} />
          </button>
          <small>Revisiting a completed lesson does not award extra XP.</small>
        </section>
        {lesson.followUp && (
          <div className="lesson-follow-up">
            <h3>Build on this idea</h3>
            <p>This lesson introduces the idea. These later lessons develop it further.</p>
            {lesson.followUp.map((id) => (
              <button className="text-button" key={id} onClick={() => onNavigate(id)}>
                {lessonById.get(id)?.title}
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
