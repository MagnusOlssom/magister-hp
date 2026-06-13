import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';
import ExerciseSession, { type SessionOutcome } from '../components/ExerciseSession';
import SessionSettings from '../components/SessionSettings';
import SessionSummary from '../components/SessionSummary';
import { useApp } from '../context/AppContext';
import { CATEGORY_MAP } from '../data/categories';
import { poolSize, prepareQuestions } from '../data/questions';
import type { CategoryId, Question, SessionConfig, SessionRecord } from '../types';
import { uid } from '../utils/helpers';

type Step = 'category' | 'settings' | 'session' | 'summary';

interface ActiveSession {
  config: SessionConfig;
  questions: Question[];
  timeLimitSec: number | null;
  startedAt: string;
}

function buildSession(config: SessionConfig): ActiveSession {
  const questions = prepareQuestions(config.category, config.questionCount);
  const meta = CATEGORY_MAP[config.category];
  const factor = config.tempo === 'lugn' ? 1.5 : 1;
  const timeLimitSec = config.timed
    ? Math.round(questions.length * meta.secondsPerQuestion * factor)
    : null;
  return { config, questions, timeLimitSec, startedAt: new Date().toISOString() };
}

export default function TrainPage() {
  const { addSession } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramCategory = searchParams.get('kategori');
  const validParam =
    paramCategory && paramCategory in CATEGORY_MAP ? (paramCategory as CategoryId) : null;
  // Djuplänk: /trana?kategori=XYZ&start=1 startar direkt med standardinställningar.
  // tid=0 ger ett otajmat pass (Coach Jens noggrannhetsträning).
  const autoStart = validParam !== null && searchParams.get('start') === '1';
  const autoTimed = searchParams.get('tid') !== '0';

  const [step, setStep] = useState<Step>(
    validParam ? (autoStart ? 'session' : 'settings') : 'category',
  );
  const [category, setCategory] = useState<CategoryId | null>(validParam);
  const [active, setActive] = useState<ActiveSession | null>(() =>
    autoStart && validParam
      ? buildSession({
          category: validParam,
          questionCount: Math.min(10, poolSize(validParam)),
          timed: autoTimed,
          tempo: 'standard',
        })
      : null,
  );
  const [finished, setFinished] = useState<{ record: SessionRecord; questions: Question[] } | null>(
    null,
  );

  const goToCategories = () => {
    if (validParam) setSearchParams({}, { replace: true });
    setStep('category');
    setCategory(null);
    setActive(null);
    setFinished(null);
  };

  const handleSelectCategory = (cat: CategoryId) => {
    setCategory(cat);
    setStep('settings');
  };

  const startSession = (config: SessionConfig) => {
    setActive(buildSession(config));
    setFinished(null);
    setStep('session');
  };

  const handleFinish = (outcome: SessionOutcome) => {
    if (!active) return;
    const record: SessionRecord = {
      id: uid(),
      category: active.config.category,
      startedAt: active.startedAt,
      questionCount: active.questions.length,
      answered: outcome.answered,
      correctCount: outcome.answered.filter((a) => a.correct).length,
      timed: active.config.timed,
      tempo: active.config.tempo,
      timeLimitSec: active.timeLimitSec,
      totalTimeSec: outcome.totalTimeSec,
      timedOut: outcome.timedOut,
      completed: outcome.completed,
    };
    addSession(record);
    setFinished({ record, questions: active.questions });
    setStep('summary');
  };

  const handleRetry = () => {
    if (finished) {
      startSession({
        category: finished.record.category,
        questionCount: finished.record.questionCount,
        timed: finished.record.timed,
        tempo: finished.record.tempo,
      });
    }
  };

  return (
    <div className="page">
      {step === 'category' && (
        <>
          <header className="page-header">
            <h1>Vad vill du träna på i dag?</h1>
            <p className="page-header__sub">
              Välj en av högskoleprovets åtta delar. Varje kategori har egna övningsfrågor med
              förklaringar.
            </p>
          </header>
          <CategorySelector onSelect={handleSelectCategory} />
        </>
      )}

      {step === 'settings' && category && (
        <SessionSettings
          key={category}
          category={category}
          onStart={startSession}
          onBack={goToCategories}
        />
      )}

      {step === 'session' && active && (
        <ExerciseSession
          questions={active.questions}
          config={active.config}
          timeLimitSec={active.timeLimitSec}
          onFinish={handleFinish}
          onDiscard={goToCategories}
        />
      )}

      {step === 'summary' && finished && (
        <SessionSummary
          record={finished.record}
          questions={finished.questions}
          onRetry={handleRetry}
          onNewCategory={goToCategories}
        />
      )}
    </div>
  );
}
