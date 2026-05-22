import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high size limits for sample base64 images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Lazy initializer for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure your secrets in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for ReelForge AI generator
app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      platform,
      niche,
      tone,
      language,
      detailLevel,
      duration,
      referenceImg,
    } = req.body;

    if (!topic || !platform) {
      res.status(400).json({ error: "Topic and Platform are required fields." });
      return;
    }

    // Check if Gemini API Key is configured. If not, trigger structured high-quality creator fallback with info banner.
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    if (!hasApiKey) {
      console.warn("GEMINI_API_KEY not configured. Responding with rich structural mock representation.");
      const mockResult = generateFallbackData(topic, platform, niche, tone, language, detailLevel, duration, !!referenceImg);
      res.json({
        success: true,
        data: mockResult,
        warning: "GEMINI_API_KEY is currently missing from your environment. Showing high-quality simulated output. Please configure your Gemini API Key in 'Settings > Secrets' on Google AI Studio to unlock real AI script and prompt generation.",
      });
      return;
    }

    const ai = getGeminiClient();

    // Prepare content parts
    const textPrompt = `Generate a complete content production package for a short-form video based on the following creative specifications:
- **Topic/Idea**: ${topic}
- **Target Platform**: ${platform}
- **Video Niche**: ${niche || "General Shorts/Reels"}
- **Emotional/Cinematic Tone**: ${tone || "Cinematic"}
- **Language**: ${language || "English"}
- **Prompt Detail & Richness Level**: ${detailLevel || "Cinematic"}
- **Estimated Duration**: ${duration || "30 seconds"}

${referenceImg ? "IMPORTANT: The user has uploaded an inspiration/style reference image. Analyze this reference image's composition, framing, lighting contrast, color palette, atmosphere (e.g. mystery, high-contrast, moody, retro, anime), and rendering style (realistic photograph, matte painting, stylized 3D, flat illustration etc.). All generated image prompts and animation prompts MUST strictly conform to this visual style, lighting, and palette to ensure extreme cinematic consistency." : "Ensure that all generated image prompts and animation prompts maintain deep camera and lighting continuity. The setting, colors, character profiles, atmospheric details, and style should flow seamlessly from Scene 1 to subsequent scenes."}

Generate the exact output as a single valid JSON object verifying the structural properties specified in the Response Schema. Do not skip any scenes. Fill all scene breakdown properties, image prompts with high creative depth, animation prompts with motion/parallax, and SEO details.`;

    const parts: any[] = [];
    if (referenceImg && referenceImg.startsWith("data:")) {
      const match = referenceImg.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }
    parts.push({ text: textPrompt });

    // Precise validation schema matching /src/types.ts GenerationResult
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        overview: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            niche: { type: Type.STRING },
            platform: { type: Type.STRING },
            tone: { type: Type.STRING },
            language: { type: Type.STRING },
            estimatedDuration: { type: Type.STRING },
            viralityScore: { type: Type.INTEGER },
            retentionScore: { type: Type.INTEGER },
            thesis: { type: Type.STRING, description: "A multi-sentence critical analysis of why this specific short is primed for virality, discussing key retention strategies and the sensory mood." }
          },
          required: ["topic", "niche", "platform", "tone", "language", "estimatedDuration", "viralityScore", "retentionScore", "thesis"]
        },
        hooks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              hook: { type: Type.STRING, description: "Highly compelling short-form opening hook, calibrated to stop scrolling in 1.5 seconds." }
            },
            required: ["type", "title", "hook"]
          }
        },
        script: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              section: { type: Type.STRING, description: "One of: Hook, Build-up, Suspense, Reveal, CTA" },
              narration: { type: Type.STRING, description: "The spoken script or voiceover copy. Dynamic, conversational, or visual storytelling. Strictly avoid generic corporate words." },
              duration: { type: Type.STRING },
              emotionalIntensity: { type: Type.STRING, description: "Low, Medium, High, Extreme" }
            },
            required: ["sceneNumber", "section", "narration", "duration", "emotionalIntensity"]
          }
        },
        sceneBreakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              duration: { type: Type.STRING },
              purpose: { type: Type.STRING },
              retentionObjective: { type: Type.STRING, description: "Tactics to prevent swipe away (e.g., sudden volume shift, close up reveal, unexpected visual dynamic)." },
              emotionalGoal: { type: Type.STRING }
            },
            required: ["sceneNumber", "duration", "purpose", "retentionObjective", "emotionalGoal"]
          }
        },
        imagePrompts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              prompt: { type: Type.STRING, description: "Highly descriptive vertical 9:16 photographic or digital illustration prompt for Midjourney/Flux. Must include camera framing (e.g. super close-up, Dutch angle), camera gear/lens, granular particle layers, lighting setups, environment contrast, textures, color grading, and inspiration clues corresponding to the continuity." }
            },
            required: ["sceneNumber", "prompt"]
          }
        },
        animationPrompts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              prompt: { type: Type.STRING, description: "Instructional prompt for Runway/Luma/Sora video generation starting from the image prompt. Detail camera displacement (e.g., slow macro push-in, vertical crane rise, sweeping pan), specific environmental speed details (e.g., volumetric fog rolling in, torchlight flicker, atmospheric embers floating), parallax motion blur, and intensity settings." }
            },
            required: ["sceneNumber", "prompt"]
          }
        },
        seoPackage: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            youtubeShorts: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING }
              },
              required: ["caption", "hashtags", "cta"]
            },
            instagramReels: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING }
              },
              required: ["caption", "hashtags", "cta"]
            },
            tiktok: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                cta: { type: Type.STRING }
              },
              required: ["caption", "hashtags", "cta"]
            }
          },
          required: ["title", "description", "youtubeShorts", "instagramReels", "tiktok"]
        }
      },
      required: ["overview", "hooks", "script", "sceneBreakdown", "imagePrompts", "animationPrompts", "seoPackage"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: parts,
      config: {
        systemInstruction: `You are ReelForge AI, the world's most elite creative director and short-form video script supervisor.
Your job is to transform standard ideas into mind-bending, retention-maximized, faceless viral scripts and cinematic image/video pipeline instructions.

Rules:
1. SCRIPT NARRATION: Write engaging, human, conversational, dramatic, or suspenseful narrations. NEVER use robotic, generic placeholders or AI talking-head jargon. Pacing must be tight. Use regional terminology if Hinglish, Hindi, Urdu, or Bengali is selected.
2. IMAGE PROMPTS: Must be professional-grade, deeply descriptive, and formatted for 9:16 cinematic generation. Specify: camera angles, focal lenses, lighting setups (e.g. volumetric rays, split-lighting, low key), texture definitions, debris levels, color palettes, and rendering details. Always end with a visual reference to the 9:16 framing.
3. ANIMATION PROMPTS: Tell motion platforms exactly how to move. Specify lens zoom, 3D parallax shifts, dynamic environmental animations, speeds, and focus pulls.
4. CONTINUITY: Guarantee that if Scene 1 defines a moody blue tone or specific temple details, Scene 2 and 3 retain those exact ambient textures, styling details, and visual themes to avoid disjointed frames.
5. NO TRUNCATION: Output a complete, fully formed JSON package with no placeholders, markdown descriptions outside JSON, or syntax errors.`,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate assets through the AI pipeline." });
  }
});

