'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only mount on desktop viewports where cursor-none is applied
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleElementMouseEnter = () => setHovered(true);
    const handleElementMouseLeave = () => setHovered(false);

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], input[type="range"]'
      );
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleElementMouseEnter);
        el.removeEventListener('mouseleave', handleElementMouseLeave);
        el.addEventListener('mouseenter', handleElementMouseEnter);
        el.addEventListener('mouseleave', handleElementMouseLeave);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    addHoverListeners();

    // Dynamic mutation observer to capture newly rendered elements in wizard/stepper views
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Precision inner center dot */}
      <div
        className="fixed pointer-events-none z-[99999] rounded-full bg-[#c5a029] transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clicked ? 0.75 : 1})`,
          width: '6px',
          height: '6px',
        }}
      />
      {/* Outer interactive halo */}
      <div
        className="fixed pointer-events-none z-[99999] rounded-full border border-[#c5a029]/40 mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 1.6 : clicked ? 0.95 : 1})`,
          width: '24px',
          height: '24px',
          backgroundColor: hovered ? 'rgba(197, 160, 41, 0.08)' : 'transparent',
        }}
      />
    </>
  );
}
