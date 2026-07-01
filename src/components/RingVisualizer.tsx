'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import { DiamondShape, SettingStyle, MetalType } from '@/context/ConfiguratorContext';

interface RingVisualizerProps {
  shape: DiamondShape;
  setting: SettingStyle;
  metal: MetalType;
  zoomable?: boolean;
}

const SPARKLES_COORDS = [
  { x: 44, y: 32, delay: 0, size: 8 },
  { x: 56, y: 32, delay: 0.4, size: 6 },
  { x: 50, y: 26, delay: 1.0, size: 10 },
  { x: 40, y: 40, delay: 0.7, size: 5 },
  { x: 60, y: 40, delay: 1.3, size: 8 },
  { x: 50, y: 48, delay: 0.2, size: 7 },
  { x: 46, y: 24, delay: 1.5, size: 5 },
  { x: 54, y: 24, delay: 0.8, size: 6 },
  { x: 36, y: 34, delay: 1.2, size: 7 },
  { x: 64, y: 34, delay: 0.5, size: 6 }
];

export default function RingVisualizer({ shape, setting, metal, zoomable = true }: RingVisualizerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(30); // 0 to 100 representing horizontal rotation slider
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef({ x: 0, rotation: 30 });
  const visualizerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = visualizerRef.current;
    if (!el) return;

    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    el.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      el.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, rotation: rotation };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const diffX = e.clientX - dragStartRef.current.x;
    const sensitivity = 3; // pixels per unit of rotation
    const newRotation = Math.max(0, Math.min(100, dragStartRef.current.rotation + diffX / sensitivity));
    setRotation(newRotation);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };



  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.7));
  const handleReset = () => {
    setZoom(1);
    setRotation(30);
  };

  // Define metal gradient colors
  const getMetalGradients = () => {
    switch (metal) {
      case 'Yellow Gold':
        return {
          band: 'url(#yellow-gold-grad)',
          bandHighlight: 'url(#yellow-gold-highlight)',
          highlight: '#fff7d9',
          shadow: '#73520e'
        };
      case 'Rose Gold':
        return {
          band: 'url(#rose-gold-grad)',
          bandHighlight: 'url(#rose-gold-highlight)',
          highlight: '#ffebdf',
          shadow: '#7e4635'
        };
      case 'Platinum':
      case 'White Gold':
      default:
        return {
          band: 'url(#platinum-grad)',
          bandHighlight: 'url(#platinum-highlight)',
          highlight: '#ffffff',
          shadow: '#4d5156'
        };
    }
  };

  const colors = getMetalGradients();

  // Define center diamond vector paths based on shape with high-fidelity luxury facets
  const renderDiamondFacets = () => {
    const strokeColor = 'rgba(186, 215, 235, 0.85)';
    const strokeWidth = '0.45';

    switch (shape) {
      case 'Princess': // Square cut
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer perimeter */}
            <rect x="38" y="28" width="24" height="24" rx="0.5" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table Facet */}
            <rect x="44" y="34" width="12" height="12" rx="0.3" fill="rgba(255, 255, 255, 0.7)" />
            {/* Corner Facets */}
            <polygon points="38,28 44,34 50,34 50,28" fill="url(#diamond-fire-grad)" />
            <polygon points="62,28 56,34 50,34 50,28" fill="url(#diamond-fire-accent)" />
            <polygon points="62,52 56,46 50,46 50,52" fill="url(#diamond-fire-grad)" />
            <polygon points="38,52 44,46 50,46 50,52" fill="url(#diamond-fire-accent)" />
            {/* Side Facets */}
            <polygon points="38,28 38,40 44,40 44,34" fill="url(#diamond-fire-accent)" />
            <polygon points="38,52 38,40 44,40 44,46" fill="url(#diamond-fire-grad)" />
            <polygon points="62,28 62,40 56,40 56,34" fill="url(#diamond-fire-grad)" />
            <polygon points="62,52 62,40 56,40 56,46" fill="url(#diamond-fire-accent)" />
            {/* Cross Brilliance cuts */}
            <line x1="44" y1="34" x2="56" y2="46" />
            <line x1="56" y1="34" x2="44" y2="46" />
            <line x1="50" y1="34" x2="50" y2="46" />
            <line x1="44" y1="40" x2="56" y2="40" />
          </g>
        );
      case 'Emerald': // Step cut rectangle
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer step 1 */}
            <rect x="38" y="27" width="24" height="26" rx="1" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Step 2 */}
            <rect x="41" y="30" width="18" height="20" rx="0.5" fill="url(#diamond-fire-grad)" />
            {/* Step 3 */}
            <rect x="44" y="33" width="12" height="14" rx="0.3" fill="url(#diamond-fire-accent)" />
            {/* Table Facet */}
            <rect x="47" y="36" width="6" height="8" fill="rgba(255, 255, 255, 0.75)" />
            {/* Diagonal cuts for corners */}
            <line x1="38" y1="27" x2="47" y2="36" />
            <line x1="62" y1="27" x2="53" y2="36" />
            <line x1="38" y1="53" x2="47" y2="44" />
            <line x1="62" y1="53" x2="53" y2="44" />
            <line x1="41" y1="30" x2="47" y2="36" />
            <line x1="59" y1="30" x2="53" y2="36" />
            <line x1="41" y1="50" x2="47" y2="44" />
            <line x1="59" y1="50" x2="53" y2="44" />
          </g>
        );
      case 'Oval':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Oval shape */}
            <ellipse cx="50" cy="40" rx="12" ry="15" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table facet */}
            <ellipse cx="50" cy="40" rx="6.5" ry="8.5" fill="rgba(255, 255, 255, 0.75)" />
            {/* Star and Pavilion Facet Lines */}
            <path d="M 50,25 Q 42,32 43.5,40" fill="url(#diamond-fire-grad)" />
            <path d="M 50,25 Q 58,32 56.5,40" fill="url(#diamond-fire-accent)" />
            <path d="M 50,55 Q 42,48 43.5,40" fill="url(#diamond-fire-accent)" />
            <path d="M 50,55 Q 58,48 56.5,40" fill="url(#diamond-fire-grad)" />
            {/* Ray lines radiating */}
            <line x1="50" y1="25" x2="50" y2="31.5" />
            <line x1="50" y1="55" x2="50" y2="48.5" />
            <line x1="38" y1="40" x2="43.5" y2="40" />
            <line x1="62" y1="40" x2="56.5" y2="40" />
            {/* Diagonal facet divisions */}
            <line x1="41.5" y1="29.5" x2="45.5" y2="34" />
            <line x1="58.5" y1="29.5" x2="54.5" y2="34" />
            <line x1="41.5" y1="50.5" x2="45.5" y2="46" />
            <line x1="58.5" y1="50.5" x2="54.5" y2="46" />
            {/* Micro facets in the middle */}
            <line x1="43.5" y1="40" x2="56.5" y2="40" />
            <line x1="50" y1="31.5" x2="50" y2="48.5" />
          </g>
        );
      case 'Cushion': // Rounded square
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Cushion square */}
            <rect x="38" y="28" width="24" height="24" rx="7.5" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table facet */}
            <rect x="44" y="34" width="12" height="12" rx="3" fill="rgba(255, 255, 255, 0.7)" />
            {/* Radiating corner lines */}
            <line x1="38" y1="28" x2="44" y2="34" />
            <line x1="62" y1="28" x2="56" y2="34" />
            <line x1="38" y1="52" x2="44" y2="46" />
            <line x1="62" y1="52" x2="56" y2="46" />
            {/* Star facet splits */}
            <polygon points="50,28 44,34 50,34" fill="url(#diamond-fire-grad)" />
            <polygon points="50,28 56,34 50,34" fill="url(#diamond-fire-accent)" />
            <polygon points="50,52 44,46 50,46" fill="url(#diamond-fire-accent)" />
            <polygon points="50,52 56,46 50,46" fill="url(#diamond-fire-grad)" />
            <polygon points="38,40 44,34 44,40" fill="url(#diamond-fire-accent)" />
            <polygon points="38,40 44,46 44,40" fill="url(#diamond-fire-grad)" />
            <polygon points="62,40 56,34 56,40" fill="url(#diamond-fire-grad)" />
            <polygon points="62,40 56,46 56,40" fill="url(#diamond-fire-accent)" />
            {/* Cross interior facets */}
            <line x1="44" y1="40" x2="56" y2="40" />
            <line x1="50" y1="34" x2="50" y2="46" />
          </g>
        );
      case 'Pear': // Teardrop
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary */}
            <path d="M 50,23 C 60,35 63,48 50,54 C 37,48 40,35 50,23 Z" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Inner Table */}
            <path d="M 50,29 C 55,37 57,45 50,49 C 43,45 45,37 50,29 Z" fill="rgba(255, 255, 255, 0.7)" />
            {/* Radiating Facet Lines */}
            <line x1="50" y1="23" x2="50" y2="29" />
            <line x1="50" y1="54" x2="50" y2="49" />
            <line x1="39" y1="44" x2="44.5" y2="43" />
            <line x1="61" y1="44" x2="55.5" y2="43" />
            <line x1="42" y1="34" x2="46.5" y2="35" />
            <line x1="58" y1="34" x2="53.5" y2="35" />
            {/* Corner fills */}
            <polygon points="50,23 42,34 46.5,35 50,29" fill="url(#diamond-fire-grad)" />
            <polygon points="50,23 58,34 53.5,35 50,29" fill="url(#diamond-fire-accent)" />
            <polygon points="50,54 39,44 44.5,43 50,49" fill="url(#diamond-fire-accent)" />
            <polygon points="50,54 61,44 55.5,43 50,49" fill="url(#diamond-fire-grad)" />
            {/* Center starburst */}
            <line x1="50" y1="37" x2="44.5" y2="43" />
            <line x1="50" y1="37" x2="55.5" y2="43" />
          </g>
        );
      case 'Marquise': // Eye shape
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary */}
            <path d="M 50,22 C 61,31 61,49 50,58 C 39,49 39,31 50,22 Z" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 50,29 C 56,35 56,45 50,51 C 44,45 44,35 50,29 Z" fill="rgba(255, 255, 255, 0.7)" />
            {/* Facet Lines */}
            <line x1="50" y1="22" x2="50" y2="29" />
            <line x1="50" y1="58" x2="50" y2="51" />
            <line x1="40" y1="34" x2="45.5" y2="35.5" fill="url(#diamond-fire-grad)" />
            <line x1="60" y1="34" x2="54.5" y2="35.5" fill="url(#diamond-fire-accent)" />
            <line x1="40" y1="46" x2="45.5" y2="44.5" fill="url(#diamond-fire-accent)" />
            <line x1="60" y1="46" x2="54.5" y2="44.5" fill="url(#diamond-fire-grad)" />
            {/* Connectors */}
            <line x1="45.5" y1="35.5" x2="50" y2="40" />
            <line x1="54.5" y1="35.5" x2="50" y2="40" />
            <line x1="45.5" y1="44.5" x2="50" y2="40" />
            <line x1="54.5" y1="44.5" x2="50" y2="40" />
          </g>
        );
      case 'Heart':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Heart boundary */}
            <path d="M 50,28 C 50,28 53,22 58,22 C 63,22 64,29 60,35 C 56,42 50,52 50,53 C 50,52 44,42 40,35 C 36,29 37,22 42,22 C 47,22 50,28 50,28 Z" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table Facet (nested heart) */}
            <path d="M 50,32 C 50,32 51.5,27 55,27 C 58.5,27 59,32 56.5,36 C 54,41 50,47 50,47 C 50,47 46,41 43.5,36 C 41,32 41.5,27 45,27 C 48.5,27 50,32 50,32 Z" fill="rgba(255, 255, 255, 0.7)" />
            {/* Radiating lines */}
            <line x1="50" y1="32" x2="50" y2="47" />
            <line x1="58" y1="22" x2="55" y2="27" />
            <line x1="42" y1="22" x2="45" y2="27" />
            <line x1="60" y1="35" x2="56.5" y2="36" />
            <line x1="40" y1="35" x2="43.5" y2="36" />
            <line x1="50" y1="53" x2="50" y2="47" />
            {/* Extra facet partitions */}
            <line x1="45" y1="27" x2="50" y2="32" />
            <line x1="55" y1="27" x2="50" y2="32" />
            <line x1="43.5" y1="36" x2="50" y2="40" />
            <line x1="56.5" y1="36" x2="50" y2="40" />
          </g>
        );
      case 'Radiant': // Cut-corner rectangle
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer cut-corner rectangle */}
            <path d="M 41,27 L 59,27 L 62,30 L 62,50 L 59,53 L 41,53 L 38,50 L 38,30 Z" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 45,33 L 55,33 L 57,35 L 57,45 L 55,47 L 45,47 L 43,45 L 43,35 Z" fill="rgba(255, 255, 255, 0.7)" />
            {/* Radiating cut-corner lines */}
            <line x1="41" y1="27" x2="45" y2="33" />
            <line x1="59" y1="27" x2="55" y2="33" />
            <line x1="62" y1="30" x2="57" y2="35" />
            <line x1="62" y1="50" x2="57" y2="45" />
            <line x1="59" y1="53" x2="55" y2="47" />
            <line x1="41" y1="53" x2="45" y2="47" />
            <line x1="38" y1="50" x2="43" y2="45" />
            <line x1="38" y1="30" x2="43" y2="35" />
            {/* Star bursts in table */}
            <line x1="50" y1="33" x2="50" y2="47" />
            <line x1="43" y1="40" x2="57" y2="40" />
          </g>
        );
      case 'Round': // Brilliant-cut circle
      default:
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary circle */}
            <circle cx="50" cy="40" r="12" fill="rgba(255, 255, 255, 0.15)" stroke="#b2c8d8" strokeWidth="0.8" />
            
            {/* Table facet (center octagon) */}
            <polygon points="50,34.5 54,36 55.5,40 54,44 50,45.5 46,44 44.5,40 46,36" fill="rgba(255, 255, 255, 0.75)" />
            
            {/* Star facets (triangles pointing outwards from table) */}
            <polygon points="50,28 50,34.5 46,36" fill="url(#diamond-fire-grad)" />
            <polygon points="58,30 54,36 55.5,40" fill="url(#diamond-fire-accent)" />
            <polygon points="62,40 55.5,40 54,44" fill="url(#diamond-fire-grad)" />
            <polygon points="58,50 54,44 50,45.5" fill="url(#diamond-fire-accent)" />
            <polygon points="50,52 50,45.5 46,44" fill="url(#diamond-fire-grad)" />
            <polygon points="42,50 46,44 44.5,40" fill="url(#diamond-fire-accent)" />
            <polygon points="38,40 44.5,40 46,36" fill="url(#diamond-fire-grad)" />
            <polygon points="42,30 46,36 50,34.5" fill="url(#diamond-fire-accent)" />
            
            {/* Kite facets */}
            <polygon points="50,28 46,36 38,40 44.5,40" fill="url(#diamond-fire-accent)" />
            <polygon points="50,28 50,34.5 58,30 54,36" fill="url(#diamond-fire-grad)" />
            <polygon points="62,40 58,30 55.5,40 54,36" fill="url(#diamond-fire-accent)" />
            <polygon points="62,40 58,50 54,44 55.5,40" fill="url(#diamond-fire-grad)" />
            <polygon points="50,52 58,50 50,45.5 54,44" fill="url(#diamond-fire-accent)" />
            <polygon points="50,52 42,50 46,44 50,45.5" fill="url(#diamond-fire-grad)" />
            <polygon points="38,40 42,50 44.5,40 46,44" fill="url(#diamond-fire-accent)" />
            <polygon points="38,40 42,30 46,36 44.5,40" fill="url(#diamond-fire-grad)" />
          </g>
        );
    }
  };

  // Dynamic light sheen rotation offset
  const lightSheenOffset = (rotation - 50) * 1.5;

  return (
    <div 
      ref={visualizerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`relative w-full aspect-square max-w-[480px] bg-gradient-to-b from-[#faf9f6] to-[#f2efea] border border-gold/15 flex items-center justify-center overflow-hidden group shadow-inner rounded-xl touch-none select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      
      {/* Zoom and rotate overlay wrapper */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out select-none"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{ transform: `scale(${zoom})` }}
      >
        <div
          key={`${shape}-${setting}-${metal}`}
          className="w-full h-full flex items-center justify-center animate-visualizer-reveal relative pointer-events-none"
        >
          <svg 
            viewBox="0 0 100 100" 
            className="w-[85%] h-[85%] filter drop-shadow-2xl select-none pointer-events-none"
            onDragStart={(e) => e.preventDefault()}
          style={{
            transform: `rotate(${(rotation - 30) * 1.5}deg)`,
            transformOrigin: '50% 48%',
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          <defs>
            {/* White Gold / Platinum Metallic Gradient */}
            <linearGradient id="platinum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#acafb3" />
              <stop offset="20%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#dadcde" />
              <stop offset="60%" stopColor="#8c8f94" />
              <stop offset="85%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#5d6063" />
            </linearGradient>

            <linearGradient id="platinum-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#eef0f2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#acafb3" stopOpacity="0.1" />
            </linearGradient>

            {/* Yellow Gold Metallic Gradient */}
            <linearGradient id="yellow-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ab832c" />
              <stop offset="20%" stopColor="#fff7d9" />
              <stop offset="45%" stopColor="#e0b84f" />
              <stop offset="60%" stopColor="#a87f22" />
              <stop offset="85%" stopColor="#fff7d9" />
              <stop offset="100%" stopColor="#7a5b11" />
            </linearGradient>

            <linearGradient id="yellow-gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff7d9" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f3e2a9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c5a029" stopOpacity="0.1" />
            </linearGradient>

            {/* Rose Gold Metallic Gradient */}
            <linearGradient id="rose-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b56f54" />
              <stop offset="20%" stopColor="#ffebdf" />
              <stop offset="45%" stopColor="#d5947a" />
              <stop offset="60%" stopColor="#a35f45" />
              <stop offset="85%" stopColor="#ffebdf" />
              <stop offset="100%" stopColor="#733923" />
            </linearGradient>

            <linearGradient id="rose-gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebdf" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e3aba1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a25c4b" stopOpacity="0.1" />
            </linearGradient>

            {/* Dynamic Interactive Light Sheen Mask */}
            <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform={`rotate(30)`}>
              <stop offset="0%" stopColor="transparent" stopOpacity="0" />
              <stop offset={`${35 + lightSheenOffset}%`} stopColor="transparent" stopOpacity="0" />
              <stop offset={`${50 + lightSheenOffset}%`} stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset={`${65 + lightSheenOffset}%`} stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* Diamond Fire Scintillation Gradient */}
            <linearGradient 
              id="diamond-fire-grad" 
              x1="0%" 
              y1="0%" 
              x2="100%" 
              y2="100%"
              gradientTransform={`rotate(${(rotation - 50) * 3.6})`}
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
              <stop offset={`${20 + (rotation % 15)}%`} stopColor="rgba(224, 242, 254, 0.9)" />
              <stop offset={`${45 + ((rotation * 1.5) % 15)}%`} stopColor="rgba(251, 207, 232, 0.9)" />
              <stop offset={`${70 + ((rotation * 2) % 15)}%`} stopColor="rgba(254, 240, 138, 0.85)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
            </linearGradient>

            <linearGradient 
              id="diamond-fire-accent" 
              x1="100%" 
              y1="0%" 
              x2="0%" 
              y2="100%"
              gradientTransform={`rotate(${-(rotation - 50) * 2.5})`}
            >
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
              <stop offset={`${30 + (rotation % 20)}%`} stopColor="rgba(217, 249, 157, 0.85)" />
              <stop offset={`${60 + ((rotation * 1.3) % 20)}%`} stopColor="rgba(221, 214, 254, 0.85)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.95)" />
            </linearGradient>
          </defs>

          {/* LAYER 0: SHADOW UNDER BAND */}
          <path
            d="M 20,62 C 20,79 80,79 80,62 C 80,47 20,47 20,62 Z"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="6.5"
            strokeLinecap="round"
            filter="blur(1px)"
          />

          {/* LAYER 1: BASE METAL BAND */}
          <path
            d="M 20,62 C 20,78 80,78 80,62 C 80,48 20,48 20,62 Z"
            fill="none"
            stroke={colors.band}
            strokeWidth="4.8"
            strokeLinecap="round"
          />

          {/* LAYER 1.5: 3D BAND REFLECTION HIGHLIGHT */}
          <path
            d="M 21.5,61 C 21.5,75.5 78.5,75.5 78.5,61"
            fill="none"
            stroke={colors.bandHighlight}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* LAYER 2: PAVÉ BAND ACCENTS */}
          {(setting === 'Pavé' || setting === 'Vintage') && (
            <>
              {/* Left shoulder small diamonds */}
              <circle cx="28" cy="55" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
              <circle cx="33" cy="52" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
              <circle cx="39" cy="50" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
              
              {/* Right shoulder small diamonds */}
              <circle cx="72" cy="55" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
              <circle cx="67" cy="52" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
              <circle cx="61" cy="50" r="0.9" fill="#ffffff" stroke="#90a4ae" strokeWidth="0.25" />
            </>
          )}

          {/* LAYER 3: CATHEDRAL HIGH ARCH SHIELD */}
          {setting === 'Cathedral' && (
            <g>
              <path
                d="M 32,53 L 48,39 L 50,40 L 52,39 L 68,53"
                fill="none"
                stroke={colors.band}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 33.5,51.5 L 48,39.5 L 50,40 L 52,39.5 L 66.5,51.5"
                fill="none"
                stroke={colors.bandHighlight}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          )}

          {/* LAYER 4: SETTING BASKET / STRUCTURE */}
          <g>
            {/* The base basket cup support */}
            <ellipse cx="50" cy="41.5" rx="8.5" ry="2.2" fill="none" stroke={colors.band} strokeWidth="2.0" />
            
            {/* Solitaire prongs holding the center stone */}
            <line x1="39.5" y1="30" x2="43" y2="43" stroke={colors.band} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="60.5" y1="30" x2="57" y2="43" stroke={colors.band} strokeWidth="1.8" strokeLinecap="round" />
            <line x1="50" y1="25.5" x2="50" y2="43" stroke={colors.band} strokeWidth="1.4" strokeLinecap="round" />

            {/* Specular highlight lines on prongs */}
            <line x1="40" y1="30.5" x2="43" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
            <line x1="60" y1="30.5" x2="57" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          </g>

          {/* LAYER 5: THREE-STONE ACCENT DIAMONDS */}
          {setting === 'Three Stone' && (
            <g stroke="#90a4ae" strokeWidth="0.45" fill="rgba(240, 248, 255, 0.95)" filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.15))">
              {/* Left side diamond */}
              <circle cx="34" cy="37" r="4.5" />
              <line x1="34" y1="32.5" x2="34" y2="41.5" />
              <line x1="29.5" y1="37" x2="38.5" y2="37" />
              <line x1="30.8" y1="33.8" x2="37.2" y2="40.2" />
              <line x1="37.2" y1="33.8" x2="30.8" y2="40.2" />
              
              {/* Right side diamond */}
              <circle cx="66" cy="37" r="4.5" />
              <line x1="66" y1="32.5" x2="66" y2="41.5" />
              <line x1="61.5" y1="37" x2="70.5" y2="37" />
              <line x1="62.8" y1="33.8" x2="69.2" y2="40.2" />
              <line x1="69.2" y1="33.8" x2="62.8" y2="40.2" />
              
              {/* Support brackets for side stones */}
              <path d="M 28,38 L 32,42 M 72,38 L 68,42" stroke={colors.band} strokeWidth="1.8" />
            </g>
          )}

          {/* LAYER 6: HALO ACCENTS SURROUNDING CENTER STONE */}
          {setting === 'Halo' && (
            <g stroke="rgba(255,255,255,0.95)" strokeWidth="0.25" fill="#ffffff" filter="drop-shadow(0px 1.5px 3px rgba(0,0,0,0.2))">
              {/* Halo circle ring */}
              <ellipse cx="50" cy="40" rx="15" ry="17.5" fill="none" stroke={colors.band} strokeWidth="2.0" />
              
              {/* 12 small diamonds in circle */}
              <circle cx="50" cy="21.5" r="1.4" />
              <circle cx="59.5" cy="24.5" r="1.4" />
              <circle cx="65.5" cy="32.5" r="1.4" />
              <circle cx="65.5" cy="47.5" r="1.4" />
              <circle cx="59.5" cy="55.5" r="1.4" />
              <circle cx="50" cy="58.5" r="1.4" />
              <circle cx="40.5" cy="55.5" r="1.4" />
              <circle cx="34.5" cy="47.5" r="1.4" />
              <circle cx="34.5" cy="32.5" r="1.4" />
              <circle cx="40.5" cy="24.5" r="1.4" />
            </g>
          )}

          {/* LAYER 7: DIAMOND STONE SHAPE AND FACETS */}
          <g filter="drop-shadow(0px 2.5px 5px rgba(0,0,0,0.22))" className="transition-all duration-300">
            {renderDiamondFacets()}
          </g>

          {/* LAYER 8: LIGHT SHEEN MASK EFFECT */}
          <rect x="0" y="0" width="100" height="100" fill="url(#sheen-grad)" style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} />
        </svg>

        {/* Micro-sparkle stars that twinkle dynamically */}
        {SPARKLES_COORDS.map((sp, idx) => (
          <div
            key={idx}
            className="absolute animate-sparkle pointer-events-none text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              animationDelay: `${sp.delay}s`,
            }}
          >
            <Sparkles className="text-white fill-white" style={{ width: `${sp.size || 6}px`, height: `${sp.size || 6}px` }} />
          </div>
        ))}
        </div>
      </div>

      {/* Floating Control Box */}
      {zoomable && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel border border-gold-300/35 rounded-full px-5 py-2 flex items-center gap-4 shadow-xl opacity-95 hover:opacity-100 transition-opacity">
          <button onClick={handleZoomOut} className="text-neutral-700 hover:text-gold-600 transition-colors p-1" title="Zoom Out">
            <ZoomOut className="h-4.5 w-4.5" />
          </button>
          <span className="text-[10px] uppercase font-sans tracking-widest font-extrabold text-neutral-800">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={handleZoomIn} className="text-neutral-700 hover:text-gold-600 transition-colors p-1" title="Zoom In">
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
          <div className="w-[1px] h-4 bg-gold-300/35" />
          <button onClick={handleReset} className="text-neutral-700 hover:text-gold-600 transition-colors p-1" title="Reset View">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 360 Degree View Slider */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-2 glass-panel border border-gold-300/35 p-2.5 rounded-xl">
        <label className="text-[8px] uppercase tracking-[0.2em] text-neutral-600 font-sans font-black">Refraction</label>
        <input
          type="range"
          min="0"
          max="100"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="h-1 w-20 luxury-slider cursor-ew-resize appearance-none"
        />
      </div>
      
      {/* Diamond shimmer label */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-gold-50/80 border border-gold-300/35 px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
        <span className="text-[8px] font-sans font-black tracking-widest text-gold-600 uppercase">Live 3D render</span>
      </div>

      {/* Drag instruction overlay */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#121212]/85 backdrop-blur-xs text-[#e7d3a2] text-[8px] uppercase tracking-widest px-4 py-2 rounded-full pointer-events-none font-sans font-black flex items-center gap-2 shadow-lg border border-gold-400/20 select-none animate-pulse">
        <span>← Swipe / Drag to Rotate →</span>
      </div>
    </div>
  );
}
