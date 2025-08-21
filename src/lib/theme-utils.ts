import { StoryTheme, ThemePrompts } from '@/types/story';

// Theme-based prompts for AI story generation
export const themePrompts: ThemePrompts = {
  'first-flutter': `Generate a heartwarming 300-500 word story about feeling baby's first movements during pregnancy. Write from a mother's perspective with a warm, supportive tone. Include emojis and emotional storytelling elements. Focus on the magical moment of first feeling the baby move, the wonder and connection it brings.`,
  
  'morning-sickness': `Create an encouraging 300-500 word story about overcoming morning sickness during early pregnancy. Write from a mother's perspective with a supportive, understanding tone. Include emojis and practical wisdom. Focus on finding strength through difficult moments and the hope that sustains through challenges.`,
  
  'finding-joy': `Write an uplifting 300-500 word story about finding joy and beauty in the uncertainty of early pregnancy. Use a warm, reassuring tone from a mother's perspective. Include emojis and emotional depth. Focus on embracing the unknown and discovering unexpected happiness in the pregnancy journey.`,
  
  'pregnancy-glow': `Generate an empowering 300-500 word story about experiencing the pregnancy glow during the second trimester. Write with confidence and joy from a mother's perspective. Include emojis and celebratory language. Focus on feeling radiant, alive, and embracing the physical and emotional changes.`,
  
  'feeling-kicks': `Create a touching 300-500 word story about feeling strong baby kicks during the second trimester. Write from a mother's perspective with wonder and excitement. Include emojis and vivid descriptions. Focus on the connection with the baby, the reality of new life, and the anticipation building.`,
  
  'nursery-preparation': `Write a loving 300-500 word story about preparing the baby's nursery during pregnancy. Use a warm, anticipatory tone from a mother's perspective. Include emojis and detailed imagery. Focus on the nesting instinct, dreams for the future, and the love poured into creating a special space.`,
  
  'almost-there': `Generate an anticipatory 300-500 word story about approaching the end of pregnancy in the third trimester. Write with excitement and readiness from a mother's perspective. Include emojis and emotional buildup. Focus on the final stretch, preparation for birth, and the anticipation of meeting the baby.`,
  
  'final-countdown': `Create an emotional 300-500 word story about the final weeks of pregnancy. Write with intense anticipation and love from a mother's perspective. Include emojis and powerful imagery. Focus on the countdown to birth, final preparations, and the overwhelming excitement of soon holding the baby.`,
  
  'embracing-changes': `Write a beautiful 300-500 word story about embracing the physical and emotional changes of late pregnancy. Use an accepting, grateful tone from a mother's perspective. Include emojis and reflective language. Focus on appreciating the transformation, the strength of the body, and the miracle of creating life.`,
  
  'default': `Generate a warm, supportive 300-500 word pregnancy story from a mother's perspective. Include emojis and encouraging language. Focus on the beauty of the pregnancy journey, the strength of mothers, and the miracle of new life. Make it relatable and emotionally resonant.`
};

// Function to get theme prompt
export const getThemePrompt = (theme: StoryTheme): string => {
  return themePrompts[theme] || themePrompts.default;
};

// Enhanced theme assignment with snippet analysis
export const assignThemeFromContent = (
  title: string, 
  trimester: 'first' | 'second' | 'third', 
  snippet?: string
): StoryTheme => {
  const titleLower = title.toLowerCase();
  const snippetLower = snippet?.toLowerCase() || '';
  const combinedText = `${titleLower} ${snippetLower}`;
  
  // First trimester themes
  if (trimester === 'first') {
    if (combinedText.includes('flutter') || combinedText.includes('move') || combinedText.includes('butterfly')) return 'first-flutter';
    if (combinedText.includes('morning') || combinedText.includes('sickness') || combinedText.includes('nausea') || combinedText.includes('tough')) return 'morning-sickness';
    if (combinedText.includes('joy') || combinedText.includes('unknown') || combinedText.includes('uncertain') || combinedText.includes('overwhelmed') || combinedText.includes('pink lines')) return 'finding-joy';
  }
  
  // Second trimester themes
  if (trimester === 'second') {
    if (combinedText.includes('glow') || combinedText.includes('radiant') || combinedText.includes('beautiful') || combinedText.includes('alive')) return 'pregnancy-glow';
    if (combinedText.includes('kick') || combinedText.includes('movement') || combinedText.includes('active') || combinedText.includes('fighter')) return 'feeling-kicks';
    if (combinedText.includes('nursery') || combinedText.includes('room') || combinedText.includes('preparing') || combinedText.includes('painting') || combinedText.includes('pastels')) return 'nursery-preparation';
  }
  
  // Third trimester themes
  if (trimester === 'third') {
    if (combinedText.includes('almost') || combinedText.includes('close') || combinedText.includes('near') || combinedText.includes('finish line') || combinedText.includes('anticipation')) return 'almost-there';
    if (combinedText.includes('countdown') || combinedText.includes('final') || combinedText.includes('ready') || combinedText.includes('christmas eve')) return 'final-countdown';
    if (combinedText.includes('changes') || combinedText.includes('transform') || combinedText.includes('body') || combinedText.includes('stretch mark') || combinedText.includes('miracle')) return 'embracing-changes';
  }
  
  return 'default';
};

// Batch theme assignment for multiple stories
export const assignThemesToStories = (stories: Omit<StoryData, 'theme'>[]): StoryData[] => {
  return stories.map(story => ({
    ...story,
    theme: assignThemeFromContent(story.title, story.trimester, story.snippet)
  }));
};

// Validate theme assignment
export const validateTheme = (theme: string): theme is StoryTheme => {
  const validThemes: StoryTheme[] = [
    'first-flutter', 'morning-sickness', 'finding-joy',
    'pregnancy-glow', 'feeling-kicks', 'nursery-preparation',
    'almost-there', 'final-countdown', 'embracing-changes', 'default'
  ];
  return validThemes.includes(theme as StoryTheme);
};