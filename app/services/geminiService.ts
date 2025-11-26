import { GoogleGenerativeAI } from "@google/generative-ai";
import { AICritiqueResponse } from "../types";

// Note: In a production app, you should call an API route to keep your key secure.
// For this prototype, we'll use the public key env variable.
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeDoodle(dataUrl: string): Promise<AICritiqueResponse> {
  if (!apiKey) {
    console.warn("Missing NEXT_PUBLIC_GEMINI_API_KEY");
    return {
      title: "Untitled Mystery",
      critique: "I cannot see this masterpiece because my inner eye (API Key) is missing. Please configure it!"
    };
  }

  try {
    // Extract the base64 data (remove the "data:image/png;base64," prefix)
    const base64Data = dataUrl.split(',')[1];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a pretentious but humorous art critic at the "Doodle Museum". 
    Analyze this drawing. 
    1. Give it a creative, slightly abstract, or funny title.
    2. Write a short, 1-sentence critique that sounds sophisticated but is actually about this simple doodle.
    
    Return the response as a JSON object with keys: "title" and "critique". Do not include markdown formatting like ​​​json.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up any potential markdown code blocks if the model ignores the instruction
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText) as AICritiqueResponse;

  } catch (error) {
    console.error("Error analyzing doodle:", error);
    return {
      title: "The Glitched Canvas",
      critique: "My vision is clouded (Error connecting to AI). Perhaps it is too avant-garde for me."
    };
  }
}
