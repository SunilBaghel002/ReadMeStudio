import type { SectionType } from '@/types/github.types';
import type { ThemeSectionsSpec, ThemeGeneratorInput } from '@/types/theme.types';

/**
 * Assembles theme section blocks in the user's drag-reorder, filtered by
 * which sections are enabled in the section manager.
 *
 * Falls back to the theme's own spec if no overrides are provided (backward
 * compat for direct markdown generation without the builder).
 */
export function assembleSections(
  blocks: Map<SectionType, string>,
  enabledSections?: Set<SectionType>,
  sectionOrder?: SectionType[],
  themeSpec?: ThemeSectionsSpec,
): string {
  const order = sectionOrder ?? themeSpec?.order ?? [...blocks.keys()];
  const enabled = enabledSections ?? new Set(themeSpec?.enabled ?? [...blocks.keys()]);

  const parts: string[] = [];
  for (const section of order) {
    if (!enabled.has(section)) continue;
    const content = blocks.get(section);
    if (content) parts.push(content);
  }

  return parts.join('\n');
}

export function getStatsUrl(input: ThemeGeneratorInput, defaultTheme: string): string {
  const { username, baseUrl, sectionConfigs, statsTheme } = input;
  const config = sectionConfigs?.stats || {};
  const theme = config.theme || statsTheme || defaultTheme;
  
  const params = new URLSearchParams({
    username,
    theme,
  });
  
  if (config.variant && config.variant !== 'classic') params.append('variant', config.variant);
  if (config.hideBorder) params.append('hide_border', 'true');
  if (config.showIcons === false) params.append('show_icons', 'false');
  if (config.showLabels === false) params.append('show_labels', 'false');
  if (config.showIconDecorators) params.append('show_icon_decorators', 'true');
  if (config.compactMode) params.append('compact_mode', 'true');
  if (config.includeAllCommits) params.append('include_all_commits', 'true');
  if (config.includeForks) params.append('include_forks', 'true');
  if (config.hideRank) params.append('hide_rank', 'true');
  if (config.theme === 'custom') {
    if (config.bgColor) params.append('bg_color', config.bgColor.replace('#', ''));
    if (config.titleColor) params.append('title_color', config.titleColor.replace('#', ''));
    if (config.textColor) params.append('text_color', config.textColor.replace('#', ''));
    if (config.iconColor) params.append('icon_color', config.iconColor.replace('#', ''));
    if (config.borderColor) params.append('border_color', config.borderColor.replace('#', ''));
    if (config.borderRadius !== undefined) params.append('border_radius', String(config.borderRadius));
  }

  return `${baseUrl}/api/github/stats?${params.toString()}`;
}

export function getStreakUrl(input: ThemeGeneratorInput, defaultTheme: string): string {
  const { username, baseUrl, sectionConfigs, statsTheme } = input;
  const config = sectionConfigs?.streak || {};
  const theme = config.theme || statsTheme || defaultTheme;

  const params = new URLSearchParams({
    username,
    theme,
  });

  if (config.variant && config.variant !== 'classic') params.append('variant', config.variant);
  if (config.hideBorder) params.append('hide_border', 'true');
  if (config.showFireIcon === false) params.append('show_fire_icon', 'false');
  if (config.showDateRanges === false) params.append('show_date_ranges', 'false');
  if (config.showLabels === false) params.append('show_labels', 'false');
  if (config.compactMode) params.append('compact_mode', 'true');
  if (config.flameStyle && config.flameStyle !== 'fire') params.append('flame_style', config.flameStyle);
  if (config.alignment && config.alignment !== 'center') params.append('alignment', config.alignment);
  if (config.circleStyle && config.circleStyle !== 'filled') params.append('circle_style', config.circleStyle);
  if (config.theme === 'custom') {
    if (config.bgColor) params.append('bg_color', config.bgColor.replace('#', ''));
    if (config.borderColor) params.append('border_color', config.borderColor.replace('#', ''));
    if (config.fireColor) params.append('fire_color', config.fireColor.replace('#', ''));
    if (config.ringColor) params.append('ring_color', config.ringColor.replace('#', ''));
    if (config.strokeColor) params.append('stroke_color', config.strokeColor.replace('#', ''));
    if (config.textColor) params.append('text_color', config.textColor.replace('#', ''));
    if (config.borderRadius !== undefined) params.append('border_radius', String(config.borderRadius));
  }

  return `${baseUrl}/api/github/streak?${params.toString()}`;
}

