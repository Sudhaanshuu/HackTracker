// Database types matching the new schema
export interface Participant {
  id?: number;
  team_id: number;
  name: string;
  background: string;
  role: string;
  created_at?: string;
}

export interface Milestones {
  id?: number;
  team_id: number;
  brainstorming_complete: boolean;
  brainstorming_pending: boolean;
  prd_generated: boolean;
  prd_pending: boolean;
  build_complete: boolean;
  build_pending: boolean;
  updated_at?: string;
}

export interface ToolUsage {
  id?: number;
  team_id: number;
  coding_tools: string[];
  llm_used: string;
  updated_at?: string;
}

export interface ProgressUpdates {
  id?: number;
  team_id: number;
  screen_recording_url: string;
  submission_url: string;
  updated_at?: string;
}

export interface Evaluation {
  id?: number;
  team_id: number;
  novelty: number; // 1-5
  fastest_to_build: number; // 1-5
  feature_count: number; // 1-5
  clarity: number; // 1-5
  impact_reach: number; // 1-5
  total_score?: number; // Auto-calculated
  updated_at?: string;
}

export interface Team {
  id?: number;
  team_number: number;
  name: string;
  password: string;
  problem_statement: string;
  theme: string;
  elo_score: number;
  created_at?: string;
  updated_at?: string;
  // Related data
  participants?: Participant[];
  milestones?: Milestones;
  tool_usage?: ToolUsage;
  progress_updates?: ProgressUpdates;
  evaluation?: Evaluation;
}

// App state for the new workflow
export interface AppState {
  currentView: 'landing' | 'create-team' | 'team-dashboard' | 'admin-dashboard';
  currentTeam?: Team;
  teams: Team[];
}