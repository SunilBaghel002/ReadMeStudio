import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections } from './assemble';

export const definition: ThemeDefinition = {
  id: 'creative-portfolio',
  name: 'Creative Portfolio',
  description: 'Artistic, visual-first layout with skillicons.dev grid, colorful gradients, and portfolio-driven presentation.',
  category: 'creative',
  icon: 'Palette',
  previewColors: {
    primary: '#E91E63',
    secondary: '#9C27B0',
    accent: '#00BCD4',
    background: '#1a1a2e',
  },
  defaultConfig: {
    primaryColor: '#E91E63',
    secondaryColor: '#9C27B0',
    accentColor: '#00BCD4',
    alignment: 'center',
    emojiLevel: 'heavy',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: false,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'radical',
  badgeStyle: 'for-the-badge',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'stats', 'trophies', 'projects', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
  },
};

const CREATIVE_DIV = `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=soft&color=0:E91E63,100:00BCD4&height=3" width="100%" alt="" />\n</p>\n`;

const SKILLICONS_MAP: Record<string, string> = {
  HTML: 'html', CSS: 'css', JavaScript: 'js', TypeScript: 'ts',
  React: 'react', 'Next.js': 'nextjs', Vue: 'vue', Angular: 'angular',
  Svelte: 'svelte', TailwindCSS: 'tailwind', Bootstrap: 'bootstrap', Sass: 'sass',
  'Node.js': 'nodejs', Express: 'express', NestJS: 'nestjs', Python: 'py',
  Django: 'django', Flask: 'flask', Java: 'java', Spring: 'spring',
  Kotlin: 'kotlin', Go: 'go', Rust: 'rust', Ruby: 'ruby',
  PHP: 'php', GraphQL: 'graphql', C: 'c', Figma: 'figma',
  PostgreSQL: 'postgres', MongoDB: 'mongodb', MySQL: 'mysql', Redis: 'redis',
  Firebase: 'firebase', Supabase: 'supabase', Prisma: 'prisma', SQLite: 'sqlite',
  Docker: 'docker', Kubernetes: 'kubernetes', Git: 'git', 'GitHub Actions': 'githubactions',
  Linux: 'linux', AWS: 'aws', Vercel: 'vercel', Netlify: 'netlify',
  Heroku: 'heroku', Vite: 'vite', 'Three.js': 'threejs', Jest: 'jest',
  Nginx: 'nginx', Redux: 'redux', WordPress: 'wordpress',
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
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:E91E63,30:9C27B0,60:673AB7,100:00BCD4&height=220&section=header&text=${encodeURIComponent('🎨 ' + (c.customTitle || name))}&fontSize=44&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('✨ ' + (c.customTagline || 'Creative Developer & Designer') + ' ✨')}&descSize=18&descAlignY=55" width="100%" alt="Creative Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [
      `🎨 Designing beautiful interfaces`,
      `✨ Crafting pixel-perfect experiences`,
      `🌈 Full Stack Creative Developer`,
      `💡 Turning ideas into reality`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Caveat&weight=700&size=28&duration=3000&pause=1000&color=E91E63&center=true&vCenter=true&width=600&height=55&lines=${linesParam}" alt="Creative Typing" />`);
    l.push(`</p>\n`);
    l.push(CREATIVE_DIV);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## 🎨 About Me\n`);
    l.push(`<table>`);
    l.push(`<tr>`);
    l.push(`<td width="50%">\n`);
    if (bio) l.push(`*${bio}*\n`);
    l.push(`I'm a creative developer who bridges the gap between design and code. Every project is a canvas, and every line of code is a brushstroke. 🖌️\n`);
    if (input.currentProject) l.push(`🔭 Currently creating: **${input.currentProject}**`);
    if (input.learning) l.push(`🌱 Exploring: **${input.learning}**`);
    if (input.collab) l.push(`🤝 Let's create together: **${input.collab}**`);
    l.push('');
    l.push(`</td>`);
    l.push(`<td width="50%" align="center">\n`);
    l.push(`<img src="https://github.com/${username}.png" width="200" style="border-radius: 16px" alt="Avatar" />\n`);
    l.push(`</td>`);
    l.push(`</tr>`);
    l.push(`</table>\n`);
    l.push(CREATIVE_DIV);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## 🛠️ Creative Toolkit\n`);
    const skilliconIds = skills.map(s => SKILLICONS_MAP[s]).filter(Boolean);
    if (skilliconIds.length > 0) {
      l.push(`<p align="center">`);
      l.push(`  <img src="https://skillicons.dev/icons?i=${skilliconIds.join(',')}&perline=8" alt="Skills" />`);
      l.push(`</p>\n`);
    }
    const unmapped = skills.filter(s => !SKILLICONS_MAP[s]);
    if (unmapped.length > 0) {
      l.push(`<p align="center">`);
      const badges = unmapped.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-E91E63?style=for-the-badge" alt="${skill}" />`;
      });
      l.push(badges.join('\n'));
      l.push(`</p>\n`);
    }
    l.push(CREATIVE_DIV);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## 📊 Creative Metrics\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=radical&hide_border=true&show_icons=true&include_all_commits=true" alt="Stats" />`);
    l.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=radical&hide_border=true" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=radical&hide_border=true&langs_count=8" alt="Languages" />`);
    l.push(`</p>\n`);
    l.push(CREATIVE_DIV);
    blocks.set('stats', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 Achievements & Badges\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=${statsTheme}&no_frame=true&no_bg=true" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(CREATIVE_DIV);
    blocks.set('trophies', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 🖼️ Featured Work\n`);
    l.push(`| Project | Link |`);
    l.push(`|---------|------|`);
    selectedRepos.forEach(repo => {
      l.push(`| **${repo}** | [View on GitHub →](https://github.com/${username}/${repo}) |`);
    });
    l.push('');
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=radical&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(CREATIVE_DIV);
    blocks.set('projects', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 Activity Canvas\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=1a1a2e&color=E91E63&line=00BCD4&point=9C27B0&area=true&hide_border=true" alt="Activity Graph" />`);
    l.push(`</p>\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## 💭 Inspiration\n`);
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
      l.push(`## 🌈 Let's Connect\n`);
      l.push(`<p align="center">`);
      const badges: string[] = [];
      if (socials.github) badges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-E91E63?style=for-the-badge&logo=github&logoColor=white" /></a>`);
      if (socials.linkedin) badges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-9C27B0?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
      if (socials.twitter) badges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-00BCD4?style=for-the-badge&logo=twitter&logoColor=white" /></a>`);
      if (socials.portfolio) badges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-673AB7?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>`);
      if (socials.email) badges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-E91E63?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
      l.push(badges.join('\n'));
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=E91E63" alt="Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">`,
    `  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:E91E63,30:9C27B0,60:673AB7,100:00BCD4&height=150&section=footer" width="100%" alt="Footer" />`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
