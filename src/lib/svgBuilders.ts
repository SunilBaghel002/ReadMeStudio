import { ThemePalette, THEME_PALETTES } from './theme';
import { calculateRank } from './githubFetcher';

const ICONS = {
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  commit: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="8" y2="12" stroke="currentColor" stroke-width="2"/><line x1="16" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>',
  pr: '<circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 15V9a4 4 0 0 0-4-4H9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" stroke-width="2"/>',
  issue: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>',
  repo: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="currentColor" stroke-width="2"/>',
  followers: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2"/>',
  contributions: '<circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 15V9a4 4 0 0 0-4-4H9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="6" y1="9" x2="6" y2="15" stroke="currentColor" stroke-width="2"/>',
  fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="currentColor"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>',
  terminal: '<polyline points="4 17 10 11 4 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="19" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 22h16" stroke="currentColor" stroke-width="2"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4.8 2.68 6.5h8.64A9 9 0 0 0 19 9a7 7 0 0 0-7-7z" fill="none" stroke="currentColor" stroke-width="2"/>'
};

function getIcon(name: keyof typeof ICONS, color: string | undefined, className = '') {
  const iconColor = color || 'currentColor';
  return `<svg viewBox="0 0 24 24" width="16" height="16" style="color: ${iconColor}; fill: none;" class="${className}">${ICONS[name]}</svg>`;
}

// Resolve colors and styles based on user configurations and theme presets
function resolveColors(theme: string, config: any): ThemePalette {
  const palette = THEME_PALETTES[theme] || THEME_PALETTES.github_dark;
  return {
    bg: config.bgColor || palette.bg,
    title: config.titleColor || palette.title,
    text: config.textColor || palette.text,
    textSecondary: palette.textSecondary,
    icon: config.iconColor || palette.icon,
    border: config.borderColor || palette.border,
    accent: palette.accent,
    numberColor: palette.numberColor,
    borderRadius: config.borderRadius !== undefined ? `${config.borderRadius}px` : palette.borderRadius,
    shadow: palette.shadow,
    fontFamily: palette.fontFamily,
    pattern: palette.pattern,
    fire: config.fireColor || palette.fire || palette.title,
    ring: config.ringColor || palette.ring || palette.title,
    stroke: config.strokeColor || palette.stroke || palette.border,
  };
}

// Generate Common Styles incorporating card patterns and responsive details
function getCommonStyles(colors: ThemePalette, hideBorder: boolean, borderRadiusOverride?: number, isTerminal = false) {
  const borderRule = hideBorder ? 'border: none;' : `border: 1px solid ${colors.border};`;
  const fontFam = isTerminal ? 'font-family: Consolas, Monaco, "Andale Mono", monospace;' : `font-family: ${colors.fontFamily};`;
  const bRadius = borderRadiusOverride !== undefined ? `${borderRadiusOverride}px` : colors.borderRadius;
  const shadowRule = colors.shadow && colors.shadow !== 'none' && !hideBorder ? `box-shadow: ${colors.shadow};` : '';

  // Background pattern CSS injection
  let patternBg = '';
  if (colors.pattern === 'dots') {
    patternBg = `background-image: radial-gradient(${colors.border}55 1px, transparent 1px); background-size: 10px 10px;`;
  } else if (colors.pattern === 'grid') {
    patternBg = `background-image: linear-gradient(${colors.border}22 1px, transparent 1px), linear-gradient(90deg, ${colors.border}22 1px, transparent 1px); background-size: 16px 16px;`;
  }

  return `
    .card-container {
      background-color: ${colors.bg};
      ${patternBg}
      border-radius: ${bRadius};
      ${borderRule}
      ${shadowRule}
      box-sizing: border-box;
      color: ${colors.text};
      ${fontFam}
      padding: 24px;
      position: relative;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: ${colors.title};
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-label {
      font-size: 12px;
      color: ${colors.text};
      opacity: 0.85;
    }
    .stat-value {
      font-size: 13px;
      font-weight: 700;
      color: ${colors.title};
    }
    .icon-decorator {
      background-color: ${colors.border}22;
      border-radius: 6px;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .glassmorphic {
      background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(8px);
    }
  `;
}

