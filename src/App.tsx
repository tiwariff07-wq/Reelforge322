/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Cpu,
  Tv,
  Flame,
  Ghost,
  Upload,
  Image as ImageIcon,
  Clock,
  Languages,
  Sliders,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  TrendingUp,
  Award,
  Video,
  FileDown,
  Play,
  Heart,
  Volume2,
  CheckCircle2,
  BookmarkCheck,
  Compass,
  ArrowRight,
  Zap,
  CheckCircle,
  HelpCircle,
  Code
} from "lucide-react";
import { GenerationRequest, GenerationResult, HookItem, ScriptScene, SceneBreakdownItem, ImagePromptItem, AnimationPromptItem } from "./types";
import { SHOWCASE_TEMPLATES, ShowcaseTemplate } from "./data";
import { jsPDF } from "jspdf";

export default function App() {
  // Input parameters state
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [niche, setNiche] = useState("Mystery & Lore");
  const [tone, setTone] = useState("Cinematic");
  const [language, setLanguage] = useState("English");
  const [detailLevel, setDetailLevel] = useState("Cinematic");
  const [duration, setDuration] = useState("30 seconds");

  // Sample/Reference Image upload state
  const [referenceImg, setReferenceImg] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<{
    mood: string;
    lighting: string;
    colorPalette: string[];
    atmosphere: string;
    style: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Simulation / AI Generation pipeline state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [warningNotice, setWarningNotice] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Generated results
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [focusedTab, setFocusedTab] = useState<string>("overview");

  // UX micro-states
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({});

  // Populate dynamic suggestions
  const SUGGESTED_IDEAS = [
    { text: "Lost temple of the Himalayan peak", tone: "Horror", niche: "Mystery & Lore" },
    { text: "The brutal 4:00 AM rules of modern stoicism", tone: "Motivation", niche: "Self-Mastery & Growth" },
    { text: "Futuristic digital hacker in deep neo Tokyo", tone: "Anime", niche: "Cyberpunk Stories" },
    { text: "Ancient Roman general betrayed by his army", tone: "Historical", niche: "Historical Chronology" }
  ];

  // Set default interactive template to make user experience pristine immediately
  useEffect(() => {
    // Start with the first showcase pre-loaded so they can explore output quality instantly!
    setResult(SHOWCASE_TEMPLATES[0].result);
  }, []);

  // Multi-stage pipe instructions for AI generation loader
  const PIPELINE_STEPS = [
    "Analyzing scroll hooks & emotional pacing vectors...",
    "Interpreting uploaded style references...",
    "Structuring narrative scene nodes (Hook -> Build -> Reveal)...",
    "Calibrating Midjourney 9:16 lighting prompts...",
    "Generating environmental continuity guides...",
    "Simulating physics parameters for Sora, Runway, & Luma...",
    "Polishing SEO metadata titles & multi-platform captions...",
    "Compiling ReelForge Export Blueprint..."
  ];

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processReferenceFile(files[0]);
    }
  };

  const processReferenceFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file to guide visual continuity.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setReferenceImg(b64);
      // Simulate rich creative vision analyser data
      setImageAnalysis({
        mood: tone === "Horror" ? "Dark Gothic Foreboding" : tone === "Luxury" ? "Prestige Cinematic High-Contrast" : "Cinematic Dreamy Depth",
        lighting: "Rembrandt Split-Lux Volumetric",
        colorPalette: tone === "Horror" ? ["#030712", "#1e1b4b", "#06b6d4"] : ["#0b0f19", "#d97706", "#22c55e"],
        atmosphere: tone === "Horror" ? "Eerie Shrouded Mist" : "High-performance Deep Focus",
        style: tone === "Anime" ? "Cel-Shaded Digital Illustration" : "High-Resolution Anamorphic Frame"
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearReferenceImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReferenceImg(null);
    setImageAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Run pipeline trigger
  const runGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setErrorState(null);
    setWarningNotice(null);

    // Multi-stage fake progress increments to keep user highly engaged
    const startStepTimer = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < PIPELINE_STEPS.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          niche,
          tone,
          language,
          detailLevel,
          duration,
          referenceImg
        })
      });

      const parsed = await response.json();
      clearInterval(startStepTimer);

      if (parsed.success) {
        setGenerationStep(PIPELINE_STEPS.length - 1);
        setTimeout(() => {
          setResult(parsed.data);
          if (parsed.warning) {
            setWarningNotice(parsed.warning);
          }
          setIsGenerating(false);
          setFocusedTab("overview");
        }, 800);
      } else {
        throw new Error(parsed.error || "Generation pipeline failed.");
      }
    } catch (err: any) {
      clearInterval(startStepTimer);
      setIsGenerating(false);
      setErrorState(err.message || "An unexpected error occurred in backend orchestration.");
    }
  };

  // Load static precompiled showcase example instantly
  const loadShowcaseTemplate = (tmpl: ShowcaseTemplate) => {
    setResult(tmpl.result);
    setFocusedTab("overview");
    setTopic(tmpl.result.overview.topic);
    setPlatform(tmpl.result.overview.platform);
    setNiche(tmpl.result.overview.niche);
    setTone(tmpl.result.overview.tone);
    setLanguage(tmpl.result.overview.language);
    setDuration(tmpl.result.overview.estimatedDuration);
    setWarningNotice(null);

    // Auto scroll to results section
    document.getElementById("output-canvas")?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper copy to clipboard handler
  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [identifier]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [identifier]: false }));
    }, 2000);
  };

  const toggleSceneExpand = (sceneNum: number) => {
    setExpandedScenes((prev) => ({ ...prev, [sceneNum]: !prev[sceneNum] }));
  };

  // Premium PDF Generation Trigger on Client using jsPDF
  const exportPDF = () => {
    if (!result) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Cover Page Configuration (Rich Dark Onyx Background)
      doc.setFillColor(15, 23, 42); // slate-900 background tint
      doc.rect(0, 0, 210, 297, "F");

      // Draw subtle futuristic visual guidelines
      doc.setDrawColor(30, 41, 59);
      doc.line(10, 10, 200, 10);
      doc.line(10, 10, 10, 287);
      doc.line(200, 10, 200, 287);
      doc.line(10, 287, 200, 287);

      doc.setTextColor(59, 130, 246); // cobalt-blue accent
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(28);
      doc.text("REELFORGE AI", 25, 60);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("PREMIUM LIFE-FORMAT BLUEPRINT", 25, 70);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Faceless Short-Form Content Production Specification", 25, 76);

      doc.setDrawColor(59, 130, 246);
      doc.line(25, 84, 185, 84);

      // Metadata Cards
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text("METADATA SPECIFICATION:", 25, 100);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);

      const metadataRows = [
        `Video Topic: ${result.overview.topic}`,
        `Platform Channel: ${result.overview.platform}`,
        `Creative Niche: ${result.overview.niche}`,
        `Target Voice Tone: ${result.overview.tone}`,
        `Narration Language: ${result.overview.language}`,
        `Est. Video Duration: ${result.overview.estimatedDuration}`,
        `Virality Threshold: ${result.overview.viralityScore}% (High-Engagement Target)`,
        `Target Retention Pacing: ${result.overview.retentionScore}%`
      ];

      let metaY = 110;
      metadataRows.forEach((row) => {
        doc.text(`> ${row}`, 25, metaY);
        metaY += 7;
      });

      // Viral Thesis Area
      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.text("CREATOR AUDIENCES & VIRALITY THESIS:", 25, 180);

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(226, 232, 240);

      const thesisLines = doc.splitTextToSize(result.overview.thesis, 160);
      doc.text(thesisLines, 25, 188);

      // Footer branding
      doc.setTextColor(71, 85, 105);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Designed via ReelForge OS. Export Timestamp: ${new Date().toLocaleDateString()}`, 25, 275);

      // Page 2: Scroll Stopping Hooks
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("1. SCROLL-STOPPING SCREEN HOOKS", 25, 25);

      doc.setDrawColor(33, 150, 243);
      doc.line(25, 29, 185, 29);

      let hookY = 42;
      result.hooks.forEach((h, i) => {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(11);
        doc.text(`[HOOK ${i + 1}] - ${h.title} (${h.type.toUpperCase()})`, 25, hookY);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const hookLines = doc.splitTextToSize(`"${h.hook}"`, 155);
        doc.text(hookLines, 28, hookY + 5);
        hookY += 15 + (hookLines.length * 4);
      });

      // Page 3: Full Narration Script
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("2. PRODUCTION ENGAGEMENT NARRATION", 25, 25);

      doc.setDrawColor(33, 150, 243);
      doc.line(25, 29, 185, 29);

      let scriptY = 40;
      result.script.forEach((s) => {
        if (scriptY > 260) {
          doc.addPage();
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, 210, 297, "F");
          scriptY = 25;
        }

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(11);
        doc.text(`Scene ${s.sceneNumber} (${s.section}) — ${s.duration} [Intensity: ${s.emotionalIntensity}]`, 25, scriptY);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const scriptLines = doc.splitTextToSize(s.narration, 155);
        doc.text(scriptLines, 28, scriptY + 5);

        scriptY += 14 + (scriptLines.length * 5);
      });

      // Page 4: Midjourney Prompt sheets
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("3. MIDJOURNEY / FLUX PROMPTS (9:16)", 25, 25);

      doc.setDrawColor(33, 150, 243);
      doc.line(25, 29, 185, 29);

      let pY = 40;
      result.imagePrompts.forEach((ip, idx) => {
        if (pY > 260) {
          doc.addPage();
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, 210, 297, "F");
          pY = 25;
        }

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(10);
        doc.text(`SCENE ${ip.sceneNumber} — MIDJOURNEY PROMPT (CONTINUITY CALIBRATED)`, 25, pY);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(241, 245, 249);
        doc.setFontSize(9);
        const promptLines = doc.splitTextToSize(ip.prompt, 160);
        doc.text(promptLines, 25, pY + 5);

        pY += 10 + (promptLines.length * 4.5);
      });

      // Page 5: Video Animation Prompts
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("4. LUMA / RUNWAY CAMERA PHYSICS", 25, 25);

      doc.setDrawColor(33, 150, 243);
      doc.line(25, 29, 185, 29);

      let aY = 40;
      result.animationPrompts.forEach((ap) => {
        if (aY > 260) {
          doc.addPage();
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, 210, 297, "F");
          aY = 25;
        }

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(10);
        doc.text(`SCENE ${ap.sceneNumber} — CAMERA PHYSICS & MOTION CONTROL`, 25, aY);

        doc.setFont("Helvetica", "normal");
        doc.setTextColor(241, 245, 249);
        doc.setFontSize(9);
        const animLines = doc.splitTextToSize(ap.prompt, 160);
        doc.text(animLines, 25, aY + 5);

        aY += 10 + (animLines.length * 4.5);
      });

      // Page 6: distribution SEO package
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");

      doc.setTextColor(59, 130, 246);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text("5. MULTI-PLATFORM DISTRIBUTION & SEO", 25, 25);

      doc.setDrawColor(33, 150, 243);
      doc.line(25, 29, 185, 29);

      doc.setFontSize(11);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text("OFFICIAL VIDEO TITLE CHANNELS:", 25, 38);
      doc.setTextColor(255, 255, 255);
      doc.text(result.seoPackage.title, 25, 43);

      doc.setTextColor(59, 130, 246);
      doc.text("OFFICIAL SEARCHABLE DESCRIPTION:", 25, 53);
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      const seoDescLines = doc.splitTextToSize(result.seoPackage.description, 160);
      doc.text(seoDescLines, 25, 58);

      let distY = 85;

      // Platform details mapping
      const channels = [
        { name: "YOUTUBE SHORTS DATA", pkg: result.seoPackage.youtubeShorts },
        { name: "INSTAGRAM REELS DATA", pkg: result.seoPackage.instagramReels },
        { name: "TIKTOK OPTIMIZED PATH", pkg: result.seoPackage.tiktok }
      ];

      channels.forEach((chan) => {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.setFontSize(11);
        doc.text(`>>> ${chan.name}`, 25, distY);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(241, 245, 249);
        const capLines = doc.splitTextToSize(`Caption: ${chan.pkg.caption}`, 155);
        doc.text(capLines, 28, distY + 5);

        const tagsText = chan.pkg.hashtags.map(t => `#${t}`).join(" ");
        doc.text(`Hashtags: ${tagsText}`, 28, distY + 8 + (capLines.length * 4.5));
        doc.text(`CTA Trigger: ${chan.pkg.cta}`, 28, distY + 14 + (capLines.length * 4.5));

        distY += 24 + (capLines.length * 4.5);
      });

      doc.save(`ReelForge_${result.overview.topic.replace(/\s+/g, "_")}_Blueprint.pdf`);
    } catch (err) {
      console.error("PDF export rendering crash:", err);
      alert("Encountered an obstacle generating standard PDF structure. Try loading another template.");
    }
  };

  return (
    <div id="reelforge-saas-root" className="min-h-screen bg-[#070a13] text-gray-100 font-sans antialiased overflow-x-hidden selection:bg-blue-600/30 selection:text-white pb-12">
      
      {/* Glow Backdrops decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-900/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-950/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Warning Notice Banner */}
      {warningNotice && (
        <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/60 border-b border-amber-500/30 text-amber-200 px-4 py-3 text-xs md:text-sm text-center font-mono flex items-center justify-center gap-2 relative z-50">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{warningNotice}</span>
          <button 
            onClick={() => setWarningNotice(null)} 
            className="ml-4 underline hover:text-white font-sans text-[10px] uppercase tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Premium OS Header */}
      <header id="reelforge-header" className="border-b border-slate-900 bg-[#070a13]/85 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-[#070a13] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              ReelForge <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded uppercase font-sans tracking-wide">AI OS</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans">faceless shorts engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-lg text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-slate-400">STATUS:</span>
            <span className="text-emerald-400 uppercase tracking-wider">operating</span>
          </div>
        </div>
      </header>

      {/* Hero Presentation */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/10 border border-blue-500/15 text-xs text-blue-300 font-sans mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>FACELLESS WORKFLOW COMPRESSION ENGINE</span>
          </div>
          <h2 className="text-3.5xl md:text-5xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
            TRANSFORM IDEAS INTO <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">VIRAL REELS</span> IN ONE CLICK.
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-3 font-sans">
            Stop switching between chatbots, image prompt sheets, and tag builders.
            Instantly formulate premium production-ready scripts, visual prompts, camera directions, and SEO data.
          </p>
        </div>

        {/* Console Box Form Grid */}
        <section id="prompt-console-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-slate-950/60 border border-slate-900 rounded-2xl p-5 md:p-7 backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-5 border-b border-slate-900 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#94a3b8] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" /> PROMPT CONSOLE
              </span>
              <span className="text-[10px] text-slate-500 font-mono">v1.2-RELEASE</span>
            </div>

            <form onSubmit={runGeneration} className="space-y-6">
              
              {/* Dynamic Helper Suggestions */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans text-slate-400 uppercase tracking-wider block">
                  Quick-load dynamic concepts:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_IDEAS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTopic(item.text);
                        setTone(item.tone);
                        setNiche(item.niche);
                      }}
                      className="text-[11px] text-slate-300 hover:text-white bg-slate-900/60 hover:bg-blue-950/30 border border-slate-800/80 hover:border-blue-500/30 px-2.5 py-1 rounded-md transition-all duration-200"
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Script Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-sans text-slate-200 uppercase tracking-widest flex justify-between">
                  <span>ENTER YOUR SHORT-FORM VIDEO IDEA <span className="text-red-500">*</span></span>
                  <span className={`${topic.length > 150 ? 'text-amber-400' : 'text-slate-500'} font-mono`}>{topic.length} characters</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe your video vision details (e.g., A horror story about haunted statues coming alive in dense fog... or ... How discipline builds an empire while everyone sleeps)"
                    className="w-full text-slate-100 placeholder:text-slate-600 bg-slate-900/30 border border-slate-800 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm md:text-base outline-none transition-all duration-300 resize-y"
                    required
                  />
                  {!topic.trim() && (
                    <div className="absolute right-3.5 bottom-3.5 flex items-center gap-1 text-slate-600 text-xs pointer-events-none">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Configuration Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Platform Selection */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Tv className="w-3.5 h-3.5 text-blue-400" /> Platform Selection
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="TikTok-style videos">TikTok Videos (Algorithm optimized)</option>
                    <option value="Facebook Reels">Facebook Reels</option>
                  </select>
                </div>

                {/* Niche Indicator */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Production Niche
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="Mystery & Lore">Mystery & Dark Lore</option>
                    <option value="Self-Mastery & Growth">Self-Mastery & Growth</option>
                    <option value="Modern Lifestyle & Cinema">Lifestyle & Luxury Noir</option>
                    <option value="Educational & Science">Scientific Discoveries & Cosmic</option>
                    <option value="Finance & Growth Hacks">Wealth Secrets & Hard Truths</option>
                    <option value="Creative Storytelling">Historical Lore & Chronology</option>
                  </select>
                </div>

                {/* Tone Selector */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" /> Video Atmosphere Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="Cinematic">Cinematic Documentary</option>
                    <option value="Horror">Eerie Gothic Horror</option>
                    <option value="Emotional">Deeply Emotional / Touching</option>
                    <option value="Anime">Stylized Anime Art</option>
                    <option value="Dark">Grim Dark / Atmospheric</option>
                    <option value="Luxury">Prestige Noir / Elite Aesthetic</option>
                    <option value="Historical">Epic Historical Drama</option>
                    <option value="Motivation">Powerful Drive & Motivation</option>
                    <option value="Storytelling">Engaging Suspense / Storytelling</option>
                    <option value="Finance">Cold Money Intelligence</option>
                  </select>
                </div>

                {/* Language Selection */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Languages className="w-3.5 h-3.5 text-blue-400" /> Target Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="English">English (Global Universal)</option>
                    <option value="Hindi">Hindi (Regional Classical)</option>
                    <option value="Hinglish">Hinglish (Colloquial Conversational)</option>
                    <option value="Urdu">Urdu (Poetic Deep Dramatic)</option>
                    <option value="Bengali">Bengali (Rich Narrative Literary)</option>
                  </select>
                </div>

                {/* Prompt Detail Level Selection */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Zap className="w-3.5 h-3.5 text-blue-400" /> Prompt Detail Level
                  </label>
                  <select
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="Basic">Basic (Balanced Simple outline)</option>
                    <option value="Detailed">Detailed (Midjourney custom keywords)</option>
                    <option value="Cinematic">Cinematic (Lenses, lighting contrast)</option>
                    <option value="Ultra Cinematic">Ultra Cinematic (Debris physics, HDR references)</option>
                  </select>
                </div>

                {/* Expected Duration */}
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> Estimated Video Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#0a0f1d] text-slate-200 border border-slate-850 rounded-xl px-3 py-2.5 text-xs font-sans outline-none focus:border-blue-500/60"
                  >
                    <option value="15 seconds">15 Seconds (Super High-paced loop)</option>
                    <option value="30 seconds">30 Seconds (Standard Paced Retention)</option>
                    <option value="60 seconds">60 Seconds (Deep Lore Narrative)</option>
                  </select>
                </div>

              </div>

              {/* Sample/Reference Image Upload Component */}
              <div className="space-y-2">
                <label className="text-xs font-sans text-slate-300 uppercase tracking-widest block">
                  STYLE REFERENCE IMAGE (INTUITIVE PIPELINE AID)
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 pointer-events-auto cursor-pointer flex flex-col items-center justify-center text-center ${
                    isDragOver
                      ? "border-blue-400 bg-blue-950/20"
                      : referenceImg
                      ? "border-emerald-500/40 bg-zinc-950/40"
                      : "border-slate-800 hover:border-blue-500/40 bg-slate-900/10 hover:bg-slate-900/20"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processReferenceFile(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  {referenceImg ? (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-4 text-left">
                      <div className="relative shrink-0">
                        <img
                          src={referenceImg}
                          alt="Uploaded Style Reference"
                          className="w-24 h-24 object-cover rounded-lg border border-slate-800 shadow"
                        />
                        <button
                          type="button"
                          onClick={clearReferenceImage}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-105 transition-all"
                          title="Remove Reference"
                        >
                          <CheckCircle className="w-3.5 h-3.5 rotate-45" />
                        </button>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-emerald-400 font-bold flex items-center gap-1.5 uppercase font-mono tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Style Reference Engaged
                        </p>
                        <p className="text-slate-400 font-sans">
                          All generated prompt indices will automatically copy mood, contrast, and color palette patterns matching this preview block.
                        </p>
                        {imageAnalysis && (
                          <div className="flex flex-wrap gap-1 mt-1 font-mono text-[9px]">
                            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                              Tone: {imageAnalysis.mood}
                            </span>
                            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-blue-400">
                              Lux: {imageAnalysis.lighting}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 mb-2">
                        <Upload className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-sm text-slate-300 font-bold">
                        Drag and drop reference image or <span className="text-blue-400 underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 font-sans mt-1">
                        Midjourney prompts will dynamically adapt colors, lighting & mood of this image
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {errorState && (
                <div className="bg-red-950/50 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-xs md:text-sm font-sans flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                  <span>{errorState}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className={`w-full py-4 px-6 rounded-2xl font-bold font-sans tracking-wide text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                  isGenerating
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                    : !topic.trim()
                    ? "bg-slate-900/60 text-slate-600 border border-slate-905 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white hover:scale-[1.01] hover:shadow-blue-500/10 cursor-pointer text-base"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>GENERATE VIRAL CREATOR BLUEPRINT</span>
              </button>

            </form>
          </div>

          {/* Right Column: Precompiled Showcase Showcase Examples Card list */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 md:p-6 backdrop-blur-md">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-4 border-b border-slate-900 pb-2">
                <Compass className="w-4 h-4 text-emerald-400" /> ReelForge Reference Showcases
              </span>
              
              <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
                Click any showcase to explore exactly how the pipeline maintains prompt lighting continuity and scene-to-scene coherence before booting your custom generation:
              </p>

              <div className="space-y-4">
                {SHOWCASE_TEMPLATES.map((tmpl, idx) => {
                  const isCurHorror = tmpl.name.includes("Horror");
                  return (
                    <div
                      key={idx}
                      onClick={() => loadShowcaseTemplate(tmpl)}
                      className="group p-4 bg-slate-900/40 hover:bg-blue-950/20 border border-slate-800/80 hover:border-blue-500/30 rounded-xl cursor-pointer transition-all duration-350"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg bg-slate-950 text-xs shrink-0 ${isCurHorror ? 'text-red-400' : 'text-amber-400'}`}>
                            {isCurHorror ? <Ghost className="w-4.5 h-4.5" /> : <Flame className="w-4.5 h-4.5" />}
                          </div>
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                              {tmpl.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                              {tmpl.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1.5 transition-all shrink-0 mt-0.5" />
                      </div>

                      <div className="flex items-center gap-2 mt-3.5 border-t border-slate-900 pt-2.5 text-[10px] text-slate-500 font-mono">
                        <span className="bg-[#0c1228] border border-slate-850 px-1 py-0.5 rounded text-gray-300">
                          {tmpl.result.overview.platform}
                        </span>
                        <span className="bg-[#0c1228] border border-slate-850 px-1 py-0.5 rounded text-blue-400">
                          Tone: {tmpl.result.overview.tone}
                        </span>
                        <span className="bg-[#0c1228] border border-slate-850 px-1 py-0.5 rounded text-emerald-400 font-bold">
                          {tmpl.result.overview.viralityScore}% Virality
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Faceless System Features Info Indicator */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#0a1128]/80 to-[#0e172e]/60 border border-blue-900/20 shadow-lg">
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <BoxCheckIcon className="text-blue-400 w-4.5 h-4.5" /> THE PROMPT CONTINUITY LAW
              </h5>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                By injecting contextual seed references, ReelForge guarantees that objects, lights, clothing models, and environments are shared across scene scripts. Midjourney generations stay matched.
              </p>
            </div>

          </div>

        </section>

        {/* Dynamic Stepper Loader Screen */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 bg-slate-950/85 border border-slate-900 rounded-3xl p-6 md:p-10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-900">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-400 transition-all duration-700" 
                  style={{ width: `${((generationStep + 1) / PIPELINE_STEPS.length) * 100}%` }}
                />
              </div>

              <div className="max-w-md mx-auto space-y-6 py-6">
                <div className="w-16 h-16 rounded-full bg-blue-950/60 border border-blue-500/20 flex items-center justify-center mx-auto relative">
                  <Cpu className="w-8 h-8 text-blue-400 animate-spin" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/25 animate-ping" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-white">REELFORGE CREATIVE ENCRYPTION PIPELINE</h3>
                  <p className="text-xs text-slate-400 font-sans uppercase tracking-widest">
                    Executing multi-agent generator step {generationStep + 1} of {PIPELINE_STEPS.length}
                  </p>
                </div>

                <div className="bg-[#0b0e1a]/85 border border-slate-900 rounded-2xl px-4 py-3 min-h-[50px] flex items-center justify-center font-mono text-xs text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {PIPELINE_STEPS[generationStep]}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {PIPELINE_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-350 ${
                        idx < generationStep
                          ? "w-8 bg-emerald-500/80"
                          : idx === generationStep
                          ? "w-10 bg-blue-500"
                          : "w-2 bg-slate-900"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 font-sans italic">
                  *Patience, our orchestrator compiles complex Midjourney parameters for exceptional retention consistency.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS CANVAS AREA */}
        {result && !isGenerating && (
          <motion.section
            id="output-canvas"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 bg-[#090d19]/90 border border-slate-900 rounded-3xl p-4 md:p-8 shadow-2xl relative"
          >
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6">
              <div>
                <span className="text-[10px] font-mono bg-blue-900/10 text-blue-400 border border-blue-500/15 px-2.5 py-1 rounded-full uppercase">
                  Production ready assets package
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-display text-white mt-2.5">
                  “{result.overview.topic}”
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Complete creator blueprint generated natively for {result.overview.platform} ({result.overview.language})
                </p>
              </div>

              {/* Action Blueprint download */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setTopic("");
                  }}
                  className="px-3 py-2 text-xs font-semibold hover:text-white text-slate-400 bg-slate-900/60 border border-slate-850 hover:border-slate-800 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Blueprint</span>
                </button>

                <button
                  onClick={exportPDF}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 rounded-xl shadow-lg border border-emerald-500/20 hover:scale-[1.02] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-white" />
                  <span>Download Creator PDF</span>
                </button>
              </div>
            </div>

            {/* Tabs List Header */}
            <div className="flex items-center overflow-x-auto pb-2 relative z-10 border-b border-slate-910/60 scrollbar-none gap-1.5 mb-6">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "hooks", label: "Hooks Selection", icon: Sparkles },
                { id: "script", label: "Narration Script", icon: FileText },
                { id: "sceneBreakdown", label: "Timeline Breakdown", icon: Video },
                { id: "imagePrompts", label: "Cinematic Prompts", icon: ImageIcon },
                { id: "animationPrompts", label: "Video Physics", icon: Play },
                { id: "seoPackage", label: "SEO Pack", icon: Compass }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = focusedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFocusedTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl font-bold font-sans text-xs shrink-0 flex items-center gap-1.5 transition-all relative ${
                      isActive
                        ? "text-blue-400 bg-slate-900 border border-slate-800/80 shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnder"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                        style={{ bottom: "-1.5px" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB SCREENS ROUTING COMPILATION */}
            <div className="min-h-[180px]">
              
              {/* TAB 1: OVERVIEW SCREEN */}
              {focusedTab === "overview" && (
                <div id="overview-tab-content" className="space-y-6">
                  
                  {/* Dynamic Score stats info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Virality Score</p>
                        <h4 className="text-3xl font-extrabold text-blue-400 mt-1">{result.overview.viralityScore}%</h4>
                      </div>
                      <div className="p-2 bg-blue-900/10 rounded-lg text-blue-400">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Retention Capacity</p>
                        <h4 className="text-3xl font-extrabold text-emerald-400 mt-1">{result.overview.retentionScore}%</h4>
                      </div>
                      <div className="p-2 bg-emerald-900/10 rounded-lg text-emerald-400">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Target Niche</p>
                        <h4 className="text-sm font-extrabold text-white mt-2 truncate max-w-[150px]">{result.overview.niche}</h4>
                      </div>
                      <div className="p-2 bg-indigo-900/10 rounded-lg text-indigo-400">
                        <Compass className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Video Duration</p>
                        <h4 className="text-sm font-extrabold text-slate-100 mt-2">{result.overview.estimatedDuration}</h4>
                      </div>
                      <div className="p-2 bg-cyan-900/10 rounded-lg text-cyan-400">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>

                  </div>

                  {/* Viral Thesis Section */}
                  <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/15 border border-blue-900/25 rounded-2xl p-5 md:p-6">
                    <h4 className="text-sm font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                      <Cpu className="w-4.5 h-4.5 text-blue-400" /> REELFORGE ALGORITHM ANALYSIS (VIRAL THESIS)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                      {result.overview.thesis}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-3 border-t border-blue-950">
                      <span>Atmosphere Class: <b className="text-slate-100 font-bold">{result.overview.tone}</b></span>
                      <span>•</span>
                      <span>Target Language: <b className="text-slate-100 font-bold">{result.overview.language}</b></span>
                      <span>•</span>
                      <span>Platform: <b className="text-slate-100 font-bold">{result.overview.platform}</b></span>
                    </div>
                  </div>

                  {/* Prompt Seed continuity map */}
                  <div className="p-5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-3">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-4 h-4 text-amber-400" /> Shared Prompt Continuity Matrix
                    </h5>
                    <p className="text-xs text-slate-400">
                      To safeguard consistent generations, the following core environment seed keywords are injected symmetrically across all scenes in your package:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded text-[11px] text-orange-300 font-mono">
                        🎨 Color Palette: {result.overview.tone === "Horror" ? "Deep Navy, Eerie Cyan Glows" : "High Contrast Luxury Noir & Amber"}
                      </span>
                      <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded text-[11px] text-blue-300 font-mono">
                        ⚙️ camera settings: 85mm anamorphic focus lens
                      </span>
                      <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded text-[11px] text-cyan-300 font-mono font-bold">
                        📐 orientation: 9:16 vertical composition framing
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: HOOKS SCREEN */}
              {focusedTab === "hooks" && (
                <div id="hooks-tab-content" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-sans">
                      These 5 distinct mental angles are customized to secure scroll termination within the critical 1.5s mark.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.hooks.map((h, i) => {
                      const identifier = `hook-${i}`;
                      return (
                        <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 hover:border-slate-800 relative group flex flex-col justify-between">
                          <div className="#hook-body">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono tracking-wider text-blue-400 bg-blue-900/10 px-2 py-0.5 rounded uppercase">
                                {h.type} Angle
                              </span>
                              <span className="text-[11px] font-bold text-slate-300">{h.title}</span>
                            </div>
                            <p className="text-xs md:text-sm text-slate-100 font-medium font-sans leading-relaxed my-2 italic">
                              “{h.hook}”
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 border-t border-slate-900/80 pt-2.5 mt-2">
                            <button
                              onClick={() => copyToClipboard(h.hook, identifier)}
                              className="px-2.5 py-1 text-[10px] bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 rounded border border-slate-800 flex items-center gap-1 transition-all"
                            >
                              {copiedStates[identifier] ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SCRIPT TAB SCREEN */}
              {focusedTab === "script" && (
                <div id="script-tab-content" className="space-y-4">
                  <p className="text-xs text-slate-400 font-sans mb-2">
                    Visual narrative beats structured step-by-step. Avoid drone accents or sterile voice blocks. Paced directly for rapid spoken retention.
                  </p>

                  <div className="space-y-4">
                    {result.script.map((s, idx) => {
                      const cId = `script-block-${idx}`;
                      const isExpanded = expandedScenes[s.sceneNumber];
                      return (
                        <div
                          key={s.sceneNumber}
                          className="bg-slate-950/40 border border-slate-900/80 rounded-xl overflow-hidden"
                        >
                          <div
                            onClick={() => toggleSceneExpand(s.sceneNumber)}
                            className="bg-slate-950/80 px-4 py-3 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-900/50"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-blue-950 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                                {s.sceneNumber}
                              </span>
                              <span className="text-xs bg-[#0b0e1b] px-2 py-0.5 rounded text-slate-300 font-bold tracking-wide">
                                {s.section} Segment
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {s.duration}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-mono tracking-wider text-slate-400 uppercase hidden sm:inline-block`}>
                                Intensity: <b className="text-slate-100">{s.emotionalIntensity}</b>
                              </span>
                              {isExpanded ? <ChevronUp className="w-4.5 h-4.5 text-slate-500" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-500" />}
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {(!isExpanded) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 py-4 border-t border-slate-900 bg-slate-950/20"
                              >
                                <div className="space-y-3">
                                  <div className="bg-[#0b0f1d] border border-slate-900 rounded-xl p-3 shadow-inner">
                                    <p className="text-xs text-slate-400 uppercase font-mono tracking-widest mb-1.5 flex items-center gap-1">
                                      <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Audio Narration (Voiceover Copy)
                                    </p>
                                    <p className="text-xs md:text-sm text-slate-150 leading-relaxed font-sans font-medium">
                                      {s.narration}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1 text-[11px] font-sans">
                                    <span className="text-slate-500 text-[10px] font-mono uppercase">
                                      Emotional Beats: {s.emotionalIntensity} Range
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(s.narration, cId)}
                                      className="px-3 py-1 bg-slate-900 hover:bg-slate-850 hover:text-white rounded border border-slate-800 text-slate-300 flex items-center gap-1 transition-all"
                                    >
                                      {copiedStates[cId] ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                                          <span className="text-emerald-400 font-semibold">Copied Copy!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                                          <span>Copy Script</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: TIMELINE BREAKDOWN */}
              {focusedTab === "sceneBreakdown" && (
                <div id="timeline-breakdown-content" className="space-y-4">
                  <p className="text-xs text-slate-400 font-sans mb-3">
                    Algorithmic execution schedule for each scene node. Target pacing limits to keep swipe away metrics below 8%.
                  </p>

                  <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-5 before:w-[1px] before:bg-slate-900">
                    {result.sceneBreakdown.map((item, index) => (
                      <div key={item.sceneNumber} className="relative pl-10">
                        {/* Circle Bullet icon marker */}
                        <div className="absolute left-[13px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-blue-500 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                          <div className="w-1 h-1 rounded-full bg-blue-400" />
                        </div>

                        <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-900 pb-1.5 mb-1.5">
                            <span className="text-xs font-bold text-slate-200">
                              Scene {item.sceneNumber} Outline Beat — ({item.duration})
                            </span>
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/30 px-1.5 py-0.5 rounded">
                              Goal: {item.emotionalGoal}
                            </span>
                          </div>

                          <p className="text-xs mb-1">
                            <span className="text-slate-500 font-mono uppercase tracking-wider block text-[9px]">Scene core Action</span>
                            <span className="text-slate-300 font-sans">{item.purpose}</span>
                          </p>

                          <div className="bg-[#0b0f1d] p-2.5 rounded-lg border border-slate-900/80">
                            <span className="text-slate-400 font-mono uppercase tracking-wider block text-[9px] mb-0.5 flex items-center gap-1">
                              <Code className="w-3.5 h-3.5 text-[#3b82f6]" /> Retention Objective tactic
                            </span>
                            <span className="text-xs text-blue-200 font-sans leading-relaxed">{item.retentionObjective}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CINEMATIC PROMPTS (MIDJOURNEY SHEETS) */}
              {focusedTab === "imagePrompts" && (
                <div id="cinematic-image-prompts-content" className="space-y-4">
                  <p className="text-xs text-slate-400 font-sans mb-2">
                    Professional-grade prompt templates formatted for Midjourney v6 or Flux. Consistently uses 9:16 aspect ratio indices and includes precise lenses, lighting, and textures.
                  </p>

                  <div className="space-y-4">
                    {result.imagePrompts.map((p, idx) => {
                      const pId = `img-prompt-${idx}`;
                      return (
                        <div key={p.sceneNumber} className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] rounded-full blur-xl pointer-events-none" />
                          
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
                            <span className="font-bold text-blue-400 flex items-center gap-1">
                              <span className="w-5 h-5 rounded-md bg-blue-950 text-blue-450 font-mono flex items-center justify-center text-[10px]">
                                {p.sceneNumber}
                              </span>
                              <span>Midjourney Frame Prompter</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">CALIBRATED ASPECT 9:16</span>
                          </div>

                          <div className="p-3 bg-[#0a0d18] border border-slate-900 rounded-lg text-xs font-mono text-slate-300 leading-relaxed font-mono select-all">
                            {p.prompt}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => copyToClipboard(p.prompt, pId)}
                              className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 rounded-lg border border-slate-800 transition-all flex items-center gap-1"
                            >
                              {copiedStates[pId] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Copied Prompt!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: VIDEO PHYSICS */}
              {focusedTab === "animationPrompts" && (
                <div id="video-physics-content" className="space-y-4">
                  <p className="text-xs text-slate-400 font-sans mb-2">
                    Visual motion vector cues for Luma Dream Machine, Runway Gen-2/Gen-3, or OpenAI Sora. Guides physical velocity, ambient movement overlays, and camera focus.
                  </p>

                  <div className="space-y-4">
                    {result.animationPrompts.map((ap, idx) => {
                      const apId = `anim-prompt-${idx}`;
                      return (
                        <div key={ap.sceneNumber} className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 space-y-3 relative overflow-hidden">
                          
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-900">
                            <span className="font-bold text-emerald-400 flex items-center gap-1">
                              <span className="w-5 h-5 rounded-md bg-emerald-950 text-emerald-400 font-mono flex items-center justify-center text-[10px]">
                                {ap.sceneNumber}
                              </span>
                              <span>Pika / Runway Motion Guide</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">PARALLAX FLUIDITY LEVEL: HIGH</span>
                          </div>

                          <div className="p-3 bg-[#0a0d18] border border-slate-900 rounded-lg text-xs font-mono text-slate-300 leading-relaxed font-mono select-all">
                            {ap.prompt}
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => copyToClipboard(ap.prompt, apId)}
                              className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-300 rounded-lg border border-slate-800 transition-all flex items-center gap-1"
                            >
                              {copiedStates[apId] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">Motion Vector Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Copy Motion Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: SEO PACKAGE SCREEN */}
              {focusedTab === "seoPackage" && (
                <div id="seo-package-content" className="space-y-6">
                  
                  {/* Title & Description card */}
                  <div className="p-5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">Optimized Video Title reference</span>
                      <h4 className="text-sm md:text-base font-bold text-white select-all">
                        {result.seoPackage.title}
                      </h4>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#93c5fd] block">Video Searchable Description template</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans select-all">
                        {result.seoPackage.description}
                      </p>
                    </div>
                  </div>

                  {/* Platform optimization channels */}
                  <div className="space-y-4">
                    
                    {/* YouTube Shorts channel */}
                    <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                        <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                          🍿 YouTube Shorts Distribution Data
                        </span>
                        <button
                          onClick={() => copyToClipboard(`Title: ${result.seoPackage.title}\n\nCaption: ${result.seoPackage.youtubeShorts.caption}\n\nTags: ${result.seoPackage.youtubeShorts.hashtags.map(t => "#" + t).join(" ")}`, "shorts-seo")}
                          className="text-[10px] text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          {copiedStates["shorts-seo"] ? "Copied All!" : "Copy Pack"}
                        </button>
                      </div>

                      <div className="text-xs space-y-2">
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">Curiosity Caption:</b> <span className="text-slate-200">{result.seoPackage.youtubeShorts.caption}</span></p>
                        <p>
                          <b className="text-slate-400 uppercase tracking-wide text-[9px] block">Suggested Hashtags:</b>{" "}
                          <span className="text-blue-300 font-mono">
                            {result.seoPackage.youtubeShorts.hashtags.map(t => `#${t}`).join(" ")}
                          </span>
                        </p>
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">Primary CTA trigger:</b> <span className="text-emerald-400 italic font-semibold">{result.seoPackage.youtubeShorts.cta}</span></p>
                      </div>
                    </div>

                    {/* Instagram Reels channel */}
                    <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          📸 Instagram Reels Distribution Data
                        </span>
                        <button
                          onClick={() => copyToClipboard(`Caption: ${result.seoPackage.instagramReels.caption}\n\nTags: ${result.seoPackage.instagramReels.hashtags.map(t => "#" + t).join(" ")}`, "ig-seo")}
                          className="text-[10px] text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          {copiedStates["ig-seo"] ? "Copied All!" : "Copy Pack"}
                        </button>
                      </div>

                      <div className="text-xs space-y-2">
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">Engagement Capture Caption:</b> <span className="text-slate-200">{result.seoPackage.instagramReels.caption}</span></p>
                        <p>
                          <b className="text-slate-400 uppercase tracking-wide text-[9px] block">Suggested Hashtags:</b>{" "}
                          <span className="text-blue-300 font-mono font-sans capitalize">
                            {result.seoPackage.instagramReels.hashtags.map(t => `#${t}`).join(" ")}
                          </span>
                        </p>
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">Engagement CTA target:</b> <span className="text-[#34d399] italic font-semibold">{result.seoPackage.instagramReels.cta}</span></p>
                      </div>
                    </div>

                    {/* TikTok channel */}
                    <div className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 font-sans">
                          🎵 TikTok-style Trend Pacing Pack
                        </span>
                        <button
                          onClick={() => copyToClipboard(`Caption: ${result.seoPackage.tiktok.caption}\n\nTags: ${result.seoPackage.tiktok.hashtags.map(t => "#" + t).join(" ")}`, "tt-seo")}
                          className="text-[10px] text-slate-400 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          {copiedStates["tt-seo"] ? "Copied All!" : "Copy Pack"}
                        </button>
                      </div>

                      <div className="text-xs space-y-2">
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">Trend-Paced Caption:</b> <span className="text-slate-200">{result.seoPackage.tiktok.caption}</span></p>
                        <p>
                          <b className="text-slate-400 uppercase tracking-wide text-[9px] block">Hashtags:</b>{" "}
                          <span className="text-blue-300 font-mono">
                            {result.seoPackage.tiktok.hashtags.map(t => `#${t}`).join(" ")}
                          </span>
                        </p>
                        <p><b className="text-slate-400 uppercase tracking-wide text-[9px] block">TikTok Trend CTA:</b> <span className="text-emerald-400 font-semibold italic">{result.seoPackage.tiktok.cta}</span></p>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

          </motion.section>
        )}

      </main>

      {/* Elegant minimalist structural footer */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-slate-900 text-center space-y-2">
        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">
          REELFORGE AI • THE PREMIUM SYSTEM OPERATOR
        </p>
        <p className="text-[10px] text-slate-600 font-sans">
          Engineered for high-retention faceless shorts creation. All rights reserved. 2026.
        </p>
      </footer>

    </div>
  );
}

// Custom internal sub elements matching visual guidelines
function BoxCheckIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
    </svg>
  );
}
