'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Lock,
  GitCommit,
  Flame,
  LayoutGrid,
  GripVertical,
  Palette,
  Eye,
  Download
} from 'lucide-react';
import WebGLBackground from '@/components/UI/WebGLBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#15121b] text-[#e8dfee] flex flex-col justify-between overflow-x-hidden font-sans antialiased bg-mesh-texture selection:bg-indigo-500/30 selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* WebGL Animated Shader Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <WebGLBackground />
      </div>

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full bg-[#15121b]/80 backdrop-blur-xl border-b border-white/5 shadow-sm z-50 transition-all duration-300">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text">
              ReadMeStudio
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex gap-8 items-center text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#templates" className="hover:text-white transition-colors duration-200">Templates</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</a>
            <a href="#examples" className="hover:text-white transition-colors duration-200">Examples</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/templates" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-200 hidden sm:block">
              Log in
            </Link>
            <Link
              href="/templates"
              className="bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white px-5 py-2.5 rounded-lg text-xs font-bold btn-glow transition-all hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow z-10 relative mt-16">
        
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Streak Tracker Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
            style={{ boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' }}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>Now with accurate GitHub streak tracking</span>
          </motion.div>

          {/* Header Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-4xl text-white"
          >
            <span className="block mb-2">Craft Your GitHub</span>
            <span className="block text-gradient">Developer Identity.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 max-w-[560px] mx-auto mb-10 text-base md:text-lg font-light leading-relaxed"
          >
            The most accurate and beautifully designed GitHub README generator. Fetch real stats, customize freely, and export in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 w-full sm:w-auto"
          >
            <Link
              href="/templates"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white px-8 py-3.5 rounded-lg text-xs font-bold btn-glow flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Generate My README</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/20 text-[#e8dfee] text-xs font-bold text-center transition-all"
            >
              View Templates
            </a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 text-zinc-500 text-xs font-mono mb-20 opacity-90"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-zinc-650" />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-zinc-650" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-zinc-650" />
              <span>Token stays private</span>
            </div>
          </motion.div>

          {/* Visual Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative w-full max-w-5xl mx-auto mt-4 px-4"
            style={{ perspective: '1000px' }}
          >
            <div
              className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#0d1117]/95"
              style={{
                transform: 'rotateX(5deg) scale(0.95)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Browser Window Bar */}
              <div className="h-10 bg-zinc-950/80 border-b border-white/5 flex items-center px-4 gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
                <div className="flex-1 text-center text-[10px] text-zinc-600 font-mono">readmestudio.app/builder</div>
              </div>
              
              {/* Mockup Dashboard Preview Image */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT6s6vUkj2H8aBoyKnudSG-NI_Ca3R865dCkjM4nI11mFjjxX2E5LgT4EasVhkzMaUF6b0IfL-myjFEjnhDkekWUkgsdqrbWpM4icPx-kcZCKNlSKEaJvYBsQsTw73joryWujrPa3rpYVme72bYIUd6d1n8P5YYhQKNbHx8e2hMvseYBMJ2OpCHCp_vfTk1EzCcuyzhf3XGuVUFCBbtljcQL4LjXa06GSd-OEwAUofJzfvCbgOA1AjhRIf45OqJoue1mqRwy5s0B-U"
                alt="ReadMeStudio Editor UI Workspace Mockup"
                className="w-full h-auto object-cover opacity-90 select-none pointer-events-none"
              />
            </div>

            {/* Floating Visual Badges */}
            {/* Badge 1: Contributions */}
            <div className="absolute -left-2 md:-left-8 top-1/4 glass-panel px-4 py-3 rounded-lg flex items-center gap-3 animate-bounce shadow-xl bg-zinc-950/80 border border-white/10" style={{ animationDuration: '4s' }}>
              <GitCommit className="h-5 w-5 text-indigo-400" />
              <div className="text-left">
                <div className="text-[10px] font-mono text-zinc-400">Contributions</div>
                <div className="text-sm font-bold text-white leading-none mt-0.5">847</div>
              </div>
            </div>

            {/* Badge 2: Current Streak */}
            <div className="absolute -right-2 md:-right-8 bottom-1/3 glass-panel px-4 py-3 rounded-lg flex items-center gap-3 animate-bounce shadow-xl bg-zinc-950/80 border border-white/10" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <Flame className="h-5 w-5 text-indigo-400" />
              <div className="text-left">
                <div className="text-[10px] font-mono text-zinc-400">Current Streak</div>
                <div className="text-sm font-bold text-white leading-none mt-0.5">15 Days</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Statistics Banner */}
        <section className="w-full bg-[#1d1a24]/50 border-y border-white/5 py-8 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <div className="text-2xl md:text-3xl font-black text-indigo-400 mb-1">10k+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">READMEs</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-indigo-400 mb-1">6+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Templates</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-indigo-400 mb-1">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Accurate Stats</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-indigo-400 mb-1">Free</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Forever</div>
            </div>
          </div>
        </section>

        {/* Features Bento Section */}
        <section id="features" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-white">Everything you need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Real GitHub Data */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real GitHub Data</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Fetches your actual repositories, stars, and languages directly via GitHub GraphQL API.
              </p>
            </div>

            {/* Feature 2: Accurate Streak Tracking */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Accurate Streak Tracking</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Calculates your commit streak with precision, no weird timezone bugs.
              </p>
            </div>

            {/* Feature 3: Drag & Drop Builder */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <GripVertical className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drag &amp; Drop Builder</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Visually arrange your sections without touching a single line of markdown.
              </p>
            </div>

            {/* Feature 4: Premium Themes */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Themes</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Choose from carefully crafted color palettes that look great in light and dark mode.
              </p>
            </div>

            {/* Feature 5: Live Preview */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Preview</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                See exactly how your README will look on GitHub before you export it.
              </p>
            </div>

            {/* Feature 6: One Click Export */}
            <div className="glass-panel p-6 rounded-xl group border border-white/5 hover:border-indigo-500/50 bg-[#0d1117]/80 hover:bg-[#0d1117] transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-450 mb-6 group-hover:scale-110 transition-transform">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">One Click Export</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                Copy to clipboard or download the markdown file instantly.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Callout Card */}
        <section className="py-24 px-6 md:px-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 mix-blend-screen pointer-events-none" />
          <div
            className="max-w-3xl mx-auto glass-panel p-12 rounded-2xl relative z-10 border border-indigo-500/30 bg-[#0d1117]/80"
            style={{ boxShadow: '0 0 100px -20px rgba(124, 58, 237, 0.2)' }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Ready to stand out?</h2>
            <p className="text-zinc-400 mb-10 text-base md:text-lg font-light leading-relaxed">
              Join thousands of developers who have leveled up their GitHub profiles.
            </p>
            <Link
              href="/templates"
              className="inline-block bg-gradient-to-r from-indigo-400 to-[#7c3aed] text-white px-10 py-4 rounded-lg text-sm font-bold uppercase tracking-wider btn-glow hover:scale-[1.02]"
            >
              Generate My README Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#15121b] border-t border-white/5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-12 py-20 max-w-7xl mx-auto w-full">
          {/* Info Column */}
          <div className="space-y-4">
            <span className="font-extrabold text-white text-lg tracking-tight uppercase">ReadMeStudio</span>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs font-light">
              Crafting professional developer identities through beautiful, data-driven READMEs.
            </p>
            <p className="text-zinc-500 text-[10px] font-mono">
              © {new Date().getFullYear()} ReadMeStudio. All rights reserved.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#templates" className="hover:text-white transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">GitHub Guides</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
