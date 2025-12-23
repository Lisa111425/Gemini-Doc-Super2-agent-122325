export interface ArtistStyle {
  id: string;
  name: string;
  era: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  textColor: string;
  panelColor: string;
  fontFamily: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface FileData {
  name: string;
  type: string;
  content: string; // Extracted text
  originalUrl?: string; // For preview if applicable
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  SINGLE_FILE = 'SINGLE_FILE',
  MULTI_FILE = 'MULTI_FILE',
  SMART_REPLACE = 'SMART_REPLACE',
  NOTE_KEEPER = 'NOTE_KEEPER',
}

export enum Language {
  ENGLISH = 'en',
  TRADITIONAL_CHINESE = 'zh-TW',
}

export interface AnalysisConfig {
  model: string;
  language: Language;
}

export const SUPPORTED_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Fast)', type: 'flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Reasoning)', type: 'pro' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash (Multimodal)', type: 'legacy' },
];