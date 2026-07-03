export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'technical' | 'fun';
  icon: string;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  defaultConfig: ThemeCustomization;
  statsTheme: string;
  badgeStyle: string;
}

export interface ThemeCustomization {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  alignment: 'center' | 'left';
  emojiLevel: 'none' | 'minimal' | 'heavy';
  showTypingAnimation: boolean;
  showContributionGraph: boolean;
  showTrophies: boolean;
  showQuote: boolean;
  showVisitorCounter: boolean;
  showSnakeAnimation: boolean;
  customTitle?: string;
  customTagline?: string;
}

export interface ThemeGeneratorInput {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  selectedRepos: string[];
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
  };
  customization: ThemeCustomization;
  currentProject?: string;
  currentProjectUrl?: string;
  learning?: string;
  collab?: string;
  baseUrl: string;
}

export type ThemeGenerator = (input: ThemeGeneratorInput) => string;
