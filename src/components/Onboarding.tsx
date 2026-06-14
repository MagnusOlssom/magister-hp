import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FACULTY_MAP } from '../data/faculties';
import type { FacultyId } from '../types';
import { formatScore } from '../utils/format';
import BrandMark from './BrandMark';
import FacultyPicker from './FacultyPicker';
import { IconArrowLeft, IconArrowRight } from './icons';

type Step = 'name' | 'faculty' | 'goal' | 'celebration';

const STEP_ORDER: Step[] = ['name', 'faculty', 'goal'];

/**
 * Välkomstflöde vid första besöket: namn → fakultet → mål → invigning.
 * Visas tills profilen markerats som onboarded.
 */
export default function Onboarding() {
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState(profile.name);
  const [faculty, setFaculty] = useState<FacultyId | undefined>(profile.faculty);
  const [goal, setGoal] = useState(profile.goalScore);

  const stepIndex = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);
  const facultyMeta = faculty ? FACULTY_MAP[faculty] : null;

  const finish = () => {
    updateProfile({ name: name.trim(), faculty, goalScore: goal, onboarded: true });
  };

  const handleSelectFaculty = (id: FacultyId) => {
    setFaculty(id);
  };

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label="Kom igång med Magister HP">
      <div
        className={`onboarding__panel${step === 'celebration' ? ' onboarding__panel--celebration' : ''}`}
        style={
          step === 'celebration' && facultyMeta
            ? ({ '--faculty-color': facultyMeta.color } as React.CSSProperties)
            : undefined
        }
      >
        {step !== 'celebration' && (
          <>
            <div className="onboarding__brand">
              <span className="logo__mark">
                <BrandMark size={22} />
              </span>{' '}
              Magister HP
            </div>
            <div className="onboarding__dots" aria-hidden="true">
              {STEP_ORDER.map((s, i) => (
                <span
                  key={s}
                  className={`onboarding__dot${i === stepIndex ? ' onboarding__dot--active' : ''}${i < stepIndex ? ' onboarding__dot--done' : ''}`}
                />
              ))}
            </div>
          </>
        )}

        {step === 'name' && (
          <div className="onboarding__step">
            <h1 className="onboarding__title">Välkommen! 👋</h1>
            <p className="onboarding__sub">
              Magister HP hjälper dig träna inför högskoleprovet. Vad ska vi kalla dig?
            </p>
            <input
              type="text"
              className="field__input onboarding__name-input"
              value={name}
              placeholder="Ditt namn"
              maxLength={40}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setStep('faculty');
              }}
            />
            <div className="onboarding__actions">
              <button type="button" className="btn btn--primary btn--lg" onClick={() => setStep('faculty')}>
                Fortsätt <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'faculty' && (
          <div className="onboarding__step">
            <h1 className="onboarding__title">Välj din fakultet</h1>
            <p className="onboarding__sub">
              Vad siktar du på att plugga? Du representerar din fakultet i appen – och i framtida
              tävlingar. Du kan byta när som helst på din profil.
            </p>
            <FacultyPicker value={faculty} onChange={handleSelectFaculty} />
            <div className="onboarding__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setStep('name')}>
                <IconArrowLeft size={16} /> Tillbaka
              </button>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                disabled={!faculty}
                onClick={() => setStep('goal')}
              >
                Fortsätt <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'goal' && (
          <div className="onboarding__step">
            <h1 className="onboarding__title">Sätt ditt mål</h1>
            <p className="onboarding__sub">
              Vilket resultat siktar du på? Skalan går från 0,0 till 2,0 – snittet på provet brukar
              ligga runt 0,9. Du kan ändra målet senare.
            </p>
            <div className="onboarding__goal-value">{formatScore(goal)}</div>
            <input
              type="range"
              className="field__range"
              min={0}
              max={2}
              step={0.05}
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              aria-label="Målpoäng mellan 0,0 och 2,0"
            />
            <div className="range-scale">
              <span>0,0</span>
              <span>1,0</span>
              <span>2,0</span>
            </div>
            <div className="onboarding__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setStep('faculty')}>
                <IconArrowLeft size={16} /> Tillbaka
              </button>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => setStep('celebration')}
              >
                Klar! <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'celebration' && facultyMeta && (
          <div className="onboarding__step onboarding__step--celebration">
            <div className="onboarding__confetti" aria-hidden="true">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={`confetti confetti--${i % 6}`} />
              ))}
            </div>
            <span className="onboarding__crest" aria-hidden="true">
              {facultyMeta.emoji}
            </span>
            <h1 className="onboarding__title">
              Välkommen till {facultyMeta.name}{name.trim() ? `, ${name.trim().split(/\s+/)[0]}` : ''}!
            </h1>
            <p className="onboarding__motto">”{facultyMeta.motto}”</p>
            <p className="onboarding__sub">
              Ditt mål: <strong>{formatScore(goal)}</strong>. Varje pass du kör gör dig – och din
              fakultet – starkare. Lycka till!
            </p>
            <div className="onboarding__actions onboarding__actions--center">
              <button type="button" className="btn btn--primary btn--lg" onClick={finish}>
                Nu kör vi! 🚀
              </button>
            </div>
          </div>
        )}

        {step !== 'celebration' && (
          <button
            type="button"
            className="onboarding__skip"
            onClick={() => updateProfile({ name: name.trim(), faculty, goalScore: goal, onboarded: true })}
          >
            Hoppa över
          </button>
        )}
      </div>
    </div>
  );
}
