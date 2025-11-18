import { GoogleGenAI, Type } from "@google/genai";
import { AIPassphraseConfig } from "../types";

export const generateAIPassphrase = async (config: AIPassphraseConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a secure, memorable passphrase based on the following criteria:
    - Word count: ${config.wordCount}
    - Theme/Context: ${config.theme || 'Random, but coherent concepts'}
    - Include a number: ${config.includeNumber}
    - Capitalize words: ${config.capitalize}
    - Separator to use in output: "${config.separator}"
    
    The output must be a single string containing the generated passphrase.
    Do not include explanations.
    Example output: Correct-Horse-Battery-Staple
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passphrase: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const json = JSON.parse(text);
    return json.passphrase;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};