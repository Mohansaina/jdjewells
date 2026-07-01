'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, Award, X, Hammer, HelpCircle, RefreshCcw, Check } from 'lucide-react';

export default function TrustBadges() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const badges = [
    {
      id: 'handcrafted',
      icon: Sparkles,
      title: 'Handcrafted Designs',
      desc: 'Cast and hand-set in-house.',
      modalTitle: 'In-House Handcrafted Artistry',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <p>
            At J&D Jewellers, we do not believe in mass production. Every mounting, pendant, and band is individually crafted using state-of-the-art wax prints, solid gold/platinum casting, and hand-finished polishing.
          </p>
          <div className="bg-[#faf8f5] border border-gold/15 p-4 space-y-2 rounded-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 block">Our Bench Standards</span>
            <ul className="list-disc pl-4 space-y-1.5 font-light">
              <li>Meticulous hand-setting of diamonds under microscope alignment.</li>
              <li>18k Hallmarked alloy purity verification.</li>
              <li>Individual ultrasonic and steam inspection before packaging.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'expert',
      icon: Compass,
      title: 'Expert Guidance',
      desc: 'Direct advice from GIA dealers.',
      modalTitle: 'GIA Gemologist Consultations',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <p>
            Selecting a diamond is a highly personal decision. Our team includes fully qualified GIA certified gemologists who can guide you through the details of diamond cuts, colors, and certification registries.
          </p>
          <div className="bg-gold-50/30 border border-gold-300 p-4 rounded-lg flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-gold-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-neutral-800">Ready to Book?</p>
              <p className="text-[11px] font-light mt-0.5">Clicking below will launch our appointment scheduler for a virtual zoom or London showroom session.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'returns',
      icon: ShieldCheck,
      title: '30 Day Returns',
      desc: 'Stress-free exchanges & sizing.',
      modalTitle: '30-Day Returns & Resizing Warranty',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <p>
            We stand behind our craftsmanship. If your custom creation does not meet your expectations, return it within 30 days for a full refund or exchange.
          </p>
          <div className="bg-[#faf8f5] border border-gold/15 p-4 space-y-2 rounded-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 block">Returns & Sizing Details</span>
            <ul className="list-disc pl-4 space-y-1.5 font-light">
              <li><strong>Complimentary Return Shipping:</strong> We provide fully insured prepaid shipping labels.</li>
              <li><strong>Free 60-Day Resizing:</strong> If the ring size is slightly off, we offer free resizing and support.</li>
              <li><strong>Ring Sizer Kit:</strong> Every customized purchase qualifies for a free physical sizer tool shipment.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'sourcing',
      icon: Award,
      title: 'Sourcing With Care',
      desc: 'Ethically mined & recycled alloys.',
      modalTitle: 'Ethical & Conflict-Free Sourcing',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <p>
            All diamonds supplied by J&D Jewellers comply strictly with the international Kimberley Process, ensuring conflict-free origin.
          </p>
          <div className="bg-[#faf8f5] border border-gold/15 p-4 space-y-2 rounded-lg">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 block">Sourcing Pledges</span>
            <ul className="list-disc pl-4 space-y-1.5 font-light">
              <li><strong>Recycled Metals:</strong> 100% of our cast alloys are refined from recycled gold and platinum vaults to protect the environment.</li>
              <li><strong>Certified Loose Diamonds:</strong> All loose gems carry individual GIA registry reports verifying origin.</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleBadgeClick = (id: string) => {
    if (id === 'expert') {
      // Dispatch custom event to trigger booking modal in Header.tsx
      window.dispatchEvent(new Event('open-booking-modal'));
    } else {
      setActiveModal(id);
    }
  };

  const activeBadge = badges.find(b => b.id === activeModal);

  return (
    <>
      {/* Dynamic Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white border border-gold/15 p-6 rounded-xl shadow-xs text-center font-sans">
        {badges.map((b, idx) => {
          const IconComponent = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => handleBadgeClick(b.id)}
              className={`space-y-2 flex flex-col items-center group cursor-pointer transition-all hover:scale-102 focus:outline-none ${
                idx > 0 ? 'border-t pt-4 sm:pt-0 sm:border-t-0 sm:border-l border-neutral-100/80' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center text-gold-600 bg-gold-50/30 group-hover:bg-gold-50 group-hover:border-gold-500 transition-all duration-300">
                <IconComponent className="h-4.5 w-4.5 stroke-[1.5] group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-800 font-bold group-hover:text-gold-600 transition-colors">
                {b.title}
              </h4>
              <p className="text-[9px] text-neutral-400 font-light max-w-[180px] group-hover:text-neutral-500">
                {b.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Info Modals */}
      {activeModal && activeBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#fcfbf9] border border-gold/25 p-6 shadow-2xl space-y-5 rounded-xl border-t-4 border-t-gold-500">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-serif text-sm tracking-wider uppercase text-neutral-900 font-bold">
                {activeBadge.modalTitle}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            {activeBadge.modalContent}

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-[10px] uppercase font-bold tracking-wider gold-gradient text-white"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
