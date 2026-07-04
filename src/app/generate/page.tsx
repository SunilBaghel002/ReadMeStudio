'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useShallow } from 'zustand/react/shallow';
import { FaGithub } from 'react-icons/fa';
import {
  ArrowRight,
  AlertCircle,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import WebGLBackground from '@/components/UI/WebGLBackground';
import FlowProgress from '@/components/UI/FlowProgress';

interface LoadingStep {
  label: string;
  status: 'pending' | 'loading' | 'done';
}

const INITIAL_STEPS: LoadingStep[] = [
  { label: 'Fetching profile...', status: 'pending' },
  { label: 'Loading repositories...', status: 'pending' },
  { label: 'Calculating language stats...', status: 'pending' },
  { label: 'Computing your streak...', status: 'pending' },
  { label: 'Preparing themes...', status: 'pending' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState('');
  const [shake, setShake] = useState(false);
  const [steps, setSteps] = useState<LoadingStep[]>(INITIAL_STEPS);
  const [animationIndex, setAnimationIndex] = useState(-1);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { fetchUserData, isLoading, error, resetStore } = useBuilderStore(useShallow(state => ({
    fetchUserData: state.fetchUserData,
    isLoading: state.isLoading,
    error: state.error,
    resetStore: state.resetStore,
  })));

  // Clean up store on start if desired, but don't force template selection redirects
  useEffect(() => {
    // We do not redirect if no template selected anymore!
  }, []);

  // Handle progressive animation steps
  const startProgressAnimation = (apiPromise: Promise<boolean>) => {
    setSteps(INITIAL_STEPS.map((s, idx) => idx === 0 ? { ...s, status: 'loading' } : s));
    setAnimationIndex(0);

    let currentIndex = 0;
    const intervalDuration = 600; // time per step in ms

    const runStep = () => {
      if (currentIndex >= INITIAL_STEPS.length - 1) {
        // We reached the last step, wait here until API returns
        return;
      }

      setSteps(prev => prev.map((step, idx) => {
        if (idx === currentIndex) return { ...step, status: 'done' };
        if (idx === currentIndex + 1) return { ...step, status: 'loading' };
        return step;
      }));
      currentIndex++;
      setAnimationIndex(currentIndex);
      
      animationTimerRef.current = setTimeout(runStep, intervalDuration);
    };

    animationTimerRef.current = setTimeout(runStep, intervalDuration);

    // Monitor the API call
    apiPromise.then((success) => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

      if (success) {
        // Fast-forward remaining steps to done
        setSteps(prev => prev.map(step => ({ ...step, status: 'done' })));
        setAnimationIndex(INITIAL_STEPS.length);

        // Redirect after a brief moment to let user see 100% completion
        setTimeout(() => {
          router.push('/themes');
        }, 600);
      } else {
        // Reset steps on error
        setSteps(INITIAL_STEPS);
        setAnimationIndex(-1);
        setShake(true);
      }
    });
  };

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();
    if (!cleanUsername || isLoading) return;

    // Reset store before fetching new user data
    resetStore();

    // Trigger API call
    const apiCall = fetchUserData(cleanUsername);
    
    // Animate UI progress steps
    startProgressAnimation(apiCall);
  };

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

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

      {/* Onboarding content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12 z-10 relative">
        <div className="w-full max-w-xl flex flex-col items-center space-y-6">
          
          {/* Progress Indicator */}
          <FlowProgress currentStep="generate" />

          {/* Center Input Card */}
          <motion.div 
            animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.5 } } : {}}
            onAnimationComplete={() => setShake(false)}
            className="glass-panel w-full p-8 md:p-12 rounded-[20px] bg-zinc-950/40 border border-white/10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            
            {/* GitHub Icon Container */}
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
              <FaGithub className="w-10 h-10 text-white" />
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Let's fetch your GitHub data</h1>
            <p className="text-zinc-400 text-xs font-light mb-8 max-w-sm">We'll customize everything with your real stats</p>

            {/* Form */}
            {!isLoading && animationIndex === -1 ? (
              <form onSubmit={handleFetch} className="w-full flex flex-col gap-4">
                <div className="input-inset flex items-center px-4 rounded-lg h-14 w-full group relative bg-[#0D1117] border border-[#30363D] focus-within:border-[#7c3aed] focus-within:ring-1 focus-within:ring-[#7c3aed] focus-within:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                  <span className="text-zinc-500 mr-2 text-sm font-semibold select-none">@</span>
                  <input
                    type="text"
                    placeholder="enter your github username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-transparent border-none w-full text-white text-sm focus:ring-0 p-0 placeholder-zinc-600 outline-none"
                    required
                  />
                </div>
                
                <span className="text-left text-[11px] text-zinc-500 font-mono -mt-2 px-1 select-none">e.g. torvalds, sindresorhus</span>
                
                <button
                  type="submit"
                  disabled={!usernameInput.trim()}
                  className="btn-primary w-full h-14 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-[#7c3aed] btn-glow transition-all hover:scale-[1.01] gap-2 mt-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Continue →</span>
                </button>
              </form>
            ) : (
              /* Loading / Animation State */
              <div className="w-full flex flex-col items-center space-y-6 py-2">
                <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm uppercase tracking-widest font-mono">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Syncing stats...</span>
                </div>
                
                {/* Progress Checklist */}
                <div className="w-full max-w-sm bg-zinc-950/30 border border-white/5 rounded-xl p-5 text-left flex flex-col gap-3 font-mono">
                  {steps.map((step, idx) => {
                    const isDone = step.status === 'done';
                    const isCurrent = step.status === 'loading';
                    const isPending = step.status === 'pending';

                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className={isDone ? "text-zinc-400" : isCurrent ? "text-indigo-300 font-bold" : "text-zinc-600"}>
                          {step.label}
                        </span>
                        <span>
                          {isDone && <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />}
                          {isCurrent && <Loader2 className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />}
                          {isPending && <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0" />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lock Info */}
            <div className="mt-8 flex flex-col gap-1 items-center justify-center">
              <div className="flex items-center gap-2 text-zinc-550 font-semibold text-[10px] tracking-widest uppercase select-none text-zinc-500">
                <Lock className="h-3.5 w-3.5" />
                <span>We only read public data</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono">⚡ Takes 3-5 seconds</span>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex gap-2.5 items-start text-left"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Lookup Failure</span>
                {error}. Please check the username and try again.
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
