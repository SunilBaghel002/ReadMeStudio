import { BuilderSection, LanguageStat, GitHubRepo, ReadmeStyle } from '@/types/github.types';

// Map of common skills to their shields.io configurations (name, color, official icon logo)
export const SKILL_BADGES: Record<string, { label: string; color: string; logo: string }> = {
  // Frontend
  HTML: { label: 'HTML5', color: 'E34F26', logo: 'html5' },
  CSS: { label: 'CSS3', color: '1572B6', logo: 'css3' },
  JavaScript: { label: 'JavaScript', color: 'F7DF1E', logo: 'javascript' },
  TypeScript: { label: 'TypeScript', color: '3178C6', logo: 'typescript' },
  React: { label: 'React', color: '61DAFB', logo: 'react' },
  'Next.js': { label: 'Next.js', color: '000000', logo: 'nextdotjs' },
  Vue: { label: 'Vue.js', color: '4FC08D', logo: 'vuedotjs' },
  Angular: { label: 'Angular', color: 'DD0031', logo: 'angular' },
  Svelte: { label: 'Svelte', color: 'FF3E00', logo: 'svelte' },
  TailwindCSS: { label: 'TailwindCSS', color: '06B6D4', logo: 'tailwindcss' },
  Bootstrap: { label: 'Bootstrap', color: '7952B3', logo: 'bootstrap' },
  Sass: { label: 'Sass', color: 'CC6699', logo: 'sass' },
  FramerMotion: { label: 'Framer Motion', color: '0055FF', logo: 'framer' },
  Figma: { label: 'Figma', color: 'F24E1E', logo: 'figma' },
  Vite: { label: 'Vite', color: '646CFF', logo: 'vite' },
  'Three.js': { label: 'Three.js', color: '000000', logo: 'threedotjs' },
  'React Router': { label: 'React Router', color: 'CA4245', logo: 'reactrouter' },
  'Context-API': { label: 'Context API', color: '61DAFB', logo: 'react' },
  'Chart.js': { label: 'Chart.js', color: 'F5788D', logo: 'chartdotjs' },

  // Backend
  'Node.js': { label: 'Node.js', color: '339933', logo: 'nodedotjs' },
  Express: { label: 'Express', color: '000000', logo: 'express' },
  NestJS: { label: 'NestJS', color: 'E0234E', logo: 'nestjs' },
  Python: { label: 'Python', color: '3776AB', logo: 'python' },
  Django: { label: 'Django', color: '092E20', logo: 'django' },
  Flask: { label: 'Flask', color: '000000', logo: 'flask' },
  Java: { label: 'Java', color: '007396', logo: 'openjdk' },
  Spring: { label: 'Spring', color: '6DB33F', logo: 'spring' },
  Kotlin: { label: 'Kotlin', color: '7F52FF', logo: 'kotlin' },
  Go: { label: 'Go', color: '00ADD8', logo: 'go' },
  Rust: { label: 'Rust', color: '000000', logo: 'rust' },
  Ruby: { label: 'Ruby', color: 'CC342D', logo: 'ruby' },
  PHP: { label: 'PHP', color: '777BB4', logo: 'php' },
  GraphQL: { label: 'GraphQL', color: 'E10098', logo: 'graphql' },
  C: { label: 'C', color: 'A8B9CC', logo: 'c' },
  Solidity: { label: 'Solidity', color: '363636', logo: 'solidity' },
  EJS: { label: 'EJS', color: 'B4CA65', logo: 'ejs' },
  'Express.js': { label: 'Express.js', color: '000000', logo: 'express' },
  FastAPI: { label: 'FastAPI', color: '009688', logo: 'fastapi' },

  // Databases & ORMs
  PostgreSQL: { label: 'PostgreSQL', color: '4169E1', logo: 'postgresql' },
  MongoDB: { label: 'MongoDB', color: '47A248', logo: 'mongodb' },
  MySQL: { label: 'MySQL', color: '4479A1', logo: 'mysql' },
  Redis: { label: 'Redis', color: 'DC382D', logo: 'redis' },
  Firebase: { label: 'Firebase', color: 'FFCA28', logo: 'firebase' },
  Supabase: { label: 'Supabase', color: '3ECF8E', logo: 'supabase' },
  Prisma: { label: 'Prisma', color: '2D3748', logo: 'prisma' },
  SQLite: { label: 'SQLite', color: '003B57', logo: 'sqlite' },

  // DevOps, Tools & Services
  Docker: { label: 'Docker', color: '2496ED', logo: 'docker' },
  Kubernetes: { label: 'Kubernetes', color: '326CE5', logo: 'kubernetes' },
  Git: { label: 'Git', color: 'F05032', logo: 'git' },
  'GitHub Actions': { label: 'GitHub Actions', color: '2088FF', logo: 'githubactions' },
  Linux: { label: 'Linux', color: 'FCC624', logo: 'linux' },
  AWS: { label: 'AWS', color: '232F3E', logo: 'amazonwebservices' },
  Vercel: { label: 'Vercel', color: '000000', logo: 'vercel' },
  Netlify: { label: 'Netlify', color: '00C896', logo: 'netlify' },
  Heroku: { label: 'Heroku', color: '430098', logo: 'heroku' },
  Jest: { label: 'Jest', color: 'C21325', logo: 'jest' },
  JWT: { label: 'JWT', color: '000000', logo: 'jsonwebtokens' },
  NPM: { label: 'NPM', color: 'CB3837', logo: 'npm' },
  Nodemon: { label: 'Nodemon', color: '323330', logo: 'nodemon' },
  Redux: { label: 'Redux', color: '764ABC', logo: 'redux' },
  'Socket.io': { label: 'Socket.io', color: '010101', logo: 'socketdotio' },
  'Web3.js': { label: 'Web3.js', color: 'F16822', logo: 'web3dotjs' },
  WordPress: { label: 'WordPress', color: '21759B', logo: 'wordpress' },
  Nginx: { label: 'Nginx', color: '009639', logo: 'nginx' },
  Canva: { label: 'Canva', color: '00C4CC', logo: 'canva' },
  GitHub: { label: 'GitHub', color: '181717', logo: 'github' },
  ESLint: { label: 'ESLint', color: '4B3263', logo: 'eslint' },
  Postman: { label: 'Postman', color: 'FF6C37', logo: 'postman' },
  Prettier: { label: 'Prettier', color: 'F7B93E', logo: 'prettier' },
};

