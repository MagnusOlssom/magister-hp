import { useEffect, useRef, useState } from 'react';
import { CATEGORY_MAP } from '../data/categories';
import type { AnsweredQuestion, Question, SessionConfig } from '../types';
import { formatClock } from '../utils/format';
import CategoryBadge from './CategoryBadge';
import Modal from './Modal';
import QuestionCard from './QuestionCard';
import { IconClock, IconX } from './icons';

export interface SessionOutcome {
  answered: AnsweredQuestion[];
  totalTimeSec: number;
  timedOut: boolean;
  completed: boolean;
}

interface Props {
  questions: Question[];
  config: SessionConfig;
  timeLimitSec: number | null;
  onFinish: (outcome: SessionOutcome) => void;
  /** Anropas om sessionen avbryts innan någon fråga besvarats. */
  onDiscard: () => void;
}

type Phase = 'answering' | 'feedback';

export default function ExerciseSession({
  questions,
  config,
  timeLimitSec,
  onFinish,
  onDiscard,
}: Props) {
  const meta = CATEGORY_MAP[config.category];
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const [totalSec, setTotalSec] = useState(0);
  const [questionSec, setQuestionSec] = useState(0);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const finishedRef = useRef(false);

  const question = questions[index];
  const correctSoFar = answered.filter((a) => a.correct).length;

  // Klockan tickar bara medan en fråga är aktiv – den pausas under feedback.
  useEffect(() => {
    if (phase !== 'answering' || showQuitModal) return;
    const timer = setInterval(() => {
      setTotalSec((s) => s + 1);
      setQuestionSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, showQuitModal]);

  // Tiden tog slut.
  useEffect(() => {
    if (timeLimitSec !== null && totalSec >= timeLimitSec && !finishedRef.current) {
      finishedRef.current = true;
      onFinish({ answered, totalTimeSec: totalSec, timedOut: true, completed: false });
    }
  }, [totalSec, timeLimitSec, answered, onFinish]);

  const handleSelect = (option: string) => {
    if (phase !== 'answering' || finishedRef.current) return;
    const record: AnsweredQuestion = {
      questionId: question.id,
      category: question.category,
      selected: option,
      correct: option === question.correctAnswer,
      timeSpentSec: questionSec,
    };
    setAnswered((prev) => [...prev, record]);
    setSelected(option);
    setPhase('feedback');
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish({ answered, totalTimeSec: totalSec, timedOut: false, completed: true });
      }
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setQuestionSec(0);
    setPhase('answering');
  };

  const handleQuitConfirm = () => {
    setShowQuitModal(false);
    if (answered.length === 0) {
      onDiscard();
      return;
    }
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinish({ answered, totalTimeSec: totalSec, timedOut: false, completed: false });
    }
  };

  const remaining = timeLimitSec !== null ? timeLimitSec - totalSec : null;
  const timeIsLow = remaining !== null && timeLimitSec !== null && remaining <= Math.min(60, timeLimitSec * 0.15);
  const progressPct = ((index + (phase === 'feedback' ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="exercise">
      <div className="exercise__topbar">
        <button
          type="button"
          className="btn btn--ghost btn--quit"
          onClick={() => setShowQuitModal(true)}
        >
          <IconX size={18} /> Avsluta
        </button>
        <div className="exercise__progress-info">
          <CategoryBadge category={config.category} size="sm" />
          <span className="exercise__counter">
            Fråga {index + 1} av {questions.length}
          </span>
        </div>
        <div
          className={`exercise__timer${timeIsLow ? ' exercise__timer--low' : ''}`}
          aria-live={timeIsLow ? 'polite' : 'off'}
        >
          <IconClock size={16} />
          {remaining !== null ? formatClock(remaining) : formatClock(totalSec)}
        </div>
      </div>

      <div className="progress" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress__fill" style={{ width: `${progressPct}%` }} />
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        meta={meta}
        selected={selected}
        revealed={phase === 'feedback'}
        isLast={index + 1 >= questions.length}
        onSelect={handleSelect}
        onNext={handleNext}
      />

      <div className="exercise__score" aria-live="polite">
        Rätt hittills: <strong>{correctSoFar}</strong> av {answered.length} besvarade
      </div>

      {showQuitModal && (
        <Modal
          title="Avsluta sessionen?"
          onClose={() => setShowQuitModal(false)}
          actions={
            <>
              <button type="button" className="btn btn--secondary" onClick={() => setShowQuitModal(false)}>
                Fortsätt träna
              </button>
              <button type="button" className="btn btn--danger" onClick={handleQuitConfirm}>
                Avsluta session
              </button>
            </>
          }
        >
          {answered.length > 0 ? (
            <p>
              Du har besvarat {answered.length} av {questions.length} frågor. Om du avslutar nu
              sparas resultatet för de besvarade frågorna och du får se din sammanfattning.
            </p>
          ) : (
            <p>Du har inte besvarat någon fråga än. Om du avslutar nu sparas ingenting.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
