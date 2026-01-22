import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Experiment Tracker</Link>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
          >
            Squads
          </Link>
          <Link
            to="/all-experiments"
            className={`nav-link ${isActive('/all-experiments') ? 'active' : ''}`}
          >
            All Experiments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
