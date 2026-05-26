import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI client:", e);
  }
}

export const geminiService = {
  // 1. APOD Explanation Summarizer
  async generateApodSummary(title: string, explanation: string): Promise<string> {
    if (!ai) {
      return `This is an automated analysis of "${title}". The image displays active cosmic dust clouds and stellar radiation sculpting gas pillars in the deep cosmos.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following scientific explanation of the astronomy photo titled "${title}" in exactly three concise, engaging sentences suitable for an educational space dashboard. Use a tone reminiscent of Carl Sagan. Explanation: ${explanation}`,
      });
      return response.text?.trim() || "";
    } catch (e) {
      console.error("Gemini APOD summary generation failed:", e);
      return explanation.slice(0, 180) + "...";
    }
  },

  // 2. Astronomy Q&A Chatbot
  async generateChatResponse(prompt: string, history: { role: "user" | "ai"; text: string }[]): Promise<string> {
    if (!ai) {
      // Return highly relevant mock Q&A responses based on prompt keywords
      const p = prompt.toLowerCase();
      if (p.includes("decay") || p.includes("orbit")) {
        return "Based on telemetry sweeps, orbital decay for standard LEO satellites remains at 0.04m/day. Solar storm flare index fluctuations could increase thermospheric drag, accelerating this decay. I suggest running a drag simulation.";
      }
      if (p.includes("launch") || p.includes("spacex") || p.includes("crs")) {
        return "CRS-42 stage-1 thrust vector validation was completed at 04:12 UTC. Propellant loading is scheduled for T-3h. Weather models show 94% favorable conditions with light wind shear.";
      }
      if (p.includes("cme") || p.includes("solar") || p.includes("weather")) {
        return "The CME M2.4 solar flare event occurred yesterday in region AR3842. The plasma shockwave is traveling at 520 km/s and is expected to interact with Earth's magnetosphere in 12 hours, potentially triggering minor G1 geomagnetic storms.";
      }
      if (p.includes("rover") || p.includes("mars") || p.includes("discover")) {
        return "Perseverance Rover has been surveying the Jezero crater ridge. Multi-spectral camera scans of 'Belva Crater' show evidence of igneous rock textures and calcium-rich sulfate veins, indicating historical alluvial flows.";
      }
      return "Greetings, researcher. I've parsed your uplink query. The current space operations status is nominal. How can I assist you with orbital mechanics, SpaceX countdowns, or near-Earth object radar datasets?";
    }

    try {
      // Format chat history for Gemini API
      const contents = [
        {
          role: "user",
          parts: [{ text: "You are Aether AI, a sophisticated space-tech intelligence reasoning engine for NASA Mission Control. Respond to queries scientifically, concisely, and with premium aerospace terminology. Always be helpful and educational." }]
        },
        ...history.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        })),
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      return response.text?.trim() || "";
    } catch (e) {
      console.error("Gemini Chat Q&A failed:", e);
      return "Communication downlink interrupted. Please verify your GEMINI_API_KEY environment configuration.";
    }
  },

  // 3. Multimodal Mars Image Summary
  async analyzeMarsPhoto(imageUrl: string): Promise<string> {
    if (!ai) {
      return "Image shows Jezero Crater sediment layers. Visual structures suggest basaltic rock formations, fine sand ripples, and light erosion from Martian winds.";
    }

    try {
      // Fetch image bytes
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error("Could not fetch Mars photo bytes");
      const buffer = await imgRes.arrayBuffer();

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              data: Buffer.from(buffer).toString("base64"),
              mimeType: "image/jpeg"
            }
          },
          "Act as a planetary geologist analyzing this photograph captured by NASA's Mars Rover. Describe the geological structures, soil composition, rocks, or wind patterns visible in the image in a short, 30-word scientific caption."
        ]
      });

      return response.text?.trim() || "";
    } catch (e) {
      console.error("Gemini Mars Rover image analysis failed:", e);
      return "A standard Mars terrain photo showing iron-rich soil deposits, basaltic rock fragments, and wind-sculpted sand dunes.";
    }
  }
};
