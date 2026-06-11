import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from '../components/CategoryBadge';
import EmptyState from '../components/EmptyState';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import {
  IconArrowRight,
  IconClock,
  IconFlag,
  IconPencil,
  IconPlay,
  IconTarget,
  IconTrendingDown,
  IconTrophy,
  IconZap,
} from '../components/icons';
import { useApp } from '../context/AppContext';
import { CATEGORY_MAP } from '../data/categories';
import { formatDateTime, formatDuration, formatPercent, formatScore } from '../utils/format';
import { calculatePrognosis } from '../utils/prognosis';
import { getBestAndWeakest, getCategoryStats, getOverallStats } from '../utils/stats';

export default function Dashboard() {
  const { profile, sessions } = useApp();

  const stats = useMemo(() => getOverallStats(sessions), [sessions]);
  const categoryStats = useMemo(() => getCategoryStats(sessions), [sessions]);
  const { best, weakest } = useMemo(() => getBestAndWeakest(categoryStats), [categoryStats]);
  const prognosis = useMemo(() => calculatePrognosis(sessions), [sessions]);

  const firstName = profile.name.trim().split(/\s+/)[0] ?? '';
  const hasSessions = sessions.length > 0;
  const welcome = hasSessions
    ? firstName
      ? `Välkommen tillbaka, ${firstName}!`
      : 'Välkommen tillbaka!'
    : firstName
      ? `Välkommen, ${firstName}!`
      : 'Välkommen!';

  const goalDiff = prognosis ? profile.goalScore - prognosis.score : null;
  const recentSessions = sessions.slice(0, 4);

  return (
    <div className="page">
      <section className="hero card">
        <div className="hero__text">
          <h1 className="hero__title">{welcome} 👋</h1>
          {prognosis ? (
            <>
              <p className="hero__prognosis">
                Din prognos: <strong>{formatScore(prognosis.score)}</strong>
              </p>
              <p className="hero__sub">
                Baserat på dina senaste övningar uppskattar vi att du just nu ligger runt{' '}
                {formatScore(prognosis.score)}.
                {!prognosis.reliable && ' Prognosen blir säkrare ju mer du tränar.'}
              </p>
              <p className="hero__goal">
                <IconTarget size={16} /> Mål: {formatScore(profile.goalScore)}
                {goalDiff !== null &&
                  (goalDiff > 0 ? (
                    <span> · Kvar till mål: {formatScore(goalDiff)}</span>
                  ) : (
                    <span> · Du har nått ditt mål! 🎉</span>
                  ))}
              </p>
            </>
          ) : (
            <>
              <p className="hero__sub">
                Redo att börja plugga? Gör din första övning så får du statistik och en prognos av
                ditt högskoleprovsresultat.
              </p>
              <p className="hero__goal">
                <IconTarget size={16} /> Mål: {formatScore(profile.goalScore)}
              </p>
            </>
          )}
          <Link to="/trana" className="btn btn--hero btn--lg">
            <IconPlay size={20} /> Starta övning
          </Link>
        </div>
        <div className="hero__ring">
          <ProgressRing
            value={prognosis ? prognosis.score / 2 : 0}
            size={150}
            stroke={12}
            color="#fff"
            trackColor="rgba(255,255,255,0.25)"
          >
            <span className="hero__ring-value">
              {prognosis ? formatScore(prognosis.score) : '–'}
            </span>
            <span className="hero__ring-label">av 2,00</span>
          </ProgressRing>
        </div>
      </section>

      <div className="stat-grid">
        <StatCard
          label="Besvarade frågor"
          value={stats.totalAnswered}
          icon={<IconPencil size={20} />}
        />
        <StatCard
          label="Träffsäkerhet"
          value={formatPercent(stats.accuracy)}
          icon={<IconTarget size={20} />}
        />
        <StatCard label="Sessioner" value={stats.sessionCount} icon={<IconFlag size={20} />} />
        <StatCard
          label="Träningstid"
          value={stats.totalTimeSec > 0 ? formatDuration(stats.totalTimeSec) : '0 min'}
          icon={<IconClock size={20} />}
        />
      </div>

      {(best || weakest) && (
        <div className="duo-grid">
          {best && (
            <div className="card highlight-card">
              <div className="highlight-card__icon highlight-card__icon--success">
                <IconTrophy size={22} />
              </div>
              <div>
                <div className="highlight-card__label">Bästa kategori</div>
                <div className="highlight-card__value">
                  <CategoryBadge category={best.category} size="sm" />{' '}
                  {CATEGORY_MAP[best.category].name}
                </div>
                <div className="highlight-card__sub">
                  {formatPercent(best.accuracy)} rätt på {best.answered} frågor
                </div>
              </div>
            </div>
          )}
          {weakest && (
            <div className="card highlight-card">
              <div className="highlight-card__icon highlight-card__icon--warning">
                <IconTrendingDown size={22} />
              </div>
              <div>
                <div className="highlight-card__label">Att utveckla</div>
                <div className="highlight-card__value">
                  <CategoryBadge category={weakest.category} size="sm" />{' '}
                  {CATEGORY_MAP[weakest.category].name}
                </div>
                <div className="highlight-card__sub">
                  {formatPercent(weakest.accuracy)} rätt på {weakest.answered} frågor ·{' '}
                  <Link
                    to={`/trana?kategori=${encodeURIComponent(weakest.category)}`}
                    className="inline-link"
                  >
                    Träna {weakest.category} nu
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <section>
        <div className="section-head">
          <h2 className="section-title">Senaste pass</h2>
          {hasSessions && (
            <Link to="/historik" className="inline-link">
              Visa alla <IconArrowRight size={14} />
            </Link>
          )}
        </div>
        {hasSessions ? (
          <div className="session-list">
            {recentSessions.map((s) => {
              const answeredCount = s.answered.length;
              const acc = answeredCount > 0 ? s.correctCount / answeredCount : null;
              return (
                <div key={s.id} className="session-row card">
                  <CategoryBadge category={s.category} />
                  <div className="session-row__main">
                    <span className="session-row__result">
                      {s.correctCount} av {answeredCount} rätt
                    </span>
                    <span className="session-row__date">{formatDateTime(s.startedAt)}</span>
                  </div>
                  <span className="pill">{s.timed ? 'Med tid' : 'Utan tid'}</span>
                  <span className="session-row__accuracy">{formatPercent(acc)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<IconZap size={28} />}
            title="Du har inte gjort några övningar än"
            text="Starta din första session! Efter varje pass får du resultat, förklaringar och en prognos."
            action={
              <Link to="/trana" className="btn btn--primary">
                <IconPlay size={18} /> Starta din första session
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
