import { useEffect, useState } from 'react';
import { ArrowRight, Check, Flame, Lightbulb } from 'lucide-react';
import { dailyQuestions, quizDay, quizStats } from './daily-quiz';
import { useLearner } from './LearnerProvider';
import { useMascot } from './mascot/MascotProvider';
import { QuantumMascot } from './mascot/QuantumMascot';
import { answerReaction } from './mascot/mascot-state';

export function DailyQuizView({ onSignIn }: { onSignIn: () => void }) {
  const learner = useLearner();
  const mascot = useMascot();
  const [pendingReaction, setPendingReaction] = useState<{
    day: string;
    questionId: string;
  } | null>(null);
  useEffect(() => {
    if (!pendingReaction) return;
    const accepted = learner.dailyAnswers.find(
      (item) => item.day === pendingReaction.day && item.questionId === pendingReaction.questionId,
    );
    if (accepted) {
      mascot.react(answerReaction(accepted.correct));
      setPendingReaction(null);
    }
  }, [learner.dailyAnswers, pendingReaction, mascot.react]);
  const [day, setDay] = useState(quizDay),
    [index, setIndex] = useState(0),
    [choice, setChoice] = useState<number | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      const current = quizDay();
      if (current !== day) {
        setDay(current);
        setIndex(0);
        setChoice(null);
        setError('');
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [day]);
  const questions = dailyQuestions(day),
    question = questions[index];
  const answers = learner.dailyAnswers.filter((answer) => answer.day === day);
  const previous = answers.find((answer) => answer.questionId === question.id);
  const { streak, completedDays } = quizStats(learner.dailyAnswers, day);
  const finished = questions.every((question) =>
    answers.some((answer) => answer.questionId === question.id),
  );
  async function submit() {
    if (choice === null || previous || busy) return;
    setBusy(true);
    setError('');
    try {
      await learner.answerDaily(day, question.id, choice);
      setPendingReaction({ day, questionId: question.id });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not save this answer. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="hello">A little curiosity, every day.</p>
          <h1>Your daily quantum facts.</h1>
          <p>Three quick questions. A surprising idea behind every answer.</p>
        </div>
      </div>
      <div className="daily-stats">
        <span>
          <Flame size={20} />
          <strong>{streak}</strong> day streak
        </span>
        <span>
          {completedDays.length} {completedDays.length === 1 ? 'quiz' : 'quizzes'} completed
        </span>
        <span>{answers.length} / 3 facts today</span>
      </div>
      {!learner.user && (
        <div className="account-save-banner">
          <div>
            <strong>Daily quizzes are open to everyone.</strong>
            <p>Guest progress stays in this browser. Sign in to sync across devices.</p>
          </div>
          <button className="text-button" onClick={onSignIn}>
            Sign in to sync <ArrowRight size={15} />
          </button>
        </div>
      )}
      {finished && (
        <div className="daily-complete" role="status">
          <Check size={23} />
          <div>
            <h2>Three facts discovered.</h2>
            <p>
              {answers.filter((answer) => answer.correct).length} / 3 correct on your first answers.
              Come back tomorrow for a new set, or review today’s facts below.
            </p>
          </div>
        </div>
      )}
      <section className="daily-quiz-panel" aria-labelledby="daily-question-title">
        <div className="daily-question-nav" role="group" aria-label="Daily quiz questions">
          {questions.map((item, i) => (
            <button
              key={item.id}
              aria-pressed={index === i}
              onClick={() => {
                setIndex(i);
                setChoice(null);
                setError('');
              }}
            >
              {answers.some((answer) => answer.questionId === item.id) ? (
                <Check size={15} />
              ) : (
                i + 1
              )}
              <span>Fact {i + 1}</span>
            </button>
          ))}
        </div>
        <span className="pill">
          <Lightbulb size={14} />
          {question.title}
        </span>
        <h2 id="daily-question-title">{question.question}</h2>
        <div className="answers" role="group" aria-label="Daily answer choices">
          {question.answers.map((answer, i) => (
            <button
              key={answer}
              aria-pressed={(previous?.answer ?? choice) === i}
              disabled={Boolean(previous) || busy || learner.saving}
              className={
                previous
                  ? i === question.correct
                    ? 'daily-correct'
                    : i === previous.answer
                      ? 'daily-selected-wrong'
                      : ''
                  : choice === i
                    ? 'chosen'
                    : ''
              }
              onClick={() => setChoice(i)}
            >
              {answer}
              {previous && i === question.correct && <Check size={17} />}
            </button>
          ))}
        </div>
        {previous ? (
          <div className="daily-explanation" role="status">
            <strong>{previous.correct ? 'You got it.' : 'A new fact to keep.'}</strong>
            <p>{question.explanation}</p>
          </div>
        ) : (
          <button
            className="primary"
            disabled={choice === null || busy || learner.saving || learner.initializing}
            onClick={() => void submit()}
          >
            {busy ? 'Saving…' : 'Reveal the fact'}
            <Lightbulb size={17} />
          </button>
        )}
        {previous && index < questions.length - 1 && (
          <button
            className="primary"
            onClick={() => {
              setIndex(index + 1);
              setChoice(null);
              setError('');
            }}
          >
            Next fact <ArrowRight size={17} />
          </button>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="bd-cat-mobile">
          <QuantumMascot inline layout="mobile" />
        </div>
        <p className="daily-footnote">
          New questions at midnight in Toronto. Daily quizzes build your streak; course XP and
          badges come from lessons.
        </p>
      </section>
    </>
  );
}
