'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

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
    <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-[300] animate-menu-slide-down">
      <div className="bg-[#0e0e11]/95 backdrop-blur-md border border-gold-500/35 text-white py-3.5 px-5 sm:px-6 rounded-2xl md:rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-3 relative overflow-hidden">
        {/* Ambient subtle gold glow */}
        <div className="absolute top-0 right-1/4 w-32 h-16 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 text-left w-full md:w-auto">
          <Cookie className="h-4 w-4 text-gold-400 flex-shrink-0" />
          <p className="text-xs text-neutral-300 font-sans font-light leading-snug">
            We use essential cookies to preserve your 3D ring designs & session security.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-shrink-0">
          <button
            onClick={handleAcceptAll}
            className="py-2 px-4 text-[10px] font-sans tracking-widest font-bold uppercase gold-gradient text-white hover:gold-gradient-hover shadow-sm rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Accept All
          </button>
          <button
            onClick={handleAcceptNecessary}
            className="py-2 px-4 text-[10px] font-sans tracking-widest font-bold uppercase border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 hover:bg-gold-500/10 transition-all rounded-full cursor-pointer whitespace-nowrap"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptNecessary}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer ml-1"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