// --- STATS SVG BUILDER ---
export function buildStatsSVG(data: any, config: any): string {
  const colors = resolveColors(config.theme, config);
  const variant = config.variant || 'classic';
  const hideBorder = !!config.hideBorder;
  const showIcons = config.showIcons !== false;
  const showLabels = config.showLabels !== false;
  const showIconDecorators = !!config.showIconDecorators;
  const compactMode = !!config.compactMode;
  const includePrivate = !!config.includeAllCommits;
  const hideRank = !!config.hideRank;
  const borderRadius = config.borderRadius !== undefined ? config.borderRadius : 12;

  // Filter repositories based on fork configuration
  const reposList = data.rawReposData || [];
  const filteredRepos = config.includeForks ? reposList : reposList.filter((r: any) => !r.isFork);

  // Recalculate stars and count
  const starsCount = filteredRepos.reduce((acc: number, r: any) => acc + (r.stargazerCount || 0), 0);
  const commitsCount = includePrivate ? (data.stats.lifetimeCommits || data.stats.totalCommits) : data.stats.totalCommits;
  const prsCount = data.stats.totalPRs || 0;
  const issuesCount = data.stats.totalIssues || 0;
  const followersCount = data.profile.followers || 0;
  const reposCount = config.includeForks ? reposList.length : data.profile.publicRepos;
  const contributedToCount = data.stats.contributedTo || 0;

  const rank = calculateRank({
    commits: commitsCount,
    prs: prsCount,
    issues: issuesCount,
    stars: starsCount,
    followers: followersCount,
    repos: reposCount,
  });

  const fields = [
    { key: 'stars', label: 'Stars', value: starsCount, icon: 'star' },
    { key: 'commits', label: 'Commits', value: commitsCount, icon: 'commit' },
    { key: 'prs', label: 'PRs', value: prsCount, icon: 'pr' },
    { key: 'issues', label: 'Issues', value: issuesCount, icon: 'issue' },
    { key: 'contributed', label: 'Contributed To', value: contributedToCount, icon: 'contributions' },
  ];

  let width = 450;
  let height = 240;
  let svgContent = '';

  if (variant === 'classic') {
    height = compactMode ? 195 : 245;
    const spacing = compactMode ? 26 : 32;

    const rankCircle = hideRank ? '' : `
      <g transform="translate(340, ${compactMode ? '50' : '65'})" style="font-family: -apple-system, sans-serif;">
        <circle r="34" cx="34" cy="42" fill="none" stroke="${colors.border}" stroke-width="4" />
        <circle r="34" cx="34" cy="42" fill="none" stroke="${colors.title}" stroke-width="4" stroke-dasharray="213" stroke-dashoffset="${213 - (213 * (100 - rank.percentile)) / 100}" transform="rotate(-90 34 42)" />
        <text x="34" y="48" font-size="20" font-weight="900" text-anchor="middle" fill="${colors.title}">${rank.grade}</text>
      </g>
    `;

    svgContent = `
      <div class="card-container" style="height: ${height}px;">
        <h3 class="card-title">${showIcons ? getIcon('star', colors.icon) : ''} ${data.profile.name}'s Stats</h3>
        <div style="display: flex; justify-content: space-between;">
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            ${fields.map(f => `
              <div style="display: flex; align-items: center; justify-content: space-between; max-width: 250px; border-bottom: 1px solid ${colors.border}22; padding-bottom: 4px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  ${showIcons ? (showIconDecorators ? `<span class="icon-decorator">${getIcon(f.icon as any, colors.icon)}</span>` : getIcon(f.icon as any, colors.icon)) : ''}
                  ${showLabels ? `<span class="stat-label">${f.label}</span>` : ''}
                </div>
                <span class="stat-value">${f.value}</span>
              </div>
            `).join('')}
          </div>
          <svg width="100" height="120" style="margin-right: 20px;">
            ${rankCircle}
          </svg>
        </div>
      </div>
    `;
  } else if (variant === 'grid') {
    height = compactMode ? 170 : 255;
    const gridCols = compactMode ? 'grid-template-columns: repeat(3, 1fr);' : 'grid-template-columns: repeat(2, 1fr);';
    svgContent = `
      <div class="card-container glassmorphic" style="height: ${height}px;">
        <h3 class="card-title">${showIcons ? getIcon('star', colors.icon) : ''} Stats Dashboard</h3>
        <div style="display: grid; ${gridCols} gap: 10px;">
          ${fields.concat(hideRank ? [] : [{ key: 'rank', label: 'Global Rank', value: rank.grade as any, icon: 'trophy' }]).map(f => `
            <div style="background-color: ${colors.border}15; padding: 10px; border-radius: 8px; border: 1px solid ${colors.border}30; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                ${showLabels ? `<span class="stat-label" style="font-size: 9px; opacity: 0.7; text-transform: uppercase;">${f.label}</span>` : ''}
                <span class="stat-value" style="font-size: 14px; font-weight: 800;">${f.value}</span>
              </div>
              ${showIcons ? getIcon(f.icon as any, colors.icon, showIconDecorators ? 'icon-decorator' : '') : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'horizontal') {
    height = 90;
    width = 500;
    svgContent = `
      <div class="card-container" style="height: ${height}px; padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 100%;">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 12px; font-weight: 800; color: ${colors.title};">${data.profile.name}</span>
            <span style="font-size: 9px; opacity: 0.6;">GitHub Stats</span>
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            ${fields.map(f => `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
                ${showIcons ? getIcon(f.icon as any, colors.icon) : ''}
                <span style="font-size: 11px; font-weight: bold; color: ${colors.title};">${f.value}</span>
                ${showLabels ? `<span class="stat-label" style="font-size: 8px; opacity: 0.7;">${f.label}</span>` : ''}
              </div>
            `).join('')}
            ${hideRank ? '' : `
              <div style="display: flex; flex-direction: column; align-items: center; border-left: 1px solid ${colors.border}; padding-left: 10px;">
                <span style="font-size: 8px; opacity: 0.7;">Rank</span>
                <span style="font-size: 16px; font-weight: 900; color: ${colors.title};">${rank.grade}</span>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  } else if (variant === 'dashboard') {
    width = 540;
    height = 280;
    const commitsGoal = 5000;
    const progressWidth = Math.min((commitsCount / commitsGoal) * 100, 100);
    svgContent = `
      <div class="card-container" style="height: ${height}px; background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${colors.border}40; padding-bottom: 10px; margin-bottom: 14px;">
          <div>
            <h3 style="margin: 0; font-size: 15px; color: ${colors.title};">${data.profile.name}</h3>
            <p style="margin: 2px 0 0 0; font-size: 9px; opacity: 0.6;">Account Created ${new Date(data.profile.createdAt).getFullYear()} • Level Tracker</p>
          </div>
          ${hideRank ? '' : `<span style="padding: 3px 8px; border-radius: 20px; background-color: ${colors.title}22; border: 1px solid ${colors.title}; color: ${colors.title}; font-size: 11px; font-weight: 800;">${rank.grade} Rank (${(100 - rank.percentile).toFixed(1)}%)</span>`}
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 15px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${fields.map(f => `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 11px;">
                  ${showIcons ? getIcon(f.icon as any, colors.icon) : ''}
                  ${showLabels ? `<span>${f.label}</span>` : ''}
                </div>
                <span style="font-weight: bold; color: ${colors.title}; font-size: 11px;">${f.value}</span>
              </div>
            `).join('')}
          </div>
          <div style="background-color: ${colors.border}15; border-radius: 8px; border: 1px solid ${colors.border}30; padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            ${showIcons ? getIcon('commit', colors.icon) : ''}
            <span style="font-size: 10px; opacity: 0.7; margin-top: 6px;">Commit Status</span>
            <span style="font-size: 14px; font-weight: 800; color: ${colors.title}; margin-top: 2px;">${commitsCount > 5000 ? 'Elite Code' : (commitsCount > 1000 ? 'Active' : 'Growing')}</span>
            <div style="width: 80%; background-color: ${colors.border}40; height: 4px; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div style="width: ${progressWidth}%; height: 100%; background-color: ${colors.title};"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (variant === 'terminal') {
    height = 220;
    svgContent = `
      <div class="card-container" style="height: ${height}px; border: 1px solid ${colors.title}; font-family: monospace;">
        <div style="display: flex; gap: 6px; margin-bottom: 10px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #ff5f56;"></span>
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #ffbd2e;"></span>
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: #27c93f;"></span>
          <span style="font-size: 9px; opacity: 0.5; margin-left: 6px;">bash - stats.sh</span>
        </div>
        <p style="margin: 2px 0; font-size: 11px; color: ${colors.title};">$ ./fetch_stats.sh --user ${data.profile.username}</p>
        <p style="margin: 2px 0; font-size: 10px; opacity: 0.6;">Fetching profile data from GitHub...</p>
        <div style="margin-top: 8px; font-size: 11px; color: ${colors.title}; line-height: 1.4;">
          ${fields.map(f => `
            <div>[+] ${f.label.padEnd(16)} : <span style="font-weight: bold; color: #ffffff;">${f.value}</span></div>
          `).join('')}
          ${hideRank ? '' : `<div>[+] Global RankGrade   : <span style="font-weight: bold; color: #ffffff; background-color: ${colors.title}55; padding: 0 4px;">${rank.grade}</span></div>`}
        </div>
      </div>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      ${getCommonStyles(colors, hideBorder, borderRadius, variant === 'terminal')}
    </style>
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <div xmlns="http://www.w3.org/1999/xhtml">
        ${svgContent}
      </div>
    </foreignObject>
  </svg>`;
}

// --- STREAK SVG BUILDER ---
export function buildStreakSVG(data: any, config: any): string {
  const colors = resolveColors(config.theme, config);
  const variant = config.variant || 'classic';
  const hideBorder = !!config.hideBorder;
  const showFireIcon = config.showFireIcon !== false;
  const showDateRanges = config.showDateRanges !== false;
  const showLabels = config.showLabels !== false;
  const compactMode = !!config.compactMode;
  const borderRadius = config.borderRadius !== undefined ? config.borderRadius : 12;

  const streak = data.streak || { currentStreak: 0, longestStreak: 0, totalContributions: 0 };
  const flameEmoji = config.flameStyle === 'lightning' ? '⚡' : (config.flameStyle === 'star' ? '⭐' : '🔥');

  const metrics = [
    { key: 'total', label: 'Total Contributions', value: streak.totalContributions, icon: 'calendar', color: colors.icon },
    { key: 'current', label: 'Current Streak', value: `${streak.currentStreak} Days`, icon: 'fire', color: colors.fire },
    { key: 'longest', label: 'Longest Streak', value: `${streak.longestStreak} Days`, icon: 'trophy', color: colors.ring },
  ];

  let width = 450;
  let height = 180;
  let svgContent = '';

  if (variant === 'classic') {
    height = compactMode ? 140 : 180;
    svgContent = `
      <div class="card-container" style="height: ${height}px; display: flex; flex-direction: column; justify-content: center;">
        <h3 class="card-title" style="margin-bottom: 20px;">
          ${showFireIcon ? `<span style="font-size: 16px; margin-right: 4px;">${flameEmoji}</span>` : ''} 
          Streak Records
        </h3>
        <div style="display: flex; justify-content: space-around; align-items: center;">
          ${metrics.map((m, idx) => `
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; ${idx > 0 ? `border-left: 1px solid ${colors.border}40; padding-left: 16px;` : ''}">
              ${showFireIcon ? (m.icon === 'fire' ? `<span style="font-size: 20px;">${flameEmoji}</span>` : getIcon(m.icon as any, m.color)) : ''}
              <span style="font-size: 18px; font-weight: 800; margin-top: 4px; color: ${m.color};">${m.value}</span>
              ${showLabels ? `<span class="stat-label" style="font-size: 10px; opacity: 0.8; margin-top: 2px;">${m.label}</span>` : ''}
              ${showDateRanges && m.key !== 'total' ? `<span style="font-size: 8px; opacity: 0.5; margin-top: 2px;">Active Period</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'vertical') {
    height = compactMode ? 180 : 250;
    svgContent = `
      <div class="card-container" style="height: ${height}px; display: flex; flex-direction: column; justify-content: space-between;">
        <h3 class="card-title">${showFireIcon ? flameEmoji : ''} Activity Stack</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${metrics.map(m => `
            <div style="display: flex; align-items: center; justify-content: space-between; background-color: ${colors.border}15; padding: 10px 14px; border-radius: 8px; border: 1px solid ${colors.border}22;">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${showFireIcon ? (m.icon === 'fire' ? `<span style="font-size: 16px;">${flameEmoji}</span>` : getIcon(m.icon as any, m.color)) : ''}
                ${showLabels ? `<span class="stat-label" style="font-size: 12px; font-weight: bold;">${m.label}</span>` : ''}
              </div>
              <span style="font-size: 14px; font-weight: 800; color: ${m.color};">${m.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'compact') {
    height = 90;
    width = 460;
    svgContent = `
      <div class="card-container" style="height: ${height}px; padding: 12px; display: flex; align-items: center; justify-content: space-around;">
        ${metrics.map(m => `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${showFireIcon ? (m.icon === 'fire' ? `<span style="font-size: 14px;">${flameEmoji}</span>` : getIcon(m.icon as any, m.color)) : ''}
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 11px; font-weight: 800; color: ${m.color};">${m.value.split(' ')[0]}</span>
              ${showLabels ? `<span style="font-size: 8px; opacity: 0.6;">${m.label.replace(' Streak', '').replace(' Contributions', '')}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (variant === 'graph') {
    height = 190;
    svgContent = `
      <div class="card-container" style="height: ${height}px;">
        <h3 class="card-title">${flameEmoji} Contribution Graph</h3>
        <div style="display: flex; flex-direction: column; gap: 12px; justify-content: center; height: calc(100% - 40px);">
          <div style="text-align: center;">
            <span style="font-size: 26px; font-weight: 900; color: ${colors.fire};">${streak.currentStreak} Days Current</span>
            ${showLabels ? `<p style="margin: 4px 0 0 0; font-size: 10px; opacity: 0.6;">Max: ${streak.longestStreak} Days Streak</p>` : ''}
          </div>
          <!-- Sparkline representation -->
          <div style="display: flex; gap: 3px; align-items: center; justify-content: center; margin-top: 8px;">
            ${Array.from({ length: 24 }).map((_, i) => `
              <span style="width: 10px; height: 10px; border-radius: 2px; background-color: ${i % 4 === 0 ? colors.fire : (i % 2 === 0 ? colors.icon : colors.border)}; display: inline-block;"></span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (variant === 'neon') {
    height = 180;
    const neonBorder = `border: 2px solid ${colors.fire}; box-shadow: 0 0 15px ${colors.fire}aa, inset 0 0 10px ${colors.fire}22;`;
    svgContent = `
      <div class="card-container" style="height: ${height}px; ${neonBorder} background-color: #05050a;">
        <h3 class="card-title" style="color: ${colors.fire}; font-family: monospace; text-shadow: 0 0 5px ${colors.fire};">${flameEmoji} NEON STREAK ACTIVE</h3>
        <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 15px;">
          ${metrics.map(m => `
            <div style="text-align: center;">
              <span style="font-size: 20px; font-weight: 900; color: ${m.color}; font-family: monospace; text-shadow: 0 0 8px ${m.color};">${m.value.split(' ')[0]}</span>
              ${showLabels ? `<span style="display: block; font-size: 9px; color: #ffffff; opacity: 0.7; margin-top: 4px; text-transform: uppercase;">${m.label.replace(' Contributions', '')}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      ${getCommonStyles(colors, hideBorder, borderRadius, variant === 'neon')}
    </style>
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <div xmlns="http://www.w3.org/1999/xhtml">
        ${svgContent}
      </div>
    </foreignObject>
  </svg>`;
}

// --- LANGUAGES SVG BUILDER ---
export function buildLanguagesSVG(data: any, config: any): string {
  const colors = resolveColors(config.theme, config);
  const variant = config.variant || 'classic';
  const hideBorder = !!config.hideBorder;
  const hideProgress = !!config.hideProgress;
  const showPercentages = config.showPercentages !== false;
  const showIcons = config.showIcons !== false;
  const compactMode = !!config.compactMode;
  const langsCount = config.langsCount !== undefined ? config.langsCount : 5;
  const borderRadius = config.borderRadius !== undefined ? config.borderRadius : 12;

  // Process data with exclusions
  const languagesList: any[] = data.languages || [];
  const excluded = config.excludeLanguages || [];
  const filtered = languagesList.filter(l => !excluded.includes(l.name));
  const slicedLangs = filtered.slice(0, langsCount);

  // Recalculate percentages of sliced subset
  const subsetSum = slicedLangs.reduce((acc, l) => acc + l.bytes, 0);
  const processedLangs = slicedLangs.map(l => ({
    ...l,
    percentage: subsetSum > 0 ? parseFloat(((l.bytes / subsetSum) * 100).toFixed(1)) : 0
  }));

  let width = 450;
  let height = 240;
  let svgContent = '';

  if (variant === 'classic') {
    height = compactMode ? 180 : 240;
    svgContent = `
      <div class="card-container" style="height: ${height}px;">
        <h3 class="card-title">Top Languages</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${!hideProgress ? `
            <div style="display: flex; height: 8px; border-radius: 4px; overflow: hidden; background-color: ${colors.border}44; width: 100%;">
              ${processedLangs.map(l => `<div style="width: ${l.percentage}%; background-color: ${l.color || '#cccccc'}; height: 100%;"></div>`).join('')}
            </div>
          ` : ''}
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px;">
            ${processedLangs.map(l => `
              <div style="display: flex; align-items: center; gap: 6px;">
                ${showIcons ? `<span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${l.color || '#cccccc'}; display: inline-block;"></span>` : ''}
                <span class="stat-label" style="font-size: 11px; font-weight: 600;">${l.name}</span>
                ${showPercentages ? `<span style="font-size: 10px; opacity: 0.6; margin-left: auto;">${l.percentage}%</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (variant === 'donut') {
    height = compactMode ? 160 : 220;
    const radius = 30;
    const circ = 2 * Math.PI * radius;
    let accumPercent = 0;

    const donutSegments = processedLangs.map(l => {
      const strokeDash = (l.percentage / 100) * circ;
      const strokeOffset = (accumPercent / 100) * circ;
      accumPercent += l.percentage;
      return `<circle r="${radius}" cx="50" cy="50" fill="transparent" stroke="${l.color || '#ccc'}" stroke-width="10" stroke-dasharray="${strokeDash} ${circ - strokeDash}" stroke-dashoffset="-${strokeOffset}" transform="rotate(-90 50 50)"/>`;
    }).join('');

    svgContent = `
      <div class="card-container" style="height: ${height}px; display: flex; align-items: center; justify-content: space-between;">
        <div style="flex: 1.2;">
          <h3 class="card-title">Top Languages</h3>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${processedLangs.slice(0, 4).map(l => `
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px;">
                ${showIcons ? `<span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${l.color || '#cccccc'};"></span>` : ''}
                <span>${l.name}</span>
                ${showPercentages ? `<span style="opacity: 0.6; margin-left: auto;">${l.percentage}%</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        <div style="flex: 0.8; display: flex; justify-content: center; align-items: center;">
          <svg width="100" height="100" viewBox="0 0 100 100">
            ${donutSegments}
            <circle r="${radius - 5}" cx="50" cy="50" fill="${colors.bg}"/>
            <text x="50" y="53" font-size="9" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="${colors.title}">${processedLangs.length} Langs</text>
          </svg>
        </div>
      </div>
    `;
  } else if (variant === 'grid') {
    height = compactMode ? 170 : 230;
    svgContent = `
      <div class="card-container glassmorphic" style="height: ${height}px;">
        <h3 class="card-title">Languages Grid</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${processedLangs.slice(0, 4).map(l => `
            <div style="background-color: ${colors.border}15; padding: 10px; border-radius: 6px; border: 1px solid ${colors.border}22; display: flex; flex-direction: column; justify-content: center;">
              <div style="display: flex; align-items: center; gap: 6px;">
                ${showIcons ? `<span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${l.color || '#cccccc'};"></span>` : ''}
                <span style="font-size: 11px; font-weight: bold;">${l.name}</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                ${showPercentages ? `<span style="font-size: 10px; opacity: 0.7;">${l.percentage}%</span>` : ''}
                <div style="width: 50px; background-color: ${colors.border}40; height: 4px; border-radius: 2px; overflow: hidden;">
                  <div style="width: ${l.percentage}%; height: 100%; background-color: ${l.color || colors.title};"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'list') {
    height = compactMode ? 180 : 250;
    svgContent = `
      <div class="card-container" style="height: ${height}px;">
        <h3 class="card-title">Language List</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${processedLangs.map(l => `
            <div style="display: flex; align-items: center; gap: 10px;">
              ${showIcons ? `<span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${l.color || '#cccccc'}; shrink: 0;"></span>` : ''}
              <span style="font-size: 11px; font-weight: 600; width: 80px; shrink: 0;">${l.name}</span>
              <div style="flex: 1; background-color: ${colors.border}33; height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="width: ${l.percentage}%; height: 100%; background-color: ${l.color || colors.title};"></div>
              </div>
              ${showPercentages ? `<span style="font-size: 11px; opacity: 0.6; text-align: right; width: 40px;">${l.percentage}%</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'waffle') {
    height = 240;
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

    svgContent = `
      <div class="card-container" style="height: ${height}px; display: flex; gap: 20px; align-items: center;">
        <div style="flex: 1; display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px;">
          ${waffleSquares.map(c => `<div style="width: 12px; height: 12px; border-radius: 1px; background-color: ${c};"></div>`).join('')}
        </div>
        <div style="width: 150px; display: flex; flex-direction: column; gap: 6px;">
          <h4 style="margin: 0 0 6px 0; font-size: 12px; color: ${colors.title};">Waffle Ratio</h4>
          ${processedLangs.slice(0, 4).map(l => `
            <div style="display: flex; align-items: center; gap: 6px; font-size: 10px;">
              <span style="width: 6px; height: 6px; border-radius: 1px; background-color: ${l.color || '#cccccc'};"></span>
              <span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 80px;">${l.name}</span>
              <span style="margin-left: auto; opacity: 0.7;">${l.percentage}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'cloud') {
    height = 200;
    svgContent = `
      <div class="card-container" style="height: ${height}px; text-align: center;">
        <h3 class="card-title" style="justify-content: center;">Language Cloud</h3>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px; margin-top: 12px; height: calc(100% - 50px); overflow: hidden;">
          ${processedLangs.map(l => {
            const fontSize = Math.max(10, Math.min(24, 10 + l.percentage * 0.5));
            return `<span style="font-size: ${fontSize}px; color: ${l.color || colors.title}; font-weight: 800; margin: 4px; display: inline-block;">${l.name}${showPercentages ? ` (${l.percentage}%)` : ''}</span>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      ${getCommonStyles(colors, hideBorder, borderRadius)}
    </style>
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <div xmlns="http://www.w3.org/1999/xhtml">
        ${svgContent}
      </div>
    </foreignObject>
  </svg>`;
}

// --- TROPHIES SVG BUILDER ---
function getTrophyStatus(val: number, thresholds: { SSS: number; SS: number; S: number; "A+": number; A: number; B: number; C: number }) {
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
    color = '#f59e0b'; // legendary gold
  } else if (val >= thresholds.SS) {
    currentRank = 'SS';
    nextRank = 'SSS';
    nextVal = thresholds.SSS;
    progress = ((val - thresholds.SS) / (thresholds.SSS - thresholds.SS)) * 100;
    color = '#ec4899'; // mythic pink
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
}

function getTrophyIconSVG(rank: string, color: string): string {
  const hasCrown = rank === 'SSS';
  const hasGlow = rank === 'S' || rank === 'SS' || rank === 'SSS';
  const fill = color.startsWith('linear-gradient') ? 'url(#grad-' + rank + ')' : color;

  return `
    <svg viewBox="0 0 100 100" width="36" height="36" style="display: block; margin: 0 auto;">
      <defs>
        ${color.startsWith('linear-gradient') ? `
          <linearGradient id="grad-${rank}" x1="0%" y1="0%" x2="100%" y2="100%">
            ${rank === 'SSS' ? `
              <stop offset="0%" stop-color="#ff007f" />
              <stop offset="50%" stop-color="#7f00ff" />
              <stop offset="100%" stop-color="#00ffff" />
            ` : `
              <stop offset="0%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="#a855f7" />
            `}
          </linearGradient>
        ` : ''}
        ${hasGlow ? `
          <filter id="glow-${rank}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        ` : ''}
      </defs>
      ${hasCrown ? `
        <!-- Crown -->
        <path d="M38 22 L44 30 L50 18 L56 30 L62 22 L60 36 L40 36 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
      ` : ''}
      <!-- Cup -->
      <path d="M32 38 C32 50, 68 50, 68 38 L63 60 C58 66, 42 66, 37 60 Z" fill="${fill}" ${hasGlow ? `filter="url(#glow-${rank})"` : ''} />
      <!-- Handles -->
      <path d="M32 40 C24 40, 24 48, 32 50" fill="none" stroke="${fill}" stroke-width="3" />
      <path d="M68 40 C76 40, 76 48, 68 50" fill="none" stroke="${fill}" stroke-width="3" />
      <!-- Stem -->
      <path d="M48 60 L52 60 L54 75 L46 75 Z" fill="${fill}" />
      <!-- Base -->
      <rect x="38" y="75" width="24" height="6" rx="2" fill="${fill}" />
    </svg>
  `;
}

export function buildTrophiesSVG(data: any, config: any): string {
  const colors = resolveColors(config.theme, config);
  const variant = config.variant || 'classic';
  const noBg = !!config.noBg;
  const noFrame = !!config.noFrame;
  const columnCount = config.columnCount || 3;
  const marginW = config.marginW || 0;
  const marginH = config.marginH || 0;
  const rankFilter = config.rankFilter || '';
  const showProgress = config.showProgress !== false;
  const showNextRank = config.showNextRank !== false;
  const showCategoryLabels = config.showCategoryLabels !== false;
  const includeUnranked = config.includeUnranked !== false;
  const compactMode = !!config.compactMode;
  const borderRadius = config.borderRadius !== undefined ? config.borderRadius : 12;

  // Retrieve accurate metric values
  const totalStars = config.includeForks 
    ? (data.rawReposData || []).reduce((acc: number, r: any) => acc + (r.stargazerCount || 0), 0)
    : (data.stats.totalStars || 0);

  const commits = config.includeAllCommits 
    ? (data.stats.lifetimeCommits || data.stats.totalCommits) 
    : data.stats.totalCommits;

  const followers = data.profile.followers || 0;
  const repos = config.includeForks ? (data.rawReposData || []).length : data.profile.publicRepos;
  const prs = data.stats.totalPRs || 0;
  const reviews = data.stats.totalPRReviews || 0;
  const issues = data.stats.totalIssues || 0;

  // Calculate experience in years
  const ageYears = data.profile.createdAt 
    ? Math.max(1, Math.round((Date.now() - new Date(data.profile.createdAt).getTime()) / (1000 * 3600 * 24 * 365.25)))
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

  // Compile list of achievements
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
  let filtered = selectedList.length > 0 
    ? allTrophies.filter(t => selectedList.includes(t.id))
    : allTrophies;

  if (!includeUnranked) {
    filtered = filtered.filter(t => t.rank !== 'Unranked');
  }

  if (rankFilter) {
    const filters = rankFilter.split(',').map((x: string) => x.trim().toUpperCase());
    filtered = filtered.filter(t => filters.includes(t.rank.toUpperCase()));
  }

  // Trophies limit count
  if (config.limitTrophiesCount && config.limitTrophiesCount > 0) {
    filtered = filtered.slice(0, config.limitTrophiesCount);
  }

  let width = 500;
  let height = 240;
  let svgContent = '';

  const cardBg = noBg ? 'transparent' : colors.bg;
  const cardBorder = noFrame ? 'none' : `1px solid ${colors.border}`;

  if (variant === 'classic') {
    const cols = `grid-template-columns: repeat(${columnCount}, 1fr);`;
    // dynamically size height based on counts and columns
    const rows = Math.ceil(filtered.length / columnCount);
    height = 60 + rows * (compactMode ? 90 : 125) + marginH * 2;

    svgContent = `
      <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: ${borderRadius}px; padding: ${16 + marginH}px ${16 + marginW}px; color: ${colors.text}; font-family: ${colors.fontFamily}; min-height: calc(100% - 32px);">
        ${showCategoryLabels ? `<h3 class="card-title" style="margin-bottom: 12px;">GitHub Trophies</h3>` : ''}
        <div style="display: grid; ${cols} gap: 10px;">
          ${filtered.map(t => {
            const glowShadow = t.rank === 'S' || t.rank === 'SS' || t.rank === 'SSS' ? `box-shadow: 0 0 10px ${t.color}33;` : '';
            return `
              <div style="background-color: ${colors.border}10; border: 1px solid ${colors.border}30; border-radius: 8px; padding: ${compactMode ? '6px' : '10px'}; text-align: center; display: flex; flex-direction: column; justify-content: space-between; ${glowShadow}">
                <span style="font-size: 8px; opacity: 0.6; text-transform: uppercase; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.id}</span>
                <div style="margin: ${compactMode ? '2px 0' : '6px 0'};">
                  ${getTrophyIconSVG(t.rank, t.color)}
                </div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span style="font-size: 11px; font-weight: 900; color: ${t.color};">${t.rank}</span>
                  <span style="font-size: 10px; font-weight: bold;">${t.value}</span>
                  ${showProgress && t.rank !== 'SSS' && t.rank !== 'Unranked' ? `
                    <div style="width: 100%; background-color: ${colors.border}40; height: 3px; border-radius: 1.5px; overflow: hidden; margin-top: 4px;">
                      <div style="width: ${t.progress}%; height: 100%; background-color: ${t.color};"></div>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'badges') {
    // Round circular badges variant
    const rows = Math.ceil(filtered.length / columnCount);
    height = 50 + rows * (compactMode ? 75 : 100) + marginH * 2;
    svgContent = `
      <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: ${borderRadius}px; padding: ${16 + marginH}px ${16 + marginW}px; color: ${colors.text}; font-family: ${colors.fontFamily};">
        ${showCategoryLabels ? `<h4 style="margin: 0 0 10px 0; font-size: 12px; color: ${colors.title};">Achievement Badges</h4>` : ''}
        <div style="display: grid; grid-template-columns: repeat(${columnCount}, 1fr); gap: 12px; text-align: center;">
          ${filtered.map(t => `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="width: ${compactMode ? '42px' : '54px'}; height: ${compactMode ? '42px' : '54px'}; border-radius: 50%; border: 2px solid ${t.color}; background-color: ${t.color}15; display: flex; align-items: center; justify-content: center; position: relative;">
                ${getTrophyIconSVG(t.rank, t.color)}
                <span style="position: absolute; bottom: -3px; right: -3px; background-color: ${t.color}; color: #000; font-size: 7px; font-weight: bold; border-radius: 40%; padding: 1px 3px;">${t.rank}</span>
              </div>
              <span style="font-size: 8px; font-weight: bold; margin-top: 6px; opacity: 0.8; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.id}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'ribbon') {
    height = 60 + filtered.length * 42 + marginH * 2;
    svgContent = `
      <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: ${borderRadius}px; padding: ${16 + marginH}px ${16 + marginW}px; color: ${colors.text}; font-family: ${colors.fontFamily};">
        ${showCategoryLabels ? `<h4 style="margin: 0 0 10px 0; font-size: 12px; color: ${colors.title};">Honorary Ribbons</h4>` : ''}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${filtered.map(t => `
            <div style="display: flex; align-items: center; justify-content: space-between; border-left: 4px solid ${t.color}; background-color: ${t.color}10; padding: 6px 12px; border-radius: 0 6px 6px 0;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🏅</span>
                <span style="font-size: 11px; font-weight: bold;">${t.id} Award</span>
              </div>
              <span style="font-size: 11px; font-weight: 900; color: ${t.color};">${t.rank} (${t.value})</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'minimal') {
    height = 50 + Math.ceil(filtered.length / 2) * 35 + marginH * 2;
    svgContent = `
      <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: ${borderRadius}px; padding: ${12 + marginH}px ${12 + marginW}px; color: ${colors.text}; font-family: ${colors.fontFamily};">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
          ${filtered.map(t => `
            <div style="display: flex; align-items: center; justify-content: space-between; background-color: ${colors.border}0c; padding: 6px 10px; border-radius: 4px;">
              <span style="font-size: 10px;">${t.id}</span>
              <span style="font-size: 10px; font-weight: bold; color: ${t.color};">[${t.rank}] ${t.value}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (variant === 'podium') {
    height = 240 + marginH * 2;
    // Extract top 3 and others
    const sorted = [...filtered].sort((a, b) => {
      const ranks = ['SSS', 'SS', 'S', 'A+', 'A', 'B', 'C', 'Unranked'];
      return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
    });

    const podiums = [
      sorted[1] || null, // 2nd (left)
      sorted[0] || null, // 1st (center)
      sorted[2] || null, // 3rd (right)
    ];

    svgContent = `
      <div style="background-color: ${cardBg}; border: ${cardBorder}; border-radius: ${borderRadius}px; padding: ${16 + marginH}px ${16 + marginW}px; color: ${colors.text}; font-family: ${colors.fontFamily}; display: flex; flex-direction: column; justify-content: space-between; height: calc(100% - 32px);">
        ${showCategoryLabels ? `<h4 style="margin: 0; font-size: 12px; color: ${colors.title}; text-align: center;">Trophy Podium</h4>` : ''}
        <!-- The Podium Grid -->
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 15px; margin-top: 15px; flex: 1;">
          <!-- 2nd Place -->
          ${podiums[0] ? `
            <div style="display: flex; flex-direction: column; align-items: center;">
              ${getTrophyIconSVG(podiums[0].rank, podiums[0].color)}
              <span style="font-size: 8px; opacity: 0.7; margin-top: 4px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${podiums[0].id}</span>
              <div style="background-color: ${colors.border}33; border: 1px solid ${colors.border}60; width: 60px; height: 50px; border-radius: 4px 4px 0 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: ${podiums[0].color}; margin-top: 4px;">
                2nd
              </div>
            </div>
          ` : ''}
          <!-- 1st Place -->
          ${podiums[1] ? `
            <div style="display: flex; flex-direction: column; align-items: center;">
              ${getTrophyIconSVG(podiums[1].rank, podiums[1].color)}
              <span style="font-size: 8px; opacity: 0.7; margin-top: 4px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${podiums[1].id}</span>
              <div style="background-color: ${colors.border}66; border: 1px solid ${colors.border}; width: 65px; height: 75px; border-radius: 4px 4px 0 0; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: ${podiums[1].color}; margin-top: 4px;">
                1st
              </div>
            </div>
          ` : ''}
          <!-- 3rd Place -->
          ${podiums[2] ? `
            <div style="display: flex; flex-direction: column; align-items: center;">
              ${getTrophyIconSVG(podiums[2].rank, podiums[2].color)}
              <span style="font-size: 8px; opacity: 0.7; margin-top: 4px; max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${podiums[2].id}</span>
              <div style="background-color: ${colors.border}22; border: 1px solid ${colors.border}40; width: 60px; height: 35px; border-radius: 4px 4px 0 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: ${podiums[2].color}; margin-top: 4px;">
                3rd
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="height: 100%;">
        ${svgContent}
      </div>
    </foreignObject>
  </svg>`;
}
