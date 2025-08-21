// Story Modal Types
export interface StoryData {
  id: number;
  title: string;
  author: string;
  week: string;
  theme: string;
  trimester: 'first' | 'second' | 'third';
  snippet: string;
  image: string;
}

export interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryData;
}

// AI Service Types
export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GeneratedStoryState {
  content: string | null;
  isLoading: boolean;
  error: string | null;
  lastGenerated: Date | null;
}

// Modal State Types
export interface ModalState {
  isOpen: boolean;
  currentStory: StoryData | null;
  generatedContent: GeneratedStoryState;
}

// Theme System Types
export interface ThemePrompts {
  [key: string]: string;
}

export type StoryTheme = 
  | 'first-flutter'
  | 'morning-sickness' 
  | 'finding-joy'
  | 'pregnancy-glow'
  | 'feeling-kicks'
  | 'nursery-preparation'
  | 'almost-there'
  | 'final-countdown'
  | 'embracing-changes'
  | 'default';

// Error Types
export interface StoryError {
  type: 'network' | 'api' | 'timeout' | 'rate-limit' | 'unknown';
  message: string;
  retryable: boolean;
}

// API Request Types
export interface StoryGenerationRequest {
  theme: string;
  trimester: string;
  week: string;
  title: string;
  context: string;
}