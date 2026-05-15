// ==========================================
// AI Content Studio - Type Definitions
// ==========================================

// Common
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// ==========================================
// Idea Generator Types
// ==========================================
export interface VideoIdea {
  title: string;
  description: string;
  whyItWorks: string;
  estimatedViews: string;
  difficulty: 'easy' | 'medium' | 'hard';
  searchVolume: 'low' | 'medium' | 'high';
  trendingScore: number;
  tags: string[];
  shortsIdea: string;
  bestTimeToPost: string;
}

export interface IdeaGeneratorResponse {
  ideas: VideoIdea[];
  nicheAnalysis: string;
  topCompetitors: string[];
  contentGaps: string[];
}

export interface IdeaGeneratorInput {
  niche: string;
  targetAudience?: string;
  contentStyle?: string;
  count?: number;
}

// ==========================================
// Script Generator Types
// ==========================================
export interface ScriptSection {
  timestamp: string;
  heading: string;
  content: string;
  visualSuggestion: string;
  patternInterrupt: string;
  bRoll: string;
}

export interface ScriptResponse {
  hook: {
    text: string;
    technique: string;
    retentionTip: string;
  };
  introduction: {
    text: string;
    transition: string;
  };
  mainContent: ScriptSection[];
  callToAction: {
    text: string;
    type: string;
    placement: string;
  };
  outro: {
    text: string;
    nextVideoSuggestion: string;
  };
  metadata: {
    estimatedWordCount: number;
    estimatedDuration: string;
    readingSpeed: number;
    retentionTips: string[];
  };
}

export interface ScriptInput {
  topic: string;
  style?: string;
  duration?: string;
  targetAudience?: string;
  tone?: string;
  includeTimestamps?: boolean;
}

export interface HookResponse {
  hooks: Array<{
    text: string;
    technique: string;
    retentionScore: number;
    emotion: string;
    bestFor: string;
  }>;
  bestHook: number;
  hookTips: string[];
}

// ==========================================
// Thumbnail Types
// ==========================================
export interface ThumbnailPrompt {
  prompt: string;
  concept: string;
  whyItWorks: string;
  textOverlay: string;
  colorPalette: string[];
  composition: string;
  emotionalTrigger: string;
  ctrPrediction: 'low' | 'medium' | 'high';
  negativePrompt: string;
}

export interface ThumbnailResponse {
  thumbnails: ThumbnailPrompt[];
  thumbnailTips: string[];
  textPlacement: string;
  avoidList: string[];
}

export interface ThumbnailInput {
  topic: string;
  style?: string;
  platform?: 'midjourney' | 'leonardo' | 'ideogram' | 'dalle';
  count?: number;
  colorScheme?: string;
  includeText?: boolean;
}

// ==========================================
// SEO Types
// ==========================================
export interface SEOTitle {
  title: string;
  category: string;
  seoScore: number;
  ctrScore: number;
  emotionalTrigger: string;
  characterCount: number;
  powerWords: string[];
  searchIntent: string;
}

export interface SEOTitleResponse {
  titles: SEOTitle[];
  bestTitle: number;
  seoTips: string[];
  keywordSuggestions: string[];
  titleFormulas: string[];
}

export interface SEOTitleInput {
  topic: string;
  keywords?: string[];
  platform?: string;
  count?: number;
}

export interface KeywordResponse {
  primaryKeywords: Array<{
    keyword: string;
    searchVolume: string;
    competition: string;
    difficulty: number;
  }>;
  longTailKeywords: Array<{
    keyword: string;
    searchVolume: string;
    competition: string;
    opportunity: string;
  }>;
  relatedTopics: Array<{
    topic: string;
    relevance: number;
    contentType: string;
  }>;
  hashtagSuggestions: string[];
  tagSuggestions: string[];
  seoStrategy: {
    summary: string;
    bestKeywordToTarget: string;
    contentCalendar: Array<string | any>;
  };
}

// ==========================================
// Shorts/Reels Types
// ==========================================
export interface ShortScript {
  title: string;
  hook: string;
  script: string;
  visualInstructions: string;
  caption: string;
  hashtags: string[];
  trendingAudio: string;
  textOverlays: string[];
  callToAction: string;
  estimatedViews: string;
  viralScore: number;
  bestPostingTime: string;
}

export interface ShortsResponse {
  shorts: ShortScript[];
  formatTips: string[];
  trendingFormats: string[];
  contentCalendar: Array<string | any>;
}

export interface ShortsInput {
  topic: string;
  platform?: 'youtube-shorts' | 'instagram-reels';
  style?: string;
  count?: number;
  duration?: string;
  niche?: string;
}

// ==========================================
// Instagram Types
// ==========================================
export interface InstagramCaption {
  caption: string;
  hook: string;
  hashtags: string[];
  callToAction: string;
  bestPostTime: string;
  carouselSlides?: string[];
  engagementScore: number;
  saveability: number;
  shareability: number;
}

export interface InstagramResponse {
  captions: InstagramCaption[];
  captionFormulas: string[];
  hashtagStrategy: string;
  engagementTips: string[];
  contentIdeas: string[];
}

export interface InstagramInput {
  topic: string;
  tone?: string;
  includeEmojis?: boolean;
  includeHashtags?: boolean;
  count?: number;
  niche?: string;
  postType?: 'carousel' | 'single' | 'reel';
}

// ==========================================
// Navigation Types
// ==========================================
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description: string;
  gradient: string;
}
