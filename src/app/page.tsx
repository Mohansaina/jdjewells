'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, ShieldCheck, Truck, HelpCircle, ArrowRight, ChevronLeft, ChevronRight, Award, Calendar, Star, Info, Settings, Heart, Eye, Play } from 'lucide-react';
import FallingDiamonds from '@/components/FallingDiamonds';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';

export default function HomePage() {
  // Client-side states
  const [currency, setCurrency] = useState('EU / EUR');
  const [products, setProducts] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [active4C, setActive4C] = useState<'carat' | 'cut' | 'color' | 'clarity'>('carat');
  const [educationCarat, setEducationCarat] = useState<number>(1.5);
  const [lookbookIdx, setLookbookIdx] = useState<number>(0);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Sync currency from local storage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) setCurrency(savedCurrency);

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('currency') || 'EU / EUR';
      setCurrency(updated);
    };
    window.addEventListener('currency-change', handleCurrencyChange);

    // Fetch featured products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(e => console.error("Failed to load products on homepage:", e));

    // Scroll reveal intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('currency-change', handleCurrencyChange);
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const formatPrice = (amount: number) => {
    const symbol = {
      'AE / AED': 'AED ',
      'GB / GBP': '£',
      'US / USD': '$',
      'EU / EUR': '€',
      'IN / INR': '₹',
    }[currency] || '$';

    const rate = {
      'AE / AED': 3.67,
      'GB / GBP': 0.78,
      'US / USD': 1.0,
      'EU / EUR': 0.92,
      'IN / INR': 83.5,
    }[currency] || 1.0;

    const converted = amount * rate;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleBookAppointment = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  // Categories gallery config
  const categories = [
    {
      name: 'Engagement Rings',
      desc: 'Craft your lifelong vow with premium settings.',
      path: '/engagement-rings',
      image: '/assets/images/engagement_rings_banner.png',
      featured: true,
      label: 'Signature Experience'
    },
    {
      name: 'Bespoke Rings',
      desc: 'Masterfully set fine statement pieces.',
      path: '/products?category=rings',
      image: '/assets/images/eternity_rings_banner.png',
      featured: false,
      label: 'Luxury Bands'
    },
    {
      name: 'Wedding Bands',
      desc: 'Timeless solid metal bands of commitment.',
      path: '/products?category=wedding bands',
      image: '/assets/images/wedding_rings_banner.png',
      featured: false,
      label: 'Unity Sets'
    },
    {
      name: 'Earrings & Studs',
      desc: 'Elegant hoops and brilliant studs.',
      path: '/products?category=earrings',
      image: '/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg',
      featured: false,
      label: 'Brilliance Drop'
    },
    {
      name: 'Pendants',
      desc: 'Iced custom initials and motifs.',
      path: '/products?category=pendants',
      image: '/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg',
      featured: false,
      label: 'Custom Monograms'
    },
    {
      name: 'Tennis Bracelets',
      desc: 'Fluid tennis link chains.',
      path: '/products?category=bracelets',
      image: '/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg',
      featured: false,
      label: 'VVS Fluid'
    },
    {
      name: 'Solid Necklaces',
      desc: 'Solid Miami Cuban gold links.',
      path: '/products?category=necklaces',
      image: '/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg',
      featured: false,
      label: 'Heritage Chains'
    },
    {
      name: 'Custom Atelier',
      desc: 'Custom-molded grillz and personalized items.',
      path: '/products?category=custom',
      image: '/assets/images/497435148_597443402699287_4382447146201741254_n.jpg',
      featured: false,
      label: 'CAD Castings'
    }
  ];

  // Pre-curated Editorial lookbooks
  const lookbooks = [
    {
      title: 'The Starlight Suite',
      desc: 'An assembly inspired by the night skies of Mayfair. Contains classic solitaire structures combined with stellar micro-stud earrings.',
      carat: '2.5ct Center',
      metal: 'Platinum 950',
      price: 18400,
      image: '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg',
      tag: 'Classic Romance'
    },
    {
      title: 'The Royal Mayfair Set',
      desc: 'Designed for ultimate luxury. Features a micro-paved Halo ring setting surrounded by alternating VVS tennis link components.',
      carat: '3.2ct Center',
      metal: '18k Yellow Gold',
      price: 24900,
      image: '/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg',
      tag: 'Bold Heritage'
    },
    {
      title: 'The Eternity Bond',
      desc: 'Minimalist contemporary set featuring a matched pair of twisted eternity bands and elegant channel-set diamond necklaces.',
      carat: '1.8ct Total',
      metal: '18k Rose Gold',
      price: 13200,
      image: '/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg',
      tag: 'Modern Unity'
    }
  ];

  // Heritage Timeline Milestones
  const milestones = [
    { year: '1998', title: 'Atelier Foundation', desc: 'Opened our first bespoke casting bench workshop in Mayfair, London, servicing exclusive local commission requests.' },
    { year: '2008', title: 'GIA Vault Integration', desc: 'Pioneered direct access routing to international diamond indexes, bringing transparent dealer pricing to retail clients.' },
    { year: '2018', title: 'Ethical Alloys Covenant', desc: 'Shifted 100% of setting casting lines to use recycled luxury metals and verified carbon-neutral lab diamond grow centers.' },
    { year: '2026', title: 'Bespoke Configurator Launch', desc: 'Introduced our live high-fidelity virtual ring assembly system, allowing customers to design and preview pieces instantly.' }
  ];

  // Master Artisans Spotlights
  const artisans = [
    { name: 'Marcus Vance', role: 'Head of Stone Setting', quote: 'A diamond is only as good as the setting. We hand-microscope each claw to ensure light refractions are perfectly balanced.', specialty: 'Pavé & Cathedral' },
    { name: 'Sophia Sterling', role: 'Lead CAD Sculptor', quote: 'Designing custom jewelry is like building micro-architecture. We balance structural integrity with pure aesthetic grace.', specialty: '3D Modeling & Wax Casts' }
  ];

  return (
    <div className="space-y-32 pb-24 bg-[#faf9f6]">
      
      {/* ========================================== */}
      {/* 1. EDITORIAL LUXURY HERO BANNER            */}
      {/* ========================================== */}
      <section className="relative h-[95vh] min-h-[650px] flex items-center justify-center bg-[#050505] overflow-hidden">
        {/* Full-bleed background image with smooth parallax feel */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none scale-105 transition-transform duration-1000">
          <img 
            src="/assets/images/homepage_hero.png" 
            alt="J&D Jewellers London Editorial Hero" 
            className="w-full h-full object-cover opacity-70"
          />
          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#faf9f6]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/75" />
        </div>

        {/* Floating diamond particles */}
        <FallingDiamonds />

        {/* Centered Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 w-full z-10 pt-20 animate-fade-in-up flex flex-col items-center justify-center text-center">
          
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-center gap-4 mb-2 animate-fade-in-down">
              <span className="h-[1px] w-12 bg-gold-400/40"></span>
              <span className="text-[10px] sm:text-xs font-sans tracking-[0.5em] text-gold-300 uppercase block font-bold">
                J&D JEWELLERS • LONDON
              </span>
              <span className="h-[1px] w-12 bg-gold-400/40"></span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white tracking-[0.05em] font-light leading-[1.1]">
              CRAFT YOUR LIFELONG <br />
              <span className="italic font-normal text-gold-200 font-serif gold-foil-text">Masterpiece</span>
            </h1>
            
            <p className="text-neutral-300 font-sans text-xs sm:text-base tracking-wider max-w-xl mx-auto font-light leading-relaxed">
              Select your premium mounting, select from 10,000+ GIA certified loose diamonds, and build your bespoke ring live in high definition.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Link
                href="/configurator"
                className="px-9 py-4.5 text-[10px] font-sans tracking-[0.2em] uppercase font-bold gold-gradient text-white hover:gold-gradient-hover shadow-lg hover:shadow-gold transition-all duration-500 rounded-sm"
              >
                Design Your Ring
              </Link>
              <Link
                href="/diamonds"
                className="px-9 py-4.5 text-[10px] font-sans tracking-[0.2em] uppercase font-bold border border-gold-300/45 text-gold-300 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-500 rounded-sm"
              >
                Browse Certified Diamonds
              </Link>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center animate-bounce-slow">
          <span className="text-[8px] tracking-[0.3em] uppercase text-gold-400/60 font-semibold block mb-1.5">Scroll to Begin</span>
          <div className="w-[1px] h-10 bg-gold-400/40 mx-auto"></div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 1.5. TRUSTPILOT RATING TRUST BANNER       */}
      {/* ========================================== */}
      <section className="bg-white border-y border-gold-400/15 py-8 text-center font-sans relative z-10 -mt-1">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl text-emerald-500 font-bold">★ ★ ★ ★ ★</span>
            <div className="text-left">
              <span className="font-serif font-bold text-neutral-900 tracking-wider block text-base uppercase">EXCELLENT 4.9 OUT OF 5</span>
              <span className="text-[10px] text-neutral-400 font-semibold tracking-widest uppercase">Based on 14,820+ verified independent customer reviews</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-wider text-neutral-600 font-semibold uppercase">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Secure Checkout</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Conflict-Free Diamonds</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Free Resizing & Reshapes</span>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. THE THREE PILLARS OF CRAFTSMANSHIP      */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 reveal-on-scroll">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-14 border-y border-gold-400/20">
          {[
            { num: '01', title: 'Bespoke Ring Configurator', sub: 'Interactive 3D Builder', desc: 'Select setting style, custom metal alloy, ring sizing parameters, and watch your piece assemble dynamically.', link: '/configurator' },
            { num: '02', title: 'Loose Diamond Vault', sub: 'GIA & IGI Certified Stones', desc: 'Access global dealer inventories filtering color, clarity, cuts, and carat weight with transparent, registry-checked pricing.', link: '/diamonds' },
            { num: '03', title: 'Atelier Custom Design', sub: 'One-of-a-kind creations', desc: 'Collaborate with our Mayfair design studio to draft custom CAD wax models and cast absolute unique concepts.', link: '/products?category=custom' }
          ].map((item) => (
            <div key={item.num} className="space-y-5 text-left p-6 hover-luxury-lift premium-border bg-white rounded-sm group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50/50 rounded-bl-full -z-10 group-hover:bg-gold-100/30 transition-colors duration-500"></div>
              <span className="font-serif text-4xl text-gold-400/30 group-hover:text-gold-500 transition-colors duration-500 block font-light">{item.num}</span>
              <div>
                <span className="text-[9px] font-sans font-bold tracking-widest text-gold-600 uppercase block">{item.sub}</span>
                <h3 className="font-serif text-base text-neutral-900 font-bold uppercase tracking-wide mt-1 group-hover:text-gold-600 transition-colors duration-300">{item.title}</h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">{item.desc}</p>
              <Link href={item.link} className="inline-flex items-center gap-1.5 text-[9.5px] font-sans tracking-widest font-bold uppercase text-neutral-800 hover:text-gold-600 transition-colors pt-2 hover-border-draw">
                Explore Portal <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. INTERACTIVE STEP-BY-STEP SHOWCASE       */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Virtual Assembly</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">How Bespoke Is Built</h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
            Toggle through the configurator steps below to preview the virtual rendering pipeline of a custom engagement ring.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
          {/* Visual Showcase (col-span-7) */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#faf9f6] to-[#f2eee7] p-16 flex items-center justify-center min-h-[420px] relative">
            <div className="w-[50%] aspect-square flex items-center justify-center relative">
              {activeStep === 1 && (
                <div className="w-full h-full flex items-center justify-center animate-fade-in relative">
                  <div className="w-[90%] h-[90%] rounded-full border border-gold-300/30 opacity-40 animate-ping absolute" />
                  {/* Detailed Luxury Shank Mounting SVG */}
                  <svg className="w-full h-full text-gold-500/80 stroke-[0.8]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="58" r="28" strokeWidth="2.5" />
                    {/* Ring band details */}
                    <circle cx="50" cy="58" r="25.5" strokeWidth="1" strokeDasharray="2 2" className="text-gold-600" />
                    {/* Micro-prong head placement */}
                    <path d="M 42,28 C 45,26 55,26 58,28" strokeWidth="1.5" />
                    <rect x="47" y="24" width="6" height="4" fill="currentColor" rx="0.5" />
                    <circle cx="45" cy="27" r="1.5" fill="currentColor" />
                    <circle cx="55" cy="27" r="1.5" fill="currentColor" />
                  </svg>
                </div>
              )}
              {activeStep === 2 && (
                <div className="w-full h-full flex items-center justify-center animate-fade-in relative">
                  {/* Brilliant Cut diamond with shimmering light paths */}
                  <div className="absolute inset-0 bg-radial from-gold-100/40 to-transparent rounded-full animate-pulse" />
                  <svg className="w-[85%] h-[85%] text-neutral-800 stroke-[0.8]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <polygon points="50,15 75,30 75,45 50,85 25,45 25,30" strokeWidth="1" />
                    <line x1="50" y1="15" x2="50" y2="85" strokeWidth="0.8" />
                    <line x1="25" y1="30" x2="75" y2="30" strokeWidth="0.8" />
                    <line x1="25" y1="45" x2="75" y2="45" strokeWidth="0.8" />
                    <line x1="50" y1="15" x2="75" y2="45" strokeWidth="0.6" />
                    <line x1="50" y1="15" x2="25" y2="45" strokeWidth="0.6" />
                    <line x1="50" y1="30" x2="75" y2="45" strokeWidth="0.6" />
                    <line x1="50" y1="30" x2="25" y2="45" strokeWidth="0.6" />
                    <line x1="50" y1="45" x2="75" y2="30" strokeWidth="0.6" />
                    <line x1="50" y1="45" x2="25" y2="30" strokeWidth="0.6" />
                  </svg>
                  {/* Sparkle indicators */}
                  <div className="absolute top-4 left-4 text-gold-400 animate-sparkle"><Sparkles className="h-4 w-4" /></div>
                  <div className="absolute bottom-4 right-4 text-gold-400 animate-sparkle" style={{ animationDelay: '0.5s' }}><Sparkles className="h-4 w-4" /></div>
                </div>
              )}
              {activeStep === 3 && (
                <div className="w-full h-full flex items-center justify-center animate-fade-in relative">
                  <div className="absolute -top-4 text-gold-500 animate-pulse"><Sparkles className="h-6 w-6" /></div>
                  
                  {/* Master Assembled Ring mounting + diamond */}
                  <svg className="w-full h-full text-gold-500 stroke-[0.8] relative z-0" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="58" r="28" strokeWidth="3" />
                    {/* Twisted shank details */}
                    <path d="M 23,48 Q 30,32 50,30 Q 70,32 77,48" strokeWidth="1" strokeDasharray="1 1" className="text-gold-700" />
                    <path d="M 43,26 L 47,20 L 53,20 L 57,26 Z" fill="currentColor" />
                  </svg>
                  
                  {/* Embedded high-fidelity diamond */}
                  <div className="absolute top-[12%] w-[52%] h-[52%] z-10 filter drop-shadow-[0_4px_12px_rgba(197,160,41,0.25)]">
                    <svg className="w-full h-full text-neutral-900 stroke-[1.2]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                      <polygon points="50,15 75,30 75,45 50,85 25,45 25,30" fill="rgba(255,255,255,0.85)" />
                      <line x1="50" y1="15" x2="50" y2="85" />
                      <line x1="25" y1="30" x2="75" y2="30" />
                      <line x1="25" y1="45" x2="75" y2="45" />
                      <line x1="50" y1="15" x2="75" y2="45" />
                      <line x1="50" y1="15" x2="25" y2="45" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <span className="absolute bottom-4 left-6 text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
              Atelier Assembler V1.2 • Live Frame
            </span>
          </div>

          {/* Selector Info Panel (col-span-5) */}
          <div className="lg:col-span-5 p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-200/80 text-left">
            <div className="space-y-8">
              <div className="flex gap-4">
                {[1, 2, 3].map(stepNum => (
                  <button
                    key={stepNum}
                    onClick={() => setActiveStep(stepNum)}
                    className={`flex-1 py-3 text-center text-xs font-sans font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer ${
                      activeStep === stepNum 
                        ? 'border-gold-500 text-neutral-900 font-bold' 
                        : 'border-neutral-200 text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    Step 0{stepNum}
                  </button>
                ))}
              </div>

              <div className="space-y-4 animate-fade-in min-h-[160px]">
                <span className="text-[9px] font-sans font-bold tracking-widest text-gold-600 uppercase bg-gold-50 px-2 py-0.5 border border-gold-200/50 rounded-sm w-max block">
                  {activeStep === 1 && 'Foundation Mounting'}
                  {activeStep === 2 && 'Center Solitaire selection'}
                  {activeStep === 3 && 'Bespoke Assembly Complete'}
                </span>
                <h4 className="font-serif text-xl text-neutral-900 font-bold uppercase tracking-wide leading-tight">
                  {activeStep === 1 && 'Select Setting Mounting'}
                  {activeStep === 2 && 'Browse Certified Loose Stones'}
                  {activeStep === 3 && 'Inspect Your Live Preview'}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  {activeStep === 1 && 'Select solid 18k gold (Yellow, Rose, White) or Platinum 950 mounts. Choose from Solitaire bands, pave settings, vintage halos, or high-profile Cathedral structures.'}
                  {activeStep === 2 && 'Filter through our live GIA database of over 10,000 certified loose conflict-free natural diamonds, matching cut, color, clarity, and carat size parameters.'}
                  {activeStep === 3 && 'Inspect the complete rendering, configure precise ring sizes, review GIA certificate registry scans, and add to bag with lifetime bench warranty security.'}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100">
              <Link
                href="/configurator"
                className="inline-block px-7 py-4 text-[10px] font-sans tracking-widest uppercase font-bold gold-gradient text-white hover:gold-gradient-hover shadow-md rounded-sm w-full text-center hover:shadow-gold transition-all duration-300"
              >
                Launch Custom Ring Builder
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. INTERACTIVE 4CS EDUCATIONAL HUB         */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Expert Guidance</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">Demystifying the 4Cs</h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
            Understand diamond metrics to select the perfect balance of carat, cut, color, and clarity.
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm text-left">
          
          {/* Tab Selection (col-span-4) */}
          <div className="lg:col-span-4 p-8 space-y-3 border-b lg:border-b-0 lg:border-r border-neutral-200/80 bg-neutral-50/30">
            {[
              { id: 'carat' as const, label: 'Carat Weight', sub: 'Measurement of diamond mass' },
              { id: 'cut' as const, label: 'Cut Proportions', sub: 'Symmetry, Polish & Fire refractions' },
              { id: 'color' as const, label: 'Color Scale', sub: 'D (crystal clear) to L (warm tint)' },
              { id: 'clarity' as const, label: 'Clarity rating', sub: 'Microscopic inclusion signatures' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive4C(tab.id)}
                className={`w-full text-left p-4 rounded-sm transition-all border cursor-pointer ${
                  active4C === tab.id
                    ? 'border-gold-400 bg-white text-neutral-900 shadow-sm'
                    : 'border-transparent text-neutral-500 hover:bg-white/50 hover:text-neutral-800'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  {tab.label}
                  {active4C === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                </p>
                <p className="text-[10px] text-neutral-400 font-light mt-1">{tab.sub}</p>
              </button>
            ))}
          </div>

          {/* Interactive Simulation (col-span-8) */}
          <div className="lg:col-span-8 p-12 flex flex-col md:flex-row justify-between items-center gap-12">
            
            {/* Visual simulation block */}
            <div className="w-60 h-60 bg-gradient-to-b from-[#faf9f6] to-[#f1ede5] border border-neutral-100 rounded-full flex items-center justify-center relative flex-shrink-0 shadow-inner">
              
              {/* Dynamic Carat Simulator */}
              {active4C === 'carat' && (
                <div className="flex items-center justify-center w-full h-full animate-fade-in">
                  {/* Subtle radiating reflection rings representing presence scale */}
                  <div 
                    className="absolute rounded-full border border-gold-300/25 transition-all duration-300"
                    style={{ width: `${60 + educationCarat * 25}%`, height: `${60 + educationCarat * 25}%` }}
                  />
                  <div 
                    className="transition-all duration-300 w-[55%] h-[55%] flex items-center justify-center"
                    style={{ transform: `scale(${0.4 + (educationCarat / 5) * 0.9})` }}
                  >
                    <DiamondShapeSvg shape="Round" className="w-full h-full text-neutral-900 stroke-[0.8] filter drop-shadow-md" />
                  </div>
                  <span className="absolute bottom-5 font-mono text-[10px] font-bold text-neutral-800 bg-white px-3.5 py-1 rounded-full border border-neutral-200 shadow-xs">
                    {educationCarat.toFixed(2)} Carat
                  </span>
                </div>
              )}

              {/* Dynamic Cut Simulator */}
              {active4C === 'cut' && (
                <div className="flex items-center justify-center w-full h-full animate-fade-in relative">
                  <div className="w-[58%] h-[58%] animate-[spin_18s_linear_infinite]">
                    <DiamondShapeSvg shape="Round" className="w-full h-full text-neutral-900 stroke-[1.2]" />
                  </div>
                  {/* Sparkling gold line rays indicating fire & brilliance */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-[90%] h-[90%] text-gold-400/80 stroke-[1.2] animate-pulse" viewBox="0 0 100 100" fill="none">
                      <line x1="50" y1="8" x2="50" y2="18" />
                      <line x1="50" y1="92" x2="50" y2="82" />
                      <line x1="8" y1="50" x2="18" y2="50" />
                      <line x1="92" y1="50" x2="82" y2="50" />
                      <line x1="20" y1="20" x2="28" y2="28" />
                      <line x1="80" y1="80" x2="72" y2="72" />
                      <line x1="80" y1="20" x2="72" y2="28" />
                      <line x1="20" y1="80" x2="28" y2="72" />
                    </svg>
                  </div>
                  <div className="absolute top-5 text-[9px] uppercase tracking-widest text-gold-600 font-bold bg-gold-50 px-2 py-0.5 border border-gold-200 rounded-sm">
                    Ideal Hearts & Arrows Cut
                  </div>
                </div>
              )}

              {/* Dynamic Color Simulator */}
              {active4C === 'color' && (
                <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in relative px-4">
                  {/* Side-by-Side Comparison */}
                  <div className="flex gap-6 w-full justify-center">
                    <div className="text-center">
                      <div className="w-18 h-18 bg-white/60 rounded-full flex items-center justify-center p-2 border border-neutral-200">
                        <DiamondShapeSvg shape="Round" className="w-full h-full text-blue-500/80 stroke-[1]" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-neutral-700 mt-1 block">Grade D (Colorless)</span>
                    </div>
                    <div className="text-center">
                      <div className="w-18 h-18 bg-amber-50/70 rounded-full flex items-center justify-center p-2 border border-amber-200 relative">
                        <DiamondShapeSvg shape="Round" className="w-full h-full text-amber-700/80 stroke-[1]" />
                        <div className="absolute inset-0 bg-yellow-500/10 rounded-full mix-blend-color pointer-events-none" />
                      </div>
                      <span className="text-[9px] font-mono font-bold text-amber-800 mt-1 block">Grade L (Warm Tint)</span>
                    </div>
                  </div>
                  <span className="absolute bottom-5 font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                    Visual Color comparison
                  </span>
                </div>
              )}

              {/* Dynamic Clarity Simulator */}
              {active4C === 'clarity' && (
                <div className="flex items-center justify-center w-full h-full animate-fade-in relative">
                  {/* Lens simulation representing magnifying loop */}
                  <div className="w-[72%] h-[72%] rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center bg-white relative overflow-hidden">
                    <DiamondShapeSvg shape="Round" className="w-[80%] h-[80%] text-neutral-900 stroke-[1]" />
                    {/* Micro inclusions drawn as red markings */}
                    <svg className="absolute w-[50%] h-[50%] text-red-500/80" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="32" cy="46" r="1.5" />
                      <circle cx="58" cy="28" r="1.2" />
                      <circle cx="64" cy="62" r="1" />
                      <path d="M 30,44 L 34,48" stroke="currentColor" strokeWidth="0.8" />
                      <path d="M 34,44 L 30,48" stroke="currentColor" strokeWidth="0.8" />
                    </svg>
                    <div className="absolute inset-0 border border-neutral-300 rounded-full pointer-events-none" />
                  </div>
                  <span className="absolute bottom-5 font-mono text-[9px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 shadow-xs uppercase tracking-wide">
                    SI2: Inclusions Under 10x Loupe
                  </span>
                </div>
              )}

            </div>

            {/* Explanation details */}
            <div className="flex-1 space-y-5 md:pl-4">
              <h4 className="font-serif text-lg text-neutral-900 font-bold uppercase tracking-wider">
                {active4C === 'carat' && 'Understanding Carat Weight'}
                {active4C === 'cut' && 'Understanding Cut & Brilliance'}
                {active4C === 'color' && 'Understanding Color Grading'}
                {active4C === 'clarity' && 'Understanding Clarity Signature'}
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                {active4C === 'carat' && 'Carat refers strictly to the weight of the diamond, not its physical diameter. While a larger carat weight scales stone presence, proper proportion mapping is required to maintain optical light output. Our vault logs diamonds up to 10+ carats.'}
                {active4C === 'cut' && 'The cut determines a diamond\'s fire, sparkle, and scintillation. A higher cut grade (Excellent or Cupid\'s Ideal) reflects maximum light back to the eye rather than letting it leak out the bottom. JD Jewel inventories only feature Excellent-grade parameters.'}
                {active4C === 'color' && 'Diamonds are graded on a colorlessness scale from D (absolutely crystal clear) to Z (noticeable yellow or brown tint). For maximum value, selecting grades between G and F offers near-colorless elegance without the premium cost of D-grade.'}
                {active4C === 'clarity' && 'Diamonds formed under extreme pressures feature natural birthmarks called inclusions or blemishes. Clarity grades list from Flawless (FL) down to Included. Selecting VS2 or SI1 offers stones that are eye-clean to the naked eye.'}
              </p>

              {/* Carat simulator slider bar */}
              {active4C === 'carat' && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                    <span>Drag to Adjust Carat Weight</span>
                    <span className="text-gold-600">{educationCarat.toFixed(2)} ct</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.05"
                    value={educationCarat}
                    onChange={(e) => setEducationCarat(parseFloat(e.target.value))}
                    className="w-full accent-gold-500 cursor-pointer h-1 bg-neutral-200 rounded-lg appearance-none"
                  />
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/diamonds"
                  className="inline-flex items-center gap-1.5 text-[9.5px] font-sans tracking-widest font-bold uppercase text-neutral-800 hover:text-gold-600 transition-colors hover-border-draw"
                >
                  Browse Vault Diamonds <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 5. EDITORIAL LOOKBOOKS (COLLECTION SPOT)   */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gold-400/20 pb-4 text-left">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Editorial Sets</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">Curated Lookbooks</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLookbookIdx(prev => (prev - 1 + lookbooks.length) % lookbooks.length)}
              className="p-2.5 border border-neutral-300 hover:bg-neutral-50 transition-colors rounded-sm cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLookbookIdx(prev => (prev + 1) % lookbooks.length)}
              className="p-2.5 border border-neutral-300 hover:bg-neutral-50 transition-colors rounded-sm cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="group bg-[#0c0c0c] text-white rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-lg border border-gold-400/20 min-h-[420px] text-left relative">
          
          {/* Decorative corner brackets like a luxury gallery plaque */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gold-500/40 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gold-500/40 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gold-500/40 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gold-500/40 pointer-events-none"></div>

          {/* Lookbook Description (col-span-5) */}
          <div className="md:col-span-5 p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-900/60 relative z-10">
            <div key={lookbookIdx} className="space-y-5 animate-fade-in">
              <span className="text-[8px] font-sans font-bold tracking-widest text-gold-300 uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-sm w-max block">
                {lookbooks[lookbookIdx].tag}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl tracking-wide uppercase text-neutral-100 font-light">
                {lookbooks[lookbookIdx].title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                {lookbooks[lookbookIdx].desc}
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5 mt-8">
              <div className="flex justify-between items-baseline text-[10px] font-mono tracking-widest uppercase">
                <span className="text-neutral-500">Specifications</span>
                <span className="text-neutral-200 font-semibold">{lookbooks[lookbookIdx].carat} • {lookbooks[lookbookIdx].metal}</span>
              </div>
              <div className="flex justify-between items-baseline text-[10px] font-mono tracking-widest uppercase">
                <span className="text-neutral-500">Estimated Price</span>
                <span className="text-gold-300 font-bold text-xs">{formatPrice(lookbooks[lookbookIdx].price)}</span>
              </div>
              <button 
                onClick={handleBookAppointment}
                className="w-full py-4 text-center text-[10px] font-sans tracking-widest font-bold uppercase gold-gradient text-white hover:gold-gradient-hover shadow-md rounded-sm mt-3 transition-all duration-300 cursor-pointer"
              >
                Inquire About This Set
              </button>
            </div>
          </div>

          {/* Lookbook Graphic Backdrop (col-span-7) */}
          <div className="md:col-span-7 bg-gradient-to-b from-neutral-950 to-black p-12 flex items-center justify-center relative overflow-hidden aspect-square md:aspect-auto">
            {/* Fine luxury gridlines background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c5a029_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Ambient gold glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Elegant luxury visual layout */}
            <div key={lookbookIdx} className="w-[75%] h-[75%] bg-white/[0.02] border border-gold-300/10 rounded-full flex items-center justify-center p-8 relative animate-fade-in">
              <div className="absolute inset-0 rounded-full border border-gold-300/5 animate-pulse"></div>
              <img
                src={lookbooks[lookbookIdx].image}
                alt={lookbooks[lookbookIdx].title}
                className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow-[0_12px_28px_rgba(231,211,162,0.2)] transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <span className="absolute bottom-4 right-6 text-[8px] uppercase tracking-[0.25em] text-neutral-600 font-mono select-none">
              J&D Atelier Lookbook 2026/27
            </span>
          </div>

        </div>
      </section>

      {/* ========================================== */}
      {/* 6. CATEGORIES GALLERY GRID                 */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Shop The Catalog</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">Explore Collections</h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
            Each collection represents a masterwork of bench jewelry, cast in solid gold and hand-assembled with matching VVS stones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-left">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.path}
              className={`group relative overflow-hidden flex flex-col justify-between aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500 rounded-sm border border-gold-500/10 ${
                cat.featured ? 'sm:col-span-2 sm:aspect-[8/5]' : ''
              }`}
            >
              {/* Full-bleed background image */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Dark premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-black/20 transition-all duration-500 group-hover:via-neutral-950/55" />
              </div>

              {/* Decorative Border Draw Animation */}
              <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/30 transition-all duration-500 pointer-events-none z-20" />

              {/* Category description */}
              <div className="space-y-2.5 z-10 p-6 md:p-8">
                <span className="text-[8px] tracking-widest text-gold-300 font-bold uppercase block">
                  {cat.label}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-gold-200 transition-colors leading-tight font-light uppercase tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-neutral-300 font-sans font-light tracking-wide max-w-[210px] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Action indicator */}
              <div className="z-10 p-6 md:p-8 pt-0 mt-auto">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-sans tracking-widest uppercase font-bold text-gold-400 group-hover:text-white transition-colors">
                  Explore {cat.featured ? 'Configurator' : 'Vault'} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. HERITAGE TIMELINE                       */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 relative overflow-hidden reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Our Journey</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">Mayfair Heritage</h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
            Decades of bench dedication, craftsmanship development, and design innovation.
          </p>
        </div>

        <div className="relative border-l border-gold-300/35 max-w-2xl mx-auto pl-10 space-y-16 text-left py-4">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative space-y-2 group">
              {/* Timeline diamond node */}
              <span className="absolute -left-[49px] top-1 w-4.5 h-4.5 bg-neutral-950 border border-gold-400 rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500 transition-all duration-300 shadow-sm">
                <span className="w-1.5 h-1.5 bg-gold-200 rounded-full" />
              </span>
              
              {/* Giant background faint watermark of the year */}
              <div className="absolute right-0 -top-8 font-serif text-6xl font-bold text-neutral-300/15 select-none pointer-events-none">
                {ms.year}
              </div>

              <span className="font-mono text-xs font-bold text-gold-600 block tracking-widest">{ms.year}</span>
              <h4 className="font-serif text-lg text-neutral-900 font-bold uppercase tracking-wider">{ms.title}</h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans font-light max-w-lg">
                {ms.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 8. MEET THE MASTER ARTISANS                */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">The Bench</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">Meet Our Artisans</h2>
          <p className="text-neutral-500 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
            Every piece is individual, carrying the signature bench mark of our dedicated London craftspeople.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {artisans.map((art, idx) => (
            <div key={idx} className="bg-white border border-neutral-200/80 p-10 rounded-sm shadow-xs space-y-5 flex flex-col justify-between hover-luxury-lift relative">
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none select-none">
                {/* Visual hallmark seal */}
                <svg className="w-16 h-16 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M 50,0 C 77,0 100,23 100,50 C 100,77 77,100 50,100 C 23,100 0,77 0,50 C 0,23 23,0 50,0 Z M 50,15 C 30,15 15,30 15,50 C 15,70 30,85 50,85 C 70,85 85,70 85,50 C 85,30 70,15 50,15 Z" />
                </svg>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-gold-500">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-currentColor stroke-none" />)}
                </div>
                
                <p className="font-serif text-base italic text-neutral-800 leading-relaxed font-light">
                  &ldquo;{art.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-6 flex justify-between items-end mt-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{art.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-sans font-light mt-1">{art.role}</p>
                </div>
                <span className="text-[9px] font-mono text-gold-600 uppercase tracking-widest font-bold bg-gold-50 border border-gold-300/30 px-3 py-1 rounded-sm">
                  {art.specialty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 9. CURATED PRODUCTS VAULT FEED             */}
      {/* ========================================== */}
      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gold-400/20 pb-4 text-left">
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">
                Curated Vault
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-neutral-900 font-light">
                Featured Creations
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-sans tracking-widest uppercase font-bold text-neutral-700 hover:text-gold-500 transition-colors flex items-center gap-1 hover-border-draw"
            >
              View Entire Catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="group flex flex-col bg-white border border-neutral-200/80 shadow-xs hover:shadow-md hover-luxury-lift rounded-sm overflow-hidden text-left relative"
              >
                {/* Decorative Border Draw Animation */}
                <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/20 transition-all duration-500 pointer-events-none z-20" />
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent group-hover:w-full transition-all duration-700 z-20" />
                <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent group-hover:w-full transition-all duration-700 z-20" />
                <div className="absolute top-0 left-0 h-0 w-[1px] bg-gradient-to-b from-transparent via-gold-400 to-transparent group-hover:h-full transition-all duration-700 z-20" />
                <div className="absolute top-0 right-0 h-0 w-[1px] bg-gradient-to-b from-transparent via-gold-400 to-transparent group-hover:h-full transition-all duration-700 z-20" />

                {/* Product Image Vitrine */}
                <div className="aspect-square bg-gradient-to-b from-[#faf9f6] to-[#f2eee7] border-b border-neutral-100 p-10 flex items-center justify-center overflow-hidden relative">
                  {/* Subtle ambient gold glow behind product image */}
                  <div className="absolute w-1/2 h-1/2 bg-gold-500/5 filter blur-[40px] pointer-events-none rounded-full" />
                  
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)] relative z-10"
                  />
                  
                  {/* Subtle Top corner hallmark badge */}
                  <span className="absolute top-4 right-4 bg-white border border-neutral-200/70 p-2 rounded-sm text-gold-500 shadow-xs z-10">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>

                  {/* Museum quick-inquire overlay */}
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-[1px] z-10">
                    <Link
                      href={`/products/${prod.id}`}
                      className="px-6 py-3 text-[9px] font-sans tracking-widest uppercase font-bold border border-gold-300/40 text-gold-300 hover:text-white hover:border-gold-300 bg-black/60 backdrop-blur-xs transition-all duration-300 rounded-sm shadow-md"
                    >
                      Request Private Viewing
                    </Link>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans font-semibold">
                        {prod.category} • {prod.material}
                      </span>
                      <span className="text-[9px] font-mono text-gold-600 bg-gold-50 border border-gold-200/40 px-2 py-0.5 rounded-sm">
                        In Stock
                      </span>
                    </div>
                    <Link href={`/products/${prod.id}`}>
                      <h3 className="font-serif text-lg text-neutral-900 group-hover:text-gold-600 transition-colors font-medium leading-tight">
                        {prod.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <span className="text-sm font-bold text-neutral-900 font-mono">{formatPrice(prod.price)}</span>
                    <Link
                      href={`/products/${prod.id}`}
                      className="text-[9px] font-sans tracking-widest font-bold uppercase text-gold-600 group-hover:text-gold-700 transition-colors flex items-center gap-1"
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================== */}
      {/* 10. LUXURY SHOWROOM INVITE                 */}
      {/* ========================================== */}
      <section className="relative h-[65vh] min-h-[420px] flex items-center justify-center text-white overflow-hidden border-y border-gold-400/20 reveal-on-scroll">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/assets/images/homepage_showroom.png" 
            alt="London Mayfair Showroom Private Salon" 
            className="w-full h-full object-cover"
          />
          {/* Deep dark luxury overlay */}
          <div className="absolute inset-0 bg-[#07090e]/85 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/80" />
        </div>

        {/* Textured gold frame around the consultation text */}
        <div className="relative max-w-3xl mx-auto px-10 py-12 text-center space-y-6 z-10 border border-gold-300/20 bg-black/35 backdrop-blur-md rounded-sm m-4">
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold-400/45"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold-400/45"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold-400/45"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold-400/45"></div>

          <span className="text-[9px] tracking-[0.3em] text-gold-400 font-bold uppercase block">
            Private Appointment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-white leading-tight font-light">
            Visit Our Mayfair Showroom
          </h2>
          <p className="text-xs sm:text-sm font-sans tracking-wider leading-relaxed max-w-xl mx-auto text-neutral-300 font-light">
            Schedule a private, one-on-one session at our London showroom to review custom designs, inspect raw diamond specimens under loupes, and coordinate exact measurements with a master bench jeweler.
          </p>
          <div className="pt-4">
            <button
              onClick={handleBookAppointment}
              className="px-9 py-4 text-xs font-sans tracking-widest uppercase font-bold bg-white text-neutral-900 hover:bg-neutral-100 shadow-md hover:shadow-gold transition-all duration-300 rounded-sm cursor-pointer"
            >
              Book Private Salon Review
            </button>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 10.5. PREMIUM NEWSLETTER SIGNUP            */}
      {/* ========================================== */}
      <section className="bg-white border-y border-gold-400/15 py-16 text-center font-sans reveal-on-scroll">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="space-y-2">
            <span className="text-[9px] tracking-[0.3em] text-gold-600 font-bold uppercase block">Stay Connected</span>
            <h2 className="font-serif text-3xl tracking-widest uppercase text-neutral-900 leading-tight">
              Join The Vault List
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Subscribe to receive exclusive invitations to private seasonal launches, priority access to loose diamond vault restocks, and weekly styling notes from our Mayfair salon.
            </p>
          </div>
          
          {newsletterSubscribed ? (
            <div className="max-w-md mx-auto p-4 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 animate-fade-in">
              <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Successfully Subscribed to The Vault List!</span>
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  setNewsletterSubscribed(true);
                  setTimeout(() => {
                    setNewsletterSubscribed(false);
                    setNewsletterEmail('');
                  }, 5000);
                }
              }} 
              className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 border border-neutral-200 px-4 py-3.5 text-xs bg-neutral-50/50 rounded focus:outline-none focus:ring-1 focus:ring-gold-400 font-sans"
              />
              <button
                type="submit"
                className="px-6 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md hover:shadow-gold transition-all duration-300 rounded cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================== */}
      {/* 11. TRUST BADGES                           */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left reveal-on-scroll">
        <div className="border border-neutral-200/80 p-8 flex flex-col items-start space-y-4 bg-white rounded-sm shadow-xs hover-luxury-lift">
          <div className="p-3 bg-gold-50 border border-gold-200/50 rounded-sm">
            <ShieldCheck className="h-6 w-6 text-gold-600 stroke-[1.2]" />
          </div>
          <h4 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">100% Insured Transit</h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
            Every shipment is registered with premium courier services, fully insured in transit, and requires direct adult signature verification.
          </p>
        </div>
        <div className="border border-neutral-200/80 p-8 flex flex-col items-start space-y-4 bg-white rounded-sm shadow-xs hover-luxury-lift">
          <div className="p-3 bg-gold-50 border border-gold-200/50 rounded-sm">
            <Truck className="h-6 w-6 text-gold-600 stroke-[1.2]" />
          </div>
          <h4 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">Overnight FedEx Delivery</h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
            Complimentary shipping is automatically upgraded to overnight express once bench inspection is signed off.
          </p>
        </div>
        <div className="border border-neutral-200/80 p-8 flex flex-col items-start space-y-4 bg-white rounded-sm shadow-xs hover-luxury-lift">
          <div className="p-3 bg-gold-50 border border-gold-200/50 rounded-sm">
            <Award className="h-6 w-6 text-gold-600 stroke-[1.2]" />
          </div>
          <h4 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">Lifetime Bench Warranty</h4>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light">
            Our warranty covers loose stone tightening, cleaning, and structural checks forever to preserve family heirlooms.
          </p>
        </div>
      </section>

    </div>
  );
}
