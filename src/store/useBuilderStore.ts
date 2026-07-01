import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GitHubProfile,
  GitHubRepo,
  LanguageStat,
  ContributionStreak,
  BuilderSection,
  AppTheme,
  ReadmeStyle,
  FontStyle,
  SectionConfig,
  GitHubEvent,
  SectionType,
  GitHubStatsData,
} from '@/types/github.types';
import { TEMPLATES } from '@/config/templates.config';

interface BuilderStore {
  username: string;
  githubData: GitHubStatsData | null;
  selectedTemplate: string | null;
  profile: GitHubProfile | null;
  topRepos: GitHubRepo[];
  languages: LanguageStat[];
  streak: ContributionStreak | null;
  recentActivity: GitHubEvent[];
  stats: {
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalReposCreated: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  sections: BuilderSection[];
  activeTheme: AppTheme;
  readmeStyle: ReadmeStyle;
  accentColor: string;
  fontStyle: FontStyle;
  statsCardTheme: string;
  showEmojis: boolean;
  showBanners: boolean;
  bannerImage: string;
  selectedSectionId: string | null;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (val: boolean) => void;
  setUsername: (username: string) => void;
  fetchUserData: (username: string) => Promise<boolean>;
  injectGitHubData: (data: GitHubStatsData) => void;
  setSections: (sections: BuilderSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
  updateSectionConfig: (id: string, config: any) => void;
  setActiveTheme: (theme: AppTheme) => void;
  setReadmeStyle: (style: ReadmeStyle) => void;
  setAccentColor: (color: string) => void;
  setFontStyle: (font: FontStyle) => void;
  setStatsCardTheme: (theme: string) => void;
  setShowEmojis: (val: boolean) => void;
  setShowBanners: (val: boolean) => void;
  setBannerImage: (url: string) => void;
  setSelectedSectionId: (id: string | null) => void;
  resetStore: () => void;
  loadTemplate: (templateType: 'minimal' | 'fullstack' | 'opensource' | 'student' | 'creative' | 'devops') => void;
  addCustomSection: () => void;
  deleteSection: (id: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
}

const DEFAULT_SECTIONS = (username: string, name: string, bio: string): BuilderSection[] => [
  {
    id: 'typing',
    type: 'typing',
    title: 'Animated Typing Text',
    isVisible: false,
    config: {
      typing: {
        lines: ['Hello world, I am ' + (name || 'a developer'), 'Welcome to my GitHub profile!', 'Building modern web apps'],
        color: '3b82f6',
        background: '00000000',
        size: 22,
      },
    },
  },
  {
    id: 'header',
    type: 'header',
    title: 'Header Banner',
    isVisible: true,
    config: {
      header: {
        name: name || 'Your Name',
        tagline: 'Full Stack Software Engineer',
        showAvatar: true,
        avatarShape: 'circle',
        alignment: 'center',
      },
    },
  },
  {
    id: 'about',
    type: 'about',
    title: 'About Me',
    isVisible: true,
    config: {
      about: {
        text: bio || 'I am a passionate software developer who loves building products and contributing to open source.',
        showBio: true,
      },
    },
  },
  {
    id: 'working-on',
    type: 'working-on',
    title: 'Focus Areas',
    isVisible: false,
    config: {
      'working-on': {
        currentProject: 'ReadMeStudio',
        currentProjectUrl: 'https://github.com/' + (username || 'username') + '/ReadMeStudio',
        learning: 'Next.js 15, Framer Motion, and Rust compiler internals',
        collab: 'developer workspace tools and open source projects',
      },
    },
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Skills & Tech Stack',
    isVisible: true,
    config: {
      skills: {
        selectedSkills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'TailwindCSS', 'Git', 'Docker'],
        badgeStyle: 'flat',
        badgeColor: '3b82f6',
      },
    },
  },
  {
    id: 'stats',
    type: 'stats',
    title: 'GitHub Core Statistics',
    isVisible: true,
    config: {
      stats: {
        theme: 'github_dark',
        hideBorder: true,
        showIcons: true,
        includeAllCommits: true,
      },
    },
  },
  {
    id: 'streak',
    type: 'streak',
    title: 'Commit Streak Metric',
    isVisible: true,
    config: {
      streak: {
        theme: 'github_dark',
        hideBorder: true,
      },
    },
  },
  {
    id: 'languages',
    type: 'languages',
    title: 'Most Used Languages',
    isVisible: false,
    config: {
      languages: {
        theme: 'github_dark',
        hideBorder: true,
        layout: 'compact',
      },
    },
  },
  {
    id: 'trophies',
    type: 'trophies',
    title: 'GitHub Trophies Badge',
    isVisible: false,
    config: {
      trophies: {
        theme: 'github_dark',
        columnCount: 3,
      },
    },
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Featured Repositories',
    isVisible: false,
    config: {
      projects: {
        selectedRepos: [],
        layout: 'grid',
      },
    },
  },
  {
    id: 'socials',
    type: 'socials',
    title: 'Social & Link Cards',
    isVisible: true,
    config: {
      socials: {
        github: username || '',
        linkedin: '',
        twitter: '',
        portfolio: '',
        email: '',
        badgeStyle: 'flat',
        badgeColor: '3b82f6',
      },
    },
  },
  {
    id: 'visitor-counter',
    type: 'visitor-counter',
    title: 'Profile View Counter',
    isVisible: false,
    config: {
      'visitor-counter': {
        style: 'flat-square',
        color: '3b82f6',
      },
    },
  },
  {
    id: 'quote',
    type: 'quote',
    title: 'Developer Quote',
    isVisible: false,
    config: {
      quote: {
        theme: 'github_dark',
      },
    },
  },
  {
    id: 'custom',
    type: 'custom',
    title: 'Custom Section',
    isVisible: false,
    config: {
      custom: {
        markdown: '### Custom Header 🚀\nWrite your custom details, markdown tables, or special callouts here.',
      },
    },
  },
];

const THEME_ACCENTS: Record<AppTheme, { accent: string; statsTheme: string }> = {
  minimal: { accent: '#fafafa', statsTheme: 'neutral' },
  dark: { accent: '#3b82f6', statsTheme: 'github_dark' },
  cyberpunk: { accent: '#ff007f', statsTheme: 'cyberpunk' },
  gradient: { accent: '#8b5cf6', statsTheme: 'radical' },
  devops: { accent: '#f97316', statsTheme: 'tokyonight' },
  pastel: { accent: '#c084fc', statsTheme: 'merko' },
};

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      username: '',
      githubData: null,
      selectedTemplate: null,
      profile: null,
      topRepos: [],
      languages: [],
      streak: null,
      recentActivity: [],
      stats: null,
      isLoading: false,
      error: null,
      sections: DEFAULT_SECTIONS('', '', ''),
      activeTheme: 'dark',
      readmeStyle: 'professional',
      accentColor: '#3b82f6',
      fontStyle: 'sans',
      statsCardTheme: 'github_dark',
      showEmojis: true,
      showBanners: false,
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      selectedSectionId: 'header',
      hasHydrated: false,

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setUsername: (username) => set({ username }),

      fetchUserData: async (username) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`/api/github?username=${username}`);
          if (!res.ok) {
            const errJson = await res.json();
            throw new Error(errJson.message || errJson.error || 'Failed to fetch GitHub data');
          }
          const data: GitHubStatsData = await res.json();

