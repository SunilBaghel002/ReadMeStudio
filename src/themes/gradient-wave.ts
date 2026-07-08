import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections } from './assemble';

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
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'goals-list', 'skills', 'stats', 'trophies', 'activity-graph', 'snake-game', 'quote', 'projects', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'goals-list', 'skills', 'stats', 'trophies', 'activity-graph', 'snake-game', 'quote', 'socials', 'visitor-counter'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization } = input;
  const c = customization;
  
  const primaryClean = c.primaryColor.replace('#', '');
  const secondaryClean = c.secondaryColor.replace('#', '');
  const accentClean = c.accentColor.replace('#', '');
  const statsTheme = input.statsTheme || definition.statsTheme || 'dracula';

  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${primaryClean},${secondaryClean},${accentClean}&height=200&section=header&text=${encodeURIComponent(c.customTitle || name)}&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=${encodeURIComponent(c.customTagline || bio)}&descSize=16&descAlignY=55" width="100%" alt="Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const linesToUse = (input.typingLines && input.typingLines.length > 0)
      ? input.typingLines
      : [
          `Full Stack Developer`,
          `Open Source Enthusiast`,
          `Building things that matter`,
          `Always learning, always growing`,
        ];
    const linesParam = linesToUse.map(line => encodeURIComponent(line)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <a href="https://git.io/typing-svg">`);
    l.push(`    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=${primaryClean}&center=true&vCenter=true&width=700&height=50&lines=${linesParam}" alt="Typing SVG" />`);
    l.push(`  </a>`);
    l.push(`</p>\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT (Side-by-side with Coding GIF)
  {
    const l: string[] = [];
    l.push(`## 💫 About Me\n`);
    l.push(`<table>`);
    l.push(`  <tr>`);
    l.push(`    <td width="60%" style="vertical-align: top;">\n`);
    l.push('```javascript');
    l.push(`const developer = {`);
    l.push(`  name: "${name}",`);
    l.push(`  role: "${c.customTagline || 'Full Stack Developer'}",`);
    l.push(`  languages: [${skills.slice(0, 5).map(s => `"${s}"`).join(', ')}],`);
    if (input.currentProject) l.push(`  currentProject: "${input.currentProject}",`);
    if (input.learning) l.push(`  learning: "${input.learning}",`);
    l.push(`  funFact: "I code with coffee and lo-fi beats ☕🎵"`);
    l.push(`};`);
    l.push('```\n');
    l.push(`    </td>`);
    l.push(`    <td width="40%" align="center" style="vertical-align: middle;">`);
    l.push(`      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW51bm5mNWp3bnQwaHk1azlndmRycjM1cWRicTRiY2U5Mzgwd2c1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/L13yIHSgrC7yC7Ma5B/giphy.gif" width="180" alt="Coding GIF" />`);
    l.push(`    </td>`);
    l.push(`  </tr>`);
    l.push(`</table>\n`);
    
    if (bio) {
      l.push(`> ${bio}\n`);
    }
    
    const aboutEmojis = c.emojiLevel !== 'none';
    if (input.currentProject) l.push(`${aboutEmojis ? '🔭' : '-'} I'm currently working on [**${input.currentProject}**](${input.currentProjectUrl || '#'})`);
    if (input.learning) l.push(`${aboutEmojis ? '🌱' : '-'} I'm currently learning **${input.learning}**`);
    if (input.collab) l.push(`${aboutEmojis ? '👯' : '-'} I'm looking to collaborate on **${input.collab}**`);
    l.push('');
    l.push(`---\n`);
    blocks.set('about', l.join('\n'));
  }

  // GOALS LIST (Goals table)
  {
    const l: string[] = [];
    l.push(`## 🎯 2025 Learning Goals\n`);
    l.push(`| Goal | Status | Timeline |`);
    l.push(`|------|--------|----------|`);
    l.push(`| Master Next.js and Server Components | 📖 In Progress | Q3 2025 |`);
    l.push(`| Build 5+ open-source developer tool projects | 🚀 Planned | Q4 2025 |`);
    if (input.learning) {
      l.push(`| Expand knowledge in: **${input.learning}** | 📖 Learning | Ongoing |`);
    } else {
      l.push(`| Deepen knowledge in systems programming & Rust | 🌟 Ongoing | 2025 |`);
    }
    l.push('');
    l.push(`---\n`);
    blocks.set('goals-list', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## 🛠️ Tech Stack\n`);
    l.push(`<p align="${c.alignment}">`);
    const badges = skills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=plastic&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-${primaryClean}?style=plastic" alt="${skill}" />`;
    });
    l.push(badges.join('\n'));
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('skills', l.join('\n'));
  }

  // STATS (Stacked vertically using external shion.dev / demolab APIs)
  {
    const l: string[] = [];
    l.push(`## 📊 GitHub Stats\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-stats.shion.dev/api?username=${username}&theme=${statsTheme}&hide_border=true&include_all_commits=true&count_private=true" alt="GitHub Stats" />`);
    l.push(`  <br/>`);
    l.push(`  <img src="https://streak-stats.demolab.com/?user=${username}&theme=${statsTheme}&hide_border=true" alt="GitHub Streak" />`);
    l.push(`  <br/>`);
    l.push(`  <img src="https://github-readme-stats.shion.dev/api/top-langs/?username=${username}&theme=${statsTheme}&hide_border=true&include_all_commits=true&count_private=true&layout=compact" alt="Top Languages" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('stats', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 GitHub Trophies\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${statsTheme}&no-frame=true&no-bg=true&margin-w=4&margin-h=4" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 Contribution Graph\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=0d1117&color=${primaryClean}&line=${secondaryClean}&point=${accentClean}&area=true&hide_border=true" alt="Contribution Graph" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // SNAKE
  {
    const l: string[] = [];
    l.push(`## 🐍 Contribution Snake\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-snake-dark.svg" alt="Snake animation" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('snake-game', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## ✍️ Random Dev Quote\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Dev Quote" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('quote', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 💻 Featured Projects\n`);
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=${statsTheme}&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('projects', l.join('\n'));
  }

  // SOCIALS
  {
    const socialBadges: string[] = [];
    if (socials.github) socialBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/${socials.github})`);
    if (socials.linkedin) socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${socials.linkedin})`);
    if (socials.twitter) socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${socials.twitter})`);
    if (socials.portfolio) socialBadges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
    if (socials.email) socialBadges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${socials.email})`);
    if (socialBadges.length > 0) {
      const l: string[] = [];
      l.push(`## 🌐 Connect With Me\n`);
      l.push(`<p align="center">`);
      l.push(`  ${socialBadges.join(' ')}`);
      l.push(`</p>\n`);
      l.push(`---\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR COUNTER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=${primaryClean}" alt="Profile Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  // Assemble in user's order, filtered by enabled sections
  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  // Footer (always rendered)
  const footer = [
    `<p align="center">`,
    `  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${primaryClean},${secondaryClean},${accentClean}&height=120&section=footer" width="100%" alt="Footer" />`,
    `</p>`,
  ].join('\n');

  return body + '\n' + footer;
}
