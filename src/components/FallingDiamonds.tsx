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
    // Generate particles after mount to ensure clean hydration without mismatch
    const symbols = ['♦', '💍', '✨', '💎', '★'];
    const newParticles: Particle[] = [];

    // Create 45 distinct falling particles
    for (let i = 0; i < 45; i++) {
      const char = symbols[Math.floor(Math.random() * symbols.length)];
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 8}s`;
      const duration = `${8 + Math.random() * 12}s`;
      const size = `${12 + Math.random() * 20}px`;
      const opacity = `${0.15 + Math.random() * 0.4}`;

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
          className="absolute text-white select-none pointer-events-none"
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
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 6px rgba(197, 160, 41, 0.4))',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
