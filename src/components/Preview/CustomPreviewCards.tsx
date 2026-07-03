'use client';

import React from 'react';
import { 
  BookOpen, 
  GitPullRequest, 
  Star, 
  Bookmark, 
  Activity,
  GitCommit,
  GitFork,
  Flame,
  Calendar,
  Trophy,
  Terminal as TerminalIcon,
  Users,
  AlertCircle
} from 'lucide-react';
import { LanguageStat, GitHubRepo } from '@/types/github.types';
import { useBuilderStore } from '@/store/useBuilderStore';
import { THEME_PALETTES } from '@/lib/theme';
import { calculateRank } from '@/lib/githubFetcher';
import { cn } from '@/lib/utils';

export const hexToRgba = (hex: string, opacity: number) => {
  if (!hex) return '';
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) || 13;
  const g = parseInt(c.substring(2, 4), 16) || 12;
  const b = parseInt(c.substring(4, 6), 16) || 29;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper to resolve styles based on themes & custom configurations
function resolvePreviewStyles(config: any, themePalette: any, globalBgColor: string, globalBorderColor: string, globalOpacity: number) {
  const isNoBg = !!config.noBg;
  const isNoFrame = !!config.noFrame || !!config.hideBorder;

  const bgColor = isNoBg 
    ? 'transparent' 
    : (config.bgColor 
        ? hexToRgba(config.bgColor, globalOpacity) 
        : hexToRgba(themePalette.bg || globalBgColor, globalOpacity));

  const borderColor = isNoFrame 
    ? 'transparent' 
    : (config.borderColor || themePalette.border || globalBorderColor);

  const titleColor = config.titleColor || themePalette.title || '#818cf8';
  const textColor = config.textColor || themePalette.text || '#e4e4e7';
  const iconColor = config.iconColor || themePalette.icon || '#818cf8';
  const fireColor = config.fireColor || themePalette.fire || '#ff9d00';
  const ringColor = config.ringColor || themePalette.ring || '#818cf8';
  const strokeColor = config.strokeColor || themePalette.stroke || '#27272a';
  const borderRadius = config.borderRadius !== undefined ? `${config.borderRadius}px` : themePalette.borderRadius || '12px';
  const fontFamily = themePalette.fontFamily || 'sans-serif';
  const shadow = isNoFrame ? 'none' : themePalette.shadow || 'none';

  return {
    customStyle: {
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderRadius: borderRadius,
      color: textColor,
      fontFamily: fontFamily,
      boxShadow: shadow,
    },
    titleColor,
    textColor,
    iconColor,
    fireColor,
    ringColor,
    strokeColor,
  };
}

