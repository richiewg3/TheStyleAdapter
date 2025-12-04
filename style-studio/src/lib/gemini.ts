import { GoogleGenerativeAI, GenerativeModel, Part } from '@google/generative-ai';

// Initialize the Gemini API client
const getGenAI = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Google AI API key is not configured. Please set GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// System instruction for the Director (Prompt Generator)
const DIRECTOR_SYSTEM_INSTRUCTION = `You are a texture-obsessed Art Director specializing in gritty, photorealistic cinematography. 

Your role is to analyze the user's input concept and create a "Director's Treatment" - a detailed prompt that will guide the creation of a cinematic, realistic image.

Before outputting the final prompt, you must:
1. Analyze the input concept carefully
2. Consider 3 different lighting setups:
   - Setup A: Dramatic chiaroscuro with harsh shadows
   - Setup B: Soft diffused natural light with ambient fill
   - Setup C: Rim lighting with practical sources
3. Choose the setup that maximizes 'gritty realism' over 'cartoon smoothness'

Your output should be a polished "Director's Treatment" that includes:
- **Lighting**: Specific lighting description (key light, fill, rim, practicals)
- **Lens Choice**: Camera and lens specifications (e.g., "Shot on 50mm f/1.4, shallow depth of field")
- **Texture Notes**: Surface imperfections, material details, weathering
- **Color Grade**: Film stock or color palette reference (e.g., "Kodak Portra 400 warmth")
- **Composition**: Framing and perspective notes
- **Atmosphere**: Environmental details (dust particles, haze, moisture)

Format your response as a cohesive paragraph that flows naturally, not as a bulleted list. The treatment should be 100-200 words and read like professional direction for a cinematographer.`;

// System instruction for the Prompt Rewriter
const REWRITER_SYSTEM_INSTRUCTION = `You are a cinematic prompt specialist. Your job is to take any prompt (especially "cute" or "cartoon-like" descriptions) and rewrite them for gritty photorealistic execution.

When rewriting, imagine the scene was:
- Shot with a 100mm Macro lens on Kodak Portra 400 film
- Lit by a veteran cinematographer
- Captured with visible surface imperfections and micro-details

Transform every element:
- "Smooth skin" → "Pores visible, subtle sun damage, natural oils catching light"
- "Bright eyes" → "Bloodshot sclera, visible iris texture, reflected environment"
- "Clean background" → "Dust motes suspended in air, scratched surfaces, aged materials"

Output only the rewritten prompt, no explanations. Make it 50-150 words, dense with visual details that a image AI can interpret.`;

// Get the Director model (for prompt generation)
export const getDirectorModel = (): GenerativeModel => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: DIRECTOR_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  });
};

// Get the Rewriter model (for prompt rewriting)
export const getRewriterModel = (): GenerativeModel => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: REWRITER_SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 512,
    },
  });
};

// Get the Image Generation model
export const getImageModel = (): GenerativeModel => {
  const genAI = getGenAI();
  // Using Gemini 2.0 Flash for image generation capabilities
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp-image-generation',
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
  });
};

// Convert base64 image to Gemini Part format
export const imageToGenerativePart = (base64Data: string, mimeType: string = 'image/jpeg'): Part => {
  // Remove data URL prefix if present
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

// Generate Director's Treatment
export const generateDirectorTreatment = async (
  conceptText: string,
  referenceImage?: string
): Promise<string> => {
  const model = getDirectorModel();
  
  const parts: (string | Part)[] = [];
  
  if (referenceImage) {
    parts.push(imageToGenerativePart(referenceImage));
    parts.push(`\n\nReference image provided above. Analyze this image along with the following concept:\n\n${conceptText}\n\nCreate a Director's Treatment that transforms this into gritty, photorealistic cinematography.`);
  } else {
    parts.push(`Concept: ${conceptText}\n\nCreate a Director's Treatment that transforms this concept into gritty, photorealistic cinematography.`);
  }
  
  const result = await model.generateContent(parts);
  const response = await result.response;
  return response.text();
};

// Rewrite a prompt for gritty realism
export const rewritePrompt = async (
  originalPrompt: string,
  referenceImage?: string
): Promise<string> => {
  const model = getRewriterModel();
  
  const parts: (string | Part)[] = [];
  
  if (referenceImage) {
    parts.push(imageToGenerativePart(referenceImage));
    parts.push(`\n\nLook at this image. Rewrite the following prompt to describe this exact scene, but imagine it was shot with a 100mm Macro lens on Kodak Portra 400 film. Focus on surface imperfections.\n\nOriginal prompt: ${originalPrompt}`);
  } else {
    parts.push(`Rewrite this prompt for gritty photorealistic execution:\n\n${originalPrompt}`);
  }
  
  const result = await model.generateContent(parts);
  const response = await result.response;
  return response.text();
};

// Generate image with style transfer
export const generateStyledImage = async (
  prompt: string,
  structureReference?: string,
  styleReference?: string
): Promise<string> => {
  const model = getImageModel();
  
  const parts: (string | Part)[] = [];
  
  // Build the prompt with references
  let fullPrompt = prompt;
  
  if (structureReference) {
    parts.push(imageToGenerativePart(structureReference));
    fullPrompt = `Using the structure and composition from the provided reference image, create: ${prompt}`;
  }
  
  if (styleReference) {
    parts.push(imageToGenerativePart(styleReference));
    fullPrompt += ` Apply the visual style, texture, and lighting from the style reference image.`;
  }
  
  parts.push(fullPrompt + ' Generate a high-quality, photorealistic image with gritty textures and cinematic lighting.');
  
  const result = await model.generateContent(parts);
  const response = await result.response;
  
  // Check for image in the response
  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if ('inlineData' in part && part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  // If no image, return the text response (might be an error or explanation)
  throw new Error('No image was generated. The model returned: ' + response.text());
};
