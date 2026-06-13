import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from '../components/CategoryBadge';
import ProgressRing from '../components/ProgressRing';
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconLock,
  IconSparkle,
  IconTarget,
} from '../components/icons';
import { useApp } from '../context/AppContext';
import { CATEGORY_MAP } from '../data/categories';
import { buildCoachAnalysis, COACH_NAME, getUnlockProgress, UNLOCK_PER_SUBTEST } from '../utils/coach';
import { formatScore } from '../utils/format';

function CoachBadge({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`coach-badge coach-badge--${size}`} aria-hidden="true">
      <IconSparkle size={size === 'lg' ? 26 : 18} />
    </span>
  );
}

export default function AnalysisPage() {
  const { sessions, profile } = useApp();

  const unlock = useMemo(() => getUnlockProgress(sessions), [sessions]);
  const analysis = useMemo(
    () => (unlock.unlocked ? buildCoachAnalysis(sessions, profile, Date.now()) : null),
    [sessions, profile, unlock.unlocked],
  );

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <div className="coach-title">
          <CoachBadge size="lg" />
          <div>
            <h1>Analys</h1>
            <p className="page-header__sub">Coach {COACH_NAME} – din personliga HP-analys</p>
          </div>
        </div>
      </header>

      {!unlock.unlocked ? (
        <LockedState unlock={unlock} />
      ) : (
        analysis && <UnlockedState analysis={analysis} goalScore={profile.goalScore} />
      )}
    </div>
  );
}

function LockedState({ unlock }: { unlock: ReturnType<typeof getUnlockProgress> }) {
  return (
    <>
      <section className="card coach-locked">
        <div className="coach-locked__icon">
          <IconLock size={24} />
        </div>
        <h2 className="coach-locked__title">
          {COACH_NAME} förbereder din första analys
        </h2>
        <p className="coach-locked__text">
          Gör minst {UNLOCK_PER_SUBTEST} övningar i varje delprov så låser du upp din första
          personliga HP-analys – samma underlag som din fulla prognos bygger på.
        </p>
        <div className="coach-locked__progress">
          <div className="coach-locked__count">
            <strong>{unlock.completed}</strong> av {unlock.total} delprov klara
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-fill--gradient"
              style={{ width: `${Math.round((unlock.completed / unlock.total) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="coach-checklist">
        {unlock.subtests.map((s) => (
          <div key={s.category} className={`card coach-row${s.done ? ' coach-row--done' : ''}`}>
            <CategoryBadge category={s.category} />
            <div className="coach-row__main">
              <span className="coach-row__name">{CATEGORY_MAP[s.category].name}</span>
              <span className="coach-row__count">
                {s.done ? (
                  <>
                    <IconCheck size={15} /> Klar ({s.answered} övningar)
                  </>
                ) : (
                  `${s.answered} av ${UNLOCK_PER_SUBTEST} övningar`
                )}
              </span>
            </div>
            {s.done ? (
              <span className="coach-row__check" aria-label="Klar">
                <IconCheck size={18} />
              </span>
            ) : (
              <Link
                to={`/trana?kategori=${encodeURIComponent(s.category)}&start=1&tid=0`}
                className="btn btn--secondary btn--sm"
              >
                Gör {s.remaining} {s.category}
              </Link>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

function UnlockedState({
  analysis,
  goalScore,
}: {
  analysis: NonNullable<ReturnType<typeof buildCoachAnalysis>>;
  goalScore: number;
}) {
  const { prognosis, headline, observations, recommendations, examDaysLeft } = analysis;
  const goalDiff = prognosis ? goalScore - prognosis.score : null;

  return (
    <>
      <section className="card coach-status">
        <ProgressRing value={prognosis ? prognosis.score / 2 : 0} size={104} stroke={9}>
          <span className="coach-status__score">
            {prognosis ? formatScore(prognosis.score) : '–'}
          </span>
          <span className="coach-status__label">prognos</span>
        </ProgressRing>
        <div className="coach-status__facts">
          <div className="coach-status__fact">
            <IconTarget size={16} /> Mål: <strong>{formatScore(goalScore)}</strong>
            {goalDiff !== null && goalDiff > 0 && <span> · {formatScore(goalDiff)} kvar</span>}
            {goalDiff !== null && goalDiff <= 0 && <span> · uppnått! 🎉</span>}
          </div>
          {examDaysLeft !== null && examDaysLeft >= 0 && (
            <div className="coach-status__fact">
              <IconClock size={16} /> {examDaysLeft} dagar till provet
            </div>
          )}
        </div>
      </section>

      <section className="card coach-analysis">
        <div className="coach-analysis__head">
          <CoachBadge />
          <span className="coach-analysis__who">{COACH_NAME} har analyserat din träning</span>
        </div>
        <p className="coach-analysis__headline">{headline}</p>
        {observations.length > 0 && (
          <ul className="coach-obs">
            {observations.map((o, i) => (
              <li key={i} className={`coach-obs__item coach-obs__item--${o.tone}`}>
                {o.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="summary__section">
        <h2 className="section-title">
          <IconSparkle size={18} /> {COACH_NAME} rekommenderar
          {recommendations.length > 1 ? ` (${recommendations.length} steg)` : ''}
        </h2>
        <div className="coach-recs">
          {recommendations.map((rec, i) => (
            <div key={rec.id} className="card coach-rec">
              <span className="coach-rec__rank">{i + 1}</span>
              <div className="coach-rec__body">
                <div className="coach-rec__title-row">
                  <CategoryBadge category={rec.category} size="sm" />
                  <span className="coach-rec__title">{rec.title}</span>
                  <span className={`pill pill--${rec.kind === 'timed' ? 'timed' : 'untimed'}`}>
                    {rec.kind === 'timed' ? 'Med tid' : 'Utan tid'}
                  </span>
                </div>
                <p className="coach-rec__reason">{rec.reason}</p>
                <Link to={rec.href} className="btn btn--primary btn--sm">
                  Starta nu <IconArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
