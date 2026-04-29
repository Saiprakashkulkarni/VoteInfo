import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function testFlashLatest() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  try {
    console.log("Testing gemini-1.5-flash-latest...");
    const result = await model.generateContent("hi");
    console.log("✅ SUCCESS:", result.response.text());
  } catch (e) {
    console.log("❌ FAILED:", e.message);
  }
}

testFlashLatest();
