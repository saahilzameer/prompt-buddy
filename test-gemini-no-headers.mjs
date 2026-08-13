import { config } from "dotenv";
config();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY
});

async function test() {
  try {
    const prompt = `Hello`;
    console.log("Calling Gemini...");
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    console.log("Gemini returned:", result.text);
  } catch (e) {
    console.error("Gemini Error:", e);
  }
}
test();
