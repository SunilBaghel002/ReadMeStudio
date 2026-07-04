'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useBuilderStore, DEFAULT_SECTIONS } from '@/store/useBuilderStore';
import { THEME_LIST, THEME_CATEGORIES, CATEGORY_LABELS, generateThemeMarkdown } from '@/themes';
import { ThemeDefinition } from '@/types/theme.types';
import { cn } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Check,
  Waves,
  Terminal,
  Minus,
  Zap,
  Briefcase,
  Gamepad2,
  Crown,
  Palette,
  GitPullRequest,
  GraduationCap,
} from 'lucide-react';
import {
  StatsCardPreview,
  LanguagesCardPreview,
  TrophiesCardPreview,
  RepositoryPinPreview
} from './CustomPreviewCards';

// Memoized ReactMarkdown component for the selector modal preview to prevent lag on hover/scroll
export const ThemePreviewRenderer = React.memo(({
  markdown,
  username,
  profile,
  repos,
  langs,
  stats,
}: {
  markdown: string;
  username: string;
  profile: any;
  repos: any;
  langs: any;
  stats: any;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ ...props }) => <h1 className="text-2xl font-extrabold pb-2 mb-4 border-b border-zinc-850 text-white tracking-tight" {...props} />,
        h2: ({ ...props }) => <h2 className="text-xl font-bold pb-2 mt-6 mb-3 border-b border-zinc-850 text-white tracking-tight" {...props} />,
        h3: ({ ...props }) => <h3 className="text-base font-semibold mt-4 mb-2 text-zinc-200" {...props} />,
        p: ({ ...props }) => <p className="mb-3 text-zinc-300 text-xs md:text-sm leading-relaxed" {...props} />,
        ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-zinc-350 text-xs md:text-sm" {...props} />,
        ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-zinc-350 text-xs md:text-sm" {...props} />,
        li: ({ ...props }) => <li className="pl-0.5" {...props} />,
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !match ? (
            <code className="bg-zinc-850 px-1.5 py-0.5 rounded text-pink-400 text-xs font-mono" {...props}>
              {children}
            </code>
          ) : (
            <pre className="bg-zinc-950 p-3 rounded-lg border border-white/5 overflow-x-auto text-[10px] font-mono text-zinc-300">
              <code>{children}</code>
            </pre>
          );
        },
        blockquote: ({ ...props }) => (
          <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 italic text-zinc-450 my-3" {...props} />
        ),
        table: ({ ...props }) => (
          <div className="overflow-x-auto my-4 border border-zinc-850 rounded-lg">
            <table className="min-w-full divide-y divide-zinc-850 text-[10px] text-left" {...props} />
          </div>
        ),
        th: ({ ...props }) => <th className="px-3 py-2 bg-zinc-900 text-zinc-300 font-bold uppercase" {...props} />,
        td: ({ ...props }) => <td className="px-3 py-2 bg-zinc-900/30 text-zinc-400 border-t border-zinc-850" {...props} />,
        a: ({ ...props }) => <a className="text-blue-400 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer" {...props} />,
        hr: ({ ...props }) => <hr className="border-zinc-800 my-4" {...props} />,
        details: ({ children, ...props }) => <details className="mb-3 border border-zinc-800 rounded-lg p-2" {...props}>{children}</details>,
        summary: ({ children, ...props }) => <summary className="cursor-pointer text-xs font-semibold text-zinc-300" {...props}>{children}</summary>,
        img: ({ src, alt, ...props }) => {
          if (!src || typeof src !== 'string') {
            return (
              <img className="max-w-full rounded-md inline-block my-1.5" src={src as any} alt={alt} {...props} />
            );
          }
          
          const isStatsDomain = src.includes('github-readme-stats.vercel.app') || src.includes('github-readme-stats.shion.dev');
          
          if (src.includes('/api/github/stats') || (isStatsDomain && src.includes('/api') && !src.includes('top-langs') && !src.includes('/pin/'))) {
            return <StatsCardPreview stats={stats} username={username} />;
          }

          if (src.includes('/api/github/languages') || (isStatsDomain && src.includes('/api/top-langs'))) {
            return <LanguagesCardPreview languages={langs} />;
          }

          if (src.includes('github-profile-trophy.vercel.app') || src.includes('/api/github/trophies')) {
            return <TrophiesCardPreview stats={stats} profile={profile} />;
          }

          if (isStatsDomain && src.includes('/api/pin/')) {
            const repoName = new URLSearchParams(src.split('?')[1] || '').get('repo') || '';
            return <RepositoryPinPreview repoName={repoName} topRepos={repos} />;
          }

          return (
            <img className="max-w-full rounded-md inline-block my-1.5" src={src} alt={alt} {...props} />
          );
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
});
ThemePreviewRenderer.displayName = 'ThemePreviewRenderer';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (templateId: string) => void;
  initialSelectedThemeId?: string;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Waves,
  Terminal,
  Minus,
  Zap,
  Briefcase,
  Gamepad2,
  Crown,
  Palette,
  GitPullRequest,
  GraduationCap,
};

