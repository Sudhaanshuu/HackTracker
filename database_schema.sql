-- New Hackathon Tracker Database Schema
-- Drop existing tables if they exist
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS progress_updates CASCADE;
DROP TABLE IF EXISTS tool_usage CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Teams table - core team information
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  team_number INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL, -- Simple password for team access
  problem_statement TEXT,
  theme VARCHAR(255),
  elo_score INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table - team members
CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  background TEXT,
  role VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table - track progress milestones
CREATE TABLE milestones (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  brainstorming_complete BOOLEAN DEFAULT FALSE,
  brainstorming_pending BOOLEAN DEFAULT FALSE,
  prd_generated BOOLEAN DEFAULT FALSE,
  prd_pending BOOLEAN DEFAULT FALSE,
  build_complete BOOLEAN DEFAULT FALSE,
  build_pending BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool usage table - track tools used by teams
CREATE TABLE tool_usage (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  coding_tools TEXT[], -- Array of coding tools
  llm_used VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress updates table - submissions and recordings
CREATE TABLE progress_updates (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  screen_recording_url TEXT,
  submission_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table - scoring system
CREATE TABLE evaluations (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  novelty INTEGER CHECK (novelty >= 1 AND novelty <= 5),
  fastest_to_build INTEGER CHECK (fastest_to_build >= 1 AND fastest_to_build <= 5),
  feature_count INTEGER CHECK (feature_count >= 1 AND feature_count <= 5),
  clarity INTEGER CHECK (clarity >= 1 AND clarity <= 5),
  impact_reach INTEGER CHECK (impact_reach >= 1 AND impact_reach <= 5),
  total_score INTEGER GENERATED ALWAYS AS (novelty + fastest_to_build + feature_count + clarity + impact_reach) STORED,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teams_team_number ON teams(team_number);
CREATE INDEX idx_participants_team_id ON participants(team_id);
CREATE INDEX idx_milestones_team_id ON milestones(team_id);
CREATE INDEX idx_tool_usage_team_id ON tool_usage(team_id);
CREATE INDEX idx_progress_updates_team_id ON progress_updates(team_id);
CREATE INDEX idx_evaluations_team_id ON evaluations(team_id);

-- Create triggers to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_usage_updated_at BEFORE UPDATE ON tool_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updates_updated_at BEFORE UPDATE ON progress_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO teams (team_number, name, password, problem_statement, theme) VALUES
(1, 'Team Alpha', 'alpha123', 'AI-powered learning platform', 'Education'),
(2, 'Team Beta', 'beta456', 'Sustainable energy tracker', 'Environment');

-- Insert sample participants
INSERT INTO participants (team_id, name, background, role) VALUES
(1, 'John Doe', 'Computer Science Student', 'Developer'),
(1, 'Jane Smith', 'UX Designer', 'Designer'),
(2, 'Mike Johnson', 'Environmental Engineer', 'Lead'),
(2, 'Sarah Wilson', 'Data Scientist', 'Analyst');

-- Initialize milestones for teams
INSERT INTO milestones (team_id) VALUES (1), (2);

-- Initialize tool usage for teams
INSERT INTO tool_usage (team_id) VALUES (1), (2);

-- Initialize progress updates for teams
INSERT INTO progress_updates (team_id) VALUES (1), (2);

-- Initialize evaluations for teams
INSERT INTO evaluations (team_id, novelty, fastest_to_build, feature_count, clarity, impact_reach) VALUES
(1, 4, 3, 5, 4, 4),
(2, 3, 4, 3, 5, 3);