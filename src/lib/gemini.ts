import { GoogleGenerativeAI } from "@google/generative-ai";
import { electionDatasets } from "../data/electionData";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_INSTRUCTION = `
You are Voter Mitra, an expert AI assistant for the Indian Election process.
You have access to the following dataset:
${JSON.stringify(electionDatasets, null, 2)}

Your goal is to:
1. Explain the election process clearly and creatively.
2. Analyze the provided datasets when users ask about statistics.
3. Be encouraging, neutral, and educational.
4. Safety: Do not provide personal opinions on political parties or candidates. Stay strictly neutral and factual.
5. If the user asks a question not in the dataset, use your general knowledge about Indian elections but prioritize the dataset for stats.
6. If no API key is provided, explain how to get one or provide a helpful generic response.
`;

// Simple cache for Efficiency (Requirement 3)
const responseCache = new Map<string, string>();

export async function getGeminiResponse(userPrompt: string) {
  const sanitizedPrompt = userPrompt.trim().substring(0, 1000);
  
  // Return cached response if available
  if (responseCache.has(sanitizedPrompt)) {
    console.log("Returning cached AI response");
    return responseCache.get(sanitizedPrompt) || "";
  }

  if (!genAI) {
    const offline = getOfflineResponse(sanitizedPrompt);
    return "I'm currently in 'Offline Mode'. \n\n" + offline;
  }

  // Model rotation for robustness
  const modelsToTry = [
    "gemini-2.0-flash", 
    "gemini-1.5-flash", 
    "gemini-1.5-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      // Use systemInstruction for better alignment (Google Services feature)
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const result = await model.generateContent(sanitizedPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Store in cache
      responseCache.set(sanitizedPrompt, text);
      return text;
    } catch (error: any) {
      console.warn(`Model ${modelName} failed: ${error.message}`);
    }
  }

  return `I encountered an error connecting to all available Gemini models. \n\nFallback: ` + getOfflineResponse(sanitizedPrompt);
}

function getOfflineResponse(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("turnout")) return `Voter turnout was 67.4% in 2019 and approximately 66.3% in 2024.`;
  if (p.includes("age") || p.includes("demographic")) return `The 26-40 age group is the largest voting bloc with about 339M registered voters (35%).`;
  if (p.includes("method")) return `Elections use EVM (Electronic Voting Machines) and VVPAT (Voter Verifiable Paper Audit Trail).`;
  return "That's a great question! For a detailed answer, please enable the Gemini API. Generally, the election process involves registration, checking the roll, and casting your vote at your local booth.";
}