const CATEGORY_ORDER = ['professional', 'creative', 'technical', 'fun'] as const;

const MOCK_GITHUB_DATA = {
  profile: {
    username: 'SunilBaghel002',
    name: 'Sunil Baghel',
    bio: 'Full Stack Web Developer | MERN Stack Enthusiast ⚛️',
    avatarUrl: 'https://avatars.githubusercontent.com/u/74038190?v=4',
    company: 'ReadMeStudio Co.',
    blog: 'https://sunilbaghel.dev',
    location: 'Delhi NCR, India 🇮🇳',
    email: 'sunilbaghel93100@gmail.com',
    followers: 432,
    following: 154,
    publicRepos: 48,
    publicGists: 5,
    twitterUsername: 'sunilbaghel02',
    createdAt: '2021-04-12T00:00:00Z',
    totalStars: 464,
    totalForks: 89,
  },
  stats: {
    totalStars: 464,
    totalForks: 89,
    totalCommits: 2618,
    totalPRs: 89,
    totalIssues: 35,
    totalReposCreated: 48,
  },
  streak: {
    currentStreak: 3,
    longestStreak: 302,
    totalContributions: 2618,
  },
  languages: [
    { name: 'JavaScript', bytes: 150000, percentage: 48.2, color: '#f1e05a' },
    { name: 'TypeScript', bytes: 100000, percentage: 32.1, color: '#3178c6' },
    { name: 'CSS', bytes: 30000, percentage: 9.6, color: '#563d7c' },
    { name: 'HTML', bytes: 20000, percentage: 6.4, color: '#e34c26' },
    { name: 'Other', bytes: 11000, percentage: 3.7, color: '#852baf' },
  ],
  topRepos: [
    { name: 'ReadMeStudio', htmlUrl: 'https://github.com/SunilBaghel002/ReadMeStudio', description: 'Next.js 15 app for generating rich and premium GitHub profile README files.', stars: 154, forks: 24, language: 'TypeScript' },
    { name: 'portfolio', htmlUrl: 'https://github.com/SunilBaghel002/portfolio', description: 'My personal portfolio website built using React, Three.js, and Tailwind CSS.', stars: 89, forks: 12, language: 'JavaScript' },
    { name: 'mern-boilerplate', htmlUrl: 'https://github.com/SunilBaghel002/mern-boilerplate', description: 'Production-ready MERN Stack starter kit with JWT authentication and Role Access.', stars: 54, forks: 8, language: 'JavaScript' },
  ]
};

