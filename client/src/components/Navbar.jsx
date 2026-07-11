import React from 'react';

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <div className="brand-icon">CJ</div>
          <span>CareerJet</span>
        </a>
        <div className="navbar-links">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          >
            ATS Scanner
          </button>
          <button
            onClick={() => onNavigate('jobs')}
            className={`nav-link ${currentPage === 'jobs' ? 'active' : ''}`}
          >
            Job Board
          </button>
          {currentPage === 'results' && (
            <button
              onClick={() => onNavigate('results')}
              className="nav-link active"
            >
              My Results
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
