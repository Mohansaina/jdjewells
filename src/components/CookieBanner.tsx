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
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[300] animate-menu-slide-down">
      <div className="bg-[#0e0e11]/95 backdrop-blur-md border border-gold-500/30 text-white p-5 sm:p-6 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-4 relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-gold-400">
            <Cookie className="h-5 w-5 text-gold-400 flex-shrink-0" />
            <span className="font-serif text-sm tracking-widest uppercase font-bold text-white">
              Cookie & Privacy Notice
            </span>
          </div>
          <button
            onClick={handleAcceptNecessary}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 font-sans leading-relaxed font-light">
          We use cookies and encrypted local tokens to enhance your luxury shopping experience, preserve your custom ring configurations, and secure your session data in accordance with Mayfair Vault standards.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:flex-1 py-2.5 px-4 text-[10px] font-sans tracking-widest font-bold uppercase gold-gradient text-white hover:gold-gradient-hover shadow-md rounded-lg transition-all duration-300 cursor-pointer text-center"
          >
            Accept All Cookies
          </button>
          <button
            onClick={handleAcceptNecessary}
            className="w-full sm:flex-1 py-2.5 px-4 text-[10px] font-sans tracking-widest font-bold uppercase border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 hover:bg-gold-500/10 transition-all rounded-lg cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
