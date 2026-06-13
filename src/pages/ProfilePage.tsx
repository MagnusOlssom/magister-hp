import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import Avatar from '../components/Avatar';
import FacultyPicker from '../components/FacultyPicker';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import { IconFlag, IconPencil, IconTarget, IconTrash } from '../components/icons';
import { useApp } from '../context/AppContext';
import { FACULTY_MAP } from '../data/faculties';
import { formatPercent, formatScore } from '../utils/format';
import { clamp } from '../utils/helpers';
import { fileToAvatar } from '../utils/image';
import { calculatePrognosis } from '../utils/prognosis';
import { getOverallStats } from '../utils/stats';

export default function ProfilePage() {
  const { profile, sessions, updateProfile, resetAll } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const stats = useMemo(() => getOverallStats(sessions), [sessions]);
  const prognosis = useMemo(() => calculatePrognosis(sessions), [sessions]);

  const flashSaved = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setAvatarError(null);
      const dataUrl = await fileToAvatar(file);
      updateProfile({ avatar: dataUrl });
      flashSaved();
    } catch {
      setAvatarError('Bilden kunde inte läsas – prova en annan fil (t.ex. JPG eller PNG).');
    }
  };

  const goalDiff = prognosis ? profile.goalScore - prognosis.score : null;
  const goalProgress =
    prognosis && profile.goalScore > 0 ? clamp(prognosis.score / profile.goalScore, 0, 1) : 0;

  return (
    <div className="page page--narrow">
      <header className="page-header">
        <h1>Profil</h1>
        <p className="page-header__sub">
          Dina uppgifter och ditt mål. Allt sparas lokalt i din webbläsare.
        </p>
      </header>

      <section className="card profile-card">
        <div className="profile-card__avatar-row">
          <Avatar name={profile.name} src={profile.avatar} size={88} />
          <div className="profile-card__avatar-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              {profile.avatar ? 'Byt bild' : 'Ladda upp bild'}
            </button>
            {profile.avatar && (
              <button
                type="button"
                className="btn btn--ghost btn--danger-text"
                onClick={() => {
                  updateProfile({ avatar: undefined });
                  flashSaved();
                }}
              >
                Ta bort bild
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        {avatarError && <p className="form-error">{avatarError}</p>}

        <label className="field">
          <span className="field__label">Namn</span>
          <input
            type="text"
            className="field__input"
            value={profile.name}
            placeholder="Ditt namn"
            maxLength={40}
            onChange={(e) => updateProfile({ name: e.target.value })}
            onBlur={flashSaved}
          />
        </label>

        <div className="field">
          <span className="field__label">
            Mitt mål: <strong className="goal-value">{formatScore(profile.goalScore)}</strong>
          </span>
          <input
            type="range"
            className="field__range"
            min={0}
            max={2}
            step={0.05}
            value={profile.goalScore}
            onChange={(e) => updateProfile({ goalScore: Number(e.target.value) })}
            onMouseUp={flashSaved}
            onTouchEnd={flashSaved}
            aria-label="Målpoäng mellan 0,0 och 2,0"
          />
          <div className="range-scale">
            <span>0,0</span>
            <span>1,0</span>
            <span>2,0</span>
          </div>
        </div>

        <label className="field">
          <span className="field__label">Provdatum (valfritt)</span>
          <input
            type="date"
            className="field__input"
            value={profile.examDate ?? ''}
            onChange={(e) => updateProfile({ examDate: e.target.value || undefined })}
            onBlur={flashSaved}
          />
          <span className="field__hint">
            Anger du när du ska skriva provet anpassar Coach Jens sina råd efter hur nära det är.
          </span>
        </label>

        <p className={`saved-flash${savedFlash ? ' saved-flash--visible' : ''}`} aria-live="polite">
          Sparat ✓
        </p>
      </section>

      <section className="card faculty-section">
        <h2 className="section-title">Min fakultet</h2>
        {profile.faculty ? (
          <div
            className="faculty-banner"
            style={{ '--faculty-color': FACULTY_MAP[profile.faculty].color } as React.CSSProperties}
          >
            <span className="faculty-banner__emoji" aria-hidden="true">
              {FACULTY_MAP[profile.faculty].emoji}
            </span>
            <div>
              <div className="faculty-banner__name">{FACULTY_MAP[profile.faculty].name}</div>
              <div className="faculty-banner__motto">”{FACULTY_MAP[profile.faculty].motto}”</div>
            </div>
          </div>
        ) : (
          <p className="goal-card__hint">
            Välj vilken fakultet du representerar – inför framtida fakultetstävlingar!
          </p>
        )}
        <FacultyPicker
          compact
          value={profile.faculty}
          onChange={(faculty) => {
            updateProfile({ faculty });
            flashSaved();
          }}
        />
      </section>

      <section className="card goal-card">
        <h2 className="section-title">
          <IconTarget size={18} /> Prognos mot mål
        </h2>
        {prognosis ? (
          <>
            <div className="goal-card__numbers">
              <div>
                <span className="goal-card__label">Nuvarande prognos</span>
                <span className="goal-card__value">{formatScore(prognosis.score)}</span>
              </div>
              <div>
                <span className="goal-card__label">Mål</span>
                <span className="goal-card__value">{formatScore(profile.goalScore)}</span>
              </div>
              <div>
                <span className="goal-card__label">Kvar till mål</span>
                <span className="goal-card__value">
                  {goalDiff !== null && goalDiff > 0 ? formatScore(goalDiff) : 'Uppnått! 🎉'}
                </span>
              </div>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill bar-fill--gradient"
                style={{ width: `${Math.round(goalProgress * 100)}%` }}
              />
            </div>
            {!prognosis.reliable && (
              <p className="goal-card__hint">
                Gör fler övningar så blir prognosen säkrare (minst 10 besvarade frågor
                rekommenderas).
              </p>
            )}
          </>
        ) : (
          <p className="goal-card__hint">
            Gör din första övning så räknar vi ut en prognos att jämföra med ditt mål.
          </p>
        )}
      </section>

      <div className="stat-grid stat-grid--three">
        <StatCard label="Besvarade frågor" value={stats.totalAnswered} icon={<IconPencil size={20} />} />
        <StatCard label="Träffsäkerhet" value={formatPercent(stats.accuracy)} icon={<IconTarget size={20} />} />
        <StatCard label="Sessioner" value={stats.sessionCount} icon={<IconFlag size={20} />} />
      </div>

      <section className="card danger-zone">
        <h2 className="section-title">Återställ appen</h2>
        <p className="danger-zone__text">
          Raderar profil, mål och hela sessionshistoriken från den här webbläsaren.
        </p>
        <button type="button" className="btn btn--danger" onClick={() => setShowResetModal(true)}>
          <IconTrash size={16} /> Återställ all data
        </button>
      </section>

      {showResetModal && (
        <Modal
          title="Återställa all data?"
          onClose={() => setShowResetModal(false)}
          actions={
            <>
              <button type="button" className="btn btn--secondary" onClick={() => setShowResetModal(false)}>
                Avbryt
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  resetAll();
                  setShowResetModal(false);
                }}
              >
                Ja, radera allt
              </button>
            </>
          }
        >
          <p>
            Din profil, ditt mål och alla {sessions.length} sessioner raderas permanent. Detta går
            inte att ångra.
          </p>
        </Modal>
      )}
    </div>
  );
}
