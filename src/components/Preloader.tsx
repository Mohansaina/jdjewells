'use client';

import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Check if the website has already been loaded in this browser session
    const hasLoadedThisSession = sessionStorage.getItem('jd_jewel_loaded');
    if (hasLoadedThisSession === 'true') {
      setShowLoader(false);
      return;
    }

    // Progress counter animation logic
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Slightly varying progress steps for a realistic premium load feel
      const increment = Math.floor(Math.random() * 8) + 3;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Brief pause at 100% before starting the transition
        setTimeout(() => {
          setIsLoaded(true);
          sessionStorage.setItem('jd_jewel_loaded', 'true');
          // Fully unmount the preloader from DOM after curtain slide-up completes (1.1s transition)
          setTimeout(() => {
            setShowLoader(false);
          }, 1100);
        }, 350);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !showLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white transition-transform ${
        isLoaded ? 'animate-slide-up-curtain pointer-events-none' : ''
      }`}
    >
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-[30%] left-[25%] -translate-x-1/2 w-80 h-80 rounded-full bg-gold-500/5 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[25%] translate-x-1/2 w-80 h-80 rounded-full bg-sky-500/5 filter blur-[120px] pointer-events-none" />

      {/* Main loader content container */}
      <div className="flex flex-col items-center gap-8 text-center z-10">
        
        {/* Outline Tracing Diamond SVG */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-gold-400 stroke-[1.2]"
            fill="none"
          >
            {/* Outer perimeter outline */}
            <polygon
              points="50,12 76,28 76,46 50,88 24,46 24,28"
              stroke="currentColor"
              className="animate-trace"
            />
            {/* Diamond Facet lines with staggered tracing offsets */}
            <line
              x1="50"
              y1="12"
              x2="50"
              y2="88"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.15s' }}
            />
            <line
              x1="24"
              y1="28"
              x2="76"
              y2="28"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.3s' }}
            />
            <line
              x1="24"
              y1="46"
              x2="76"
              y2="46"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.45s' }}
            />
            <line
              x1="50"
              y1="28"
              x2="24"
              y2="46"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.6s' }}
            />
            <line
              x1="50"
              y1="28"
              x2="76"
              y2="46"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.6s' }}
            />
            <line
              x1="50"
              y1="12"
              x2="24"
              y2="46"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.75s' }}
            />
            <line
              x1="50"
              y1="12"
              x2="76"
              y2="46"
              stroke="currentColor"
              className="animate-trace"
              style={{ animationDelay: '0.75s' }}
            />
          </svg>
        </div>

        {/* Branding Title */}
        <div className="space-y-2.5">
          <h2 className="font-serif text-2xl tracking-[0.35em] uppercase text-neutral-100 font-light">
            JD JEWEL
          </h2>
          <span className="text-[9px] font-sans tracking-[0.5em] text-gold-400 uppercase block font-bold">
            LONDON • bespoke atelier
          </span>
        </div>

        {/* Shimmering Gold Progress Indicator Bar */}
        <div className="w-48 h-[1px] bg-neutral-800 relative rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Numeric Progress Counter */}
        <span className="font-mono text-sm tracking-widest text-gold-300 font-bold">
          {String(progress).padStart(3, '0')}%
        </span>
      </div>

      {/* Signature benchmark print in bottom corner */}
      <span className="absolute bottom-6 font-mono text-[8px] uppercase tracking-widest text-neutral-600">
        Mayfair Bench Vault System • EST. 1998
      </span>
    </div>
  );
}
