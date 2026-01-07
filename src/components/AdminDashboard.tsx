import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { dataService } from '../services/dataService';
import Button from './shared/Button';
import Layout from './shared/Layout';
import ConfirmModal from './shared/ConfirmModal';

interface AdminDashboardProps {
  teams: Team[];
  onTeamUpdate: (teamId: number) => void;
  onBack: () => void;
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ teams, onTeamUpdate, onBack, onRefresh }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Local state for evaluation scores (only update on button click)
  const [evalScores, setEvalScores] = useState({
    novelty: 1,
    fastest_to_build: 1,
    feature_count: 1,
    clarity: 1,
    impact_reach: 1,
  });

  // Update local eval scores when selected team changes
  useEffect(() => {
    if (selectedTeam?.evaluation) {
      setEvalScores({
        novelty: selectedTeam.evaluation.novelty || 1,
        fastest_to_build: selectedTeam.evaluation.fastest_to_build || 1,
        feature_count: selectedTeam.evaluation.feature_count || 1,
        clarity: selectedTeam.evaluation.clarity || 1,
        impact_reach: selectedTeam.evaluation.impact_reach || 1,
      });
    }
  }, [selectedTeam]);

  // Get pending approvals count
  const getPendingCount = () => {
    return teams.reduce((count, team) => {
      const pending = [
        team.milestones?.brainstorming_pending,
        team.milestones?.prd_pending,
        team.milestones?.build_pending,
      ].filter(Boolean).length;
      return count + pending;
    }, 0);
  };

  const handleApproval = (teamId: number, milestoneType: string, approve: boolean) => {
    const action = approve ? 'approve' : 'reject';
    setConfirmModal({
      isOpen: true,
      title: `${approve ? 'Approve' : 'Reject'} Milestone`,
      message: `Are you sure you want to ${action} this milestone?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const pendingField = `${milestoneType}_pending`;
          let completeField = '';
          
          if (milestoneType === 'brainstorming') {
            completeField = 'brainstorming_complete';
          } else if (milestoneType === 'prd') {
            completeField = 'prd_generated';
          } else if (milestoneType === 'build') {
            completeField = 'build_complete';
          }
          
          if (approve) {
            await dataService.updateMilestones(teamId, { 
              [completeField]: true,
              [pendingField]: false 
            });
          } else {
            await dataService.updateMilestones(teamId, { [pendingField]: false });
          }
          
          await onTeamUpdate(teamId);
          await onRefresh();
          
          // Update selected team
          const updatedTeam = await dataService.getTeamById(teamId);
          setSelectedTeam(updatedTeam);
        } catch (error) {
          console.error('Error updating milestone:', error);
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Save all evaluation scores at once
  const handleSaveEvaluation = () => {
    if (!selectedTeam?.id) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Update Evaluation Scores',
      message: 'Are you sure you want to save these evaluation scores?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await dataService.updateEvaluation(selectedTeam.id!, evalScores);
          await onTeamUpdate(selectedTeam.id!);
          await onRefresh();
          
          // Update selected team
          const updatedTeam = await dataService.getTeamById(selectedTeam.id!);
          setSelectedTeam(updatedTeam);
        } catch (error) {
          console.error('Error updating evaluation:', error);
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDirectMilestoneUpdate = (teamId: number, milestone: string, value: boolean) => {
    setConfirmModal({
      isOpen: true,
      title: 'Update Milestone',
      message: `Are you sure you want to ${value ? 'mark as complete' : 'mark as incomplete'} this milestone?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await dataService.updateMilestones(teamId, { [milestone]: value });
          await onTeamUpdate(teamId);
          await onRefresh();
          
          // Update selected team
          const updatedTeam = await dataService.getTeamById(teamId);
          setSelectedTeam(updatedTeam);
        } catch (error) {
          console.error('Error updating milestone:', error);
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
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

  const pendingCount = getPendingCount();
  const localTotal = evalScores.novelty + evalScores.fastest_to_build + evalScores.feature_count + evalScores.clarity + evalScores.impact_reach;

  const sidebarContent = (
    <div className="admin-sidebar">
      <div className="sidebar-section">
        <h3>📊 Dashboard Stats</h3>
        <div className="sidebar-stats">
          <div className="stat-card">
            <span className="stat-value">{teams.length}</span>
            <span className="stat-label">Total Teams</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">Pending Approvals</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>🏆 Teams</h3>
        <div className="teams-list-sidebar">
          {teams.map((team) => (
            <button
              key={team.id}
              className={`team-list-item ${selectedTeam?.id === team.id ? 'active' : ''}`}
              onClick={() => setSelectedTeam(team)}
            >
              <span className="team-number">#{team.team_number}</span>
              <span className="team-name">{team.name}</span>
              {(team.milestones?.brainstorming_pending || team.milestones?.prd_pending || team.milestones?.build_pending) && (
                <span className="pending-badge">!</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <Button variant="secondary" onClick={onRefresh} className="refresh-btn">
          🔄 Refresh Data
        </Button>
      </div>
    </div>
  );

  return (
    <Layout 
      title="Admin Dashboard"
      showSidebar={true}
      sidebarContent={sidebarContent}
      onBack={onBack}
    >
      <div className="admin-dashboard-content">
        {!selectedTeam ? (
          <div className="admin-overview">
            <div className="overview-header">
              <h2>Teams Overview</h2>
              {pendingCount > 0 && (
                <div className="pending-alert">
                  ⚠️ {pendingCount} milestone{pendingCount > 1 ? 's' : ''} pending approval
                </div>
              )}
            </div>

            <div className="teams-grid">
              {teams.map((team) => {
                const hasPending = team.milestones?.brainstorming_pending || 
                                   team.milestones?.prd_pending || 
                                   team.milestones?.build_pending;
                return (
                  <div
                    key={team.id}
                    className={`team-card ${hasPending ? 'has-pending' : ''}`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    {hasPending && <div className="pending-indicator">Needs Review</div>}
                    <div className="team-card-header">
                      <h3>Team #{team.team_number}</h3>
                      <span className="progress-badge">{calculateProgress(team)}%</span>
                    </div>
                    <h4 className="team-name">{team.name}</h4>
                    <p className="team-theme">{team.theme || 'No theme'}</p>
                    <div className="team-card-stats">
                      <span>👥 {team.participants?.length || 0} members</span>
                      <span>⭐ {team.evaluation?.total_score || 0}/25</span>
                    </div>
                    <div className="milestone-dots">
                      <span className={`dot ${team.milestones?.brainstorming_complete ? 'complete' : team.milestones?.brainstorming_pending ? 'pending' : ''}`} title="Brainstorming"></span>
                      <span className={`dot ${team.milestones?.prd_generated ? 'complete' : team.milestones?.prd_pending ? 'pending' : ''}`} title="PRD"></span>
                      <span className={`dot ${team.milestones?.build_complete ? 'complete' : team.milestones?.build_pending ? 'pending' : ''}`} title="Build"></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="team-detail-view">
            <div className="detail-header">
              <button className="back-to-list" onClick={() => setSelectedTeam(null)}>
                ← Back to Teams
              </button>
              <h2>Team #{selectedTeam.team_number}: {selectedTeam.name}</h2>
            </div>

            <div className="detail-sections">
              {/* Pending Approvals Section */}
              {(selectedTeam.milestones?.brainstorming_pending || 
                selectedTeam.milestones?.prd_pending || 
                selectedTeam.milestones?.build_pending) && (
                <div className="detail-section pending-section">
                  <h3>⏳ Pending Approvals</h3>
                  <div className="pending-list">
                    {selectedTeam.milestones?.brainstorming_pending && (
                      <div className="pending-item">
                        <span>💡 Brainstorming Complete</span>
                        <div className="pending-actions">
                          <Button variant="primary" onClick={() => handleApproval(selectedTeam.id!, 'brainstorming', true)} disabled={loading}>
                            ✓ Approve
                          </Button>
                          <Button variant="secondary" onClick={() => handleApproval(selectedTeam.id!, 'brainstorming', false)} disabled={loading}>
                            ✕ Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedTeam.milestones?.prd_pending && (
                      <div className="pending-item">
                        <span>📄 PRD Generated</span>
                        <div className="pending-actions">
                          <Button variant="primary" onClick={() => handleApproval(selectedTeam.id!, 'prd', true)} disabled={loading}>
                            ✓ Approve
                          </Button>
                          <Button variant="secondary" onClick={() => handleApproval(selectedTeam.id!, 'prd', false)} disabled={loading}>
                            ✕ Reject
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedTeam.milestones?.build_pending && (
                      <div className="pending-item">
                        <span>🏗️ Build Complete</span>
                        <div className="pending-actions">
                          <Button variant="primary" onClick={() => handleApproval(selectedTeam.id!, 'build', true)} disabled={loading}>
                            ✓ Approve
                          </Button>
                          <Button variant="secondary" onClick={() => handleApproval(selectedTeam.id!, 'build', false)} disabled={loading}>
                            ✕ Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Team Info Section */}
              <div className="detail-section">
                <h3>📋 Team Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Theme</label>
                    <span>{selectedTeam.theme || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <label>ELO Score</label>
                    <span>{selectedTeam.elo_score}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Problem Statement</label>
                    <p>{selectedTeam.problem_statement || 'No problem statement provided.'}</p>
                  </div>
                </div>

                <h4>Team Members</h4>
                <div className="members-grid">
                  {selectedTeam.participants?.map((p, i) => (
                    <div key={i} className="member-card">
                      <div className="member-avatar">{p.name.charAt(0)}</div>
                      <div className="member-info">
                        <span className="member-name">{p.name}</span>
                        <span className="member-role">{p.role || 'Member'}</span>
                        <span className="member-bg">{p.background}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Section */}
              <div className="detail-section">
                <h3>🎯 Milestones Management</h3>
                <div className="milestones-admin-grid">
                  {[
                    { key: 'brainstorming_complete', label: 'Brainstorming', icon: '💡' },
                    { key: 'prd_generated', label: 'PRD Generated', icon: '📄' },
                    { key: 'build_complete', label: 'Build Complete', icon: '🏗️' },
                  ].map((m) => (
                    <div key={m.key} className="milestone-admin-card">
                      <span className="milestone-icon">{m.icon}</span>
                      <span className="milestone-label">{m.label}</span>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={selectedTeam.milestones?.[m.key as keyof typeof selectedTeam.milestones] as boolean || false}
                          onChange={(e) => handleDirectMilestoneUpdate(selectedTeam.id!, m.key, e.target.checked)}
                          disabled={loading}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluation Section - Now with Update Button */}
              <div className="detail-section">
                <h3>⭐ Evaluation Scores</h3>
                <p className="section-description">Adjust the scores below and click "Update Scores" to save changes.</p>
                
                <div className="evaluation-grid">
                  {[
                    { key: 'novelty', label: 'Novelty', icon: '💡' },
                    { key: 'fastest_to_build', label: 'Speed', icon: '⚡' },
                    { key: 'feature_count', label: 'Features', icon: '🔧' },
                    { key: 'clarity', label: 'Clarity', icon: '🎯' },
                    { key: 'impact_reach', label: 'Impact', icon: '🌍' },
                  ].map((criterion) => (
                    <div key={criterion.key} className="eval-card">
                      <span className="eval-icon">{criterion.icon}</span>
                      <span className="eval-label">{criterion.label}</span>
                      <div className="eval-input">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={evalScores[criterion.key as keyof typeof evalScores]}
                          onChange={(e) => {
                            const value = Math.min(5, Math.max(1, parseInt(e.target.value) || 1));
                            setEvalScores(prev => ({
                              ...prev,
                              [criterion.key]: value
                            }));
                          }}
                          disabled={loading}
                        />
                        <span>/5</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="total-score-card">
                  <span>Total Score</span>
                  <span className="total-value">{localTotal}/25</span>
                </div>
                
                <div className="evaluation-actions">
                  <Button 
                    variant="primary" 
                    onClick={handleSaveEvaluation}
                    disabled={loading}
                    className="update-scores-btn"
                  >
                    💾 Update Scores
                  </Button>
                </div>
              </div>

              {/* Submissions Section */}
              <div className="detail-section">
                <h3>📤 Submissions</h3>
                <div className="submissions-grid">
                  <div className="submission-item">
                    <label>🛠️ Coding Tools</label>
                    <p>{selectedTeam.tool_usage?.coding_tools?.join(', ') || 'Not specified'}</p>
                  </div>
                  <div className="submission-item">
                    <label>🤖 LLM Used</label>
                    <p>{selectedTeam.tool_usage?.llm_used || 'Not specified'}</p>
                  </div>
                  <div className="submission-item">
                    <label>🎥 Screen Recording</label>
                    {selectedTeam.progress_updates?.screen_recording_url ? (
                      <a href={selectedTeam.progress_updates.screen_recording_url} target="_blank" rel="noopener noreferrer">
                        View Recording →
                      </a>
                    ) : (
                      <p className="not-submitted">Not submitted</p>
                    )}
                  </div>
                  <div className="submission-item">
                    <label>📁 Final Submission</label>
                    {selectedTeam.progress_updates?.submission_url ? (
                      <a href={selectedTeam.progress_updates.submission_url} target="_blank" rel="noopener noreferrer">
                        View Submission →
                      </a>
                    ) : (
                      <p className="not-submitted">Not submitted</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type="warning"
      />
    </Layout>
  );
};

export default AdminDashboard;