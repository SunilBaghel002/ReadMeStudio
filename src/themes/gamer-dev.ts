import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections, getStatsUrl, getStreakUrl, getLanguagesUrl, getTrophiesUrl } from './assemble';

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
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'languages', 'trophies', 'projects', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'languages', 'trophies', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
  },
};

const GAMER_DIV = `<p align="center">⚔️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⚔️</p>\n`;

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'radical';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD700,50:8B5CF6,100:EF4444&height=200&section=header&text=${encodeURIComponent('⚔️ ' + (c.customTitle || name).toUpperCase() + ' ⚔️')}&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🎮 LEVEL XX DEVELOPER | XP: 10,000+ COMMITS 🎮')}&descSize=16&descAlignY=55" width="100%" alt="Gamer Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [`🎮 Achievement Unlocked: Profile Visitor!`, `⚔️ Class: Full Stack Developer`, `🏆 Quest: Build Amazing Software`, `💎 Collecting rare commits...`];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=14&duration=3000&pause=1000&color=FFD700&center=true&vCenter=true&width=700&height=40&lines=${linesParam}" alt="Gaming Typing" />`);
    l.push(`</p>\n`);
    l.push(GAMER_DIV);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## 🎮 Character Sheet\n`);
    l.push('```yaml');
    l.push(`# ═══════════════════════════════════`);
    l.push(`#  PLAYER PROFILE`);
    l.push(`# ═══════════════════════════════════`);
    l.push(`NAME:              ${name}`);
    l.push(`CLASS:             Full Stack Developer`);
    l.push(`LEVEL:             Senior`);
    l.push(`XP:                10,000+ commits`);
    l.push(`HP:                ████████████████████ 100%`);
    l.push(`MP:                ████████████████░░░░  80%`);
    l.push(`SPECIAL_ABILITIES: [${skills.slice(0, 4).join(', ')}]`);
    if (input.currentProject) l.push(`CURRENT_QUEST:     ${input.currentProject}`);
    if (input.learning) l.push(`STUDYING:          ${input.learning}`);
    l.push(`STATUS:            Online & Ready for Battle 🟢`);
    l.push('```\n');
    if (bio) l.push(`> 🎯 *${bio}*\n`);
    l.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## ⚔️ Weapons & Tools\n`);
    const frontendSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'Bootstrap', 'Sass', 'FramerMotion', 'Vite', 'Three.js'];
    const backendSkills = ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'Kotlin', 'Go', 'Rust', 'Ruby', 'PHP', 'GraphQL', 'FastAPI'];
    const dbSkills = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'];
    const toolSkills = ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Vercel', 'Netlify', 'Heroku', 'Jest', 'Nginx'];
    const renderWeapons = (title: string, emoji: string, categoryList: string[]) => {
      const matching = skills.filter(s => categoryList.includes(s));
      if (matching.length === 0) return;
      l.push(`### ${emoji} ${title}\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-FFD700?style=for-the-badge)`;
      });
      l.push(badges.join(' '));
      l.push('');
    };
    renderWeapons('Frontend Arsenal', '🗡️', frontendSkills);
    renderWeapons('Backend Weapons', '🛡️', backendSkills);
    renderWeapons('Database Spells', '🔮', dbSkills);
    renderWeapons('DevOps Artifacts', '⚙️', toolSkills);
    const allCategorized = [...frontendSkills, ...backendSkills, ...dbSkills, ...toolSkills];
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) renderWeapons('Secret Items', '💎', uncategorized);
    l.push(GAMER_DIV);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## 📊 Player Stats & Achievements\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStatsUrl(input, 'radical')}" alt="Player Stats" />`);
    l.push(`</p>\n`);
    l.push(GAMER_DIV);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## 🔥 Combo Streak\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStreakUrl(input, 'radical')}" alt="Combo Streak" />`);
    l.push(`</p>\n`);
    l.push(GAMER_DIV);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## 📋 Skill Distribution\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getLanguagesUrl(input, 'radical')}" alt="Skill Distribution" />`);
    l.push(`</p>\n`);
    l.push(GAMER_DIV);
    blocks.set('languages', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 Achievements Unlocked\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getTrophiesUrl(input, 'radical')}" alt="Achievements" />`);
    l.push(`</p>\n`);
    l.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 🐉 Boss Battles Won (Top Projects)\n`);
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=radical&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(GAMER_DIV);
    blocks.set('projects', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 XP Earned Over Time\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=141321&color=FFD700&line=8B5CF6&point=EF4444&area=true&hide_border=true" alt="XP Graph" />`);
    l.push(`</p>\n`);
    l.push(`<p align="center">🎮━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎮</p>\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## 💬 Words of Wisdom\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical" alt="Quote" />`);
    l.push(`</p>\n`);
    blocks.set('quote', l.join('\n'));
  }

  // SOCIALS
  {
    const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
    if (hasSocials) {
      const l: string[] = [];
      l.push(`## 🌐 Join My Guild\n`);
      l.push(`<p align="center">`);
      const socialBadges: string[] = [];
      if (socials.github) socialBadges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-FFD700?style=for-the-badge&logo=github&logoColor=black" alt="GitHub" /></a>`);
      if (socials.linkedin) socialBadges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-8B5CF6?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`);
      if (socials.twitter) socialBadges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-EF4444?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>`);
      if (socials.portfolio) socialBadges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-FFD700?style=for-the-badge&logo=google-chrome&logoColor=black" alt="Portfolio" /></a>`);
      if (socials.email) socialBadges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-8B5CF6?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>`);
      l.push(socialBadges.join('\n'));
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=FFD700&label=VISITORS+ENTERED" alt="Visitors" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">`,
    `  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD700,50:8B5CF6,100:EF4444&height=120&section=footer" width="100%" alt="Footer" />`,
    `</p>`,
    `\n<p align="center"><em>🎮 Thanks for visiting my profile! Drop a ⭐ if you liked a project! 🎮</em></p>`,
  ].join('\n');

  return body + '\n' + footer;
};
