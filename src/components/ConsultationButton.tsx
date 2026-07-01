'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function ConsultationButton() {
  const handleClick = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  return (
    <button
      onClick={handleClick}
      className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:opacity-90 shadow-md transition-all flex items-center gap-1.5"
    >
      <Calendar className="h-4 w-4" /> Book Design Consultation
    </button>
  );
}
