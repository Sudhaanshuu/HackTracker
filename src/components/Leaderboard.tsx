import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { dataService } from '../services/dataService';
import Layout from './shared/Layout';
import Button from './shared/Button';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'total' | 'elo' | 'progress'>('total');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await dataService.getAllTeams();
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (team: Team) => {
    if (!team.milestones) return 0;
    const milestones = [
      team.milestones.brainstorming_complete,
      team.milestones.prd_generated,
      team.milestones.build_complete,
    ];
    const completed = milestones.filter(Boolean).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const getSortedTeams = () => {
    return [...teams].sort((a, b) => {
      switch (sortBy) {
        case 'total':
          return (b.evaluation?.total_score || 0) - (a.evaluation?.total_score || 0);
        case 'elo':
          return (b.elo_score || 0) - (a.elo_score || 0);
        case 'progress':
          return calculateProgress(b) - calculateProgress(a);
        default:
          return 0;
      }
    });
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { emoji: '🥇', class: 'gold' };
    if (rank === 2) return { emoji: '🥈', class: 'silver' };
    if (rank === 3) return { emoji: '🥉', class: 'bronze' };
    return { emoji: `#${rank}`, class: 'default' };
  };

  const sortedTeams = getSortedTeams();

  if (loading) {
    return (
      <Layout title="Leaderboard" onBack={onBack}>
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="🏆 Leaderboard" onBack={onBack}>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-info">
            <h2>Team Rankings</h2>
            <p>See how all teams are performing in the hackathon</p>
          </div>
          <div className="sort-controls">
            <span>Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === 'total' ? 'active' : ''}`}
                onClick={() => setSortBy('total')}
              >
                ⭐ Total Score
              </button>
              <button 
                className={`sort-btn ${sortBy === 'elo' ? 'active' : ''}`}
                onClick={() => setSortBy('elo')}
              >
                📊 ELO Rating
              </button>
              <button 
                className={`sort-btn ${sortBy === 'progress' ? 'active' : ''}`}
                onClick={() => setSortBy('progress')}
              >
                📈 Progress
              </button>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortedTeams.length >= 3 && (
          <div className="podium">
            <div className="podium-item second">
              <div className="podium-rank">🥈</div>
              <div className="podium-team">
                <span className="team-number">#{sortedTeams[1].team_number}</span>
                <h3>{sortedTeams[1].name}</h3>
                <span className="team-score">
                  {sortBy === 'total' && `${sortedTeams[1].evaluation?.total_score || 0}/25 pts`}
                  {sortBy === 'elo' && `${sortedTeams[1].elo_score} ELO`}
                  {sortBy === 'progress' && `${calculateProgress(sortedTeams[1])}%`}
                </span>
              </div>
              <div className="podium-stand"></div>
            </div>
            
            <div className="podium-item first">
              <div className="podium-rank">🥇</div>
              <div className="podium-team">
                <span className="team-number">#{sortedTeams[0].team_number}</span>
                <h3>{sortedTeams[0].name}</h3>
                <span className="team-score">
                  {sortBy === 'total' && `${sortedTeams[0].evaluation?.total_score || 0}/25 pts`}
                  {sortBy === 'elo' && `${sortedTeams[0].elo_score} ELO`}
                  {sortBy === 'progress' && `${calculateProgress(sortedTeams[0])}%`}
                </span>
              </div>
              <div className="podium-stand"></div>
            </div>
            
            <div className="podium-item third">
              <div className="podium-rank">🥉</div>
              <div className="podium-team">
                <span className="team-number">#{sortedTeams[2].team_number}</span>
                <h3>{sortedTeams[2].name}</h3>
                <span className="team-score">
                  {sortBy === 'total' && `${sortedTeams[2].evaluation?.total_score || 0}/25 pts`}
                  {sortBy === 'elo' && `${sortedTeams[2].elo_score} ELO`}
                  {sortBy === 'progress' && `${calculateProgress(sortedTeams[2])}%`}
                </span>
              </div>
              <div className="podium-stand"></div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="rankings-table">
          <div className="table-header">
            <span className="col-rank">Rank</span>
            <span className="col-team">Team</span>
            <span className="col-theme">Theme</span>
            <span className="col-progress">Progress</span>
            <span className="col-scores">Scores</span>
            <span className="col-total">Total</span>
            <span className="col-elo">ELO</span>
          </div>
          
          <div className="table-body">
            {sortedTeams.map((team, index) => {
              const rank = index + 1;
              const badge = getRankBadge(rank);
              const progress = calculateProgress(team);
              
              return (
                <div key={team.id} className={`table-row ${badge.class}`}>
                  <span className="col-rank">
                    <span className={`rank-badge ${badge.class}`}>{badge.emoji}</span>
                  </span>
                  <span className="col-team">
                    <div className="team-info">
                      <span className="team-number">#{team.team_number}</span>
                      <span className="team-name">{team.name}</span>
                    </div>
                  </span>
                  <span className="col-theme">
                    <span className="theme-badge">{team.theme || 'N/A'}</span>
                  </span>
                  <span className="col-progress">
                    <div className="progress-bar-mini">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </span>
                  <span className="col-scores">
                    <div className="scores-breakdown">
                      <span title="Novelty">💡{team.evaluation?.novelty || 0}</span>
                      <span title="Speed">⚡{team.evaluation?.fastest_to_build || 0}</span>
                      <span title="Features">🔧{team.evaluation?.feature_count || 0}</span>
                      <span title="Clarity">🎯{team.evaluation?.clarity || 0}</span>
                      <span title="Impact">🌍{team.evaluation?.impact_reach || 0}</span>
                    </div>
                  </span>
                  <span className="col-total">
                    <span className="total-score">{team.evaluation?.total_score || 0}/25</span>
                  </span>
                  <span className="col-elo">
                    <span className="elo-score">{team.elo_score}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {teams.length === 0 && (
          <div className="no-teams">
            <span className="no-teams-icon">🏆</span>
            <h3>No teams yet</h3>
            <p>Teams will appear here once they register for the hackathon.</p>
          </div>
        )}

        <div className="leaderboard-footer">
          <Button variant="secondary" onClick={loadTeams}>
            🔄 Refresh Rankings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;