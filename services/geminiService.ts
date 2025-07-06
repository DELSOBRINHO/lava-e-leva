
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getStainRemovalTips(stainDescription: string): Promise<string> {
  const prompt = `
    Você é um assistente de lavanderia prestativo e especialista. Um usuário tem uma mancha e precisa de ajuda. 
    Forneça dicas claras e concisas de pré-tratamento, passo a passo.

    Descrição da mancha pelo usuário: "${stainDescription}"

    REGRAS IMPORTANTES:
    1.  Comece com um aviso para testar o tratamento em uma área discreta da peça primeiro.
    2.  Mantenha o conselho breve, direto e fácil de seguir.
    3.  Formate a saída como texto simples, sem usar markdown, listas ou numeração. Apenas parágrafos.
    4.  Responda em Português do Brasil.
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          temperature: 0.5,
          topP: 0.95,
          topK: 64,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, não foi possível obter dicas no momento. Por favor, tente novamente mais tarde.";
  }
}
