'use client';

import React from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export default function SafeImage({ src, alt, fallback = '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg', className }: SafeImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
      className={className}
    />
  );
}
