'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, ShieldCheck, Truck, HelpCircle, ArrowRight, ChevronLeft, ChevronRight, Award, Calendar, Star, Info, Settings, Heart, Eye, Play } from 'lucide-react';
import FallingDiamonds from '@/components/FallingDiamonds';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';
import { useToast } from '@/context/ToastContext';
import TrustBadges from '@/components/TrustBadges';

export default function HomePage() {
  const { success, error, warning } = useToast();
  // Client-side states
  const [currency, setCurrency] = useState('EU / EUR');
  const [products, setProducts] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [active4C, setActive4C] = useState<'carat' | 'cut' | 'color' | 'clarity'>('carat');
  const [educationCarat, setEducationCarat] = useState<number>(1.5);
  const [lookbookIdx, setLookbookIdx] = useState<number>(0);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Editorial Multi-Banner Hero Configuration across diverse jewelry categories
  const heroSlides = [
    {
      titleLine1: 'HUNDREDS MORE',
      titleLine2: 'ENGAGEMENT RINGS',
      desc: 'Handcrafted in solid 18k gold & platinum with GIA certified loose diamonds.',
      primaryBtn: { text: 'SHOP ENGAGEMENT', href: '/engagement-rings' },
      image: '/assets/images/hero_diamond_ring.png'
    },
    {
      titleLine1: 'BRILLIANT DIAMOND',
      titleLine2: 'EARRINGS & STUDS',
      desc: 'Hand-set solitaire stud earrings and diamond drop hoops in solid gold & platinum.',
      primaryBtn: { text: 'SHOP EARRINGS', href: '/products?category=earrings' },
      image: '/assets/images/hero_earrings.png'
    },
    {
      titleLine1: 'EXQUISITE GOLD',
      titleLine2: 'NECKLACES & PENDANTS',
      desc: 'Fluid gold chains, solitaire pendants, and custom monograms set with VVS diamonds.',
      primaryBtn: { text: 'SHOP NECKLACES', href: '/products?category=necklaces' },
      image: '/assets/images/hero_necklaces.png'
    },
    {
      titleLine1: 'FLUID LUXURY',
      titleLine2: 'TENNIS BRACELETS',
      desc: 'Continuous line diamond tennis bracelets crafted with microscopic precision claws.',
      primaryBtn: { text: 'SHOP BRACELETS', href: '/products?category=bracelets' },
      image: '/assets/images/hero_bracelets.png'
    },
    {
      titleLine1: 'TIMELESS LUXURY',
      titleLine2: 'WEDDING BANDS',
      desc: 'Exquisite pavé and channel-set eternity bands crafted for a lifetime.',
      primaryBtn: { text: 'SHOP WEDDING BANDS', href: '/products?category=wedding bands' },
      image: '/assets/images/hero_wedding_bands.png'
    }
  ];

  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only swipe if horizontal drag > 50px AND horizontal movement > vertical scrolling
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) {
        setHeroSlideIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      } else {
        setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length);
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        if (response.status === 200) {
          warning(data.message || 'You are already subscribed!');
        } else {
          setNewsletterSubscribed(true);
          success(data.message || 'Successfully subscribed!');
          setNewsletterEmail('');
          setTimeout(() => {
            setNewsletterSubscribed(false);
          }, 5000);
        }
      } else {
        error(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      error('Failed to connect to the server.');
    }
  };

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
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
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

  // Categories gallery config across diverse item types
  const categories = [
    {
      name: 'Engagement Rings',
      desc: 'Craft your lifelong vow with premium settings.',
      path: '/engagement-rings',
      image: '/assets/images/hero_diamond_ring.png',
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
      image: '/assets/images/hero_wedding_bands.png',
      featured: false,
      label: 'Unity Sets'
    },
    {
      name: 'Earrings & Studs',
      desc: 'Elegant hoops and brilliant studs.',
      path: '/products?category=earrings',
      image: '/assets/images/hero_earrings.png',
      featured: false,
      label: 'Brilliance Drop'
    },
    {
      name: 'Pendants & Necklaces',
      desc: 'Solid gold chains & diamond solitaire pendants.',
      path: '/products?category=necklaces',
      image: '/assets/images/hero_necklaces.png',
      featured: false,
      label: 'Heritage Chains'
    },
    {
      name: 'Tennis Bracelets',
      desc: 'Fluid VVS diamond tennis link chains.',
      path: '/products?category=bracelets',
      image: '/assets/images/hero_bracelets.png',
      featured: false,
      label: 'VVS Fluid'
    },
    {
      name: 'Custom Atelier',
      desc: 'Custom-molded CAD models & personalized items.',
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
      {/* 1. HIGH-FASHION LUXURY HERO SLIDESHOW BANNER */}
      {/* ========================================== */}
      <section 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full min-h-[480px] sm:h-[65vh] sm:min-h-[520px] bg-[#c7baa8] overflow-hidden flex items-center py-12 sm:py-0 select-none border-b border-neutral-300 group"
      >
        {/* Full-bleed background image with smooth transition between slides */}
        <div 
          key={heroSlideIdx}
          className="absolute inset-0 bg-cover bg-right sm:bg-center transition-all duration-1000 ease-in-out transform scale-100 animate-fade-in"
          style={{ backgroundImage: `url('${heroSlides[heroSlideIdx].image}')` }}
        />

        {/* Subtle dark gradient overlay on the left for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent sm:from-black/60 sm:via-black/30 z-10" />

        {/* Floating diamond particles overlay */}
        <FallingDiamonds />

        {/* Hero Content Box */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 flex items-center justify-between">
          
          <div className="space-y-4 sm:space-y-6 text-left max-w-xl">
            <h1 key={`title-${heroSlideIdx}`} className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-widest uppercase font-light leading-tight drop-shadow-md animate-fade-in">
              {heroSlides[heroSlideIdx].titleLine1} <br />
              <span className="font-bold tracking-widest block text-3xl sm:text-5xl lg:text-6xl mt-1">
                {heroSlides[heroSlideIdx].titleLine2}
              </span>
            </h1>

            <p key={`desc-${heroSlideIdx}`} className="text-white/90 font-sans text-xs sm:text-base tracking-wide font-normal max-w-md drop-shadow-sm animate-fade-in">
              {heroSlides[heroSlideIdx].desc}
            </p>

            <div className="pt-2">
              <Link
                href={heroSlides[heroSlideIdx].primaryBtn.href}
                className="inline-block px-8 py-3.5 bg-white text-neutral-900 font-sans tracking-widest uppercase font-bold text-xs hover:bg-neutral-100 transition-all shadow-md rounded-none text-center cursor-pointer"
              >
                {heroSlides[heroSlideIdx].primaryBtn.text}
              </Link>
            </div>
          </div>

        </div>

        {/* Left & Right Chevron Controls */}
        <button
          onClick={() => setHeroSlideIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-black/30 hover:bg-black/70 text-white rounded-full transition-all focus:outline-none cursor-pointer backdrop-blur-xs opacity-70 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={() => setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-black/30 hover:bg-black/70 text-white rounded-full transition-all focus:outline-none cursor-pointer backdrop-blur-xs opacity-70 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Pagination Indicator Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlideIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                heroSlideIdx === idx ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
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
      {/* TRUST BADGES SECTION                      */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 reveal-on-scroll">
        <TrustBadges />
      </section>

      {/* ========================================== */}
      {/* ========================================== */}
      {/* 2. THE THREE PILLARS OF CRAFTSMANSHIP      */}
      {/* ========================================== */}
      <section className="bg-[#0b0b0d] py-24 border-y border-gold-500/20 relative overflow-hidden reveal-on-scroll">
        {/* Optimized backing dynamic gold ambient glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-14 relative z-10">
          {/* Elegant header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] tracking-[0.35em] text-gold-400 font-bold uppercase block">EXCLUSIVE PORTALS</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase text-white font-light">Atelier Craftsmanship</h2>
            <p className="text-neutral-300 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
              Begin your custom design journey or explore our live international diamond vault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                num: '01', 
                title: 'Bespoke Ring Configurator', 
                sub: 'Interactive 3D Builder', 
                desc: 'Select setting style, custom metal alloy, ring sizing parameters, and watch your piece assemble dynamically.', 
                link: '/configurator',
                icon: <Settings className="h-6 w-6 text-gold-400 group-hover:rotate-90 transition-transform duration-[1s]" />
              },
              { 
                num: '02', 
                title: 'Loose Diamond Vault', 
                sub: 'GIA & IGI Certified Stones', 
                desc: 'Access global dealer inventories filtering color, clarity, cuts, and carat weight with transparent, registry-checked pricing.', 
                link: '/diamonds',
                icon: <Compass className="h-6 w-6 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
              },
              { 
                num: '03', 
                title: 'Atelier Custom Design', 
                sub: 'One-of-a-kind creations', 
                desc: 'Collaborate with our Mayfair design studio to draft custom CAD wax models and cast absolute unique concepts.', 
                link: '/products?category=custom',
                icon: <Award className="h-6 w-6 text-gold-400 group-hover:-translate-y-1 transition-transform duration-500" />
              }
            ].map((item) => (
              <div key={item.num} className="space-y-6 text-left p-8 sm:p-9 bg-[#141417] border border-gold-500/25 rounded-2xl group relative overflow-hidden transition-all duration-500 shadow-2xl hover:shadow-gold/10 hover:border-gold-400/60 hover:-translate-y-1.5 cursor-pointer transform-gpu">
                {/* Gold foil sheen sweep element */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Top header containing number and icon */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-neutral-900/90 rounded-xl border border-gold-500/30 group-hover:border-gold-400 group-hover:bg-gold-500/15 transition-all duration-500">
                    {item.icon}
                  </div>
                  <span className="font-serif text-5xl text-gold-400/20 group-hover:text-gold-400/40 transition-colors duration-500 font-extrabold select-none">{item.num}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-gold-400 uppercase block">
                    {item.sub}
                  </span>
                  <h3 className="font-serif text-xl text-white font-bold uppercase tracking-wider group-hover:text-gold-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-xs text-neutral-300 leading-relaxed font-light font-sans min-h-[55px]">
                  {item.desc}
                </p>
                
                <div className="pt-4 border-t border-neutral-800 group-hover:border-gold-500/30 transition-colors">
                  <Link href={item.link} className="inline-flex items-center gap-2.5 text-[10px] font-sans tracking-[0.25em] font-bold uppercase text-gold-400 hover:text-white transition-colors">
                    Explore Portal 
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300 text-gold-400 group-hover:text-white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. INTERACTIVE STEP-BY-STEP SHOWCASE       */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[11px] tracking-[0.35em] text-gold-600 font-bold uppercase block">VIRTUAL ASSEMBLY</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase text-neutral-900 font-light">How Bespoke Is Built</h2>
          <p className="text-neutral-600 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-normal">
            Toggle through the configurator steps below to preview the virtual rendering pipeline of a custom engagement ring.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          {/* Visual Showcase (col-span-7) */}
          <div className="lg:col-span-7 bg-[#111113] p-10 sm:p-14 flex items-center justify-center min-h-[440px] relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-gold-400/5 pointer-events-none" />

            <div className="w-full max-w-md aspect-square flex items-center justify-center relative z-10">
              {activeStep === 1 && (
                <div key="step1" className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                  <div className="w-full h-[85%] rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl relative">
                    <img 
                      src="/assets/images/bespoke_step1_mount.png" 
                      alt="Foundation Setting Mounting" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-[10px] font-sans font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" /> STEP 1: SOLITAIRE & PAVÉ SETTING MOUNT
                    </span>
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div key="step2" className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                  <div className="w-full h-[85%] rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl relative">
                    <img 
                      src="/assets/images/bespoke_step2_diamond.png" 
                      alt="GIA Certified Loose Diamonds" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-[10px] font-sans font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" /> STEP 2: GIA CERTIFIED LOOSE STONE SELECTION
                    </span>
                  </div>
                </div>
              )}
              {activeStep === 3 && (
                <div key="step3" className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative">
                  <div className="w-full h-[85%] rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl relative">
                    <img 
                      src="/assets/images/bespoke_step3_complete.png" 
                      alt="Master Assembled Custom Ring" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-[10px] font-sans font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> STEP 3: MASTER ASSEMBLED BESPOKE PIECE
                    </span>
                  </div>
                </div>
              )}
            </div>

            <span className="absolute bottom-4 left-6 text-[9px] uppercase tracking-widest text-neutral-400 font-sans font-semibold">
              ATELIER ASSEMBLER V2.0 • HIGH FIDELITY RENDER
            </span>
          </div>

          {/* Selector Info Panel (col-span-5) */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-200 text-left bg-white">
            <div className="space-y-8">
              {/* Step Tab Buttons */}
              <div className="flex border-b border-neutral-200">
                {[1, 2, 3].map(stepNum => (
                  <button
                    key={stepNum}
                    onClick={() => setActiveStep(stepNum)}
                    className={`flex-1 py-3 text-center text-xs font-sans font-bold border-b-2 transition-all uppercase tracking-wider cursor-pointer ${
                      activeStep === stepNum 
                        ? 'border-gold-500 text-neutral-900 font-bold bg-neutral-50/50' 
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    STEP 0{stepNum}
                  </button>
                ))}
              </div>

              {/* Step Detail Content */}
              <div className="space-y-4 animate-fade-in min-h-[160px]">
                <span className="inline-block text-[10px] font-sans font-bold tracking-widest text-gold-700 uppercase bg-gold-100/70 px-3 py-1 border border-gold-300/60 rounded-full">
                  {activeStep === 1 && 'FOUNDATION MOUNTING'}
                  {activeStep === 2 && 'CENTER SOLITAIRE SELECTION'}
                  {activeStep === 3 && 'BESPOKE ASSEMBLY COMPLETE'}
                </span>

                <h4 className="font-serif text-2xl text-neutral-900 font-bold uppercase tracking-wide leading-tight">
                  {activeStep === 1 && 'Select Setting Mounting'}
                  {activeStep === 2 && 'Browse Certified Loose Stones'}
                  {activeStep === 3 && 'Inspect Your Live Preview'}
                </h4>

                <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                  {activeStep === 1 && 'Select solid 18k gold (Yellow, Rose, White) or Platinum 950 mounts. Choose from Solitaire bands, pavé settings, vintage halos, or high-profile Cathedral structures.'}
                  {activeStep === 2 && 'Filter through our live GIA database of over 10,000 certified loose conflict-free natural diamonds, matching cut, color, clarity, and carat size parameters.'}
                  {activeStep === 3 && 'Inspect the complete rendering, configure precise ring sizes, review GIA certificate registry scans, and add to bag with lifetime bench warranty security.'}
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-100">
              <Link
                href="/configurator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-sans tracking-widest uppercase font-bold text-white bg-neutral-950 hover:bg-neutral-800 transition-all shadow-lg rounded-none w-full text-center cursor-pointer"
              >
                LAUNCH CUSTOM RING BUILDER <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. INTERACTIVE 4CS EDUCATIONAL HUB         */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[11px] tracking-[0.35em] text-gold-600 font-bold uppercase block">EXPERT DIAMOND GUIDE</span>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase text-neutral-900 font-light">Demystifying the 4Cs</h2>
          <p className="text-neutral-600 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-normal">
            Understand diamond metrics to select the perfect balance of carat, cut, color, and clarity.
          </p>
        </div>

        <div className="bg-[#0e0e11] border border-gold-500/25 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl text-left">
          
          {/* Tab Selection (col-span-4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 space-y-3 border-b lg:border-b-0 lg:border-r border-gold-500/20 bg-[#141418]">
            {[
              { id: 'carat' as const, num: '01', label: 'Carat Weight', sub: 'Measurement of diamond mass & diameter' },
              { id: 'cut' as const, num: '02', label: 'Cut Proportions', sub: 'Symmetry, Polish & Fire light brilliance' },
              { id: 'color' as const, label: 'Color Scale', num: '03', sub: 'D (Colorless) to M (Warm Tint)' },
              { id: 'clarity' as const, label: 'Clarity Rating', num: '04', sub: 'Microscopic inclusion signatures under 10x' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive4C(tab.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-300 border cursor-pointer group relative ${
                  active4C === tab.id
                    ? 'border-gold-400 bg-gold-500/15 text-white shadow-lg'
                    : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-gold-500/30 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-gold-400">{tab.num}</span>
                  {active4C === tab.id && <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />}
                </div>
                <p className="text-sm font-bold uppercase tracking-wider font-serif text-white mt-1 group-hover:text-gold-300 transition-colors">
                  {tab.label}
                </p>
                <p className="text-[11px] text-neutral-300 font-light mt-1 leading-snug">{tab.sub}</p>
              </button>
            ))}
          </div>

          {/* Interactive Simulation & Explanation (col-span-8) */}
          <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-10 bg-[#0e0e11]">
            
            {/* Visual simulation block */}
            <div className="w-64 h-64 bg-gradient-to-b from-[#18181c] to-[#101013] border border-gold-500/30 rounded-2xl flex items-center justify-center relative flex-shrink-0 shadow-2xl overflow-hidden group">
              
              {/* Subtle background rays */}
              <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Dynamic Carat Simulator */}
              {active4C === 'carat' && (
                <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in relative p-4">
                  <div 
                    className="absolute rounded-full border border-gold-400/25 transition-all duration-300"
                    style={{ width: `${45 + educationCarat * 20}%`, height: `${45 + educationCarat * 20}%` }}
                  />
                  <div 
                    className="transition-all duration-300 w-[55%] h-[55%] flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    style={{ transform: `scale(${0.45 + (educationCarat / 5) * 0.85})` }}
                  >
                    <DiamondShapeSvg shape="Round" className="w-full h-full text-white stroke-[1]" />
                  </div>
                  <span className="absolute bottom-4 font-mono text-xs font-bold text-gold-300 bg-neutral-900 px-4 py-1.5 rounded-full border border-gold-500/40 shadow-lg uppercase tracking-wider">
                    {educationCarat.toFixed(2)} Carat
                  </span>
                </div>
              )}

              {/* Dynamic Cut Simulator */}
              {active4C === 'cut' && (
                <div className="flex items-center justify-center w-full h-full animate-fade-in relative">
                  <div className="w-[60%] h-[60%] animate-[spin_20s_linear_infinite] filter drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                    <DiamondShapeSvg shape="Round" className="w-full h-full text-white stroke-[1.2]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className="w-[90%] h-[90%] text-gold-400 stroke-[1.5] animate-pulse" viewBox="0 0 100 100" fill="none">
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
                  <div className="absolute top-4 text-[10px] uppercase tracking-widest text-gold-300 font-bold bg-neutral-900 px-3 py-1 border border-gold-500/40 rounded-full shadow-md">
                    IDEAL HEARTS & ARROWS CUT
                  </div>
                </div>
              )}

              {/* Dynamic Color Simulator */}
              {active4C === 'color' && (
                <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in relative px-4">
                  <div className="flex gap-4 w-full justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center p-2 border border-blue-400/40 shadow-inner">
                        <DiamondShapeSvg shape="Round" className="w-full h-full text-blue-200 stroke-[1]" />
                      </div>
                      <span className="text-[10px] font-bold text-white mt-1.5 block">D Grade</span>
                      <span className="text-[8px] text-neutral-400 uppercase tracking-widest block">Colorless</span>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center p-2 border border-amber-400/40 relative shadow-inner">
                        <DiamondShapeSvg shape="Round" className="w-full h-full text-amber-300 stroke-[1]" />
                      </div>
                      <span className="text-[10px] font-bold text-amber-300 mt-1.5 block">K Grade</span>
                      <span className="text-[8px] text-neutral-400 uppercase tracking-widest block">Warm Tint</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Clarity Simulator */}
              {active4C === 'clarity' && (
                <div className="flex items-center justify-center w-full h-full animate-fade-in relative">
                  <div className="w-[75%] h-[75%] rounded-full border-2 border-dashed border-gold-400/50 flex items-center justify-center bg-neutral-900 relative overflow-hidden shadow-inner">
                    <DiamondShapeSvg shape="Round" className="w-[80%] h-[80%] text-white stroke-[1]" />
                    <svg className="absolute w-[50%] h-[50%] text-red-400" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="32" cy="46" r="2" />
                      <circle cx="58" cy="28" r="1.5" />
                      <circle cx="64" cy="62" r="1.5" />
                    </svg>
                  </div>
                  <span className="absolute bottom-4 font-mono text-[9.5px] font-bold text-gold-300 bg-neutral-900 px-3 py-1 rounded-full border border-gold-500/40 uppercase tracking-wider">
                    VS2: Eye-Clean 10x Loupe
                  </span>
                </div>
              )}

            </div>

            {/* Explanation details */}
            <div className="flex-1 space-y-5 text-left">
              <div>
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest font-bold block mb-1">
                  {active4C === 'carat' && 'STEP 01 • DIAMOND MASS'}
                  {active4C === 'cut' && 'STEP 02 • OPTICAL BRILLIANCE'}
                  {active4C === 'color' && 'STEP 03 • COLORLESSNESS SCALE'}
                  {active4C === 'clarity' && 'STEP 04 • PURITY SIGNATURE'}
                </span>
                <h4 className="font-serif text-2xl text-white font-bold uppercase tracking-wide">
                  {active4C === 'carat' && 'Understanding Carat Weight'}
                  {active4C === 'cut' && 'Understanding Cut & Brilliance'}
                  {active4C === 'color' && 'Understanding Color Grading'}
                  {active4C === 'clarity' && 'Understanding Clarity Signature'}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal font-sans">
                {active4C === 'carat' && 'Carat refers strictly to the weight of the diamond (1 ct = 0.2 grams). While larger carat weight increases stone presence, proper proportion mapping ensures maximum light output.'}
                {active4C === 'cut' && 'The cut determines a diamond\'s fire, sparkle, and scintillation. An Excellent or Ideal Hearts & Arrows cut reflects 99%+ of light back to the eye rather than letting light leak out the bottom.'}
                {active4C === 'color' && 'Diamonds are graded from D (absolutely crystal clear) to Z (noticeable tint). Selecting G or H color provides a virtually colorless look at exceptional value.'}
                {active4C === 'clarity' && 'Clarity measures natural microscopic birthmarks. Selecting VS1 or VS2 offers stones that are 100% eye-clean to the naked eye without paying for invisible perfection.'}
              </p>

              {/* Carat simulator slider bar */}
              {active4C === 'carat' && (
                <div className="space-y-2 pt-2 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-300 font-bold">
                    <span>DRAG TO ADJUST CARAT WEIGHT:</span>
                    <span className="text-gold-400 font-mono font-bold text-sm">{educationCarat.toFixed(2)} CT</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.05"
                    value={educationCarat}
                    onChange={(e) => setEducationCarat(parseFloat(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer h-2 bg-neutral-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                    <span>0.50 CT</span>
                    <span>2.50 CT</span>
                    <span>5.00 CT</span>
                  </div>
                </div>
              )}

              {/* Expert Pro-Tip Banner */}
              <div className="p-3.5 bg-gold-500/10 border border-gold-500/30 rounded-xl text-left">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1">
                  💡 EXPERT DIAMOND TIP
                </span>
                <p className="text-[11px] text-neutral-300 mt-1 font-light leading-normal">
                  {active4C === 'carat' && 'Prioritize Cut Grade first. An Ideal Cut 1.5ct diamond will appear larger and brighter than a poorly-cut 2.0ct stone.'}
                  {active4C === 'cut' && 'Always insist on GIA or IGI Excellent Cut parameters to ensure your stone radiates maximum fire in all ambient lighting.'}
                  {active4C === 'color' && 'Mounted in yellow or rose gold settings? You can safely choose H or I color grades — the warm metal makes the diamond look icy white.'}
                  {active4C === 'clarity' && 'VS2 and SI1 clarity grades save you up to 40% while remaining completely eye-clean without a 10x microscope.'}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/diamonds"
                  className="inline-flex items-center gap-2 text-xs font-sans tracking-widest font-bold uppercase text-gold-400 hover:text-white transition-colors"
                >
                  BROWSE VAULT DIAMONDS <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>



      {/* ========================================== */}
      {/* 6. SHOP BY CATEGORY GRID                   */}
      {/* ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <DiamondShapeSvg shape="Round" className="w-5 h-5 text-neutral-800 mx-auto mb-1 opacity-80" />
          <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.25em] uppercase text-neutral-900 font-light">
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-8 pt-2">
          {[
            {
              name: 'NECKLACES',
              path: '/products?category=necklaces',
              image: '/assets/images/hero_necklaces.png'
            },
            {
              name: 'ENGAGEMENT RINGS',
              path: '/engagement-rings',
              image: '/assets/images/category_pear_ring.png'
            },
            {
              name: 'EARRINGS',
              path: '/products?category=earrings',
              image: '/assets/images/hero_earrings.png'
            },
            {
              name: 'BRACELETS',
              path: '/products?category=bracelets',
              image: '/assets/images/hero_bracelets.png'
            },
            {
              name: 'WEDDING RINGS',
              path: '/products?category=wedding bands',
              image: '/assets/images/hero_wedding_bands.png'
            },
            {
              name: 'BESPOKE & FINE JEWELLERY',
              path: '/configurator',
              image: '/assets/images/hero_fine_jewellery.png'
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              href={cat.path}
              className="group flex flex-col items-center cursor-pointer text-center"
            >
              <div className="w-full aspect-[3/4] overflow-hidden relative shadow-sm border border-neutral-200/60 bg-[#f7f5f0]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <span className="font-serif text-xs sm:text-base tracking-[0.15em] sm:tracking-[0.2em] font-medium text-neutral-900 uppercase pt-3 sm:pt-4 pb-1 group-hover:text-gold-600 transition-colors leading-snug">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. HERITAGE TIMELINE                       */}
      {/* ========================================== */}
      <section className="bg-[#0b0b0d] py-24 border-y border-gold-500/20 relative overflow-hidden reveal-on-scroll text-left">
        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-14 relative z-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[11px] tracking-[0.35em] text-gold-400 font-bold uppercase block">OUR JOURNEY</span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.15em] uppercase text-white font-light">Mayfair Heritage</h2>
            <p className="text-neutral-300 font-sans text-xs sm:text-sm tracking-wider leading-relaxed font-light">
              Decades of bench dedication, craftsmanship development, and design innovation in Mayfair, London.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { 
                year: '1998', 
                title: 'Atelier Foundation', 
                desc: 'Opened our first bespoke casting bench workshop in Mayfair, London, servicing exclusive local commission requests.',
                tag: 'MILESTONE 01'
              },
              { 
                year: '2008', 
                title: 'GIA Vault Integration', 
                desc: 'Pioneered direct access routing to international diamond indexes, bringing transparent dealer pricing to retail clients.',
                tag: 'MILESTONE 02'
              },
              { 
                year: '2018', 
                title: 'Ethical Alloys Covenant', 
                desc: 'Shifted 100% of setting casting lines to use recycled luxury metals and verified carbon-neutral lab diamond grow centers.',
                tag: 'MILESTONE 03'
              },
              { 
                year: '2026', 
                title: 'Bespoke Configurator', 
                desc: 'Introduced our live high-fidelity virtual ring assembly system, allowing customers to design and preview pieces instantly.',
                tag: 'MILESTONE 04'
              }
            ].map((ms, idx) => (
              <div 
                key={idx} 
                className="bg-[#141417] border border-gold-500/25 rounded-2xl p-7 flex flex-col justify-between space-y-6 group hover:border-gold-400/60 hover:-translate-y-1.5 transition-all duration-500 shadow-2xl hover:shadow-gold/10 relative overflow-hidden cursor-pointer"
              >
                {/* Gold foil sheen animation on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest font-bold text-gold-400 uppercase bg-neutral-900 border border-gold-500/30 px-3 py-1 rounded-full">
                      {ms.tag}
                    </span>
                    <span className="font-serif text-3xl font-extrabold text-gold-400/30 group-hover:text-gold-400 transition-colors duration-500">
                      {ms.year}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg text-white font-bold uppercase tracking-wider group-hover:text-gold-300 transition-colors">
                    {ms.title}
                  </h4>

                  <p className="text-xs text-neutral-300 leading-relaxed font-light font-sans">
                    {ms.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-[10px] font-mono font-bold text-gold-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Mayfair Bench</span>
                  <span className="text-neutral-500 font-normal">{ms.year}</span>
                </div>
              </div>
            ))}
          </div>
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
      {/* 10. LUXURY SHOWROOM INVITE                 */}
      {/* ========================================== */}
      <section className="relative h-[65vh] min-h-[420px] flex items-center justify-center text-white overflow-hidden border-y border-gold-400/20 reveal-on-scroll">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/assets/images/homepage_showroom.png" 
            alt="London Showroom Private Salon" 
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
            Visit Our London Showroom
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
              onSubmit={handleNewsletterSubmit} 
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
