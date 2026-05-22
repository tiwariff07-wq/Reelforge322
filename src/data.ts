import { GenerationResult } from "./types";

export interface ShowcaseTemplate {
  name: string;
  description: string;
  icon: string;
  result: GenerationResult;
}

export const SHOWCASE_TEMPLATES: ShowcaseTemplate[] = [
  {
    name: "Ancient Indian Temples (Horror)",
    description: "Eerie dark fantasy tour of lost architecture, foggy visual continuity, and shocking engagement hooks.",
    icon: "Ghost",
    result: {
      overview: {
        topic: "Abandoned Indian temples at night",
        niche: "Horror & Lost Lore",
        platform: "YouTube Shorts",
        tone: "Horror",
        language: "Hinglish",
        estimatedDuration: "35 seconds",
        viralityScore: 97,
        retentionScore: 94,
        thesis: "Leverages intense architectural mystery paired with a Hinglish conversational pacing scheme. Features micro suspense drops at scene midpoints to disrupt the average 6-second drop-off threshold."
      },
      hooks: [
        {
          type: "curiosity",
          title: "The Historical Secret",
          hook: "Archaeologists ne is mandir ke underground doors ko kyu ban kiya? Sach jaan kar darr jaoge."
        },
        {
          type: "shocking",
          title: "The Forbidden Fact",
          hook: "India ka ek aisa khandar mandir jahan Google satellite ka camera bhi malfunction ho gaya!"
        },
        {
          type: "fear",
          title: "Survival Angle",
          hook: "Agar raat ke 12 baje ke baad tum is jagah par khade ho jao, toh aawazein peeche nahi chhodengi."
        },
        {
          type: "storytelling",
          title: "Legend Narrative",
          hook: "13th Century mein ek aisi warning stone par likhi gayi jise aaj hum sach hote dekh rahe hain..."
        },
        {
          type: "emotional",
          title: "Forgotten Sacrifice",
          hook: "Jis murtikaar ne is khandar ko banaya, use raat ke andhere mein kyu gayab kar diya gaya?"
        }
      ],
      script: [
        {
          sceneNumber: 1,
          section: "Hook",
          narration: "Kya aapko pata hai is mandir ke peeche ka asli sach? Koi iske baare mein baat nahi karna chahta!",
          duration: "0s - 7s",
          emotionalIntensity: "Extreme"
        },
        {
          sceneNumber: 2,
          section: "Build-up",
          narration: "Deewaron par bani ye aakritiyan sirf art nahi hain, ye ek aisi warning hai jise ignore kiya gaya!",
          duration: "7s - 15s",
          emotionalIntensity: "High"
        },
        {
          sceneNumber: 3,
          section: "Suspense",
          narration: "Aur fir sudden, adhi raat ko, us gehre garbhgrah se rone jaisi aawazein aane lagti hain...",
          duration: "15s - 25s",
          emotionalIntensity: "Extreme"
        },
        {
          sceneNumber: 4,
          section: "Reveal",
          narration: "Yeh koi normal mandir nahi hai, yeh ek ancient lock ki tarah hai jise kabhi kholna nahi chahiye tha!",
          duration: "25s - 31s",
          emotionalIntensity: "Extreme"
        },
        {
          sceneNumber: 5,
          section: "CTA",
          narration: "Aise hi mysterious stories ke liye abhi follow karein aur comment mein 'REVEAL' likhein!",
          duration: "31s - 35s",
          emotionalIntensity: "Medium"
        }
      ],
      sceneBreakdown: [
        {
          sceneNumber: 1,
          duration: "7 seconds",
          purpose: "Stop mobile scroll swipe in 1.5 seconds",
          retentionObjective: "Spike attention with neon fog highlights and a hollow ancient audio echo.",
          emotionalGoal: "Severe curiosity and dread"
        },
        {
          sceneNumber: 2,
          duration: "8 seconds",
          purpose: "Escalate world narrative stakes",
          retentionObjective: "Contrast warm torch glow against cold damp stone backgrounds.",
          emotionalGoal: "Intrigue & architectural lore suspense"
        },
        {
          sceneNumber: 3,
          duration: "10 seconds",
          purpose: "Reach absolute acoustic and visual tension peak",
          retentionObjective: "Sudden camera frame crop to 150%, dropping ambient lights to total black outline.",
          emotionalGoal: "Visceral claustrophobic suspense"
        },
        {
          sceneNumber: 4,
          duration: "6 seconds",
          purpose: "Deliver mind-blowing plot explanation",
          retentionObjective: "Display massive high-contrast neon teal warning overlays sliding on screen.",
          emotionalGoal: "Visual awe and revelation"
        },
        {
          sceneNumber: 5,
          duration: "4 seconds",
          purpose: "Convert scroll reaction into social comments",
          retentionObjective: "Interactive follow-badge float in center with comment keyword focus.",
          emotionalGoal: "Belonging & instant digital response"
        }
      ],
      imagePrompts: [
        {
          sceneNumber: 1,
          prompt: "Ancient abandoned Indian temple at night, cinematic moonlight illuminating cracked stone corridors, volumetric fog drifting through ruined pillars, ultra detailed carvings with weathered textures, dramatic blue-grey cinematic color grading, eerie dark fantasy atmosphere, low-angle cinematic composition, shallow depth of field, subtle floating ash particles, hyper realistic environmental storytelling, Unreal Engine cinematic quality, high contrast shadows, photorealistic horror aesthetic, 9:16 vertical framing, cinematic suspense lighting"
        },
        {
          sceneNumber: 2,
          prompt: "Extremely close macro shot of ancient stone carvings inside a dark temple chamber, weathered rock relief textures reflecting warm amber flame glow, flickering shadows cast onto eerie carvings, cold cyan backlighting, 85mm lens styling, shallow depth of field, floating dust motes, rich historical dread atmosphere, 9:16 portrait format"
        },
        {
          sceneNumber: 3,
          prompt: "Wide angle low position shot looking into a bottomless spiral underground staircase of a stone tomb, dark mist rising upward, flickering glowing blue ruins on the deep walls, cold shadows framing the edge of the screen, epic perspective, photo-realistic gothic horror, moody fog layers, 9:16 ratio"
        },
        {
          sceneNumber: 4,
          prompt: "A mystical glowing seal mechanism centered on an ancient cracked temple floor, intense turquoise laser beams slicing through dust clouds, dynamic flying rock fragments suspended in mid-air, extreme visual contrast, photorealistic cinematic masterpiece, 9:16 vertical composition"
        },
        {
          sceneNumber: 5,
          prompt: "Atmospheric minimalist dark canvas, soft particles of glowing gray and ash drifting slowly inside a dark moody room, subtle ambient light outline in the center, premium texture backplate, elegant cinematic design, 9:16 framing"
        }
      ],
      animationPrompts: [
        {
          sceneNumber: 1,
          prompt: "Slow cinematic push-in camera movement toward the temple entrance, drifting volumetric fog movement across cracked stone pathways, subtle handheld instability for realism, floating ash particles illuminated by flickering torchlight, dramatic suspense pacing, cinematic parallax depth simulation, atmospheric horror ambiance, slow motion cinematic lighting transitions, immersive dark fantasy movement language"
        },
        {
          sceneNumber: 2,
          prompt: "Horizontal micro-tracking shot crawling across the face of the stone carvings, subtle flicker rate animation of the warm flame, glowing dust motes rising, camera maintaining shallow visual focus."
        },
        {
          sceneNumber: 3,
          prompt: "A swirling pitch-down drone camera rotation descending slowly into the spiral tunnel abyss, mist rising dynamically around the margins, dim flashlight beam jittering slightly."
        },
        {
          sceneNumber: 4,
          prompt: "Sudden high-velocity forward push toward the center seal, floor fragments fracturing outward, light beam energy swelling and pulsating with dynamic lens flares."
        },
        {
          sceneNumber: 5,
          prompt: "Ultra-slow motion ambient pull-out, ash particles floating in sweeping orbital path, high-contrast glow gently fading out over the frame."
        }
      ],
      seoPackage: {
        title: "The Secret Key of Archaeological India",
        description: "Unraveling the forbidden architectural mystery of ancient abandoned Indian temples that historical textbooks ignored.",
        youtubeShorts: {
          caption: "This lost secret about ancient architectural locks changes history! 😱🏛️ #history रहस्य #indianruins #ytshorts",
          hashtags: ["Shorts", "AncientMystery", "LostLore", "ReelForgeAI", "IndiaHorror"],
          cta: "Subscribe for more historical secrets!"
        },
        instagramReels: {
          caption: "They hid the blueprints for a reason. Some locks are meant to stay closed forever. Comment 'WARN' to get the full story list in your DM. 🏛️🌑",
          hashtags: ["Reels", "InstagramReels", "HorrorStories", "LostTemples", "FacelessCreator"],
          cta: "Follow for daily cinematic mysteries!"
        },
        tiktok: {
          caption: "Watch till the end to see the ancient map satellite coordinates... 🤫🚨 #ancientmysteries #creepy #fyp",
          hashtags: ["HorrorTikTok", "ForbiddenLore", "SpookyFacts", "ShortFormCreator", "Foryou"],
          cta: "Share this with a history buff friend!"
        }
      }
    }
  },
  {
    name: "The Power of Discipline (Motivation)",
    description: "High-octane motivational monologue featuring deep luxury noir elements, cinematic shadow play, and modern metrics.",
    icon: "Flame",
    result: {
      overview: {
        topic: "Unbreakable discipline over motivation",
        niche: "Self-Mastery & Growth",
        platform: "Instagram Reels",
        tone: "Motivation",
        language: "English",
        estimatedDuration: "30 seconds",
        viralityScore: 95,
        retentionScore: 92,
        thesis: "Targets high-performance creators. Utilizes contrasting light/dark luxury elements to keep high-brow prestige positioning, encouraging shares and saves which algorithms value high-ranking."
      },
      hooks: [
        {
          type: "curiosity",
          title: "The 1% Rule",
          hook: "The average person thinks consistency is about effort. The 1% know it's actually about elimination."
        },
        {
          type: "shocking",
          title: "The Cold Truth",
          hook: "Your motivation is lying to you. It's the reason you're still staying in the exact same spot."
        },
        {
          type: "emotional",
          title: "The Quiet Sacrifice",
          hook: "While everyone else is asleep, the silent work you do in the dark is building an empire."
        },
        {
          type: "storytelling",
          title: "The Combat Mind",
          hook: "In 1943, a warrior was asked: 'What do you do when you want to give up?' His response was brutal..."
        },
        {
          type: "fear",
          title: "The Regret Trap",
          hook: "If you don't build your discipline today, regret will consume you in five years."
        }
      ],
      script: [
        {
          sceneNumber: 1,
          section: "Hook",
          narration: "Your motivation is lying to you. It's the reason you're still staying in the exact same spot.",
          duration: "0s - 6s",
          emotionalIntensity: "High"
        },
        {
          sceneNumber: 2,
          section: "Build-up",
          narration: "Consistency doesn't care how you feel. It demands you show up when your mind tells you to surrender.",
          duration: "6s - 13s",
          emotionalIntensity: "High"
        },
        {
          sceneNumber: 3,
          section: "Suspense",
          narration: "Every time you choose comfort, you kill a version of yourself that could have ruled your world.",
          duration: "13s - 21s",
          emotionalIntensity: "Extreme"
        },
        {
          sceneNumber: 4,
          section: "Reveal",
          narration: "Discipline isn't chains. It's the ultimate weapon of the modern conquering mind.",
          duration: "21s - 26s",
          emotionalIntensity: "Extreme"
        },
        {
          sceneNumber: 5,
          section: "CTA",
          narration: "If you're ready to break the cycle, comment 'DISCIPLINE' and join the elite standard today.",
          duration: "26s - 30s",
          emotionalIntensity: "Medium"
        }
      ],
      sceneBreakdown: [
        {
          sceneNumber: 1,
          duration: "6 seconds",
          purpose: "Eliminate early user bounce rate",
          retentionObjective: "High-contrast luxury silhouette of a lone runner under heavy rain, high shadow contrast.",
          emotionalGoal: "Uncomfortable truth realization"
        },
        {
          sceneNumber: 2,
          duration: "7 seconds",
          purpose: "Deliver core struggle narrative",
          retentionObjective: "Juxtaposition of rich metallic chrome surfaces against a dim workout space.",
          emotionalGoal: "Mental alignment and focus"
        },
        {
          sceneNumber: 3,
          duration: "8 seconds",
          purpose: "Spike listener internal conflict",
          retentionObjective: "Fast, striking cuts of digital clock digits winding down under dark crimson light.",
          emotionalGoal: "Frustration & powerful drive"
        },
        {
          sceneNumber: 4,
          duration: "5 seconds",
          purpose: "Provide the victorious solution",
          retentionObjective: "Bright amber sunset silhouette of a high-rise city outline with clean bold typography.",
          emotionalGoal: "Immense resolve & inner strength"
        },
        {
          sceneNumber: 5,
          duration: "4 seconds",
          purpose: "Direct community commenting behavior",
          retentionObjective: "Sleek sliding glass overlay with clear bold typography asking for follow triggers.",
          emotionalGoal: "Urgent call to join"
        }
      ],
      imagePrompts: [
        {
          sceneNumber: 1,
          prompt: "Low-key cinematic portrait of an athletic silhouette pacing through a dark concrete corridor at dawn, dramatic side-lighting casting infinite shadows, mist hovering on the wet floor, luxury monocolor aesthetic, 8k realism, shallow depth of field, 9:16 vertical composition"
        },
        {
          sceneNumber: 2,
          prompt: "Professional macro shot of sleek raw weights inside a premium dark fitness club, moody lighting highlights reflecting off polished steel, moody dark graphite shadows, minimalist architectural design, 9:16 vertical framing"
        },
        {
          sceneNumber: 3,
          prompt: "An elegant minimal digital clock glowing crimson 4:30 AM in a pitch black room, dark luxury furniture slightly visible in the shadows, dust particles floating in the light shaft, dramatic contrast, 9:16 aspect ratio"
        },
        {
          sceneNumber: 4,
          prompt: "Stunning low angle shot looking up at a towering modern concrete skyscraper reaching toward an amber sunset sky, warm sun flares peaking behind the roofline, cinematic high-contrast grading, 9:16 frame"
        },
        {
          sceneNumber: 5,
          prompt: "Premium luxury slate grey background, subtle elegant gold and metallic silver dust floating, soft studio rim light glowing at the top margin, clean 9:16 visual texture"
        }
      ],
      animationPrompts: [
        {
          sceneNumber: 1,
          prompt: "Slow steady camera dolly following the silhouette from behind, micro lens flares from left, background mist swirling gently around ankles, dramatic cinematic pulse."
        },
        {
          sceneNumber: 2,
          prompt: "Cinematic horizontal dolly slide revealing steel weight stack in extreme detail, beautiful specular highlight glares shifting across metallic curves."
        },
        {
          sceneNumber: 3,
          prompt: "Slow zoom-in toward the crimson clock digits, micro-glimmers of red light reflecting on glossy surfaces, dust settling delicately."
        },
        {
          sceneNumber: 4,
          prompt: "Dynamic vertical pedestal crane shot rising alongside the concrete skyscraper, sun rays shifting and expanding across the camera lens."
        },
        {
          sceneNumber: 5,
          prompt: "Extremely gentle orbital pull-out, gold dust flowing in slow motion with subtle field of view parallax changes."
        }
      ],
      seoPackage: {
        title: "Discipline Vs Motivation: The 1% Secret",
        description: "Why relying on motivation guarantees mediocrity. Understand the quiet systems of discipline used by premium high-achievers.",
        youtubeShorts: {
          caption: "Stop waiting for motivation. It won't save you. 🧠♟️ #discipline #mindsetgrind #productivitytips #ytshorts",
          hashtags: ["Shorts", "DisciplineOverMotivation", "MillionaireHabits", "PeakState", "ReelForgeAI"],
          cta: "Subscribe for elite creator codes."
        },
        instagramReels: {
          caption: "The silent work done in the dark decides your empire. Comfort is a trap. Save this to remind yourself when the mind wants to quit. Drop 'DISCIPLINE' to register your commitment. ♟️🔥",
          hashtags: ["Reels", "Consistency", "LuxuryGrind", "SelfMastery", "SuccessMindset"],
          cta: "Follow for daily focus pillars!"
        },
        tiktok: {
          caption: "Consistency is about who you choose to eliminate. Are you ready? 🤫⛓️ #discipline #foryoupage #focustok",
          hashtags: ["SuccessHacks", "MindsetMatters", "HabitStacking", "MorningRoutine", "ViralMindset"],
          cta: "Share this with someone who needs to hear it today!"
        }
      }
    }
  }
];
