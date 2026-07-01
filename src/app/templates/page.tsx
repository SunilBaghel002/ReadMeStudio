'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { TEMPLATES } from '@/config/templates.config';
import { 
  Cpu, 
  Layout, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  CloudLightning,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WebGLBackground from '@/components/UI/WebGLBackground';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Cpu,
  Layout,
  Sparkles,
  GraduationCap,
  Layers,
  CloudLightning,
};

export default function TemplatesPage() {
  const router = useRouter();
  const { loadTemplate, selectedTemplate } = useBuilderStore();

  const handleSelectTemplate = (id: any) => {
    // 1. Initialize builder sections using that template config
    // 2. Store selected template in global state
    loadTemplate(id);
    // 3. Redirect to username input
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-28 pb-16 z-10 relative">
        <div className="w-full max-w-5xl flex flex-col items-center">
          
          {/* Header Title */}
          <div className="text-center max-w-2xl mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
            >
              <span>Step 1: Select Your Template</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4"
            >
              Choose a template to build your README
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-400 text-sm md:text-base font-light leading-relaxed"
            >
              Start with a carefully arranged structural layout tailored for different development roles. Customize everything later in the editor.
            </motion.p>
          </div>

          {/* Templates Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {TEMPLATES.map((tmpl, idx) => {
              const Icon = ICON_MAP[tmpl.icon] || Layout;
              const isSelected = selectedTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={cn(
                    'p-6 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative group cursor-pointer shadow-xl bg-zinc-950/40 border-white/5 hover:border-indigo-500/50 hover:bg-zinc-950/65 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:scale-[1.02]'
                  )}
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    {/* Top Row: Icon and Status */}
                    <div className="flex justify-between items-center mb-5">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center border border-white/5 bg-zinc-900 group-hover:border-indigo-500/30 group-hover:bg-[#7c3aed]/10 transition-all duration-300">
                        <Icon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-550 group-hover:text-indigo-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                        <span>Select</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </div>

                    {/* Meta */}
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-250 transition-colors">
                      {tmpl.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6 group-hover:text-zinc-350 transition-colors">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Enabled Sections Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                    {tmpl.enabledSections.slice(0, 4).map((sect) => (
                      <span 
                        key={sect} 
                        className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-500 group-hover:text-zinc-400 group-hover:bg-white/10 transition-colors"
                      >
                        {sect}
                      </span>
                    ))}
                    {tmpl.enabledSections.length > 4 && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-zinc-550 group-hover:text-zinc-500 transition-colors">
                        +{tmpl.enabledSections.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-zinc-550 border-t border-white/5 bg-[#15121b]/80 relative z-20">
        <p>Choose your starting structure. ReadMeStudio will inject real GitHub data into this template layout.</p>
      </footer>
    </div>
  );
}
