'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Milestone, HelpCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, error, warning } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (response.status === 200) {
          warning(data.message || 'You are already subscribed!');
        } else {
          setSubscribed(true);
          success(data.message || 'Successfully subscribed!');
          setEmail('');
          setTimeout(() => setSubscribed(false), 5000);
        }
      } else {
        error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
      error('Failed to connect to the server.');
    }
  };

  const handleBookAppointment = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  return (
    <footer className="bg-[#0b0b0b] text-neutral-400 font-sans border-t border-gold-400/20 relative overflow-hidden">
      
      {/* 1. TOP WELCOME TIER: EDITORIAL INVITATION */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12 border-b border-neutral-900 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2 max-w-2xl text-left">
          <span className="text-[9px] tracking-[0.4em] text-gold-400 uppercase font-semibold block">Bespoke Excellence</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 tracking-wide leading-tight">
            &ldquo;Bespoke fine jewelry is not manufactured. <br />
            It is conceived, sculpted, and cast as a legacy.&rdquo;
          </h3>
          <p className="text-xs text-neutral-500 max-w-md font-light leading-relaxed">
            Collaborate directly with our master bench artisans in London or New York to render your custom creations in high-fidelity 3D CAD.
          </p>
        </div>
        <button
          onClick={handleBookAppointment}
          className="w-full sm:w-auto px-8 py-4 text-[10px] tracking-widest font-bold uppercase border border-gold-300/40 text-gold-300 hover:text-white hover:border-gold-300 bg-transparent hover:bg-gold-500/10 transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
        >
          Book a Private Salon Reading <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 2. THE THREE CORE PILLARS OF FAITH */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 border-b border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        <div className="flex gap-4 items-start">
          <ShieldCheck className="h-6 w-6 text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-xs text-neutral-200 uppercase tracking-widest">GIA Registry Integrity</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Every diamond over 0.5 carats is individually hand-verified by the Gemological Institute of America, complete with microscopic laser inscription mappings.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <Milestone className="h-6 w-6 text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-xs text-neutral-200 uppercase tracking-widest">Insured Overnight Logistics</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              All parcels are shipped via dedicated high-security carriers. Hand-to-hand delivery is fully insured, requiring direct adult signature verification.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <HelpCircle className="h-6 w-6 text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-xs text-neutral-200 uppercase tracking-widest">Private Atelier Virtual Zooms</h4>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Experience the workshop virtually. Select rough diamond cuts under microscope loops guided live by our Head of Stone Setting.
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION & INFO GRID */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-left">
        
        {/* Heritage & Identity */}
        <div className="space-y-5 lg:col-span-1">
          <h2 className="font-serif text-lg tracking-[0.2em] text-neutral-100 uppercase">
            JD <span className="text-gold-400 italic">JEWEL</span>
          </h2>
          <p className="text-[11px] leading-relaxed text-neutral-500 font-light">
            Established 1998 in the London diamond district. JD Jewel stands as an independent beacon of master craftsmanship. We specialize in custom VVS sets and premium hand-set mounts.
          </p>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-wider text-neutral-600 font-mono">
              GIA Diamond Registry #298471A
            </p>
            <p className="text-[9px] uppercase tracking-wider text-neutral-600 font-mono">
              RJC Registered Member #847291B
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center hover:border-gold-400 hover:text-white transition-colors duration-300">
              <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center hover:border-gold-400 hover:text-white transition-colors duration-300">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-5">
          <h4 className="font-serif text-[11px] tracking-[0.2em] text-neutral-100 uppercase">Collections</h4>
          <ul className="space-y-3 text-[11px] font-light">
            <li><Link href="/engagement-rings" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Engagement Rings</Link></li>
            <li><Link href="/products?category=wedding bands" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Wedding Bands</Link></li>
            <li><Link href="/products?category=pendants" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">VVS Diamond Pendants</Link></li>
            <li><Link href="/products?category=bracelets" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Tennis Bracelets</Link></li>
            <li><Link href="/products?category=custom" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Solid Gold Grillz</Link></li>
          </ul>
        </div>

        {/* The Atelier & Education */}
        <div className="space-y-5">
          <h4 className="font-serif text-[11px] tracking-[0.2em] text-neutral-100 uppercase">The Atelier</h4>
          <ul className="space-y-3 text-[11px] font-light">
            <li><Link href="/configurator" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Bespoke Ring Builder</Link></li>
            <li><Link href="/diamonds" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Loose Diamond Index</Link></li>
            <li><span className="text-neutral-500 cursor-not-allowed">Custom CAD Drafting</span></li>
            <li><span className="text-neutral-500 cursor-not-allowed">4Cs Interactive Education</span></li>
            <li><span className="text-neutral-500 cursor-not-allowed">Lifetime Bench Warranty</span></li>
          </ul>
        </div>

        {/* Client Care & Services */}
        <div className="space-y-5">
          <h4 className="font-serif text-[11px] tracking-[0.2em] text-neutral-100 uppercase">Client Services</h4>
          <ul className="space-y-3 text-[11px] font-light">
            <li><Link href="/profile" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Order Status & Tracking</Link></li>
            <li><Link href="/profile?tab=orders" className="hover:text-gold-300 transition-colors hover-border-draw py-0.5">Warranty Service Request</Link></li>
            <li><span className="text-neutral-500">Complimentary 60-Day Resizing</span></li>
            <li><span className="text-neutral-500">Secure Insured Returns</span></li>
            <li><span className="text-neutral-500">Professional Jewelry Cleaning</span></li>
          </ul>
        </div>

        {/* Boutiques & Showrooms */}
        <div className="space-y-5">
          <h4 className="font-serif text-[11px] tracking-[0.2em] text-neutral-100 uppercase">Private Salons</h4>
          <div className="space-y-4 text-[11px] font-light">
            <div>
              <p className="text-neutral-200 font-serif font-bold">London Showroom</p>
              <p className="text-neutral-500 text-[10px] mt-0.5">Suite 23, 2nd floor, 28 Greville St, London EC1N 8SU</p>
              <p className="text-gold-400/80 font-mono text-[9px] mt-0.5">
                <a href="tel:+447494554171" className="hover:text-gold-300 transition-colors">+44 7494 554171</a>
              </p>
              <p className="text-neutral-500 text-[10px] mt-0.5">
                <a href="mailto:contact.jdjewellers@gmail.com" className="hover:text-gold-300 transition-colors">contact.jdjewellers@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. THE VAULT SIGNUP & TRUST PROTOCOLS */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Newsletter Box */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:items-center gap-6 text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-sm text-neutral-100 uppercase tracking-widest">Join The Vault Letter</h4>
            <p className="text-[11px] text-neutral-500 font-light max-w-xs">
              Subscribe for private collection launches, priority diamond vault access, and invitations to showroom previews.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="relative flex items-center w-full sm:w-auto sm:min-w-[300px]">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#121212] border border-neutral-800 focus:border-gold-500/60 px-4 py-3 text-xs text-neutral-100 focus:outline-none transition-colors placeholder-neutral-600 rounded-sm pr-24"
            />
            <button
              type="submit"
              className="absolute right-1 px-4 py-2 text-[9px] uppercase font-bold tracking-widest gold-gradient text-white hover:gold-gradient-hover transition-all duration-300 rounded-sm flex items-center gap-1 cursor-pointer"
            >
              {subscribed ? <Check className="h-3 w-3" /> : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Brand Authenticity Seals */}
        <div className="flex flex-wrap gap-6 items-center justify-center select-none pointer-events-none opacity-45">
          <div className="border border-neutral-800 px-3 py-1.5 rounded-sm flex flex-col items-center">
            <span className="font-serif text-[10px] font-bold text-neutral-200 tracking-widest">GIA</span>
            <span className="text-[7px] uppercase font-mono tracking-widest text-neutral-500">Merchant</span>
          </div>
          <div className="border border-neutral-800 px-3 py-1.5 rounded-sm flex flex-col items-center">
            <span className="font-serif text-[10px] font-bold text-neutral-200 tracking-widest">RJC</span>
            <span className="text-[7px] uppercase font-mono tracking-widest text-neutral-500">Certified</span>
          </div>
          <div className="border border-neutral-800 px-3 py-1.5 rounded-sm flex flex-col items-center">
            <span className="font-serif text-[10px] font-bold text-neutral-200 tracking-widest">18K</span>
            <span className="text-[7px] uppercase font-mono tracking-widest text-neutral-500">Solid Gold</span>
          </div>
        </div>

      </div>

      {/* 5. BOTTOM WATERMARK & COPYRIGHT TIER */}
      <div className="bg-[#050505] py-8 text-center text-[10px] tracking-wider text-neutral-600 border-t border-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <span>© 2026 JD JEWEL. All rights reserved. Masterfully crafted fine art.</span>
          <div className="flex gap-6 font-light text-[9.5px]">
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy Charter</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Client Covenant</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
        
        {/* Massive Luxury Watermark background */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/3 luxury-watermark text-[8vw] select-none pointer-events-none opacity-40">
          J D &nbsp; J E W E L
        </div>
      </div>

    </footer>
  );
}
