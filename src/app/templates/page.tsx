'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useShallow } from 'zustand/react/shallow';
import { THEME_LIST, THEME_CATEGORIES, CATEGORY_LABELS } from '@/themes';
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
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WebGLBackground from '@/components/UI/WebGLBackground';
import TemplateSelectorModal from '@/components/Preview/TemplateSelectorModal';

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

const CATEGORY_ORDER = ['professional', 'creative', 'technical', 'fun'] as const;

const CATEGORY_GRADIENTS: Record<string, string> = {
  professional: 'from-blue-500/10 via-transparent to-transparent',
  creative: 'from-pink-500/10 via-transparent to-transparent',
  technical: 'from-green-500/10 via-transparent to-transparent',
  fun: 'from-amber-500/10 via-transparent to-transparent',
};

export default function TemplatesPage() {
  const router = useRouter();
  const { loadTheme, selectedThemeId } = useBuilderStore(useShallow(state => ({
    loadTheme: state.loadTheme,
    selectedThemeId: state.selectedThemeId
  })));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activePreviewId, setActivePreviewId] = React.useState('');

  const handleSelectTemplate = (id: string) => {
    setActivePreviewId(id);
    setIsModalOpen(true);
  };

  const handleConfirmSelect = (id: string) => {
    loadTheme(id);
    router.push('/generate');
  };

  return (
    <div className="relative min-h-screen bg-[#15121b] text-[#e8dfee] flex flex-col justify-between overflow-x-hidden font-sans antialiased bg-mesh-texture selection:bg-indigo-500/30 selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* WebGL Animated Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <WebGLBackground />
      </div>

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-[#15121b]/80 backdrop-blur-xl border-b border-white/5 shadow-sm z-50 transition-all duration-300">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text">
              ReadMeStudio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-zinc-450 hover:text-white transition-colors duration-200 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 flex flex-col items-center p-6 pt-28 pb-16 z-10 relative">
        <div className="w-full max-w-6xl flex flex-col items-center">
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3" />
              <span>Step 1: Choose Your Theme</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4"
            >
              Pick a theme that matches your vibe
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-sm md:text-base font-light leading-relaxed"
            >
              Each theme is a completely different design experience — from minimal typography to RPG character sheets. Every theme generates unique markdown.
            </motion.p>
          </div>

          {/* Themes by Category */}
          {CATEGORY_ORDER.map((category, catIdx) => {
            const themes = THEME_CATEGORIES[category];
            const catInfo = CATEGORY_LABELS[category];
            if (themes.length === 0) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + catIdx * 0.1 }}
                className="w-full mb-10"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-bold text-white">{catInfo.label}</h2>
                  <span className="text-[10px] text-zinc-500 font-light">{catInfo.description}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Theme Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {themes.map((theme) => {
                    const Icon = ICON_MAP[theme.icon] || Sparkles;
                    const isSelected = selectedThemeId === theme.id;

                    return (
                      <div
                        key={theme.id}
                        onClick={() => handleSelectTemplate(theme.id)}
                        className={cn(
                          'p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative group cursor-pointer shadow-xl bg-zinc-950/40 border-white/5 hover:border-indigo-500/50 hover:bg-zinc-950/65 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:scale-[1.02]'
                        )}
                      >
                        {/* Gradient accent top */}
                        <div 
                          className="absolute top-0 inset-x-0 h-1 rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ background: `linear-gradient(to right, ${theme.previewColors.primary}, ${theme.previewColors.secondary}, ${theme.previewColors.accent})` }}
                        />
                        
                        <div>
                          {/* Top Row: Color dots + Icon */}
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              {/* Color palette preview */}
                              <div className="flex gap-1">
                                <div className="w-5 h-5 rounded-lg border border-white/10" style={{ backgroundColor: theme.previewColors.primary }} />
                                <div className="w-5 h-5 rounded-lg border border-white/10" style={{ backgroundColor: theme.previewColors.secondary }} />
                                <div className="w-5 h-5 rounded-lg border border-white/10" style={{ backgroundColor: theme.previewColors.accent }} />
                                <div className="w-5 h-5 rounded-lg border border-white/10" style={{ backgroundColor: theme.previewColors.background }} />
                              </div>
                            </div>
                            <div className={cn(
                              "h-9 w-9 rounded-xl flex items-center justify-center border border-white/5 bg-zinc-900 group-hover:border-indigo-500/30 group-hover:bg-[#7c3aed]/10 transition-all duration-300"
                            )}>
                              <Icon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                            </div>
                          </div>

                          {/* Title + Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-bold text-white group-hover:text-indigo-250 transition-colors">
                              {theme.name}
                            </h3>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[#a5b4fc] text-[8px] font-mono font-semibold">Active</span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 group-hover:text-zinc-350 transition-colors line-clamp-2">
                            {theme.description}
                          </p>
                        </div>

                        {/* Bottom: Category + Preview link */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-500 capitalize">
                            {theme.category}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-550 group-hover:text-indigo-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                            <span>Preview</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-zinc-550 border-t border-white/5 bg-[#15121b]/80 relative z-20">
        <p>Each theme is a complete design identity — not just colors, but layout, structure, sections, and personality.</p>
      </footer>

      {/* Template Selector/Preview Modal */}
      <TemplateSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleConfirmSelect} 
      />
    </div>
  );
}
