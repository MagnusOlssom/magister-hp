import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from '../components/CategoryBadge';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { IconClock, IconPlay, IconTrash } from '../components/icons';
import { useApp } from '../context/AppContext';
import type { CategoryId } from '../types';
import { formatDateTime, formatDuration, formatPercent } from '../utils/format';

export default function HistoryPage() {
  const { sessions, clearHistory } = useApp();
  const [filter, setFilter] = useState<CategoryId | 'alla'>('alla');
  const [showClearModal, setShowClearModal] = useState(false);

  const categoriesWithData = useMemo(
    () => [...new Set(sessions.map((s) => s.category))],
    [sessions],
  );

  const filtered = useMemo(
    () => (filter === 'alla' ? sessions : sessions.filter((s) => s.category === filter)),
    [sessions, filter],
  );

  return (
    <div className="page">
      <header className="page-header page-header--row">
        <div>
          <h1>Historik</h1>
          <p className="page-header__sub">
            {sessions.length > 0
              ? `${sessions.length} genomförda ${sessions.length === 1 ? 'session' : 'sessioner'}.`
              : 'Här samlas dina genomförda sessioner.'}
          </p>
        </div>
        {sessions.length > 0 && (
          <button
            type="button"
            className="btn btn--ghost btn--danger-text"
            onClick={() => setShowClearModal(true)}
          >
            <IconTrash size={16} /> Rensa historik
          </button>
        )}
      </header>

      {sessions.length === 0 ? (
        <EmptyState
          icon={<IconClock size={28} />}
          title="Ingen historik än"
          text="Du har inte gjort några övningar än. Starta din första session!"
          action={
            <Link to="/trana" className="btn btn--primary">
              <IconPlay size={18} /> Starta en session
            </Link>
          }
        />
      ) : (
        <>
          {categoriesWithData.length > 1 && (
            <div className="chip-row chip-row--wrap">
              <button
                type="button"
                className={`chip-btn${filter === 'alla' ? ' chip-btn--active' : ''}`}
                onClick={() => setFilter('alla')}
              >
                Alla
              </button>
              {categoriesWithData.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-btn${filter === cat ? ' chip-btn--active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="session-list">
            {filtered.map((s) => {
              const answeredCount = s.answered.length;
              const acc = answeredCount > 0 ? s.correctCount / answeredCount : null;
              return (
                <div key={s.id} className="session-row card">
                  <CategoryBadge category={s.category} />
                  <div className="session-row__main">
                    <span className="session-row__result">
                      {s.correctCount} av {answeredCount} rätt
                      {answeredCount < s.questionCount && (
                        <span className="session-row__note">
                          {' '}
                          ({s.questionCount - answeredCount} obesvarade)
                        </span>
                      )}
                    </span>
                    <span className="session-row__date">{formatDateTime(s.startedAt)}</span>
                  </div>
                  <div className="session-row__meta">
                    <span className="pill">{s.timed ? 'Med tid' : 'Utan tid'}</span>
                    <span className="pill">{formatDuration(s.totalTimeSec)}</span>
                    {s.timedOut && <span className="pill pill--warning">Tiden tog slut</span>}
                  </div>
                  <div className="session-row__accuracy-wrap">
                    <span className="session-row__accuracy">{formatPercent(acc)}</span>
                    <div className="bar-track bar-track--thin">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.round((acc ?? 0) * 100)}%`,
                          backgroundColor:
                            acc !== null && acc >= 0.7 ? 'var(--success)' : 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showClearModal && (
        <Modal
          title="Rensa historiken?"
          onClose={() => setShowClearModal(false)}
          actions={
            <>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowClearModal(false)}
              >
                Avbryt
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  clearHistory();
                  setShowClearModal(false);
                }}
              >
                Rensa allt
              </button>
            </>
          }
        >
          <p>
            Alla {sessions.length} sessioner tas bort permanent, och din statistik och prognos
            nollställs. Detta går inte att ångra.
          </p>
        </Modal>
      )}
    </div>
  );
}
