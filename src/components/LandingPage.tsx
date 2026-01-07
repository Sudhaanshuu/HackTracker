import React, { useState } from 'react';
import Button from './shared/Button';

interface LandingPageProps {
  onCreateTeam: () => void;
  onTeamLogin: (teamNumber: number, password: string) => void;
  onLeaderboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onCreateTeam,
  onTeamLogin,
  onLeaderboard,
}) => {
  const [showTeamLogin, setShowTeamLogin] = useState(false);
  const [teamNumber, setTeamNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleTeamLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamNumber && password) {
      onTeamLogin(parseInt(teamNumber), password);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="brand-icon">🏆</span>
            <span className="brand-text">HackTracker</span>
          </div>
          <button className="leaderboard-btn" onClick={onLeaderboard}>
            🏆 Leaderboard
          </button>
        </div>
      </nav>

      <div className="landing-container">
        <header className="landing-header">
          <h1>Welcome to the Hackathon!</h1>
          <p className="subtitle">Track your team's progress and milestones</p>
        </header>

        <div className="landing-content">
          <div className="action-cards">
            <div className="action-card">
              <div className="card-icon">👥</div>
              <h3>Create New Team</h3>
              <p>Register your team and get started with tracking your hackathon progress</p>
              <Button onClick={onCreateTeam} variant="primary">
                Create Team
              </Button>
            </div>

            <div className="action-card">
              <div className="card-icon">🔑</div>
              <h3>Access Your Team</h3>
              <p>Already have a team? Enter your team number and password to continue</p>
              {!showTeamLogin ? (
                <Button onClick={() => setShowTeamLogin(true)} variant="secondary">
                  Team Login
                </Button>
              ) : (
                <form onSubmit={handleTeamLogin} className="team-login-form">
                  {error && <div className="form-error">{error}</div>}
                  <div className="form-group">
                    <label htmlFor="teamNumber">Team Number</label>
                    <input
                      type="number"
                      id="teamNumber"
                      value={teamNumber}
                      onChange={(e) => setTeamNumber(e.target.value)}
                      placeholder="Enter team number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter team password"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <Button type="submit" variant="primary">
                      Login
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        setShowTeamLogin(false);
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="features-section">
            <h2>What You Can Track</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📋</span>
                <h4>Team Details</h4>
                <p>Manage team members and their roles</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h4>Milestones</h4>
                <p>Track brainstorming, PRD, and build progress</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛠️</span>
                <h4>Tools & Tech</h4>
                <p>Record coding tools and LLMs used</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📤</span>
                <h4>Submissions</h4>
                <p>Submit recordings and final projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <p>&copy; 2026 HackTracker. Built for tracking hackathon progress.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;