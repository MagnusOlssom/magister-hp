import { useApp } from '../context/AppContext';
import { IconMoon, IconSun } from './icons';

interface Props {
  /** Kompakt variant utan textetikett (för t.ex. mobilheadern). */
  compact?: boolean;
}

export default function DarkModeToggle({ compact = false }: Props) {
  const { theme, toggleTheme } = useApp();
  const dark = theme === 'dark';
  const label = dark ? 'Byt till ljust läge' : 'Byt till mörkt läge';

  if (compact) {
    return (
      <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={label} title={label}>
        {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
      </button>
    );
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label}>
      {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
      <span>{dark ? 'Ljust läge' : 'Mörkt läge'}</span>
    </button>
  );
}
