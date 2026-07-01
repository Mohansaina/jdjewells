'use client';

import React from 'react';
import { DiamondShape } from '@/context/ConfiguratorContext';

interface DiamondShapeSvgProps {
  shape: string;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string;
}

export default function DiamondShapeSvg({
  shape,
  className = 'w-full h-full',
  strokeColor = 'rgba(14, 165, 233, 0.45)', // Sky blue highlight stroke
  strokeWidth = '0.5'
}: DiamondShapeSvgProps) {
  
  const renderFacets = (normalizedShape: string) => {
    switch (normalizedShape) {
      case 'princess':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer perimeter */}
            <rect x="38" y="28" width="24" height="24" rx="0.5" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table Facet */}
            <rect x="44" y="34" width="12" height="12" rx="0.3" fill="rgba(255, 255, 255, 0.65)" />
            {/* Corner Facets */}
            <polygon points="38,28 44,34 50,34 50,28" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="62,28 56,34 50,34 50,28" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="62,52 56,46 50,46 50,52" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="38,52 44,46 50,46 50,52" fill="rgba(224, 242, 254, 0.3)" />
            {/* Side Facets */}
            <polygon points="38,28 38,40 44,40 44,34" fill="rgba(240, 249, 255, 0.2)" />
            <polygon points="38,52 38,40 44,40 44,46" fill="rgba(255, 255, 255, 0.35)" />
            <polygon points="62,28 62,40 56,40 56,34" fill="rgba(240, 249, 255, 0.25)" />
            <polygon points="62,52 62,40 56,40 56,46" fill="rgba(255, 255, 255, 0.4)" />
            {/* Cross Brilliance cuts */}
            <line x1="44" y1="34" x2="56" y2="46" />
            <line x1="56" y1="34" x2="44" y2="46" />
            <line x1="50" y1="34" x2="50" y2="46" />
            <line x1="44" y1="40" x2="56" y2="40" />
          </g>
        );
      case 'emerald':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer step 1 */}
            <rect x="38" y="27" width="24" height="26" rx="1" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Step 2 */}
            <rect x="41" y="30" width="18" height="20" rx="0.5" fill="rgba(255, 255, 255, 0.3)" />
            {/* Step 3 */}
            <rect x="44" y="33" width="12" height="14" rx="0.3" fill="rgba(240, 249, 255, 0.25)" />
            {/* Table Facet */}
            <rect x="47" y="36" width="6" height="8" fill="rgba(255, 255, 255, 0.7)" />
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
      case 'oval':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Oval shape */}
            <ellipse cx="50" cy="40" rx="12" ry="15" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table facet */}
            <ellipse cx="50" cy="40" rx="6.5" ry="8.5" fill="rgba(255, 255, 255, 0.65)" />
            {/* Star and Pavilion Facet Lines */}
            <path d="M 50,25 Q 42,32 43.5,40" fill="rgba(255,255,255,0.2)" />
            <path d="M 50,25 Q 58,32 56.5,40" fill="rgba(224,242,254,0.2)" />
            <path d="M 50,55 Q 42,48 43.5,40" fill="rgba(255,255,255,0.25)" />
            <path d="M 50,55 Q 58,48 56.5,40" fill="rgba(224,242,254,0.25)" />
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
      case 'cushion':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Cushion square */}
            <rect x="38" y="28" width="24" height="24" rx="7.5" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table facet */}
            <rect x="44" y="34" width="12" height="12" rx="3" fill="rgba(255, 255, 255, 0.65)" />
            {/* Radiating corner lines */}
            <line x1="38" y1="28" x2="44" y2="34" />
            <line x1="62" y1="28" x2="56" y2="34" />
            <line x1="38" y1="52" x2="44" y2="46" />
            <line x1="62" y1="52" x2="56" y2="46" />
            {/* Star facet splits */}
            <polygon points="50,28 44,34 50,34" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="50,28 56,34 50,34" fill="rgba(224, 242, 254, 0.25)" />
            <polygon points="50,52 44,46 50,46" fill="rgba(255, 255, 255, 0.3)" />
            <polygon points="50,52 56,46 50,46" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="38,40 44,34 44,40" fill="rgba(240, 249, 255, 0.2)" />
            <polygon points="38,40 44,46 44,40" fill="rgba(255, 255, 255, 0.35)" />
            <polygon points="62,40 56,34 56,40" fill="rgba(240, 249, 255, 0.2)" />
            <polygon points="62,40 56,46 56,40" fill="rgba(255, 255, 255, 0.35)" />
            <line x1="44" y1="40" x2="56" y2="40" />
            <line x1="50" y1="34" x2="50" y2="46" />
          </g>
        );
      case 'pear':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary */}
            <path d="M 50,23 C 60,35 63,48 50,54 C 37,48 40,35 50,23 Z" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Inner Table */}
            <path d="M 50,29 C 55,37 57,45 50,49 C 43,45 45,37 50,29 Z" fill="rgba(255, 255, 255, 0.65)" />
            {/* Radiating Facet Lines */}
            <line x1="50" y1="23" x2="50" y2="29" />
            <line x1="50" y1="54" x2="50" y2="49" />
            <line x1="39" y1="44" x2="44.5" y2="43" />
            <line x1="61" y1="44" x2="55.5" y2="43" />
            <line x1="42" y1="34" x2="46.5" y2="35" />
            <line x1="58" y1="34" x2="53.5" y2="35" />
            {/* Corner fills */}
            <polygon points="50,23 42,34 46.5,35 50,29" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="50,23 58,34 53.5,35 50,29" fill="rgba(224, 242, 254, 0.25)" />
            <polygon points="50,54 39,44 44.5,43 50,49" fill="rgba(255, 255, 255, 0.3)" />
            <polygon points="50,54 61,44 55.5,43 50,49" fill="rgba(224, 242, 254, 0.3)" />
            <line x1="50" y1="37" x2="44.5" y2="43" />
            <line x1="50" y1="37" x2="55.5" y2="43" />
          </g>
        );
      case 'marquise':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary */}
            <path d="M 50,22 C 61,31 61,49 50,58 C 39,49 39,31 50,22 Z" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 50,29 C 56,35 56,45 50,51 C 44,45 44,35 50,29 Z" fill="rgba(255, 255, 255, 0.65)" />
            {/* Facet Lines */}
            <line x1="50" y1="22" x2="50" y2="29" />
            <line x1="50" y1="58" x2="50" y2="51" />
            <line x1="40" y1="34" x2="45.5" y2="35.5" />
            <line x1="60" y1="34" x2="54.5" y2="35.5" />
            <line x1="40" y1="46" x2="45.5" y2="44.5" />
            <line x1="60" y1="46" x2="54.5" y2="44.5" />
            <line x1="45.5" y1="35.5" x2="50" y2="40" />
            <line x1="54.5" y1="35.5" x2="50" y2="40" />
            <line x1="45.5" y1="44.5" x2="50" y2="40" />
            <line x1="54.5" y1="44.5" x2="50" y2="40" />
          </g>
        );
      case 'heart':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Heart boundary */}
            <path d="M 50,28 C 50,28 53,22 58,22 C 63,22 64,29 60,35 C 56,42 50,52 50,53 C 50,52 44,42 40,35 C 36,29 37,22 42,22 C 47,22 50,28 50,28 Z" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 50,32 C 50,32 51.5,27 55,27 C 58.5,27 59,32 56.5,36 C 54,41 50,47 50,47 C 50,47 46,41 43.5,36 C 41,32 41.5,27 45,27 C 48.5,27 50,32 50,32 Z" fill="rgba(255, 255, 255, 0.6)" />
            {/* Radiating lines */}
            <line x1="50" y1="32" x2="50" y2="47" />
            <line x1="58" y1="22" x2="55" y2="27" />
            <line x1="42" y1="22" x2="45" y2="27" />
            <line x1="60" y1="35" x2="56.5" y2="36" />
            <line x1="40" y1="35" x2="43.5" y2="36" />
            <line x1="50" y1="53" x2="50" y2="47" />
            <line x1="45" y1="27" x2="50" y2="32" />
            <line x1="55" y1="27" x2="50" y2="32" />
            <line x1="43.5" y1="36" x2="50" y2="40" />
            <line x1="56.5" y1="36" x2="50" y2="40" />
          </g>
        );
      case 'radiant':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer cut-corner rectangle */}
            <path d="M 41,27 L 59,27 L 62,30 L 62,50 L 59,53 L 41,53 L 38,50 L 38,30 Z" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 45,33 L 55,33 L 57,35 L 57,45 L 55,47 L 45,47 L 43,45 L 43,35 Z" fill="rgba(255, 255, 255, 0.65)" />
            {/* Radiating cut-corner lines */}
            <line x1="41" y1="27" x2="45" y2="33" />
            <line x1="59" y1="27" x2="55" y2="33" />
            <line x1="62" y1="30" x2="57" y2="35" />
            <line x1="62" y1="50" x2="57" y2="45" />
            <line x1="59" y1="53" x2="55" y2="47" />
            <line x1="41" y1="53" x2="45" y2="47" />
            <line x1="38" y1="50" x2="43" y2="45" />
            <line x1="38" y1="30" x2="43" y2="35" />
            <line x1="50" y1="33" x2="50" y2="47" />
            <line x1="43" y1="40" x2="57" y2="40" />
          </g>
        );
      case 'asscher':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer perimeter with cut corners */}
            <path d="M 41,27 L 59,27 L 62,30 L 62,50 L 59,53 L 41,53 L 38,50 L 38,30 Z" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Inner Step 1 */}
            <path d="M 44,30 L 56,30 L 59,33 L 59,47 L 56,50 L 44,50 L 41,47 L 41,33 Z" fill="rgba(255, 255, 255, 0.3)" />
            {/* Table Facet */}
            <rect x="46" y="35" width="8" height="10" fill="rgba(255, 255, 255, 0.7)" />
            {/* Corner diagonal cuts */}
            <line x1="38" y1="30" x2="46" y2="35" />
            <line x1="62" y1="30" x2="54" y2="35" />
            <line x1="38" y1="50" x2="46" y2="45" />
            <line x1="62" y1="50" x2="54" y2="45" />
            {/* Side perpendicular lines */}
            <line x1="50" y1="27" x2="50" y2="35" />
            <line x1="50" y1="53" x2="50" y2="45" />
            <line x1="38" y1="40" x2="46" y2="40" />
            <line x1="62" y1="40" x2="54" y2="40" />
          </g>
        );
      case 'old cuts':
      case 'old cut':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Rounded-cushion outer boundary */}
            <rect x="38" y="28" width="24" height="24" rx="6" fill="rgba(240, 248, 255, 0.3)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Large central culet */}
            <circle cx="50" cy="40" r="2" fill="rgba(255, 255, 255, 0.7)" />
            {/* Radiating facet divisions */}
            <line x1="38" y1="28" x2="48.5" y2="38.5" />
            <line x1="62" y1="28" x2="51.5" y2="38.5" />
            <line x1="38" y1="52" x2="48.5" y2="41.5" />
            <line x1="62" y1="52" x2="51.5" y2="41.5" />
            <line x1="50" y1="28" x2="50" y2="38" />
            <line x1="50" y1="52" x2="50" y2="42" />
            <line x1="38" y1="40" x2="48" y2="40" />
            <line x1="62" y1="40" x2="52" y2="40" />
            {/* Triangular pavilion facet divisions */}
            <polygon points="50,28 44,34 50,38" fill="rgba(255, 255, 255, 0.2)" />
            <polygon points="50,28 56,34 50,38" fill="rgba(224, 242, 254, 0.2)" />
            <polygon points="50,52 44,46 50,42" fill="rgba(255, 255, 255, 0.2)" />
            <polygon points="50,52 56,46 50,42" fill="rgba(224, 242, 254, 0.2)" />
          </g>
        );
      case 'kite & shields':
      case 'kite':
      case 'shield':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer Kite perimeter */}
            <path d="M 50,22 L 62,32 L 50,52 L 38,32 Z" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table Facet */}
            <path d="M 50,28 L 56,33 L 50,44 L 44,33 Z" fill="rgba(255, 255, 255, 0.65)" />
            {/* Connecting lines */}
            <line x1="50" y1="22" x2="50" y2="28" />
            <line x1="62" y1="32" x2="56" y2="33" />
            <line x1="50" y1="52" x2="50" y2="44" />
            <line x1="38" y1="32" x2="44" y2="33" />
          </g>
        );
      case 'triangulars':
      case 'triangular':
      case 'trilliant':
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Curved triangular outer boundary */}
            <path d="M 50,22 C 57,28 61,39 63,48 C 55,49 45,49 37,48 C 39,39 43,28 50,22 Z" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table facet */}
            <polygon points="50,32 56,43 44,43" fill="rgba(255, 255, 255, 0.65)" />
            {/* Connecting lines */}
            <line x1="50" y1="22" x2="50" y2="32" />
            <line x1="63" y1="48" x2="56" y2="43" />
            <line x1="37" y1="48" x2="44" y2="43" />
            <line x1="50" y1="32" x2="56" y2="43" />
            <line x1="50" y1="32" x2="44" y2="43" />
            <line x1="56" y1="43" x2="44" y2="43" />
          </g>
        );
      case 'round':
      default:
        return (
          <g stroke={strokeColor} strokeWidth={strokeWidth}>
            {/* Outer boundary circle */}
            <circle cx="50" cy="40" r="12" fill="rgba(240, 248, 255, 0.25)" stroke={strokeColor} strokeWidth="0.8" />
            {/* Table facet */}
            <polygon points="50,34.5 54,36 55.5,40 54,44 50,45.5 46,44 44.5,40 46,36" fill="rgba(255, 255, 255, 0.65)" />
            {/* Star facets */}
            <polygon points="50,28 50,34.5 46,36" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="58,30 54,36 55.5,40" fill="rgba(255, 255, 255, 0.3)" />
            <polygon points="62,40 55.5,40 54,44" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="58,50 54,44 50,45.5" fill="rgba(255, 255, 255, 0.3)" />
            <polygon points="50,52 50,45.5 46,44" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="42,50 46,44 44.5,40" fill="rgba(255, 255, 255, 0.3)" />
            <polygon points="38,40 44.5,40 46,36" fill="rgba(255, 255, 255, 0.25)" />
            <polygon points="42,30 46,36 50,34.5" fill="rgba(255, 255, 255, 0.3)" />
            {/* Kite facets */}
            <polygon points="50,28 46,36 38,40 44.5,40" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="50,28 50,34.5 58,30 54,36" fill="rgba(224, 242, 254, 0.25)" />
            <polygon points="62,40 58,30 55.5,40 54,36" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="62,40 58,50 54,44 55.5,40" fill="rgba(224, 242, 254, 0.25)" />
            <polygon points="50,52 58,50 50,45.5 54,44" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="50,52 42,50 46,44 50,45.5" fill="rgba(224, 242, 254, 0.25)" />
            <polygon points="38,40 42,50 44.5,40 46,44" fill="rgba(224, 242, 254, 0.3)" />
            <polygon points="38,40 42,30 46,36 44.5,40" fill="rgba(224, 242, 254, 0.25)" />
          </g>
        );
    }
  };

  const normalizedShape = shape.trim().toLowerCase();

  return (
    <svg
      viewBox="32 18 36 42"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderFacets(normalizedShape)}
    </svg>
  );
}
