import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Command Center', icon: 'bi-grid-1x2' },
  { to: '/simulator', label: 'Base Simulator', icon: 'bi-collection-play' },
  { to: '/directory', label: 'Unit Directory', icon: 'bi-people' },
  { to: '/missions', label: 'Mission Control', icon: 'bi-flag' },
  { to: '/settings', label: 'Settings', icon: 'bi-gear' },
];

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg army-navbar">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-shield-shaded brand-icon" />
          <span className="brand-text">ArmyVerse <strong>3D</strong></span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" />
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto">
            {links.map((l) => (
              <li className="nav-item" key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `nav-link d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${l.icon}`} />
                  <span>{l.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
