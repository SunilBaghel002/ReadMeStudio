'use client';

import React from 'react';
import { 
  BookOpen, 
  GitPullRequest, 
  Star, 
  Bookmark, 
  Activity,
  GitCommit,
  GitFork
} from 'lucide-react';
import { LanguageStat, GitHubRepo } from '@/types/github.types';
import { useBuilderStore } from '@/store/useBuilderStore';

export const hexToRgba = (hex: string, opacity: number) => {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) || 13;
  const g = parseInt(c.substring(2, 4), 16) || 12;
  const b = parseInt(c.substring(4, 6), 16) || 29;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const StatsCardPreview = ({ stats, username }: { stats: any; username: string }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity } = useBuilderStore();
  if (!stats) return null;
  
  const customStyle = {
    backgroundColor: hexToRgba(cardBgColor, cardBgOpacity),
    borderColor: cardBorderColor,
  };

  return (
    <span 
      style={customStyle}
      className="block border rounded-xl p-5 text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
    >
      <span className="flex items-center gap-2 mb-4">
        <Activity className="h-4.5 w-4.5 text-indigo-400" />
        <span className="text-sm font-bold text-indigo-350 font-mono">{username}'s GitHub Stats</span>
      </span>
      <span className="grid grid-cols-2 gap-4 text-xs block">
        <span className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> Stars</span>
          <span className="font-bold font-mono text-yellow-400">{stats.totalStars}</span>
        </span>
        <span className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><GitCommit className="h-3.5 w-3.5 text-blue-400" /> Commits</span>
          <span className="font-bold font-mono">{stats.totalCommits}</span>
        </span>
        <span className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><GitPullRequest className="h-3.5 w-3.5 text-purple-400" /> PRs</span>
          <span className="font-bold font-mono">{stats.totalPRs}</span>
        </span>
        <span className="flex justify-between border-b border-white/5 pb-1.5">
          <span className="text-zinc-400 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Repos</span>
          <span className="font-bold font-mono">{stats.totalReposCreated}</span>
        </span>
      </span>
    </span>
  );
};

export const LanguagesCardPreview = ({ languages }: { languages: LanguageStat[] }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity } = useBuilderStore();
  if (!languages || languages.length === 0) return null;

  const customStyle = {
    backgroundColor: hexToRgba(cardBgColor, cardBgOpacity),
    borderColor: cardBorderColor,
  };

  return (
    <span 
      style={customStyle}
      className="block border rounded-xl p-5 text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
    >
      <span className="block text-sm font-bold text-indigo-300 mb-4 font-mono">Most Used Languages</span>
      <span className="space-y-3.5 block">
        <span className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-900 block">
          {languages.map((lang) => (
            <span
              key={lang.name}
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
              className="h-full block"
            />
          ))}
        </span>
        <span className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs block">
          {languages.map((lang) => (
            <span key={lang.name} className="flex items-center gap-2 block">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-zinc-350 font-mono truncate">{lang.name}</span>
              <span className="text-zinc-550 font-mono ml-auto">{lang.percentage}%</span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
};

export const TrophiesCardPreview = ({ stats, profile }: { stats: any; profile: any }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity } = useBuilderStore();
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

  const customStyle = {
    backgroundColor: hexToRgba(cardBgColor, cardBgOpacity),
    borderColor: cardBorderColor,
  };

  return (
    <span 
      style={customStyle}
      className="block border rounded-xl p-5 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
    >
      <span className="block text-sm font-bold text-indigo-300 mb-4 font-mono">GitHub Profile Trophies</span>
      <span className="grid grid-cols-2 sm:grid-cols-4 gap-3 block">
        {trophies.map((tr) => (
          <span key={tr.title} className="p-3 bg-zinc-900/60 border border-white/5 rounded-lg text-center flex flex-col justify-between items-center shadow block">
            <span className="text-[10px] text-zinc-400 uppercase font-mono mb-1">{tr.title}</span>
            <span className={`block text-xl font-black bg-gradient-to-r ${tr.color} bg-clip-text text-transparent my-1`}>
              {tr.grade}
            </span>
            <span className="text-xs font-bold font-mono text-zinc-350">{tr.value}</span>
          </span>
        ))}
      </span>
    </span>
  );
};

export const RepositoryPinPreview = ({ repoName, topRepos }: { repoName: string; topRepos: GitHubRepo[] }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity } = useBuilderStore();
  const repo = topRepos.find(r => r.name.toLowerCase() === repoName.toLowerCase());

  const customStyle = {
    backgroundColor: hexToRgba(cardBgColor, cardBgOpacity),
    borderColor: cardBorderColor,
  };

  if (!repo) {
    return (
      <span 
        style={customStyle}
        className="block border rounded-xl p-4 text-white max-w-sm my-2 shadow-md inline-block text-left font-sans mr-3 w-80 transition-all duration-300"
      >
        <span className="flex items-center gap-2 block">
          <Bookmark className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-blue-400 truncate">{repoName}</span>
        </span>
        <span className="block text-[10px] text-zinc-550 mt-1">Repository is private or loading...</span>
      </span>
    );
  }

  return (
    <span 
      style={customStyle}
      className="block border rounded-xl p-4 text-white max-w-sm my-2 shadow-md inline-block text-left font-sans mr-3 w-80 transition-all duration-300"
    >
      <span className="flex items-center justify-between block">
        <span className="flex items-center gap-2 truncate block">
          <Bookmark className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-blue-400 truncate">
            {repo.name}
          </span>
        </span>
      </span>
      <span className="block text-[10px] text-zinc-400 mt-2 line-clamp-2 min-h-[30px] leading-relaxed">
        {repo.description || 'No description available for this project.'}
      </span>
      <span className="flex gap-4 text-[10px] font-mono text-zinc-550 mt-3 pt-2 border-t border-white/3 block">
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
      </span>
    </span>
  );
};
