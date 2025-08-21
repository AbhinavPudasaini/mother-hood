import { StoryData, AIResponse, StoryError, StoryGenerationRequest } from '@/types/story';
import { getThemePrompt } from './theme-utils';

// AI Story Generation Service
export class AIStoryService {
  private static readonly API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
  private static readonly MODEL = 'openai/gpt-oss-120b';
  private static readonly TIMEOUT_MS = 30000; // 30 seconds
  private static readonly MAX_RETRIES = 3;

  // Generate story based on theme and story context
  static async generateStory(story: StoryData): Promise<string> {
    const request: StoryGenerationRequest = {
      theme: story.theme,
      trimester: story.trimester,
      week: story.week,
      title: story.title,
      context: story.snippet
    };

    return this.generateStoryFromRequest(request);
  }

  // Generate story from request object
  static async generateStoryFromRequest(request: StoryGenerationRequest): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await this.makeAPICall(request);
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain error types
        if (this.isNonRetryableError(error as Error)) {
          throw this.createStoryError(error as Error);
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await this.delay(delay);
        }
      }
    }

    // All retries failed
    throw this.createStoryError(lastError!);
  }

  // Make the actual API call
  private static async makeAPICall(request: StoryGenerationRequest): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    try {
      const systemPrompt = this.buildSystemPrompt(request);
      const userPrompt = this.buildUserPrompt(request);

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: userPrompt
            }
          ],
          temperature: 0.8, // Add some creativity
          max_tokens: 800,   // Ensure we get full stories
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }

      const generatedStory = data.choices[0].message.content;
      
      if (!generatedStory || generatedStory.trim().length === 0) {
        throw new Error('Empty story generated');
      }

      return this.sanitizeStoryContent(generatedStory);

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // Build system prompt for AI
  private static buildSystemPrompt(request: StoryGenerationRequest): string {
    return `You are a warm, supportive mother and storyteller who creates heartfelt pregnancy stories. 
    Your task is to generate a beautiful, emotional story based on the given theme and context.
    
    Guidelines:
    - Write from a mother's perspective with warmth and empathy
    - Use emojis naturally throughout the story to add emotional depth
    - Keep the story between 300-500 words
    - Make it relatable and emotionally resonant
    - Include vivid, sensory details
    - Focus on the emotional journey and connection with the baby
    - Use encouraging, uplifting language
    - Make each paragraph flow naturally into the next
    
    Current pregnancy context:
    - Trimester: ${request.trimester}
    - Week: ${request.week}
    - Theme: ${request.theme}`;
  }

  // Build user prompt with theme-specific instructions
  private static buildUserPrompt(request: StoryGenerationRequest): string {
    const themePrompt = getThemePrompt(request.theme);
    
    return `${themePrompt}

    Story context to inspire from: "${request.context}"
    Original title for reference: "${request.title}"
    
    Please create a complete, standalone story that captures the essence of this theme and moment in pregnancy. 
    Make it personal, emotional, and inspiring for other mothers to read.`;
  }

  // Sanitize and format the generated story content
  private static sanitizeStoryContent(content: string): string {
    return content
      .trim()
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
      .replace(/^\s+|\s+$/gm, '') // Trim whitespace from lines
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2'); // Ensure proper spacing after sentences
  }

  // Check if error should not be retried
  private static isNonRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('401') || // Unauthorized
      message.includes('403') || // Forbidden
      message.includes('invalid api') ||
      message.includes('rate limit') ||
      message.includes('quota')
    );
  }

  // Create standardized story error
  private static createStoryError(error: Error): StoryError {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('aborted')) {
      return {
        type: 'timeout',
        message: 'Story generation is taking longer than expected. Please try again.',
        retryable: true
      };
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'network',
        message: 'Unable to connect. Please check your internet connection.',
        retryable: true
      };
    }
    
    if (message.includes('rate limit') || message.includes('quota')) {
      return {
        type: 'rate-limit',
        message: 'Too many requests. Please wait a moment and try again.',
        retryable: false
      };
    }
    
    if (message.includes('401') || message.includes('403') || message.includes('api')) {
      return {
        type: 'api',
        message: 'Story generation temporarily unavailable. Please try again.',
        retryable: true
      };
    }
    
    return {
      type: 'unknown',
      message: 'Something went wrong. Please try again.',
      retryable: true
    };
  }

  // Utility delay function
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Convenience function for direct story generation
export const generateAIStory = async (story: StoryData): Promise<string> => {
  return AIStoryService.generateStory(story);
};

// Function to test API connection
export const testAIConnection = async (): Promise<boolean> => {
  try {
    const testStory: StoryData = {
      id: 0,
      title: 'Test Story',
      author: 'Test',
      week: 'Week 20',
      theme: 'default',
      trimester: 'second',
      snippet: 'This is a test',
      image: ''
    };
    
    await AIStoryService.generateStory(testStory);
    return true;
  } catch (error) {
    console.error('AI Connection Test Failed:', error);
    return false;
  }
};