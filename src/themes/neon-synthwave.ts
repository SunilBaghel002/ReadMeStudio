import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

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
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Synthwave gradient capsule
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF006E,50:8338EC,100:00F5FF&height=220&section=header&text=${encodeURIComponent('⚡ ' + (c.customTitle || name) + ' ⚡')}&fontSize=44&fontColor=ffffff&animation=twinkling&fontAlignY=35&desc=${encodeURIComponent('✦ ' + (c.customTagline || bio) + ' ✦')}&descSize=18&descAlignY=55" width="100%" alt="Synthwave Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // TYPING: Retro neon style
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `⚡ Coding with neon vibes ⚡`,
      `✨ Full Stack Developer ✨`,
      `🌅 Retro futurist 🌅`,
      `🎮 Building the future, retro-style 🎮`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=24&duration=3500&pause=1000&color=FF006E&center=true&vCenter=true&width=650&height=55&lines=${linesParam}" alt="Neon Typing" />`);
    lines.push(`</p>\n`);
  }

  // Neon divider
  lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);

  // ═══════════════════════════════════════
  // ABOUT: Retro sparkle aesthetic
  // ═══════════════════════════════════════
  lines.push(`## ✨ About Me ✨\n`);
  lines.push(`<div align="center">\n`);
  if (bio) {
    lines.push(`> *✦ ${bio} ✦*\n`);
  }
  lines.push(`</div>\n`);

  const items: string[] = [];
  if (input.currentProject) items.push(`⭐ Currently building: **${input.currentProject}**`);
  if (input.learning) items.push(`💫 Learning: **${input.learning}**`);
  if (input.collab) items.push(`✨ Open to collaborate on: **${input.collab}**`);

  if (items.length > 0) {
    items.forEach(item => lines.push(item));
    lines.push('');
  }

  lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);

  // ═══════════════════════════════════════
  // TECH STACK: Neon for-the-badge
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## ⚡ Tech Arsenal ⚡\n`);
    lines.push(`<p align="center">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-FF006E?style=for-the-badge" alt="${skill}" />`;
    });
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
    lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Synthwave theme with neon borders
  // ═══════════════════════════════════════
  lines.push(`## 🌅 GitHub Stats 🌅\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=synthwave&hide_border=false&border_color=FF006E&show_icons=true&include_all_commits=true" alt="Stats" />`);
  lines.push(`</p>\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=synthwave&hide_border=false&border_color=00F5FF" alt="Streak" />`);
  lines.push(`</p>\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=synthwave&hide_border=false&border_color=8338EC&langs_count=8" alt="Languages" />`);
  lines.push(`</p>\n`);

  lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);

  // ═══════════════════════════════════════
  // TROPHIES: Neon themed
  // ═══════════════════════════════════════
  if (c.showTrophies) {
    lines.push(`## 🏆 Neon Trophies 🏆\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=radical&no_frame=false&no_bg=false&column_count=4" alt="Trophies" />`);
    lines.push(`</p>\n`);
    lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);
  }

  // ═══════════════════════════════════════
  // CONTRIBUTION GRAPH
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## 📈 Neon Activity Graph 📈\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=2b213a&color=FF006E&line=00F5FF&point=8338EC&area=true&hide_border=true" alt="Activity Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);
  }

  // ═══════════════════════════════════════
  // FEATURED REPOS
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## 🎮 Featured Projects 🎮\n`);
    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=synthwave&hide_border=false&border_color=FF006E" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);
  }

  // ═══════════════════════════════════════
  // QUOTE
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## 💭 Quote of the Day 💭\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Quote" />`);
    lines.push(`</p>\n`);
    lines.push(`<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF006E,100:00F5FF&height=2" width="100%" alt="" />\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS: Neon badges
  // ═══════════════════════════════════════
  const socialBadges: string[] = [];
  if (socials.github) socialBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-FF006E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`);
  if (socials.linkedin) socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-8338EC?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
  if (socials.twitter) socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-00F5FF?style=for-the-badge&logo=twitter&logoColor=black)](https://twitter.com/${socials.twitter})`);
  if (socials.portfolio) socialBadges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF006E?style=for-the-badge&logo=google-chrome&logoColor=white)](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
  if (socials.email) socialBadges.push(`[![Email](https://img.shields.io/badge/Email-8338EC?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socials.email})`);

  if (socialBadges.length > 0) {
    lines.push(`## 🌐 Connect ✨\n`);
    lines.push(`<p align="center">`);
    lines.push(`  ${socialBadges.join(' ')}`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR + FOOTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=FF006E" alt="Profile Views" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF006E,50:8338EC,100:00F5FF&height=150&section=footer" width="100%" alt="Footer" />`);
  lines.push(`</p>`);

  return lines.join('\n');
};
