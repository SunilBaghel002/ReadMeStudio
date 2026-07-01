'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useBuilderStore } from '@/store/useBuilderStore';
import { generateMarkdown } from '@/lib/markdown';
import ExportModal from './ExportModal';
import { 
  BookOpen, 
  GitPullRequest, 
  Star, 
  Bookmark, 
  Eye, 
  FileText, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Package, 
  Activity,
  GitCommit,
  GitFork
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageStat, GitHubRepo } from '@/types/github.types';

const StatsCardPreview = ({ stats, username }: { stats: any; username: string }) => {
  if (!stats) return null;
  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-[#0d0c1d]/60 text-white max-w-md mx-auto my-4 shadow-lg font-sans">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4.5 w-4.5 text-indigo-400" />
        <h4 className="text-sm font-bold text-indigo-300 font-mono">{username}'s GitHub Stats</h4>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> Stars</span>
          <span className="font-bold font-mono text-yellow-400">{stats.totalStars}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><GitCommit className="h-3.5 w-3.5 text-blue-400" /> Commits</span>
          <span className="font-bold font-mono">{stats.totalCommits}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><GitPullRequest className="h-3.5 w-3.5 text-purple-400" /> PRs</span>
          <span className="font-bold font-mono">{stats.totalPRs}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Repos</span>
          <span className="font-bold font-mono">{stats.totalReposCreated}</span>
        </div>
      </div>
    </div>
  );
};