export default function TemplateSelectorModal({ isOpen, onClose, onSelect, initialSelectedThemeId }: TemplateSelectorModalProps) {
  const { 
    username: storeUsername, 
    profile: storeProfile,
    topRepos: storeRepos,
    languages: storeLangs,
    stats: storeStats,
    loadTheme,
    selectedThemeId: activeThemeId,
    sections,
  } = useBuilderStore();

  const [selectedId, setSelectedId] = useState<string>(initialSelectedThemeId || activeThemeId || THEME_LIST[0].id);
  const [previewMarkdown, setPreviewMarkdown] = useState<string>('');

  // Sync selectedId when modal opens with a specific theme
  useEffect(() => {
    if (isOpen) {
      setSelectedId(initialSelectedThemeId || activeThemeId || THEME_LIST[0].id);
    }
  }, [isOpen, initialSelectedThemeId, activeThemeId]);

  // Resolve user details (real or mock)
  const username = storeUsername || MOCK_GITHUB_DATA.profile.username;
  const profile = storeProfile || MOCK_GITHUB_DATA.profile;
  const repos = storeRepos.length > 0 ? storeRepos : MOCK_GITHUB_DATA.topRepos;
  const langs = storeLangs.length > 0 ? storeLangs : MOCK_GITHUB_DATA.languages;
  const stats = storeStats || MOCK_GITHUB_DATA.stats;

  const currentTheme = THEME_LIST.find(t => t.id === selectedId) || THEME_LIST[0];

  useEffect(() => {
    let active = true;
    
    async function loadMarkdown() {
      // Generate preview markdown using the selected theme's generator
      const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://readme-studio.vercel.app';

      // Gather skills from existing sections
      const skillsSection = sections.find(s => s.type === 'skills');
      const skills = skillsSection?.config?.skills?.selectedSkills || ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'TailwindCSS', 'Git', 'Docker'];

      // Gather repos
      const selectedRepos = repos.slice(0, 3).map(r => r.name);

      const md = await generateThemeMarkdown(selectedId, {
        username,
        name: profile.name || username,
        bio: profile.bio || 'Full Stack Web Developer',
        avatarUrl: `https://github.com/${username}.png`,
        skills,
        selectedRepos,
        socials: {
          github: username,
          linkedin: '',
          twitter: (profile as any).twitterUsername || '',
          portfolio: '',
          email: '',
        },
        customization: currentTheme.defaultConfig,
        currentProject: 'ReadMeStudio',
        learning: 'Next.js 15, Framer Motion, and Rust',
        collab: 'open source projects',
        baseUrl: hostUrl,
      });

      if (active) {
        setPreviewMarkdown(md);
      }
    }

    loadMarkdown();

    return () => {
      active = false;
    };
  }, [selectedId, username, profile, currentTheme, repos, sections]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onSelect) {
      onSelect(selectedId);
    } else {
      loadTheme(selectedId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-[#15121b] border border-white/5 w-full max-w-7xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:px-6 border-b border-white/5 bg-[#181520] shrink-0">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Choose Your Theme</span>
            </h3>
            <p className="text-[10px] text-zinc-450 mt-0.5">Each theme produces a completely different README. Preview using {storeUsername ? 'your' : 'simulated'} data.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 hover:text-white hover:border-white/10 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Column: Theme List by Category */}
          <div className="w-[340px] shrink-0 h-full border-r border-white/5 overflow-y-auto p-4 space-y-5 bg-[#110e16]/30">
            {CATEGORY_ORDER.map(category => {
              const themes = THEME_CATEGORIES[category];
              const catInfo = CATEGORY_LABELS[category];
              if (themes.length === 0) return null;

              return (
                <div key={category}>
                  <div className="mb-2.5">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{catInfo.label}</h4>
                    <p className="text-[8px] text-zinc-600">{catInfo.description}</p>
                  </div>
                  <div className="space-y-2">
                    {themes.map((theme) => {
                      const Icon = ICON_MAP[theme.icon] || Sparkles;
                      const isSelected = selectedId === theme.id;
                      const isActive = activeThemeId === theme.id;

                      return (
                        <div
                          key={theme.id}
                          onClick={() => setSelectedId(theme.id)}
                          className={cn(
                            "p-3.5 rounded-xl border text-left flex flex-col transition-all duration-200 cursor-pointer relative",
                            isSelected 
                              ? "bg-[#7c3aed]/10 border-[#7c3aed]/40 shadow-lg shadow-indigo-500/5 text-white" 
                              : "bg-[#15121b]/40 border-white/5 text-zinc-450 hover:bg-white/5 hover:border-white/10"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              {/* Color swatches */}
                              <div className="flex gap-0.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.previewColors.primary }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.previewColors.secondary }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.previewColors.accent }} />
                              </div>
                              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{theme.name}</span>
                                {isActive && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-[8px] font-mono tracking-normal font-semibold">Active</span>
                                )}
                              </h4>
                            </div>
                            <Icon className="h-3.5 w-3.5 text-zinc-500" />
                          </div>
                          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-relaxed">
                            {theme.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Full Theme Preview */}
          <div className="flex-1 h-full bg-[#0d0b11] overflow-y-auto p-6 md:p-8 flex flex-col items-center">
            {/* Theme info bar */}
            <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: currentTheme.previewColors.primary }} />
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: currentTheme.previewColors.secondary }} />
                  <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: currentTheme.previewColors.accent }} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white">{currentTheme.name}</span>
                  <span className="text-[9px] text-zinc-500 ml-2 capitalize">{currentTheme.category}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] text-indigo-400 uppercase tracking-widest font-semibold font-mono animate-pulse">Live Preview</span>
            </div>

            {/* Markdown Preview */}
            <div className="w-full max-w-2xl bg-[#0d1117] border border-zinc-800 rounded-2xl p-6 md:p-8 text-left shadow-2xl relative min-h-full">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-zinc-800 text-[10px] font-mono text-zinc-550">
                <span>{username} / README.md (Preview)</span>
              </div>
              <article className="github-prose prose prose-invert max-w-none text-left leading-relaxed text-[#e6edf3]">
                <ThemePreviewRenderer
                  markdown={previewMarkdown}
                  username={username}
                  profile={profile}
                  repos={repos}
                  langs={langs}
                  stats={stats}
                />
              </article>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:px-6 border-t border-white/5 bg-[#181520] flex items-center justify-between shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.previewColors.primary }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.previewColors.secondary }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentTheme.previewColors.accent }} />
            </div>
            <span className="text-[10px] text-zinc-450">Selected: </span>
            <span className="text-[10.5px] font-bold text-white font-mono">{currentTheme.name}</span>
            <span className="text-[9px] text-zinc-550 capitalize">({currentTheme.category})</span>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg border border-white/5 hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Apply Theme</span>
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