// Structural high-quality mock data generator in case GEMINI_API_KEY is not defined
function generateFallbackData(
  topic: string,
  platform: string,
  niche: string,
  tone: string,
  language: string,
  detailLevel: string,
  duration: string,
  hasImageInspiration: boolean
) {
  // Let's make this highly reflective of the inputs to build a satisfying preview!
  const isHorror = tone.toLowerCase().includes("horror") || topic.toLowerCase().includes("horror");
  const isMotivation = tone.toLowerCase().includes("motivation") || topic.toLowerCase().includes("discipline") || topic.toLowerCase().includes("motivation");
  const isAnime = tone.toLowerCase().includes("anime");
  const isFinance = tone.toLowerCase().includes("finance") || tone.toLowerCase().includes("educational");

  let computedTone = tone;
  if (!computedTone) {
    computedTone = isHorror ? "Horror" : isMotivation ? "Motivation" : isAnime ? "Anime" : "Cinematic";
  }

  // Create customized responses based on inputs
  const finalNiche = niche || (isHorror ? "Mystery & Lore" : isMotivation ? "High-Yield Growth" : isAnime ? "Anime Art & Tales" : "Creative Storytelling");
  const estTime = duration || "30 Seconds";

  // Build out customizable scenes
  const baseScenes = [
    {
      section: "Hook",
      dur: "0:00 - 0:05",
      narration: language.toLowerCase() === "hindi" 
        ? `क्या आप जानते हैं कि इस स्थान के पीछे का असली इतिहास क्या है? कोई इसके बारे में बात नहीं करता!` 
        : language.toLowerCase() === "hinglish"
        ? `Kya aapko pata hai is jagah ke peeche ka asli sach? Koi iske baare mein baat nahi karna chahta!`
        : `They tried to erase this history from your books, but the stones still whisper the truth.`,
      purpose: "Hook the restless scroll",
      retention: "Violent camera push matching a shattering bass swell to spike attention metrics.",
      emGoal: "Severe Curiosity & Alertness",
      image: hasImageInspiration 
        ? `Cinematic low-angle medium shot, heavily replicating the uploaded reference profile's lighting and framing. A glowing ancient structure shadowed under dense evening mist, deep atmospheric dust motes, 9:16 vertical composition, Unreal Engine 5 render style.`
        : `Dramatic low-angle tracking shot of a weathered ruin at dusk, volumetric fog flowing around broken stone reliefs, heavy blue hour color grading, crisp moonlight silhouette, detailed dust particles, 9:16 ratio cinematic realism.`,
      animation: `Cinematic macro push-in toward the central dark archway at 80% speed, simulated handheld micro-shake for realistic grit, fog particles drifting swiftly from right to left.`
    },
    {
      section: "Build-up",
      dur: "0:05 - 0:13",
      narration: language.toLowerCase() === "hindi"
        ? `दीवारों पर उकेरी गई ये आकृतियां केवल कला नहीं हैं, ये एक चेतावनी हैं जिसे अनसुना कर दिया गया!`
        : language.toLowerCase() === "hinglish"
        ? `Deewaron par bani ye aakritiyan sirf art nahi hain, ye ek aisi warning hai jise ignore kiya gaya!`
        : `Behind these intricate carvings lies an ancient secret that beats with a strange, dark warning.`,
      purpose: "Escalate stakes & introduce visual tension",
      retention: "Stagewise color contrast shifts and subtle sound frequency drop to force deep focus.",
      emGoal: "Growing Intricacy & Tension",
      image: hasImageInspiration
        ? `Macro extreme-close-up shot matching reference style's rich depth. Ancient stone carvings reflecting warm amber torchlight inside a silent corridor, deep heavy textures, high-contrast shadows, cinematic mist, 9:16 ratio.`
        : `Extremely tight macro close-up of ancient glyphs inside the tomb, warm flickers of dim orange light kissing cracked obsidian surfaces, heavy shadow occlusion, sharp focus, 85mm anamorphic compression, 9:16 aspect ratio.`,
      animation: `Vertical crane slide downward revealing hidden carvings, slow-motion embers rising along the foreground with custom parallax depth.`
    },
    {
      section: "Suspense",
      dur: "0:13 - 0:22",
      narration: language.toLowerCase() === "hindi"
        ? `और फिर अचानक, आधी रात को, उस गहरे गर्भगृह से कुछ रोंगटे खड़े कर देने वाली आवाज़ें आने लगीं...`
        : language.toLowerCase() === "hinglish"
        ? `Aur fir sudden, adhi raat ko, us gehre garbhgrah se rone jaisi aawazein aane lagti hain...`
        : `In the absolute silence, structural chambers beneath begin to beat as if a forgotten heart woke up.`,
      purpose: "Peak tension before reveal",
      retention: "Extreme focus crop, fading screen edges, and temporary structural freeze to force audience breath holding.",
      emGoal: "Deep Suspense",
      image: hasImageInspiration
        ? `Wide establishing shot mirroring the initial color palette from reference. A dark, bottomless subterranean staircase descending into infinite mist, soft rim lighting outlining old pillars, 9:16 perspective.`
        : `Wide cinematic framing looking down into a spiral descent path within the stone tomb, eerie cold blue backlighting with contrasting narrow crimson streaks, hyper-realistic dust clouds, cinematic masterpiece, 9:16 framing.`,
      animation: `Slow rotating pitch-down camera motion descending into the abyss, flashlight ray flickering and dimming with dramatic pacing.`
    },
    {
      section: "Reveal",
      dur: "0:22 - 0:27",
      narration: language.toLowerCase() === "hindi"
        ? `यह कोई साधारण मंदिर नहीं है, यह एक प्राचीन ताले की तरह है जिसे खोला नहीं जाना चाहिए था!`
        : language.toLowerCase() === "hinglish"
        ? `Yeh koi normal mandir nahi hai, yeh ek ancient lock ki tarah hai jise kabhi kholna nahi chahiye tha!`
        : `This isn't a tomb or a temple. It's a key. And someone just turned it.`,
      purpose: "Deliver the major twist",
      retention: "Flicker strobing frame, hard visual edit, and shocking drop of all background sounds.",
      emGoal: "Awe and Realization",
      image: hasImageInspiration
        ? `Epic visual composition inheriting the reference palette. Mysterious celestial or metallic seals on the floor glowing with cold azure neon pulse, ancient stone fracturing outward in slow motion, 9:16 format.`
        : `An epic close-set tracking shot of a glowing monolithic seal emerging from fractured deep stone floor, intense cyan laser-thin light beams piercing through structural debris, hyper realistic 8k, 9:16 framing.`,
      animation: `Fast horizontal whip-pan transition, monolithic stone slabs sliding upwards with massive dynamic power, glowing dust clouds expanding.`
    },
    {
      section: "CTA",
      dur: "0:27 - 0:30",
      narration: language.toLowerCase() === "hindi"
        ? `ऐसी ही रहस्यमयी कहानियों के लिए अभी फॉलो करें और कमेंट में 'REVEAL' लिखें!`
        : language.toLowerCase() === "hinglish"
        ? `Aise hi mysterious stories ke liye abhi follow karein aur comment mein 'REVEAL' likhein!`
        : `What mysteries are hidden in your city? Write them down below, subscribe for the next chapter.`,
      purpose: "Lock in metrics and social replies",
      retention: "Dynamic bright on-screen text overlays sliding in from bottom margins with CTA contrast.",
      emGoal: "Belonging & Immediate Action",
      image: hasImageInspiration
        ? `Atmospheric cinematic transition shot maintaining reference color tones. A dark stylized background showing an elegant minimal crest, soft moody background reflections, creator branding aesthetic, 9:16 frame.`
        : `Clean atmospheric minimalist backdrop, soft cinematic dark ash particles drifting against a mysterious leather textured canvas, glowing geometric outline centered, photorealistic, 9:16 cinematic format.`,
      animation: `Extremely smooth cinematic pull-out camera movement, ambient backlight glowing brighter, dust floating elegantly in ambient space.`
    }
  ];

  // Map to GenerationResult format
  const hooks = [
    {
      type: "curiosity",
      title: "The Curiosity Angle",
      hook: language.toLowerCase() === "hindi"
        ? `इतिहासकारों ने इस प्राचीन मंदिर के बारे में हमसे झूठ क्यों बोला?`
        : `Why did historians bury the original blueprints of this ancient structure?`
    },
    {
      type: "emotional",
      title: "The Emotional Connection",
      hook: language.toLowerCase() === "hindi"
        ? `इस अकेले खंडहर की कहानी आपके रोंगटे खड़े कर देगी।`
        : `The tragic truth of the builders who built this, only so they would be forgotten.`
    },
    {
      type: "shocking",
      title: "The Shocking Hook",
      hook: language.toLowerCase() === "hindi"
        ? `इस स्थान पर रात बिताने वाले कभी वापस लौटकर नहीं आए!`
        : `The satellites showed something hidden underneath this territory that shouldn't exist.`
    },
    {
      type: "storytelling",
      title: "The Storyteller's Opener",
      hook: language.toLowerCase() === "hindi"
        ? `कई सदियों पहले, यहाँ एक ऐसी घटना घटी जिसने समय को ही रोक दिया...`
        : `In 1542, an entire village vanished overnight leaving only this mark behind...`
    },
    {
      type: "fear",
      title: "The Danger/Fear Opener",
      hook: language.toLowerCase() === "hindi"
        ? `अगर आपको अपनी ज़िंदगी प्यारी है, तो इस स्थान के पास जाने की भूल कभी मत करना!`
        : `Check your coordinates, because if you ever get too close to this spot, you cannot turn back.`
    }
  ];

  const script = baseScenes.map((s, idx) => ({
    sceneNumber: idx + 1,
    section: s.section,
    narration: s.narration,
    duration: s.dur,
    emotionalIntensity: idx === 2 ? "Extreme" : idx > 0 ? "High" : "Medium"
  }));

  const sceneBreakdown = baseScenes.map((s, idx) => ({
    sceneNumber: idx + 1,
    duration: s.dur,
    purpose: s.purpose,
    retentionObjective: s.retention,
    emotionalGoal: s.emGoal
  }));

  const imagePrompts = baseScenes.map((s, idx) => ({
    sceneNumber: idx + 1,
    prompt: s.image
  }));

  const animationPrompts = baseScenes.map((s, idx) => ({
    sceneNumber: idx + 1,
    prompt: s.animation
  }));

  const seoPackage = {
    title: `The Hidden Truth of ${topic} Revealed`,
    description: `Unlocking the forbidden mysteries and secret history of ${topic} that historians chose to stay silent about. Designed specifically for short-form video algorithms.`,
    youtubeShorts: {
      caption: `This secret about ${topic} changes everything we were taught! 😱 #historymystery #secrets`,
      hashtags: ["Shorts", "Mystery", "HistoryMysteries", "ReelForgeAI", "FacelessCreator"],
      cta: "Subscribe for more forgotten histories!"
    },
    instagramReels: {
      caption: `They tried to erase this history but the truth always finds a way. Drop a 'REVEAL' in the comments to join the circle. 🏛️✨`,
      hashtags: ["Reels", "ExplorePage", "ViralFacts", "AtmosphericMysteries", "CreatorMindset"],
      cta: "Follow for daily cinematic deep dives!"
    },
    tiktok: {
      caption: `Wait till the end to see the true purpose behind ${topic} 🤯 #fyp #trending #facelessreels`,
      hashtags: ["TikTokSecrets", "EerieStories", "UncannyValley", "ViralStories", "FYPage"],
      cta: "Share this with a friend who loves secrets!"
    }
  };

  return {
    overview: {
      topic: topic,
      niche: finalNiche,
      platform: platform,
      tone: computedTone,
      language: language,
      estimatedDuration: estTime,
      viralityScore: Math.floor(Math.random() * 8) + 90, // score of 90-97
      retentionScore: Math.floor(Math.random() * 10) + 88, // score of 88-97
      thesis: `This short-form package triggers high situational curiosity within the initial 1.5 seconds. The combination of intense atmospheric ${computedTone} palette paired with the specific storytelling rhythm in ${language} forces retention. The ${platform} algorithm optimizes strongly for comment engagement; hence, the final section triggers immediate social participation.`
    },
    hooks: hooks,
    script: script,
    sceneBreakdown: sceneBreakdown,
    imagePrompts: imagePrompts,
    animationPrompts: animationPrompts,
    seoPackage: seoPackage
  };
}

// Vite integration & Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode setup
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production build setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ReelForge Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
