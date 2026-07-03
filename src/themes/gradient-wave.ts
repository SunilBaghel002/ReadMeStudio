import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

export const definition: ThemeDefinition = {
  id: 'gradient-wave',
  name: 'Gradient Wave',
  description: 'Modern, professional, gradient-heavy aesthetic with capsule-render banners, contribution graphs, and snake animations.',
  category: 'creative',
  icon: 'Waves',
  previewColors: {
    primary: '#667EEA',
    secondary: '#764BA2',
    accent: '#F093FB',
    background: '#0d1117',
  },
  defaultConfig: {
    primaryColor: '#667EEA',
    secondaryColor: '#764BA2',
    accentColor: '#F093FB',
    alignment: 'center',
    emojiLevel: 'minimal',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: true,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: true,
  },
  statsTheme: 'dracula',
  badgeStyle: 'plastic',
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const primaryClean = c.primaryColor.replace('#', '');
  const secondaryClean = c.secondaryColor.replace('#', '');
  const accentClean = c.accentColor.replace('#', '');
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Waving capsule-render banner
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,9,30&height=200&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=${encodeURIComponent(c.customTagline || bio)}&descSize=16&descAlignY=55" width="100%" alt="Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // TYPING ANIMATION
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `Full Stack Developer`,
      `Open Source Enthusiast`,
      `Building things that matter`,
      `Always learning, always growing`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <a href="https://git.io/typing-svg">`);
    lines.push(`    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=${primaryClean}&center=true&vCenter=true&multiline=true&width=700&height=60&lines=${linesParam}" alt="Typing SVG" />`);
    lines.push(`  </a>`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // ABOUT ME: Code block style
  // ═══════════════════════════════════════
  lines.push(`## 💫 About Me\n`);
  lines.push('```javascript');
  lines.push(`const developer = {`);
  lines.push(`  name: "${name}",`);
  lines.push(`  role: "${c.customTagline || 'Full Stack Developer'}",`);
  lines.push(`  languages: [${skills.slice(0, 5).map(s => `"${s}"`).join(', ')}],`);
  if (input.currentProject) {
    lines.push(`  currentProject: "${input.currentProject}",`);
  }
  if (input.learning) {
    lines.push(`  learning: "${input.learning}",`);
  }
  lines.push(`  funFact: "I code with coffee and lo-fi beats ☕🎵"`);
  lines.push(`};`);
  lines.push('```\n');

  if (bio) {
    lines.push(`> ${bio}\n`);
  }

  const aboutEmojis = c.emojiLevel !== 'none';
  if (input.currentProject) {
    lines.push(`${aboutEmojis ? '🔭' : '-'} I'm currently working on **${input.currentProject}**`);
  }
  if (input.learning) {
    lines.push(`${aboutEmojis ? '🌱' : '-'} I'm currently learning **${input.learning}**`);
  }
  if (input.collab) {
    lines.push(`${aboutEmojis ? '👯' : '-'} I'm looking to collaborate on **${input.collab}**`);
  }
  lines.push('');

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // TECH STACK: Plastic badges in single row
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## 🛠️ Tech Stack\n`);
    lines.push(`<p align="${c.alignment}">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=plastic&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-${primaryClean}?style=plastic" alt="${skill}" />`;
    });
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Stacked vertically
  // ═══════════════════════════════════════
  lines.push(`## 📊 GitHub Stats\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=dracula&hide_border=true&include_all_commits=true&show_icons=true" alt="GitHub Stats" />`);
  lines.push(`  <br/>`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=dracula&hide_border=true" alt="GitHub Streak" />`);
  lines.push(`  <br/>`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=dracula&hide_border=true&langs_count=8" alt="Top Languages" />`);
  lines.push(`</p>\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // TROPHIES
  // ═══════════════════════════════════════
  if (c.showTrophies) {
    lines.push(`## 🏆 GitHub Trophies\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=dracula&no_frame=true&no_bg=true&column_count=4" alt="Trophies" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // CONTRIBUTION GRAPH
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## 📈 Contribution Graph\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=667eea&line=764ba2&point=f093fb&area=true&hide_border=true" alt="Contribution Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // SNAKE ANIMATION
  // ═══════════════════════════════════════
  if (c.showSnakeAnimation) {
    lines.push(`## 🐍 Contribution Snake\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-snake-dark.svg" alt="Snake animation" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // DEV QUOTE
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## ✍️ Random Dev Quote\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Dev Quote" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // FEATURED REPOS
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## 💻 Featured Projects\n`);
    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=dracula&hide_border=true" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS
  // ═══════════════════════════════════════
  const socialBadges: string[] = [];
  if (socials.github) socialBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`);
  if (socials.linkedin) socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
  if (socials.twitter) socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`);
  if (socials.portfolio) socialBadges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
  if (socials.email) socialBadges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socials.email})`);

  if (socialBadges.length > 0) {
    lines.push(`## 🌐 Connect With Me\n`);
    lines.push(`<p align="center">`);
    lines.push(`  ${socialBadges.join(' ')}`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR COUNTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=${primaryClean}" alt="Profile Views" />`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // FOOTER: Waving capsule-render
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,9,30&height=120&section=footer" width="100%" alt="Footer" />`);
  lines.push(`</p>`);

  return lines.join('\n');
};
