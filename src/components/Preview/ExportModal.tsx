'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useBuilderStore } from '@/store/useBuilderStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
}

export default function ExportModal({ isOpen, onClose, markdown }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<'copy' | 'download' | 'guide'>('copy');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    
    // Confetti effect!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
    });

    useBuilderStore.getState().addToast('Markdown code copied to clipboard! Go paste it in GitHub! 🚀', 'success');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[640px] bg-[#0D1117] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.15)] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-zinc-800/30 cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white mb-1">Your README is ready! 🎉</h2>
          <p className="text-xs text-zinc-400">Copy or download your markdown file</p>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-white/5 bg-zinc-950/20">
          {(['copy', 'download', 'guide'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-4 mr-6 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'border-[#7c3aed] text-indigo-300'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'copy' && 'Copy Markdown'}
              {tab === 'download' && 'Download'}
              {tab === 'guide' && 'How to Use'}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[450px]">
          {activeTab === 'copy' && (
            <div className="space-y-4">
              <div className="relative group rounded-lg overflow-hidden border border-white/5 bg-[#0a080d]">
                {/* Floating Copy Button */}
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={handleCopy}
                    className="bg-zinc-900 border border-white/10 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 p-2 rounded-lg backdrop-blur-md transition-all shadow-sm cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-450" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Scrollable code block with line numbers */}
                <div className="flex font-mono text-xs max-h-[260px] overflow-y-auto p-4 select-text">
                  {/* Line Numbers column */}
                  <div className="flex flex-col text-zinc-600 pr-4 select-none text-right border-r border-white/5 mr-4 font-mono">
                    {markdown.split('\n').map((_, index) => (
                      <span key={index}>{index + 1}</span>
                    ))}
                  </div>
                  {/* Raw Code column */}
                  <pre className="text-zinc-300 font-mono whitespace-pre text-left flex-1 overflow-x-auto selection:bg-indigo-500/25">
                    <code>{markdown}</code>
                  </pre>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer btn-glow text-xs uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4.5 w-4.5" />
                    <span>Copy Full Markdown Code</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'download' && (
            <div className="space-y-5 text-center flex flex-col items-center py-6 bg-zinc-950/20 rounded-xl border border-white/5 p-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-450 border border-[#7c3aed]/20">
                <Download className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-zinc-200 mb-1">Download README.md File</h4>
                <p className="text-xs text-zinc-400 font-light max-w-xs leading-relaxed">
                  Downloads a local `README.md` text file ready to commit to your GitHub profile.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-200 font-bold py-3.5 rounded-lg transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Download className="h-4 w-4" />
                <span>Download README.md</span>
              </button>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="text-left space-y-4 font-sans">
              <div className="flex gap-2.5 p-3 rounded-lg bg-indigo-500/5 border border-[#7c3aed]/15 text-indigo-400 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">This markdown works as a profile README, which is displayed on your public GitHub profile page.</p>
              </div>

              <div className="space-y-3 font-light text-zinc-350 text-xs leading-relaxed">
                <div className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 rounded bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center font-mono">1</span>
                  <p>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">github.com/new</a> to create a new repository.</p>
                </div>
                <div className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 rounded bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center font-mono">2</span>
                  <p>Name the repository <strong>exactly matching your GitHub username</strong>. (GitHub will show a special popup badge!).</p>
                </div>
                <div className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 rounded bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center font-mono">3</span>
                  <p>Check the box to <strong>Initialize this repository with a README</strong>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="h-5 w-5 shrink-0 rounded bg-zinc-800 text-zinc-300 font-bold flex items-center justify-center font-mono">4</span>
                  <p>Open the repository README, click edit, paste your copied markdown code, and click commit.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
