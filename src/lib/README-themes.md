# Theme Assignment System

This system automatically assigns themes to pregnancy stories based on their content and trimester.

## Available Themes

### First Trimester
- `first-flutter` - Stories about feeling baby's first movements
- `morning-sickness` - Stories about overcoming nausea and early pregnancy challenges  
- `finding-joy` - Stories about discovering happiness in uncertainty

### Second Trimester
- `pregnancy-glow` - Stories about feeling radiant and energetic
- `feeling-kicks` - Stories about stronger baby movements and connection
- `nursery-preparation` - Stories about preparing baby's space

### Third Trimester
- `almost-there` - Stories about approaching the end of pregnancy
- `final-countdown` - Stories about the last weeks before birth
- `embracing-changes` - Stories about accepting body changes and transformation

### Universal
- `default` - Fallback theme for stories that don't match specific patterns

## Usage

```typescript
import { assignThemeByScore, isThemeCompatibleWithTrimester } from '@/lib/theme-mapping';
import { getThemePrompt, validateTheme } from '@/lib/theme-utils';

// Assign theme to a story
const theme = assignThemeByScore(title, trimester, snippet);

// Validate theme
const isValid = validateTheme(theme);

// Check compatibility
const isCompatible = isThemeCompatibleWithTrimester(theme, trimester);

// Get AI prompt for theme
const prompt = getThemePrompt(theme);
```

## Theme Assignment Logic

The system uses a scoring algorithm that:
1. Analyzes keywords in story titles and snippets
2. Matches against theme-specific keyword lists
3. Assigns scores based on keyword relevance and phrase length
4. Selects the highest-scoring theme for the given trimester
5. Falls back to 'default' if no theme scores above threshold

## Testing

Use the test utilities in `theme-test-utils.ts` to validate theme assignments:

```typescript
import { runThemeTests } from '@/lib/theme-test-utils';
runThemeTests(); // Logs test results to console
```