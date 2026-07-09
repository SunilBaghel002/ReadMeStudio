import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections, getStatsUrl, getStreakUrl, getLanguagesUrl, getTrophiesUrl } from './assemble';

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
    background: '#0d1117',
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
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'skills', 'working-on', 'stats', 'streak', 'languages', 'trophies', 'projects', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'skills', 'stats', 'streak', 'socials', 'visitor-counter'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'default';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=rect&color=0077B5&height=120&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=36&fontColor=ffffff&fontAlignY=50" width="100%" alt="Header" />`);
    l.push(`</p>\n`);
    l.push(`<div align="center">\n`);
    l.push(`  <img src="https://github.com/${username}.png" alt="Profile" width="120" height="120" style="border-radius: 50%; border: 3px solid #0077B5" />\n`);
    l.push(`  ### ${c.customTitle || name}`);
    l.push(`  **${c.customTagline || bio || 'Software Engineer'}**\n`);
    l.push(`</div>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [`Software Engineer`, `Full Stack Developer`, `Technology Consultant`, `Open to Opportunities`];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=500&size=20&duration=4000&pause=1500&color=0077B5&center=true&vCenter=true&width=500&height=35&lines=${linesParam}" alt="Typing" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## Professional Summary\n`);
    if (bio) l.push(`${bio}\n`);
    l.push(`Experienced software professional with a proven track record of delivering high-quality solutions. Passionate about clean architecture, best practices, and continuous learning.\n`);
    l.push(`---\n`);
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## Core Competencies\n`);
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
      l.push(`### ${cat.title}\n`);
      const badges = matching.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-0077B5?style=for-the-badge)`;
      });
      l.push(badges.join(' '));
      l.push('');
    });
    const allCategorized = categories.flatMap(c => c.match);
    const uncategorized = skills.filter(s => !allCategorized.includes(s));
    if (uncategorized.length > 0) {
      l.push(`### Additional Tools\n`);
      const badges = uncategorized.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white)`;
        return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-0077B5?style=for-the-badge)`;
      });
      l.push(badges.join(' '));
      l.push('');
    }
    l.push(`---\n`);
    blocks.set('skills', l.join('\n'));
  }

  // WORKING-ON
  {
    const hasWorkingOn = input.currentProject || input.learning || input.collab;
    if (hasWorkingOn) {
      const l: string[] = [];
      l.push(`## Current Focus\n`);
      l.push(`| Area | Details |`);
      l.push(`|------|---------|`);
      if (input.currentProject) l.push(`| **Active Project** | [${input.currentProject}](${input.currentProjectUrl || '#'}) |`);
      if (input.learning) l.push(`| **Professional Development** | ${input.learning} |`);
      if (input.collab) l.push(`| **Collaboration Interests** | ${input.collab} |`);
      l.push('');
      l.push(`---\n`);
      blocks.set('working-on', l.join('\n'));
    }
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## Performance Metrics\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStatsUrl(input, 'default')}" alt="GitHub Stats" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## Streak Metrics\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getStreakUrl(input, 'default')}" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## Language Distribution\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getLanguagesUrl(input, 'default')}" alt="Languages" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('languages', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## Recent Projects\n`);
    l.push(`| Project | Description | Link |`);
    l.push(`|---------|-------------|------|`);
    selectedRepos.forEach(repo => {
      l.push(`| **${repo}** | Open source project | [View Repository](https://github.com/${username}/${repo}) |`);
    });
    l.push('');
    l.push(`---\n`);
    blocks.set('projects', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 GitHub Trophies\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${getTrophiesUrl(input, 'default')}" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // SOCIALS
  {
    const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
    if (hasSocials) {
      const l: string[] = [];
      l.push(`## Contact & Professional Networks\n`);
      l.push(`<p align="center">`);
      const socialBadges: string[] = [];
      if (socials.linkedin) socialBadges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>`);
      if (socials.github) socialBadges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>`);
      if (socials.portfolio) socialBadges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-004182?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" /></a>`);
      if (socials.email) socialBadges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>`);
      if (socials.twitter) socialBadges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" /></a>`);
      l.push(socialBadges.join('\n'));
      l.push(`</p>\n`);
      l.push(`---\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=flat-square&color=0077B5" alt="Profile Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">`,
    `  <em>Open to new opportunities and collaborations. Feel free to reach out.</em>`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
