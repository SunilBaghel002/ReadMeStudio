'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBuilderStore } from '@/store/useBuilderStore';
import SectionList from '@/components/Builder/SectionList';
import PreviewPanel from '@/components/Preview/PreviewPanel';
import Inspector from '@/components/Builder/Inspector';
import ExportModal from '@/components/Preview/ExportModal';
import Link from 'next/link';
import { generateMarkdown } from '@/lib/markdown';
import { 
  Layout, 
  ChevronLeft, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Sliders, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuilderPage() {
  const router = useRouter();
  const { 
    username,
    githubData,
    profile, 
    resetStore,
    sections,
    showEmojis,
    showBanners,
    bannerImage,
    accentColor,
    statsCardTheme,
    readmeStyle
  } = useBuilderStore();

  const [mobileTab, setMobileTab] = useState<'sections' | 'preview' | 'customize'>('preview');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [markdown, setMarkdown] = useState('');

  // Redirect to generate onboarding page if no GitHub data exists
  useEffect(() => {
    if (!githubData || !username) {
      router.push('/generate');
    }
  }, [githubData, username, router]);

  // Re-generate markdown to keep export actions updated
  useEffect(() => {
    if (username) {
      const md = generateMarkdown(sections, username, {
        showEmojis,
        showBanners,
        bannerImage,
        accentColor,
        statsCardTheme,
        readmeStyle,
      });
      setMarkdown(md);
    }
  }, [sections, username, showEmojis, showBanners, bannerImage, accentColor, statsCardTheme, readmeStyle]);

  const handleSwitchProfile = () => {
    resetStore();
    router.push('/generate');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#3b82f6', '#8b5cf6'],
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'README.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!githubData || !username) {
    return (
      <div className="min-h-screen bg-[#15121b] flex items-center justify-center text-zinc-500 text-sm">
        <span>Loading workspace session...</span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#15121b] text-[#e8dfee] flex flex-col overflow-hidden relative noise-bg antialiased">
      {/* Background neon glows */}
      <div className="absolute top-[-30%] left-[20%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="h-14 bg-[#15121b]/80 backdrop-blur-xl border-b border-white/5 fixed w-full z-50 flex justify-between items-center px-4 md:px-12">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline-lg-mobile text-sm font-extrabold tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text">
              ReadMeStudio
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 bg-[#221e28] px-3 py-1 rounded-full ml-4 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-xs text-[#ccc3d8]">@{username}</span>
          </div>
        </div>

        {/* Action button controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwitchProfile}
            className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-350 font-bold px-3 py-2 border border-white/5 rounded-lg mr-2 transition-colors cursor-pointer hidden sm:block"
          >
            Switch User
          </button>
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-lg border border-white/5 bg-transparent hover:bg-zinc-800/20 text-[#ccc3d8] hover:text-white font-semibold text-xs transition-colors hidden md:block cursor-pointer"
          >
            Preview Markdown
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white font-bold text-xs hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 cursor-pointer btn-glow"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg border border-white/5 hover:bg-zinc-800/20 text-[#ccc3d8] transition-colors cursor-pointer"
            title="Download .md"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex mt-14 overflow-hidden relative z-20">
        
        {/* Desktop View: Side by side */}
        {/* Left Panel: Sections Manager */}
        <div className="hidden md:block w-[260px] shrink-0 h-full border-r border-white/5">
          <SectionList />
        </div>

        {/* Center Panel: Live Preview */}
        <div className="hidden md:block flex-1 h-full min-w-0 bg-[#15121b]/50">
          <PreviewPanel />
        </div>

        {/* Right Panel: Customize Inspector */}
        <div className="hidden lg:block w-[300px] shrink-0 h-full border-l border-white/5">
          <Inspector />
        </div>

        {/* Mobile View: Dynamic single panel layout based on tab bar */}
        <div className="flex md:hidden w-full h-full">
          {mobileTab === 'sections' && (
            <div className="w-full h-full">
              <SectionList />
            </div>
          )}
          {mobileTab === 'preview' && (
            <div className="w-full h-full">
              <PreviewPanel />
            </div>
          )}
          {mobileTab === 'customize' && (
            <div className="w-full h-full">
              <Inspector />
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <div className="flex md:hidden h-16 w-full border-t border-white/5 bg-[#15121b]/90 backdrop-blur-md justify-around items-center shrink-0 z-20">
        <button
          onClick={() => setMobileTab('sections')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            mobileTab === 'sections' ? 'text-indigo-400' : 'text-zinc-500'
          }`}
        >
          <Layers className="h-4.5 w-4.5" />
          <span>Sections</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            mobileTab === 'preview' ? 'text-indigo-400' : 'text-zinc-500'
          }`}
        >
          <Eye className="h-4.5 w-4.5" />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setMobileTab('customize')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            mobileTab === 'customize' ? 'text-indigo-400' : 'text-zinc-500'
          }`}
        >
          <Sliders className="h-4.5 w-4.5" />
          <span>Customize</span>
        </button>
      </div>

      {/* Export modal wrapper */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        markdown={markdown}
      />
    </div>
  );
}
