import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAIRecommendation(prompt) {
  try {
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { temperature: 0.3 } 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error; 
  }
}