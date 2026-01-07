import React, { useState } from 'react';
import { Team, Evaluation } from '../types';

interface MentorDashboardProps {
  teams: Team[];
  onUpdateTeam: (team: Team) => void;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ teams, onUpdateTeam }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');

  const activeTeam = teams.find(t => t.id === selectedTeamId);

  const handleRatingChange = (field: keyof Evaluation, value: number) => {
    if (!activeTeam) return;
    const updatedTeam = {
      ...activeTeam,
      evaluation: {
        ...activeTeam.evaluation,
        [field]: value
      }
    };
    onUpdateTeam(updatedTeam);
  };

  const getProgressPercentage = (team: Team) => {
    let count = 0;
    if (team.milestones.brainstorming) count++;
    if (team.milestones.prdGenerated) count++;
    if (team.milestones.buildComplete) count++;
    return Math.round((count / 3) * 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-500 mt-1 text-lg">Managing {teams.length} assigned teams</p>
        </div>
        <div className="flex gap-2">
          {teams.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border-2 ${
                selectedTeamId === t.id 
                  ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </header>

      {activeTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Group Info & Tools */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">Team Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Problem Statement</label>
                  <p className="text-gray-800 font-medium leading-relaxed">{activeTeam.problemStatement}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Theme</label>
                  <span className="block mt-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full w-fit border border-green-100 uppercase">
                    {activeTeam.theme}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Participants</label>
                  <div className="space-y-2">
                    {activeTeam.participants.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                        <span className="font-bold text-gray-700">{p.name}</span>
                        <span className="text-gray-400 text-xs italic">{p.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">Tools & Stack</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">LLM Used</label>
                  <p className="text-gray-800 font-medium">{activeTeam.toolUsage.llmUsed || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Technologies</label>
                  <div className="flex flex-wrap gap-2">
                    {activeTeam.toolUsage.codingTools.map((tool, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded uppercase">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Progress and Evaluation */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Tracker */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest">Milestones</h2>
                  <span className="text-2xl font-black text-green-600">{getProgressPercentage(activeTeam)}%</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Brainstorming', status: activeTeam.milestones.brainstorming },
                    { label: 'PRD Generated', status: activeTeam.milestones.prdGenerated },
                    { label: 'Build Complete', status: activeTeam.milestones.buildComplete }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.status ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                        <i className={`fas ${m.status ? 'fa-check' : 'fa-circle'} text-xs`}></i>
                      </div>
                      <span className={`text-sm font-semibold ${m.status ? 'text-gray-800' : 'text-gray-400'}`}>{m.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Links</h3>
                  <div className="flex gap-4">
                    <a href={activeTeam.progressUpdates.recordingLink || '#'} target="_blank" className="flex-1 text-center py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-green-50 hover:text-green-600 transition-colors">
                      <i className="fas fa-video mr-1"></i> RECORDING
                    </a>
                    <a href={activeTeam.progressUpdates.submissionLink || '#'} target="_blank" className="flex-1 text-center py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-green-50 hover:text-green-600 transition-colors">
                      <i className="fas fa-code mr-1"></i> CODE
                    </a>
                  </div>
                </div>
              </section>

              {/* Quick Evaluation Summary */}
              <section className="bg-green-600 p-6 rounded-2xl shadow-xl text-white">
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Team Score</h2>
                <div className="text-5xl font-black mb-4">
                  {activeTeam.eloScore} <span className="text-xl font-normal opacity-60">pts</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Current Ranking</span>
                    <span className="font-bold">#{teams.findIndex(t => t.id === activeTeam.id) + 1} / {teams.length}</span>
                  </div>
                  <div className="w-full bg-green-500/30 rounded-full h-1.5">
                    <div className="bg-white h-full rounded-full w-4/5"></div>
                  </div>
                </div>
                <button className="mt-8 w-full py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition-colors">
                  Generate Evaluation Report
                </button>
              </section>
            </div>

            {/* Detailed Evaluation Sliders */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i className="fas fa-chart-line text-green-500"></i>
                Performance Evaluation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(['novelty', 'speed', 'features', 'clarity', 'impact'] as Array<keyof Evaluation>).map((criterion) => (
                  <div key={criterion} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-wider">{criterion}</label>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded font-black text-xs">
                        {activeTeam.evaluation[criterion]} / 5
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={activeTeam.evaluation[criterion]}
                      onChange={(e) => handleRatingChange(criterion, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;