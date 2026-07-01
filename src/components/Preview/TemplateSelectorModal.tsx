'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useBuilderStore, DEFAULT_SECTIONS } from '@/store/useBuilderStore';
import { TEMPLATES } from '@/config/templates.config';
import { BuilderSection, SectionType } from '@/types/github.types';
import { generateMarkdown } from '@/lib/markdown';
import { cn } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Layout, 
  GraduationCap, 
  Layers, 
  CloudLightning,
  Check, 
  Eye,
  Sliders,
  ArrowRight
} from 'lucide-react';
import {
  StatsCardPreview,
  LanguagesCardPreview,
  TrophiesCardPreview,
  RepositoryPinPreview
} from './CustomPreviewCards';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (templateId: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Cpu,
  Layout,
  Sparkles,
  GraduationCap,
  Layers,
  CloudLightning,
};

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

export default function TemplateSelectorModal({ isOpen, onClose, onSelect }: TemplateSelectorModalProps) {
  const { 
    username: storeUsername, 
    profile: storeProfile,
    topRepos: storeRepos,
    languages: storeLangs,
    stats: storeStats,
    loadTemplate,
    selectedTemplate: activeTemplateId 
  } = useBuilderStore();

  const [selectedTmplId, setSelectedTmplId] = useState<string>(activeTemplateId || TEMPLATES[0].id);
  const [previewMarkdown, setPreviewMarkdown] = useState<string>('');

  // Resolve user details (real or mock)
  const username = storeUsername || MOCK_GITHUB_DATA.profile.username;
  const profile = storeProfile || MOCK_GITHUB_DATA.profile;
  const repos = storeRepos.length > 0 ? storeRepos : MOCK_GITHUB_DATA.topRepos;
  const langs = storeLangs.length > 0 ? storeLangs : MOCK_GITHUB_DATA.languages;
  const stats = storeStats || MOCK_GITHUB_DATA.stats;

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTmplId) || TEMPLATES[0];

  useEffect(() => {
    // Construct preview markdown dynamically for the selected template configuration
    const defaultSectionsMap = DEFAULT_SECTIONS(username, profile.name || username, profile.bio || '').reduce((acc, sec) => {
      acc[sec.type] = sec;
      return acc;
    }, {} as Record<SectionType, BuilderSection>);

    const sections = currentTemplate.enabledSections.map((type) => {
      const defaultSec = defaultSectionsMap[type];
      const configOverride = currentTemplate.sectionsConfig[type] || {};
      return {
        ...defaultSec,
        isVisible: true,
        config: {
          ...defaultSec.config,
          ...configOverride,
        },
      };
    });

    const md = generateMarkdown(sections, username, {
      showEmojis: true,
      showBanners: currentTemplate.id !== 'minimal',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      accentColor: currentTemplate.accentColor,
      statsCardTheme: currentTemplate.theme === 'devops' ? 'tokyonight' : (currentTemplate.theme === 'cyberpunk' ? 'cyberpunk' : 'github_dark'),
      readmeStyle: currentTemplate.readmeStyle,
    });

    setPreviewMarkdown(md);
  }, [selectedTmplId, username, profile, currentTemplate]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onSelect) {
      onSelect(selectedTmplId);
    } else {
      loadTemplate(selectedTmplId as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-[#15121b] border border-white/5 w-full max-w-6xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:px-6 border-b border-white/5 bg-[#181520] shrink-0">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Select Structural Template</span>
            </h3>
            <p className="text-[10px] text-zinc-450 mt-0.5">Preview template layouts using {storeUsername ? 'your' : 'simulated'} stats before choosing.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 hover:text-white hover:border-white/10 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content Split Grid */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Column: Template Selection List */}
          <div className="w-[320px] shrink-0 h-full border-r border-white/5 overflow-y-auto p-4 space-y-3 bg-[#110e16]/30">
            {TEMPLATES.map((tmpl) => {
              const Icon = ICON_MAP[tmpl.icon] || Layout;
              const isSelected = selectedTmplId === tmpl.id;
              const isActive = activeTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTmplId(tmpl.id)}
                  className={cn(
                    "p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative",
                    isSelected 
                      ? "bg-[#7c3aed]/10 border-[#7c3aed]/40 shadow-lg shadow-indigo-500/5 text-white" 
                      : "bg-[#15121b]/40 border-white/5 text-zinc-450 hover:bg-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center border transition-colors",
                        isSelected ? "border-[#7c3aed]/30 bg-[#7c3aed]/10" : "border-white/5 bg-zinc-900"
                      )}>
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{tmpl.title}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-[8px] font-mono tracking-normal font-semibold">Active</span>
                          )}
                        </h4>
                        <span className="text-[9px] text-zinc-500 font-mono capitalize">{tmpl.readmeStyle} style</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-450 mt-2.5 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3.5 pt-2.5 border-t border-white/5">
                    {tmpl.enabledSections.slice(0, 3).map((sec) => (
                      <span 
                        key={sec} 
                        className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-550"
                      >
                        {sec}
                      </span>
                    ))}
                    {tmpl.enabledSections.length > 3 && (
                      <span className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-550">
                        +{tmpl.enabledSections.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Compiled Preview Canvas */}
          <div className="flex-1 h-full bg-[#0d0b11] overflow-y-auto p-6 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-[#0d1117] border border-zinc-800 rounded-2xl p-6 md:p-8 text-left shadow-2xl relative min-h-full">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-zinc-800 text-[10px] font-mono text-zinc-550">
                <span>{username} / README.md (Preview)</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-white/5 rounded text-[8px] text-indigo-400 uppercase tracking-widest font-semibold font-mono animate-pulse">Live Draft</span>
              </div>

              <article className="github-prose prose prose-invert max-w-none text-left leading-relaxed text-[#e6edf3]">
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
                        <code className="bg-zinc-850 px-1 py-0.5 rounded text-pink-400 text-xs font-mono" {...props}>
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
                    img: ({ src, alt, ...props }) => {
                      if (!src || typeof src !== 'string') {
                        return (
                          <img className="max-w-full rounded-md inline-block my-1.5" src={src as any} alt={alt} {...props} />
                        );
                      }
                      
                      const isStatsDomain = src.includes('github-readme-stats.vercel.app') || src.includes('github-readme-stats.shion.dev');
                      
                      if (isStatsDomain && src.includes('/api') && !src.includes('top-langs') && !src.includes('/pin/')) {
                        return <StatsCardPreview stats={stats} username={username} />;
                      }

                      if (isStatsDomain && src.includes('/api/top-langs')) {
                        return <LanguagesCardPreview languages={langs} />;
                      }

                      if (src.includes('github-profile-trophy.vercel.app')) {
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
                  {previewMarkdown}
                </ReactMarkdown>
              </article>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:px-6 border-t border-white/5 bg-[#181520] flex items-center justify-between shrink-0">
          <div className="hidden sm:block">
            <span className="text-[10px] text-zinc-450">Selected Start Layout: </span>
            <span className="text-[10.5px] font-bold text-white font-mono">{currentTemplate.title}</span>
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
              <span>Apply Template</span>
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
