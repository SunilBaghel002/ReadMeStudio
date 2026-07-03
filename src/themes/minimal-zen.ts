import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';

export const definition: ThemeDefinition = {
  id: 'minimal-zen',
  name: 'Minimal Zen',
  description: 'Ultra-clean, typography-focused layout with maximum whitespace. No flashy graphics, just the essentials.',
  category: 'professional',
  icon: 'Minus',
  previewColors: {
    primary: '#24292e',
    secondary: '#586069',
    accent: '#0366d6',
    background: '#ffffff',
  },
  defaultConfig: {
    primaryColor: '#24292e',
    secondaryColor: '#586069',
    accentColor: '#0366d6',
    alignment: 'left',
    emojiLevel: 'none',
    showTypingAnimation: false,
    showContributionGraph: false,
    showTrophies: false,
    showQuote: false,
    showVisitorCounter: false,
    showSnakeAnimation: false,
  },
  statsTheme: 'default',
  badgeStyle: 'flat',
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, selectedRepos, socials, customization, baseUrl } = input;
  const c = customization;
  const lines: string[] = [];

  // ═══════════════════════════════════════
  // HEADER: Just name, nothing else
  // ═══════════════════════════════════════
  lines.push(`# ${c.customTitle || name}\n`);

  if (c.customTagline || bio) {
    lines.push(`${c.customTagline || bio}\n`);
  }

  lines.push('');
  lines.push('');

  // ═══════════════════════════════════════
  // ABOUT: Plain text, minimal
  // ═══════════════════════════════════════
  if (bio) {
    lines.push(`${bio}\n`);
  }

  const aboutItems: string[] = [];
  if (input.currentProject) aboutItems.push(`Currently working on ${input.currentProject}`);
  if (input.learning) aboutItems.push(`Learning ${input.learning}`);
  if (input.collab) aboutItems.push(`Open to collaborating on ${input.collab}`);

  if (aboutItems.length > 0) {
    aboutItems.forEach(item => {
      lines.push(`- ${item}`);
    });
    lines.push('');
  }

  lines.push('');

  // ═══════════════════════════════════════
  // TECH STACK: Plain text list with dots
  // ═══════════════════════════════════════
  if (skills.length > 0) {
    lines.push(`### Technologies\n`);
    lines.push(skills.join(' · '));
    lines.push('');
    lines.push('');
  }

  // ═══════════════════════════════════════
  // STATS: Single card only, minimal
  // ═══════════════════════════════════════
  lines.push(`### Stats\n`);
  lines.push(`<img src="${baseUrl}/api/github/stats?username=${username}&theme=default&hide_border=true&show_icons=true&bg_color=00000000&title_color=24292e&text_color=586069&icon_color=0366d6" alt="Stats" />\n`);

  lines.push('');

  // ═══════════════════════════════════════
  // SOCIALS: Simple one-line links
  // ═══════════════════════════════════════
  const socialLinks: string[] = [];
  if (socials.github) socialLinks.push(`[GitHub](https://github.com/${socials.github})`);
  if (socials.linkedin) socialLinks.push(`[LinkedIn](https://linkedin.com/in/${socials.linkedin})`);
  if (socials.twitter) socialLinks.push(`[Twitter](https://twitter.com/${socials.twitter})`);
  if (socials.portfolio) socialLinks.push(`[Website](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
  if (socials.email) socialLinks.push(`[Email](mailto:${socials.email})`);

  if (socialLinks.length > 0) {
    lines.push(socialLinks.join(' · '));
    lines.push('');
  }

  return lines.join('\n');
};
