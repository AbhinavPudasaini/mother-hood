import { StoryData } from '@/types/story';
import { AIStoryService, testAIConnection } from './ai-story-service';
import { validateAPIKey } from './ai-error-utils';

// Test story data for validation
export const createTestStory = (theme: string = 'default'): StoryData => ({
  id: 999,
  title: 'Test Story Generation',
  author: 'Test Author',
  week: 'Week 20',
  theme: theme,
  trimester: 'second',
  snippet: 'This is a test story to validate AI generation functionality.',
  image: '/test.jpg'
});

// Run comprehensive AI service tests
export const runAIServiceTests = async (): Promise<{
  passed: number;
  failed: number;
  results: Array<{
    name: string;
    passed: boolean;
    result?: unknown;
    expected?: unknown;
    error?: string;
  }>;
}> => {
  console.log('🧪 Running AI Service Tests...\n');
  
  const tests = [
    {
      name: 'API Key Validation',
      test: () => validateAPIKey(),
      expected: true
    },
    {
      name: 'Connection Test',
      test: async () => await testAIConnection(),
      expected: true
    },
    {
      name: 'Story Generation - Default Theme',
      test: async () => {
        const story = createTestStory('default');
        const result = await AIStoryService.generateStory(story);
        return result.length > 100; // Should generate substantial content
      },
      expected: true
    },
    {
      name: 'Story Generation - First Flutter Theme',
      test: async () => {
        const story = createTestStory('first-flutter');
        const result = await AIStoryService.generateStory(story);
        return result.length > 100 && result.toLowerCase().includes('flutter');
      },
      expected: true
    }
  ];

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Running: ${test.name}...`);
      const result = await test.test();
      const success = result === test.expected;
      
      if (success) {
        passed++;
        console.log(`✅ ${test.name} - PASSED`);
      } else {
        failed++;
        console.log(`❌ ${test.name} - FAILED (Expected: ${test.expected}, Got: ${result})`);
      }
      
      results.push({
        name: test.name,
        passed: success,
        result,
        expected: test.expected
      });
      
    } catch (error) {
      failed++;
      console.log(`❌ ${test.name} - ERROR: ${error instanceof Error ? error.message : String(error)}`);
      
      results.push({
        name: test.name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        expected: test.expected
      });
    }
    
    console.log(''); // Add spacing
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (passed === tests.length) {
    console.log('🎉 All AI service tests passed! The system is ready.');
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration.');
  }

  return { passed, failed, results };
};

// Quick validation function
export const validateAIService = async (): Promise<boolean> => {
  try {
    // Check API key
    if (!validateAPIKey()) {
      console.error('❌ API key not configured');
      return false;
    }

    // Test connection
    const connectionTest = await testAIConnection();
    if (!connectionTest) {
      console.error('❌ AI service connection failed');
      return false;
    }

    console.log('✅ AI service validation passed');
    return true;
    
  } catch (error) {
    console.error('❌ AI service validation failed:', error);
    return false;
  }
};

// Performance test
export const performanceTest = async (iterations: number = 3): Promise<{
  averageTime: number;
  results: number[];
}> => {
  console.log(`🚀 Running performance test with ${iterations} iterations...`);
  
  const results: number[] = [];
  const testStory = createTestStory('pregnancy-glow');

  for (let i = 0; i < iterations; i++) {
    const startTime = Date.now();
    
    try {
      await AIStoryService.generateStory(testStory);
      const endTime = Date.now();
      const duration = endTime - startTime;
      results.push(duration);
      
      console.log(`Iteration ${i + 1}: ${duration}ms`);
      
    } catch (error) {
      console.log(`Iteration ${i + 1}: Failed - ${error instanceof Error ? error.message : String(error)}`);
      results.push(-1); // Mark as failed
    }
  }

  const validResults = results.filter(r => r > 0);
  const averageTime = validResults.length > 0 
    ? validResults.reduce((a, b) => a + b, 0) / validResults.length 
    : 0;

  console.log(`\n📈 Performance Results:`);
  console.log(`Average time: ${averageTime.toFixed(0)}ms`);
  console.log(`Success rate: ${validResults.length}/${iterations} (${(validResults.length/iterations*100).toFixed(1)}%)`);

  return { averageTime, results };

};
