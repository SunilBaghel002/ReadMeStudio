'use client';

import React, { useState } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { THEME_PALETTES } from '@/lib/theme';
import { SKILL_BADGES } from '@/lib/markdown';
import { AppTheme, FontStyle, SectionType, ReadmeStyle } from '@/types/github.types';
import { DebouncedInput, DebouncedTextarea } from '@/components/UI/DebouncedInput';
import {
  Palette,
  Settings2,
  Trash2,
  Plus,
  Image as ImageIcon,
  Smile,
  Compass,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Standard Card Themes for Shields / Stats / Streak
const STATS_CARD_THEMES = [
  { name: 'Default Dark', value: 'github_dark' },
  { name: 'Radical (Pink/Blue)', value: 'radical' },
  { name: 'Merko (Green)', value: 'merko' },
  { name: 'Tokyo Night', value: 'tokyonight' },
  { name: 'Cyberpunk', value: 'cyberpunk' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'Neutral', value: 'neutral' },
  { name: 'Goth', value: 'goth' },
  { name: 'Gruvbox', value: 'gruvbox' },
  { name: 'One Dark', value: 'onedark' },
  { name: 'Synthwave', value: 'synthwave' },
  { name: 'Catppuccin Mocha', value: 'catppuccin_mocha' },
];

// Presets for Banner Images
const BANNER_PRESETS = [
  { name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Mesh Purple', url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Sunset Dark', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80' },
];

const DEFAULT_STATS_CONFIG = {
  theme: 'github_dark',
  hideBorder: true,
  showIcons: true,
  includeAllCommits: true,
  hideRank: false,
  bgColor: '',
  titleColor: '',
  textColor: '',
  iconColor: '',
  borderColor: '',
  borderRadius: 10,
};

const DEFAULT_STREAK_CONFIG = {
  theme: 'github_dark',
  hideBorder: true,
  bgColor: '',
  borderColor: '',
  fireColor: '',
  ringColor: '',
  strokeColor: '',
  textColor: '',
};

const DEFAULT_LANGUAGES_CONFIG = {
  theme: 'github_dark',
  hideBorder: true,
  layout: 'compact' as const,
  langsCount: 5,
  hideProgress: false,
  bgColor: '',
  titleColor: '',
  textColor: '',
  borderColor: '',
};

const DEFAULT_TROPHIES_CONFIG = {
  theme: 'github_dark',
  columnCount: 3,
  noBg: false,
  noFrame: false,
  marginW: 0,
  marginH: 0,
  selectedTrophies: [] as string[],
  rankFilter: '',
};

const CustomToggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'w-8 h-4 rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer focus:outline-none',
        checked ? 'bg-[#7c3aed]' : 'bg-[#30363D]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-sm block',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
};

export default function Inspector() {
  const [activeTab, setActiveTab] = useState<'global' | 'section'>('section');
  const {
    sections,
    selectedSectionId,
    updateSectionConfig,
    updateSectionTitle,
    deleteSection,
    activeTheme,
    setActiveTheme,
    readmeStyle,
    setReadmeStyle,
    accentColor,
    setAccentColor,
    fontStyle,
    setFontStyle,
    statsCardTheme,
    setStatsCardTheme,
    showEmojis,
    setShowEmojis,
    showBanners,
    setShowBanners,
    bannerImage,
    setBannerImage,
    loadTemplate,
    topRepos,
    languages,
    canvasBgColor,
    setCanvasBgColor,
    cardBgColor,
    setCardBgColor,
    cardBorderColor,
    setCardBorderColor,
    cardBgOpacity,
    setCardBgOpacity,
  } = useBuilderStore();

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Helper to update specific config fields
  const handleConfigChange = (type: SectionType, update: any) => {
    if (!selectedSectionId) return;

    let defaults = {};
    if (type === 'stats') defaults = DEFAULT_STATS_CONFIG;
    else if (type === 'streak') defaults = DEFAULT_STREAK_CONFIG;
    else if (type === 'languages') defaults = DEFAULT_LANGUAGES_CONFIG;
    else if (type === 'trophies') defaults = DEFAULT_TROPHIES_CONFIG;

    updateSectionConfig(selectedSectionId, {
      [type]: {
        ...defaults,
        ...(selectedSection?.config[type as keyof typeof selectedSection.config] || {}),
        ...update,
      },
    });
  };

  const renderSectionConfigurator = () => {
    if (!selectedSection) {
      return (
        <div className="text-center py-10 text-zinc-500 text-xs">
          Select a layout section from the left panel to configure its contents.
        </div>
      );
    }

    const { type, config } = selectedSection;

    return (
      <div className="space-y-5 text-left">
        {/* Universal Section Heading Editor */}
        <div>
          <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Section Title</label>
          <DebouncedInput
            type="text"
            value={selectedSection.title}
            onDebounce={(val) => updateSectionTitle(selectedSection.id, val)}
            className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="h-px bg-white/5 my-4" />

        {/* Section specific editors */}
        {type === 'typing' && (() => {
          const typingConfig = config.typing || { lines: [], color: '3b82f6', background: '00000000', size: 22 };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">Font Size (px)</label>
                <input
                  type="number"
                  value={typingConfig.size}
                  onChange={(e) => handleConfigChange('typing', { size: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-zinc-400">Lines of Text</label>
                {typingConfig.lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <DebouncedInput
                      type="text"
                      value={line}
                      onDebounce={(val) => {
                        const copy = [...typingConfig.lines];
                        copy[idx] = val;
                        handleConfigChange('typing', { lines: copy });
                      }}
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                    />
                    <button
                      onClick={() => {
                        const copy = typingConfig.lines.filter((_, i) => i !== idx);
                        handleConfigChange('typing', { lines: copy });
                      }}
                      className="p-2 border border-zinc-800 text-zinc-550 hover:text-red-400 hover:border-red-400/20 rounded-lg shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    handleConfigChange('typing', { lines: [...typingConfig.lines, 'New typing statement...'] });
                  }}
                  className="w-full py-2 bg-zinc-900 border border-dashed border-white/10 hover:border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Line</span>
                </button>
              </div>
            </div>
          );
        })()}

        {type === 'header' && (() => {
          const headerConfig = config.header || { name: '', tagline: '', showAvatar: true, avatarShape: 'circle', alignment: 'center' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Display Name</label>
                <DebouncedInput
                  type="text"
                  value={headerConfig.name}
                  onDebounce={(val) => handleConfigChange('header', { name: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tagline / Title</label>
                <DebouncedInput
                  type="text"
                  value={headerConfig.tagline}
                  onDebounce={(val) => handleConfigChange('header', { tagline: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-semibold text-zinc-400">Display Avatar Image</span>
                <input
                  type="checkbox"
                  checked={headerConfig.showAvatar}
                  onChange={(e) => handleConfigChange('header', { showAvatar: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
              {headerConfig.showAvatar && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Avatar Frame Style</label>
                  <select
                    value={headerConfig.avatarShape}
                    onChange={(e) => handleConfigChange('header', { avatarShape: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                  >
                    <option value="circle">Circular Frame</option>
                    <option value="square">Square Frame</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Alignment</label>
                <select
                  value={headerConfig.alignment}
                  onChange={(e) => handleConfigChange('header', { alignment: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="center">Centered</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>
          );
        })()}

        {type === 'about' && (() => {
          const aboutConfig = config.about || { text: '' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Biography</label>
                <DebouncedTextarea
                  rows={6}
                  value={aboutConfig.text}
                  onDebounce={(val) => handleConfigChange('about', { text: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-250 font-light resize-y focus:outline-none"
                />
              </div>
            </div>
          );
        })()}

        {type === 'working-on' && (() => {
          const workConfig = config['working-on'] || { currentProject: '', currentProjectUrl: '', learning: '', collab: '' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Active Project Name</label>
                <DebouncedInput
                  type="text"
                  placeholder="e.g. ReadMeStudio"
                  value={workConfig.currentProject}
                  onDebounce={(val) => handleConfigChange('working-on', { currentProject: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Project Link / Repo URL</label>
                <DebouncedInput
                  type="url"
                  placeholder="https://github.com/..."
                  value={workConfig.currentProjectUrl}
                  onDebounce={(val) => handleConfigChange('working-on', { currentProjectUrl: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Focus Learning Topic</label>
                <DebouncedInput
                  type="text"
                  placeholder="Next.js 15 Server Components"
                  value={workConfig.learning}
                  onDebounce={(val) => handleConfigChange('working-on', { learning: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Collaboration Projects</label>
                <DebouncedInput
                  type="text"
                  placeholder="Open source modules, UI libraries"
                  value={workConfig.collab}
                  onDebounce={(val) => handleConfigChange('working-on', { collab: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                />
              </div>
            </div>
          );
        })()}

        {type === 'skills' && (() => {
          const skillsConfig = config.skills || { selectedSkills: [] as string[], badgeStyle: 'flat' as const, badgeColor: 'accent' };
          const allSkillNames = Object.keys(SKILL_BADGES);
          const toggleSkill = (skill: string) => {
            const list = [...skillsConfig.selectedSkills];
            if (list.includes(skill)) {
              handleConfigChange('skills', { selectedSkills: list.filter((s) => s !== skill) });
            } else {
              handleConfigChange('skills', { selectedSkills: [...list, skill] });
            }
          };

          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Badge Rendering Style</label>
                <select
                  value={skillsConfig.badgeStyle}
                  onChange={(e) => handleConfigChange('skills', { badgeStyle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="flat">Shield Flat</option>
                  <option value="flat-square">Flat Square</option>
                  <option value="plastic">Glossy Plastic</option>
                  <option value="for-the-badge">Blocky Badge (Huge)</option>
                  <option value="social">Social Pill Style</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">Select Technologies</label>
                <div className="h-56 overflow-y-auto border border-white/5 rounded-xl p-3 bg-zinc-900/60 flex flex-wrap gap-1.5">
                  {allSkillNames.map((skill) => {
                    const isChecked = skillsConfig.selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'text-[10px] px-2.5 py-1 rounded-md border font-semibold transition-all duration-150 cursor-pointer',
                          isChecked
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            : 'bg-zinc-850 border-white/5 text-zinc-450 hover:border-white/10 hover:text-zinc-300'
                        )}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'stats' && (() => {
          const statsConfig = config.stats || { 
            theme: 'github_dark', 
            variant: 'classic',
            hideBorder: true, 
            showIcons: true, 
            showLabels: true,
            includeAllCommits: true,
            hideRank: false,
            showIconDecorators: false,
            compactMode: false,
            bgColor: '',
            titleColor: '',
            textColor: '',
            iconColor: '',
            borderColor: '',
            borderRadius: 10
          };

          const statsVariants = [
            { id: 'classic', label: 'Classic Card', desc: 'Stat list + rank circle' },
            { id: 'grid', label: 'Compact Grid', desc: 'Mini grid layout' },
            { id: 'horizontal', label: 'Horizontal Bar', desc: 'Minimal clean row' },
            { id: 'dashboard', label: 'Dashboard', desc: 'Larger split dashboard' },
            { id: 'terminal', label: 'Terminal Style', desc: 'Monospace code output' },
          ];

          return (
            <div className="space-y-4">
              {/* Section 1 — DESIGN VARIANT */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 1 — Design Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {statsVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleConfigChange('stats', { variant: v.id })}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-[76px]",
                        (statsConfig.variant || 'classic') === v.id
                          ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                          : "bg-zinc-900 border-white/5 text-zinc-450 hover:border-white/10 hover:bg-zinc-850"
                      )}
                    >
                      <span className="text-[10px] font-bold block">{v.label}</span>
                      <span className="text-[8px] text-zinc-500 block leading-tight mt-1">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2 — THEME */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 2 — Theme</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={statsConfig.theme}
                    onChange={(e) => handleConfigChange('stats', { theme: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                  >
                    {STATS_CARD_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.name}
                      </option>
                    ))}
                    <option value="custom">Custom Theme</option>
                  </select>
                  <div className="flex gap-1 bg-zinc-900 border border-white/5 rounded-lg p-1.5 shrink-0">
                    {(() => {
                      const pal = THEME_PALETTES[statsConfig.theme] || THEME_PALETTES.github_dark;
                      return (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.bg }} title="Background" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.title }} title="Title" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.text }} title="Text" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.accent }} title="Accent" />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 3 — LAYOUT OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 3 — Layout Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400 font-semibold">Compact Mode</span>
                  <CustomToggle
                    checked={!!statsConfig.compactMode}
                    onChange={(checked) => handleConfigChange('stats', { compactMode: checked })}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span className="font-semibold">Border Radius</span>
                    <span className="font-mono text-indigo-400">{statsConfig.borderRadius !== undefined ? statsConfig.borderRadius : 10}px</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={statsConfig.borderRadius !== undefined ? statsConfig.borderRadius : 10}
                    onChange={(e) => handleConfigChange('stats', { borderRadius: parseInt(e.target.value) })}
                    className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              {/* Section 4 — DISPLAY OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 4 — Display Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Card Borders</span>
                  <CustomToggle
                    checked={!!statsConfig.hideBorder}
                    onChange={(checked) => handleConfigChange('stats', { hideBorder: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Icons</span>
                  <CustomToggle
                    checked={statsConfig.showIcons !== false}
                    onChange={(checked) => handleConfigChange('stats', { showIcons: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Labels</span>
                  <CustomToggle
                    checked={statsConfig.showLabels !== false}
                    onChange={(checked) => handleConfigChange('stats', { showLabels: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Icon Decorators</span>
                  <CustomToggle
                    checked={!!statsConfig.showIconDecorators}
                    onChange={(checked) => handleConfigChange('stats', { showIconDecorators: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Rank Badge</span>
                  <CustomToggle
                    checked={!!statsConfig.hideRank}
                    onChange={(checked) => handleConfigChange('stats', { hideRank: checked })}
                  />
                </div>
              </div>

              {/* Section 5 — DATA OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 5 — Data Options</label>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Include Private Commits</span>
                  <CustomToggle
                    checked={!!statsConfig.includeAllCommits}
                    onChange={(checked) => handleConfigChange('stats', { includeAllCommits: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Include Repository Forks</span>
                  <CustomToggle
                    checked={!!statsConfig.includeForks}
                    onChange={(checked) => handleConfigChange('stats', { includeForks: checked })}
                  />
                </div>
              </div>

              {/* Section 6 — COLORS (Custom Mode Only) */}
              {statsConfig.theme === 'custom' && (
                <div className="border-b border-white/5 pb-4 space-y-3">
                  <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 6 — Custom Colors</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-450 mb-1">BG Color</label>
                      <input type="color" value={statsConfig.bgColor || '#0d1117'} onChange={(e) => handleConfigChange('stats', { bgColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-450 mb-1">Title Color</label>
                      <input type="color" value={statsConfig.titleColor || '#818cf8'} onChange={(e) => handleConfigChange('stats', { titleColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-450 mb-1">Text Color</label>
                      <input type="color" value={statsConfig.textColor || '#e4e4e7'} onChange={(e) => handleConfigChange('stats', { textColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-450 mb-1">Icon Color</label>
                      <input type="color" value={statsConfig.iconColor || '#818cf8'} onChange={(e) => handleConfigChange('stats', { iconColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-450 mb-1">Border Color</label>
                    <input type="color" value={statsConfig.borderColor || '#27272a'} onChange={(e) => handleConfigChange('stats', { borderColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                  </div>
                </div>
              )}

              {/* Section 7 — ADVANCED */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 7 — Advanced</label>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">No advanced settings available</span>
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'streak' && (() => {
          const streakConfig = config.streak || { 
            theme: 'github_dark', 
            variant: 'classic',
            hideBorder: true,
            showFireIcon: true,
            showDateRanges: true,
            showLabels: true,
            compactMode: false,
            flameStyle: 'fire',
            alignment: 'center',
            circleStyle: 'filled',
            bgColor: '',
            borderColor: '',
            fireColor: '',
            ringColor: '',
            strokeColor: '',
            textColor: '',
          };

          const streakVariants = [
            { id: 'classic', label: 'Classic Column', desc: 'Three column stats' },
            { id: 'vertical', label: 'Vertical Stack', desc: 'Stacked status list' },
            { id: 'compact', label: 'Compact Badge', desc: 'Header banner stats' },
            { id: 'graph', label: 'Fire Graph', desc: 'Contribution bar graph' },
            { id: 'neon', label: 'Neon Cyberpunk', desc: 'Monospace glow cyberpunk' },
          ];

          return (
            <div className="space-y-4">
              {/* Section 1 — DESIGN VARIANT */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 1 — Design Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {streakVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleConfigChange('streak', { variant: v.id })}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-[76px]",
                        (streakConfig.variant || 'classic') === v.id
                          ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                          : "bg-zinc-900 border-white/5 text-zinc-450 hover:border-white/10 hover:bg-zinc-850"
                      )}
                    >
                      <span className="text-[10px] font-bold block">{v.label}</span>
                      <span className="text-[8px] text-zinc-500 block leading-tight mt-1">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2 — THEME */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 2 — Theme</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={streakConfig.theme}
                    onChange={(e) => handleConfigChange('streak', { theme: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                  >
                    {STATS_CARD_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.name}
                      </option>
                    ))}
                    <option value="custom">Custom Theme</option>
                  </select>
                  <div className="flex gap-1 bg-zinc-900 border border-white/5 rounded-lg p-1.5 shrink-0">
                    {(() => {
                      const pal = THEME_PALETTES[streakConfig.theme] || THEME_PALETTES.github_dark;
                      return (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.bg }} title="Background" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.title }} title="Title" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.text }} title="Text" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.accent }} title="Accent" />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 3 — LAYOUT OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 3 — Layout Options</label>
                
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Flame / Icon Style</label>
                  <select
                    value={streakConfig.flameStyle || 'fire'}
                    onChange={(e) => handleConfigChange('streak', { flameStyle: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-white/5 rounded-md text-xs text-zinc-200"
                  >
                    <option value="fire">Fire Emoji 🔥</option>
                    <option value="lightning">Lightning Bolt ⚡</option>
                    <option value="star">Glowing Star ⭐</option>
                  </select>
                </div>

                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400 font-semibold">Compact Mode</span>
                  <CustomToggle
                    checked={!!streakConfig.compactMode}
                    onChange={(checked) => handleConfigChange('streak', { compactMode: checked })}
                  />
                </div>
              </div>

              {/* Section 4 — DISPLAY OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 4 — Display Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Borders</span>
                  <CustomToggle
                    checked={!!streakConfig.hideBorder}
                    onChange={(checked) => handleConfigChange('streak', { hideBorder: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Fire Icon</span>
                  <CustomToggle
                    checked={streakConfig.showFireIcon !== false}
                    onChange={(checked) => handleConfigChange('streak', { showFireIcon: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Date Ranges</span>
                  <CustomToggle
                    checked={streakConfig.showDateRanges !== false}
                    onChange={(checked) => handleConfigChange('streak', { showDateRanges: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Labels</span>
                  <CustomToggle
                    checked={streakConfig.showLabels !== false}
                    onChange={(checked) => handleConfigChange('streak', { showLabels: checked })}
                  />
                </div>
              </div>

              {/* Section 5 — DATA OPTIONS */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 5 — Data Options</label>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">Synced to profile contributions</span>
                </div>
              </div>

              {/* Section 6 — COLORS */}
              {streakConfig.theme === 'custom' && (
                <div className="border-b border-white/5 pb-4 space-y-3">
                  <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 6 — Custom Colors</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">BG Color</label>
                      <input type="color" value={streakConfig.bgColor || '#0d1117'} onChange={(e) => handleConfigChange('streak', { bgColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Border Color</label>
                      <input type="color" value={streakConfig.borderColor || '#27272a'} onChange={(e) => handleConfigChange('streak', { borderColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Fire (Highlight)</label>
                      <input type="color" value={streakConfig.fireColor || '#ff9d00'} onChange={(e) => handleConfigChange('streak', { fireColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Streak Ring</label>
                      <input type="color" value={streakConfig.ringColor || '#818cf8'} onChange={(e) => handleConfigChange('streak', { ringColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 7 — ADVANCED */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 7 — Advanced</label>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">No advanced settings available</span>
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'languages' && (() => {
          const langConfig = config.languages || { 
            theme: 'github_dark', 
            variant: 'classic',
            hideBorder: true, 
            langsCount: 5,
            hideProgress: false,
            showPercentages: true,
            showIcons: true,
            includeForks: false,
            excludeLanguages: [] as string[],
            compactMode: false,
            bgColor: '',
            titleColor: '',
            textColor: '',
            borderColor: '',
          };

          const langVariants = [
            { id: 'classic', label: 'Classic List', desc: 'Ratio bar + grid legend' },
            { id: 'donut', label: 'Donut Chart', desc: 'Circular donut diagram' },
            { id: 'grid', label: 'Grid Cards', desc: 'Language grids' },
            { id: 'list', label: 'Vertical List', desc: 'Detailed rows & progress' },
            { id: 'waffle', label: 'Waffle Chart', desc: '100 colored boxes' },
            { id: 'cloud', label: 'Language Cloud', desc: 'Word cloud keywords' },
          ];

          return (
            <div className="space-y-4">
              {/* Section 1 — DESIGN VARIANT */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 1 — Design Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {langVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleConfigChange('languages', { variant: v.id })}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-[76px]",
                        (langConfig.variant || 'classic') === v.id
                          ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                          : "bg-zinc-900 border-white/5 text-zinc-450 hover:border-white/10 hover:bg-zinc-850"
                      )}
                    >
                      <span className="text-[10px] font-bold block">{v.label}</span>
                      <span className="text-[8px] text-zinc-500 block leading-tight mt-1">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2 — THEME */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 2 — Theme</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={langConfig.theme}
                    onChange={(e) => handleConfigChange('languages', { theme: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                  >
                    {STATS_CARD_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.name}
                      </option>
                    ))}
                    <option value="custom">Custom Theme</option>
                  </select>
                  <div className="flex gap-1 bg-zinc-900 border border-white/5 rounded-lg p-1.5 shrink-0">
                    {(() => {
                      const pal = THEME_PALETTES[langConfig.theme] || THEME_PALETTES.github_dark;
                      return (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.bg }} title="Background" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.title }} title="Title" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.text }} title="Text" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.accent }} title="Accent" />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 3 — LAYOUT OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 3 — Layout Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400 font-semibold">Compact Mode</span>
                  <CustomToggle
                    checked={!!langConfig.compactMode}
                    onChange={(checked) => handleConfigChange('languages', { compactMode: checked })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Max Languages Displayed ({langConfig.langsCount !== undefined ? langConfig.langsCount : 5})</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={langConfig.langsCount !== undefined ? langConfig.langsCount : 5}
                    onChange={(e) => handleConfigChange('languages', { langsCount: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Section 4 — DISPLAY OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 4 — Display Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Borders</span>
                  <CustomToggle
                    checked={!!langConfig.hideBorder}
                    onChange={(checked) => handleConfigChange('languages', { hideBorder: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Progress Bar</span>
                  <CustomToggle
                    checked={!!langConfig.hideProgress}
                    onChange={(checked) => handleConfigChange('languages', { hideProgress: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Percentages</span>
                  <CustomToggle
                    checked={langConfig.showPercentages !== false}
                    onChange={(checked) => handleConfigChange('languages', { showPercentages: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Icons</span>
                  <CustomToggle
                    checked={langConfig.showIcons !== false}
                    onChange={(checked) => handleConfigChange('languages', { showIcons: checked })}
                  />
                </div>
              </div>

              {/* Section 5 — DATA OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 5 — Data Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Include Repository Forks</span>
                  <CustomToggle
                    checked={!!langConfig.includeForks}
                    onChange={(checked) => handleConfigChange('languages', { includeForks: checked })}
                  />
                </div>

                {/* Exclude Languages Interactive Checklist */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-zinc-400 font-semibold">Exclude Languages</label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-zinc-950/20 border border-white/5 rounded-md">
                    {languages.map((l) => {
                      const isExcluded = (langConfig.excludeLanguages || []).includes(l.name);
                      return (
                        <button
                          key={l.name}
                          type="button"
                          onClick={() => {
                            const list = langConfig.excludeLanguages || [];
                            const newList = isExcluded ? list.filter(x => x !== l.name) : [...list, l.name];
                            handleConfigChange('languages', { excludeLanguages: newList });
                          }}
                          className={cn(
                            "text-[9px] px-2 py-0.5 rounded border transition cursor-pointer font-bold",
                            isExcluded
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "bg-zinc-850 border-white/5 text-zinc-400 hover:text-white"
                          )}
                        >
                          {l.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 6 — COLORS */}
              {langConfig.theme === 'custom' && (
                <div className="border-b border-white/5 pb-4 space-y-3">
                  <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 6 — Custom Colors</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">BG Color</label>
                      <input type="color" value={langConfig.bgColor || '#0d1117'} onChange={(e) => handleConfigChange('languages', { bgColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Title Color</label>
                      <input type="color" value={langConfig.titleColor || '#818cf8'} onChange={(e) => handleConfigChange('languages', { titleColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Text Color</label>
                      <input type="color" value={langConfig.textColor || '#e4e4e7'} onChange={(e) => handleConfigChange('languages', { textColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-zinc-455 mb-1">Border Color</label>
                      <input type="color" value={langConfig.borderColor || '#27272a'} onChange={(e) => handleConfigChange('languages', { borderColor: e.target.value })} className="w-full h-8 bg-zinc-900 border border-white/5 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 7 — ADVANCED */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 7 — Advanced</label>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">No advanced settings available</span>
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'trophies' && (() => {
          const trophyConfig = config.trophies || { 
            theme: 'github_dark', 
            variant: 'classic',
            columnCount: 3,
            noBg: false,
            noFrame: false,
            marginW: 0,
            marginH: 0,
            selectedTrophies: [] as string[],
            rankFilter: '',
            limitTrophiesCount: 0,
            showProgress: true,
            showNextRank: true,
            showCategoryLabels: true,
            compactMode: false,
            includeUnranked: true,
          };

          const TROPHY_OPTIONS = [
            { id: 'Stars', label: 'Stars' },
            { id: 'Followers', label: 'Followers' },
            { id: 'Commits', label: 'Commits' },
            { id: 'Repositories', label: 'Repositories' },
            { id: 'PRs', label: 'Pull Requests' },
            { id: 'Reviews', label: 'Reviews' },
            { id: 'Issues', label: 'Issues' },
            { id: 'Experience', label: 'Experience' },
            { id: 'Achievements', label: 'Achievements' },
          ];

          const trophyVariants = [
            { id: 'classic', label: 'Classic Grid', desc: 'Visual 3D trophy grids' },
            { id: 'badges', label: 'Game Badges', desc: 'Circular badges' },
            { id: 'ribbon', label: 'Ribbon Style', desc: 'Award ribbons' },
            { id: 'minimal', label: 'Minimal Cards', desc: 'Flat text tags' },
            { id: 'podium', label: 'Podium View', desc: 'Top 3 winners stand' },
          ];

          const toggleTrophySelection = (id: string) => {
            const list = [...(trophyConfig.selectedTrophies || [])];
            let newList;
            if (list.includes(id)) {
              newList = list.filter(x => x !== id);
            } else {
              newList = [...list, id];
            }
            handleConfigChange('trophies', { selectedTrophies: newList });
          };

          return (
            <div className="space-y-4">
              {/* Section 1 — DESIGN VARIANT */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 1 — Design Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {trophyVariants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleConfigChange('trophies', { variant: v.id })}
                      className={cn(
                        "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-[76px]",
                        (trophyConfig.variant || 'classic') === v.id
                          ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                          : "bg-zinc-900 border-white/5 text-zinc-450 hover:border-white/10 hover:bg-zinc-850"
                      )}
                    >
                      <span className="text-[10px] font-bold block">{v.label}</span>
                      <span className="text-[8px] text-zinc-500 block leading-tight mt-1">{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2 — THEME */}
              <div className="border-b border-white/5 pb-4">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 2 — Theme</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={trophyConfig.theme}
                    onChange={(e) => handleConfigChange('trophies', { theme: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                  >
                    {STATS_CARD_THEMES.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.name}
                      </option>
                    ))}
                    <option value="custom">Custom Theme</option>
                  </select>
                  <div className="flex gap-1 bg-zinc-900 border border-white/5 rounded-lg p-1.5 shrink-0">
                    {(() => {
                      const pal = THEME_PALETTES[trophyConfig.theme] || THEME_PALETTES.github_dark;
                      return (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.bg }} title="Background" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.title }} title="Title" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.text }} title="Text" />
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.accent }} title="Accent" />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Section 3 — LAYOUT OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 3 — Layout Options</label>
                
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Max Columns ({trophyConfig.columnCount})</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={trophyConfig.columnCount}
                    onChange={(e) => handleConfigChange('trophies', { columnCount: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-400 mb-1">Margin Width</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={trophyConfig.marginW !== undefined ? trophyConfig.marginW : 0}
                      onChange={(e) => handleConfigChange('trophies', { marginW: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-zinc-900 border border-white/5 rounded-md text-[10px] font-mono text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-zinc-400 mb-1">Margin Height</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={trophyConfig.marginH !== undefined ? trophyConfig.marginH : 0}
                      onChange={(e) => handleConfigChange('trophies', { marginH: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-zinc-900 border border-white/5 rounded-md text-[10px] font-mono text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400 font-semibold">Compact Mode</span>
                  <CustomToggle
                    checked={!!trophyConfig.compactMode}
                    onChange={(checked) => handleConfigChange('trophies', { compactMode: checked })}
                  />
                </div>
              </div>

              {/* Section 4 — DISPLAY OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 4 — Display Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Transparent Background</span>
                  <CustomToggle
                    checked={!!trophyConfig.noBg}
                    onChange={(checked) => handleConfigChange('trophies', { noBg: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Hide Trophy Frame Borders</span>
                  <CustomToggle
                    checked={!!trophyConfig.noFrame}
                    onChange={(checked) => handleConfigChange('trophies', { noFrame: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Progress Bar</span>
                  <CustomToggle
                    checked={trophyConfig.showProgress !== false}
                    onChange={(checked) => handleConfigChange('trophies', { showProgress: checked })}
                  />
                </div>
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Show Category Titles</span>
                  <CustomToggle
                    checked={trophyConfig.showCategoryLabels !== false}
                    onChange={(checked) => handleConfigChange('trophies', { showCategoryLabels: checked })}
                  />
                </div>
              </div>

              {/* Section 5 — DATA OPTIONS */}
              <div className="border-b border-white/5 pb-4 space-y-3">
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 5 — Data Options</label>
                
                <div className="flex justify-between items-center py-1 select-none">
                  <span className="text-xs text-zinc-400">Include Unranked Trophies</span>
                  <CustomToggle
                    checked={trophyConfig.includeUnranked !== false}
                    onChange={(checked) => handleConfigChange('trophies', { includeUnranked: checked })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Rank Filter (e.g. S, A, B)</label>
                  <input
                    type="text"
                    value={trophyConfig.rankFilter || ''}
                    placeholder="e.g. S, A, B"
                    onChange={(e) => handleConfigChange('trophies', { rankFilter: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-white/5 rounded-md text-xs font-mono text-zinc-200 focus:outline-none"
                  />
                </div>

                {/* Visible Trophies Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-zinc-400">Visible Trophies (Empty = All)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TROPHY_OPTIONS.map((tr) => {
                      const isChecked = (trophyConfig.selectedTrophies || []).includes(tr.id);
                      return (
                        <button
                          key={tr.id}
                          type="button"
                          onClick={() => toggleTrophySelection(tr.id)}
                          className={cn(
                            'text-[9px] px-2.5 py-1 rounded-md border font-semibold transition-all duration-150 cursor-pointer',
                            isChecked
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                              : 'bg-zinc-850 border-white/5 text-zinc-450 hover:border-white/10 hover:text-zinc-350'
                          )}
                        >
                          {tr.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 6 — COLORS */}
              {trophyConfig.theme === 'custom' && (
                <div className="border-b border-white/5 pb-4 space-y-3">
                  <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Section 6 — Custom Colors</label>
                  <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                    <span className="text-[10px] text-zinc-500 font-mono">Trophy colors scale by rank tier</span>
                  </div>
                </div>
              )}

              {/* Section 7 — ADVANCED */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Section 7 — Advanced</label>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">No advanced settings available</span>
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'projects' && (() => {
          const projConfig = config.projects || { selectedRepos: [] as string[], layout: 'grid' as const };
          const toggleRepo = (repoName: string) => {
            const list = [...projConfig.selectedRepos];
            if (list.includes(repoName)) {
              handleConfigChange('projects', { selectedRepos: list.filter((r) => r !== repoName) });
            } else {
              handleConfigChange('projects', { selectedRepos: [...list, repoName] });
            }
          };

          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Card Layout Structure</label>
                <select
                  value={projConfig.layout}
                  onChange={(e) => handleConfigChange('projects', { layout: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="grid">Grid (Visual Repo Cards)</option>
                  <option value="list">Bullet List (Compact)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">Select Repositories</label>
                <div className="h-40 overflow-y-auto border border-white/5 rounded-xl p-3 bg-zinc-900/60 space-y-1.5">
                  {topRepos.map((repo) => {
                    const isChecked = projConfig.selectedRepos.includes(repo.name);
                    return (
                      <label key={repo.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/40 cursor-pointer text-xs text-zinc-350 select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRepo(repo.name)}
                          className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/20"
                        />
                        <span className="truncate">{repo.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {type === 'socials' && (() => {
          const socialsConfig = config.socials || { github: '', linkedin: '', twitter: '', portfolio: '', email: '', badgeStyle: 'flat', badgeColor: '3b82f6' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">LinkedIn Username</label>
                <DebouncedInput
                  type="text"
                  placeholder="e.g. alexdev"
                  value={socialsConfig.linkedin}
                  onDebounce={(val) => handleConfigChange('socials', { linkedin: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Twitter Handle</label>
                <DebouncedInput
                  type="text"
                  placeholder="e.g. alex_codes"
                  value={socialsConfig.twitter}
                  onDebounce={(val) => handleConfigChange('socials', { twitter: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Portfolio Site URL</label>
                <DebouncedInput
                  type="url"
                  placeholder="https://alexdev.com"
                  value={socialsConfig.portfolio}
                  onDebounce={(val) => handleConfigChange('socials', { portfolio: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Email Address</label>
                <DebouncedInput
                  type="email"
                  placeholder="hello@example.com"
                  value={socialsConfig.email}
                  onDebounce={(val) => handleConfigChange('socials', { email: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Badge Rendering Style</label>
                <select
                  value={socialsConfig.badgeStyle}
                  onChange={(e) => handleConfigChange('socials', { badgeStyle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="flat">Shield Flat</option>
                  <option value="flat-square">Flat Square</option>
                  <option value="plastic">Glossy Plastic</option>
                  <option value="for-the-badge">Huge Blocky Badge</option>
                </select>
              </div>
            </div>
          );
        })()}

        {type === 'visitor-counter' && (() => {
          const counterConfig = config['visitor-counter'] || { style: 'flat-square', color: '3b82f6' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Badge Style</label>
                <select
                  value={counterConfig.style}
                  onChange={(e) => handleConfigChange('visitor-counter', { style: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="flat">Flat Pill</option>
                  <option value="flat-square">Flat Square</option>
                  <option value="plastic">Glossy Plastic</option>
                  <option value="for-the-badge">Huge Blocky Badge</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Badge Theme Color</label>
                <select
                  value={counterConfig.color}
                  onChange={(e) => handleConfigChange('visitor-counter', { color: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200"
                >
                  <option value="3b82f6">Active Accent Color</option>
                  <option value="0077b5">LinkedIn Blue</option>
                  <option value="1da1f2">Twitter Blue</option>
                  <option value="2eb67d">Slack Green</option>
                  <option value="ec4899">Hot Pink</option>
                </select>
              </div>
            </div>
          );
        })()}

        {type === 'quote' && (() => {
          const quoteConfig = config.quote || { theme: 'github_dark' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Visual Theme</label>
                <select
                  value={quoteConfig.theme}
                  onChange={(e) => handleConfigChange('quote', { theme: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono"
                >
                  {STATS_CARD_THEMES.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })()}

        {type === 'custom' && (() => {
          const customConfig = config.custom || { markdown: '' };
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Raw Markdown Content</label>
                <DebouncedTextarea
                  rows={9}
                  value={customConfig.markdown}
                  onDebounce={(val) => handleConfigChange('custom', { markdown: val })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-250 font-mono resize-y focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          );
        })()}

        {/* Inline delete trigger for dynamic custom sections */}
        {type === 'custom' && (
          <button
            onClick={() => deleteSection(selectedSection.id)}
            className="w-full mt-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-dashed border-red-500/30 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Custom Widget</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] select-none shrink-0 w-[300px]">
      {/* Sticky Customize Header */}
      <div className="p-5 border-b border-[#30363D] sticky top-0 bg-[#0D1117]/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Customize</h2>
          
          {/* Tab Toggler */}
          <div className="flex bg-zinc-900 border border-white/5 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('section')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer',
                activeTab === 'section' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-550 hover:text-zinc-350'
              )}
            >
              Section
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer',
                activeTab === 'global' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-550 hover:text-zinc-350'
              )}
            >
              Global
            </button>
          </div>
        </div>

        {/* Dynamic section indicator chip */}
        {activeTab === 'section' && selectedSection ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#7c3aed]/10 text-[#d2bbff] border border-[#7c3aed]/20 font-mono text-[10px] uppercase font-bold">
            {selectedSection.title}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-850 text-zinc-400 border border-zinc-700/50 font-mono text-[10px] uppercase font-bold">
            Global Layout
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'section' ? (
          /* Section configurator Tab */
          <div>{renderSectionConfigurator()}</div>
        ) : (
          /* Global Customization styles & templates Tab */
          <div className="space-y-6 text-left">
            {/* Template Gallery */}
            <div>
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                <span>Template Presets</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => loadTemplate('fullstack')}
                  className="p-2.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 text-left text-xs transition-all cursor-pointer"
                >
                  <span className="font-semibold block text-zinc-250 text-[11px]">Full Stack Pro</span>
                  <span className="text-[9px] text-zinc-550">Recommended</span>
                </button>
                <button
                  onClick={() => loadTemplate('minimal')}
                  className="p-2.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 text-left text-xs transition-all cursor-pointer"
                >
                  <span className="font-semibold block text-zinc-250 text-[11px]">Minimal Dev</span>
                  <span className="text-[9px] text-zinc-550 font-light">Clean Typography</span>
                </button>
                <button
                  onClick={() => loadTemplate('opensource')}
                  className="p-2.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 text-left text-xs transition-all cursor-pointer"
                >
                  <span className="font-semibold block text-zinc-250 text-[11px]">OSS Contrib</span>
                  <span className="text-[9px] text-zinc-550 font-light">Commit Metrics</span>
                </button>
                <button
                  onClick={() => loadTemplate('creative')}
                  className="p-2.5 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 text-left text-xs transition-all cursor-pointer"
                >
                  <span className="font-semibold block text-zinc-250 text-[11px]">Creative Dev</span>
                  <span className="text-[9px] text-zinc-550 font-light">Badges & SVG Typings</span>
                </button>
              </div>
            </div>

            {/* Overall README Style */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-3">Overall Layout Style</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {(['minimal', 'bold', 'creative', 'professional', 'hacker', 'elegant'] as ReadmeStyle[]).map((styleOpt) => (
                  <button
                    key={styleOpt}
                    onClick={() => setReadmeStyle(styleOpt)}
                    className={cn(
                      'py-2 px-1 text-[10px] rounded-lg border font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer',
                      readmeStyle === styleOpt
                        ? 'bg-zinc-100 text-black border-zinc-100'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {styleOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Application Theme */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-3">Color Presets</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {(['minimal', 'dark', 'cyberpunk', 'gradient', 'devops', 'pastel'] as AppTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setActiveTheme(theme);
                      document.body.setAttribute('data-theme', theme);
                    }}
                    className={cn(
                      'py-2 px-1 text-[10px] rounded-lg border font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer',
                      activeTheme === theme
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-450 hover:text-zinc-200'
                    )}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Accent Color */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-2 flex justify-between items-center">
                <span>Custom Accent Color</span>
                <span className="text-[10px] font-mono text-zinc-550 uppercase">{accentColor}</span>
              </h4>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 border-0 bg-transparent cursor-pointer shrink-0"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['#3b82f6', '#ff007f', '#8b5cf6', '#f97316', '#c084fc', '#fafafa'].map((color) => (
                    <button
                      key={color}
                      style={{ backgroundColor: color }}
                      onClick={() => setAccentColor(color)}
                      className="w-5 h-5 rounded-full border border-white/10 shrink-0 hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Font Selector */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-3">Typography Font</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {(['sans', 'serif', 'mono', 'display'] as FontStyle[]).map((font) => (
                  <button
                    key={font}
                    onClick={() => setFontStyle(font)}
                    className={cn(
                      'py-2 px-1 text-[10px] rounded-lg border font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer',
                      fontStyle === font
                        ? 'bg-zinc-100 text-black border-zinc-100'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Header Image Settings */}
            <div className="border-t border-white/5 pt-4">
              <div className="flex justify-between items-center py-1.5">
                <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Show Profile Cover</span>
                </h4>
                <input
                  type="checkbox"
                  checked={showBanners}
                  onChange={(e) => setShowBanners(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>

              {showBanners && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Cover Image URL</label>
                    <DebouncedInput
                      type="text"
                      value={bannerImage}
                      onDebounce={(val) => setBannerImage(val)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-200 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    {BANNER_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setBannerImage(preset.url)}
                        className={cn(
                          'flex-1 text-[10px] py-1.5 border rounded font-semibold text-center transition-all truncate px-1 cursor-pointer',
                          bannerImage === preset.url
                            ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400'
                            : 'border-white/5 bg-zinc-900 text-zinc-400 hover:text-zinc-250'
                        )}
                        title={preset.name}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Canvas & Card Style Customizer */}
            <div className="border-t border-white/5 pt-4 space-y-3.5">
              <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                <span>Canvas & Card Styles</span>
              </h4>

              {/* Canvas Background Presets */}
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-zinc-400">Canvas Background</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { name: 'GH Dark', hex: '#0d1117' },
                    { name: 'GH Light', hex: '#ffffff' },
                    { name: 'Obsidian', hex: '#080b14' },
                    { name: 'Black', hex: '#000000' }
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setCanvasBgColor(preset.hex)}
                      className={cn(
                        'text-[8px] py-1 border rounded font-semibold text-center transition-all truncate px-0.5 cursor-pointer',
                        canvasBgColor === preset.hex
                          ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400'
                          : 'border-white/5 bg-zinc-900 text-zinc-400 hover:text-zinc-250'
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                {/* Custom Color Input */}
                <div className="flex gap-2 items-center">
                  <input 
                    type="color"
                    value={canvasBgColor.startsWith('#') ? canvasBgColor : '#0d1117'}
                    onChange={(e) => setCanvasBgColor(e.target.value)}
                    className="w-6 h-6 border-0 bg-transparent rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={canvasBgColor}
                    onChange={(e) => setCanvasBgColor(e.target.value)}
                    className="flex-1 px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-mono text-zinc-250 focus:outline-none"
                    placeholder="#hex color"
                  />
                </div>
              </div>

              {/* Card Color settings */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Card Background</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color"
                      value={cardBgColor.startsWith('#') ? cardBgColor : '#0d0c1d'}
                      onChange={(e) => setCardBgColor(e.target.value)}
                      className="w-5 h-5 border-0 bg-transparent rounded cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={cardBgColor}
                      onChange={(e) => setCardBgColor(e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-mono text-zinc-250 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Card Border</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color"
                      value={cardBorderColor.startsWith('#') ? cardBorderColor : '#27272a'}
                      onChange={(e) => setCardBorderColor(e.target.value)}
                      className="w-5 h-5 border-0 bg-transparent rounded cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={cardBorderColor}
                      onChange={(e) => setCardBorderColor(e.target.value)}
                      className="w-full px-2 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-mono text-zinc-250 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card Opacity slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-450">
                  <span className="font-semibold">Card Opacity</span>
                  <span className="font-mono text-indigo-400">{Math.round(cardBgOpacity * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={cardBgOpacity}
                  onChange={(e) => setCardBgOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Emoji Settings */}
            <div className="border-t border-white/5 pt-4">
              <div className="flex justify-between items-center py-1">
                <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Display Emojis</span>
                </h4>
                <input
                  type="checkbox"
                  checked={showEmojis}
                  onChange={(e) => setShowEmojis(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
