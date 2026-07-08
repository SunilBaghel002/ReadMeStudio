import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections } from './assemble';

export const definition: ThemeDefinition = {
  id: 'dark-elegance',
  name: 'Dark Elegance',
  description: 'Premium, luxurious, refined dark theme with gold accents, serif typography feel, and sophisticated presentation.',
  category: 'professional',
  icon: 'Crown',
  previewColors: {
    primary: '#FFD700',
    secondary: '#1a1a2e',
    accent: '#B8860B',
    background: '#0a0a0f',
  },
  defaultConfig: {
    primaryColor: '#FFD700',
    secondaryColor: '#1a1a2e',
    accentColor: '#B8860B',
    alignment: 'center',
    emojiLevel: 'minimal',
    showTypingAnimation: true,
    showContributionGraph: false,
    showTrophies: false,
    showQuote: true,
    showVisitorCounter: false,
    showSnakeAnimation: false,
  },
  statsTheme: 'tokyonight',
  badgeStyle: 'flat',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'stats', 'projects', 'quote', 'socials'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'quote', 'socials'],
  },
};

const ELEGANT_DIV = `<p align="center">✦ ─────────────────────────────── ✦</p>\n`;

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=rect&color=0a0a0f&height=1" width="100%" alt="" />`);
    l.push(`</p>\n`);
    l.push(`<div align="center">\n`);
    l.push(`<img src="https://github.com/${username}.png" width="130" height="130" style="border-radius: 50%; border: 2px solid #FFD700" alt="Avatar" />\n`);
    l.push('');
    l.push(`# ✦ ${c.customTitle || name} ✦\n`);
    l.push(`*${c.customTagline || bio || 'Software Architect & Engineer'}*\n`);
    l.push(`</div>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [
      `Crafting elegant solutions`,
      `Architecture & design excellence`,
      `Precision in every line of code`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=600&size=22&duration=4000&pause=2000&color=FFD700&center=true&vCenter=true&width=500&height=40&lines=${linesParam}" alt="Elegant Typing" />`);
    l.push(`</p>\n`);
    l.push(ELEGANT_DIV);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## ✧ About\n`);
    if (bio) l.push(`> *${bio}*\n`);
    l.push(`A meticulous engineer with a passion for clean architecture and elegant solutions. I believe in writing code that is not just functional, but beautiful.\n`);
    const items: string[] = [];
    if (input.currentProject) items.push(`✦ Currently crafting **${input.currentProject}**`);
    if (input.learning) items.push(`✧ Exploring **${input.learning}**`);
    if (input.collab) items.push(`❖ Open to collaborating on **${input.collab}**`);
    if (items.length > 0) { items.forEach(item => l.push(item)); l.push(''); }
    l.push(ELEGANT_DIV);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## ✧ Technologies\n`);
    l.push(`<p align="center">`);
    const sortedSkills = [...skills].sort();
    const badges = sortedSkills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-0a0a0f?style=flat&logo=${details.logo}&logoColor=FFD700" alt="${skill}" />`;
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-0a0a0f?style=flat&logoColor=FFD700" alt="${skill}" />`;
    });
    l.push(badges.join('\n'));
    l.push(`</p>\n`);
    l.push(ELEGANT_DIV);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## ✧ Metrics\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=tokyonight&hide_border=true&show_icons=true&include_all_commits=true&icon_color=FFD700&title_color=FFD700" alt="Stats" />`);
    l.push(`</p>\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=tokyonight&hide_border=true&ring=FFD700&fire=FFD700&currStreakLabel=FFD700" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(ELEGANT_DIV);
    blocks.set('stats', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## ✧ Signature Work\n`);
    const topRepos = selectedRepos.slice(0, 4);
    l.push(`<p align="center">`);
    topRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=tokyonight&hide_border=true&icon_color=FFD700&title_color=FFD700" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(ELEGANT_DIV);
    blocks.set('projects', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## ✧ Words to Code By\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Quote" />`);
    l.push(`</p>\n`);
    l.push(ELEGANT_DIV);
    blocks.set('quote', l.join('\n'));
  }

  // SOCIALS
  {
    const socialLinks: string[] = [];
    if (socials.github) socialLinks.push(`[GitHub](https://github.com/${socials.github})`);
    if (socials.linkedin) socialLinks.push(`[LinkedIn](https://linkedin.com/in/${socials.linkedin})`);
    if (socials.twitter) socialLinks.push(`[Twitter](https://twitter.com/${socials.twitter})`);
    if (socials.portfolio) socialLinks.push(`[Portfolio](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
    if (socials.email) socialLinks.push(`[Email](mailto:${socials.email})`);
    if (socialLinks.length > 0) {
      const l: string[] = [];
      l.push(`<p align="center">\n`);
      l.push(`${socialLinks.join(' ✦ ')}\n`);
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">\n`,
    `*✦ Crafted with precision ✦*\n`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
