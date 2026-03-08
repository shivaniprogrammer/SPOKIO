import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* 1. Sidebar Container with dynamic collapsed class */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-glow"></div>
        
        {/* 2. Hamburger Toggle */}
        <button 
          className={`hamburger ${isCollapsed ? '' : 'open'}`} 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="ham-line"></span>
          <span className="ham-line"></span>
          <span className="ham-line"></span>
        </button>

        {/* 3. Logo Section */}
        <div className="sidebar-logo">
          <div className="logo-icon">S</div>
          <span className="logo-text">SPOKIO</span>
        </div>

        <div className="nav-section-label">Main Interface</div>

        {/* 4. Navigation Links with specific color classes from your CSS */}

<nav className="sidebar-nav">
  <div className="nav-item">
    <NavLink to="/voice-panel" className="nav-link voice">
      <span className="nav-icon">🎙️</span>
      <span className="nav-label">VOICE PANEL</span>
    </NavLink>
  </div>

  <div className="nav-item">
    <NavLink to="/community" className="nav-link community">
      <span className="nav-icon">🌐</span>
      <span className="nav-label">COMMUNITY</span>
    </NavLink>
  </div>

  <div className="nav-item">
    <NavLink to="/emergency" className="nav-link emergency">
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