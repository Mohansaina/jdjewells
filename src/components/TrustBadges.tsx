'use client';

import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';

export default function TrustBadges() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const badges = [
    {
      id: 'handcrafted',
      iconUrl: '/assets/images/trust_handcrafted.png',
      title: 'Handcrafted Designs',
      desc: 'Design your jewellery in 2 simple steps and our experts will custom-craft it for you.',
      modalTitle: 'In-House Handcrafted Artistry',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-sans">
          <p>
            At J&D Jewellers, we do not believe in mass production. Every mounting, pendant, and band is individually crafted using state-of-the-art wax prints, solid gold/platinum casting, and hand-finished polishing.
          </p>
          <div className="bg-[#faf8f5] border border-gold-300/20 p-4 space-y-2 rounded-lg">
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
      iconUrl: '/assets/images/trust_expert.png',
      title: 'Expert Guidance',
      desc: 'Call or book an appointment in our office.',
      modalTitle: 'GIA Gemologist Consultations',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-sans">
          <p>
            Selecting a diamond is a highly personal decision. Our team includes fully qualified GIA certified gemologists who can guide you through the details of diamond cuts, colors, and certification registries.
          </p>
          <div className="bg-gold-50/30 border border-gold-300/20 p-4 rounded-lg flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-gold-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-neutral-850">Ready to Book?</p>
              <p className="text-[11px] font-light mt-0.5">Clicking below will launch our appointment scheduler for a virtual zoom or London showroom session.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'returns',
      iconUrl: '/assets/images/trust_returns.png',
      title: '30 Day Returns',
      desc: 'Return your item in under 30 days, or request a resize for the perfect fit.',
      modalTitle: '30-Day Returns & Resizing Warranty',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed font-sans">
          <p>
            We stand behind our craftsmanship. If your custom creation does not meet your expectations, return it within 30 days for a full refund or exchange.
          </p>
          <div className="bg-[#faf8f5] border border-gold-300/20 p-4 space-y-2 rounded-lg">
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
      iconUrl: '/assets/images/trust_sourcing.png',
      title: 'Sourcing With Care',
      desc: 'Explore our collection of independently certified and conflict-free diamonds.',
      modalTitle: 'Ethical & Conflict-Free Sourcing',
      modalContent: (
        <div className="space-y-4 text-xs text-neutral-650 leading-relaxed font-sans">
          <p>
            All diamonds supplied by J&D Jewellers comply strictly with the international Kimberley Process, ensuring conflict-free origin.
          </p>
          <div className="bg-[#faf8f5] border border-gold-300/20 p-4 space-y-2 rounded-lg">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 py-16 px-4 bg-transparent text-center font-sans">
        {badges.map((b) => {
          return (
            <button
              key={b.id}
              onClick={() => handleBadgeClick(b.id)}
              className="space-y-4 flex flex-col items-center group cursor-pointer transition-all hover:-translate-y-1 focus:outline-none py-6 px-4 rounded-2xl hover:bg-white hover:shadow-[0_20px_40px_rgba(231,211,162,0.08)] border border-transparent hover:border-gold-300/15 duration-500"
            >
              {/* Custom Circular PNG Icon wrapper */}
              <div className="w-18 h-18 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-md">
                <img 
                  src={b.iconUrl} 
                  alt={b.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Description with Luxury Typography */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-[13px] uppercase tracking-[0.2em] text-neutral-800 font-bold group-hover:text-gold-600 transition-colors duration-300">
                  {b.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-450 leading-relaxed font-light font-sans max-w-[245px] mx-auto group-hover:text-neutral-600 transition-colors duration-300">
                  {b.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Modals */}
      {activeModal && activeBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#faf9f6] border border-gold-300/30 p-8 shadow-2xl space-y-6 rounded-2xl border-t-4 border-t-gold-500 overflow-hidden">
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
                className="px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all duration-300"
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
