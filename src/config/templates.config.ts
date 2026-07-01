import { 
  SectionType, 
  AppTheme, 
  ReadmeStyle, 
  FontStyle, 
  BuilderSection, 
  SectionConfig 
} from '@/types/github.types';

export interface TemplateConfig {
  id: string;
  title: string;
  description: string;
  icon: string; // Dynamic icon identifier, e.g., 'Cpu', 'Layout', 'Sparkles', 'GraduationCap', 'Layers', 'CloudLightning'
  theme: AppTheme;
  accentColor: string;
  readmeStyle: ReadmeStyle;
  fontStyle: FontStyle;
  enabledSections: SectionType[]; // Defines visible sections and their precise order
  sectionsConfig: Partial<SectionConfig>;
}

export const TEMPLATES: TemplateConfig[] = [
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
    sectionsConfig: {},
  },
  {
    id: 'minimal',
    title: 'Minimal Dev',
    description: 'A clean, typography-focused layout containing just a header, bio description, selected skills, and contact links.',
    icon: 'Layout',
    theme: 'minimal',
    accentColor: '#fafafa',
    readmeStyle: 'minimal',
    fontStyle: 'sans',
    enabledSections: ['header', 'about', 'skills', 'socials'],
    sectionsConfig: {},
  },
  {
    id: 'opensource',
    title: 'Open Source Contributor',
    description: 'Showcase your commits. Focuses heavily on trophy badges, streaks, languages, and repo statistics.',
    icon: 'Sparkles',
    theme: 'gradient',
    accentColor: '#8b5cf6',
    readmeStyle: 'bold',
    fontStyle: 'sans',
    enabledSections: ['header', 'stats', 'streak', 'trophies', 'projects', 'socials'],
    sectionsConfig: {},
  },
  {
    id: 'student',
    title: 'Student / Learner',
    description: 'Highlights study goals. Perfect for showing current topics, education achievements, and quotes.',
    icon: 'GraduationCap',
    theme: 'pastel',
    accentColor: '#c084fc',
    readmeStyle: 'elegant',
    fontStyle: 'serif',
    enabledSections: ['header', 'about', 'skills', 'visitor-counter', 'quote', 'socials'],
    sectionsConfig: {},
  },
  {
    id: 'creative',
    title: 'Creative Developer',
    description: 'Stands out visually. Employs animated typing badges, custom details, quotes, and layouts.',
    icon: 'Layers',
    theme: 'cyberpunk',
    accentColor: '#ff007f',
    readmeStyle: 'creative',
    fontStyle: 'display',
    enabledSections: ['typing', 'header', 'about', 'skills', 'quote', 'custom', 'socials'],
    sectionsConfig: {},
  },
  {
    id: 'devops',
    title: 'DevOps / Cloud',
    description: 'Infrastructure layout. Showcases pipeline certifications, system toolkits, stats, and badges.',
    icon: 'CloudLightning',
    theme: 'devops',
    accentColor: '#f97316',
    readmeStyle: 'hacker',
    fontStyle: 'mono',
    enabledSections: ['header', 'about', 'skills', 'stats', 'streak', 'socials'],
    sectionsConfig: {
      skills: {
        selectedSkills: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'GitHub Actions', 'Shell', 'Go'],
        badgeStyle: 'flat',
        badgeColor: 'f97316',
      },
    },
  },
];
