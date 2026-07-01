'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg: string) => showToast(msg, 'success'), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, 'error'), [showToast]);
  const warning = useCallback((msg: string) => showToast(msg, 'warning'), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, 'info'), [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => {
          let Icon = Info;
          let bgColor = 'bg-neutral-900/95 border-neutral-800 text-neutral-200';
          let iconColor = 'text-gold-400';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            bgColor = 'bg-[#121212]/95 border-gold/30 text-white';
            iconColor = 'text-gold-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            bgColor = 'bg-red-950/95 border-red-500/30 text-red-200';
            iconColor = 'text-red-400';
          } else if (toast.type === 'warning') {
            Icon = AlertCircle;
            bgColor = 'bg-[#1c1917]/95 border-amber-500/30 text-amber-200';
            iconColor = 'text-amber-400';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-none border shadow-2xl backdrop-blur-md animate-slide-up ${bgColor} transition-all duration-300`}
              role="alert"
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor} mt-0.5`} />
              <div className="flex-1 text-xs font-medium tracking-wide leading-relaxed font-sans">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-white transition-colors flex-shrink-0 ml-1"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
