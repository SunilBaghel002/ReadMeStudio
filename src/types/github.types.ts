export interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  createdAt: string;
  location: string | null;
  blog: string | null;
  company: string | null;
  twitterUsername: string | null;
}

export interface GitHubRepo {
  name: string;
  htmlUrl: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface ContributionStreak {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  contributionYears: number[];
}

export interface GitHubEvent {
  id: string;
  type: string;
  repoName: string;
  createdAt: string;
  details: string;
}

export interface GitHubStatsData {
  profile: GitHubProfile;
  stats: {
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalReposCreated: number;
  };
  languages: LanguageStat[];
  streak: ContributionStreak;
  topRepos: GitHubRepo[];
  recentActivity: GitHubEvent[];
}

export type SectionType =
  | 'header'
  | 'about'
  | 'skills'
  | 'stats'
  | 'streak'
  | 'languages'
  | 'trophies'
  | 'projects'
  | 'socials'
  | 'visitor-counter'
  | 'working-on'
  | 'quote'
  | 'typing'
  | 'custom';

export interface SectionConfig {
  header?: {
    name: string;
    tagline: string;
    showAvatar: boolean;
    avatarShape: 'circle' | 'square';
    alignment: 'left' | 'center' | 'right';
  };
  about?: {
    text: string;
    showBio: boolean;
  };
  skills?: {
    selectedSkills: string[];
    badgeStyle: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
    badgeColor: string;
  };
  stats?: {
    theme: string;
    hideBorder: boolean;
    showIcons: boolean;
    includeAllCommits: boolean;
  };
  streak?: {
    theme: string;
    hideBorder: boolean;
  };
  languages?: {
    theme: string;
    hideBorder: boolean;
    layout: 'compact' | 'normal';
  };
  trophies?: {
    theme: string;
    columnCount: number;
  };
  projects?: {
    selectedRepos: string[];
    layout: 'grid' | 'list';
  };
  socials?: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
    email: string;
    youtube?: string;
    instagram?: string;
    devto?: string;
    medium?: string;
    badgeStyle: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
    badgeColor: string;
  };
  'visitor-counter'?: {
    style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
    color: string;
  };
  'working-on'?: {
    currentProject: string;
    currentProjectUrl: string;
    learning: string;
    collab: string;
  };
  quote?: {
    theme: string;
  };
  typing?: {
    lines: string[];
    color: string;
    background: string;
    size: number;
  };
  custom?: {
    markdown: string;
  };
}

export interface BuilderSection {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  config: SectionConfig;
}

export type AppTheme = 'minimal' | 'dark' | 'cyberpunk' | 'gradient' | 'devops' | 'pastel';
export type ReadmeStyle = 'minimal' | 'bold' | 'creative' | 'professional' | 'hacker' | 'elegant';
export type AccentColor = string;
export type FontStyle = 'sans' | 'serif' | 'mono' | 'display';
