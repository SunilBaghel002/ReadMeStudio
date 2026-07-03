import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

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
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Minimal dark with gold
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=rect&color=0a0a0f&height=1" width="100%" alt="" />`);
  lines.push(`</p>\n`);

  lines.push(`<div align="center">\n`);
  lines.push(`<img src="https://github.com/${username}.png" width="130" height="130" style="border-radius: 50%; border: 2px solid #FFD700" alt="Avatar" />\n`);
  lines.push('');
  lines.push(`# ✦ ${c.customTitle || name} ✦\n`);
  lines.push(`*${c.customTagline || bio || 'Software Architect & Engineer'}*\n`);
  lines.push(`</div>\n`);

  // ═══════════════════════════════════════
  // TYPING: Gold, elegant
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `Crafting elegant solutions`,
      `Architecture & design excellence`,
      `Precision in every line of code`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=600&size=22&duration=4000&pause=2000&color=FFD700&center=true&vCenter=true&width=500&height=40&lines=${linesParam}" alt="Elegant Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);

  // ═══════════════════════════════════════
  // ABOUT: Refined paragraph with quotes
  // ═══════════════════════════════════════
  lines.push(`## ✧ About\n`);
  if (bio) {
    lines.push(`> *${bio}*\n`);
  }
  lines.push(`A meticulous engineer with a passion for clean architecture and elegant solutions. I believe in writing code that is not just functional, but beautiful.\n`);

  const items: string[] = [];
  if (input.currentProject) items.push(`✦ Currently crafting **${input.currentProject}**`);
  if (input.learning) items.push(`✧ Exploring **${input.learning}**`);
  if (input.collab) items.push(`❖ Open to collaborating on **${input.collab}**`);
  if (items.length > 0) {
    items.forEach(item => lines.push(item));
    lines.push('');
  }

  lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);

  // ═══════════════════════════════════════
  // TECH STACK: Dark badges with gold outlines
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## ✧ Technologies\n`);
    lines.push(`<p align="center">`);
    const sortedSkills = [...skills].sort();
    const badges = sortedSkills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-0a0a0f?style=flat&logo=${details.logo}&logoColor=FFD700" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-0a0a0f?style=flat&logoColor=FFD700" alt="${skill}" />`;
    });
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
    lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Tokyo Night with gold touches
  // ═══════════════════════════════════════
  lines.push(`## ✧ Metrics\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=tokyonight&hide_border=true&show_icons=true&include_all_commits=true&icon_color=FFD700&title_color=FFD700" alt="Stats" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=tokyonight&hide_border=true&ring=FFD700&fire=FFD700&currStreakLabel=FFD700" alt="Streak" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);

  // ═══════════════════════════════════════
  // SIGNATURE PROJECTS (top 3-4 only)
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## ✧ Signature Work\n`);
    const topRepos = selectedRepos.slice(0, 4);
    lines.push(`<p align="center">`);
    topRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=tokyonight&hide_border=true&icon_color=FFD700&title_color=FFD700" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);
  }

  // ═══════════════════════════════════════
  // QUOTE: Elegant
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## ✧ Words to Code By\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Quote" />`);
    lines.push(`</p>\n`);
    lines.push(`<p align="center">✦ ─────────────────────────────── ✦</p>\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS: Minimal elegant links
  // ═══════════════════════════════════════
  const socialLinks: string[] = [];
  if (socials.github) socialLinks.push(`[GitHub](https://github.com/${socials.github})`);
  if (socials.linkedin) socialLinks.push(`[LinkedIn](https://linkedin.com/in/${socials.linkedin})`);
  if (socials.twitter) socialLinks.push(`[Twitter](https://twitter.com/${socials.twitter})`);
  if (socials.portfolio) socialLinks.push(`[Portfolio](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
  if (socials.email) socialLinks.push(`[Email](mailto:${socials.email})`);

  if (socialLinks.length > 0) {
    lines.push(`<p align="center">\n`);
    lines.push(`${socialLinks.join(' ✦ ')}\n`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // FOOTER: Elegant signature
  // ═══════════════════════════════════════
  lines.push(`<p align="center">\n`);
  lines.push(`*✦ Crafted with precision ✦*\n`);
  lines.push(`</p>`);

  return lines.join('\n');
};
