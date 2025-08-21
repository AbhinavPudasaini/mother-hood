import { useState, useCallback } from 'react';
import { StoryData, GeneratedStoryState, StoryError } from '@/types/story';
import { AIStoryService } from '@/lib/ai-story-service';

// Custom hook for AI story generation
export const useAIStory = () => {
  const [generatedStories, setGeneratedStories] = useState<Map<number, GeneratedStoryState>>(new Map());

  // Get story state for a specific story ID
  const getStoryState = useCallback((storyId: number): GeneratedStoryState => {
    return generatedStories.get(storyId) || {
      content: null,
      isLoading: false,
      error: null,
      lastGenerated: null
    };
  }, [generatedStories]);

  // Generate story for a specific story
  const generateStory = useCallback(async (story: StoryData): Promise<void> => {
    // Set loading state
    setGeneratedStories(prev => new Map(prev).set(story.id, {
      content: null,
      isLoading: true,
      error: null,
      lastGenerated: null
    }));

    try {
      const generatedContent = await AIStoryService.generateStory(story);
      
      // Set success state
      setGeneratedStories(prev => new Map(prev).set(story.id, {
        content: generatedContent,
        isLoading: false,
        error: null,
        lastGenerated: new Date()
      }));

    } catch (error) {
      const storyError = error as StoryError;
      
      // Set error state
      setGeneratedStories(prev => new Map(prev).set(story.id, {
        content: null,
        isLoading: false,
        error: storyError.message,
        lastGenerated: null
      }));

      // Log error for debugging
      console.error('Story generation failed:', {
        storyId: story.id,
        theme: story.theme,
        error: storyError
      });
    }
  }, []);

  // Retry story generation
  const retryStory = useCallback(async (story: StoryData): Promise<void> => {
    await generateStory(story);
  }, [generateStory]);

  // Clear story state
  const clearStory = useCallback((storyId: number): void => {
    setGeneratedStories(prev => {
      const newMap = new Map(prev);
      newMap.delete(storyId);
      return newMap;
    });
  }, []);

  // Clear all stories
  const clearAllStories = useCallback((): void => {
    setGeneratedStories(new Map());
  }, []);

  // Check if story is cached
  const isStoryCached = useCallback((storyId: number): boolean => {
    const state = generatedStories.get(storyId);
    return !!(state?.content && !state.error);
  }, [generatedStories]);

  // Get cached story content
  const getCachedStory = useCallback((storyId: number): string | null => {
    const state = generatedStories.get(storyId);
    return state?.content || null;
  }, [generatedStories]);

  return {
    // State getters
    getStoryState,
    isStoryCached,
    getCachedStory,
    
    // Actions
    generateStory,
    retryStory,
    clearStory,
    clearAllStories,
    
    // Computed values
    totalCachedStories: generatedStories.size,
    hasAnyLoading: Array.from(generatedStories.values()).some(state => state.isLoading),
    hasAnyErrors: Array.from(generatedStories.values()).some(state => state.error !== null)
  };
};

// Hook for single story management (simpler interface)
export const useSingleAIStory = (story: StoryData | null) => {
  const [state, setState] = useState<GeneratedStoryState>({
    content: null,
    isLoading: false,
    error: null,
    lastGenerated: null
  });

  const generateStory = useCallback(async (): Promise<void> => {
    if (!story) return;

    setState({
      content: null,
      isLoading: true,
      error: null,
      lastGenerated: null
    });

    try {
      const generatedContent = await AIStoryService.generateStory(story);
      
      setState({
        content: generatedContent,
        isLoading: false,
        error: null,
        lastGenerated: new Date()
      });

    } catch (error) {
      const storyError = error as StoryError;
      
      setState({
        content: null,
        isLoading: false,
        error: storyError.message,
        lastGenerated: null
      });

      console.error('Story generation failed:', {
        storyId: story.id,
        theme: story.theme,
        error: storyError
      });
    }
  }, [story]);

  const retry = useCallback(async (): Promise<void> => {
    await generateStory();
  }, [generateStory]);

  const clear = useCallback((): void => {
    setState({
      content: null,
      isLoading: false,
      error: null,
      lastGenerated: null
    });
  }, []);

  return {
    ...state,
    generateStory,
    retry,
    clear,
    hasContent: !!state.content,
    hasError: !!state.error
  };
};