import { StoryTheme } from '@/types/story';

// Theme keywords mapping for more accurate assignment
export const themeKeywords: Record<StoryTheme, string[]> = {
  'first-flutter': [
    'flutter', 'move', 'movement', 'butterfly', 'dancing', 'first time', 'magical moment', 'felt you move'
  ],
  'morning-sickness': [
    'morning', 'sickness', 'nausea', 'tough', 'difficult', 'wave', 'protecting', 'first trimester', 'overcome'
  ],
  'finding-joy': [
    'joy', 'unknown', 'uncertain', 'overwhelmed', 'pink lines', 'beautiful', 'discovery', 'unexpected', 'happiness'
  ],
  'pregnancy-glow': [
    'glow', 'radiant', 'alive', 'beautiful', 'confident', 'second trimester', 'energy', 'vibrant', 'shining'
  ],
  'feeling-kicks': [
    'kick', 'kicks', 'movement', 'active', 'fighter', 'strong', 'real', 'breath away', 'connection', 'alive'
  ],
  'nursery-preparation': [
    'nursery', 'room', 'preparing', 'painting', 'pastels', 'bedtime stories', 'nesting', 'decorating', 'space'
  ],
  'almost-there': [
    'almost', 'close', 'near', 'finish line', 'anticipation', 'wonder', 'approach', 'final stretch', 'soon'
  ],
  'final-countdown': [
    'countdown', 'final', 'ready', 'christmas eve', 'meet you', 'sweet baby', 'worth', 'journey', 'waiting'
  ],
  'embracing-changes': [
    'changes', 'transform', 'body', 'stretch mark', 'miracle', 'story', 'beautiful way', 'embracing', 'growth'
  ],
  'default': []
};

// Calculate theme score based on keyword matches
export const calculateThemeScore = (text: string, theme: StoryTheme): number => {
  const keywords = themeKeywords[theme];
  const textLower = text.toLowerCase();
  
  let score = 0;
  keywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      // Give higher score for exact matches and longer phrases
      score += keyword.split(' ').length;
    }
  });
  
  return score;
};

// Advanced theme assignment using scoring system
export const assignThemeByScore = (
  title: string, 
  trimester: 'first' | 'second' | 'third', 
  snippet?: string
): StoryTheme => {
  const combinedText = `${title} ${snippet || ''}`;
  
  // Get themes relevant to the trimester
  const trimesterThemes: Record<string, StoryTheme[]> = {
    'first': ['first-flutter', 'morning-sickness', 'finding-joy'],
    'second': ['pregnancy-glow', 'feeling-kicks', 'nursery-preparation'],
    'third': ['almost-there', 'final-countdown', 'embracing-changes']
  };
  
  const relevantThemes = trimesterThemes[trimester] || [];
  let bestTheme: StoryTheme = 'default';
  let highestScore = 0;
  
  // Calculate scores for each relevant theme
  relevantThemes.forEach(theme => {
    const score = calculateThemeScore(combinedText, theme);
    if (score > highestScore) {
      highestScore = score;
      bestTheme = theme;
    }
  });
  
  // If no theme scored, use default
  return highestScore > 0 ? bestTheme : 'default';
};

// Theme compatibility check
export const isThemeCompatibleWithTrimester = (theme: StoryTheme, trimester: 'first' | 'second' | 'third'): boolean => {
  const trimesterThemes: Record<string, StoryTheme[]> = {
    'first': ['first-flutter', 'morning-sickness', 'finding-joy', 'default'],
    'second': ['pregnancy-glow', 'feeling-kicks', 'nursery-preparation', 'default'],
    'third': ['almost-there', 'final-countdown', 'embracing-changes', 'default']
  };
  
  return trimesterThemes[trimester].includes(theme);
};