import { supabase } from './supabaseClient';
import { Team, Participant, Milestones, ToolUsage, ProgressUpdates, Evaluation } from '../types';

export class DataService {
  // Team operations
  async createTeam(teamData: {
    name: string;
    password: string;
    problem_statement?: string;
    theme?: string;
    participants: Omit<Participant, 'id' | 'team_id' | 'created_at'>[];
  }): Promise<Team> {
    // Get the next team number
    const { data: lastTeam } = await supabase
      .from('teams')
      .select('team_number')
      .order('team_number', { ascending: false })
      .limit(1);
    
    const nextTeamNumber = lastTeam && lastTeam.length > 0 ? lastTeam[0].team_number + 1 : 1;

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        team_number: nextTeamNumber,
        name: teamData.name,
        password: teamData.password,
        problem_statement: teamData.problem_statement || '',
        theme: teamData.theme || '',
      })
      .select()
      .single();

    if (teamError) throw teamError;

    // Create participants
    if (teamData.participants.length > 0) {
      const participantsToInsert = teamData.participants.map(p => ({
        team_id: team.id,
        name: p.name,
        background: p.background || '',
        role: p.role || '',
      }));

      const { error: participantsError } = await supabase
        .from('participants')
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;
    }

    // Initialize related tables
    await Promise.all([
      supabase.from('milestones').insert({ team_id: team.id }),
      supabase.from('tool_usage').insert({ team_id: team.id }),
      supabase.from('progress_updates').insert({ team_id: team.id }),
      supabase.from('evaluations').insert({ team_id: team.id }),
    ]);

    return this.getTeamById(team.id);
  }

  async getTeamByCredentials(teamNumber: number, password: string): Promise<Team | null> {
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('team_number', teamNumber)
      .eq('password', password)
      .single();

    if (error || !team) return null;

    return this.getTeamById(team.id);
  }

  async getTeamById(teamId: number): Promise<Team> {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError) throw teamError;

    // Get all related data
    const [participants, milestones, toolUsage, progressUpdates, evaluation] = await Promise.all([
      this.getParticipants(teamId),
      this.getMilestones(teamId),
      this.getToolUsage(teamId),
      this.getProgressUpdates(teamId),
      this.getEvaluation(teamId),
    ]);

    return {
      ...team,
      participants,
      milestones,
      tool_usage: toolUsage,
      progress_updates: progressUpdates,
      evaluation,
    };
  }

  async getAllTeams(): Promise<Team[]> {
    const { data: teams, error } = await supabase
      .from('teams')
      .select('*')
      .order('team_number');

    if (error) throw error;

    // Get all related data for each team
    const teamsWithData = await Promise.all(
      teams.map(async (team) => {
        const [participants, milestones, toolUsage, progressUpdates, evaluation] = await Promise.all([
          this.getParticipants(team.id),
          this.getMilestones(team.id),
          this.getToolUsage(team.id),
          this.getProgressUpdates(team.id),
          this.getEvaluation(team.id),
        ]);

        return {
          ...team,
          participants,
          milestones,
          tool_usage: toolUsage,
          progress_updates: progressUpdates,
          evaluation,
        };
      })
    );

    return teamsWithData;
  }

  // Participant operations
  async getParticipants(teamId: number): Promise<Participant[]> {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data || [];
  }

  async addParticipant(participant: Omit<Participant, 'id' | 'created_at'>): Promise<Participant> {
    const { data, error } = await supabase
      .from('participants')
      .insert(participant)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Milestone operations
  async getMilestones(teamId: number): Promise<Milestones> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateMilestones(teamId: number, milestones: Partial<Omit<Milestones, 'id' | 'team_id' | 'updated_at'>>): Promise<Milestones> {
    const { data, error } = await supabase
      .from('milestones')
      .update(milestones)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Tool usage operations
  async getToolUsage(teamId: number): Promise<ToolUsage> {
    const { data, error } = await supabase
      .from('tool_usage')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateToolUsage(teamId: number, toolUsage: Partial<Omit<ToolUsage, 'id' | 'team_id' | 'updated_at'>>): Promise<ToolUsage> {
    const { data, error } = await supabase
      .from('tool_usage')
      .update(toolUsage)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Progress updates operations
  async getProgressUpdates(teamId: number): Promise<ProgressUpdates> {
    const { data, error } = await supabase
      .from('progress_updates')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProgressUpdates(teamId: number, updates: Partial<Omit<ProgressUpdates, 'id' | 'team_id' | 'updated_at'>>): Promise<ProgressUpdates> {
    const { data, error } = await supabase
      .from('progress_updates')
      .update(updates)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Evaluation operations
  async getEvaluation(teamId: number): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateEvaluation(teamId: number, evaluation: Partial<Omit<Evaluation, 'id' | 'team_id' | 'total_score' | 'updated_at'>>): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .update(evaluation)
      .eq('team_id', teamId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update team basic info
  async updateTeam(teamId: number, updates: Partial<Pick<Team, 'name' | 'problem_statement' | 'theme'>>): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) throw error;
    return this.getTeamById(teamId);
  }
}

export const dataService = new DataService();