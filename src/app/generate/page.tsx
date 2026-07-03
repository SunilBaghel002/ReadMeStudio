'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { FaGithub } from 'react-icons/fa';
import {
  ArrowRight,
  AlertCircle,
  Lock,
  ArrowLeft
} from 'lucide-react';
import WebGLBackground from '@/components/UI/WebGLBackground';

export default function OnboardingPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const { fetchUserData, isLoading, error, selectedTemplate, selectedThemeId, resetStore, loadTheme } = useBuilderStore();

  // Redirect to templates page if no template was selected
  useEffect(() => {
    if (!selectedTemplate && !selectedThemeId) {
      router.push('/templates');
    }
  }, [selectedTemplate, selectedThemeId, router]);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    // Reset previous fetched data but keep selectedTemplate/Theme!
    const activeTemplate = selectedTemplate;
    const activeThemeId = selectedThemeId;
    resetStore();
    
    // Restore template/theme in state
    if (activeThemeId) {
      loadTheme(activeThemeId);
    } else if (activeTemplate) {
      useBuilderStore.setState({ selectedTemplate: activeTemplate });
      const store = useBuilderStore.getState();
      store.loadTemplate(activeTemplate as any);
    }

    const success = await fetchUserData(usernameInput.trim());
    if (success) {
      router.push('/builder');
    }
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
            <Link href="/templates" className="text-xs font-semibold text-zinc-450 hover:text-white transition-colors duration-200 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Templates</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Onboarding content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 z-10 relative">
        <div className="w-full max-w-xl flex flex-col items-center space-y-6">

          {/* Center Input Card */}
          <div className="glass-panel w-full p-8 md:p-12 rounded-[20px] bg-zinc-950/40 border border-white/10 flex flex-col items-center text-center shadow-2xl relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            
            {/* GitHub Icon Container */}
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
              <FaGithub className="w-10 h-10 text-white" />
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Enter your GitHub username</h1>
            <p className="text-zinc-400 text-xs font-light mb-8">We'll fetch and aggregate all your stats and inject them into your template</p>

            {/* Form */}
            <form onSubmit={handleFetch} className="w-full flex flex-col gap-4">
              <div className="input-inset flex items-center px-4 rounded-lg h-14 w-full group relative bg-[#0D1117] border border-[#30363D] focus-within:border-[#7c3aed] focus-within:ring-1 focus-within:ring-[#7c3aed] focus-within:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                <span className="text-zinc-550 mr-3 text-sm font-semibold select-none">@</span>
                <input
                  type="text"
                  placeholder="e.g. torvalds"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={isLoading}
                  className="bg-transparent border-none w-full text-white text-sm focus:ring-0 p-0 placeholder-zinc-650 outline-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !usernameInput.trim()}
                className="btn-primary w-full h-14 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-[#7c3aed] btn-glow transition-all hover:scale-[1.01] gap-2 mt-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Syncing profile data...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Lock Info */}
            <div className="mt-8 flex items-center gap-2 text-zinc-550 font-semibold text-[10px] tracking-widest uppercase select-none">
              <Lock className="h-3.5 w-3.5" />
              <span>Token stays private &amp; secure</span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex gap-2.5 items-start text-left"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Lookup Failure</span>
                {error}. Please check your connection and try again.
              </div>
            </motion.div>
          )}

        </div>
      </main>

      <footer className="w-full py-8 text-center text-xs text-zinc-550 border-t border-white/5 bg-[#15121b]/80 relative z-20">
        <p>ReadMeStudio retrieves public metadata securely using server-side Next.js route APIs.</p>
      </footer>
    </div>
  );
}
