import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarClass = [
    'sidebar',
    !isMobile && isCollapsed ? 'collapsed' : '',
    isMobile && isMobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile hamburger OUTSIDE sidebar */}
      {isMobile && (
        <button
          className={`hamburger mobile-hamburger ${isMobileOpen ? 'open' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{ position: 'fixed', top: 16, left: 16, zIndex: 1001 }}
        >
          <span className="ham-line"></span>
          <span className="ham-line"></span>
          <span className="ham-line"></span>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''}`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClass}>
        <div className="sidebar-glow"></div>

        {/* Desktop hamburger inside sidebar */}
        {!isMobile && (
          <button
            className={`hamburger ${isCollapsed ? '' : 'open'}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span className="ham-line"></span>
            <span className="ham-line"></span>
            <span className="ham-line"></span>
          </button>
        )}

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