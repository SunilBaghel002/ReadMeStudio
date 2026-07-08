import type { SectionType } from '@/types/github.types';
import type { ThemeSectionsSpec } from '@/types/theme.types';

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
