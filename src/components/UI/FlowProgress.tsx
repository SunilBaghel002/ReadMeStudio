'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepId = 'generate' | 'themes' | 'builder' | 'export';

interface Step {
  id: StepId;
  label: string;
}

const STEPS: Step[] = [
  { id: 'generate', label: 'Username' },
  { id: 'themes', label: 'Choose Theme' },
  { id: 'builder', label: 'Customize' },
  { id: 'export', label: 'Export' },
];

interface FlowProgressProps {
  currentStep: StepId;
  compact?: boolean;
}

export default function FlowProgress({ currentStep, compact = false }: FlowProgressProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider select-none font-mono">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && <span className="text-zinc-700">→</span>}
              <span
                className={cn(
                  isCompleted && "text-indigo-400",
                  isActive && "text-white underline decoration-indigo-500 decoration-2 underline-offset-4",
                  isPending && "text-zinc-600"
                )}
              >
                {step.label} {isCompleted ? '✓' : isActive ? '●' : '○'}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 select-none">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        
        {/* Active Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-[#7c3aed] -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border",
                  isCompleted && "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]",
                  isActive && "bg-[#15121b] border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(124,58,237,0.4)] scale-110",
                  isPending && "bg-[#15121b] border-zinc-800 text-zinc-500"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-[10px] uppercase tracking-wider font-bold transition-all duration-300",
                  isCompleted && "text-zinc-500",
                  isActive && "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                  isPending && "text-zinc-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
