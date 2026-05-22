import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Tv, Flame, Ghost, Zap, Compass, ChevronRight, User } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Create Viral AI Content In Seconds",
      subtext: "Transform simple ideas into cinematic short-form content packages using AI-powered storytelling, prompts, and SEO systems.",
      visual: (
        <div className="relative w-full h-56 flex items-center justify-center">
          <div className="absolute w-44 h-44 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="z-10 bg-slate-950/80 border border-slate-900 rounded-2xl p-4 w-72 backdrop-blur-xl shadow-2xl relative"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <div className="text-[9px] font-mono tracking-widest text-slate-400">PIPELINE MONITOR ACTIVE</div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-slate-800 rounded w-5/6" />
              <div className="h-2 bg-slate-800 rounded w-full" />
              <div className="h-2 bg-slate-800 rounded w-2/3" />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between text-[11px] font-mono text-blue-400">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Scripting</span>
              <span>ENGAGED</span>
            </div>
          </motion.div>
          {/* Floating mini cards */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-4 -right-2 z-20 bg-slate-900/90 border border-blue-900/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-mono text-amber-300 shadow-xl"
          >
            <Ghost className="w-3 h-3 text-red-400" /> Eerie Gore Niche
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-2 z-20 bg-slate-900/90 border border-emerald-900/30 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 shadow-xl"
          >
            <Flame className="w-3 h-3 text-orange-400" /> Virality Target: 97%
          </motion.div>
        </div>
      )
    },
    {
      title: "One Workflow. Everything Included.",
      subtext: "Generate scripts, cinematic image prompts, animation prompts, hooks, SEO titles, captions, and hashtags in one organized creator system.",
      visual: (
        <div className="relative w-full h-56 flex items-center justify-center">
          <div className="absolute w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="grid grid-cols-2 gap-3 w-80 relative z-10">
            {[
              { label: "1. SCENE SCRIPTS", icon: Sparkles, color: "text-blue-400" },
              { label: "2. MIDJOURNEY PROMPTS", icon: Tv, color: "text-amber-400" },
              { label: "3. SORA PHYSICS", icon: Zap, color: "text-purple-400" },
              { label: "4. DISTRIBUTION SEO", icon: Compass, color: "text-emerald-400" }
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-950/80 border border-slate-900/90 rounded-xl p-3 flex items-center gap-2 backdrop-blur-xl shadow-lg hover:border-blue-950 transition-colors"
              >
                <div className={`p-1.5 bg-slate-900 rounded-lg ${node.color}`}>
                  <node.icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-300">{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Ultra Detailed Cinematic Prompt Engine",
      subtext: "Professional-grade image and animation prompts with connected scene continuity, lighting consistency, and cinematic storytelling.",
      visual: (
        <div className="relative w-full h-56 flex items-center justify-center">
          <div className="absolute w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <motion.div 
            initial={{ rotate: -2 }}
            animate={{ rotate: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, ease: "easeInOut" }}
            className="bg-slate-950/85 border border-slate-900 rounded-xl p-4 w-76 backdrop-blur-xl shadow-2xl relative z-10 font-mono text-[10px] text-slate-300 space-y-2 border-l-2 border-l-blue-500"
          >
            <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> MDJ_PROMPT_CALIBRATOR v1.0
            </div>
            <p className="leading-relaxed bg-slate-900/60 p-2 rounded text-slate-400">
              "Low-key portrait of an ancient monk under heavy rain, rim-lit volumetric blue glows, anamorphic 85mm layout, vertical 9:16..."
            </p>
            <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Continuity Preserved Successfully
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: "Built For The Next Generation Of AI Creators",
      subtext: "Premium creator workflow system designed for modern faceless content creators.",
      visual: (
        <div className="relative w-full h-56 flex flex-col items-center justify-center">
          <div className="absolute w-44 h-44 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          
          {/* Creator Badge credit card */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-blue-900/30 rounded-2xl p-5 w-80 backdrop-blur-xl shadow-2xl relative z-10 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">SYSTEM ARCHITECT</h4>
                <div className="text-sm font-bold text-white mt-1">Mr. Adarsh Tiwari</div>
              </div>
              <div className="p-2 bg-blue-900/20 text-blue-400 rounded-xl">
                <User className="w-5 h-5" />
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-900 flex justify-between text-[10px] font-mono">
              <div>
                <span className="text-slate-500 block">RELEASED</span>
                <span className="text-slate-300">MAY 2026</span>
              </div>
              <div>
                <span className="text-slate-500 block">STANDARD VERSION</span>
                <span className="text-emerald-400">PRODUCTION READY v1.2</span>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-4 text-center">
            <span className="text-slate-400 text-xs tracking-wider">Created & Maintained by:</span>
            <div className="text-base font-bold font-display tracking-widest text-[#60a5fa] mt-1 drop-shadow-[0_0_15px_rgba(96,165,251,0.6)] animate-pulse">
              Mr. ADARSH TIWARI
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem("reelforge_onboarded_v1", "true");
    onComplete();
  };

  // Support swipe using motion handlers
  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x < -50) {
      // Swiped left, go next
      handleNext();
    } else if (info.offset.x > 50 && currentSlide > 0) {
      // Swiped right, go back
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div id="onboarding-root" className="fixed inset-0 bg-[#04060c] z-50 flex items-center justify-center overflow-y-auto p-4 select-none">
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,10,19,0.3),rgba(4,6,12,0.95))]" />

      <div className="relative w-full max-w-lg bg-[#070a13]/80 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Glow corner decorations */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Head Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-900/60 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-[#070a13] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
            <span className="text-xs font-bold font-mono tracking-widest text-slate-300">REELFORGE BRIEFING</span>
          </div>
          
          {currentSlide < slides.length - 1 && (
            <button
              onClick={handleSkip}
              className="text-[11px] font-mono tracking-widest text-slate-500 hover:text-blue-400 transition-colors cursor-pointer uppercase"
            >
              Skip
            </button>
          )}
        </div>

        {/* Dynamic Presentation Slide Container */}
        <div className="relative min-h-[360px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="space-y-6 cursor-grab active:cursor-grabbing"
            >
              {/* Visual Demo */}
              <div className="min-h-[220px] flex items-center justify-center">
                {slides[currentSlide].visual}
              </div>

              {/* Text context details */}
              <div className="text-center space-y-2.5 px-2">
                <h3 className="text-lg md:text-xl font-extrabold font-display leading-tight text-white tracking-tight">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto font-sans">
                  {slides[currentSlide].subtext}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicator bullets & Navigation Row */}
          <div className="pt-8 border-t border-slate-900/60 mt-6 flex items-center justify-between">
            {/* Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "w-6 bg-blue-500" : "w-1.5 bg-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* Action triggering */}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs md:text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{currentSlide === slides.length - 1 ? "Get Started" : "Continue"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
