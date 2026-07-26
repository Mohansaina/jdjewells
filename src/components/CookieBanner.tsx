'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Cookie } from 'lucide-react';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or declined cookies
    const consent = localStorage.getItem('jd_cookie_consent');
    if (!consent) {
      // Show banner after a slight 1.5s delay for smooth entrance
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('jd_cookie_consent', 'accepted_all');
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('jd_cookie_consent', 'necessary_only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[300] animate-menu-slide-down text-left">
      <div className="bg-[#0a0a0c]/95 backdrop-blur-md border border-gold-500/35 text-white p-6 sm:p-7 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4 relative overflow-hidden group">
        {/* Luxury corner brackets like a bench certificate plaque */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold-400/40 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold-400/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold-400/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold-400/40 pointer-events-none" />

        {/* Ambient gold glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-400/30 flex items-center justify-center">
              <DiamondShapeSvg shape="Round" className="w-3.5 h-3.5 text-gold-400" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] text-gold-400 font-bold uppercase block">
                MAYFAIR PRIVACY VAULT
              </span>
              <h4 className="font-serif text-sm tracking-wider uppercase font-bold text-white leading-tight">
                Cookie & Preference Notice
              </h4>
            </div>
          </div>

          <button
            onClick={handleAcceptNecessary}
            className="text-neutral-400 hover:text-white p-1.5 transition-colors cursor-pointer rounded-full hover:bg-neutral-800/60"
            title="Close Notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 font-sans leading-relaxed font-light relative z-10">
          We use encrypted cookies and session tokens to retain your custom 3D ring designs, preserve regional currency preferences, and secure your GIA vault access in accordance with London Mayfair standards.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 relative z-10">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:flex-1 py-3 px-5 text-[10px] font-sans tracking-[0.2em] font-bold uppercase gold-gradient text-white hover:gold-gradient-hover shadow-lg rounded-xl transition-all duration-300 cursor-pointer text-center"
          >
            Accept All Preferences
          </button>
          <button
            onClick={handleAcceptNecessary}
            className="w-full sm:flex-1 py-3 px-5 text-[10px] font-sans tracking-[0.2em] font-bold uppercase border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 hover:bg-gold-500/10 transition-all rounded-xl cursor-pointer text-center"
          >
            Essentials Only
          </button>
        </div>
      </div>
    </div>
  );
}
