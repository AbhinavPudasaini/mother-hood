import { StoryError } from '@/types/story';

// Error message mapping for user-friendly display
export const getErrorMessage = (error: StoryError): string => {
  switch (error.type) {
    case 'network':
      return 'Unable to connect to the story service. Please check your internet connection and try again.';
    
    case 'api':
      return 'The story service is temporarily unavailable. Please try again in a moment.';
    
    case 'timeout':
      return 'Story generation is taking longer than expected. Please try again.';
    
    case 'rate-limit':
      return 'Too many requests at once. Please wait a moment before trying again.';
    
    case 'unknown':
    default:
      return 'Something went wrong while generating your story. Please try again.';
  }
};

// Get retry button text based on error type
export const getRetryButtonText = (error: StoryError): string => {
  switch (error.type) {
    case 'network':
      return 'Check Connection & Retry';
    
    case 'timeout':
      return 'Try Again';
    
    case 'rate-limit':
      return 'Wait & Retry';
    
    default:
      return 'Retry';
  }
};

// Check if error should show retry button
export const shouldShowRetryButton = (error: StoryError): boolean => {
  return error.retryable;
};

// Get retry delay based on error type (in milliseconds)
export const getRetryDelay = (error: StoryError, attemptCount: number = 1): number => {
  switch (error.type) {
    case 'rate-limit':
      return Math.min(5000 * attemptCount, 30000); // 5s, 10s, 15s... up to 30s
    
    case 'network':
      return Math.min(2000 * attemptCount, 10000); // 2s, 4s, 6s... up to 10s
    
    case 'timeout':
      return Math.min(3000 * attemptCount, 15000); // 3s, 6s, 9s... up to 15s
    
    default:
      return Math.min(1000 * attemptCount, 5000); // 1s, 2s, 3s... up to 5s
  }
};

// Create user-friendly error for display
export const createDisplayError = (error: unknown): StoryError => {
  if (error && typeof error === 'object' && 'type' in error) {
    return error as StoryError;
  }
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    type: 'unknown',
    message: errorMessage,
    retryable: true
  };
};

// Log error for debugging (without exposing sensitive info)
export const logStoryError = (error: StoryError, context: {
  storyId?: number;
  theme?: string;
  attempt?: number;
}): void => {
  const logData = {
    type: error.type,
    retryable: error.retryable,
    timestamp: new Date().toISOString(),
    ...context
  };
  
  // Only log the error type and context, not the full message
  console.error('Story Generation Error:', logData);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(logData);
  }
};

// Validate API key exists
export const validateAPIKey = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_GROQ_API_KEY);
};

// Get API key status message
export const getAPIKeyStatus = (): { isValid: boolean; message: string } => {
  const isValid = validateAPIKey();
  
  return {
    isValid,
    message: isValid 
      ? 'API key is configured' 
      : 'API key is missing. Please check your environment configuration.'
  };
};