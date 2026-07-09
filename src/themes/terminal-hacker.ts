import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections, getStatsUrl, getStreakUrl, getLanguagesUrl, getTrophiesUrl } from './assemble';

export const definition: ThemeDefinition = {
  id: 'terminal-hacker',
  name: 'Terminal Hacker',
  description: 'Hacker aesthetic with ASCII art, terminal commands, monospace everything, and matrix-green styling.',
  category: 'technical',
  icon: 'Terminal',
  previewColors: {
    primary: '#00FF00',
    secondary: '#0D0D0D',
    accent: '#39FF14',
    background: '#0a0f0d',
  },
  defaultConfig: {
    primaryColor: '#00FF00',
    secondaryColor: '#0D0D0D',
    accentColor: '#39FF14',
    alignment: 'left',
    emojiLevel: 'none',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: false,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'merko',
  badgeStyle: 'flat-square',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'languages', 'trophies', 'activity-graph', 'projects', 'quote', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'merko';
  const c = customization;
  const tagline = c.customTagline || bio || 'Software Developer';
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push('```');
    l.push(`╔══════════════════════════════════════════════════════════════════╗`);
    l.push(`║                                                                ║`);
    const displayName = (c.customTitle || name).toUpperCase();
    const padding = Math.max(0, 64 - displayName.length);
    const padLeft = Math.floor(padding / 2);
    const padRight = padding - padLeft;
    l.push(`║${' '.repeat(padLeft)}${displayName}${' '.repeat(padRight)}║`);
    const tagPadding = Math.max(0, 64 - tagline.length);
    const tagPadLeft = Math.floor(tagPadding / 2);
    const tagPadRight = tagPadding - tagPadLeft;
    l.push(`║${' '.repeat(tagPadLeft)}${tagline}${' '.repeat(tagPadRight)}║`);
    l.push(`║                                                                ║`);
    l.push(`╚══════════════════════════════════════════════════════════════════╝`);
    l.push('```\n');
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [
      `root@github:~$ whoami`,
      `> ${name} — ${tagline}`,
      `root@github:~$ cat /etc/skills`,
      `> Loading developer profile...`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="left">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=2500&pause=800&color=00FF00&vCenter=true&width=600&height=40&lines=${linesParam}" alt="Terminal Typing" />`);
    l.push(`</p>\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`---\n`);
    l.push(`## \`> System Profile\`\n`);
    l.push('```bash');
    l.push(`root@github:~$ whoami`);
    l.push(`# ============================================`);
    l.push(`# USER:        ${name}`);
    l.push(`# ROLE:        ${tagline}`);
    l.push(`# LOCATION:    Earth`);
    l.push(`# GITHUB:      github.com/${username}`);
    if (input.currentProject) l.push(`# PROJECT:     ${input.currentProject}`);
    if (input.learning) l.push(`# LEARNING:    ${input.learning}`);
    l.push(`# STATUS:      Online & Coding...`);
    l.push(`# ============================================`);
    l.push('```\n');
    if (bio) {
      l.push('```');
      l.push(`> ${bio}`);
      l.push('```\n');
    }
    l.push(`---\n`);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## \`> cat /etc/tech-stack\`\n`);
    const frontendSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'Bootstrap', 'Sass', 'FramerMotion', 'Figma', 'Vite', 'Three.js'];
    const backendSkills = ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'Kotlin', 'Go', 'Rust', 'Ruby', 'PHP', 'GraphQL', 'C', 'FastAPI'];
    const dbSkills = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'];
    const toolSkills = ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Vercel', 'Netlify', 'Heroku', 'Jest', 'Nginx'];

    const renderCategory = (title: string, dirName: string, categoryList: string[]) => {
      const matching = skills.filter(s => categoryList.includes(s));
      if (matching.length === 0) return;
      l.push(`<details>`);
      l.push(`<summary><code>📁 ${dirName}/</code> — ${title}</summary>\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=flat-square&logo=${details.logo}&logoColor=white)`;
        }
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-00FF00?style=flat-square)`;
      });
      l.push(badges.join(' '));
      l.push(`\n</details>\n`);
    };

    renderCategory('Frontend Technologies', 'frontend', frontendSkills);
    renderCategory('Backend Technologies', 'backend', backendSkills);
    renderCategory('Databases & ORMs', 'databases', dbSkills);
    renderCategory('DevOps & Tools', 'devops-tools', toolSkills);
    const allCategorized = [...frontendSkills, ...backendSkills, ...dbSkills, ...toolSkills];
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) renderCategory('Other Tools', 'misc', uncategorized);
    l.push(`---\n`);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## \`> system-metrics\`\n`);
    l.push('```');
    l.push(`╔══════════════════════════════════╗`);
    l.push(`║     DEVELOPER PERFORMANCE LOG    ║`);
    l.push(`╚══════════════════════════════════╝`);
    l.push('```\n');
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStatsUrl(input, 'merko')}" alt="GitHub Stats" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## \`> streak-analyzer\`\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStreakUrl(input, 'merko')}" alt="Streak Stats" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## \`> language-breakdown\`\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getLanguagesUrl(input, 'merko')}" alt="Top Languages" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('languages', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## \`> loot-inventory --show-trophies\`\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getTrophiesUrl(input, 'merko')}" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## \`> git log --graph\`\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0a0f0d&color=00ff00&line=39ff14&point=ffffff&area=true&hide_border=true" alt="Activity Graph" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## \`> ls ~/projects/\`\n`);
    l.push('```bash');
    selectedRepos.forEach(repo => l.push(`drwxr-xr-x  ${username}  ${repo}/`));
    l.push('```\n');
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=merko&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('projects', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## \`> fortune | cowsay\`\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=merko" alt="Hacker Quote" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('quote', l.join('\n'));
  }

  // SOCIALS
  {
    const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
    if (hasSocials) {
      const l: string[] = [];
      l.push(`## \`> cat ~/.config/socials.json\`\n`);
      l.push('```json');
      l.push(`{`);
      const entries: string[] = [];
      if (socials.github) entries.push(`  "github": "https://github.com/${socials.github}"`);
      if (socials.linkedin) entries.push(`  "linkedin": "https://linkedin.com/in/${socials.linkedin}"`);
      if (socials.twitter) entries.push(`  "twitter": "https://twitter.com/${socials.twitter}"`);
      if (socials.portfolio) entries.push(`  "portfolio": "${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"`);
      if (socials.email) entries.push(`  "email": "mailto:${socials.email}"`);
      l.push(entries.join(',\n'));
      l.push(`}`);
      l.push('```\n');
      l.push(`---\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push('```');
    l.push(`root@github:~$ uptime`);
    l.push(`> System has been online since 2020. Currently serving visitors:`);
    l.push('```\n');
    l.push(`<p align="left">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=00ff00" alt="Visitor Count" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    '```',
    `╔══════════════════════════════════════════════════════════════════╗`,
    `║  Thanks for visiting! Star a repo if you found something cool  ║`,
    `╚══════════════════════════════════════════════════════════════════╝`,
    '```',
  ].join('\n');

  return body + '\n' + footer;
};
