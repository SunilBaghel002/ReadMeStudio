import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

export const definition: ThemeDefinition = {
  id: 'gamer-dev',
  name: 'Gamer Dev',
  description: 'RPG character sheet style with XP bars, achievement unlocks, quest logs, and gaming HUD aesthetics.',
  category: 'fun',
  icon: 'Gamepad2',
  previewColors: {
    primary: '#FFD700',
    secondary: '#8B5CF6',
    accent: '#EF4444',
    background: '#141321',
  },
  defaultConfig: {
    primaryColor: '#FFD700',
    secondaryColor: '#8B5CF6',
    accentColor: '#EF4444',
    alignment: 'center',
    emojiLevel: 'heavy',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: true,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'radical',
  badgeStyle: 'for-the-badge',
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Gaming style banner
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD700,50:8B5CF6,100:EF4444&height=200&section=header&text=${encodeURIComponent('⚔️ ' + (c.customTitle || name).toUpperCase() + ' ⚔️')}&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🎮 LEVEL XX DEVELOPER | XP: 10,000+ COMMITS 🎮')}&descSize=16&descAlignY=55" width="100%" alt="Gamer Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // TYPING: Quest-style
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `🎮 Achievement Unlocked: Profile Visitor!`,
      `⚔️ Class: Full Stack Developer`,
      `🏆 Quest: Build Amazing Software`,
      `💎 Collecting rare commits...`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=14&duration=3000&pause=1000&color=FFD700&center=true&vCenter=true&width=700&height=40&lines=${linesParam}" alt="Gaming Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️</p>\n`);

  // ═══════════════════════════════════════
  // CHARACTER SHEET: RPG-style about
  // ═══════════════════════════════════════
  lines.push(`## 🎮 Character Sheet\n`);
  lines.push('```yaml');
  lines.push(`# ═══════════════════════════════════`);
  lines.push(`#  PLAYER PROFILE`);
  lines.push(`# ═══════════════════════════════════`);
  lines.push(`NAME:              ${name}`);
  lines.push(`CLASS:             Full Stack Developer`);
  lines.push(`LEVEL:             Senior`);
  lines.push(`XP:                10,000+ commits`);
  lines.push(`HP:                ████████████████████ 100%`);
  lines.push(`MP:                ████████████████░░░░  80%`);
  lines.push(`SPECIAL_ABILITIES: [${skills.slice(0, 4).join(', ')}]`);
  if (input.currentProject) {
    lines.push(`CURRENT_QUEST:     ${input.currentProject}`);
  }
  if (input.learning) {
    lines.push(`STUDYING:          ${input.learning}`);
  }
  lines.push(`STATUS:            Online & Ready for Battle 🟢`);
  lines.push('```\n');

  if (bio) {
    lines.push(`> 🎯 *${bio}*\n`);
  }

  lines.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);

  // ═══════════════════════════════════════
  // TECH STACK: Weapons & Tools
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## ⚔️ Weapons & Tools\n`);

    const frontendSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'Bootstrap', 'Sass', 'FramerMotion', 'Vite', 'Three.js'];
    const backendSkills = ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'Kotlin', 'Go', 'Rust', 'Ruby', 'PHP', 'GraphQL', 'FastAPI'];
    const dbSkills = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'];
    const toolSkills = ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Vercel', 'Netlify', 'Heroku', 'Jest', 'Nginx'];

    const renderWeapons = (title: string, emoji: string, categoryList: string[]) => {
      const matching = skills.filter(s => categoryList.includes(s));
      if (matching.length === 0) return;
      lines.push(`### ${emoji} ${title}\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        }
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-FFD700?style=for-the-badge)`;
      });
      lines.push(badges.join(' '));
      lines.push('');
    };

    renderWeapons('Frontend Arsenal', '🗡️', frontendSkills);
    renderWeapons('Backend Weapons', '🛡️', backendSkills);
    renderWeapons('Database Spells', '🔮', dbSkills);
    renderWeapons('DevOps Artifacts', '⚙️', toolSkills);

    const allCategorized = [...frontendSkills, ...backendSkills, ...dbSkills, ...toolSkills];
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) {
      renderWeapons('Secret Items', '💎', uncategorized);
    }

    lines.push(`<p align="center">⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️</p>\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Achievement cards
  // ═══════════════════════════════════════
  lines.push(`## 📊 Player Stats & Achievements\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=radical&hide_border=true&show_icons=true&include_all_commits=true" alt="Player Stats" />`);
  lines.push(`</p>\n`);

  lines.push(`### 🔥 Combo Streak\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=radical&hide_border=true" alt="Combo Streak" />`);
  lines.push(`</p>\n`);

  lines.push(`### 📋 Skill Distribution\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=radical&hide_border=true&langs_count=8" alt="Skill Distribution" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">🏆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🏆</p>\n`);

  // ═══════════════════════════════════════
  // TROPHIES: Achievement System
  // ═══════════════════════════════════════
  if (c.showTrophies) {
    lines.push(`## 🏆 Achievements Unlocked\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=radical&no_frame=false&no_bg=false&column_count=4" alt="Achievements" />`);
    lines.push(`</p>\n`);
    lines.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);
  }

  // ═══════════════════════════════════════
  // FEATURED REPOS: Boss Battles Won
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## 🐉 Boss Battles Won (Top Projects)\n`);
    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=radical&hide_border=true" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`<p align="center">⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️</p>\n`);
  }

  // ═══════════════════════════════════════
  // CONTRIBUTION: XP Graph
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## 📈 XP Earned Over Time\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=141321&color=FFD700&line=8B5CF6&point=EF4444&area=true&hide_border=true" alt="XP Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);
  }

  // ═══════════════════════════════════════
  // QUOTE
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## 💬 Words of Wisdom\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Quote" />`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS: Guild Links
  // ═══════════════════════════════════════
  const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
  if (hasSocials) {
    lines.push(`## 🌐 Join My Guild\n`);
    lines.push(`<p align="center">`);
    const socialBadges: string[] = [];
    if (socials.github) socialBadges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-FFD700?style=for-the-badge&logo=github&logoColor=black" alt="GitHub" /></a>`);
    if (socials.linkedin) socialBadges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-8B5CF6?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`);
    if (socials.twitter) socialBadges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-EF4444?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>`);
    if (socials.portfolio) socialBadges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-FFD700?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Portfolio" /></a>`);
    if (socials.email) socialBadges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-8B5CF6?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>`);
    lines.push(socialBadges.join('\n'));
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR + FOOTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=FFD700&label=VISITORS+ENTERED" alt="Visitors" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD700,50:8B5CF6,100:EF4444&height=120&section=footer" width="100%" alt="Footer" />`);
  lines.push(`</p>`);
  lines.push(`\n<p align="center"><em>🎮 Thanks for visiting my profile! Drop a ⭐ if you liked a project! 🎮</em></p>`);

  return lines.join('\n');
};
