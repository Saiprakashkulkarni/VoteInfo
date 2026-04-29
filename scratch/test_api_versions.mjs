import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("No API Key found");
    return;
  }
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  const versions = ["v1", "v1beta"];
  
  for (const version of versions) {
    console.log(`--- Testing API Version: ${version} ---`);
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Note: The SDK doesn't easily expose the version, but we can try to see if it works
    // Actually, the SDK version is tied to the package version.
    // Let's try to use the fetch directly to see which model/version works.
    for (const modelName of models) {
      try {
        console.log(`Testing ${modelName} on ${version}...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        const data = await response.json();
        if (response.ok) {
          console.log(`✅ Model ${modelName} is WORKING on ${version}.`);
          return;
        } else {
          console.log(`❌ Model ${modelName} on ${version} failed: ${data.error?.message || response.statusText}`);
        }
      } catch (e) {
        console.log(`❌ Model ${modelName} on ${version} error: ${e.message}`);
      }
    }
  }
}

listModels();
