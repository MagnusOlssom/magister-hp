import { NavLink, Outlet, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import DarkModeToggle from './DarkModeToggle';
import { IconChart, IconClock, IconHome, IconPlay, IconSparkle, IconUser } from './icons';

const NAV_ITEMS = [
  { to: '/', label: 'Översikt', icon: IconHome, end: true },
  { to: '/trana', label: 'Träna', icon: IconPlay, end: false },
  { to: '/analys', label: 'Analys', icon: IconSparkle, end: false },
  { to: '/historik', label: 'Historik', icon: IconClock, end: false },
  { to: '/statistik', label: 'Statistik', icon: IconChart, end: false },
  { to: '/profil', label: 'Profil', icon: IconUser, end: false },
];

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="HPfokus – till översikten">
      <span className="logo__mark">HP</span>
      <span className="logo__text">
        HPfokus
        <span className="logo__tagline">Träna inför högskoleprovet</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { profile } = useApp();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="sidebar__nav" aria-label="Huvudmeny">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <DarkModeToggle />
          <Link to="/profil" className="sidebar__profile">
            <Avatar name={profile.name} src={profile.avatar} size={36} />
            <span className="sidebar__profile-name">{profile.name || 'Din profil'}</span>
          </Link>
        </div>
      </aside>

      <header className="mobile-header">
        <Logo />
        <div className="mobile-header__actions">
          <DarkModeToggle compact />
          <Link to="/profil" aria-label="Profil">
            <Avatar name={profile.name} src={profile.avatar} size={34} />
          </Link>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Huvudmeny">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `tabbar__item${isActive ? ' tabbar__item--active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
