import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { IconChart, IconClock, IconFlag, IconPencil, IconPlay, IconTarget } from '../components/icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CATEGORY_MAP, KVANT_CATEGORIES, VERBAL_CATEGORIES } from '../data/categories';
import type { CategoryId } from '../types';
import { formatDateTime, formatDuration, formatPercent } from '../utils/format';
import { getCategoryStats, getOverallStats } from '../utils/stats';

export default function StatisticsPage() {
  const { sessions } = useApp();
  const stats = useMemo(() => getOverallStats(sessions), [sessions]);
  const categoryStats = useMemo(() => getCategoryStats(sessions), [sessions]);

  const partAccuracy = (ids: CategoryId[]): number | null => {
    let correct = 0;
    let answered = 0;
    for (const stat of categoryStats) {
      if (ids.includes(stat.category)) {
        correct += stat.correct;
        answered += stat.answered;
      }
    }
    return answered > 0 ? correct / answered : null;
  };

  const verbal = partAccuracy(VERBAL_CATEGORIES);
  const kvant = partAccuracy(KVANT_CATEGORIES);

  // De senaste 10 sessionerna i kronologisk ordning, för trenddiagrammet.
  const trend = useMemo(
    () =>
      [...sessions]
        .slice(0, 10)
        .reverse()
        .map((s) => ({
          id: s.id,
          category: s.category,
          accuracy: s.answered.length > 0 ? s.correctCount / s.answered.length : 0,
          date: s.startedAt,
        })),
    [sessions],
  );

  if (sessions.length === 0) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Statistik</h1>
        </header>
        <EmptyState
          icon={<IconChart size={28} />}
          title="Ingen statistik än"
          text="När du har gjort dina första övningar visas din utveckling här – per kategori och över tid."
          action={
            <Link to="/trana" className="btn btn--primary">
              <IconPlay size={18} /> Börja träna
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Statistik</h1>
        <p className="page-header__sub">Din utveckling i siffror – totalt, per del och per kategori.</p>
      </header>

      <div className="stat-grid">
        <StatCard label="Besvarade frågor" value={stats.totalAnswered} icon={<IconPencil size={20} />} />
        <StatCard label="Träffsäkerhet" value={formatPercent(stats.accuracy)} icon={<IconTarget size={20} />} />
        <StatCard label="Sessioner" value={stats.sessionCount} icon={<IconFlag size={20} />} />
        <StatCard label="Träningstid" value={formatDuration(stats.totalTimeSec)} icon={<IconClock size={20} />} />
      </div>

      <div className="duo-grid">
        <div className="card part-card">
          <h3 className="part-card__label">Verbal del</h3>
          <div className="part-card__value">{formatPercent(verbal)}</div>
          <p className="part-card__sub">ORD · LÄS · MEK · ELF</p>
        </div>
        <div className="card part-card">
          <h3 className="part-card__label">Kvantitativ del</h3>
          <div className="part-card__value">{formatPercent(kvant)}</div>
          <p className="part-card__sub">XYZ · KVA · NOG · DTK</p>
        </div>
      </div>

      <section className="card stats-section">
        <h2 className="section-title">Träffsäkerhet per kategori</h2>
        <div className="cat-bars">
          {CATEGORIES.map((meta) => {
            const stat = categoryStats.find((s) => s.category === meta.id);
            const acc = stat?.accuracy ?? null;
            return (
              <div key={meta.id} className="cat-bar">
                <div className="cat-bar__head">
                  <span className="cat-bar__name">
                    <span className="cat-bar__id" style={{ color: meta.color }}>
                      {meta.id}
                    </span>
                    {meta.name}
                  </span>
                  <span className="cat-bar__value">
                    {acc !== null ? (
                      <>
                        {formatPercent(acc)}
                        <span className="cat-bar__detail">
                          {' '}
                          · {stat?.answered} frågor
                          {stat?.avgTimeSec != null &&
                            ` · ${Math.round(stat.avgTimeSec)} s/fråga (rek ${meta.secondsPerQuestion} s)`}
                        </span>
                      </>
                    ) : (
                      <span className="cat-bar__detail">Ej tränat än</span>
                    )}
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.round((acc ?? 0) * 100)}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {trend.length >= 2 && (
        <section className="card stats-section">
          <h2 className="section-title">Senaste sessionerna</h2>
          <p className="stats-section__hint">Träffsäkerhet per session, äldst till vänster.</p>
          <div className="trend" role="img" aria-label="Stapeldiagram över träffsäkerhet i de senaste sessionerna">
            {trend.map((t) => (
              <div key={t.id} className="trend__col">
                <div className="trend__bar-area">
                  <div
                    className="trend__bar"
                    style={{
                      height: `${Math.max(4, Math.round(t.accuracy * 100))}%`,
                      backgroundColor: CATEGORY_MAP[t.category].color,
                    }}
                    title={`${t.category} · ${Math.round(t.accuracy * 100)} % · ${formatDateTime(t.date)}`}
                  />
                </div>
                <span className="trend__label">{t.category}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
