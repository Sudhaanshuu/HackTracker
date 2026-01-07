
import { Team, UserRole } from './types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Eco-Warriors',
    mentorId: 'mentor-1',
    problemStatement: 'Reducing household carbon footprints through smart IoT monitoring.',
    theme: 'Sustainability',
    participants: [
      { name: 'Alice Chen', background: 'CS', role: 'Frontend' },
      { name: 'Bob Smith', background: 'EE', role: 'IoT Lead' },
      { name: 'Charlie Day', background: 'Design', role: 'UI/UX' },
      { name: 'Dana White', background: 'CS', role: 'Backend' },
      { name: 'Eve Black', background: 'Biz', role: 'Product' }
    ],
    milestones: { brainstorming: true, prdGenerated: true, buildComplete: false },
    toolUsage: { codingTools: ['React', 'Node.js', 'Python'], llmUsed: 'Gemini 2.5 Flash' },
    progressUpdates: { recordingLink: '', submissionLink: '' },
    evaluation: { novelty: 4, speed: 3, features: 2, clarity: 5, impact: 4 },
    eloScore: 1200
  },
  {
    id: 'team-2',
    name: 'HealthBridge',
    mentorId: 'mentor-1',
    problemStatement: 'Connecting rural patients with specialized city doctors via WebRTC.',
    theme: 'Healthcare',
    participants: [
      { name: 'Frank Lee', background: 'Med', role: 'Expert' },
      { name: 'Grace Ho', background: 'CS', role: 'Fullstack' },
      { name: 'Henry Ford', background: 'CS', role: 'DevOps' },
      { name: 'Ivy Blue', background: 'Marketing', role: 'Pitch' },
      { name: 'Jack Ma', background: 'CS', role: 'Frontend' }
    ],
    milestones: { brainstorming: true, prdGenerated: true, buildComplete: true },
    toolUsage: { codingTools: ['Next.js', 'Socket.io'], llmUsed: 'GPT-4' },
    progressUpdates: { recordingLink: 'https://youtube.com/demo', submissionLink: 'https://github.com/hb' },
    evaluation: { novelty: 3, speed: 5, features: 4, clarity: 4, impact: 5 },
    eloScore: 1450
  },
  {
    id: 'team-3',
    name: 'FinFlow',
    mentorId: 'mentor-1',
    problemStatement: 'DeFi protocol for micro-lending in developing economies.',
    theme: 'FinTech',
    participants: [
      { name: 'Karl Marx', background: 'Econ', role: 'Strategy' },
      { name: 'Lara Croft', background: 'CS', role: 'Solidity' },
      { name: 'Mike Ross', background: 'Law', role: 'Compliance' },
      { name: 'Nina Simone', background: 'Design', role: 'Creative' },
      { name: 'Oscar Wilde', background: 'Writing', role: 'Content' }
    ],
    milestones: { brainstorming: true, prdGenerated: false, buildComplete: false },
    toolUsage: { codingTools: ['Hardhat', 'Ethers.js'], llmUsed: 'Claude 3' },
    progressUpdates: { recordingLink: '', submissionLink: '' },
    evaluation: { novelty: 5, speed: 2, features: 1, clarity: 3, impact: 5 },
    eloScore: 1100
  }
];

export const MENTORS = [
  { id: 'mentor-1', name: 'Dr. Sarah Green', assignedTeams: ['team-1', 'team-2', 'team-3'] }
];
