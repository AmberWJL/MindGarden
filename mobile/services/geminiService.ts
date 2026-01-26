import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, ThoughtMeta, ThoughtCategory, NextStep, ThoughtCard, GrowthStage } from "../types";

const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview"; 
const API_TIMEOUT_MS = 20000; // 20 seconds max wait

interface AnalysisResponse {
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  metaphors: string[];
  reflection: string;
  category: ThoughtCategory;
  topic: string;
  hasNextStep: boolean;
  nextStep: NextStep | null;
}

interface WateringResponse {
  acknowledgment: string;
  newStage: GrowthStage;
  hasNextStep: boolean;
  nextStep: NextStep | null;
}

// Helper for retry logic
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out - the garden is slow today.")), API_TIMEOUT_MS)
    );
    return await Promise.race([fn(), timeoutPromise]);
  } catch (error: any) {
    const isOverloaded = 
      error?.status === 503 || 
      error?.code === 503 ||
      (error?.message && (error.message.includes('overloaded') || error.message.includes('503')));

    if (retries > 0 && isOverloaded) {
      console.warn(`Model overloaded. Retrying in ${delay}ms... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Helper to get client safely
const getClient = () => {
    // Attempt to read from process.env (EXPO_PUBLIC_)
    // In a real app, you might also read from a User Setting via AsyncStorage if you want them to bring their own key
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 
    
    if (!apiKey) {
      throw new Error("API Key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.");
    }
    return new GoogleGenAI({ apiKey });
}

export const generateMindGardenContent = async (text: string): Promise<GeneratedContent> => {
  try {
    // 1. Analyze Text (Critical)
    const analysis = await analyzeTextAndReflect(text);

    // 2. Generate Image (Non-Critical)
    let imageUrl = "";
    try {
      imageUrl = await generateSymbolicImage(analysis.metaphors, analysis.emotion);
    } catch (imgError) {
      console.warn("Image generation failed, using fallback:", imgError);
      imageUrl = `https://picsum.photos/seed/${Date.now()}/800/800?blur=4`; 
    }

    return {
      imageUrl,
      reflection: analysis.reflection,
      meta: {
        emotion: analysis.emotion,
        intensity: analysis.intensity,
        metaphors: analysis.metaphors,
        category: analysis.category,
        topic: analysis.topic,
        hasNextStep: analysis.hasNextStep,
        nextStep: analysis.nextStep,
        intent: analysis.hasNextStep ? 'action' : 'rest'
      },
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('overloaded') || error.status === 503) {
       throw new Error("The garden is very busy right now. Please try again in a moment.");
    }
    throw error; 
  }
};

export const waterMindGardenThought = async (thought: ThoughtCard, updateText: string): Promise<WateringResponse> => {
  const ai = getClient();
  const prompt = `
    You are the MindGarden AI.
    Original Thought: "${thought.originalText}"
    Current Stage: ${thought.growthStage}
    Previous Step: ${thought.meta.nextStep?.text || "None"}
    User Update: "${updateText}"

    Task:
    1. Analyze progress/reflection.
    2. Determine new stage (seed->sprout->bloom->fruit).
    3. Write short acknowledgment.
    4. New next step?

    CRITICAL RULES: No imperatives. If tired/high intensity, no next step.

    Return JSON.
  `;

  const response = await callWithRetry(() => ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          acknowledgment: { type: Type.STRING },
          newStage: { type: Type.STRING, enum: ["seed", "sprout", "bloom", "fruit"] },
          hasNextStep: { type: Type.BOOLEAN },
          nextStep: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["do", "clarify", "reflect"] },
              confidence: { type: Type.NUMBER }
            },
            nullable: true
          }
        },
        required: ["acknowledgment", "newStage", "hasNextStep"]
      }
    }
  }));

  if (!response.text) throw new Error("Failed to water plant.");
  
  const result = JSON.parse(response.text) as WateringResponse;
  if (!result.hasNextStep) result.nextStep = null;
  return result;
};

async function analyzeTextAndReflect(userText: string): Promise<AnalysisResponse> {
  const ai = getClient();
  const prompt = `
    You are the MindGarden AI.
    Analyze user input: "${userText}".

    RULES:
    - No imperatives.
    - If intensity=high, hasNextStep=false.
    
    Return STRICT JSON.
  `;

  const response = await callWithRetry(() => ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["idea", "todo", "worry", "feeling", "goal", "memory", "other"] },
          topic: { type: Type.STRING },
          emotion: { type: Type.STRING },
          intensity: { type: Type.STRING, enum: ["low", "medium", "high"] },
          metaphors: { type: Type.ARRAY, items: { type: Type.STRING } },
          reflection: { type: Type.STRING },
          hasNextStep: { type: Type.BOOLEAN },
          nextStep: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["do", "clarify", "reflect"] },
              confidence: { type: Type.NUMBER }
            },
            nullable: true
          }
        },
        required: ["category", "topic", "emotion", "intensity", "metaphors", "reflection", "hasNextStep"],
      },
    },
  }));

  if (!response.text) throw new Error("Failed to analyze thought.");
  const result = JSON.parse(response.text) as AnalysisResponse;
  if (!result.hasNextStep) result.nextStep = null;
  return result;
}

async function generateSymbolicImage(metaphors: string[], emotion: string): Promise<string> {
  const ai = getClient();
  const imagePrompt = `
    Watercolor illustration: ${metaphors.join(", ")} and feeling of ${emotion}.
    Style: Soft, pastel, ethereal, minimalist.
    No text, no people.
  `;

  const response = await callWithRetry(() => ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: [{ text: imagePrompt }] },
    config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } }
  }));

  let imageUrl = "";
  if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    imageUrl = `data:${response.candidates[0].content.parts[0].inlineData.mimeType};base64,${response.candidates[0].content.parts[0].inlineData.data}`;
  }

  if (!imageUrl) throw new Error("No image data returned");
  return imageUrl;
}
