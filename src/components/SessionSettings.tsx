import { useMemo, useState } from 'react';
import { CATEGORY_MAP } from '../data/categories';
import { poolSize } from '../data/questions';
import type { CategoryId, SessionConfig, Tempo } from '../types';
import { formatDuration } from '../utils/format';
import CategoryBadge from './CategoryBadge';
import { IconArrowLeft, IconClock, IconPlay } from './icons';

interface Props {
  category: CategoryId;
  onStart: (config: SessionConfig) => void;
  onBack: () => void;
}

export default function SessionSettings({ category, onStart, onBack }: Props) {
  const meta = CATEGORY_MAP[category];
  const pool = poolSize(category);

  const countOptions = useMemo(() => {
    const fixed = [5, 8, 10].filter((n) => n < pool);
    return [...fixed, pool]; // sista alternativet = hela frågebanken
  }, [pool]);

  const [questionCount, setQuestionCount] = useState(() =>
    countOptions.includes(10) ? 10 : countOptions[countOptions.length - 1],
  );
  const [timed, setTimed] = useState(true);
  const [tempo, setTempo] = useState<Tempo>('standard');

  const secondsPerQuestion = Math.round(meta.secondsPerQuestion * (tempo === 'lugn' ? 1.5 : 1));
  const totalTime = questionCount * secondsPerQuestion;

  return (
    <div className="session-settings card">
      <button type="button" className="btn btn--ghost btn--back" onClick={onBack}>
        <IconArrowLeft size={18} /> Alla kategorier
      </button>

      <div className="session-settings__head">
        <CategoryBadge category={category} size="lg" />
        <div>
          <h2 className="session-settings__title">{meta.name}</h2>
          <p className="session-settings__desc">{meta.description}</p>
        </div>
      </div>

      <div className="settings-block">
        <h3 className="settings-block__label">Antal frågor</h3>
        <div className="chip-row">
          {countOptions.map((n, i) => (
            <button
              key={n}
              type="button"
              className={`chip-btn${questionCount === n ? ' chip-btn--active' : ''}`}
              onClick={() => setQuestionCount(n)}
            >
              {i === countOptions.length - 1 ? `Alla (${n})` : n}
            </button>
          ))}
        </div>
        <p className="settings-block__hint">{pool} frågor finns i banken för {category}.</p>
      </div>

      <div className="settings-block">
        <h3 className="settings-block__label">Tidsläge</h3>
        <div className="mode-grid">
          <button
            type="button"
            className={`mode-card${timed ? ' mode-card--active' : ''}`}
            onClick={() => setTimed(true)}
          >
            <span className="mode-card__title">
              <IconClock size={18} /> Med tid
            </span>
            <span className="mode-card__desc">
              Nedräkning som på riktiga provet. Rekommenderas!
            </span>
          </button>
          <button
            type="button"
            className={`mode-card${!timed ? ' mode-card--active' : ''}`}
            onClick={() => setTimed(false)}
          >
            <span className="mode-card__title">Utan tid</span>
            <span className="mode-card__desc">Träna i lugn och ro, utan press.</span>
          </button>
        </div>
      </div>

      {timed && (
        <div className="settings-block">
          <h3 className="settings-block__label">Tempo</h3>
          <div className="mode-grid">
            <button
              type="button"
              className={`mode-card${tempo === 'standard' ? ' mode-card--active' : ''}`}
              onClick={() => setTempo('standard')}
            >
              <span className="mode-card__title">Standard (HP-tempo)</span>
              <span className="mode-card__desc">
                {meta.secondsPerQuestion} sekunder per fråga – som på provet.
              </span>
            </button>
            <button
              type="button"
              className={`mode-card${tempo === 'lugn' ? ' mode-card--active' : ''}`}
              onClick={() => setTempo('lugn')}
            >
              <span className="mode-card__title">Lugnt tempo</span>
              <span className="mode-card__desc">50 % extra tid medan du bygger självförtroende.</span>
            </button>
          </div>
        </div>
      )}

      <div className="session-settings__summary">
        <div>
          <strong>{questionCount} frågor</strong>
          {timed ? (
            <span>
              {' '}
              · {formatDuration(totalTime)} totalt ({secondsPerQuestion} s/fråga)
            </span>
          ) : (
            <span> · utan tidsbegränsning</span>
          )}
        </div>
        {timed && (
          <p className="settings-block__hint">
            Tiden pausas automatiskt medan du läser förklaringen efter varje svar.
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn--primary btn--lg btn--full"
        onClick={() => onStart({ category, questionCount, timed, tempo })}
      >
        <IconPlay size={20} /> Starta session
      </button>
    </div>
  );
}
