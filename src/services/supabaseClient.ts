import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for the new schema
export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: number;
          team_number: number;
          name: string;
          password: string;
          problem_statement: string;
          theme: string;
          elo_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          team_number: number;
          name: string;
          password: string;
          problem_statement?: string;
          theme?: string;
          elo_score?: number;
        };
        Update: {
          name?: string;
          password?: string;
          problem_statement?: string;
          theme?: string;
          elo_score?: number;
        };
      };
      participants: {
        Row: {
          id: number;
          team_id: number;
          name: string;
          background: string;
          role: string;
          created_at: string;
        };
        Insert: {
          team_id: number;
          name: string;
          background?: string;
          role?: string;
        };
        Update: {
          name?: string;
          background?: string;
          role?: string;
        };
      };
      milestones: {
        Row: {
          id: number;
          team_id: number;
          brainstorming_complete: boolean;
          brainstorming_pending: boolean;
          prd_generated: boolean;
          prd_pending: boolean;
          build_complete: boolean;
          build_pending: boolean;
          updated_at: string;
        };
        Insert: {
          team_id: number;
          brainstorming_complete?: boolean;
          brainstorming_pending?: boolean;
          prd_generated?: boolean;
          prd_pending?: boolean;
          build_complete?: boolean;
          build_pending?: boolean;
        };
        Update: {
          brainstorming_complete?: boolean;
          brainstorming_pending?: boolean;
          prd_generated?: boolean;
          prd_pending?: boolean;
          build_complete?: boolean;
          build_pending?: boolean;
        };
      };
      tool_usage: {
        Row: {
          id: number;
          team_id: number;
          coding_tools: string[];
          llm_used: string;
          updated_at: string;
        };
        Insert: {
          team_id: number;
          coding_tools?: string[];
          llm_used?: string;
        };
        Update: {
          coding_tools?: string[];
          llm_used?: string;
        };
      };
      progress_updates: {
        Row: {
          id: number;
          team_id: number;
          screen_recording_url: string;
          submission_url: string;
          updated_at: string;
        };
        Insert: {
          team_id: number;
          screen_recording_url?: string;
          submission_url?: string;
        };
        Update: {
          screen_recording_url?: string;
          submission_url?: string;
        };
      };
      evaluations: {
        Row: {
          id: number;
          team_id: number;
          novelty: number;
          fastest_to_build: number;
          feature_count: number;
          clarity: number;
          impact_reach: number;
          total_score: number;
          updated_at: string;
        };
        Insert: {
          team_id: number;
          novelty?: number;
          fastest_to_build?: number;
          feature_count?: number;
          clarity?: number;
          impact_reach?: number;
        };
        Update: {
          novelty?: number;
          fastest_to_build?: number;
          feature_count?: number;
          clarity?: number;
          impact_reach?: number;
        };
      };
    };
  };
}