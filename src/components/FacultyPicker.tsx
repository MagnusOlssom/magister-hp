import { FACULTIES } from '../data/faculties';
import type { FacultyId } from '../types';

interface Props {
  value: FacultyId | undefined;
  onChange: (faculty: FacultyId) => void;
  /** Kompakt läge för profilsidan (mindre kort, ingen beskrivning). */
  compact?: boolean;
}

/** Rutnät med fakultetskort. Används i välkomstflödet och på profilsidan. */
export default function FacultyPicker({ value, onChange, compact = false }: Props) {
  return (
    <div
      className={`faculty-grid${compact ? ' faculty-grid--compact' : ''}`}
      role="radiogroup"
      aria-label="Välj fakultet"
    >
      {FACULTIES.map((f) => {
        const selected = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`faculty-card${selected ? ' faculty-card--selected' : ''}`}
            style={{ '--faculty-color': f.color } as React.CSSProperties}
            onClick={() => onChange(f.id)}
          >
            <span className="faculty-card__emoji" aria-hidden="true">
              {f.emoji}
            </span>
            <span className="faculty-card__name">{compact ? f.shortName : f.name}</span>
            {!compact && <span className="faculty-card__desc">{f.description}</span>}
            <span className="faculty-card__check" aria-hidden="true">
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
