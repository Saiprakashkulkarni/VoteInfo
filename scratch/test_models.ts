import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("No API Key found in .env");
    return;
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  try {
    // The SDK doesn't have a direct listModels, but we can try to hit the endpoint
    // Actually, let's just try to test the common model names
    const models = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-pro"];
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`✅ Model ${modelName} is WORKING`);
        break; // Stop at first working model
      } catch (e: any) {
        console.log(`❌ Model ${modelName} failed: ${e.message}`);
      }
    }
  } catch (error) {
    console.error("General Error:", error);
  }
}

listModels();
