import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

export const definition: ThemeDefinition = {
  id: 'corporate-pro',
  name: 'Corporate Pro',
  description: 'Professional business profile with formal language, structured categories, and LinkedIn-style presentation.',
  category: 'professional',
  icon: 'Briefcase',
  previewColors: {
    primary: '#0077B5',
    secondary: '#004182',
    accent: '#00A0DC',
    background: '#ffffff',
  },
  defaultConfig: {
    primaryColor: '#0077B5',
    secondaryColor: '#004182',
    accentColor: '#00A0DC',
    alignment: 'left',
    emojiLevel: 'none',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: false,
    showQuote: false,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'default',
  badgeStyle: 'for-the-badge',
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Professional corporate banner
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=rect&color=0077B5&height=120&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=36&fontColor=ffffff&fontAlignY=50" width="100%" alt="Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // PROFESSIONAL TITLE BLOCK
  // ═══════════════════════════════════════
  lines.push(`<div align="center">\n`);
  lines.push(`  <img src="https://github.com/${username}.png" alt="Profile" width="120" height="120" style="border-radius: 50%; border: 3px solid #0077B5" />\n`);
  lines.push(`  ### ${c.customTitle || name}`);
  lines.push(`  **${c.customTagline || bio || 'Software Engineer'}**\n`);
  lines.push(`</div>\n`);

  // Typing: corporate style
  if (c.showTypingAnimation) {
    const typingLines = [
      `Software Engineer`,
      `Full Stack Developer`,
      `Technology Consultant`,
      `Open to Opportunities`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=20&duration=4000&pause=1500&color=0077B5&center=true&vCenter=true&width=500&height=35&lines=${linesParam}" alt="Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // PROFESSIONAL SUMMARY
  // ═══════════════════════════════════════
  lines.push(`## Professional Summary\n`);
  if (bio) {
    lines.push(`${bio}\n`);
  }
  lines.push(`Experienced software professional with a proven track record of delivering high-quality solutions. Passionate about clean architecture, best practices, and continuous learning.\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CORE COMPETENCIES
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## Core Competencies\n`);

    // Categorize skills
    const categories: { title: string; match: string[] }[] = [
      { title: 'Programming Languages', match: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby', 'PHP', 'Kotlin', 'C', 'Solidity'] },
      { title: 'Frontend Frameworks', match: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'TailwindCSS', 'Bootstrap', 'Sass', 'FramerMotion', 'Three.js'] },
      { title: 'Backend & APIs', match: ['Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'Spring', 'GraphQL', 'FastAPI'] },
      { title: 'Databases & Storage', match: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Prisma', 'SQLite'] },
      { title: 'DevOps & Cloud', match: ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Vercel', 'Netlify', 'Heroku', 'Nginx'] },
    ];

    categories.forEach(cat => {
      const matching = skills.filter(s => cat.match.includes(s));
      if (matching.length === 0) return;
      lines.push(`### ${cat.title}\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        }
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-0077B5?style=for-the-badge)`;
      });
      lines.push(badges.join(' '));
      lines.push('');
    });

    // Uncategorized
    const allCategorized = categories.flatMap(c => c.match);
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) {
      lines.push(`### Additional Tools\n`);
      const badges = uncategorized.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        }
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-0077B5?style=for-the-badge)`;
      });
      lines.push(badges.join(' '));
      lines.push('');
    }

    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // CAREER HIGHLIGHTS / FOCUS AREAS
  // ═══════════════════════════════════════
  const hasWorkingOn = input.currentProject || input.learning || input.collab;
  if (hasWorkingOn) {
    lines.push(`## Current Focus\n`);
    lines.push(`| Area | Details |`);
    lines.push(`|------|---------|`);
    if (input.currentProject) lines.push(`| **Active Project** | [${input.currentProject}](${input.currentProjectUrl || '#'}) |`);
    if (input.learning) lines.push(`| **Professional Development** | ${input.learning} |`);
    if (input.collab) lines.push(`| **Collaboration Interests** | ${input.collab} |`);
    lines.push('');
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // PERFORMANCE METRICS
  // ═══════════════════════════════════════
  lines.push(`## Performance Metrics\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=default&hide_border=true&show_icons=true&include_all_commits=true&bg_color=ffffff&title_color=0077B5&text_color=333333&icon_color=0077B5" alt="GitHub Stats" />`);
  lines.push(`</p>\n`);

  if (c.showContributionGraph) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=default&hide_border=true&ring=0077B5&fire=004182&currStreakLabel=0077B5" alt="Streak" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // FEATURED PROJECTS (as table)
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## Recent Projects\n`);
    lines.push(`| Project | Description | Link |`);
    lines.push(`|---------|-------------|------|`);
    selectedRepos.forEach(repo => {
      lines.push(`| **${repo}** | Open source project | [View Repository](https://github.com/${username}/${repo}) |`);
    });
    lines.push('');
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // CONTACT / SOCIALS: Professional style
  // ═══════════════════════════════════════
  const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
  if (hasSocials) {
    lines.push(`## Contact & Professional Networks\n`);
    lines.push(`<p align="center">`);

    const socialBadges: string[] = [];
    if (socials.linkedin) socialBadges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`);
    if (socials.github) socialBadges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>`);
    if (socials.portfolio) socialBadges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-004182?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" /></a>`);
    if (socials.email) socialBadges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>`);
    if (socials.twitter) socialBadges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>`);

    lines.push(socialBadges.join('\n'));
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR COUNTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=0077B5" alt="Profile Views" />`);
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <em>Open to new opportunities and collaborations. Feel free to reach out.</em>`);
  lines.push(`</p>`);

  return lines.join('\n');
};
