import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

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
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Community-focused banner
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:238636,50:1f6feb,100:f78166&height=180&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🌍 Open Source Contributor & Maintainer')}&descSize=16&descAlignY=55" width="100%" alt="OSS Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // TYPING: OSS community messages
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `Contributing to open source 🌍`,
      `Building in public 🔨`,
      `PRs welcome! 🤝`,
      `Maintaining community projects 📦`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=22&duration=3000&pause=1000&color=238636&center=true&vCenter=true&width=550&height=45&lines=${linesParam}" alt="OSS Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // ABOUT: OSS journey focused
  // ═══════════════════════════════════════
  lines.push(`## 🌍 About My OSS Journey\n`);
  if (bio) {
    lines.push(`${bio}\n`);
  }
  lines.push(`I'm passionate about open source software and believe in the power of community-driven development. Every contribution, no matter how small, makes a difference.\n`);

  if (input.currentProject) {
    lines.push(`- 🔭 **Currently maintaining:** [${input.currentProject}](${input.currentProjectUrl || `https://github.com/${username}/${input.currentProject}`})`);
  }
  if (input.learning) {
    lines.push(`- 🌱 **Learning:** ${input.learning}`);
  }
  if (input.collab) {
    lines.push(`- 🤝 **Looking to collaborate on:** ${input.collab}`);
  }
  lines.push(`- 💬 **Ask me about:** Open source best practices, community building`);
  lines.push('');

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CONTRIBUTION STATS: Prominent and large
  // ═══════════════════════════════════════
  lines.push(`## 📊 Contribution Statistics\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=radical&hide_border=true&show_icons=true&include_all_commits=true" alt="GitHub Stats" width="49%" />`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=radical&hide_border=true" alt="Streak" width="49%" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=radical&hide_border=true&langs_count=10" alt="Languages" />`);
  lines.push(`</p>\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CONTRIBUTION GRAPH: Large and prominent
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## 📈 Contribution Activity\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=238636&line=1f6feb&point=f78166&area=true&hide_border=true" alt="Contribution Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // TROPHIES: Achievement showcase
  // ═══════════════════════════════════════
  if (c.showTrophies) {
    lines.push(`## 🏆 Open Source Achievements\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=radical&no_frame=false&no_bg=false&column_count=6" alt="Trophies" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // TECH STACK: Standard badges
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## 🛠️ Tech Stack\n`);
    lines.push(`<p align="center">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=flat&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-238636?style=flat" alt="${skill}" />`;
    });
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // FEATURED CONTRIBUTIONS
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## 📦 Featured Repositories\n`);
    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=radical&hide_border=true" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
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
  // SPONSOR SECTION
  // ═══════════════════════════════════════
  lines.push(`## 💖 Support Open Source\n`);
  lines.push(`If you find my work useful, consider supporting the open source community:\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <a href="https://github.com/sponsors/${username}">`);
  lines.push(`    <img src="https://img.shields.io/badge/Sponsor_on_GitHub-238636?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor" />`);
  lines.push(`  </a>`);
  lines.push(`</p>\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // SOCIALS: Community links
  // ═══════════════════════════════════════
  const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
  if (hasSocials) {
    lines.push(`## 🤝 Connect\n`);
    lines.push(`<p align="center">`);
    const badges: string[] = [];
    if (socials.github) badges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>`);
    if (socials.linkedin) badges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
    if (socials.twitter) badges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>`);
    if (socials.portfolio) badges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Blog-FF5722?style=for-the-badge&logo=hashnode&logoColor=white" /></a>`);
    if (socials.email) badges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR + FOOTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=238636" alt="Views" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">`);
  lines.push(`  <em>⭐ Star my repos if you find them useful! PRs are always welcome! 🤝</em>`);
  lines.push(`</p>`);

  return lines.join('\n');
};