// --- STATS CARD PREVIEW ---
export const StatsCardPreview = ({ stats, username }: { stats: any; username: string }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity, sections, profile } = useBuilderStore();
  const statsSection = sections.find((s) => s.type === 'stats');
  const config = (statsSection?.config?.stats || {}) as any;

  if (!stats) return null;

  const themePalette = THEME_PALETTES[config.theme] || THEME_PALETTES.github_dark;
  const styles = resolvePreviewStyles(config, themePalette, cardBgColor, cardBorderColor, cardBgOpacity);
  
  const variant = config.variant || 'classic';
  const showIcons = config.showIcons !== false;
  const showLabels = config.showLabels !== false;
  const showIconDecorators = !!config.showIconDecorators;
  const compactMode = !!config.compactMode;
  const includePrivate = !!config.includeAllCommits;
  const hideRank = !!config.hideRank;

  // Filter repositories based on fork configuration
  const reposList = stats.rawReposData || [];
  const filteredRepos = config.includeForks ? reposList : reposList.filter((r: any) => !r.isFork);

  // Recalculate stars and count
  const starsCount = filteredRepos.reduce((acc: number, r: any) => acc + (r.stargazerCount || 0), 0);
  const commitsCount = includePrivate ? (stats.lifetimeCommits || stats.totalCommits) : stats.totalCommits;
  const prsCount = stats.totalPRs || 0;
  const issuesCount = stats.totalIssues || 0;
  const followersCount = profile?.followers || 0;
  const reposCount = config.includeForks ? reposList.length : profile?.publicRepos || 0;
  const contributedToCount = stats.contributedTo || 0;

  // Recalculate rank in real time
  const rank = calculateRank({
    commits: commitsCount,
    prs: prsCount,
    issues: issuesCount,
    stars: starsCount,
    followers: followersCount,
    repos: reposCount,
  });

  const fields = [
    { key: 'stars', label: 'Stars', value: starsCount, icon: Star },
    { key: 'commits', label: 'Commits', value: commitsCount, icon: GitCommit },
    { key: 'prs', label: 'PRs', value: prsCount, icon: GitPullRequest },
    { key: 'issues', label: 'Issues', value: issuesCount, icon: AlertCircle },
    { key: 'contributed', label: 'Contributed To', value: contributedToCount, icon: GitFork },
  ];

  const IconComponent = (f: any) => {
    const Icon = f.icon;
    if (showIconDecorators) {
      return (
        <span className="flex items-center justify-center p-1 rounded-md bg-white/5 border border-white/10" style={{ color: styles.iconColor }}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      );
    }
    return <Icon className="h-3.5 w-3.5" style={{ color: styles.iconColor }} />;
  };

  if (variant === 'classic') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="flex items-center gap-2 mb-4">
          {showIcons && <Star className="h-4.5 w-4.5" style={{ color: styles.iconColor }} />}
          <span className="text-sm font-bold font-mono" style={{ color: styles.titleColor }}>
            {username}'s GitHub Stats
          </span>
        </span>
        <span className="flex justify-between items-start gap-4">
          <span className="flex-1 flex flex-col gap-2.5">
            {fields.map((f) => (
              <span key={f.key} className="flex items-center justify-between max-w-[240px] border-b border-white/5 pb-1 block">
                <span className="flex items-center gap-2">
                  {showIcons && IconComponent(f)}
                  {showLabels && <span className="text-xs text-zinc-400 font-mono">{f.label}</span>}
                </span>
                <span className="text-xs font-bold font-mono" style={{ color: styles.titleColor }}>{f.value}</span>
              </span>
            ))}
          </span>
          {!hideRank && (
            <span className="relative flex items-center justify-center w-24 h-24 shrink-0 font-mono mt-2 block">
              <svg width="84" height="84" className="transform -rotate-90">
                <circle r="36" cx="42" cy="42" fill="transparent" stroke={hexToRgba(styles.textColor, 0.1)} strokeWidth="4" />
                <circle 
                  r="36" 
                  cx="42" 
                  cy="42" 
                  fill="transparent" 
                  stroke={styles.titleColor} 
                  strokeWidth="4" 
                  strokeDasharray="226" 
                  strokeDashoffset={226 - (226 * (100 - rank.percentile)) / 100} 
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xl font-black" style={{ color: styles.titleColor }}>{rank.grade}</span>
            </span>
          )}
        </span>
      </span>
    );
  }

  if (variant === 'grid') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="block text-sm font-bold mb-4 font-mono" style={{ color: styles.titleColor }}>Dashboard Summary</span>
        <span className={cn("grid gap-2.5 block", compactMode ? "grid-cols-3" : "grid-cols-2")}>
          {fields.concat(hideRank ? [] : [{ key: 'rank', label: 'Rank', value: rank.grade as any, icon: Trophy }]).map((f) => (
            <span key={f.key} className="p-3 rounded-lg border border-white/5 flex items-center justify-between bg-white/5">
              <span className="flex flex-col gap-1">
                {showLabels && <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{f.label}</span>}
                <span className="text-sm font-extrabold font-mono" style={{ color: styles.titleColor }}>{f.value}</span>
              </span>
              {showIcons && IconComponent(f)}
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'horizontal') {
    return (
      <span 
        style={styles.customStyle}
        className="block border text-white max-w-md mx-auto my-4 p-4 shadow-lg font-sans text-left transition-all duration-300"
      >
        <span className="flex items-center justify-between gap-4 block">
          <span className="flex flex-col">
            <span className="text-xs font-black truncate max-w-[120px] font-mono" style={{ color: styles.titleColor }}>{username}</span>
            <span className="text-[9px] text-zinc-500 font-mono">Developer Profile</span>
          </span>
          <span className="flex items-center gap-3">
            {fields.map((f) => (
              <span key={f.key} className="flex flex-col items-center gap-1 inline-block">
                {showIcons && <f.icon className="h-3.5 w-3.5" style={{ color: styles.iconColor }} />}
                <span className="text-xs font-extrabold font-mono" style={{ color: styles.titleColor }}>{f.value}</span>
                {showLabels && <span className="text-[8px] text-zinc-400 font-mono">{f.label}</span>}
              </span>
            ))}
            {!hideRank && (
              <span className="border-l border-white/10 pl-3 flex flex-col items-center inline-block">
                <span className="text-[8px] text-zinc-500 font-mono">Rank</span>
                <span className="text-base font-black font-mono" style={{ color: styles.titleColor }}>{rank.grade}</span>
              </span>
            )}
          </span>
        </span>
      </span>
    );
  }

  if (variant === 'dashboard') {
    const commitsGoal = 5000;
    const progressPercent = Math.min((commitsCount / commitsGoal) * 100, 100);
    return (
      <span 
        style={styles.customStyle}
        className="block border text-white max-w-lg mx-auto my-4 p-6 shadow-xl font-sans text-left transition-all duration-300"
      >
        <span className="flex justify-between items-center border-b border-white/10 pb-3 mb-4 block">
          <span className="flex flex-col">
            <span className="text-base font-black font-mono" style={{ color: styles.titleColor }}>{username}</span>
            <span className="text-[10px] text-zinc-500 font-mono">Created {new Date(profile?.createdAt || '').getFullYear()} • Active Developer</span>
          </span>
          {!hideRank && (
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold border" style={{ color: styles.titleColor, borderColor: styles.titleColor, backgroundColor: `${styles.titleColor}15` }}>
              {rank.grade} Rank (Top {rank.percentile.toFixed(1)}%)
            </span>
          )}
        </span>
        <span className="grid grid-cols-5 gap-3 block">
          <span className="col-span-3 flex flex-col gap-2">
            {fields.map((f) => (
              <span key={f.key} className="flex justify-between items-center pb-1 border-b border-white/5 block">
                <span className="flex items-center gap-2">
                  {showIcons && <f.icon className="h-3.5 w-3.5" style={{ color: styles.iconColor }} />}
                  {showLabels && <span className="text-xs text-zinc-400 font-mono">{f.label}</span>}
                </span>
                <span className="text-xs font-bold font-mono" style={{ color: styles.titleColor }}>{f.value}</span>
              </span>
            ))}
          </span>
          <span className="col-span-2 p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col justify-center items-center text-center block">
            {showIcons && <GitCommit className="h-5 w-5 animate-pulse" style={{ color: styles.iconColor }} />}
            <span className="text-[10px] text-zinc-400 font-mono mt-2">Commit Rate</span>
            <span className="text-sm font-black font-mono mt-1" style={{ color: styles.titleColor }}>
              {commitsCount > 5000 ? 'Master' : (commitsCount > 1000 ? 'Active' : 'Growing')}
            </span>
            <span className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3 block">
              <span className="h-full block" style={{ width: `${progressPercent}%`, backgroundColor: styles.titleColor }} />
            </span>
          </span>
        </span>
      </span>
    );
  }

  if (variant === 'terminal') {
    return (
      <span 
        style={{ ...styles.customStyle, borderColor: styles.titleColor, backgroundColor: '#050505', fontFamily: 'monospace' }}
        className="block border max-w-md mx-auto my-4 p-5 shadow-lg text-left font-mono"
      >
        <span className="flex gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-zinc-500 ml-2 font-mono">bash - stats.sh</span>
        </span>
        <span className="block text-xs font-mono" style={{ color: styles.titleColor }}>$ ./fetch_stats.sh --user @{username}</span>
        <span className="block text-xs text-zinc-500 font-mono mt-1">Retrieving developer payload...</span>
        <span className="block text-xs mt-3 space-y-1 font-mono" style={{ color: styles.titleColor }}>
          {fields.map((f) => (
            <div key={f.key} className="font-mono">
              [+] {f.label.padEnd(16)} : <span className="font-bold text-white font-mono">{f.value}</span>
            </div>
          ))}
          {!hideRank && (
            <div className="font-mono">
              [+] Global RankGrade   : <span className="font-bold text-white bg-white/10 px-1 font-mono">{rank.grade}</span>
            </div>
          )}
        </span>
      </span>
    );
  }

  return null;
};

// --- STREAK CARD PREVIEW ---
export const StreakCardPreview = ({ streak }: { streak: any }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity, sections } = useBuilderStore();
  const streakSection = sections.find((s) => s.type === 'streak');
  const config = (streakSection?.config?.streak || {}) as any;

  if (!streak) return null;

  const themePalette = THEME_PALETTES[config.theme] || THEME_PALETTES.github_dark;
  const styles = resolvePreviewStyles(config, themePalette, cardBgColor, cardBorderColor, cardBgOpacity);

  const variant = config.variant || 'classic';
  const showFireIcon = config.showFireIcon !== false;
  const showDateRanges = config.showDateRanges !== false;
  const showLabels = config.showLabels !== false;
  const compactMode = !!config.compactMode;
  
  const flameEmoji = config.flameStyle === 'lightning' ? '⚡' : (config.flameStyle === 'star' ? '⭐' : '🔥');

  const metrics = [
    { key: 'total', label: 'Total Contributions', value: streak.totalContributions, icon: Calendar, color: styles.iconColor },
    { key: 'current', label: 'Current Streak', value: `${streak.currentStreak} Days`, icon: Flame, color: styles.fireColor },
    { key: 'longest', label: 'Longest Streak', value: `${streak.longestStreak} Days`, icon: Trophy, color: styles.ringColor },
  ];

  if (variant === 'classic') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="flex items-center gap-2 mb-4">
          {showFireIcon && <span className="text-base">{flameEmoji}</span>}
          <span className="text-sm font-bold font-mono" style={{ color: styles.titleColor }}>Streak Metrics</span>
        </span>
        <span className="flex justify-around items-center block">
          {metrics.map((m, idx) => (
            <span key={m.key} className={cn("text-center flex flex-col items-center block", idx > 0 ? "border-l border-white/5 pl-4" : "")}>
              {showFireIcon && (m.key === 'current' ? <span className="text-xl">{flameEmoji}</span> : <m.icon className="h-4.5 w-4.5" style={{ color: m.color }} />)}
              <span className="text-lg font-extrabold font-mono mt-1" style={{ color: m.color }}>{m.value}</span>
              {showLabels && <span className="text-[10px] text-zinc-400 font-mono mt-1">{m.label}</span>}
              {showDateRanges && m.key !== 'total' && <span className="text-[8px] text-zinc-600 font-mono mt-0.5">Active Period</span>}
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'vertical') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="block text-sm font-bold mb-4 font-mono" style={{ color: styles.titleColor }}>Activity Stack</span>
        <span className="flex flex-col gap-2.5 block">
          {metrics.map((m) => (
            <span key={m.key} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-lg">
              <span className="flex items-center gap-2">
                {showFireIcon && (m.key === 'current' ? <span className="text-base">{flameEmoji}</span> : <m.icon className="h-4 w-4" style={{ color: m.color }} />)}
                {showLabels && <span className="text-xs text-zinc-400 font-mono">{m.label}</span>}
              </span>
              <span className="text-sm font-extrabold font-mono" style={{ color: m.color }}>{m.value}</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <span 
        style={styles.customStyle}
        className="block border text-white max-w-md mx-auto my-4 p-3 shadow-lg font-sans text-left transition-all duration-300"
      >
        <span className="flex justify-around items-center block">
          {metrics.map((m) => (
            <span key={m.key} className="flex items-center gap-1.5 inline-block">
              {showFireIcon && (m.key === 'current' ? <span className="text-base">{flameEmoji}</span> : <m.icon className="h-3.5 w-3.5" style={{ color: m.color }} />)}
              <span className="flex flex-col">
                <span className="text-xs font-black font-mono" style={{ color: m.color }}>{String(m.value).split(' ')[0]}</span>
                {showLabels && <span className="text-[8px] text-zinc-500 font-mono">{m.label.replace(' Streak', '').replace(' Contributions', '')}</span>}
              </span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'graph') {
    return (
      <span 
        style={styles.customStyle}
        className="block border text-white max-w-md mx-auto my-4 p-5 shadow-lg font-sans text-left transition-all duration-300"
      >
        <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>{flameEmoji} Heatmap Graph</span>
        <span className="flex flex-col gap-3 justify-center items-center py-2 block">
          <span className="text-center block">
            <span className="text-2xl font-black font-mono block" style={{ color: styles.fireColor }}>{streak.currentStreak} Days</span>
            {showLabels && <span className="text-[10px] text-zinc-400 font-mono">Longest Active: {streak.longestStreak} Days</span>}
          </span>
          <span className="flex gap-1.5 justify-center block">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-sm block" style={{ backgroundColor: i % 4 === 0 ? styles.fireColor : (i % 2 === 0 ? styles.iconColor : styles.strokeColor) }} />
            ))}
          </span>
        </span>
      </span>
    );
  }

  if (variant === 'neon') {
    return (
      <span 
        style={{ ...styles.customStyle, borderColor: styles.fireColor, backgroundColor: '#050505', fontFamily: 'monospace' }}
        className="block border max-w-md mx-auto my-4 p-5 shadow-lg text-left font-mono text-[#fbbf24]"
      >
        <span className="flex gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-zinc-500 ml-2 font-mono">bash - streak_health.sh</span>
        </span>
        <span className="block text-xs font-mono" style={{ color: styles.fireColor }}>$ cat /proc/git/streak</span>
        <span className="block text-xs mt-3 space-y-1.5 font-mono" style={{ color: styles.fireColor }}>
          {metrics.map((m) => (
            <div key={m.key} className="font-mono">
              [STREAK] {m.label.padEnd(20)} : <span className="font-extrabold text-white font-mono">{m.value}</span>
            </div>
          ))}
        </span>
      </span>
    );
  }

  return null;
};

// --- LANGUAGES CARD PREVIEW ---
export const LanguagesCardPreview = ({ languages }: { languages: LanguageStat[] }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity, sections } = useBuilderStore();
  const langsSection = sections.find((s) => s.type === 'languages');
  const config = (langsSection?.config?.languages || {}) as any;

  if (!languages) return null;

  const themePalette = THEME_PALETTES[config.theme] || THEME_PALETTES.github_dark;
  const styles = resolvePreviewStyles(config, themePalette, cardBgColor, cardBorderColor, cardBgOpacity);

  const variant = config.variant || 'classic';
  const hideProgress = !!config.hideProgress;
  const showPercentages = config.showPercentages !== false;
  const showIcons = config.showIcons !== false;
  const compactMode = !!config.compactMode;
  const langsCount = config.langsCount !== undefined ? config.langsCount : 5;

  // Process data with exclusions
  const excluded = config.excludeLanguages || [];
  const filtered = languages.filter(l => !excluded.includes(l.name));
  const slicedLangs = filtered.slice(0, langsCount);

  // Recalculate percentages of sliced subset
  const subsetSum = slicedLangs.reduce((acc, l) => acc + l.bytes, 0);
  const processedLangs = slicedLangs.map(l => ({
    ...l,
    percentage: subsetSum > 0 ? parseFloat(((l.bytes / subsetSum) * 100).toFixed(1)) : 0
  }));

  if (variant === 'classic') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>Top Languages</span>
        <span className="flex flex-col gap-4 block">
          {!hideProgress && (
            <span className="w-full h-2.5 rounded-full overflow-hidden flex bg-black/25 block">
              {processedLangs.map((lang) => (
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
          )}
          <span className="grid grid-cols-2 gap-3 block">
            {processedLangs.map((lang) => (
              <span key={lang.name} className="flex items-center gap-2 block">
                {showIcons && <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: lang.color }} />}
                <span className="text-xs font-bold font-mono" style={{ color: styles.textColor }}>{lang.name}</span>
                {showPercentages && <span className="text-xs text-zinc-500 font-mono ml-auto">{lang.percentage}%</span>}
              </span>
            ))}
          </span>
        </span>
      </span>
    );
  }

  if (variant === 'donut') {
    const radius = 30;
    const circ = 2 * Math.PI * radius;
    let accumPercent = 0;

    return (
      <span 
        style={styles.customStyle}
        className="block border text-white max-w-md mx-auto my-4 p-5 shadow-lg font-sans text-left transition-all duration-300 flex items-center justify-between"
      >
        <div style={{ flex: 1.2 }}>
          <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>Top Languages</span>
          <div className="flex flex-col gap-2.5">
            {processedLangs.slice(0, 4).map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-xs font-mono">
                {showIcons && <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: lang.color }} />}
                <span>{lang.name}</span>
                {showPercentages && <span className="text-zinc-500 ml-auto">{lang.percentage}%</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 0.8 }} className="flex justify-center items-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="transform rotate-90">
            {processedLangs.map((lang) => {
              const strokeDash = (lang.percentage / 100) * circ;
              const strokeOffset = (accumPercent / 100) * circ;
              accumPercent += lang.percentage;
              return (
                <circle
                  key={lang.name}
                  r={radius}
                  cx="50"
                  cy="50"
                  fill="transparent"
                  stroke={lang.color}
                  strokeWidth="10"
                  strokeDasharray={`${strokeDash} ${circ - strokeDash}`}
                  strokeDashoffset={-strokeOffset}
                  className="transition-all duration-500"
                />
              );
            })}
            <circle r={radius - 5} cx="50" cy="50" fill={themePalette.bg || cardBgColor} />
            <text x="50" y="54" transform="rotate(270 50 50)" fontSize="9" fontWeight="bold" textAnchor="middle" fill={styles.titleColor} className="font-mono">{processedLangs.length} Langs</text>
          </svg>
        </div>
      </span>
    );
  }

  if (variant === 'grid') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="block text-sm font-bold mb-4 font-mono" style={{ color: styles.titleColor }}>Languages Grid</span>
        <span className="grid grid-cols-2 gap-2.5 block">
          {processedLangs.slice(0, 4).map((lang) => (
            <span 
              key={lang.name} 
              style={{ backgroundColor: `${lang.color}15`, borderColor: `${lang.color}30` }}
              className="p-3 border rounded-lg flex flex-col justify-center"
            >
              <span className="flex items-center gap-1.5">
                {showIcons && <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: lang.color }} />}
                <span className="text-xs font-bold truncate w-full" style={{ color: styles.textColor }}>{lang.name}</span>
              </span>
              <span className="flex items-center justify-between mt-2 block">
                {showPercentages && <span className="text-[10px] text-zinc-500 font-mono">{lang.percentage}%</span>}
                <span className="w-12 bg-white/10 h-1 rounded-full overflow-hidden block">
                  <span className="h-full block" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
                </span>
              </span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'list') {
    return (
      <span 
        style={styles.customStyle}
        className={cn(
          "block border text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300",
          compactMode ? "p-4" : "p-6"
        )}
      >
        <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>Top Codebases</span>
        <span className="flex flex-col gap-2.5 block">
          {processedLangs.map((lang) => (
            <span key={lang.name} className="flex items-center gap-3 block">
              {showIcons && <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: lang.color }} />}
              <span className="text-xs font-bold font-mono shrink-0 w-20">{lang.name}</span>
              <span className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden block">
                <span className="h-full block" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
              </span>
              {showPercentages && <span className="text-xs text-zinc-500 font-mono w-10 text-right">{lang.percentage}%</span>}
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'waffle') {
    const waffleSquares: string[] = [];
    processedLangs.forEach(lang => {
      const count = Math.round(lang.percentage);
      for (let i = 0; i < count && waffleSquares.length < 100; i++) {
        waffleSquares.push(lang.color || '#cccccc');
      }
    });
    while (waffleSquares.length < 100) {
      waffleSquares.push('#444444');
    }
    return (
      <span 
        style={styles.customStyle}
        className="block border p-5 text-white max-w-md mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300 flex items-center gap-5"
      >
        <span className="grid grid-cols-10 gap-0.5 shrink-0 block">
          {waffleSquares.map((c, i) => (
            <span key={i} className="w-3.5 h-3.5 rounded-[1px] block" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span className="flex flex-col gap-1.5 w-full">
          <span className="block text-xs font-black font-mono mb-2" style={{ color: styles.titleColor }}>Waffle Breakdown</span>
          {processedLangs.slice(0, 4).map((lang) => (
            <span key={lang.name} className="flex items-center justify-between text-[10px] font-mono block">
              <span className="flex items-center gap-1.5 truncate max-w-[80px]">
                <span className="w-2 h-2 rounded-[1px] block" style={{ backgroundColor: lang.color }} />
                <span className="truncate">{lang.name}</span>
              </span>
              <span className="text-zinc-500">{lang.percentage}%</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'cloud') {
    return (
      <span 
        style={styles.customStyle}
        className="block border p-5 text-white max-w-md mx-auto my-4 shadow-lg font-sans text-center transition-all duration-300"
      >
        <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>Language Cloud</span>
        <span className="flex flex-wrap gap-2.5 justify-center items-center block py-2">
          {processedLangs.map((lang) => {
            const fontSize = Math.max(11, Math.min(22, 11 + lang.percentage * 0.4));
            return (
              <span 
                key={lang.name} 
                style={{ color: lang.color, fontSize: `${fontSize}px` }} 
                className="font-black inline-block m-1 hover:scale-115 transition-transform"
              >
                {lang.name}{showPercentages && ` (${lang.percentage}%)`}
              </span>
            );
          })}
        </span>
      </span>
    );
  }

  return null;
};

// --- TROPHY DISPLAY SYSTEM ---
const TrophyIcon = ({ rank, color }: { rank: string; color: string }) => {
  const hasCrown = rank === 'SSS';
  const hasGlow = rank === 'S' || rank === 'SS' || rank === 'SSS';
  const isGradient = color.startsWith('linear-gradient') || color.includes('gradient');
  const fill = isGradient ? `url(#preview-grad-${rank})` : color;

  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10 mx-auto drop-shadow-md" style={{ filter: hasGlow ? `drop-shadow(0 0 6px ${isGradient ? '#ec4899' : color}aa)` : 'none' }}>
      <defs>
        {isGradient && (
          <linearGradient id={`preview-grad-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {rank === 'SSS' ? (
              <>
                <stop offset="0%" stopColor="#ff007f" />
                <stop offset="50%" stopColor="#7f00ff" />
                <stop offset="100%" stopColor="#00ffff" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </>
            )}
          </linearGradient>
        )}
      </defs>
      {hasCrown && (
        <path d="M38 22 L44 30 L50 18 L56 30 L62 22 L60 36 L40 36 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      )}
      <path d="M32 38 C32 50, 68 50, 68 38 L63 60 C58 66, 42 66, 37 60 Z" fill={fill} />
      <path d="M32 40 C24 40, 24 48, 32 50" fill="none" stroke={fill} strokeWidth="3" />
      <path d="M68 40 C76 40, 76 48, 68 50" fill="none" stroke={fill} strokeWidth="3" />
      <path d="M48 60 L52 60 L54 75 L46 75 Z" fill={fill} />
      <rect x="38" y="75" width="24" height="6" rx="2" fill={fill} />
    </svg>
  );
};

// --- TROPHIES CARD PREVIEW ---
export const TrophiesCardPreview = ({ stats, profile }: { stats: any; profile: any }) => {
  const { cardBgColor, cardBorderColor, cardBgOpacity, sections } = useBuilderStore();
  const trophySection = sections.find((s) => s.type === 'trophies');
  const config = (trophySection?.config?.trophies || {}) as any;

  if (!profile) return null;
  
  const themePalette = THEME_PALETTES[config.theme] || THEME_PALETTES.github_dark;
  const styles = resolvePreviewStyles(config, themePalette, cardBgColor, cardBorderColor, cardBgOpacity);

  const variant = config.variant || 'classic';
  const columnCount = config.columnCount || 3;
  const rankFilter = config.rankFilter || '';
  const showProgress = config.showProgress !== false;
  const showNextRank = config.showNextRank !== false;
  const showCategoryLabels = config.showCategoryLabels !== false;
  const includeUnranked = config.includeUnranked !== false;
  const compactMode = !!config.compactMode;

  const totalStars = config.includeForks 
    ? (stats?.rawReposData || []).reduce((acc: number, r: any) => acc + (r.stargazerCount || 0), 0)
    : (stats?.totalStars || 0);

  const commits = config.includeAllCommits 
    ? (stats?.lifetimeCommits || stats?.totalCommits || 0) 
    : (stats?.totalCommits || 0);

  const followers = profile.followers || 0;
  const repos = config.includeForks ? (stats?.rawReposData || []).length : profile.publicRepos || 0;
  const prs = stats?.totalPRs || 0;
  const reviews = stats?.totalPRReviews || 0;
  const issues = stats?.totalIssues || 0;

  // Calculate experience in years
  const ageYears = profile.createdAt 
    ? Math.max(1, Math.round((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 3600 * 24 * 365.25)))
    : 1;

  // Achievements score
  const achievementsCount = (totalStars >= 100 ? 1 : 0) + (followers >= 50 ? 1 : 0) + (commits >= 2000 ? 1 : 0) + (prs >= 100 ? 1 : 0) + (issues >= 100 ? 1 : 0) + (reviews >= 10 ? 1 : 0);

  const thresholds = {
    Stars: { SSS: 10000, SS: 5000, S: 1000, "A+": 500, A: 200, B: 50, C: 10 },
    Followers: { SSS: 10000, SS: 5000, S: 1000, "A+": 500, A: 100, B: 50, C: 10 },
    Commits: { SSS: 20000, SS: 10000, S: 5000, "A+": 2000, A: 1000, B: 500, C: 100 },
    Repositories: { SSS: 500, SS: 200, S: 100, "A+": 50, A: 30, B: 15, C: 5 },
    PRs: { SSS: 1000, SS: 500, S: 250, "A+": 100, A: 50, B: 25, C: 5 },
    Reviews: { SSS: 500, SS: 300, S: 100, "A+": 50, A: 25, B: 10, C: 2 },
    Issues: { SSS: 2000, SS: 1000, S: 500, "A+": 250, A: 100, B: 25, C: 5 },
    Experience: { SSS: 15, SS: 10, S: 7, "A+": 5, A: 3, B: 2, C: 1 },
    Achievements: { SSS: 6, SS: 5, S: 4, "A+": 3, A: 2, B: 1, C: 0 },
  };

  const trophyKeys: Array<keyof typeof thresholds> = [
    'Stars', 'Followers', 'Commits', 'Repositories', 'PRs', 'Reviews', 'Issues', 'Experience', 'Achievements'
  ];

  const valueMap = {
    Stars: totalStars,
    Followers: followers,
    Commits: commits,
    Repositories: repos,
    PRs: prs,
    Reviews: reviews,
    Issues: issues,
    Experience: ageYears,
    Achievements: achievementsCount
  };

  const getTrophyStatus = (val: number, thresholds: { SSS: number; SS: number; S: number; "A+": number; A: number; B: number; C: number }) => {
    let currentRank = 'Unranked';
    let nextRank = 'C';
    let nextVal = thresholds.C;
    let progress = 0;
    let color = '#a1a1aa'; // default zinc

    if (val >= thresholds.SSS) {
      currentRank = 'SSS';
      nextRank = 'MAX';
      nextVal = thresholds.SSS;
      progress = 100;
      color = 'linear-gradient(135deg, #ff007f, #7f00ff, #00ffff)'; // holographic
    } else if (val >= thresholds.SS) {
      currentRank = 'SS';
      nextRank = 'SSS';
      nextVal = thresholds.SSS;
      progress = ((val - thresholds.SS) / (thresholds.SSS - thresholds.SS)) * 100;
      color = 'linear-gradient(135deg, #ec4899, #a855f7)'; // mythic
    } else if (val >= thresholds.S) {
      currentRank = 'S';
      nextRank = 'SS';
      nextVal = thresholds.SS;
      progress = ((val - thresholds.S) / (thresholds.SS - thresholds.S)) * 100;
      color = '#3b82f6'; // diamond blue
    } else if (val >= thresholds['A+']) {
      currentRank = 'A+';
      nextRank = 'S';
      nextVal = thresholds.S;
      progress = ((val - thresholds['A+']) / (thresholds.S - thresholds['A+'])) * 100;
      color = '#94a3b8'; // platinum silver
    } else if (val >= thresholds.A) {
      currentRank = 'A';
      nextRank = 'A+';
      nextVal = thresholds['A+'];
      progress = ((val - thresholds.A) / (thresholds['A+'] - thresholds.A)) * 100;
      color = '#eab308'; // gold
    } else if (val >= thresholds.B) {
      currentRank = 'B';
      nextRank = 'A';
      nextVal = thresholds.A;
      progress = ((val - thresholds.B) / (thresholds.A - thresholds.B)) * 100;
      color = '#cbd5e1'; // silver
    } else if (val >= thresholds.C) {
      currentRank = 'C';
      nextRank = 'B';
      nextVal = thresholds.B;
      progress = ((val - thresholds.C) / (thresholds.B - thresholds.C)) * 100;
      color = '#b45309'; // bronze
    } else {
      progress = (val / thresholds.C) * 100;
    }

    return {
      rank: currentRank,
      nextRank,
      nextVal,
      progress: Math.min(100, Math.max(0, progress)),
      color,
    };
  };

  const allTrophies = trophyKeys.map(k => {
    const val = valueMap[k];
    const status = getTrophyStatus(val, thresholds[k]);
    return {
      id: k,
      title: `${k} Trophy`,
      value: val,
      rank: status.rank,
      nextRank: status.nextRank,
      nextVal: status.nextVal,
      progress: status.progress,
      color: status.color,
    };
  });

  // Filters
  const selectedList = config.selectedTrophies || [];
  let filteredTrophies = selectedList.length > 0 
    ? allTrophies.filter(tr => selectedList.includes(tr.id))
    : allTrophies;

  if (!includeUnranked) {
    filteredTrophies = filteredTrophies.filter(tr => tr.rank !== 'Unranked');
  }

  if (rankFilter) {
    const filters = rankFilter.split(',').map((x: string) => x.trim().toUpperCase());
    filteredTrophies = filteredTrophies.filter(t => filters.includes(t.rank.toUpperCase()));
  }

  if (config.limitTrophiesCount && config.limitTrophiesCount > 0) {
    filteredTrophies = filteredTrophies.slice(0, config.limitTrophiesCount);
  }

  if (variant === 'classic') {
    const columnsClass = columnCount === 2 
      ? 'grid-cols-2' 
      : (columnCount === 4 ? 'grid-cols-4' : (columnCount === 5 ? 'grid-cols-5' : (columnCount === 6 ? 'grid-cols-6' : 'grid-cols-3')));

    return (
      <span 
        style={styles.customStyle}
        className="block border p-5 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
      >
        {showCategoryLabels && (
          <span className="block text-sm font-bold mb-4 font-mono" style={{ color: styles.titleColor }}>
            Achievements Board
          </span>
        )}
        <span className={`grid gap-3 block ${columnsClass}`}>
          {filteredTrophies.map((tr) => (
            <span key={tr.id} className={cn("bg-zinc-900/60 border border-white/5 rounded-lg text-center flex flex-col justify-between items-center shadow block hover:scale-105 transition-transform duration-200", compactMode ? "p-2" : "p-4")}>
              <span className="text-[9px] text-zinc-400 uppercase font-mono mb-1">{tr.id}</span>
              <TrophyIcon rank={tr.rank} color={tr.color} />
              <span className="text-xs font-black font-mono mt-2" style={{ color: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color }}>{tr.rank}</span>
              <span className="text-xs font-bold font-mono mt-0.5 text-zinc-350">{tr.value}</span>
              {showProgress && tr.rank !== 'SSS' && tr.rank !== 'Unranked' && (
                <span className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2.5 block">
                  <span className="h-full block" style={{ width: `${tr.progress}%`, backgroundColor: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color }} />
                </span>
              )}
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'badges') {
    const columnsClass = columnCount === 2 
      ? 'grid-cols-2' 
      : (columnCount === 4 ? 'grid-cols-4' : (columnCount === 5 ? 'grid-cols-5' : 'grid-cols-3'));
    return (
      <span 
        style={styles.customStyle}
        className="block border p-5 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
      >
        {showCategoryLabels && <span className="block text-sm font-bold mb-4 font-mono" style={{ color: styles.titleColor }}>Achievement Badges</span>}
        <span className={`grid gap-4 block ${columnsClass} text-center`}>
          {filteredTrophies.map((tr) => (
            <span key={tr.id} className="flex flex-col items-center justify-center inline-block">
              <span className={cn("rounded-full border-2 flex items-center justify-center relative shrink-0 block", compactMode ? "w-10 h-10" : "w-14 h-14")} style={{ borderColor: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color, backgroundColor: `${tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color}15` }}>
                <TrophyIcon rank={tr.rank} color={tr.color} />
                <span className="absolute bottom-[-3px] right-[-3px] bg-black text-white text-[7px] font-black border rounded-md px-1" style={{ borderColor: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color }}>{tr.rank}</span>
              </span>
              <span className="text-[9px] font-bold mt-2 truncate w-14 block" style={{ color: styles.textColor }}>{tr.id}</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'ribbon') {
    return (
      <span 
        style={styles.customStyle}
        className="block border p-4 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300"
      >
        {showCategoryLabels && <span className="block text-sm font-bold mb-3 font-mono" style={{ color: styles.titleColor }}>Honorary Ribbons</span>}
        <span className="flex flex-col gap-2.5 block">
          {filteredTrophies.map((tr) => (
            <span key={tr.id} className="flex items-center justify-between p-2.5 rounded-r-lg border-l-4 block" style={{ borderLeftColor: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color, backgroundColor: `${tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color}0a` }}>
              <span className="flex items-center gap-2">
                <span className="text-base">🏅</span>
                <span className="text-xs font-bold font-mono text-white">{tr.id} Achievement Award</span>
              </span>
              <span className="text-xs font-black font-mono" style={{ color: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color }}>{tr.rank} ({tr.value})</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'minimal') {
    return (
      <span 
        style={styles.customStyle}
        className="block border p-4 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-center transition-all duration-300"
      >
        <span className="grid grid-cols-2 gap-2 block">
          {filteredTrophies.map((tr) => (
            <span key={tr.id} className="flex justify-between items-center p-2.5 bg-white/5 border border-white/5 rounded-md">
              <span className="text-xs text-zinc-400 font-mono">{tr.id}</span>
              <span className="text-xs font-bold font-mono" style={{ color: tr.color.startsWith('linear-gradient') ? '#ec4899' : tr.color }}>[{tr.rank}] {tr.value}</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (variant === 'podium') {
    const sorted = [...filteredTrophies].sort((a, b) => {
      const ranks = ['SSS', 'SS', 'S', 'A+', 'A', 'B', 'C', 'Unranked'];
      return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
    });

    const podiums = [
      sorted[1] || null, // 2nd
      sorted[0] || null, // 1st
      sorted[2] || null, // 3rd
    ];

    return (
      <span 
        style={styles.customStyle}
        className="block border p-5 text-white max-w-lg mx-auto my-4 shadow-lg font-sans text-left transition-all duration-300 flex flex-col justify-between"
      >
        {showCategoryLabels && <span className="block text-sm font-bold text-center mb-4 font-mono" style={{ color: styles.titleColor }}>Trophy Podium</span>}
        <span className="flex justify-center items-end gap-4 flex-1 block mt-2">
          {/* 2nd Place */}
          {podiums[0] && (
            <span className="flex flex-col items-center inline-block">
              <TrophyIcon rank={podiums[0].rank} color={podiums[0].color} />
              <span className="text-[9px] text-zinc-400 font-mono mt-1 w-14 truncate text-center block">{podiums[0].id}</span>
              <span className="w-14 h-12 bg-white/5 border border-white/10 rounded-t-md flex items-center justify-center font-black font-mono mt-2" style={{ color: podiums[0].color.startsWith('linear-gradient') ? '#ec4899' : podiums[0].color }}>2nd</span>
            </span>
          )}
          {/* 1st Place */}
          {podiums[1] && (
            <span className="flex flex-col items-center inline-block">
              <TrophyIcon rank={podiums[1].rank} color={podiums[1].color} />
              <span className="text-[9px] text-zinc-400 font-mono mt-1 w-14 truncate text-center block">{podiums[1].id}</span>
              <span className="w-16 h-18 bg-white/10 border border-white/20 rounded-t-md flex items-center justify-center font-black font-mono mt-2 text-lg" style={{ color: podiums[1].color.startsWith('linear-gradient') ? '#ec4899' : podiums[1].color }}>1st</span>
            </span>
          )}
          {/* 3rd Place */}
          {podiums[2] && (
            <span className="flex flex-col items-center inline-block">
              <TrophyIcon rank={podiums[2].rank} color={podiums[2].color} />
              <span className="text-[9px] text-zinc-400 font-mono mt-1 w-14 truncate text-center block">{podiums[2].id}</span>
              <span className="w-14 h-9 bg-white/5 border border-white/10 rounded-t-md flex items-center justify-center font-black font-mono mt-2" style={{ color: podiums[2].color.startsWith('linear-gradient') ? '#ec4899' : podiums[2].color }}>3rd</span>
            </span>
          )}
        </span>
      </span>
    );
  }

  return null;
};

// --- REPOSITORY PIN PREVIEW ---
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
        <span className="block text-[10px] text-zinc-500 mt-1">Repository is private or loading...</span>
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
      <span className="flex gap-4 text-[10px] font-mono text-zinc-500 mt-3 pt-2 border-t border-white/5 block">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#3178c6' }} />
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