export function generateMarkdown(
  sections: BuilderSection[],
  username: string,
  options: {
    showEmojis: boolean;
    showBanners: boolean;
    bannerImage: string;
    accentColor: string;
    statsCardTheme: string;
    readmeStyle: ReadmeStyle;
  }
): string {
  if (!username) return '<!-- Enter your GitHub username to generate a preview -->';

  let markdownLines: string[] = [];
  const cleanColor = options.accentColor.replace('#', '');
  const style = options.readmeStyle;

  // 1. Optional Banner Section
  if (options.showBanners && options.bannerImage) {
    markdownLines.push(`<p align="center">\n  <img src="${options.bannerImage}" alt="Header Banner" width="100%" />\n</p>\n`);
  }

  // 2. Loop through active sections in order
  for (const sec of sections) {
    if (!sec.isVisible) continue;

    switch (sec.type) {
      case 'typing': {
        const config = sec.config.typing;
        if (config && config.lines && config.lines.length > 0) {
          const linesParam = config.lines.map(line => encodeURIComponent(line)).join(';');
          const colorVal = cleanColor;
          markdownLines.push(
            `<p align="center">\n  <a href="https://git.io/typing-svg">\n    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=${config.size}&color=${colorVal}&background=${config.background}&center=true&vCenter=true&width=600&lines=${linesParam}" alt="Typing SVG" />\n  </a>\n</p>\n`
          );
        }
        break;
      }

      case 'header': {
        const config = sec.config.header;
        if (config) {
          const emojiGreeting = options.showEmojis ? ' 👋' : '';
          const align = config.alignment;

          if (style === 'hacker') {
            markdownLines.push(
              `\`\`\`bash\n$ whoami\n# Name:      ${config.name}\n# Tagline:   ${config.tagline}\n# Context:   GitHub Profile README\n\`\`\`\n`
            );
          } else if (style === 'elegant') {
            markdownLines.push(
              `<div align="center">\n` +
              (config.showAvatar ? `  <img src="https://github.com/${username}.png" alt="Avatar" width="110" height="110" style="border-radius: 50%" />\n\n` : '') +
              `  *Greetings, I am ${config.name}*\n\n` +
              `  **${config.tagline}**\n` +
              `</div>\n`
            );
          } else if (style === 'bold') {
            markdownLines.push(
              `<div align="${align}">\n` +
              (config.showAvatar ? `  <img src="https://github.com/${username}.png" alt="Avatar" width="110" height="110" style="border-radius: 8px" />\n\n` : '') +
              `  <h1>💥 ${config.name.toUpperCase()} 💥</h1>\n` +
              `  <h3>👉 ${config.tagline}</h3>\n` +
              `</div>\n`
            );
          } else {
            // standard professional, creative, minimal
            const greeting = style === 'creative' ? `✨ Hi${emojiGreeting}, I'm ${config.name} ✨` : `Hi${emojiGreeting}, I'm ${config.name}`;
            if (align === 'center') {
              markdownLines.push(`<div align="center">`);
              if (config.showAvatar) {
                const borderStyle = config.avatarShape === 'circle' ? 'style="border-radius: 50%"' : '';
                markdownLines.push(`  <img src="https://github.com/${username}.png" alt="Avatar" width="110" height="110" ${borderStyle} />\n`);
              }
              markdownLines.push(`  <h1>${greeting}</h1>\n  <h3>${config.tagline}</h3>\n</div>\n`);
            } else {
              if (config.showAvatar) {
                const borderStyle = config.avatarShape === 'circle' ? 'style="border-radius: 50%"' : '';
                markdownLines.push(`<table>\n  <tr>\n    <td>\n      <img src="https://github.com/${username}.png" alt="Avatar" width="110" height="110" ${borderStyle} />\n    </td>\n    <td>\n      <h1>${greeting}</h1>\n      <h3>${config.tagline}</h3>\n    </td>\n  </tr>\n</table>\n`);
              } else {
                markdownLines.push(`# ${greeting}\n### ${config.tagline}\n`);
              }
            }
          }
        }
        break;
      }

      case 'about': {
        const config = sec.config.about;
        if (config) {
          const emojiPrefix = options.showEmojis ? '👤 ' : '';
          
          if (style === 'hacker') {
            markdownLines.push(`## ${emojiPrefix}${sec.title}\n\`\`\`text\n${config.text}\n\`\`\`\n`);
          } else {
            markdownLines.push(`## ${emojiPrefix}${sec.title}\n\n${config.text}\n`);
          }
        }
        break;
      }

      case 'working-on': {
        const config = sec.config['working-on'];
        if (config) {
          const emojiPrefix = options.showEmojis ? '🚀 ' : '';
          markdownLines.push(`## ${emojiPrefix}${sec.title}\n`);
          
          if (style === 'hacker') {
            markdownLines.push(`\`\`\`text\n`);
            if (config.currentProject) markdownLines.push(`[Active Project] -> ${config.currentProject} (${config.currentProjectUrl})`);
            if (config.learning)       markdownLines.push(`[Topic Learning] -> ${config.learning}`);
            if (config.collab)         markdownLines.push(`[Collaborating]  -> ${config.collab}`);
            markdownLines.push(`\`\`\`\n`);
          } else {
            if (config.currentProject) {
              const projectLink = config.currentProjectUrl ? `[${config.currentProject}](${config.currentProjectUrl})` : config.currentProject;
              const emoji = options.showEmojis ? '🔭 ' : '- ';
              markdownLines.push(`${emoji}I’m currently working on ${projectLink}`);
            }
            if (config.learning) {
              const emoji = options.showEmojis ? '🌱 ' : '- ';
              markdownLines.push(`${emoji}I’m currently learning **${config.learning}**`);
            }
            if (config.collab) {
              const emoji = options.showEmojis ? '🤝 ' : '- ';
              markdownLines.push(`${emoji}I’m looking to collaborate on **${config.collab}**`);
            }
            markdownLines.push(''); // spacing
          }
        }
        break;
      }

      case 'skills': {
        const config = sec.config.skills;
        if (config && config.selectedSkills.length > 0) {
          const emojiPrefix = options.showEmojis ? '🛠️ ' : '';
          markdownLines.push(`## ${emojiPrefix}${sec.title}\n`);
          
          if (style === 'hacker') {
            const formattedArray = config.selectedSkills.map(s => `"${s}"`).join(' ');
            markdownLines.push(`\`\`\`bash\n$ cat skills.sh\ndeclare -a tech_stack=(${formattedArray})\necho "Loaded \${#tech_stack[@]} skills."\n\`\`\`\n`);
          } else {
            const badges = config.selectedSkills.map(skill => {
              const details = SKILL_BADGES[skill];
              if (details) {
                const bgCol = (!config.badgeColor || config.badgeColor === 'accent') ? cleanColor : config.badgeColor.replace('#', '');
                return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(details.label)}-${bgCol}?style=${config.badgeStyle}&logo=${details.logo}&logoColor=white)`;
              }
              return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-${cleanColor}?style=${config.badgeStyle})`;
            });

            markdownLines.push(badges.join(' '));
            markdownLines.push('');
          }
        }
        break;
      }

      case 'stats': {
        const config = sec.config.stats;
        if (config) {
          const theme = config.theme || options.statsCardTheme;
          const hideBorder = config.hideBorder ? 'true' : 'false';
          const showIcons = config.showIcons ? 'true' : 'false';
          const countCommits = config.includeAllCommits ? 'true' : 'false';
          
          let url = `https://github-readme-stats.shion.dev/api?username=${username}&theme=${theme}&show_icons=${showIcons}&count_private=${countCommits}&hide_border=${hideBorder}`;
          if (config.hideRank) url += `&hide_rank=true`;
          if (config.bgColor) url += `&bg_color=${config.bgColor.replace('#', '')}`;
          if (config.titleColor) url += `&title_color=${config.titleColor.replace('#', '')}`;
          if (config.textColor) url += `&text_color=${config.textColor.replace('#', '')}`;
          if (config.iconColor) url += `&icon_color=${config.iconColor.replace('#', '')}`;
          if (config.borderColor) url += `&border_color=${config.borderColor.replace('#', '')}`;
          if (config.borderRadius !== undefined && config.borderRadius !== 10) url += `&border_radius=${config.borderRadius}`;

          markdownLines.push(`### GitHub Stats\n`);
          markdownLines.push(
            `<p align="center">\n  <img src="${url}" alt="${username}'s GitHub stats" />\n</p>\n`
          );
        }
        break;
      }

      case 'streak': {
        const config = sec.config.streak;
        if (config) {
          const theme = config.theme || options.statsCardTheme;
          const hideBorder = config.hideBorder ? 'true' : 'false';

          let url = `https://streak-stats.demolab.com?user=${username}&theme=${theme}&hide_border=${hideBorder}`;
          if (config.bgColor) url += `&background=${config.bgColor.replace('#', '')}`;
          if (config.borderColor) url += `&border=${config.borderColor.replace('#', '')}`;
          if (config.fireColor) url += `&fire=${config.fireColor.replace('#', '')}`;
          if (config.ringColor) url += `&ring=${config.ringColor.replace('#', '')}`;
          if (config.strokeColor) url += `&stroke=${config.strokeColor.replace('#', '')}`;
          if (config.textColor) {
            const cleanCol = config.textColor.replace('#', '');
            url += `&currStreakNum=${cleanCol}&currStreakLabel=${cleanCol}&sideNums=${cleanCol}&sideLabels=${cleanCol}&dates=${cleanCol}`;
          }

          markdownLines.push(`### Contribution Streak\n`);
          markdownLines.push(
            `<p align="center">\n  <img src="${url}" alt="${username}'s GitHub Streak" />\n</p>\n`
          );
        }
        break;
      }

      case 'languages': {
        const config = sec.config.languages;
        if (config) {
          const theme = config.theme || options.statsCardTheme;
          const hideBorder = config.hideBorder ? 'true' : 'false';
          const layout = config.layout || 'normal';

          let url = `https://github-readme-stats.shion.dev/api/top-langs/?username=${username}&theme=${theme}&layout=${layout}&hide_border=${hideBorder}`;
          if (config.langsCount !== undefined) url += `&langs_count=${config.langsCount}`;
          if (config.hideProgress) url += `&hide_progress=true`;
          if (config.bgColor) url += `&bg_color=${config.bgColor.replace('#', '')}`;
          if (config.titleColor) url += `&title_color=${config.titleColor.replace('#', '')}`;
          if (config.textColor) url += `&text_color=${config.textColor.replace('#', '')}`;
          if (config.borderColor) url += `&border_color=${config.borderColor.replace('#', '')}`;

          markdownLines.push(`### Languages Breakdown\n`);
          markdownLines.push(
            `<p align="center">\n  <img src="${url}" alt="Top Languages" />\n</p>\n`
          );
        }
        break;
      }

      case 'trophies': {
        const config = sec.config.trophies;
        if (config) {
          const theme = config.theme || options.statsCardTheme;
          const columns = config.columnCount || 3;

          let url = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&column=${columns}`;
          
          if (config.noFrame) {
            url += `&no-frame=true`;
          } else {
            url += `&no-frame=${theme === 'neutral' ? 'false' : 'true'}`;
          }
          if (config.noBg) url += `&no-bg=true`;
          
          if (config.marginW) url += `&margin-w=${config.marginW}`;
          if (config.marginH) url += `&margin-h=${config.marginH}`;
          
          if (config.selectedTrophies && config.selectedTrophies.length > 0) {
            url += `&title=${config.selectedTrophies.join(',')}`;
          }
          if (config.rankFilter) {
            url += `&rank=${config.rankFilter}`;
          }

          markdownLines.push(`### Trophies\n`);
          markdownLines.push(
            `<p align="center">\n  <a href="https://github.com/ryo-ma/github-profile-trophy">\n    <img src="${url}" alt="GitHub Trophies" />\n  </a>\n</p>\n`
          );
        }
        break;
      }

      case 'projects': {
        const config = sec.config.projects;
        if (config && config.selectedRepos && config.selectedRepos.length > 0) {
          const emojiPrefix = options.showEmojis ? '💻 ' : '';
          const theme = options.statsCardTheme;
          
          markdownLines.push(`## ${emojiPrefix}${sec.title}\n`);
          
          if (config.layout === 'grid') {
            markdownLines.push(`<p align="center">`);
            const projectCards = config.selectedRepos.map(repo => {
              return `  <a href="https://github.com/${username}/${repo}">\n    <img src="https://github-readme-stats.shion.dev/api/pin/?username=${username}&repo=${repo}&theme=${theme}&hide_border=true" alt="${repo}" />\n  </a>`;
            });
            markdownLines.push(projectCards.join('\n'));
            markdownLines.push(`</p>\n`);
          } else {
            // list view
            config.selectedRepos.forEach(repo => {
              markdownLines.push(`- **[${repo}](https://github.com/${username}/${repo})**`);
            });
            markdownLines.push('');
          }
        }
        break;
      }

      case 'socials': {
        const config = sec.config.socials;
        if (config) {
          const emojiPrefix = options.showEmojis ? '🤝 ' : '';
          markdownLines.push(`## ${emojiPrefix}${sec.title}\n`);
          
          if (style === 'hacker') {
            markdownLines.push(`\`\`\`json\n{\n` +
              (config.github ? `  "github": "https://github.com/${config.github}",\n` : '') +
              (config.linkedin ? `  "linkedin": "https://linkedin.com/in/${config.linkedin}",\n` : '') +
              (config.twitter ? `  "twitter": "https://twitter.com/${config.twitter}",\n` : '') +
              (config.portfolio ? `  "portfolio": "${config.portfolio}",\n` : '') +
              (config.email ? `  "email": "mailto:${config.email}"\n` : '') +
              `}\n\`\`\`\n`
            );
          } else {
            const socialBadges: string[] = [];
            const bStyle = config.badgeStyle || 'flat';
            const bColor = (!config.badgeColor || config.badgeColor === 'accent') ? cleanColor : config.badgeColor.replace('#', '');
            
            if (config.github) {
              socialBadges.push(`[![GitHub](https://img.shields.io/badge/GitHub-100000?style=${bStyle}&logo=github&logoColor=white)](https://github.com/${config.github})`);
            }
            if (config.linkedin) {
              socialBadges.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${bStyle}&logo=linkedin&logoColor=white)](https://linkedin.com/in/${config.linkedin})`);
            }
            if (config.twitter) {
              socialBadges.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${bStyle}&logo=twitter&logoColor=white)](https://twitter.com/${config.twitter})`);
            }
            if (config.portfolio) {
              const cleanUrl = config.portfolio.startsWith('http') ? config.portfolio : `https://${config.portfolio}`;
              socialBadges.push(`[![Portfolio](https://img.shields.io/badge/Portfolio-232F3E?style=${bStyle}&logo=google-chrome&logoColor=white)](${cleanUrl})`);
            }
            if (config.email) {
              socialBadges.push(`[![Email](https://img.shields.io/badge/Email-D14836?style=${bStyle}&logo=gmail&logoColor=white)](mailto:${config.email})`);
            }

            markdownLines.push(socialBadges.join(' '));
            markdownLines.push('');
          }
        }
        break;
      }

      case 'visitor-counter': {
        const config = sec.config['visitor-counter'];
        if (config) {
          const styleParam = config.style || 'flat-square';
          const color = config.color === 'accent' ? cleanColor : config.color;
          
          markdownLines.push(`---\n`);
          markdownLines.push(
            `<p align="center">\n  <img src="https://komarev.com/ghpvc/?username=${username}&color=${color}&style=${styleParam}" alt="Visitor Counter" />\n</p>\n`
          );
        }
        break;
      }

      case 'quote': {
        const config = sec.config.quote;
        if (config) {
          const theme = config.theme || options.statsCardTheme;
          
          markdownLines.push(`### Dev Quote\n`);
          markdownLines.push(
            `<p align="center">\n  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${theme}" alt="Dev Quote" />\n</p>\n`
          );
        }
        break;
      }

      case 'custom': {
        const config = sec.config.custom;
        if (config) {
          if (sec.title) {
            markdownLines.push(`## ${sec.title}\n`);
          }
          markdownLines.push(`${config.markdown}\n`);
        }
        break;
      }

      default:
        break;
    }
  }

  return markdownLines.join('\n');
}
