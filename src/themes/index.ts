import { ThemeDefinition, ThemeGenerator } from '@/types/theme.types';

// Statically import only the metadata definitions to keep the main bundle lightweight
import { definition as gradientWaveDef } from './gradient-wave';
import { definition as terminalHackerDef } from './terminal-hacker';
import { definition as minimalZenDef } from './minimal-zen';
import { definition as neonSynthwaveDef } from './neon-synthwave';
import { definition as corporateProDef } from './corporate-pro';
import { definition as gamerDevDef } from './gamer-dev';
import { definition as darkEleganceDef } from './dark-elegance';
import { definition as creativePortfolioDef } from './creative-portfolio';
import { definition as opensourceHeroDef } from './opensource-hero';
import { definition as studentLearnerDef } from './student-learner';

export interface ThemeEntry {
  definition: ThemeDefinition;
  generate: ThemeGenerator;
}

// Map of theme IDs to their metadata definitions
export const THEME_DEFINITIONS: Record<string, ThemeDefinition> = {
  'gradient-wave': gradientWaveDef,
  'terminal-hacker': terminalHackerDef,
  'minimal-zen': minimalZenDef,
  'neon-synthwave': neonSynthwaveDef,
  'corporate-pro': corporateProDef,
  'gamer-dev': gamerDevDef,
  'dark-elegance': darkEleganceDef,
  'creative-portfolio': creativePortfolioDef,
  'opensource-hero': opensourceHeroDef,
  'student-learner': studentLearnerDef,
};

// Map of theme IDs to lazy-loaded generation code
const THEME_GENERATORS: Record<string, () => Promise<{ generate: ThemeGenerator }>> = {
  'gradient-wave': () => import('./gradient-wave'),
  'terminal-hacker': () => import('./terminal-hacker'),
  'minimal-zen': () => import('./minimal-zen'),
  'neon-synthwave': () => import('./neon-synthwave'),
  'corporate-pro': () => import('./corporate-pro'),
  'gamer-dev': () => import('./gamer-dev'),
  'dark-elegance': () => import('./dark-elegance'),
  'creative-portfolio': () => import('./creative-portfolio'),
  'opensource-hero': () => import('./opensource-hero'),
  'student-learner': () => import('./student-learner'),
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEME_DEFINITIONS);

export const THEME_CATEGORIES = {
  professional: THEME_LIST.filter(t => t.category === 'professional'),
  creative: THEME_LIST.filter(t => t.category === 'creative'),
  technical: THEME_LIST.filter(t => t.category === 'technical'),
  fun: THEME_LIST.filter(t => t.category === 'fun'),
};

export const CATEGORY_LABELS: Record<string, { label: string; description: string }> = {
  professional: { label: 'Professional', description: 'Clean, formal, business-ready profiles' },
  creative: { label: 'Creative', description: 'Vibrant, artistic, visually striking profiles' },
  technical: { label: 'Technical', description: 'Code-focused, contribution-driven profiles' },
  fun: { label: 'Fun & Expressive', description: 'Playful, personality-driven profiles' },
};

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return THEME_DEFINITIONS[id];
}

// In-memory cache for loaded theme generators to make subsequent calls instantaneous
const generatorCache: Record<string, ThemeGenerator> = {};

export async function generateThemeMarkdown(themeId: string, input: Parameters<ThemeGenerator>[0]): Promise<string> {
  if (generatorCache[themeId]) {
    return generatorCache[themeId](input);
  }

  const loader = THEME_GENERATORS[themeId];
  if (!loader) {
    return `<!-- Theme "${themeId}" not found. Please select a valid theme. -->`;
  }

  const module = await loader();
  generatorCache[themeId] = module.generate;
  return module.generate(input);
}

// Map old template IDs to new theme IDs for backward compatibility
export const LEGACY_TEMPLATE_MAP: Record<string, string> = {
  fullstack: 'gradient-wave',
  minimal: 'minimal-zen',
  opensource: 'opensource-hero',
  student: 'student-learner',
  creative: 'creative-portfolio',
  devops: 'terminal-hacker',
};

export function resolveLegacyTemplateId(id: string): string {
  return LEGACY_TEMPLATE_MAP[id] || id;
}
