import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { GeneratedContent, ThoughtMeta, ThoughtCategory, NextStep, ThoughtCard, GrowthStage } from "../types";

const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-3-pro-image-preview"; 
const API_TIMEOUT_MS = 25000; // Increased timeout for potential double-generation

// --- VISUAL SYSTEM DEFINITIONS ---

const SPECIES_MAP: Record<ThoughtCategory, string> = {
  idea: "Sunflower",
  todo: "Aloe Vera",
  worry: "Lavender plant",
  feeling: "Wild Rose bush",
  goal: "Oak Tree sapling",
  memory: "Forget-me-not flowers",
  other: "Dandelion"
};

const STAGE_DESCRIPTIONS: Record<GrowthStage, string> = {
  seed: "a small seed planted in rich soil, waiting to grow",
  sprout: "a small, tender green sprout just emerging from the ground",
  bloom: "a healthy plant beginning to show buds or small flowers",
  fruit: "a mature, fully grown plant in full bloom or bearing fruit"
};

interface AnalysisResponse {
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  reflection: string;
  category: ThoughtCategory;
  topic: string;
  hasNextStep: boolean;
  nextStep: NextStep | null;
}

interface WateringAnalysisResponse {
  acknowledgment: string;
  newStage: GrowthStage;
  hasNextStep: boolean;
  nextStep: NextStep | null;
}

interface WateringResponse {
  acknowledgment: string;
  newStage: GrowthStage;
  hasNextStep: boolean;
  nextStep: NextStep | null;
  newImageUrl?: string;
}

// Helper for retry logic
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("The garden is taking a moment to grow...")), API_TIMEOUT_MS)
    );
    return await Promise.race([fn(), timeoutPromise]);
  } catch (error: any) {
    const isOverloaded = error?.status === 503 || error?.code === 503 || (error?.message && error.message.includes('overloaded'));
    if (retries > 0 && isOverloaded) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");
  return new GoogleGenAI({ apiKey });
}

// --- MAIN FUNCTIONS ---

export const generateMindGardenContent = async (text: string): Promise<GeneratedContent> => {
  try {
    // 1. Analyze Text to get Category & Emotion
    const analysis = await analyzeTextAndReflect(text);
    const species = SPECIES_MAP[analysis.category];

    // 2. Generate Initial Seed Image
    let imageUrl = "";
    try {
      imageUrl = await generateBotanyImage(species, 'seed', analysis.emotion);
    } catch (imgError) {
      console.warn("Image gen failed:", imgError);
      imageUrl = `https://picsum.photos/seed/${Date.now()}/800/800?blur=8`;
    }

    return {
      imageUrl,
      reflection: analysis.reflection,
      meta: {
        emotion: analysis.emotion,
        intensity: analysis.intensity,
        metaphors: [], // Deprecated but kept for type safety
        plantSpecies: species, // New field
        category: analysis.category,
        topic: analysis.topic,
        hasNextStep: analysis.hasNextStep,
        nextStep: analysis.nextStep,
      },
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("The garden is busy. Please try again.");
  }
};

export const waterMindGardenThought = async (thought: ThoughtCard, updateText: string): Promise<WateringResponse> => {
  const ai = getClient();
  const currentSpecies = thought.meta.plantSpecies || SPECIES_MAP[thought.meta.category] || "Plant";

  // 1. Analyze the update (Text)
  const prompt = `
    You are the MindGarden AI.
    Original: "${thought.originalText}"
    Current Stage: ${thought.growthStage}
    Update: "${updateText}"

    Rules:
    - Determine new growth stage (seed->sprout->bloom->fruit).
    - If user reflects deeply or takes action, ADVANCE stage.
    - If user is just venting or stuck, STAY same stage.
    - Write a gentle acknowledgment.
    - Determine if next step is needed.
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
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
  const result = JSON.parse(response.text) as WateringAnalysisResponse;
  
  // 2. If stage advanced, regenerate image
  let newImageUrl: string | undefined = undefined;
  
  if (result.newStage !== thought.growthStage) {
    try {
      newImageUrl = await generateBotanyImage(
        currentSpecies, 
        result.newStage, 
        thought.meta.emotion // Keep original emotion or maybe infer new one? Let's keep consistency.
      );
    } catch (e) {
      console.warn("Failed to regenerate image on growth:", e);
      // Fail gracefully, keep old image
    }
  }

  return {
    ...result,
    newImageUrl,
    nextStep: result.hasNextStep ? result.nextStep : null
  };
};

// --- HELPERS ---

async function analyzeTextAndReflect(userText: string): Promise<AnalysisResponse> {
  const ai = getClient();

  const prompt = `
    Analyze user thought: "${userText}".
    Map to ONE category:
    - idea (creative sparks)
    - todo (tasks)
    - worry (anxiety)
    - feeling (emotions)
    - goal (aspirations)
    - memory (past)
    - other

    Provide a gentle reflection.
    Return JSON.
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
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
        required: ["category", "topic", "emotion", "intensity", "reflection", "hasNextStep"],
      },
    },
  }));

  if (!response.text) throw new Error("Analysis failed");
  const res = JSON.parse(response.text) as AnalysisResponse;
  if (!res.hasNextStep) res.nextStep = null;
  return res;
}

async function generateBotanyImage(species: string, stage: GrowthStage, emotion: string): Promise<string> {
  const ai = getClient();
  const stageDesc = STAGE_DESCRIPTIONS[stage];

  // STRICT PROMPT TEMPLATE
  const imagePrompt = `
    Create a high-quality digital plant illustration suitable for a UI garden.

    Subject:
    - A ${species} plant.

    Growth State:
    - ${stageDesc} (same plant species, clearly growing, not changing identity).

    Style:
    - Clean, modern digital illustration.
    - Soft vector-like shapes with smooth edges.
    - Subtle gradients for depth (very light, no harsh contrast).
    - Matte finish, no texture noise.
    - Calm, minimal, friendly style.

    Color Palette:
    - Base colors aligned with the app’s soft, natural theme.
    - Emotion (${emotion}) influences tint only:
      - calm → cool green / blue undertones
      - anxious → muted, slightly desaturated tones
      - hopeful → warm highlights, gentle glow
    - Avoid neon, avoid overly saturated colors.

    Composition:
    - Centered plant, front-facing or slight angle.
    - Isolated on a TRANSPARENT BACKGROUND (alpha channel).
    - Clear silhouette for easy placement.

    Constraints:
    - NO watercolor
    - NO sketch lines
    - NO rough brush strokes
    - NO text
    - NO frames
    - NO background scenery (no soil, sky, pots, or shadows)
  `;

  const response = await callWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: [{ text: imagePrompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  }));

  const candidate = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!candidate?.inlineData?.data) throw new Error("No image generated");

  return `data:${candidate.inlineData.mimeType};base64,${candidate.inlineData.data}`;
}
