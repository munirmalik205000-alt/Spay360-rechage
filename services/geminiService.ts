
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
// Use the named parameter 'apiKey' as required by the SDK.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gets a recommendation for a recharge plan based on user query.
 * Uses gemini-3-flash-preview for basic text tasks like summarization and reasoning.
 */
export const getPlanRecommendation = async (query: string, availablePlans: any[]) => {
  try {
    // Using ai.models.generateContent to query GenAI with both model and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks: "${query}". Based on these recharge plans: ${JSON.stringify(availablePlans)}, recommend the best one and explain why. Keep it concise and friendly.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    // Access the .text property directly to get the generated response string.
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to my AI brain right now. Please browse the plans below!";
  }
};
