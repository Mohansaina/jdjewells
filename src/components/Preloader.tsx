'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// returning-visitor path can still hide the curtain before first paint.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SESSION_KEY = 'jd_jewel_loaded';
/** Keep the curtain up at least this long so a fast load doesn't flash. */
const MIN_VISIBLE_MS = 550;
/** Never hold the page hostage longer than this, even if `load` never fires. */
const MAX_VISIBLE_MS = 3500;
/** Curtain slide duration — must match `.animate-slide-up-curtain`. */
const CURTAIN_MS = 1100;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  // Rendered on the server so real content never flashes before the curtain.
  const [showLoader, setShowLoader] = useState(true);
  const startedAt = useRef<number>(0);

  // Returning visitors: drop the curtain before paint, no flash.
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

    startedAt.current = Date.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Prevent scrolling underneath the curtain.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let dismissTimer: ReturnType<typeof setTimeout>;
    let unmountTimer: ReturnType<typeof setTimeout>;
    let settled = false;

    // Creep toward 90% while the page is still working. Real completion drives
    // the last 10%, so the bar reflects readiness instead of a scripted delay.
    const creep = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : Math.min(p + Math.random() * 9 + 4, 90)));
    }, 90);

    const finish = () => {
      if (settled) return;
      settled = true;
      clearInterval(creep);
      setProgress(100);
      sessionStorage.setItem(SESSION_KEY, 'true');

      const elapsed = Date.now() - startedAt.current;
      const hold = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      dismissTimer = setTimeout(() => {
        setIsLoaded(true);
        // Reduced motion skips the slide entirely.
        unmountTimer = setTimeout(
          () => {
            setShowLoader(false);
            document.body.style.overflow = prevOverflow;
          },
          reduceMotion ? 0 : CURTAIN_MS
        );
      }, hold);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }

    // Safety net: never strand the visitor if `load` stalls on a hanging asset.
    const failsafe = setTimeout(finish, MAX_VISIBLE_MS);

    return () => {
      clearInterval(creep);
      clearTimeout(dismissTimer);
      clearTimeout(unmountTimer);
      clearTimeout(failsafe);
      window.removeEventListener('load', finish);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div
      id="jd-preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading JD Jewel"
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
            aria-hidden="true"
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
          {String(Math.round(progress)).padStart(3, '0')}%
        </span>
      </div>

      {/* Signature benchmark print in bottom corner */}
      <span className="absolute bottom-6 font-mono text-[8px] uppercase tracking-widest text-neutral-600">
        Mayfair Bench Vault System • EST. 1998
      </span>
    </div>
  );
}
