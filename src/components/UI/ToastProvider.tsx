'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ToastProvider() {
  const { toasts, removeToast } = useBuilderStore(useShallow(state => ({
    toasts: state.toasts || [],
    removeToast: state.removeToast,
  })));

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'warning' ? AlertCircle : Info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={cn(
                "pointer-events-auto w-full p-4 rounded-xl flex items-start gap-3 shadow-2xl border backdrop-blur-xl relative overflow-hidden",
                toast.type === 'success' 
                  ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                  : toast.type === 'warning'
                  ? "bg-amber-950/20 border-amber-500/20 text-amber-300"
                  : "bg-indigo-950/20 border-indigo-500/20 text-indigo-300"
              )}
            >
              <div 
                className="absolute top-0 inset-x-0 h-0.5" 
                style={{
                  background: toast.type === 'success' 
                    ? '#10b981' 
                    : toast.type === 'warning'
                    ? '#f59e0b'
                    : '#6366f1'
                }}
              />
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-grow pr-4">
                <p className="text-xs font-bold leading-normal text-white">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-550 hover:text-white transition-colors cursor-pointer shrink-0 absolute top-3.5 right-3"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
