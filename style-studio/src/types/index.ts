// Project State Types
export interface ProjectState {
  // Phase A: The Brief
  referenceImage: string | null;
  conceptText: string;
  directorTreatment: string;
  
  // Phase B: The Studio
  structureReference: string | null;
  styleReference: string | null;
  studioPrompt: string;
  generatedImage: string | null;
  
  // General
  isLoading: boolean;
  loadingPhase: LoadingPhase | null;
  loadingMessages: string[];
  error: string | null;
}

export type LoadingPhase = 'analyzing' | 'generating' | 'rewriting' | 'rendering';

export interface LoadingMessage {
  phase: LoadingPhase;
  message: string;
}

// API Request/Response Types
export interface DirectorRequest {
  referenceImage?: string;
  conceptText: string;
}

export interface DirectorResponse {
  treatment: string;
  reasoning?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  structureReference?: string;
  styleReference?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  metadata?: {
    model: string;
    timestamp: string;
  };
}

export interface RewritePromptRequest {
  originalPrompt: string;
  referenceImage?: string;
}

export interface RewritePromptResponse {
  rewrittenPrompt: string;
  changes?: string[];
}

// UI Component Types
export interface UploadedFile {
  file: File;
  preview: string;
  name: string;
}

export type NavItem = 'brief' | 'studio' | 'gallery' | 'settings';

// Terminal Log Types
export interface TerminalLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'processing';
  timestamp: Date;
}
