import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections, getStatsUrl, getStreakUrl, getLanguagesUrl, getTrophiesUrl } from './assemble';

export const definition: ThemeDefinition = {
  id: 'neon-synthwave',
  name: 'Neon Synthwave',
  description: '80s retro vibes with neon pink, sunset gradients, synthwave aesthetics, and vaporwave personality.',
  category: 'creative',
  icon: 'Zap',
  previewColors: {
    primary: '#FF006E',
    secondary: '#8338EC',
    accent: '#00F5FF',
    background: '#2b213a',
  },
  defaultConfig: {
    primaryColor: '#FF006E',
    secondaryColor: '#8338EC',
    accentColor: '#00F5FF',
    alignment: 'center',
    emojiLevel: 'heavy',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: true,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'synthwave',
  badgeStyle: 'for-the-badge',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'languages', 'trophies', 'activity-graph', 'projects', 'quote', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'languages', 'trophies', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
  },
};

const NEON_DIV = `<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`;

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'synthwave';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF006E,50:8338EC,100:00F5FF&height=220&section=header&text=${encodeURIComponent('⚡ ' + (c.customTitle || name) + ' ⚡')}&fontSize=44&fontColor=ffffff&animation=twinkling&fontAlignY=35&desc=${encodeURIComponent('✦ ' + (c.customTagline || bio) + ' ✦')}&descSize=18&descAlignY=55" width="100%" alt="Synthwave Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [`⚡ Coding with neon vibes ⚡`, `✨ Full Stack Developer ✨`, `🌅 Retro futurist 🌅`, `🎮 Building the future, retro-style 🎮`];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=24&duration=3500&pause=1000&color=FF006E&center=true&vCenter=true&width=650&height=55&lines=${linesParam}" alt="Neon Typing" />`);
    l.push(`</p>\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(NEON_DIV);
    l.push(`## ✨ About Me ✨\n`);
    l.push(`<div align="center">\n`);
    if (bio) l.push(`> *✦ ${bio} ✦*\n`);
    l.push(`</div>\n`);
    const items: string[] = [];
    if (input.currentProject) items.push(`⭐ Currently building: **${input.currentProject}**`);
    if (input.learning) items.push(`💫 Learning: **${input.learning}**`);
    if (input.collab) items.push(`✨ Open to collaborate on: **${input.collab}**`);
    if (items.length > 0) { items.forEach(item => l.push(item)); l.push(''); }
    l.push(NEON_DIV);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## ⚡ Tech Arsenal ⚡\n`);
    l.push(`<p align="center">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-FF006E?style=for-the-badge" alt="${skill}" />`;
    });
    l.push(badges.join('\n'));
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## 🌅 GitHub Stats 🌅\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStatsUrl(input, 'synthwave')}" alt="Stats" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## 🔥 Commit Streak 🔥\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStreakUrl(input, 'synthwave')}" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## 📋 Languages Used 📋\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getLanguagesUrl(input, 'synthwave')}" alt="Languages" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('languages', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 Neon Trophies 🏆\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getTrophiesUrl(input, 'synthwave')}" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('trophies', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 Neon Activity Graph 📈\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=2b213a&color=FF006E&line=00F5FF&point=8338EC&area=true&hide_border=true" alt="Activity Graph" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('activity-graph', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 🎮 Featured Projects 🎮\n`);
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=synthwave&hide_border=false&border_color=FF006E" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('projects', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## 💭 Quote of the Day 💭\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Quote" />`);
    l.push(`</p>\n`);
    l.push(NEON_DIV);
    blocks.set('quote', l.join('\n'));
  }

  // SOCIALS
  {
    const socialBadges: string[] = [];
    if (socials.github) socialBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-FF006E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`);
    if (socials.linkedin) socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-8338EC?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
    if (socials.twitter) socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-00F5FF?style=for-the-badge&logo=twitter&logoColor=black)](https://twitter.com/${socials.twitter})`);
    if (socials.portfolio) socialBadges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF006E?style=for-the-badge&logo=google-chrome&logoColor=white)](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
    if (socials.email) socialBadges.push(`[![Email](https://img.shields.io/badge/Email-8338EC?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socials.email})`);
    if (socialBadges.length > 0) {
      const l: string[] = [];
      l.push(`## 🌐 Connect ✨\n`);
      l.push(`<p align="center">`);
      l.push(`  ${socialBadges.join(' ')}`);
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=FF006E" alt="Profile Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">`,
    `  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF006E,50:8338EC,100:00F5FF&height=150&section=footer" width="100%" alt="Footer" />`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
