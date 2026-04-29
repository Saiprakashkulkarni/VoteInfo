import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("No API Key found");
    return;
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("hi");
      const text = result.response.text();
      console.log(`✅ Model ${modelName} is WORKING. Response: ${text}`);
      return;
    } catch (e) {
      console.log(`❌ Model ${modelName} failed: ${e.message}`);
    }
  }
}

listModels();
