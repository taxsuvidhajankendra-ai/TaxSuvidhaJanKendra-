import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTaxPolicyIllustration() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A professional and realistic digital illustration of Prime Minister Narendra Modi and Finance Minister Nirmala Sitharaman engaged in a serious discussion about Indian tax policies. They are seated in a sophisticated government conference room with the Indian flag in the background. On the table between them are various budget documents, GST reports, and digital tablets displaying economic growth charts and tax data visualizations. The lighting is professional and authoritative, conveying a sense of trust and national progress. Realistic style, high detail.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