const LanguagesCardPreview = ({ languages }: { languages: LanguageStat[] }) => {
  if (!languages || languages.length === 0) return null;
  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-[#0d0c1d]/60 text-white max-w-md mx-auto my-4 shadow-lg font-sans">
      <h4 className="text-sm font-bold text-indigo-300 mb-4 font-mono">Most Used Languages</h4>
      <div className="space-y-3.5">
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-900">
          {languages.map((lang) => (
            <div
              key={lang.name}
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
              className="h-full"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-zinc-350 font-mono truncate">{lang.name}</span>
              <span className="text-zinc-500 font-mono ml-auto">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TrophiesCardPreview = ({ stats, profile }: { stats: any; profile: any }) => {
  if (!profile) return null;
  
  const totalStars = stats?.totalStars || 0;
  const followers = profile.followers || 0;
  const commits = stats?.totalCommits || 0;
  const repos = profile.publicRepos || 0;

  const getGrade = (val: number, thresholds: number[]) => {
    if (val >= thresholds[0]) return 'S';
    if (val >= thresholds[1]) return 'A';
    if (val >= thresholds[2]) return 'B';
    return 'C';
  };

  const trophies = [
    { title: 'Stars', value: totalStars, grade: getGrade(totalStars, [1000, 100, 10]), color: 'from-amber-400 to-yellow-600' },
    { title: 'Followers', value: followers, grade: getGrade(followers, [500, 50, 5]), color: 'from-blue-400 to-indigo-600' },
    { title: 'Commits', value: commits, grade: getGrade(commits, [5000, 1000, 100]), color: 'from-emerald-400 to-teal-600' },
    { title: 'Repos', value: repos, grade: getGrade(repos, [100, 20, 5]), color: 'from-pink-400 to-rose-600' },
  ];

  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-[#0d0c1d]/60 text-white max-w-lg mx-auto my-4 shadow-lg font-sans">
      <h4 className="text-sm font-bold text-indigo-300 mb-4 font-mono">GitHub Profile Trophies</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trophies.map((tr) => (
          <div key={tr.title} className="p-3 bg-zinc-900/60 border border-white/5 rounded-lg text-center flex flex-col justify-between items-center shadow">
            <span className="text-[10px] text-zinc-400 uppercase font-mono mb-1">{tr.title}</span>
            <div className={`text-xl font-black bg-gradient-to-r ${tr.color} bg-clip-text text-transparent my-1`}>
              {tr.grade}
            </div>
            <span className="text-xs font-bold font-mono text-zinc-350">{tr.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RepositoryPinPreview = ({ repoName, topRepos }: { repoName: string; topRepos: GitHubRepo[] }) => {
  const repo = topRepos.find(r => r.name.toLowerCase() === repoName.toLowerCase());
  if (!repo) {
    return (
      <div className="border border-zinc-800 rounded-xl p-4 bg-[#0d0c1d]/60 text-white max-w-sm my-2 shadow-md inline-block text-left font-sans mr-3 w-80">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-blue-400 truncate">{repoName}</span>
        </div>
        <p className="text-[10px] text-zinc-550 mt-1">Repository is private or loading...</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-[#0d0c1d]/60 text-white max-w-sm my-2 shadow-md inline-block text-left font-sans mr-3 w-80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Bookmark className="h-4 w-4 text-blue-400 shrink-0" />
          <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 hover:underline truncate">
            {repo.name}
          </a>
        </div>
      </div>
      <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 min-h-[30px] leading-relaxed">
        {repo.description || 'No description available for this project.'}
      </p>
      <div className="flex gap-4 text-[10px] font-mono text-zinc-550 mt-3 pt-2 border-t border-white/3">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#3178c6' }} />
            <span>{repo.language}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          <span>{repo.stars}</span>
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5 text-zinc-500" />
          <span>{repo.forks}</span>
        </span>
      </div>
    </div>
  );
};

export default function PreviewPanel() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [githubTab, setGithubTab] = useState<'overview' | 'repos'>('overview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    sections,
    username,
    profile,
    topRepos,
    languages,
    stats,
    showEmojis,
    showBanners,
    bannerImage,
    accentColor,
    statsCardTheme,
    readmeStyle,
  } = useBuilderStore();

  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const md = generateMarkdown(sections, username, {
      showEmojis,
      showBanners,
      bannerImage,
      accentColor,
      statsCardTheme,
      readmeStyle,
    });
    setMarkdown(md);
  }, [sections, username, showEmojis, showBanners, bannerImage, accentColor, statsCardTheme, readmeStyle]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#3b82f6', '#8b5cf6'],
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'README.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const highlightMarkdownCode = (code: string) => {
    return code.split('\n').map((line, idx) => {
      if (line.startsWith('#')) return <div key={idx} className="text-blue-400 font-semibold">{line}</div>;
      if (line.startsWith('<!--') || line.startsWith('<p') || line.startsWith('<div')) return <div key={idx} className="text-zinc-550 italic">{line}</div>;
      if (line.includes('![') || line.includes('<img')) return <div key={idx} className="text-pink-400">{line}</div>;
      if (line.includes('[') && line.includes('](')) return <div key={idx} className="text-emerald-400">{line}</div>;
      if (line.startsWith('-') || line.startsWith('*')) return <div key={idx} className="text-violet-400">{line}</div>;
      return <div key={idx} className="text-zinc-350">{line || '\u00A0'}</div>;
    });
  };

  if (!username) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-[#030014]">
        <div className="h-16 w-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-zinc-650">
          <BookOpen className="h-8 w-8 animate-pulse text-indigo-500/50" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-300">Workspace Live Preview</h3>
          <p className="text-xs text-zinc-500 max-w-xs font-light leading-relaxed mt-1">
            Fetch a profile username and select templates to unlock the interactive live canvas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#030014] border-r border-white/5 relative">
      {/* Top Bar Workspace Controls */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/20 backdrop-blur-md shrink-0">
        <div className="flex gap-1.5 p-1 bg-zinc-900/60 border border-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'preview' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>GitHub Canvas</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'code' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Markdown Editor</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy</span>
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-650 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#030014]/60">
        {activeTab === 'preview' ? (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            
            {/* Realistic GitHub Profile replica header */}
            <div className="border-b border-zinc-800 bg-[#0d0c1d]/30 border border-white/5 rounded-2xl p-4.5">
              <div className="flex gap-6 overflow-x-auto">
                <button
                  onClick={() => setGithubTab('overview')}
                  className={`flex items-center gap-2 pb-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    githubTab === 'overview'
                      ? 'border-orange-500 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setGithubTab('repos')}
                  className={`flex items-center gap-2 pb-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    githubTab === 'repos'
                      ? 'border-orange-500 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Repositories</span>
                  {profile && (
                    <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 border border-white/5 text-[9px] text-zinc-450 font-mono">
                      {profile.publicRepos}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2 pb-3.5 text-xs font-semibold text-zinc-500 select-none">
                  <Package className="h-4 w-4" />
                  <span>Packages</span>
                </div>
                <div className="flex items-center gap-2 pb-3.5 text-xs font-semibold text-zinc-500 select-none">
                  <Activity className="h-4 w-4" />
                  <span>Projects</span>
                </div>
              </div>
            </div>

            {githubTab === 'overview' ? (
              /* GitHub Readme layout view */
              <div className="border border-zinc-800 bg-[#0d0a21]/20 rounded-2xl p-6 md:p-8 text-left shadow-inner relative">
                {/* Special GitHub Header banner */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-zinc-800 text-[11px] font-mono text-zinc-500">
                  <span>{username} / README.md</span>
                  <span className="text-[10px]">preview mode</span>
                </div>

                <article className="github-prose prose prose-invert max-w-none text-left leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ ...props }) => <h1 className="text-3xl font-extrabold pb-3 mb-6 border-b border-zinc-850 text-white tracking-tight" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-2xl font-bold pb-2 mt-8 mb-4 border-b border-zinc-850 text-white tracking-tight" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-lg font-semibold mt-6 mb-3 text-zinc-200" {...props} />,
                      p: ({ ...props }) => <p className="mb-4 text-zinc-300 text-xs md:text-sm leading-relaxed" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-zinc-350 text-xs md:text-sm" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-zinc-350 text-xs md:text-sm" {...props} />,
                      li: ({ ...props }) => <li className="pl-0.5" {...props} />,
                      code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !match ? (
                          <code className="bg-zinc-850 px-1.5 py-0.5 rounded text-pink-400 text-xs font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-zinc-950 p-4 rounded-xl border border-white/5 overflow-x-auto text-xs font-mono text-zinc-300">
                            <code>{children}</code>
                          </pre>
                        );
                      },
                      blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-zinc-700 pl-4 py-1 italic text-zinc-450 my-4" {...props} />
                      ),
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-6 border border-zinc-850 rounded-xl">
                          <table className="min-w-full divide-y divide-zinc-850 text-xs text-left" {...props} />
                        </div>
                      ),
                      th: ({ ...props }) => <th className="px-4 py-3 bg-zinc-900 text-zinc-350 font-bold uppercase tracking-wider" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 bg-zinc-900/30 text-zinc-400 border-t border-zinc-850" {...props} />,
                      a: ({ ...props }) => <a className="text-blue-400 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer" {...props} />,
                      img: ({ src, alt, ...props }) => {
                        if (!src || typeof src !== 'string') {
                          return (
                            <img className="max-w-full rounded-md inline-block my-2" src={src as any} alt={alt} {...props} />
                          );
                        }
                        
                        const isStatsDomain = src.includes('github-readme-stats.vercel.app') || src.includes('github-readme-stats.shion.dev');
                        
                        // 1. Check if it's the GitHub Stats Card
                        if (isStatsDomain && src.includes('/api') && !src.includes('top-langs') && !src.includes('/pin/')) {
                          return <StatsCardPreview stats={stats} username={username} />;
                        }

                        // 2. Check if it's the Top Languages Card
                        if (isStatsDomain && src.includes('/api/top-langs')) {
                          return <LanguagesCardPreview languages={languages} />;
                        }

                        // 3. Check if it's the Trophies Card
                        if (src.includes('github-profile-trophy.vercel.app')) {
                          return <TrophiesCardPreview stats={stats} profile={profile} />;
                        }

                        // 4. Check if it's a Repository Pin Card
                        if (isStatsDomain && src.includes('/api/pin/')) {
                          const repoName = new URLSearchParams(src.split('?')[1] || '').get('repo') || '';
                          return <RepositoryPinPreview repoName={repoName} topRepos={topRepos} />;
                        }

                        // Fallback to standard img tag
                        return (
                          <img className="max-w-full rounded-md inline-block my-2" src={src} alt={alt} {...props} />
                        );
                      }
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </article>
              </div>
            ) : (
              /* Repositories layout replica view */
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {topRepos.map((repo) => (
                  <div key={repo.name} className="p-5 bg-[#0d0c1d]/30 border border-white/5 rounded-2xl space-y-3 hover:border-zinc-850 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Bookmark className="h-4 w-4 text-zinc-500 shrink-0" />
                        <a 
                          href={repo.htmlUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-400 hover:underline truncate"
                        >
                          {repo.name}
                        </a>
                        <span className="text-[8px] font-bold border border-white/5 px-1.5 py-0.5 rounded-full text-zinc-500 tracking-wide uppercase shrink-0">
                          public
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light truncate-2-lines leading-relaxed">
                        {repo.description || 'No description available for this project.'}
                      </p>
                    </div>

                    <div className="flex gap-4 text-[10px] font-mono text-zinc-550 pt-2 border-t border-white/3">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full inline-block" 
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitPullRequest className="h-3 w-3" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Raw Markdown Editor with syntax highlighter */
          <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl relative">
            <div className="bg-zinc-900/80 border-b border-white/5 px-5 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
              <span className="text-[10px] text-zinc-550 font-mono">README.md</span>
              <div className="w-8" />
            </div>
            <pre className="p-6 text-left overflow-x-auto text-xs font-mono leading-relaxed bg-[#050508] max-h-[600px] overflow-y-auto">
              <code>{highlightMarkdownCode(markdown)}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Export modal wrapper */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        markdown={markdown}
      />
    </div>
  );
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
};

function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || '#cccccc';
}
