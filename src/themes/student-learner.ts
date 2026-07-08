import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';
import type { SectionType } from '@/types/github.types';
import { assembleSections } from './assemble';

export const definition: ThemeDefinition = {
  id: 'student-learner',
  name: 'Student Learner',
  description: 'Fun, enthusiastic, learning-focused layout with goals checklists, progress tracking, and youthful energy.',
  category: 'fun',
  icon: 'GraduationCap',
  previewColors: {
    primary: '#6366F1',
    secondary: '#EC4899',
    accent: '#10B981',
    background: '#1e1e2e',
  },
  defaultConfig: {
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    accentColor: '#10B981',
    alignment: 'center',
    emojiLevel: 'heavy',
    showTypingAnimation: true,
    showContributionGraph: true,
    showTrophies: false,
    showQuote: true,
    showVisitorCounter: true,
    showSnakeAnimation: false,
  },
  statsTheme: 'dracula',
  badgeStyle: 'for-the-badge',
  sectionsSpec: {
    order: ['header', 'typing', 'about', 'goals-list', 'skills', 'stats', 'streak', 'languages', 'trophies', 'activity-graph', 'projects', 'quote', 'socials', 'visitor-counter'],
    enabled: ['header', 'typing', 'about', 'goals-list', 'skills', 'stats', 'streak', 'languages', 'activity-graph', 'quote', 'socials', 'visitor-counter'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'dracula';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:EC4899,100:10B981&height=200&section=header&text=${encodeURIComponent('👋 Hey, I\'m ' + (c.customTitle || name) + '!')}&fontSize=36&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🌱 Student Developer | Always Learning | Building Cool Stuff 🚀')}&descSize=14&descAlignY=55" width="100%" alt="Student Header" />`);
    l.push(`</p>\n`);
    blocks.set('header', l.join('\n'));
  }

  // TYPING
  {
    const typingLines = [
      `🌱 Currently learning new things!`,
      `📚 Computer Science Student`,
      `🚀 Passionate about coding`,
      `💡 Building projects to learn`,
      `🤝 Looking for study buddies!`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&height=45&lines=${linesParam}" alt="Student Typing" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('typing', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    l.push(`## 🙋‍♂️ About Me\n`);
    if (bio) l.push(`${bio}\n`);
    l.push(`Hey there! 👋 I'm a student developer who's passionate about technology and constantly learning new things. I love building projects, experimenting with new frameworks, and connecting with the developer community!\n`);
    l.push(`- 🎓 **Status:** Student Developer`);
    if (input.currentProject) l.push(`- 🔭 **Working on:** [${input.currentProject}](${input.currentProjectUrl || '#'})`);
    if (input.learning) l.push(`- 🌱 **Currently learning:** ${input.learning}`);
    if (input.collab) l.push(`- 🤝 **Looking to collaborate on:** ${input.collab}`);
    l.push(`- 💬 **Ask me about:** Anything tech-related, I love discussions!`);
    l.push(`- ⚡ **Fun fact:** I debug with print statements and I'm not ashamed! 😄`);
    l.push('');
    l.push(`---\n`);
    blocks.set('about', l.join('\n'));
  }

  // GOALS LIST
  {
    const l: string[] = [];
    l.push(`## 🌱 Currently Learning\n`);
    l.push(`I'm always expanding my knowledge! Here's what I'm focused on:\n`);
    if (input.learning) l.push(`> 📖 **${input.learning}**\n`);
    l.push(`### 2025 Learning Goals\n`);
    l.push(`- [x] Learn the fundamentals of web development`);
    l.push(`- [x] Build my first full-stack project`);
    l.push(`- [ ] Contribute to open source`);
    l.push(`- [ ] Learn cloud deployment (AWS/Vercel)`);
    l.push(`- [ ] Master a new programming language`);
    l.push(`- [ ] Build a mobile app`);
    l.push('');
    l.push(`---\n`);
    blocks.set('goals-list', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`## 🛠️ My Tech Stack\n`);
    l.push(`### 💪 Comfortable With\n`);
    l.push(`<p align="${c.alignment}">`);
    const comfortableSkills = skills.slice(0, Math.ceil(skills.length * 0.6));
    const comfBadges = comfortableSkills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-6366F1?style=for-the-badge" alt="${skill}" />`;
    });
    l.push(comfBadges.join('\n'));
    l.push(`</p>\n`);
    const learningSkills = skills.slice(Math.ceil(skills.length * 0.6));
    if (learningSkills.length > 0) {
      l.push(`### 📚 Currently Learning\n`);
      l.push(`<p align="${c.alignment}">`);
      const learnBadges = learningSkills.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-EC4899?style=for-the-badge" alt="${skill}" />`;
      });
      l.push(learnBadges.join('\n'));
      l.push(`</p>\n`);
    }
    l.push(`---\n`);
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`## 📊 My GitHub Stats\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=${statsTheme}&hide_border=true&show_icons=true&include_all_commits=true" alt="Stats" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('stats', l.join('\n'));
  }

  // STREAK
  {
    const l: string[] = [];
    l.push(`## 🔥 Commit Streak\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=${statsTheme}&hide_border=true" alt="Streak" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('streak', l.join('\n'));
  }

  // LANGUAGES
  {
    const l: string[] = [];
    l.push(`## 📋 Most Used Languages\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=${statsTheme}&hide_border=true&langs_count=6" alt="Languages" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('languages', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`## 🏆 Achievements Board\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=${statsTheme}&no_frame=true&no_bg=true" alt="Trophies" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // ACTIVITY GRAPH
  {
    const l: string[] = [];
    l.push(`## 📈 My Coding Journey\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=1e1e2e&color=6366F1&line=EC4899&point=10B981&area=true&hide_border=true" alt="Activity Graph" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('activity-graph', l.join('\n'));
  }

  // PROJECTS
  if (selectedRepos.length > 0) {
    const l: string[] = [];
    l.push(`## 💻 Projects I've Built\n`);
    l.push(`Here are some projects I've worked on while learning:\n`);
    l.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      l.push(`  <a href="https://github.com/${username}/${repo}">`);
      l.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=dracula&hide_border=true" alt="${repo}" />`);
      l.push(`  </a>`);
    });
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('projects', l.join('\n'));
  }

  // QUOTE
  {
    const l: string[] = [];
    l.push(`## 💭 Daily Motivation\n`);
    l.push(`<p align="center">`);
    l.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dracula" alt="Quote" />`);
    l.push(`</p>\n`);
    l.push(`---\n`);
    blocks.set('quote', l.join('\n'));
  }

  // SOCIALS
  {
    const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
    if (hasSocials) {
      const l: string[] = [];
      l.push(`## 🌐 Let's Be Friends!\n`);
      l.push(`<p align="center">`);
      const badges: string[] = [];
      if (socials.github) badges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-6366F1?style=for-the-badge&logo=github&logoColor=white" /></a>`);
      if (socials.linkedin) badges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-EC4899?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
      if (socials.twitter) badges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-10B981?style=for-the-badge&logo=twitter&logoColor=white" /></a>`);
      if (socials.portfolio) badges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>`);
      if (socials.email) badges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-EC4899?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
      l.push(badges.join('\n'));
      l.push(`</p>\n`);
      blocks.set('socials', l.join('\n'));
    }
  }

  // VISITOR
  {
    const l: string[] = [];
    l.push(`<p align="center">`);
    l.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=6366F1&label=PROFILE+VISITORS" alt="Views" />`);
    l.push(`</p>\n`);
    blocks.set('visitor-counter', l.join('\n'));
  }

  const body = assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);

  const footer = [
    `<p align="center">`,
    `  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:EC4899,100:10B981&height=120&section=footer" width="100%" alt="Footer" />`,
    `</p>`,
    `\n<p align="center">⭐ <em>Thanks for visiting! Let's learn and grow together! 🌱</em> ⭐</p>`,
  ].join('\n');

  return body + '\n' + footer;
};
