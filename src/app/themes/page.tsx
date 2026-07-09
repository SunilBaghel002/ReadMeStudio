'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useShallow } from 'zustand/react/shallow';
import { THEME_LIST, generateThemeMarkdown } from '@/themes';
import { 
  Waves,
  Terminal,
  Minus,
  Zap,
  Briefcase,
  Gamepad2,
  Crown,
  Palette,
  GitPullRequest,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  ExternalLink,
  Check,
  Search,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WebGLBackground from '@/components/UI/WebGLBackground';
import FlowProgress from '@/components/UI/FlowProgress';
import TemplateSelectorModal, { ThemePreviewRenderer } from '@/components/Preview/TemplateSelectorModal';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Waves,
  Terminal,
  Minus,
  Zap,
  Briefcase,
  Gamepad2,
  Crown,
  Palette,
  GitPullRequest,
  GraduationCap,
};

const CATEGORIES = [
  { id: 'all', label: 'All Style' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'technical', label: 'Technical' },
  { id: 'fun', label: 'Fun & Expressive' },
  { id: 'minimal', label: 'Minimal' },
];

export default function ThemesPage() {
  const router = useRouter();
  const { 
    username, 
    githubData, 
    profile, 
    topRepos, 
    languages, 
    stats,
    sections,
    loadTheme, 
    selectedThemeId, 
    resetStore,
    hasHydrated 
  } = useBuilderStore(useShallow(state => ({
    username: state.username,
    githubData: state.githubData,
    profile: state.profile,
    topRepos: state.topRepos,
    languages: state.languages,
    stats: state.stats,
    sections: state.sections,
    loadTheme: state.loadTheme,
    selectedThemeId: state.selectedThemeId,
    resetStore: state.resetStore,
    hasHydrated: state.hasHydrated,
  })));

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [themePreviews, setThemePreviews] = useState<Record<string, string>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [applyingThemeId, setApplyingThemeId] = useState<string | null>(null);

  // Route guard: Redirect to /generate if no username/githubData exists after hydration
  useEffect(() => {
    if (hasHydrated && (!username || !githubData)) {
      router.push('/generate');
    }
  }, [hasHydrated, username, githubData, router]);

  // Pre-generate markdown previews for all themes using user's real data
  useEffect(() => {
    if (!username) return;

    const loadPreviews = async () => {
      const hostUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const skills = sections.find(s => s.type === 'skills')?.config?.skills?.selectedSkills || [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'TailwindCSS', 'Git', 'Docker'
      ];
      const selectedRepos = topRepos.slice(0, 3).map(r => r.name);
      
      const generatedPreviews: Record<string, string> = {};
      
      for (const theme of THEME_LIST) {
        try {
          const md = await generateThemeMarkdown(theme.id, {
            username,
            name: profile?.name || username,
            bio: profile?.bio || 'Full Stack Web Developer',
            avatarUrl: profile?.avatarUrl || `https://github.com/${username}.png`,
            skills,
            selectedRepos,
            socials: {
              github: username,
              linkedin: '',
              twitter: profile?.twitterUsername || '',
              portfolio: '',
              email: '',
            },
            customization: theme.defaultConfig,
            currentProject: 'ReadMeStudio',
            learning: 'Next.js 15, Framer Motion, and Rust',
            collab: 'open source projects',
            baseUrl: hostUrl,
          });
          generatedPreviews[theme.id] = md;
        } catch (err) {
          console.error(`Failed to pre-render preview for theme ${theme.id}:`, err);
        }
      }
      setThemePreviews(generatedPreviews);
    };

    loadPreviews();
  }, [username, profile, topRepos, sections]);

  const handleOpenPreview = (themeId: string) => {
    setPreviewThemeId(themeId);
    setIsModalOpen(true);
  };

  const handleUseTheme = (themeId: string) => {
    setApplyingThemeId(themeId);
    setIsApplying(true);
    loadTheme(themeId);
    
    // Simulate loading for smooth perception
    setTimeout(() => {
      router.push('/builder');
    }, 600);
  };

  const handleConfirmSelect = (themeId: string) => {
    handleUseTheme(themeId);
  };

  const handleSwitchUser = () => {
    resetStore();
    router.push('/generate');
  };

  // Filter themes based on search query and category
  const filteredThemes = THEME_LIST.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'minimal') {
      return theme.id === 'minimal-zen' || theme.description.toLowerCase().includes('minimal');
    }
    return theme.category === activeCategory;
  });

  // Guard loading screen
  if (!hasHydrated || (hasHydrated && (!username || !githubData))) {
    return (
      <div className="min-h-screen bg-[#15121b] flex items-center justify-center text-[#ccc3d8] text-sm font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
          <span>Securing session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#15121b] text-[#e8dfee] flex flex-col justify-between overflow-x-hidden font-sans antialiased bg-mesh-texture selection:bg-indigo-500/30 selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* WebGL Animated Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <WebGLBackground />
      </div>

      {/* Loader overlay when applying theme */}
      <AnimatePresence>
        {isApplying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[200] flex flex-col items-center justify-center text-center gap-4"
          >
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <div>
              <h3 className="text-white font-bold text-base">Applying Theme Style</h3>
              <p className="text-zinc-500 text-xs mt-1">Configuring builder workspace for @{username}...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-[#15121b]/80 backdrop-blur-xl border-b border-white/5 shadow-sm z-50 transition-all duration-300">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text">
              ReadMeStudio
            </span>
          </Link>
          
          {/* User Info Bar */}
          <div className="flex items-center gap-4 bg-zinc-900/60 border border-white/5 rounded-full pl-2 pr-4 py-1">
            <img 
              src={profile?.avatarUrl || `https://github.com/${username}.png`} 
              alt={username}
              className="w-6 h-6 rounded-full border border-white/10"
            />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white font-bold">@{username}</span>
              <span className="text-zinc-600">|</span>
              <button 
                onClick={handleSwitchUser}
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold tracking-tight cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow flex flex-col items-center p-6 pt-24 pb-16 z-10 relative">
        <div className="w-full max-w-6xl flex flex-col items-center">
          
          {/* Progress Indicator */}
          <FlowProgress currentStep="themes" />

          {/* Smart Theme Suggestion Banner */}
          {githubData?.existingReadmeAnalysis?.hasReadme && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-2 overflow-hidden relative"
            >
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex gap-4 items-start md:items-center text-left">
                <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 shrink-0 shadow-lg">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">Existing Profile README Detected!</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase">
                      {githubData.existingReadmeAnalysis?.detectedStyle || 'Classic'} Style
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 font-light max-w-2xl">
                    We scanned your profile repository and found your current README. Try upgrading to our <strong className="text-indigo-300 font-bold font-mono">"{THEME_LIST.find(t => t.id === githubData.existingReadmeAnalysis?.recommendedThemeId)?.name || 'Gradient Wave'}"</strong> theme to give your profile a modern, premium look!
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleConfirmSelect(githubData.existingReadmeAnalysis?.recommendedThemeId || 'gradient-wave')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}

          {!githubData?.existingReadmeAnalysis?.hasReadme && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full p-6 rounded-2xl bg-zinc-950/45 border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 mt-2 overflow-hidden relative"
            >
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex gap-4 items-start md:items-center text-left">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0 shadow-lg">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">Fresh Profile README Journey!</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      New User
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-1 font-light max-w-2xl">
                    You don't have a profile README yet. We recommend our flagship <strong className="text-purple-300 font-bold">"Gradient Wave"</strong> theme to automatically construct a fully responsive, rich profile README.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleConfirmSelect('gradient-wave')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-850 hover:border-white/20 text-white font-bold text-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Get Flagship Style</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mt-4 mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3"
            >
              Choose your style
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed"
            >
              Every theme is customized with your data. Quick preview or select to customize sections.
            </motion.p>
          </div>

          {/* Filter Bar */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 border-b border-white/5 pb-6">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border",
                    activeCategory === category.id
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      : "bg-[#15121b]/40 border-white/5 text-zinc-400 hover:text-white hover:border-white/10"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64 input-inset flex items-center px-3 rounded-lg h-10 bg-[#0d1117]/60 border border-[#30363D] focus-within:border-[#7c3aed]/50 transition-all">
              <Search className="h-4 w-4 text-zinc-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none w-full text-white text-xs focus:ring-0 p-0 placeholder-zinc-600 outline-none"
              />
            </div>
          </div>

          {/* Theme Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredThemes.map((theme, themeIdx) => {
              const Icon = ICON_MAP[theme.icon] || Sparkles;
              const isSelected = selectedThemeId === theme.id;

              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: themeIdx * 0.05 }}
                  className={cn(
                    'p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative group bg-zinc-950/45 border-white/5 hover:border-indigo-500/50 hover:bg-zinc-950/70 hover:shadow-[0_0_30px_rgba(124,58,237,0.12)] hover:scale-[1.01] active:scale-[0.98]'
                  )}
                >
                  {/* Top color gradient highlight */}
                  <div 
                    className="absolute top-0 inset-x-0 h-1 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(to right, ${theme.previewColors.primary}, ${theme.previewColors.secondary}, ${theme.previewColors.accent})` }}
                  />

                  <div>
                    {/* Live Preview Screen Container */}
                    <div 
                      onClick={() => handleOpenPreview(theme.id)}
                      className="h-48 w-full bg-[#0d1117] border border-white/5 rounded-xl overflow-hidden relative group-hover:border-indigo-500/30 transition-all select-none cursor-pointer"
                    >
                      {themePreviews[theme.id] ? (
                        <div className="w-[222%] h-[222%] scale-[0.45] origin-top-left p-6 pointer-events-none overflow-hidden select-none">
                          <ThemePreviewRenderer
                            markdown={themePreviews[theme.id]}
                            username={username}
                            profile={profile}
                            repos={topRepos}
                            langs={languages}
                            stats={stats}
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-zinc-600 gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                          <span>Generating Live Preview...</span>
                        </div>
                      )}
                      
                      {/* Dark fade bottom mask */}
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0e121a] via-[#0e121a]/80 to-transparent pointer-events-none" />
                      
                      {/* Hover Overlay Tour Prompt */}
                      <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-[#181520] border border-indigo-500/30 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold text-white shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Sparkles className="h-3 w-3 text-indigo-400" />
                          Click to full preview
                        </span>
                      </div>
                    </div>

                    {/* Title & Stats */}
                    <div className="flex justify-between items-center mt-4 mb-2">
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-250 transition-colors flex items-center gap-2">
                        <span>{theme.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-[8px] font-mono font-bold uppercase tracking-wider">Selected</span>
                        )}
                      </h3>
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center border border-white/5 bg-zinc-900/60 text-zinc-500 group-hover:text-indigo-400 transition-all duration-300">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 group-hover:text-zinc-350 transition-colors line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Buttons & Tag */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-500 capitalize">
                        {theme.category}
                      </span>
                      {isSelected && <span className="text-[9.5px] font-mono font-semibold text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> Active Theme</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => handleOpenPreview(theme.id)}
                        className="w-full py-2 rounded-lg border border-white/5 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-450 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTheme(theme.id)}
                        disabled={applyingThemeId !== null}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-[#7c3aed] text-white hover:shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <span>Use Theme</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredThemes.length === 0 && (
            <div className="w-full max-w-md py-16 text-center border border-dashed border-white/5 rounded-2xl bg-zinc-950/20 mt-6 select-none">
              <p className="text-zinc-500 text-xs">No themes found matching "{searchQuery}" in category "{activeCategory}"</p>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-zinc-550 border-t border-white/5 bg-[#15121b]/80 relative z-20">
        <p>Pre-rendering with user statistics enables complete visual verification prior to customizing sections.</p>
      </footer>

      {/* Template Selector/Preview Modal */}
      {previewThemeId && (
        <TemplateSelectorModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setPreviewThemeId(null);
          }} 
          onSelect={handleConfirmSelect}
          initialSelectedThemeId={previewThemeId}
        />
      )}
    </div>
  );
}
