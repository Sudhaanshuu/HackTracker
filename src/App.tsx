import React, { useState, useEffect } from 'react';
import { AppState, Team } from './types';
import { dataService } from './services/dataService';
import LandingPage from './components/LandingPage';
import CreateTeamForm from './components/CreateTeamForm';
import TeamDashboard from './components/TeamDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Leaderboard from './components/Leaderboard';
import LoadingSpinner from './components/shared/LoadingSpinner';
import './styles/main.css';

type Route = 'landing' | 'create-team' | 'team-dashboard' | 'admin-login' | 'admin-dashboard' | 'leaderboard';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Handle URL routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (isAdminAuthenticated) {
          setCurrentRoute('admin-dashboard');
        } else {
          setCurrentRoute('admin-login');
        }
      } else if (path === '/leaderboard') {
        setCurrentRoute('leaderboard');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [isAdminAuthenticated]);

  // Navigate to a route
  const navigateTo = (route: Route) => {
    if (route === 'admin-login' || route === 'admin-dashboard') {
      window.history.pushState({}, '', '/admin');
    } else if (route === 'leaderboard') {
      window.history.pushState({}, '', '/leaderboard');
    } else if (route === 'landing') {
      window.history.pushState({}, '', '/');
    }
    setCurrentRoute(route);
  };

  // Load all teams for admin view
  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await dataService.getAllTeams();
      setTeams(teamsData);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle team creation
  const handleCreateTeam = async (teamData: {
    name: string;
    password: string;
    problem_statement?: string;
    theme?: string;
    participants: Array<{ name: string; background: string; role: string }>;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const newTeam = await dataService.createTeam(teamData);
      setCurrentTeam(newTeam);
      setTeams(prev => [...prev, newTeam]);
      navigateTo('team-dashboard');
    } catch (err) {
      setError('Failed to create team');
      console.error('Error creating team:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle team login
  const handleTeamLogin = async (teamNumber: number, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const team = await dataService.getTeamByCredentials(teamNumber, password);
      if (team) {
        setCurrentTeam(team);
        navigateTo('team-dashboard');
      } else {
        setError('Invalid team number or password');
      }
    } catch (err) {
      setError('Failed to login');
      console.error('Error logging in:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    loadTeams();
    navigateTo('admin-dashboard');
  };

  // Handle navigation back to landing
  const handleBackToLanding = () => {
    setCurrentTeam(null);
    setError(null);
    navigateTo('landing');
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setTeams([]);
    navigateTo('landing');
  };

  // Handle team updates
  const handleTeamUpdate = async (teamId: number): Promise<void> => {
    try {
      setError(null);
      const updatedTeam = await dataService.getTeamById(teamId);
      
      setCurrentTeam(prev => prev?.id === teamId ? updatedTeam : prev);
      setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team));
    } catch (err) {
      setError('Failed to update team');
      console.error('Error updating team:', err);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {currentRoute === 'landing' && (
        <LandingPage
          onCreateTeam={() => navigateTo('create-team')}
          onTeamLogin={handleTeamLogin}
          onLeaderboard={() => navigateTo('leaderboard')}
        />
      )}

      {currentRoute === 'create-team' && (
        <CreateTeamForm
          onCreateTeam={handleCreateTeam}
          onBack={handleBackToLanding}
        />
      )}

      {currentRoute === 'team-dashboard' && currentTeam && (
        <TeamDashboard
          team={currentTeam}
          onUpdate={handleTeamUpdate}
          onBack={handleBackToLanding}
          onLeaderboard={() => navigateTo('leaderboard')}
        />
      )}

      {currentRoute === 'admin-login' && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onBack={handleBackToLanding}
        />
      )}

      {currentRoute === 'admin-dashboard' && isAdminAuthenticated && (
        <AdminDashboard
          teams={teams}
          onTeamUpdate={handleTeamUpdate}
          onBack={handleAdminLogout}
          onRefresh={loadTeams}
        />
      )}

      {currentRoute === 'leaderboard' && (
        <Leaderboard onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;