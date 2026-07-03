import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import { SKILL_BADGES } from '@/lib/markdown';

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
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Fun colorful banner
  // ═══════════════════════════════════════
  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:EC4899,100:10B981&height=200&section=header&text=${encodeURIComponent('👋 Hey, I\'m ' + (c.customTitle || name) + '!')}&fontSize=36&fontColor=ffffff&animation=fadeIn&fontAlignY=30&desc=${encodeURIComponent('🌱 Student Developer | Always Learning | Building Cool Stuff 🚀')}&descSize=14&descAlignY=55" width="100%" alt="Student Header" />`);
  lines.push(`</p>\n`);

  // ═══════════════════════════════════════
  // TYPING: Learning phrases
  // ═══════════════════════════════════════
  if (c.showTypingAnimation) {
    const typingLines = [
      `🌱 Currently learning new things!`,
      `📚 Computer Science Student`,
      `🚀 Passionate about coding`,
      `💡 Building projects to learn`,
      `🤝 Looking for study buddies!`,
    ];
    const linesParam = typingLines.map(l => encodeURIComponent(l)).join(';');
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=22&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&height=45&lines=${linesParam}" alt="Student Typing" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // ABOUT: Casual, friendly, emoji-heavy
  // ═══════════════════════════════════════
  lines.push(`## 🙋‍♂️ About Me\n`);
  if (bio) {
    lines.push(`${bio}\n`);
  }
  lines.push(`Hey there! 👋 I'm a student developer who's passionate about technology and constantly learning new things. I love building projects, experimenting with new frameworks, and connecting with the developer community!\n`);

  lines.push(`- 🎓 **Status:** Student Developer`);
  if (input.currentProject) {
    lines.push(`- 🔭 **Working on:** [${input.currentProject}](${input.currentProjectUrl || '#'})`);
  }
  if (input.learning) {
    lines.push(`- 🌱 **Currently learning:** ${input.learning}`);
  }
  if (input.collab) {
    lines.push(`- 🤝 **Looking to collaborate on:** ${input.collab}`);
  }
  lines.push(`- 💬 **Ask me about:** Anything tech-related, I love discussions!`);
  lines.push(`- ⚡ **Fun fact:** I debug with print statements and I'm not ashamed! 😄`);
  lines.push('');

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CURRENTLY LEARNING: Prominent section
  // ═══════════════════════════════════════
  lines.push(`## 🌱 Currently Learning\n`);
  lines.push(`I'm always expanding my knowledge! Here's what I'm focused on:\n`);

  if (input.learning) {
    lines.push(`> 📖 **${input.learning}**\n`);
  }

  lines.push(`### 2025 Learning Goals\n`);
  lines.push(`- [x] Learn the fundamentals of web development`);
  lines.push(`- [x] Build my first full-stack project`);
  lines.push(`- [ ] Contribute to open source`);
  lines.push(`- [ ] Learn cloud deployment (AWS/Vercel)`);
  lines.push(`- [ ] Master a new programming language`);
  lines.push(`- [ ] Build a mobile app`);
  lines.push('');

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // TECH STACK: "Skills I'm learning" presentation
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`## 🛠️ My Tech Stack\n`);

    lines.push(`### 💪 Comfortable With\n`);
    lines.push(`<p align="${c.alignment}">`);
    const comfortableSkills = skills.slice(0, Math.ceil(skills.length * 0.6));
    const comfBadges = comfortableSkills.map(skill => {
      const details = SKILL_BADGES[skill];
      if (details) {
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
      }
      return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-6366F1?style=for-the-badge" alt="${skill}" />`;
    });
    lines.push(comfBadges.join('\n'));
    lines.push(`</p>\n`);

    const learningSkills = skills.slice(Math.ceil(skills.length * 0.6));
    if (learningSkills.length > 0) {
      lines.push(`### 📚 Currently Learning\n`);
      lines.push(`<p align="${c.alignment}">`);
      const learnBadges = learningSkills.map(skill => {
        const details = SKILL_BADGES[skill];
        if (details) {
          return `  <img src="https://img.shields.io/badge/${encodeURIComponent(details.label)}-${details.color}?style=for-the-badge&logo=${details.logo}&logoColor=white" alt="${skill}" />`;
        }
        return `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-EC4899?style=for-the-badge" alt="${skill}" />`;
      });
      lines.push(learnBadges.join('\n'));
      lines.push(`</p>\n`);
    }

    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // STATS: Growth-focused
  // ═══════════════════════════════════════
  lines.push(`## 📊 My GitHub Stats\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/stats?username=${username}&theme=dracula&hide_border=true&show_icons=true&include_all_commits=true" alt="Stats" />`);
  lines.push(`</p>\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/streak?username=${username}&theme=dracula&hide_border=true" alt="Streak" />`);
  lines.push(`</p>\n`);
  lines.push(`<p align="center">`);
  lines.push(`  <img src="${baseUrl}/api/github/languages?username=${username}&theme=dracula&hide_border=true&langs_count=6" alt="Languages" />`);
  lines.push(`</p>\n`);

  lines.push(`---\n`);

  // ═══════════════════════════════════════
  // CONTRIBUTION GRAPH
  // ═══════════════════════════════════════
  if (c.showContributionGraph) {
    lines.push(`## 📈 My Coding Journey\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=1e1e2e&color=6366F1&line=EC4899&point=10B981&area=true&hide_border=true" alt="Activity Graph" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // PROJECTS: Learning projects
  // ═══════════════════════════════════════
  if (selectedRepos.length > 0) {
    lines.push(`## 💻 Projects I've Built\n`);
    lines.push(`Here are some projects I've worked on while learning:\n`);
    lines.push(`<p align="center">`);
    selectedRepos.forEach(repo => {
      lines.push(`  <a href="https://github.com/${username}/${repo}">`);
      lines.push(`    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=dracula&hide_border=true" alt="${repo}" />`);
      lines.push(`  </a>`);
    });
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // MOTIVATIONAL QUOTE
  // ═══════════════════════════════════════
  if (c.showQuote) {
    lines.push(`## 💭 Daily Motivation\n`);
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=dracula" alt="Quote" />`);
    lines.push(`</p>\n`);
    lines.push(`---\n`);
  }

  // ═══════════════════════════════════════
  // SOCIALS: Fun, friendly
  // ═══════════════════════════════════════
  const hasSocials = socials.github || socials.linkedin || socials.twitter || socials.portfolio || socials.email;
  if (hasSocials) {
    lines.push(`## 🌐 Let's Be Friends!\n`);
    lines.push(`<p align="center">`);
    const badges: string[] = [];
    if (socials.github) badges.push(`  <a href="https://github.com/${socials.github}"><img src="https://img.shields.io/badge/GitHub-6366F1?style=for-the-badge&logo=github&logoColor=white" /></a>`);
    if (socials.linkedin) badges.push(`  <a href="https://linkedin.com/in/${socials.linkedin}"><img src="https://img.shields.io/badge/LinkedIn-EC4899?style=for-the-badge&logo=linkedin&logoColor=white" /></a>`);
    if (socials.twitter) badges.push(`  <a href="https://twitter.com/${socials.twitter}"><img src="https://img.shields.io/badge/Twitter-10B981?style=for-the-badge&logo=twitter&logoColor=white" /></a>`);
    if (socials.portfolio) badges.push(`  <a href="${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio}"><img src="https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>`);
    if (socials.email) badges.push(`  <a href="mailto:${socials.email}"><img src="https://img.shields.io/badge/Email-EC4899?style=for-the-badge&logo=gmail&logoColor=white" /></a>`);
    lines.push(badges.join('\n'));
    lines.push(`</p>\n`);
  }

  // ═══════════════════════════════════════
  // VISITOR + FOOTER
  // ═══════════════════════════════════════
  if (c.showVisitorCounter) {
    lines.push(`<p align="center">`);
    lines.push(`  <img src="https://komarev.com/ghpvc/?username=${username}&style=for-the-badge&color=6366F1&label=PROFILE+VISITORS" alt="Views" />`);
    lines.push(`</p>\n`);
  }

  lines.push(`<p align="center">`);
  lines.push(`  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:EC4899,100:10B981&height=120&section=footer" width="100%" alt="Footer" />`);
  lines.push(`</p>`);
  lines.push(`\n<p align="center">⭐ <em>Thanks for visiting! Let's learn and grow together! 🌱</em> ⭐</p>`);

  return lines.join('\n');
};
