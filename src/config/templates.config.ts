import {
  SectionType,
  AppTheme,
  ReadmeStyle,
  FontStyle,
  BuilderSection,
  SectionConfig
} from '@/types/github.types';
import { THEME_LIST } from '@/themes';

export interface TemplateConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  theme: AppTheme;
  accentColor: string;
  readmeStyle: ReadmeStyle;
  fontStyle: FontStyle;
  enabledSections: SectionType[];
  sectionsConfig: Partial<SectionConfig>;
  isLegacy?: boolean;
}

// New theme-based templates derived from the theme registry
export const THEME_TEMPLATES: TemplateConfig[] = THEME_LIST.map(def => ({
  id: def.id,
  title: def.name,
  description: def.description,
  icon: def.icon,
  theme: def.id as AppTheme,
  accentColor: def.defaultConfig.primaryColor,
  readmeStyle: 'professional' as ReadmeStyle,
  fontStyle: 'sans' as FontStyle,
  enabledSections: ['header', 'about', 'skills', 'stats', 'streak', 'projects', 'socials'] as SectionType[],
  sectionsConfig: {
    stats: { theme: def.statsTheme, hideBorder: true, showIcons: true, includeAllCommits: true },
    streak: { theme: def.statsTheme, hideBorder: true },
    languages: { theme: def.statsTheme, hideBorder: true, langsCount: 6 },
  },
}));

// Legacy templates for backward compatibility
export const LEGACY_TEMPLATES: TemplateConfig[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Pro',
    description: 'The complete profile. Incorporates basic header, bio, skills, repositories, and streak counters.',
    icon: 'Cpu',
    theme: 'dark',
    accentColor: '#3b82f6',
    readmeStyle: 'professional',
    fontStyle: 'sans',
    enabledSections: ['header', 'about', 'skills', 'stats', 'streak', 'projects', 'socials'],
    sectionsConfig: {
      stats: { theme: 'github_dark', hideBorder: false, showIcons: true, includeAllCommits: true },
      streak: { theme: 'github_dark', hideBorder: false },
      languages: { theme: 'github_dark', hideBorder: false, langsCount: 6 },
    },
    isLegacy: true,
  },
];

// Export the new theme-based templates as default
export const TEMPLATES = THEME_TEMPLATES;
