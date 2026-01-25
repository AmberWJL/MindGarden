import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, ThoughtMeta, ThoughtCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image"; 

interface AnalysisResponse {
  emotion: string;
  intent: string;
  intensity: string;
  metaphors: string[];
  reflection: string;
  category: ThoughtCategory;
  topic: string;
}

export const generateMindGardenContent = async (text: string): Promise<GeneratedContent> => {
  try {
    const analysis = await analyzeTextAndReflect(text);
    const imageUrl = await generateSymbolicImage(analysis.metaphors, analysis.emotion);

    return {
      imageUrl,
      reflection: analysis.reflection,
      meta: {
        emotion: analysis.emotion,
        intent: analysis.intent,
        intensity: analysis.intensity as any,
        metaphors: analysis.metaphors,
        category: analysis.category,
        topic: analysis.topic,
      },
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The garden is cloudy right now. Please try again later.");
  }
};

async function analyzeTextAndReflect(userText: string): Promise<AnalysisResponse> {
  const prompt = `
    Analyze the user input: "${userText}".
    
    Return a STRICT JSON object with these exact keys:

    1. category: Choose one of [idea, todo, worry, feeling, goal, memory, other].
    2. topic: A short, 3-6 word title summarizing the thought (e.g., "Upcoming Math Project", "Anxiety about travel").
    3. emotion: 1-2 words describing the underlying emotion.
    4. intensity: one of [low, medium, high].
    5. intent: one of [idea, todo, worry, reflection].
    6. metaphors: Array of 2-4 short, visual nouns/adjectives describing the feeling abstractly.
    7. reflection: EXACTLY one supportive, poetic, reassuring sentence. No advice, no therapy jargon.

    Example JSON:
    {
      "category": "worry",
      "topic": "Uncertainty about the future",
      "emotion": "anxious",
      "intensity": "medium",
      "intent": "worry",
      "metaphors": ["foggy path", "heavy stones"],
      "reflection": "Even in the thickest fog, the ground beneath you remains solid."
    }
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          topic: { type: Type.STRING },
          emotion: { type: Type.STRING },
          intent: { type: Type.STRING },
          intensity: { type: Type.STRING },
          metaphors: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          reflection: { type: Type.STRING },
        },
        required: ["category", "topic", "emotion", "intent", "intensity", "metaphors", "reflection"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to analyze thought.");
  }

  return JSON.parse(response.text) as AnalysisResponse;
}

async function generateSymbolicImage(metaphors: string[], emotion: string): Promise<string> {
  // Updated prompt to match the "MindGarden" watercolor map aesthetic
  const imagePrompt = `
    A soft, dreamlike watercolor illustration representing: ${metaphors.join(", ")} and the feeling of ${emotion}.
    
    Art Style: 
    - Traditional Watercolor painting on textured paper.
    - Soft, pastel color palette (pale blues, gentle pinks, sage greens, warm ambers).
    - Ethereal, flowing shapes. 
    - Minimalist and symbolic.
    - Visible paper grain texture.
    - White vignette edges to blend with a white page.

    Constraints: 
    - NO text. 
    - NO photorealism. 
    - NO people. 
    - NO dark or harsh black lines.
    - NO chaotic elements.
  `;

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: imagePrompt }],
    },
  });

  let imageUrl = "";
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    return `https://picsum.photos/500/500?blur=5&grayscale`;
  }

  return imageUrl;
}
