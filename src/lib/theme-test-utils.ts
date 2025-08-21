import { StoryData } from '@/types/story';
import { assignThemeByScore, isThemeCompatibleWithTrimester } from './theme-mapping';
import { assignThemeFromContent, validateTheme } from './theme-utils';

// Test data for theme assignment validation
export const testStories = [
  {
    title: "My First Flutter",
    snippet: "I'll never forget that magical moment when I first felt you move. It was like a gentle butterfly dancing inside me",
    trimester: "first" as const,
    expectedTheme: "first-flutter"
  },
  {
    title: "How I Overcame Morning Sickness", 
    snippet: "The first trimester was tough, but I learned that every wave of nausea was my body's way of protecting you",
    trimester: "first" as const,
    expectedTheme: "morning-sickness"
  },
  {
    title: "The Glow is Real",
    snippet: "Everyone talks about the pregnancy glow, but I never believed it until the second trimester. Suddenly, I felt radiant and alive",
    trimester: "second" as const,
    expectedTheme: "pregnancy-glow"
  },
  {
    title: "Feeling You Kick",
    snippet: "Your first real kick took my breath away. It was during a quiet evening, and suddenly I knew - you're really in there, my little fighter",
    trimester: "second" as const,
    expectedTheme: "feeling-kicks"
  },
  {
    title: "The Final Countdown",
    snippet: "Every day now feels like Christmas Eve. I'm ready to meet you, my sweet baby. The wait has been worth every moment",
    trimester: "third" as const,
    expectedTheme: "final-countdown"
  }
];

// Validate theme assignment accuracy
export const validateThemeAssignments = (): { 
  passed: number; 
  failed: number; 
  results: Array<{
    title: string;
    expected: string;
    assigned1: string;
    assigned2: string;
    passed1: boolean;
    passed2: boolean;
    compatible1: boolean;
    compatible2: boolean;
  }>;
} => {
  const results = testStories.map(story => {
    const assignedTheme1 = assignThemeFromContent(story.title, story.trimester, story.snippet);
    const assignedTheme2 = assignThemeByScore(story.title, story.trimester, story.snippet);
    
    return {
      title: story.title,
      expected: story.expectedTheme,
      assigned1: assignedTheme1,
      assigned2: assignedTheme2,
      passed1: assignedTheme1 === story.expectedTheme,
      passed2: assignedTheme2 === story.expectedTheme,
      compatible1: isThemeCompatibleWithTrimester(assignedTheme1, story.trimester),
      compatible2: isThemeCompatibleWithTrimester(assignedTheme2, story.trimester)
    };
  });
  
  const passed = results.filter(r => r.passed1 || r.passed2).length;
  const failed = results.length - passed;
  
  return { passed, failed, results };
};

// Console log theme assignment test results
export const runThemeTests = (): void => {
  console.log('🧪 Running Theme Assignment Tests...\n');
  
  const validation = validateThemeAssignments();
  
  console.log(`✅ Passed: ${validation.passed}/${testStories.length}`);
  console.log(`❌ Failed: ${validation.failed}/${testStories.length}\n`);
  
  validation.results.forEach(result => {
    const status1 = result.passed1 ? '✅' : '❌';
    const status2 = result.passed2 ? '✅' : '❌';
    
    console.log(`${status1} ${status2} "${result.title}"`);
    console.log(`   Expected: ${result.expected}`);
    console.log(`   Method 1: ${result.assigned1} (Compatible: ${result.compatible1})`);
    console.log(`   Method 2: ${result.assigned2} (Compatible: ${result.compatible2})\n`);
  });
  
  // Test theme validation
  console.log('🔍 Testing Theme Validation...');
  console.log(`Valid theme: ${validateTheme('first-flutter')} ✅`);
  console.log(`Invalid theme: ${validateTheme('invalid-theme')} ❌\n`);
  
  console.log('🎯 Theme Assignment System Ready!');

};
