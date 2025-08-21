# AI Story Generation Service

This service handles AI-powered story generation for the motherhood stories feature using the Groq API.

## Overview

The AI Story Service generates personalized pregnancy stories based on themes, trimester context, and story prompts. It includes comprehensive error handling, retry logic, and caching capabilities.

## Core Components

### AIStoryService Class

Main service class that handles all AI interactions:

```typescript
import { AIStoryService } from '@/lib/ai-story-service';

// Generate story from StoryData
const story = await AIStoryService.generateStory(storyData);

// Generate from custom request
const request = { theme, trimester, week, title, context };
const story = await AIStoryService.generateStoryFromRequest(request);
```

### React Hooks

#### useAIStory Hook
For managing multiple stories with caching:

```typescript
import { useAIStory } from '@/hooks/useAIStory';

const {
  getStoryState,
  generateStory,
  retryStory,
  isStoryCached,
  getCachedStory
} = useAIStory();

// Generate story
await generateStory(storyData);

// Check if cached
const isCached = isStoryCached(storyId);
```

#### useSingleAIStory Hook
For managing a single story (simpler interface):

```typescript
import { useSingleAIStory } from '@/hooks/useAIStory';

const {
  content,
  isLoading,
  error,
  generateStory,
  retry,
  hasContent
} = useSingleAIStory(storyData);
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### API Settings

- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `openai/gpt-oss-120b`
- **Timeout**: 30 seconds
- **Max Retries**: 3 attempts
- **Temperature**: 0.8 (for creativity)
- **Max Tokens**: 800 (for complete stories)

## Error Handling

### Error Types

1. **Network Errors**: Connection issues, fetch failures
2. **API Errors**: Server errors, authentication issues
3. **Timeout Errors**: Requests taking longer than 30 seconds
4. **Rate Limiting**: Too many requests
5. **Unknown Errors**: Unexpected failures

### Error Recovery

- **Automatic Retry**: Up to 3 attempts with exponential backoff
- **Non-Retryable Errors**: Authentication, rate limiting
- **User-Friendly Messages**: Translated error messages for display

```typescript
import { getErrorMessage, shouldShowRetryButton } from '@/lib/ai-error-utils';

const errorMessage = getErrorMessage(error);
const canRetry = shouldShowRetryButton(error);
```

## Story Generation Process

1. **Theme Analysis**: Determine story theme from content
2. **Prompt Building**: Create system and user prompts
3. **API Call**: Send request to Groq API with timeout
4. **Content Processing**: Sanitize and format response
5. **Error Handling**: Retry on failure or return error
6. **Caching**: Store successful results

## Testing

### Validation Functions

```typescript
import { validateAIService, runAIServiceTests } from '@/lib/ai-test-utils';

// Quick validation
const isValid = await validateAIService();

// Comprehensive tests
const results = await runAIServiceTests();
```

### Performance Testing

```typescript
import { performanceTest } from '@/lib/ai-test-utils';

// Test response times
const { averageTime, results } = await performanceTest(5);
```

## Usage Examples

### Basic Story Generation

```typescript
import { generateAIStory } from '@/lib/ai-story-service';

const story: StoryData = {
  id: 1,
  title: "My First Flutter",
  theme: "first-flutter",
  trimester: "first",
  week: "Week 16",
  snippet: "Feeling baby move for the first time...",
  author: "Emma",
  image: "/image.jpg"
};

try {
  const generatedStory = await generateAIStory(story);
  console.log(generatedStory);
} catch (error) {
  console.error('Generation failed:', error);
}
```

### With React Hook

```typescript
import { useSingleAIStory } from '@/hooks/useAIStory';

function StoryModal({ story }) {
  const {
    content,
    isLoading,
    error,
    generateStory,
    retry
  } = useSingleAIStory(story);

  useEffect(() => {
    if (story && !content) {
      generateStory();
    }
  }, [story]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={retry} />;
  if (content) return <StoryContent content={content} />;
  
  return null;
}
```

## Security Considerations

- **API Key Protection**: Environment variables only
- **Content Sanitization**: Clean generated content
- **Error Information**: No sensitive data in error messages
- **Rate Limiting**: Client-side request throttling

## Performance Optimizations

- **Request Timeout**: 30-second limit
- **Retry Logic**: Exponential backoff
- **Content Caching**: Avoid duplicate API calls
- **Request Debouncing**: Prevent multiple simultaneous requests
- **Memory Management**: Clean up on component unmount

## Monitoring

The service logs errors for debugging:

```typescript
// Error logging (production-safe)
console.error('Story Generation Error:', {
  type: error.type,
  retryable: error.retryable,
  timestamp: new Date().toISOString(),
  storyId: story.id,
  theme: story.theme
});
```

## Troubleshooting

### Common Issues

1. **API Key Missing**: Check environment variables
2. **Network Errors**: Verify internet connection
3. **Rate Limiting**: Reduce request frequency
4. **Timeout Errors**: Check API service status
5. **Empty Responses**: Verify prompt formatting

### Debug Mode

Enable detailed logging by setting:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('AI Service Debug Info:', debugData);
}
```