import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger OUTSIDE sidebar */}
      <button
        className={`hamburger mobile-hamburger ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{ position: 'fixed', top: 16, left: 16, zIndex: 1001 }}
      >
        <span className="ham-line"></span>
        <span className="ham-line"></span>
        <span className="ham-line"></span>
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-glow"></div>

        {/* Desktop hamburger inside sidebar */}
        <button
          className={`hamburger ${isCollapsed ? '' : 'open'}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="ham-line"></span>
          <span className="ham-line"></span>
          <span className="ham-line"></span>
        </button>

        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <span className="logo-text">SPOKIO</span>
        </div>

        <div className="nav-section-label">Main Interface</div>

        <nav className="sidebar-nav">
          <div className="nav-item">
            <NavLink
              to="/voice-panel"
              className="nav-link voice"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-icon">🎙️</span>
              <span className="nav-label">VOICE PANEL</span>
            </NavLink>
          </div>

          <div className="nav-item">
            <NavLink
              to="/community"
              className="nav-link community"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-icon">🌐</span>
              <span className="nav-label">COMMUNITY</span>
            </NavLink>
          </div>

          <div className="nav-item">
            <NavLink
              to="/emergency"
              className="nav-link emergency"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-icon">⚠️</span>
              <span className="nav-label">EMERGENCY SOS</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">v1.0.42_READY</div>
      </div>
    </>
  );
};

export default Sidebar;