export function getLanguagesUrl(input: ThemeGeneratorInput, defaultTheme: string): string {
  const { username, baseUrl, sectionConfigs, statsTheme } = input;
  const config = sectionConfigs?.languages || {};
  const theme = config.theme || statsTheme || defaultTheme;

  const params = new URLSearchParams({
    username,
    theme,
  });

  if (config.variant && config.variant !== 'classic') params.append('variant', config.variant);
  if (config.hideBorder) params.append('hide_border', 'true');
  if (config.hideProgress) params.append('hide_progress', 'true');
  if (config.showPercentages === false) params.append('show_percentages', 'false');
  if (config.showIcons === false) params.append('show_icons', 'false');
  if (config.includeForks) params.append('include_forks', 'true');
  if (config.excludeLanguages && config.excludeLanguages.length > 0) {
    params.append('exclude_languages', config.excludeLanguages.join(','));
  }
  if (config.compactMode) params.append('compact_mode', 'true');
  if (config.colorSource && config.colorSource !== 'github') params.append('color_source', config.colorSource);
  if (config.langsCount !== undefined && config.langsCount !== 5) {
    params.append('langs_count', String(config.langsCount));
  }
  if (config.theme === 'custom') {
    if (config.bgColor) params.append('bg_color', config.bgColor.replace('#', ''));
    if (config.titleColor) params.append('title_color', config.titleColor.replace('#', ''));
    if (config.textColor) params.append('text_color', config.textColor.replace('#', ''));
    if (config.borderColor) params.append('border_color', config.borderColor.replace('#', ''));
    if (config.borderRadius !== undefined) params.append('border_radius', String(config.borderRadius));
  }

  return `${baseUrl}/api/github/languages?${params.toString()}`;
}

export function getTrophiesUrl(input: ThemeGeneratorInput, defaultTheme: string): string {
  const { username, baseUrl, sectionConfigs, statsTheme } = input;
  const config = sectionConfigs?.trophies || {};
  const theme = config.theme || statsTheme || defaultTheme;

  const params = new URLSearchParams({
    username,
    theme,
  });

  if (config.variant && config.variant !== 'classic') params.append('variant', config.variant);
  if (config.noBg) params.append('no_bg', 'true');
  if (config.noFrame) params.append('no_frame', 'true');
  if (config.columnCount !== undefined && config.columnCount !== 3) {
    params.append('column_count', String(config.columnCount));
  }
  if (config.marginW) params.append('margin_w', String(config.marginW));
  if (config.marginH) params.append('margin_h', String(config.marginH));
  if (config.rankFilter) params.append('rank_filter', config.rankFilter);
  if (config.selectedTrophies && config.selectedTrophies.length > 0) {
    params.append('selected_trophies', config.selectedTrophies.join(','));
  }
  if (config.limitTrophiesCount) params.append('limit_trophies_count', String(config.limitTrophiesCount));
  if (config.showProgress === false) params.append('show_progress', 'false');
  if (config.showNextRank === false) params.append('show_next_rank', 'false');
  if (config.trophyStyle && config.trophyStyle !== '3d') params.append('trophy_style', config.trophyStyle);
  if (config.showCategoryLabels === false) params.append('show_category_labels', 'false');
  if (config.compactMode) params.append('compact_mode', 'true');
  if (config.animateHover) params.append('animate_hover', 'true');
  if (config.includeUnranked === false) params.append('include_unranked', 'false');
  if (config.includeForks) params.append('include_forks', 'true');
  if (config.includeAllCommits) params.append('include_all_commits', 'true');

  return `${baseUrl}/api/github/trophies?${params.toString()}`;
}
