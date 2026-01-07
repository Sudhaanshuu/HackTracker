import React, { useState } from 'react';
import { Team } from '../types';
import { dataService } from '../services/dataService';
import Button from './shared/Button';
import ProgressBar from './shared/ProgressBar';
import Layout from './shared/Layout';
import ConfirmModal from './shared/ConfirmModal';

interface TeamDashboardProps {
  team: Team;
  onUpdate: (teamId: number) => void;
  onBack: () => void;
  onLeaderboard: () => void;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team, onUpdate, onBack, onLeaderboard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'tools' | 'submissions'>('overview');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Calculate progress percentage (only approved milestones)
  const calculateProgress = () => {
    if (!team.milestones) return 0;
    const milestones = [
      team.milestones.brainstorming_complete,
      team.milestones.prd_generated,
      team.milestones.build_complete,
    ];
    const completed = milestones.filter(Boolean).length;
    return Math.round((completed / milestones.length) * 100);
  };

  // Request milestone approval (sets pending flag)
  const requestMilestoneApproval = async (milestoneKey: string) => {
    if (!team.id) return;
    
    setLoading(true);
    try {
      // Map milestone key to pending field
      let pendingField = '';
      if (milestoneKey === 'brainstorming_complete') {
        pendingField = 'brainstorming_pending';
      } else if (milestoneKey === 'prd_generated') {
        pendingField = 'prd_pending';
      } else if (milestoneKey === 'build_complete') {
        pendingField = 'build_pending';
      }
      
      console.log('Requesting approval for:', pendingField);
      await dataService.updateMilestones(team.id, { [pendingField]: true });
      await onUpdate(team.id);
    } catch (error) {
      console.error('Error requesting approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneRequest = (milestoneKey: string, label: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Request Approval',
      message: `Are you sure you want to request approval for "${label}"? This will be sent to the admin for review.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        await requestMilestoneApproval(milestoneKey);
      }
    });
  };

  const handleToolUsageUpdate = async (field: string, value: string | string[]) => {
    if (!team.id) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Update Tools',
      message: 'Are you sure you want to update the tools information?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await dataService.updateToolUsage(team.id!, { [field]: value });
          onUpdate(team.id!);
        } catch (error) {
          console.error('Error updating tool usage:', error);
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleProgressUpdate = async (field: string, value: string) => {
    if (!team.id) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Update Submission',
      message: 'Are you sure you want to update this submission link?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await dataService.updateProgressUpdates(team.id!, { [field]: value });
          onUpdate(team.id!);
        } catch (error) {
          console.error('Error updating progress:', error);
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const progress = calculateProgress();

  const sidebarContent = (
    <div className="team-sidebar">
      <div className="sidebar-section">
        <h3>Team Info</h3>
        <div className="sidebar-info">
          <p><strong>Team #{team.team_number}</strong></p>
          <p>{team.name}</p>
          <p className="theme-badge">{team.theme || 'No theme'}</p>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Progress</h3>
        <div className="sidebar-progress">
          <div className="progress-circle">
            <span className="progress-value">{progress}%</span>
          </div>
          <p>Overall Completion</p>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Quick Stats</h3>
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-value">{team.participants?.length || 0}</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{team.elo_score}</span>
            <span className="stat-label">ELO Score</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <button className="sidebar-leaderboard-btn" onClick={onLeaderboard}>
          🏆 View Leaderboard
        </button>
      </div>
    </div>
  );

  const getMilestoneStatus = (complete: boolean, pending: boolean) => {
    if (complete) return { status: 'approved', label: 'Approved ✓', className: 'status-approved' };
    if (pending) return { status: 'pending', label: 'Pending Review', className: 'status-pending' };
    return { status: 'not-started', label: 'Not Started', className: 'status-not-started' };
  };

  return (
    <Layout 
      title={`Team #${team.team_number}: ${team.name}`}
      showSidebar={true}
      sidebarContent={sidebarContent}
      onBack={onBack}
    >
      <div className="team-dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'milestones' ? 'active' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            🎯 Milestones
          </button>
          <button
            className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveTab('tools')}
          >
            🛠️ Tools & Tech
          </button>
          <button
            className={`nav-tab ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            📤 Submissions
          </button>
        </nav>

        <div className="dashboard-panel">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-header">
                <h2>Team Overview</h2>
                <div className="progress-bar-container">
                  <ProgressBar progress={progress} />
                  <span className="progress-label">{progress}% Complete</span>
                </div>
              </div>

              <div className="overview-grid">
                <div className="overview-card">
                  <h3>📋 Problem Statement</h3>
                  <p>{team.problem_statement || 'No problem statement provided yet.'}</p>
                </div>

                <div className="overview-card">
                  <h3>👥 Team Members</h3>
                  <div className="participants-list">
                    {team.participants && team.participants.length > 0 ? (
                      team.participants.map((participant, index) => (
                        <div key={index} className="participant-item">
                          <div className="participant-avatar">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="participant-info">
                            <span className="participant-name">{participant.name}</span>
                            <span className="participant-role">{participant.role || 'Team Member'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No team members added yet.</p>
                    )}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>⭐ Current Evaluation</h3>
                  {team.evaluation ? (
                    <div className="evaluation-grid">
                      <div className="eval-item">
                        <span className="eval-label">Novelty</span>
                        <span className="eval-score">{team.evaluation.novelty || 0}/5</span>
                      </div>
                      <div className="eval-item">
                        <span className="eval-label">Speed</span>
                        <span className="eval-score">{team.evaluation.fastest_to_build || 0}/5</span>
                      </div>
                      <div className="eval-item">
                        <span className="eval-label">Features</span>
                        <span className="eval-score">{team.evaluation.feature_count || 0}/5</span>
                      </div>
                      <div className="eval-item">
                        <span className="eval-label">Clarity</span>
                        <span className="eval-score">{team.evaluation.clarity || 0}/5</span>
                      </div>
                      <div className="eval-item">
                        <span className="eval-label">Impact</span>
                        <span className="eval-score">{team.evaluation.impact_reach || 0}/5</span>
                      </div>
                      <div className="eval-total">
                        <span className="eval-label">Total</span>
                        <span className="eval-score">{team.evaluation.total_score || 0}/25</span>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data">No evaluation available yet.</p>
                  )}
                </div>

                <div className="overview-card">
                  <h3>📊 Milestone Status</h3>
                  <div className="milestone-status-list">
                    {[
                      { key: 'brainstorming', label: 'Brainstorming', complete: team.milestones?.brainstorming_complete, pending: team.milestones?.brainstorming_pending },
                      { key: 'prd', label: 'PRD Generated', complete: team.milestones?.prd_generated, pending: team.milestones?.prd_pending },
                      { key: 'build', label: 'Build Complete', complete: team.milestones?.build_complete, pending: team.milestones?.build_pending },
                    ].map((m) => {
                      const status = getMilestoneStatus(m.complete || false, m.pending || false);
                      return (
                        <div key={m.key} className="milestone-status-item">
                          <span className="milestone-label">{m.label}</span>
                          <span className={`milestone-badge ${status.className}`}>{status.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="milestones-tab">
              <h2>🎯 Project Milestones</h2>
              <p className="tab-description">Request approval for completed milestones. Admin will review and approve your progress.</p>
              
              <div className="milestones-list">
                {[
                  { key: 'brainstorming_complete', pendingKey: 'brainstorming_pending', label: 'Brainstorming Complete', desc: 'Initial ideation and concept development finished', icon: '💡' },
                  { key: 'prd_generated', pendingKey: 'prd_pending', label: 'PRD Generated', desc: 'Product Requirements Document created and finalized', icon: '📄' },
                  { key: 'build_complete', pendingKey: 'build_pending', label: 'Build Complete', desc: 'Development and implementation finished', icon: '🏗️' },
                ].map((milestone) => {
                  const isComplete = team.milestones?.[milestone.key as keyof typeof team.milestones] || false;
                  const isPending = team.milestones?.[milestone.pendingKey as keyof typeof team.milestones] || false;
                  const status = getMilestoneStatus(isComplete as boolean, isPending as boolean);
                  
                  return (
                    <div key={milestone.key} className={`milestone-card ${status.className}`}>
                      <div className="milestone-icon">{milestone.icon}</div>
                      <div className="milestone-content">
                        <h3>{milestone.label}</h3>
                        <p>{milestone.desc}</p>
                        <span className={`status-badge ${status.className}`}>{status.label}</span>
                      </div>
                      <div className="milestone-action">
                        {!isComplete && !isPending && (
                          <Button 
                            variant="primary" 
                            onClick={() => handleMilestoneRequest(milestone.key, milestone.label)}
                            disabled={loading}
                          >
                            Request Approval
                          </Button>
                        )}
                        {isPending && !isComplete && (
                          <span className="pending-text">⏳ Awaiting Admin Review</span>
                        )}
                        {isComplete && (
                          <span className="approved-text">✅ Approved</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="tools-tab">
              <h2>🛠️ Tools & Technology</h2>
              <p className="tab-description">Record the tools and technologies your team is using.</p>
              
              <div className="tools-form">
                <div className="form-card">
                  <label htmlFor="codingTools">Coding Tools Used</label>
                  <input
                    type="text"
                    id="codingTools"
                    defaultValue={team.tool_usage?.coding_tools?.join(', ') || ''}
                    placeholder="e.g., VS Code, GitHub, Docker"
                    onBlur={(e) => {
                      const newValue = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      if (JSON.stringify(newValue) !== JSON.stringify(team.tool_usage?.coding_tools || [])) {
                        handleToolUsageUpdate('coding_tools', newValue);
                      }
                    }}
                    disabled={loading}
                  />
                  <small>Separate multiple tools with commas</small>
                </div>

                <div className="form-card">
                  <label htmlFor="llmUsed">LLM Used</label>
                  <input
                    type="text"
                    id="llmUsed"
                    defaultValue={team.tool_usage?.llm_used || ''}
                    placeholder="e.g., GPT-4, Claude, Gemini"
                    onBlur={(e) => {
                      if (e.target.value !== (team.tool_usage?.llm_used || '')) {
                        handleToolUsageUpdate('llm_used', e.target.value);
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="submissions-tab">
              <h2>📤 Submissions & Links</h2>
              <p className="tab-description">Submit your screen recording and final project links.</p>
              
              <div className="submissions-form">
                <div className="form-card">
                  <label htmlFor="screenRecording">🎥 Screen Recording URL</label>
                  <input
                    type="url"
                    id="screenRecording"
                    defaultValue={team.progress_updates?.screen_recording_url || ''}
                    placeholder="https://..."
                    onBlur={(e) => {
                      if (e.target.value !== (team.progress_updates?.screen_recording_url || '')) {
                        handleProgressUpdate('screen_recording_url', e.target.value);
                      }
                    }}
                    disabled={loading}
                  />
                </div>

                <div className="form-card">
                  <label htmlFor="submission">📁 Final Submission URL</label>
                  <input
                    type="url"
                    id="submission"
                    defaultValue={team.progress_updates?.submission_url || ''}
                    placeholder="https://..."
                    onBlur={(e) => {
                      if (e.target.value !== (team.progress_updates?.submission_url || '')) {
                        handleProgressUpdate('submission_url', e.target.value);
                      }
                    }}
                    disabled={loading}
                  />
                </div>

                {(team.progress_updates?.screen_recording_url || team.progress_updates?.submission_url) && (
                  <div className="submissions-preview">
                    <h3>Submitted Links</h3>
                    {team.progress_updates?.screen_recording_url && (
                      <div className="link-item">
                        <span>🎥 Screen Recording:</span>
                        <a href={team.progress_updates.screen_recording_url} target="_blank" rel="noopener noreferrer">
                          View Recording →
                        </a>
                      </div>
                    )}
                    {team.progress_updates?.submission_url && (
                      <div className="link-item">
                        <span>📁 Final Submission:</span>
                        <a href={team.progress_updates.submission_url} target="_blank" rel="noopener noreferrer">
                          View Submission →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        type="info"
      />
    </Layout>
  );
};

export default TeamDashboard;