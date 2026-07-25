'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useConfigurator, DiamondShape, SettingStyle, MetalType, JewelryCategory } from '@/context/ConfiguratorContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import RingVisualizer from '@/components/RingVisualizer';
import { VdbService } from '@/services/vdb';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';
import { ChevronRight, ChevronLeft, Sparkles, Check, Info, FileText, AlertCircle, ShoppingBag, RotateCcw } from 'lucide-react';

function ConfiguratorPageContent() {
  const {
    category,
    shape,
    setting,
    metal,
    size,
    selectedDiamond,
    step,
    setCategory,
    setShape,
    setSetting,
    setMetal,
    setSize,
    setSelectedDiamond,
    setStep,
    nextStep,
    prevStep,
    resetConfig,
    getSettingPrice,
    getTotalPrice
  } = useConfigurator();

  const { success } = useToast();

  const [currency, setCurrency] = useState('EU / EUR');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) setCurrency(savedCurrency);

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('currency') || 'EU / EUR';
      setCurrency(updated);
    };
    window.addEventListener('currency-change', handleCurrencyChange);
    setIsMounted(true);
    return () => window.removeEventListener('currency-change', handleCurrencyChange);
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

  const { addToCart } = useCart();
  const searchParams = useSearchParams();

  const initializedRef = React.useRef(false);

  // Load configuration from URL query params (make it workable from external links)
  useEffect(() => {
    if (initializedRef.current) return;

    const cat = searchParams.get('category');
    const sh = searchParams.get('shape');
    const set = searchParams.get('setting');
    const met = searchParams.get('metal');
    const st = searchParams.get('step');
    const diaId = searchParams.get('diamondId') || searchParams.get('vdbId');

    if (cat) {
      const decodedCat = decodeURIComponent(cat) as JewelryCategory;
      setCategory(decodedCat);
    }
    if (sh) {
      const decodedSh = decodeURIComponent(sh) as DiamondShape;
      setShape(decodedSh);
    }
    if (set) {
      const decodedSet = decodeURIComponent(set) as SettingStyle;
      setSetting(decodedSet);
    }
    if (met) {
      const decodedMet = decodeURIComponent(met) as MetalType;
      setMetal(decodedMet);
    }
    if (st) {
      const stepNum = parseInt(st);
      if (!isNaN(stepNum)) setStep(stepNum);
    }

    if (diaId) {
      VdbService.getById(diaId).then((dia) => {
        if (dia) {
          setSelectedDiamond(dia);
          // If no custom step is explicitly specified, go directly to Review step
          if (!st) {
            setStep(6);
          }
        }
      }).catch((err) => {
        console.error("Failed to load query parameter diamond:", err);
      });
    }

    initializedRef.current = true;
  }, [searchParams]);

  // Listen for iframe postMessages from VDB and Nivoda
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      const origin = event.origin;
      const isTrusted = 
        origin.endsWith('vdbapp.com') || 
        origin.endsWith('nivoda.net') ||
        origin.includes('localhost'); // allow local testing/mocking

      if (!isTrusted) return;

      const data = event.data;
      if (!data) return;

      let targetId = '';
      if (data.type === 'vdb_select_stone' && data.itemId) {
        targetId = `vdb-${data.itemId}`;
      } else if (data.type === 'nivoda_select_stone' && data.diamondId) {
        targetId = `niv-${data.diamondId}`;
      } else if (data.action === 'select_stone' && data.stoneId) {
        targetId = data.stoneId.startsWith('vdb-') || data.stoneId.startsWith('niv-') 
          ? data.stoneId 
          : `vdb-${data.stoneId}`;
      }

      if (targetId) {
        VdbService.getById(targetId).then((dia) => {
          if (dia) {
            setSelectedDiamond(dia);
            setStep(6);
            success("Diamond attached from showroom successfully!");
          }
        }).catch((err) => {
          console.error("Error loading diamond from message:", err);
        });
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [success, setSelectedDiamond, setStep]);

  // Wizard step definitions
  const stepsList = [
    { num: 1, title: 'Category' },
    { num: 2, title: 'Stone Shape' },
    { num: 3, title: 'Setting Style' },
    { num: 4, title: 'Metal' },
    { num: 5, title: 'Ring Size' },
    { num: 6, title: 'Review' }
  ];

  // Config options details
  const categories: { name: JewelryCategory; desc: string }[] = [
    { name: 'Engagement Rings', desc: 'Craft a classic diamond ring setting tailored for the center stone.' },
    { name: 'Wedding Bands', desc: 'Solid, high-polish bands representing eternal unity.' },
    { name: 'Rings', desc: 'Bold statements and fashion rings.' },
    { name: 'Custom Jewelry', desc: 'Design custom-cast settings tailored for unique requirements.' }
  ];

  const shapes: { name: DiamondShape; desc: string; ratio: string }[] = [
    { name: 'Round', desc: 'Brilliant faceted circle', ratio: '1.00' },
    { name: 'Oval', desc: 'Elongated brilliance', ratio: '1.35' },
    { name: 'Cushion', desc: 'Pillow-cut rounded square', ratio: '1.02' },
    { name: 'Princess', desc: 'Modern geometric square', ratio: '1.01' },
    { name: 'Emerald', desc: 'Step-cut hall of mirrors', ratio: '1.40' },
    { name: 'Pear', desc: 'Graceful teardrop profile', ratio: '1.50' },
    { name: 'Marquise', desc: 'Slender diamond eye shape', ratio: '1.85' },
    { name: 'Radiant', desc: 'Corner-cut radiant square', ratio: '1.20' },
    { name: 'Heart', desc: 'Romantic symbolic heart', ratio: '1.00' }
  ];

  const settings: { name: SettingStyle; desc: string; addPrice: number }[] = [
    { name: 'Solitaire', desc: 'Pure elegance. A single basket maximizes diamond sparkle.', addPrice: 0 },
    { name: 'Halo', desc: 'Framed brilliance. Small diamonds border your center stone.', addPrice: 700 },
    { name: 'Vintage', desc: 'Antique details. Intricate milgrain carvings and filigree.', addPrice: 450 },
    { name: 'Three Stone', desc: 'Past, present, future. Two side diamonds border the center.', addPrice: 900 },
    { name: 'Pavé', desc: 'Shimmering band. Dotted micro-diamonds along the shoulders.', addPrice: 550 },
    { name: 'Cathedral', desc: 'Architectural arch. High shoulders elevate the basket.', addPrice: 250 }
  ];

  const metals: { name: MetalType; desc: string; priceFactor: number }[] = [
    { name: 'White Gold', desc: '18k solid white gold, rhodium plated for ultimate sheen.', priceFactor: 500 },
    { name: 'Yellow Gold', desc: '18k solid yellow gold, rich warm heritage look.', priceFactor: 450 },
    { name: 'Rose Gold', desc: '18k solid rose gold, warm coppery-pink romance.', priceFactor: 450 },
    { name: 'Platinum', desc: 'Pure solid 950 Platinum, hypoallergenic and heavy weight.', priceFactor: 1100 }
  ];

  const ringSizes = Array.from({ length: 17 }, (_, i) => (4 + i * 0.5).toFixed(1));

  // Handler to add custom configuration to bag
  const handleAddToBag = () => {
    const customConfig = {
      category,
      shape,
      setting,
      metal,
      size,
      price: getSettingPrice(),
      diamond: selectedDiamond || undefined
    };

    addToCart({
      price: getTotalPrice(),
      customConfig,
      productTitle: `Custom ${category} (Setting Only)`
    });

    success("Masterpiece added to your shopping bag successfully!");
  };

  const metalColors: Record<MetalType, string> = {
    'White Gold': 'bg-gradient-to-tr from-[#9ca3af] via-[#f3f4f6] to-[#e5e7eb]',
    'Yellow Gold': 'bg-gradient-to-tr from-[#b45309] via-[#fcd34d] to-[#fbbf24]',
    'Rose Gold': 'bg-gradient-to-tr from-[#b91c1c] via-[#fca5a5] to-[#f87171]',
    'Platinum': 'bg-gradient-to-tr from-[#6b7280] via-[#e5e7eb] to-[#d1d5db]'
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-96 flex flex-col items-center justify-center text-center space-y-3">
        <span className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans font-semibold">Loading Custom Ring Builder...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Wizard Progress Track (Premium Light Stepper Capsule) */}
      <div className="relative bg-gradient-to-b from-[#faf9f6] to-[#f4f1e8] p-5.5 rounded-3xl overflow-x-auto border border-gold-300/30 shadow-md">
        <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-gold-300/10 via-gold-400/40 to-gold-300/10 -translate-y-1/2 z-0 hidden md:block" />
        <div className="relative z-10 flex justify-between items-center min-w-[640px] md:min-w-0 gap-4">
          {stepsList.map((st) => {
            const isActive = step === st.num;
            const isCompleted = step > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setStep(st.num)}
                className="flex flex-col items-center gap-2.5 flex-1 group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full font-serif text-xs flex items-center justify-center border transition-all duration-500 ${
                    isActive
                      ? 'gold-gradient border-gold-600 text-white font-extrabold ring-4 ring-gold-100/60 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-gold-50/80 border-gold-400 text-gold-700 hover:bg-gold-100 hover:scale-105'
                      : 'bg-white border-neutral-200 text-neutral-450 group-hover:border-gold-300 group-hover:text-neutral-700'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : st.num}
                </div>
                <span
                  className={`text-[8.5px] uppercase tracking-[0.2em] font-sans font-bold transition-all duration-300 ${
                    isActive ? 'text-gold-700 font-extrabold scale-105' : 'text-neutral-550 group-hover:text-neutral-800'
                  }`}
                >
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visualizer View (Sticky on Desktop) */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6 flex flex-col items-center self-start w-full">
          <div className="w-full max-w-[480px] bg-gradient-to-b from-[#faf8f5] to-[#f2ede0] border border-gold-400/25 shadow-2xl p-6 rounded-3xl relative overflow-hidden group flex flex-col items-center justify-center">
            {/* Museum highlight header */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-10 pointer-events-none select-none">
              <span className="text-[8px] font-sans tracking-[0.25em] text-gold-700 font-extrabold uppercase">Atelier Holographic Live Frame</span>
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping"></span>
            </div>
            
            {/* Ambient gold radial glow casting down from the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gold-400/15 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[radial-gradient(circle_at_center,rgba(197,160,41,0.08)_0%,transparent_70%)] blur-2xl pointer-events-none" />
 
            <RingVisualizer shape={shape} setting={setting} metal={metal} />
            
            {/* Dynamic visual watermark in background */}
            <div className="absolute bottom-4 left-6 text-[8px] font-mono tracking-[0.25em] text-gold-650/30 uppercase pointer-events-none select-none">
              J&D LONDON • BENCH VISUALIZATION
            </div>
          </div>
          
          {/* Price Breakdown Details */}
          <div className="w-full max-w-[480px] glass-panel-light p-6 rounded-2xl shadow-lg space-y-4 border border-gold-300/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-300/20 via-gold-500/60 to-gold-300/20" />
            <h4 className="font-serif text-sm uppercase tracking-widest text-neutral-900 border-b border-gold-400/20 pb-2.5 font-bold">
              Cost Summary
            </h4>
            <div className="space-y-3 text-xs font-sans text-neutral-600">
              <div className="flex justify-between">
                <span>{metal} {setting} Band</span>
                <span className="font-semibold text-neutral-900">{formatPrice(getSettingPrice())}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Center Certified Diamond</span>
                {selectedDiamond ? (
                  <span className="text-gold-600 font-bold">{formatPrice(selectedDiamond.price)}</span>
                ) : (
                  <span className="text-neutral-400 italic">No stone attached</span>
                )}
              </div>
              
              <div className="flex justify-between text-sm text-neutral-900 font-bold border-t border-gold-400/20 pt-4 mt-2">
                <span className="font-serif tracking-wider uppercase text-neutral-800">Estimated Total</span>
                <span className="text-neutral-950 font-black text-lg">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Wizard Steps Panels */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Active Step Panel Title */}
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-gold-600 font-black uppercase block">
              Step {step} of 6
            </span>
            <h2 className="font-serif text-3xl tracking-widest uppercase text-neutral-900">
              {stepsList[step - 1].title} Selection
            </h2>
            <div className="w-16 h-[2.5px] bg-gold-500 mt-2" />
          </div>

          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`text-left p-6 border rounded-2xl transition-all duration-500 flex flex-col justify-between hover:border-gold-400/50 hover:shadow-xl cursor-pointer group relative ${
                    category === cat.name
                      ? 'border-gold-500 bg-gradient-to-b from-[#faf8f5] to-[#f4eee0] shadow-md ring-1 ring-gold-400/30 scale-[1.01] -translate-y-0.5'
                      : 'border-gold-300/10 bg-[#faf9f6]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-serif text-base text-neutral-950 font-bold group-hover:text-gold-600 transition-colors">
                      {cat.name}
                    </span>
                    <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                      category === cat.name 
                        ? 'border-gold-500 bg-gold-500 text-white' 
                        : 'border-neutral-300 group-hover:border-gold-400'
                    }`}>
                      {category === cat.name && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 font-light leading-relaxed">{cat.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: STONE SHAPE */}
          {step === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
              {shapes.map((sh) => (
                <button
                  key={sh.name}
                  onClick={() => setShape(sh.name)}
                  className={`p-5 border rounded-2xl transition-all duration-500 text-center flex flex-col items-center justify-between aspect-square hover:border-gold-400/50 hover:shadow-xl group relative cursor-pointer ${
                    shape === sh.name
                      ? 'border-gold-500 bg-gradient-to-b from-[#faf8f5] to-[#f4eee0] shadow-md ring-1 ring-gold-400/30 scale-[1.03] -translate-y-0.5'
                      : 'border-gold-300/10 bg-[#faf9f6]/40 hover:bg-white'
                  }`}
                >
                  {shape === sh.name && (
                    <span className="absolute top-2.5 right-2.5 bg-gold-500 text-white rounded-full p-0.5 shadow-md z-10">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  )}
                  
                  {/* Thumbnail representing shape profile */}
                  <div className="w-16 h-16 bg-[#faf9f6]/90 flex items-center justify-center p-2.5 rounded-lg border border-neutral-100 group-hover:scale-110 transition-transform duration-500">
                    <DiamondShapeSvg 
                      shape={sh.name} 
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(186,215,235,0.25)]"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <span className="font-serif text-xs font-bold text-neutral-900 block group-hover:text-gold-600 transition-colors">{sh.name}</span>
                    <span className="text-[9px] text-neutral-400 mt-0.5 tracking-wider font-bold block">Ratio: {sh.ratio}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: SETTING STYLE */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {settings.map((se) => (
                <button
                  key={se.name}
                  onClick={() => setSetting(se.name)}
                  className={`p-6 border rounded-2xl transition-all duration-500 text-left flex flex-col justify-between hover:border-gold-400/50 hover:shadow-xl group relative cursor-pointer ${
                    setting === se.name
                      ? 'border-gold-500 bg-gradient-to-b from-[#faf8f5] to-[#f4eee0] shadow-md ring-1 ring-gold-400/30 scale-[1.01] -translate-y-0.5'
                      : 'border-gold-300/10 bg-[#faf9f6]/40 hover:bg-white'
                  }`}
                >
                  {setting === se.name && (
                    <span className="absolute top-4 right-4 bg-gold-500 text-white rounded-full p-0.5 shadow-md">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                  )}
                  
                  <div>
                    <span className="font-serif text-base font-bold text-neutral-950 block group-hover:text-gold-600 transition-colors">{se.name}</span>
                    <p className="text-[11px] text-neutral-500 mt-1.5 font-light leading-relaxed">{se.desc}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center w-full border-t border-neutral-100 pt-3">
                    <span className="text-[9.5px] uppercase tracking-widest text-neutral-400 font-black">Upgrade</span>
                    <span className="text-xs text-gold-600 font-black font-sans">
                      {se.addPrice === 0 ? 'Included' : `+${formatPrice(se.addPrice)}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: METAL */}
          {step === 4 && (
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
              {metals.map((me) => (
                <button
                  key={me.name}
                  onClick={() => setMetal(me.name)}
                  className={`p-6 border rounded-2xl transition-all duration-500 text-left flex items-center gap-5 hover:border-gold-400/50 hover:shadow-xl group relative cursor-pointer ${
                    metal === me.name
                      ? 'border-gold-500 bg-gradient-to-b from-[#faf8f5] to-[#f4eee0] shadow-md ring-1 ring-gold-400/30 scale-[1.01] -translate-y-0.5'
                      : 'border-gold-300/10 bg-[#faf9f6]/40 hover:bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border border-neutral-300 flex-shrink-0 flex items-center justify-center p-1.5 shadow-md transition-transform duration-300 group-hover:scale-105 ${metalColors[me.name]}`}>
                    <div className="w-full h-full rounded-full border border-white/45 bg-black/10 flex items-center justify-center">
                      {metal === me.name && <Check className="h-4 w-4 text-neutral-800 stroke-[3.5]" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-base font-bold text-neutral-950 group-hover:text-gold-600 transition-colors">{me.name}</span>
                      <span className="text-xs font-black text-gold-600 font-sans">+{formatPrice(me.priceFactor)}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 font-light leading-relaxed">{me.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 5: RING SIZE */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in bg-white border border-neutral-200 p-6 rounded-xl shadow-xs">
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Select your US Ring Size. Standard women&apos;s sizing typically centers around size <strong className="text-neutral-700">6.0 to 7.0</strong>. We offer complimentary resizing within 60 days.
              </p>
              
              <div className="space-y-3">
                <label className="text-[10px] font-sans tracking-[0.25em] text-neutral-400 font-black uppercase block">
                  Visual Sizer Grid
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {ringSizes.map((sz) => {
                    // Approximate inner diameter calculation
                    const diameter = (14.0 + (parseFloat(sz) - 3) * 0.82).toFixed(1);
                    const isSelected = size === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSize(sz)}
                        className={`py-3.5 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer hover:border-gold-400 ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50/15 shadow-sm text-gold-600 scale-105 font-bold ring-1 ring-gold-400/20'
                            : 'border-neutral-200 bg-[#faf9f6] hover:bg-neutral-100/50 text-neutral-700'
                        }`}
                      >
                        <span className="text-xs font-sans font-bold">US {sz}</span>
                        <span className="text-[8px] text-neutral-400 mt-1 font-semibold">{diameter}mm</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gold-50/50 border border-gold/15 p-4 rounded-lg text-xs text-gold-800">
                <Info className="h-4.5 w-4.5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold uppercase tracking-wider text-[10px]">Complimentary Resizing & Sizer Kit</p>
                  <p className="mt-1 text-neutral-600 font-light leading-relaxed">Not sure of the fit? We will send a complimentary physical ring sizer kit alongside your invoice, or ship the ring at size 6.5 with free resizing instructions.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW FINAL PIECE */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-panel p-6 rounded-2xl shadow-md space-y-4 border border-gold-300/15 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300" />
                <div className="flex justify-between items-center border-b border-gold-400/25 pb-3">
                  <h3 className="font-serif text-lg text-neutral-900 font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold-500" />
                    Specification Report
                  </h3>
                  <span className="text-[8.5px] font-sans font-black tracking-widest text-gold-600 uppercase border border-gold-300/40 px-3 py-1 rounded-full bg-gold-50/40">Official Certificate Draft</span>
                </div>
                
                <table className="w-full text-xs font-sans text-neutral-600 relative z-10">
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="flex justify-between py-3.5">
                      <td className="text-neutral-400 font-medium">Category</td>
                      <td className="font-bold text-neutral-850">{category}</td>
                    </tr>
                    <tr className="flex justify-between py-3.5">
                      <td className="text-neutral-400 font-medium">Metal Alloy</td>
                      <td className="font-bold text-neutral-850">{metal}</td>
                    </tr>
                    <tr className="flex justify-between py-3.5">
                      <td className="text-neutral-400 font-medium">Setting Style</td>
                      <td className="font-bold text-neutral-850">{setting} Mount</td>
                    </tr>
                    <tr className="flex justify-between py-3.5">
                      <td className="text-neutral-400 font-medium">Center Cut Profile</td>
                      <td className="font-bold text-neutral-850">{shape} Shape</td>
                    </tr>
                    <tr className="flex justify-between py-3.5">
                      <td className="text-neutral-400 font-medium">Sizing Reference</td>
                      <td className="font-bold text-neutral-850">US Size {size} (Complimentary resizing included)</td>
                    </tr>
                  </tbody>
                </table>

                {/* Gold Foil hallmark seal SVG */}
                <svg 
                  className="absolute bottom-4 right-4 w-20 h-20 opacity-20 group-hover:opacity-75 transition-all duration-700 text-gold-500 pointer-events-none select-none z-0 rotate-12 group-hover:rotate-0"
                  viewBox="0 0 100 100" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.2"
                >
                  <defs>
                    {/* Linear gradient for text inside seal */}
                    <linearGradient id="seal-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f3ebd1" />
                      <stop offset="50%" stopColor="#c5a029" />
                      <stop offset="100%" stopColor="#a27f20" />
                    </linearGradient>
                  </defs>
                  {/* Scalloped outer border */}
                  <circle cx="50" cy="50" r="44" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="40" />
                  <circle cx="50" cy="50" r="32" strokeWidth="0.8" />
                  
                  {/* Central Diamond icon */}
                  <g transform="translate(38, 38) scale(0.5)" stroke="url(#seal-gold-grad)" strokeWidth="1.5">
                    <polygon points="24,6 36,16 24,42 12,16" />
                    <line x1="24" y1="6" x2="24" y2="42" />
                    <line x1="12" y1="16" x2="36" y2="16" />
                    <line x1="18" y1="11" x2="24" y2="16" />
                    <line x1="30" y1="11" x2="24" y2="16" />
                    <line x1="18" y1="11" x2="12" y2="16" />
                    <line x1="30" y1="11" x2="36" y2="16" />
                  </g>

                  {/* Star alignment marks */}
                  <circle cx="50" cy="19" r="1" fill="currentColor" />
                  <circle cx="50" cy="81" r="1" fill="currentColor" />
                  <circle cx="19" cy="50" r="1" fill="currentColor" />
                  <circle cx="81" cy="50" r="1" fill="currentColor" />
                  
                  {/* Concentric text on paths */}
                  <path id="seal-text-path-top" d="M 22,50 A 28,28 0 1,1 78,50" fill="none" stroke="none" />
                  <text className="text-[5px] fill-gold-600 font-sans tracking-widest font-black uppercase">
                    <textPath href="#seal-text-path-top" startOffset="50%" textAnchor="middle">
                      JD Jewel London
                    </textPath>
                  </text>
                  
                  <path id="seal-text-path-bottom" d="M 78,50 A 28,28 0 0,1 22,50" fill="none" stroke="none" />
                  <text className="text-[5px] fill-gold-600 font-sans tracking-widest font-black uppercase">
                    <textPath href="#seal-text-path-bottom" startOffset="50%" textAnchor="middle">
                      Vault Standard
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Diamond Attachment Banner (GIA report layout) */}
              {selectedDiamond ? (
                <div className="bg-gradient-to-b from-[#faf6eb]/30 to-[#fdfcfb] border border-gold-400/35 rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold-400" />
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase tracking-[0.25em] text-gold-600 font-black block">Official Grading Registry</span>
                      <h4 className="font-serif text-base font-bold text-neutral-900">{selectedDiamond.carat} Carat {selectedDiamond.shape} Cut</h4>
                    </div>
                    <span className="text-[9.5px] uppercase font-bold text-neutral-600 bg-white border border-gold-300/35 px-3 py-1 rounded-sm shadow-xs font-sans">Natural GIA</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/95 border border-gold-300/15 p-3.5 rounded-xl text-center font-sans shadow-xs">
                    <div>
                      <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider block font-medium">Color</span>
                      <span className="text-xs font-extrabold text-neutral-800 mt-0.5 block">{selectedDiamond.color} Grade</span>
                    </div>
                    <div className="border-l border-neutral-100">
                      <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider block font-medium">Clarity</span>
                      <span className="text-xs font-extrabold text-neutral-800 mt-0.5 block">{selectedDiamond.clarity}</span>
                    </div>
                    <div className="border-l border-neutral-100">
                      <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider block font-medium">Cut</span>
                      <span className="text-xs font-extrabold text-neutral-800 mt-0.5 block">{selectedDiamond.cut}</span>
                    </div>
                    <div className="border-l border-neutral-100">
                      <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider block font-medium">Cert. No</span>
                      <span className="text-[10.5px] font-bold text-gold-650 mt-0.5 block font-mono">{selectedDiamond.certificateNo}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-1">
                    <Link
                      href="/diamonds"
                      className="px-4.5 py-2.5 text-[9.5px] uppercase font-bold tracking-wider border border-gold-300/40 text-gold-700 hover:bg-gold-50/50 bg-white rounded-lg transition-all"
                    >
                      Swap Attached Stone
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-b from-[#faf6eb]/25 to-white border border-gold-350/20 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 shadow-md">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 text-gold-650 font-bold text-sm">
                      <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-gold-500" />
                      <span className="uppercase tracking-[0.2em] text-[9.5px] font-black">Center Stone Required</span>
                    </div>
                    <p className="text-[11.5px] text-neutral-500 leading-relaxed font-light font-sans">
                      Complete your customized masterpiece by pairing it with a certified natural or lab-grown diamond from our central vault.
                    </p>
                  </div>
                  <Link
                    href="/diamonds"
                    className="px-6 py-3.5 text-[9.5px] uppercase font-black tracking-widest gold-gradient text-white hover:gold-gradient-hover shadow-md rounded-lg transition-all text-center flex-shrink-0"
                  >
                    Select Diamond
                  </Link>
                </div>
              )}

              {/* CTA Purchase buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4.5 text-xs font-sans tracking-widest uppercase font-bold gold-gradient text-white hover:gold-gradient-hover shadow-lg hover:shadow-gold transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer rounded-lg"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Add Custom Creation to Bag
                </button>
                <button
                  onClick={resetConfig}
                  className="w-full text-center py-3.5 text-xs font-sans tracking-widest uppercase font-bold border border-neutral-350 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-850 transition-colors bg-white rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Design Configuration
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-gold-400/20 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-4.5 py-3 text-xs font-sans tracking-widest uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                step === 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-500 hover:text-neutral-850'
              }`}
            >
              <ChevronLeft className="h-4.5 w-4.5" /> Back
            </button>
            
            {step < 6 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 text-xs font-sans tracking-widest uppercase font-bold border border-gold-300 text-gold-700 hover:bg-gold-50/50 transition-colors flex items-center gap-1 bg-white rounded-lg cursor-pointer"
              >
                Next Step <ChevronRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-96 flex flex-col items-center justify-center text-center space-y-3">
        <span className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans font-semibold">Loading Custom Ring Builder...</p>
      </div>
    }>
      <ConfiguratorPageContent />
    </Suspense>
  );
}
