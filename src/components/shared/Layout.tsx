import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  title?: string;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = false, 
  sidebarContent,
  title,
  onBack 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            {onBack && (
              <button className="navbar-back" onClick={onBack}>
                ← Back
              </button>
            )}
            <div className="navbar-brand">
              <span className="brand-icon">🏆</span>
              <span className="brand-text">HackTracker</span>
            </div>
          </div>
          
          {title && (
            <h1 className="navbar-title" style={{ 
              display: isMobile ? 'none' : 'block' 
            }}>
              {title}
            </h1>
          )}
          
          {showSidebar && (
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Sidebar */}
        {showSidebar && (
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
              {sidebarContent}
            </div>
          </aside>
        )}

        {/* Overlay for mobile */}
        {showSidebar && sidebarOpen && isMobile && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 98,
              top: '56px'
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`main-content ${showSidebar && sidebarOpen && !isMobile ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-brand">🏆 HackTracker</span>
            <span className="footer-tagline" style={{ display: isMobile ? 'none' : 'inline' }}>
              Track your hackathon journey
            </span>
          </div>
          <div className="footer-center" style={{ display: isMobile ? 'none' : 'block' }}>
            <p>&copy; 2026 Hackathon Tracker</p>
          </div>
          <div className="footer-right">
            <span className="footer-version">v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
