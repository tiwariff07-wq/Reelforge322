/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GenerationRequest {
  topic: string;
  platform: string;
  niche: string;
  tone: string;
  language: string;
  detailLevel: string;
  duration: string;
  referenceImg?: string; // base64 encoded image block (optional)
}

export interface HookItem {
  type: "curiosity" | "emotional" | "shocking" | "storytelling" | "fear" | string;
  title: string;
  hook: string;
}

export interface ScriptScene {
  sceneNumber: number;
  section: "Hook" | "Build-up" | "Suspense" | "Reveal" | "CTA" | string;
  narration: string;
  duration: string;
  emotionalIntensity: "Low" | "Medium" | "High" | "Extreme" | string;
}

export interface SceneBreakdownItem {
  sceneNumber: number;
  duration: string;
  purpose: string;
  retentionObjective: string;
  emotionalGoal: string;
}

export interface ImagePromptItem {
  sceneNumber: number;
  prompt: string;
}

export interface AnimationPromptItem {
  sceneNumber: number;
  prompt: string;
}

export interface SeoPackage {
  title: string;
  description: string;
  youtubeShorts: {
    caption: string;
    hashtags: string[];
    cta: string;
  };
  instagramReels: {
    caption: string;
    hashtags: string[];
    cta: string;
  };
  tiktok: {
    caption: string;
    hashtags: string[];
    cta: string;
  };
}

export interface Overview {
  topic: string;
  niche: string;
  platform: string;
  tone: string;
  language: string;
  estimatedDuration: string;
  viralityScore: number;
  retentionScore: number;
  thesis: string;
}

export interface GenerationResult {
  overview: Overview;
  hooks: HookItem[];
  script: ScriptScene[];
  sceneBreakdown: SceneBreakdownItem[];
  imagePrompts: ImagePromptItem[];
  animationPrompts: AnimationPromptItem[];
  seoPackage: SeoPackage;
}
