'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  char: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: string;
}

export default function FallingDiamonds() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Determine mobile vs desktop particle count to avoid mobile GPU rendering glitches
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 12 : 24;

    const symbols = ['♦', '✨', '💎', '★'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      const left = `${Math.random() * 96 + 2}%`;
      const delay = `${Math.random() * 6}s`;
      const duration = `${10 + Math.random() * 10}s`;
      const size = isMobile ? `${12 + Math.random() * 10}px` : `${14 + Math.random() * 14}px`;
      const opacity = `${0.2 + Math.random() * 0.35}`;

      newParticles.push({
        id: i,
        char,
        left,
        delay,
        duration,
        size,
        opacity,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-[#e7d3a2] select-none pointer-events-none transform-gpu"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            opacity: p.opacity,
            animationName: 'fallDownHero',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
            textShadow: '0 0 8px rgba(231, 211, 162, 0.4)',
            willChange: 'transform',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