          set({
            username,
            githubData: data,
            profile: data.profile,
            topRepos: data.topRepos,
            languages: data.languages,
            streak: data.streak,
            stats: data.stats,
            recentActivity: data.recentActivity,
            isLoading: false,
          });

          // Inject fetched GitHub data into the active builder sections configuration
          get().injectGitHubData(data);

          return true;
        } catch (error: any) {
          console.error(error);
          set({ isLoading: false, error: error.message || 'Something went wrong' });
          return false;
        }
      },

      injectGitHubData: (data) => {
        const username = data.profile.username;
        const name = data.profile.name || username;
        const bio = data.profile.bio || 'I am a software engineer.';

        set((state) => {
          const updatedSections = state.sections.map((sec) => {
            if (sec.id === 'header') {
              return {
                ...sec,
                config: {
                  ...sec.config,
                  header: {
                    ...sec.config.header,
                    name: name,
                    tagline: bio,
                  },
                } as SectionConfig,
              };
            }
            if (sec.id === 'about') {
              return {
                ...sec,
                config: {
                  ...sec.config,
                  about: {
                    ...sec.config.about,
                    text: bio,
                  },
                } as SectionConfig,
              };
            }
            if (sec.id === 'socials') {
              return {
                ...sec,
                config: {
                  ...sec.config,
                  socials: {
                    ...sec.config.socials,
                    github: username,
                    twitter: data.profile.twitterUsername || '',
                  },
                } as SectionConfig,
              };
            }
            if (sec.id === 'projects') {
              return {
                ...sec,
                config: {
                  ...sec.config,
                  projects: {
                    ...sec.config.projects,
                    selectedRepos: data.topRepos.slice(0, 4).map((r) => r.name),
                  },
                } as SectionConfig,
              };
            }
            return sec;
          });

          return {
            sections: updatedSections,
          };
        });
      },

      setSections: (sections) => set({ sections }),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec
          ),
        })),

      updateSectionConfig: (id, config) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === id
              ? { ...sec, config: { ...sec.config, ...config } }
              : sec
          ),
        })),

      setActiveTheme: (theme) => {
        const themeDefaults = THEME_ACCENTS[theme];
        if (!themeDefaults) return;
        set((state) => {
          const updatedSections = state.sections.map((sec) => {
            if (sec.id === 'stats' && sec.config.stats) {
              return { ...sec, config: { ...sec.config, stats: { ...sec.config.stats, theme: themeDefaults.statsTheme } } };
            }
            if (sec.id === 'streak' && sec.config.streak) {
              return { ...sec, config: { ...sec.config, streak: { ...sec.config.streak, theme: themeDefaults.statsTheme } } };
            }
            if (sec.id === 'languages' && sec.config.languages) {
              return { ...sec, config: { ...sec.config, languages: { ...sec.config.languages, theme: themeDefaults.statsTheme } } };
            }
            if (sec.id === 'trophies' && sec.config.trophies) {
              return { ...sec, config: { ...sec.config, trophies: { ...sec.config.trophies, theme: themeDefaults.statsTheme } } };
            }
            return sec;
          });

          return {
            activeTheme: theme,
            accentColor: themeDefaults.accent,
            statsCardTheme: themeDefaults.statsTheme,
            sections: updatedSections,
          };
        });
      },

      setReadmeStyle: (readmeStyle) => set({ readmeStyle }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontStyle: (fontStyle) => set({ fontStyle }),
      setStatsCardTheme: (statsCardTheme) => set({ statsCardTheme }),
      setShowEmojis: (showEmojis) => set({ showEmojis }),
      setShowBanners: (showBanners) => set({ showBanners }),
      setBannerImage: (bannerImage) => set({ bannerImage }),
      setSelectedSectionId: (selectedSectionId) => set({ selectedSectionId }),

      resetStore: () =>
        set({
          username: '',
          githubData: null,
          selectedTemplate: null,
          profile: null,
          topRepos: [],
          languages: [],
          streak: null,
          recentActivity: [],
          stats: null,
          isLoading: false,
          error: null,
          sections: DEFAULT_SECTIONS('', '', ''),
          activeTheme: 'dark',
          readmeStyle: 'professional',
          accentColor: '#3b82f6',
          fontStyle: 'sans',
          statsCardTheme: 'github_dark',
          showEmojis: true,
          showBanners: false,
          selectedSectionId: 'header',
        }),

      loadTemplate: (templateId) => {
        const template = TEMPLATES.find((t) => t.id === templateId);
        if (!template) return;

        const defaultSectionsMap = DEFAULT_SECTIONS('', '', '').reduce((acc, sec) => {
          acc[sec.type] = sec;
          return acc;
        }, {} as Record<SectionType, BuilderSection>);

        // Order section types based on template's enabledSections first, followed by remaining default sections
        const orderedTypes = [
          ...template.enabledSections,
          ...Object.keys(defaultSectionsMap).filter(
            (type) => !template.enabledSections.includes(type as SectionType)
          ),
        ] as SectionType[];

        const sections = orderedTypes.map((type) => {
          const defaultSec = defaultSectionsMap[type];
          const isVisible = template.enabledSections.includes(type);

          const configOverride = template.sectionsConfig[type] || {};
          const mergedConfig = {
            ...defaultSec.config,
            ...configOverride,
          };

          return {
            ...defaultSec,
            isVisible,
            config: mergedConfig,
          };
        });

        const themeDefaults = THEME_ACCENTS[template.theme] || { accent: '#3b82f6', statsTheme: 'github_dark' };

        const updatedSections = sections.map((sec) => {
          if (sec.id === 'stats' && sec.config.stats) {
            return { ...sec, config: { ...sec.config, stats: { ...sec.config.stats, theme: themeDefaults.statsTheme } } };
          }
          if (sec.id === 'streak' && sec.config.streak) {
            return { ...sec, config: { ...sec.config, streak: { ...sec.config.streak, theme: themeDefaults.statsTheme } } };
          }
          if (sec.id === 'languages' && sec.config.languages) {
            return { ...sec, config: { ...sec.config, languages: { ...sec.config.languages, theme: themeDefaults.statsTheme } } };
          }
          if (sec.id === 'trophies' && sec.config.trophies) {
            return { ...sec, config: { ...sec.config, trophies: { ...sec.config.trophies, theme: themeDefaults.statsTheme } } };
          }
          return sec;
        });

        set({
          selectedTemplate: templateId,
          sections: updatedSections,
          activeTheme: template.theme,
          accentColor: template.accentColor,
          readmeStyle: template.readmeStyle,
          fontStyle: template.fontStyle,
          statsCardTheme: themeDefaults.statsTheme,
        });
      },

      addCustomSection: () => {
        const id = `custom_${Date.now()}`;
        const newSec: BuilderSection = {
          id,
          type: 'custom',
          title: 'Custom Section',
          isVisible: true,
          config: {
            custom: {
              markdown: '### Custom Header 🚀\nWrite your custom details, markdown tables, or special callouts here.',
            },
          },
        };
        set((state) => ({
          sections: [...state.sections, newSec],
          selectedSectionId: id,
        }));
      },

      deleteSection: (id) =>
        set((state) => {
          const nextSections = state.sections.filter((s) => s.id !== id);
          const nextSelected = state.selectedSectionId === id ? (nextSections[0]?.id || null) : state.selectedSectionId;
          return {
            sections: nextSections,
            selectedSectionId: nextSelected,
          };
        }),

      updateSectionTitle: (id, title) =>
        set((state) => ({
          sections: state.sections.map((sec) =>
            sec.id === id ? { ...sec, title } : sec
          ),
        })),
    }),
    {
      name: 'readmestudio-builder-store',
      partialize: (state) => ({
        username: state.username,
        githubData: state.githubData,
        selectedTemplate: state.selectedTemplate,
        profile: state.profile,
        topRepos: state.topRepos,
        languages: state.languages,
        streak: state.streak,
        stats: state.stats,
        recentActivity: state.recentActivity,
        sections: state.sections,
        activeTheme: state.activeTheme,
        readmeStyle: state.readmeStyle,
        accentColor: state.accentColor,
        fontStyle: state.fontStyle,
        statsCardTheme: state.statsCardTheme,
        showEmojis: state.showEmojis,
        showBanners: state.showBanners,
        bannerImage: state.bannerImage,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
