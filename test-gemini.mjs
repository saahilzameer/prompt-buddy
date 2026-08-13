import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hello"
    });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}
test();
