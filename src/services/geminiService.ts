import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  }

  async getPitchAdvice(problem: string, theme: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a participant in a hackathon under the theme "${theme}". Our problem statement is: "${problem}". Provide 3 concise suggestions to improve our pitch impact and novelty.`,
        config: {
          maxOutputTokens: 300,
          temperature: 0.7,
        }
      });
      return response.text || "No advice available at this time.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to fetch AI advice. Please check your connection.";
    }
  }

  async evaluateTeamProgress(milestones: any, tools: any) {
    try {
      const prompt = `Based on these milestones: ${JSON.stringify(milestones)} and tools: ${JSON.stringify(tools)}, give a brief professional performance summary and one critical next step for this hackathon team.`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          maxOutputTokens: 200,
          temperature: 0.5,
        }
      });
      return response.text || "Keep building!";
    } catch (error) {
      return "AI evaluation unavailable.";
    }
  }
}

export const geminiService = new GeminiService();