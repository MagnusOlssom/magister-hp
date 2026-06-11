import { Link } from 'react-router-dom';
import { CATEGORY_MAP } from '../data/categories';
import type { Question, SessionRecord } from '../types';
import { formatDuration, formatPercent } from '../utils/format';
import CategoryBadge from './CategoryBadge';
import ProgressRing from './ProgressRing';
import { IconArrowRight, IconCheck, IconHome, IconRestart, IconX } from './icons';

interface Props {
  record: SessionRecord;
  /** Frågorna i den ordning de visades. */
  questions: Question[];
  onRetry: () => void;
  onNewCategory: () => void;
}

function getSuggestion(record: SessionRecord, accuracy: number | null): string {
  const name = record.category;
  if (record.timedOut) {
    return `Tiden tog slut – träna på att hålla tempot i ${name}, gärna i lugnt tempo först.`;
  }
  if (accuracy === null) return `Fortsätt träna på ${name}.`;
  if (accuracy >= 0.9) return 'Bra jobbat! Testa en svårare session eller en ny kategori.';
  if (accuracy >= 0.7) return `Starkt resultat! Fortsätt träna på ${name} för att nå ännu högre.`;
  if (accuracy >= 0.5) return 'Helt okej! Repetera dina fel innan du går vidare.';
  return `Fortsätt träna på ${name} – läs förklaringarna noggrant, så sätter det sig.`;
}

export default function SessionSummary({ record, questions, onRetry, onNewCategory }: Props) {
  const meta = CATEGORY_MAP[record.category];
  const answeredCount = record.answered.length;
  const accuracy = answeredCount > 0 ? record.correctCount / answeredCount : null;
  const avgTime = answeredCount > 0 ? record.totalTimeSec / answeredCount : null;
  const unanswered = questions.slice(answeredCount);
  const wrongAnswers = record.answered.filter((a) => !a.correct);
  const questionById = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="summary">
      <div className="card summary__hero">
        <ProgressRing
          value={accuracy ?? 0}
          size={132}
          stroke={11}
          color={accuracy !== null && accuracy >= 0.7 ? 'var(--success)' : meta.color}
        >
          <span className="summary__ring-value">{formatPercent(accuracy)}</span>
          <span className="summary__ring-label">rätt</span>
        </ProgressRing>
        <div className="summary__hero-text">
          <div className="summary__badge-row">
            <CategoryBadge category={record.category} />
            <span className="pill">{record.timed ? 'Med tid' : 'Utan tid'}</span>
            {record.timedOut && <span className="pill pill--warning">Tiden tog slut</span>}
          </div>
          <h2 className="summary__title">
            {accuracy !== null && accuracy >= 0.9
              ? 'Strålande resultat! 🎉'
              : accuracy !== null && accuracy >= 0.7
                ? 'Bra jobbat!'
                : 'Session klar!'}
          </h2>
          <p className="summary__subtitle">
            Du fick <strong>{record.correctCount} av {answeredCount}</strong> rätt i {meta.name}.
            {unanswered.length > 0 && <> {unanswered.length} frågor hann inte besvaras.</>}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="mini-stat">
          <span className="mini-stat__label">Antal frågor</span>
          <span className="mini-stat__value">
            {answeredCount}
            {unanswered.length > 0 && <span className="mini-stat__extra"> / {record.questionCount}</span>}
          </span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">Rätta svar</span>
          <span className="mini-stat__value">{record.correctCount}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">Total tid</span>
          <span className="mini-stat__value">{formatDuration(record.totalTimeSec)}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__label">Snitt per fråga</span>
          <span className="mini-stat__value">
            {avgTime !== null ? formatDuration(avgTime) : '–'}
          </span>
          <span className="mini-stat__sub">Rek: {meta.secondsPerQuestion} s</span>
        </div>
      </div>

      <div className="card suggestion">
        <h3 className="suggestion__label">Förslag på nästa steg</h3>
        <p className="suggestion__text">{getSuggestion(record, accuracy)}</p>
      </div>

      {wrongAnswers.length > 0 && (
        <section className="summary__section">
          <h3 className="section-title">
            <IconX size={18} /> Frågor du svarade fel på ({wrongAnswers.length})
          </h3>
          <div className="review-list">
            {wrongAnswers.map((a) => {
              const q = questionById.get(a.questionId);
              if (!q) return null;
              return (
                <div key={a.questionId} className="review-item card">
                  <p className="review-item__question">{q.question}</p>
                  <p className="review-item__row review-item__row--wrong">
                    <IconX size={16} /> Ditt svar: {a.selected}
                  </p>
                  <p className="review-item__row review-item__row--right">
                    <IconCheck size={16} /> Rätt svar: {q.correctAnswer}
                  </p>
                  <p className="review-item__explanation">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {wrongAnswers.length === 0 && answeredCount > 0 && unanswered.length === 0 && (
        <div className="card all-correct">
          <IconCheck size={22} /> Alla rätt – perfekt session!
        </div>
      )}

      {unanswered.length > 0 && (
        <section className="summary__section">
          <h3 className="section-title">Obesvarade frågor ({unanswered.length})</h3>
          <div className="review-list">
            {unanswered.map((q) => (
              <div key={q.id} className="review-item card">
                <p className="review-item__question">{q.question}</p>
                <p className="review-item__row review-item__row--right">
                  <IconCheck size={16} /> Rätt svar: {q.correctAnswer}
                </p>
                <p className="review-item__explanation">{q.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="summary__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={onRetry}>
          <IconRestart size={18} /> Träna igen
        </button>
        <button type="button" className="btn btn--secondary btn--lg" onClick={onNewCategory}>
          Ny kategori <IconArrowRight size={18} />
        </button>
        <Link to="/" className="btn btn--ghost btn--lg">
          <IconHome size={18} /> Till översikten
        </Link>
      </div>
    </div>
  );
}
