import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

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
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: ASCII art terminal banner
  // ═══════════════════════════════════════
  lines.push('```');
  lines.push(`╔══════════════════════════════════════════════════════════════════╗`);
  lines.push(`║                                                                ║`);
  const displayName = (c.customTitle || name).toUpperCase();
  const padding = Math.max(0, 64 - displayName.length);
  const padLeft = Math.floor(padding / 2);
  const padRight = padding - padLeft;
  lines.push(`║${' '.repeat(padLeft)}${displayName}${' '.repeat(padRight)}║`);
  const tagline = c.customTagline || bio || 'Software Developer';
  const tagPadding = Math.max(0, 64 - tagline.length);
  const tagPadLeft = Math.floor(tagPadding / 2);
  const tagPadRight = tagPadding - tagPadLeft;
  lines.push(`║${' '.repeat(tagPadLeft)}${tagline}${' '.repeat(tagPadRight)}║`);
  lines.push(`║                                                                ║`);
  lines.push(`╚══════════════════════════════════════════════════════════════════╝`);
  lines.push('```\n');

  // ═══════════════════════════════════════
  // TYPING: Terminal command style
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    lines.push(`<p align="left">`);
    const typingLines = [
      `root@github:~$ whoami`,
      `> ${name} — ${tagline}`,
      `root@github:~$ cat /etc/skills`,
      `> Loading developer profile...`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=20&duration=2500&pause=800&color=00FF00&vCenter=true&width=600&height=40&lines=${linesParam}" alt="Terminal Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // ABOUT: Terminal whoami output
  // ═══════════════════════════════════════
  lines.push(`## \`> System Profile\`\n`);
  lines.push('```bash');
  lines.push(`root@github:~$ whoami`);
  lines.push(`# ============================================`);
  lines.push(`# USER:        ${name}`);
  lines.push(`# ROLE:        ${tagline}`);
  lines.push(`# LOCATION:    Earth`);
  lines.push(`# GITHUB:      github.com/${username}`);
  if (input.currentProject) {
    lines.push(`# PROJECT:     ${input.currentProject}`);
  }
  if (input.learning) {
    lines.push(`# LEARNING:    ${input.learning}`);
  }
  lines.push(`# STATUS:      Online & Coding...`);
  lines.push(`# ============================================`);
  lines.push('```\n');

  if (bio) {
    lines.push('```');
    lines.push(`> ${bio}`);
    lines.push('```\n');
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // TECH STACK: Collapsible terminal sections
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## \`> cat /etc/tech-stack\`\n`);

    // Categorize skills
    const frontendSkills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'Bootstrap', 'Sass', 'FramerMotion', 'Figma', 'Vite', 'Three.js'];
    const backendSkills = ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'Kotlin', 'Go', 'Rust', 'Ruby', 'PHP', 'GraphQL', 'C', 'FastAPI'];
    const dbSkills = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'];
    const toolSkills = ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Vercel', 'Netlify', 'Heroku', 'Jest', 'Nginx'];

    const renderCategory = (title: string, dirName: string, categoryList: string[]) => {
      const matching = skills.filter(s => categoryList.includes(s));
      if (matching.length === 0) return;
      lines.push(`<details>`);
      lines.push(`<summary><code>📁 ${dirName}/</code> — ${title}</summary>\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=flat-square&logo=${details.logo}&logoColor=white)`;
        }
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-00FF00?style=flat-square)`;
      });
      lines.push(badges.join(' '));
      lines.push(`\n</details>\n`);
    };

    renderCategory('Frontend Technologies', 'frontend', frontendSkills);
    renderCategory('Backend Technologies', 'backend', backendSkills);
    renderCategory('Databases & ORMs', 'databases', dbSkills);
    renderCategory('DevOps & Tools', 'devops-tools', toolSkills);

    // Uncategorized
    const allCategorized = [...frontendSkills, ...backendSkills, ...dbSkills, ...toolSkills];
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) {
      renderCategory('Other Tools', 'misc', uncategorized);
    }

    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Matrix/terminal green theme
  // ═══════════════════════════════════════
  lines.push(`## \`> system-metrics\`\n`);
  lines.push('```');
  lines.push(`╔══════════════════════════════════╗`);
  lines.push(`║     DEVELOPER PERFORMANCE LOG    ║`);
  lines.push(`╚══════════════════════════════════╝`);
  lines.push('```\n');

  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=merko&hide_border=true&show_icons=true&include_all_commits=true" alt="GitHub Stats" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=merko&hide_border=true" alt="Streak Stats" />`);
  lines.push(`</p>\n`);

  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=merko&hide_border=true&langs_count=8" alt="Top Languages" />`);
  lines.push(`</p>\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CONTRIBUTION GRAPH: Matrix green
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## \`> git log --graph\`\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0a0f0d&color=00ff00&line=39ff14&point=ffffff&area=true&hide_border=true" alt="Activity Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // FEATURED REPOS
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## \`> ls ~/projects/\`\n`);
    lines.push('```bash');
    selectedRepos.forEach(repo => {
      lines.push(`drwxr-xr-x  ${username}  ${repo}/`);
    });
    lines.push('```\n');

    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=merko&hide_border=true" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // DEV QUOTE
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## \`> fortune | cowsay\`\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=merko" alt="Hacker Quote" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS: JSON format
  // ═══════════════════════════════════════
  const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
  if (hasSocials) {
    lines.push(`## \`> cat ~/.config/socials.json\`\n`);
    lines.push('```json');
    lines.push(`{`);
    const entries: string[] = [];
    if (socials.github) entries.push(`  "github": "https://github.com/${socials.github}"`);
    if (socials.linkedin) entries.push(`  "linkedin": "https://linkedin.com/in/${socials.linkedin}"`);
    if (socials.twitter) entries.push(`  "twitter": "https://twitter.com/${socials.twitter}"`);
    if (socials.portfolio) entries.push(`  "portfolio": "${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"`);
    if (socials.email) entries.push(`  "email": "mailto:${socials.email}"`);
    lines.push(entries.join(',\n'));
    lines.push(`}`);
    lines.push('```\n');
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // SYSTEM UPTIME / VISITOR
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push('```');
    lines.push(`root@github:~$ uptime`);
    lines.push(`> System has been online since 2020. Currently serving visitors:`);
    lines.push('```\n');
    lines.push(`<p align="left">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=00ff00" alt="Visitor Count" />`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  lines.push('```');
  lines.push(`╔══════════════════════════════════════════════════════════════════╗`);
  lines.push(`║  Thanks for visiting! Star a repo if you found something cool  ║`);
  lines.push(`╚══════════════════════════════════════════════════════════════════╝`);
  lines.push('```');

  return lines.join('\n');
};
