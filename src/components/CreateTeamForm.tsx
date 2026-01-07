import React, { useState } from 'react';
import Button from './shared/Button';
import Layout from './shared/Layout';

interface CreateTeamFormProps {
  onCreateTeam: (teamData: {
    name: string;
    password: string;
    problem_statement?: string;
    theme?: string;
    participants: Array<{ name: string; background: string; role: string }>;
  }) => void;
  onBack: () => void;
}

interface Participant {
  name: string;
  background: string;
  role: string;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onCreateTeam, onBack }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [theme, setTheme] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', background: '', role: '' }
  ]);

  const addParticipant = () => {
    setParticipants([...participants, { name: '', background: '', role: '' }]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = participants.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty participants
    const validParticipants = participants.filter(p => p.name.trim() !== '');
    
    onCreateTeam({
      name: teamName,
      password,
      problem_statement: problemStatement,
      theme,
      participants: validParticipants,
    });
  };

  const themes = [
    'Education',
    'Healthcare',
    'Environment',
    'Finance',
    'Social Impact',
    'Entertainment',
    'Productivity',
    'Other'
  ];

  return (
    <Layout title="Create New Team" onBack={onBack}>
      <div className="create-team-content">
        <div className="create-team-card">
          <div className="card-header">
            <span className="card-icon">👥</span>
            <h2>Register Your Team</h2>
            <p>Fill in the details to get started with the hackathon</p>
          </div>

          <form onSubmit={handleSubmit} className="create-team-form">
            <div className="form-section">
              <h3>📋 Team Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="teamName">Team Name *</label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Team Password *</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                  <small>Used by team members to access the dashboard</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="theme">Theme</label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="">Select a theme</option>
                    {themes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="problemStatement">Problem Statement</label>
                <textarea
                  id="problemStatement"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the problem your team is solving"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>👥 Team Members</h3>
              
              {participants.map((participant, index) => (
                <div key={index} className="participant-card">
                  <div className="participant-header">
                    <span className="participant-number">Member {index + 1}</span>
                    {participants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="remove-btn"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="participant-fields">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Background</label>
                      <input
                        type="text"
                        value={participant.background}
                        onChange={(e) => updateParticipant(index, 'background', e.target.value)}
                        placeholder="e.g., CS Student, Designer"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Role</label>
                      <input
                        type="text"
                        value={participant.role}
                        onChange={(e) => updateParticipant(index, 'role', e.target.value)}
                        placeholder="e.g., Developer, PM"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addParticipant}
                className="add-member-btn"
              >
                + Add Team Member
              </button>
            </div>

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Team
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTeamForm;