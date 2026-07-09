import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections, getStatsUrl, getStreakUrl, getLanguagesUrl, getTrophiesUrl } from './assemble';

export const definition: ThemeDefinition = {
  id: 'opensource-hero',
  name: 'Open Source Hero',
  description: 'Community-focused, contribution-driven layout that highlights OSS contributions, PRs, issues, and maintainer status.',
  category: 'technical',
  icon: 'GitPullRequest',
  previewColors: {
    primary: '#238636',
    secondary: '#1f6feb',
    accent: '#f78166',
    background: '#0d1117',
  },
  defaultConfig: {
    primaryColor: '#238636',
    secondaryColor: '#1f6feb',
    accentColor: '#f78166',
    alignment: 'center',
    emojiLevel: 'minimal',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: true,
    showQuote: false,
    showVisitorCounter: true,
    showSnakeAnimation: true,
  },
  statsTheme: 'radical',
  badgeStyle: 'flat',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'stats', 'streak', 'languages', 'activity-graph', 'trophies', 'skills', 'projects', 'snake-game', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'stats', 'streak', 'languages', 'activity-graph', 'trophies', 'skills', 'projects', 'socials', 'visitor-counter'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'radical';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:238636,50:1f6feb,100:f78166&height=180&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🌍 Open Source Contributor & Maintainer')}&descSize=16&descAlignY=55" width="100%" alt="OSS Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [
      `Contributing to open source 🌍`,
      `Building in public 🔨`,
      `PRs welcome! 🤝`,
      `Maintaining community projects 📦`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3000&pause=1000&color=238636&center=true&vCenter=true&width=550&height=45&lines=${linesParam}" alt="OSS Typing" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## 🌍 About My OSS Journey\n`);
    if (bio) l.push(`${bio}\n`);
    l.push(`I'm passionate about open source software and believe in the power of community-driven development. Every contribution, no matter how small, makes a difference.\n`);
    if (input.currentProject) l.push(`- 🔭 **Currently maintaining:** [${input.currentProject}](${input.currentProjectUrl || `https://github.com/${username}/${input.currentProject}`})`);
    if (input.learning) l.push(`- 🌱 **Learning:** ${input.learning}`);
    if (input.collab) l.push(`- 🤝 **Looking to collaborate on:** ${input.collab}`);
    l.push(`- 💬 **Ask me about:** Open source best practices, community building`);
    l.push('');
    l.push(`---\n`);
    blocks.set('about', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## 📊 Contribution Statistics\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStatsUrl(input, 'radical')}" alt="GitHub Stats" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## 🔥 Commit Streak\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStreakUrl(input, 'radical')}" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## 📋 Most Used Languages\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getLanguagesUrl(input, 'radical')}" alt="Languages" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('languages', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 Contribution Activity\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=238636&line=1f6feb&point=f78166&area=true&hide_border=true" alt="Contribution Graph" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 Open Source Achievements\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getTrophiesUrl(input, 'radical')}" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## 🛠️ Tech Stack\n`);
    l.push(`<p align="center">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=flat&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-238636?style=flat" alt="${skill}" />`;
    });
    l.push(badges.join('\n'));
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('skills', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 📦 Featured Repositories\n`);
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=radical&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('projects', l.join('\n'));
  }

  // SNAKE GAME
  {
    const l: string[] = [];
    l.push(`## 🐍 Contribution Snake\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-snake-dark.svg" alt="Snake animation" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('snake-game', l.join('\n'));
  }

  // SOCIALS
  {
    const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
    if (hasSocials) {
      const l: string[] = [];
      l.push(`## 🤝 Connect\n`);
      l.push(`<p align="center">`);
      const badges: string[] = [];
      if (socials.github) badges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>`);
      if (socials.linkedin) badges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
      if (socials.twitter) badges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>`);
      if (socials.portfolio) badges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=hashnode&logoColor=white" /></a>`);
      if (socials.email) badges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
      l.push(badges.join('\n'));
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=238636" alt="Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `## 💖 Support Open Source\n`,
    `If you find my work useful, consider supporting the open source community:\n`,
    `<p align="center">`,
    `  <a href="https://github.com/sponsors/${username}">`,
    `    <img src="https://img.shields.io/badge/Sponsor_on_GitHub-238636?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor" />`,
    `  </a>`,
    `</p>\n`,
    `<p align="center">`,
    `  <em>⭐ Star my repos if you find them useful! PRs are always welcome! 🤝</em>`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
