import { ThemeDefinition, ThemeGenerator } from '@/types/theme.types';

import * as gradientWave from './gradient-wave';
import * as terminalHacker from './terminal-hacker';
import * as minimalZen from './minimal-zen';
import * as neonSynthwave from './neon-synthwave';
import * as corporatePro from './corporate-pro';
import * as gamerDev from './gamer-dev';
import * as darkElegance from './dark-elegance';
import * as creativePortfolio from './creative-portfolio';
import * as opensourceHero from './opensource-hero';
import * as studentLearner from './student-learner';

export interface ThemeEntry {
  definition: ThemeDefinition;
  generate: ThemeGenerator;
}

const THEME_REGISTRY: Record<string, ThemeEntry> = {
  'gradient-wave': { definition: gradientWave.definition, generate: gradientWave.generate },
  'terminal-hacker': { definition: terminalHacker.definition, generate: terminalHacker.generate },
  'minimal-zen': { definition: minimalZen.definition, generate: minimalZen.generate },
  'neon-synthwave': { definition: neonSynthwave.definition, generate: neonSynthwave.generate },
  'corporate-pro': { definition: corporatePro.definition, generate: corporatePro.generate },
  'gamer-dev': { definition: gamerDev.definition, generate: gamerDev.generate },
  'dark-elegance': { definition: darkElegance.definition, generate: darkElegance.generate },
  'creative-portfolio': { definition: creativePortfolio.definition, generate: creativePortfolio.generate },
  'opensource-hero': { definition: opensourceHero.definition, generate: opensourceHero.generate },
  'student-learner': { definition: studentLearner.definition, generate: studentLearner.generate },
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEME_REGISTRY).map(t => t.definition);

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

export function getTheme(id: string): ThemeEntry | undefined {
  return THEME_REGISTRY[id];
}

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return THEME_REGISTRY[id]?.definition;
}

export function generateThemeMarkdown(themeId: string, input: Parameters<ThemeGenerator>[0]): string {
  const theme = THEME_REGISTRY[themeId];
  if (!theme) {
    return `<!-- Theme "${themeId}" not found. Please select a valid theme. -->`;
  }
  return theme.generate(input);
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

export default THEME_REGISTRY;
