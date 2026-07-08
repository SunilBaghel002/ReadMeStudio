import { ThemeDefinition, ThemeGenerator, ThemeGeneratorInput } from '@/types/theme.types';
import type { SectionType } from '@/types/github.types';
import { assembleSections } from './assemble';

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
  sectionsSpec: {
    order: ['header', 'about', 'skills', 'stats', 'trophies', 'socials'],
    enabled: ['header', 'about', 'skills', 'stats', 'socials'],
  },
};

export const generate: ThemeGenerator = (input: ThemeGeneratorInput): string => {
  const { username, name, bio, skills, socials, customization, baseUrl } = input;
  const statsTheme = input.statsTheme || definition.statsTheme || 'default';
  const c = customization;
  const blocks = new Map<SectionType, string>();

  // HEADER
  {
    const l: string[] = [];
    l.push(`# ${c.customTitle || name}\n`);
    if (c.customTagline || bio) l.push(`${c.customTagline || bio}\n`);
    l.push('\n');
    blocks.set('header', l.join('\n'));
  }

  // ABOUT
  {
    const l: string[] = [];
    if (bio) l.push(`${bio}\n`);
    const aboutItems: string[] = [];
    if (input.currentProject) aboutItems.push(`Currently working on ${input.currentProject}`);
    if (input.learning) aboutItems.push(`Learning ${input.learning}`);
    if (input.collab) aboutItems.push(`Open to collaborating on ${input.collab}`);
    if (aboutItems.length > 0) {
      aboutItems.forEach(item => l.push(`- ${item}`));
      l.push('');
    }
    l.push('');
    blocks.set('about', l.join('\n'));
  }

  // SKILLS
  if (skills.length > 0) {
    const l: string[] = [];
    l.push(`### Technologies\n`);
    l.push(skills.join(' · '));
    l.push('\n');
    blocks.set('skills', l.join('\n'));
  }

  // STATS
  {
    const l: string[] = [];
    l.push(`### Stats\n`);
    l.push(`<img src="${baseUrl}/api/github/stats?username=${username}&theme=default&hide_border=true&show_icons=true&bg_color=00000000&title_color=24292e&text_color=586069&icon_color=0366d6" alt="Stats" />\n`);
    l.push('');
    blocks.set('stats', l.join('\n'));
  }

  // TROPHIES
  {
    const l: string[] = [];
    l.push(`### Trophies\n`);
    l.push(`<p align="left">`);
    l.push(`  <img src="${baseUrl}/api/github/trophies?username=${username}&theme=${statsTheme}&no_frame=true&no_bg=true" alt="Trophies" />`);
    l.push(`</p>\n`);
    blocks.set('trophies', l.join('\n'));
  }

  // SOCIALS
  {
    const socialLinks: string[] = [];
    if (socials.github) socialLinks.push(`[GitHub](https://github.com/${socials.github})`);
    if (socials.linkedin) socialLinks.push(`[LinkedIn](https://linkedin.com/in/${socials.linkedin})`);
    if (socials.twitter) socialLinks.push(`[Twitter](https://twitter.com/${socials.twitter})`);
    if (socials.portfolio) socialLinks.push(`[Website](${socials.portfolio.startsWith('http') ? socials.portfolio : 'https://' + socials.portfolio})`);
    if (socials.email) socialLinks.push(`[Email](mailto:${socials.email})`);
    if (socialLinks.length > 0) {
      blocks.set('socials', socialLinks.join(' · ') + '\n');
    }
  }

  return assembleSections(blocks, input.enabledSections, input.sectionOrder, definition.sectionsSpec);
};
