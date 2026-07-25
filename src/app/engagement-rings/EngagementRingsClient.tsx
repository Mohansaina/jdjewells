'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Sparkles, Star, ShieldCheck, ArrowRight, Award, Check, ShieldAlert } from 'lucide-react';
import TrustBadges from '@/components/TrustBadges';
import ConsultationButton from '@/components/ConsultationButton';
import SafeImage from '@/components/SafeImage';

interface EngagementRingsClientProps {
  initialProducts: any[];
}

export default function EngagementRingsClient({ initialProducts }: EngagementRingsClientProps) {
  const { addToCart } = useCart();
  const [selectedMetal, setSelectedMetal] = useState<'White Gold' | 'Yellow Gold' | 'Rose Gold' | 'Platinum'>('White Gold');

  const [currency, setCurrency] = useState('EU / EUR');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) setCurrency(savedCurrency);

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('currency') || 'EU / EUR';
      setCurrency(updated);
    };
    window.addEventListener('currency-change', handleCurrencyChange);
    return () => {
      window.removeEventListener('currency-change', handleCurrencyChange);
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

  // Multi-select filters
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);

  const handleToggleStyleFilter = (styleName: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleName) ? prev.filter(s => s !== styleName) : [...prev, styleName]
    );
  };

  const handleToggleShapeFilter = (shapeName: string) => {
    setSelectedShapes(prev => 
      prev.includes(shapeName) ? prev.filter(s => s !== shapeName) : [...prev, shapeName]
    );
  };

  const handleToggleMetalFilter = (metalName: string) => {
    setSelectedMetals(prev => 
      prev.includes(metalName) ? prev.filter(m => m !== metalName) : [...prev, metalName]
    );
    if (['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum'].includes(metalName)) {
      setSelectedMetal(metalName as 'White Gold' | 'Yellow Gold' | 'Rose Gold' | 'Platinum');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedShapes([]);
    setSelectedMetals([]);
  };

  // Helper matching functions
  const getProductStyle = (prod: any): string => {
    try {
      const specs = JSON.parse(prod.specs);
      if (specs.setting) return specs.setting.toLowerCase();
    } catch (e) {}
    const titleLower = prod.title.toLowerCase();
    if (titleLower.includes('solitaire')) return 'solitaire';
    if (titleLower.includes('halo')) return 'halo';
    if (titleLower.includes('vintage')) return 'vintage';
    if (titleLower.includes('three stone') || titleLower.includes('trilogy')) return 'three stone';
    if (titleLower.includes('pavé') || titleLower.includes('pave')) return 'pavé';
    if (titleLower.includes('cathedral')) return 'cathedral';
    if (titleLower.includes('bezel')) return 'bezel';
    if (titleLower.includes('tension')) return 'tension';
    if (titleLower.includes('split shank')) return 'split shank';
    return 'solitaire';
  };

  const getProductMetal = (prod: any): string => {
    const matLower = prod.material.toLowerCase();
    if (matLower.includes('white gold')) return 'white gold';
    if (matLower.includes('yellow gold')) return 'yellow gold';
    if (matLower.includes('rose gold')) return 'rose gold';
    if (matLower.includes('platinum')) return 'platinum';
    return 'white gold';
  };

  const getProductShape = (prod: any): string => {
    try {
      const specs = JSON.parse(prod.specs);
      if (specs.shape) return specs.shape.toLowerCase();
    } catch (e) {}
    const titleLower = prod.title.toLowerCase();
    for (const shape of ['round', 'princess', 'cushion', 'oval', 'pear', 'emerald', 'heart', 'radiant', 'marquise']) {
      if (titleLower.includes(shape)) return shape;
    }
    return 'round';
  };

  const filteredProducts = initialProducts.filter((prod) => {
    if (selectedStyles.length > 0) {
      const style = getProductStyle(prod);
      if (!selectedStyles.map(s => s.toLowerCase()).includes(style)) return false;
    }
    if (selectedMetals.length > 0) {
      const metal = getProductMetal(prod);
      if (!selectedMetals.map(m => m.toLowerCase()).includes(metal)) return false;
    }
    if (selectedShapes.length > 0) {
      const shape = getProductShape(prod);
      if (!selectedShapes.map(s => s.toLowerCase()).includes(shape)) return false;
    }
    return true;
  });

  const styleProductIds: Record<string, string> = {
    'Solitaire': 'prod-7',
    'Halo': 'prod-29',
    'Vintage': 'prod-30',
    'Three Stone': 'prod-32',
    'Pavé': 'prod-28',
    'Cathedral': 'prod-31',
    'Bezel': 'prod-7',
    'Tension': 'prod-7',
    'Split Shank': 'prod-29'
  };
  
  // Toast notifications state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto close toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Calculate pricing for settings dynamically following 3D configurator logic
  const getSettingPrice = (settingName: string, metalName: string): number => {
    let base = 800; // Standard band starting cost

    switch (settingName) {
      case 'Solitaire': base += 0; break;
      case 'Cathedral': base += 250; break;
      case 'Vintage': base += 450; break;
      case 'Pavé': base += 550; break;
      case 'Halo': base += 700; break;
      case 'Three Stone': base += 900; break;
      default: base += 0; break;
    }

    // Metal alloy purity premium
    switch (metalName) {
      case 'Yellow Gold': base += 450; break;
      case 'Rose Gold': base += 450; break;
      case 'White Gold': base += 500; break;
      case 'Platinum': base += 1100; break;
      default: base += 500; break;
    }

    return base;
  };

  // Ring styles definition
  const ringStyles = [
    {
      name: 'Solitaire',
      desc: 'The timeless classic. A single brilliant stone elevated on a four or six prong mount — the purest expression of love.',
      image: '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg',
      badge: 'Most Popular',
      configStep: 4,
      setting: 'Solitaire',
      accent: 'border-gold-300/40 bg-gradient-to-b from-[#fefcf8] to-[#f8f4ed]'
    },
    {
      name: 'Halo',
      desc: 'A shimmering halo of micro-prong set diamonds amplifies the center stone with breathtaking brilliance.',
      image: '/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg',
      badge: 'Max Brilliance',
      configStep: 4,
      setting: 'Halo',
      accent: 'border-blue-100/40 bg-gradient-to-b from-[#f8fbff] to-[#eef4fb]'
    },
    {
      name: 'Vintage',
      desc: 'Romantic milgrain detailing and intricate filigree scrollwork evoke the golden eras of classic fine jewelry.',
      image: '/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg',
      badge: 'Heritage Charm',
      configStep: 4,
      setting: 'Vintage',
      accent: 'border-amber-100/40 bg-gradient-to-b from-[#fffbf4] to-[#f9f0e0]'
    },
    {
      name: 'Three Stone',
      desc: 'A trio of brilliant stones representing your past, present, and future — a deeply symbolic and romantic choice.',
      image: '/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg',
      badge: 'Symbolic Vow',
      configStep: 4,
      setting: 'Three Stone',
      accent: 'border-rose-100/40 bg-gradient-to-b from-[#fff8f8] to-[#fceef0]'
    },
    {
      name: 'Pavé',
      desc: 'A river of micro-diamonds flows along the shoulders, creating an unbroken shimmer of pure light across the band.',
      image: '/assets/images/527517722_17866470327426391_8999031617680294241_n.jpg',
      badge: 'Modern Shimmer',
      configStep: 4,
      setting: 'Pavé',
      accent: 'border-purple-100/40 bg-gradient-to-b from-[#faf8ff] to-[#f2eeff]'
    },
    {
      name: 'Cathedral',
      desc: 'Soaring architectural arches proudly elevate the center stone for a regal, commanding silhouette.',
      image: '/assets/images/619991459_870329932295959_21626841659992945_n.jpg',
      badge: 'Stately Profile',
      configStep: 4,
      setting: 'Cathedral',
      accent: 'border-teal-100/40 bg-gradient-to-b from-[#f4fbfb] to-[#e7f4f4]'
    },
    {
      name: 'Bezel',
      desc: 'A sleek collar of metal fully wraps the stone for maximum protection — sophisticated, modern, and secure.',
      image: '/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg',
      badge: 'Modern Security',
      configStep: 4,
      setting: 'Solitaire',
      accent: 'border-slate-100/40 bg-gradient-to-b from-[#f8f9fb] to-[#eef0f5]'
    },
    {
      name: 'Tension',
      desc: 'The stone appears to float suspended in air, held only by the spring tension of the band — bold and avant-garde.',
      image: '/assets/images/619991459_870329932295959_21626841659992945_n.jpg',
      badge: 'Avant-Garde',
      configStep: 4,
      setting: 'Solitaire',
      accent: 'border-orange-100/40 bg-gradient-to-b from-[#fff9f5] to-[#fef0e4]'
    },
    {
      name: 'Split Shank',
      desc: 'The band gracefully bifurcates as it approaches the center stone, creating drama and maximum visual impact.',
      image: '/assets/images/527452581_1067293382187755_69768922388660589_n.jpg',
      badge: 'Statement Look',
      configStep: 4,
      setting: 'Halo',
      accent: 'border-green-100/40 bg-gradient-to-b from-[#f5fbf7] to-[#e9f5ed]'
    }
  ];

  // Metal configurations
  const metals = [
    { name: 'White Gold', color: 'bg-neutral-200 border-neutral-300', desc: '18k Modern Sheen', metal: 'White Gold' },
    { name: 'Yellow Gold', color: 'bg-amber-300 border-amber-400', desc: '18k Warm Heritage', metal: 'Yellow Gold' },
    { name: 'Rose Gold', color: 'bg-red-200 border-red-300', desc: '18k Romantic Blush', metal: 'Rose Gold' },
    { name: 'Platinum', color: 'bg-slate-300 border-slate-400', desc: 'Pure solid 950 Platinum', metal: 'Platinum' }
  ] as const;

  // Diamond shape shortcuts
  const shapes = [
    { name: 'Round', path: '/diamonds?shape=Round', icon: '◯' },
    { name: 'Princess', path: '/diamonds?shape=Princess', icon: '▢' },
    { name: 'Cushion', path: '/diamonds?shape=Cushion', icon: '▣' },
    { name: 'Oval', path: '/diamonds?shape=Oval', icon: '⬭' },
    { name: 'Pear', path: '/diamonds?shape=Pear', icon: '🔻' },
    { name: 'Emerald', path: '/diamonds?shape=Emerald', icon: '▬' },
    { name: 'Heart', path: '/diamonds?shape=Heart', icon: '♡' },
    { name: 'Marquise', path: '/diamonds?shape=Marquise', icon: '◇' },
  ];

  const handleAddSettingToBag = (styleName: string, settingVal: string, image: string) => {
    const price = getSettingPrice(settingVal, selectedMetal);
    addToCart({
      price: price,
      customConfig: {
        category: 'Engagement Rings',
        shape: 'Round', // default shape
        setting: styleName, // use styleName ('Bezel', 'Tension', etc.) for shopping drawer representation
        metal: selectedMetal,
        size: '6.5',
        price: price
      },
      productTitle: `${selectedMetal} ${styleName} Engagement Ring Setting Only`,
      productImage: image
    });
    
    setToastMessage(`${selectedMetal} ${styleName} Setting added to your shopping bag!`);
    setShowToast(true);
    
    // Automatically trigger cart drawer opening
    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

  const handleAddProductToBag = (prod: any) => {
    addToCart({
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.image,
      price: prod.price,
      diamondSpec: `${prod.material} • Standard Size 6.5`
    });

    setToastMessage(`${prod.title} added to your shopping bag!`);
    setShowToast(true);

    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

  return (
    <div className="space-y-0 pb-20 relative">
      
      {/* === HERO BANNER === */}
      <div className="relative w-full h-[55vh] min-h-[340px] bg-neutral-950 overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-luminosity"
          style={{ backgroundImage: "url('/assets/images/engagement_rings_banner.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 space-y-5 text-left">
          <span className="text-[10px] tracking-[0.5em] text-gold-300 uppercase block font-bold">
            The Lifelong Vow
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-widest uppercase font-light leading-tight">
            Engagement<br className="hidden sm:inline" /> Rings
          </h1>
          <p className="text-neutral-300 font-sans text-sm sm:text-base tracking-wide font-light leading-relaxed max-w-lg">
            Solitaire, halo, vintage, and pavé settings in 18k gold and platinum. 
            Hand-crafted to celebrate your forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/configurator?category=Engagement%20Rings&step=3"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:opacity-90 shadow-lg transition-all"
            >
              <Sparkles className="h-4 w-4" /> Design Your Ring
            </Link>
            <Link
              href="/diamonds"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold border border-white/30 text-white hover:border-gold-300 hover:text-gold-300 transition-all"
            >
              Browse Diamonds <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-8 sm:gap-16 py-4 bg-black/40 backdrop-blur-sm border-t border-gold/10">
          {[
            { num: '9+', label: 'Setting Styles' },
            { num: '4', label: 'Metal Options' },
            { num: '8', label: 'Stone Shapes' },
            { num: '∞', label: 'Combinations' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-serif text-xl text-gold-300 font-light block">{s.num}</span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === TRUST BADGES === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TrustBadges />
      </div>

      {/* === ACTIVE METAL SELECTOR (STICKY PREVIEW OPTION) === */}
      <div className="bg-[#fcfbf9] border-y border-gold/10 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Viewing Prices In</span>
            <span className="text-xs font-serif text-neutral-800 font-medium">18k Solid {selectedMetal} Alloy</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {(['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum'] as const).map((metal) => {
              const isSelected = selectedMetals.includes(metal);
              return (
                <button
                  key={metal}
                  onClick={() => handleToggleMetalFilter(metal)}
                  className={`px-4 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500/10 text-gold-700 font-extrabold shadow-xs'
                      : 'border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50/50'
                  }`}
                >
                  {metal} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* === RING STYLES GRID === */}
      <section id="select-setting-solitaire" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold-600 font-bold block">Choose Your Style</span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-900">
            Shop By Setting Style
          </h2>
          <p className="text-neutral-500 font-sans text-xs tracking-wider font-light leading-relaxed">
            Each setting style is designed by our master jewelers to complement specific stone shapes and sizes. 
            Select an option below to purchase the setting directly or start customizing in our 3D builder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ringStyles.map((style) => {
            const displayMetal = selectedMetals.length > 0 ? selectedMetals[0] : selectedMetal;
            const currentSettingPrice = getSettingPrice(style.setting, displayMetal);
            const isSelected = selectedStyles.includes(style.name);
            return (
              <div
                key={style.name}
                className={`group border-2 ${
                  isSelected
                    ? 'border-gold-500 ring-2 ring-gold-500/10 shadow-lg'
                    : 'border-gold-200/40'
                } ${style.accent} flex flex-col hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Toggle Checkbox Badge */}
                <button
                  onClick={() => handleToggleStyleFilter(style.name)}
                  className={`absolute top-4 left-4 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gold-500 border-gold-500 text-white'
                      : 'bg-white/80 border-neutral-300 text-transparent hover:border-gold-500'
                  }`}
                  title={isSelected ? "Remove filter" : "Filter by this style"}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </button>

                {/* Badge */}
                <span className="absolute top-4 right-4 z-10 text-[8px] font-sans font-extrabold uppercase tracking-wider border border-gold/30 px-2.5 py-0.5 rounded-full bg-white/80 text-gold-700 backdrop-blur-sm">
                  {style.badge}
                </span>

                {/* Image Area */}
                <Link
                  href={`/products/${styleProductIds[style.name] || 'prod-7'}`}
                  className="aspect-[4/3] p-6 flex items-center justify-center overflow-hidden cursor-pointer"
                  id={`image-link-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <SafeImage
                    src={style.image}
                    alt={style.name}
                    className="max-w-[80%] max-h-[180px] object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg"
                  />
                </Link>

                {/* Content */}
                <div className="p-5 bg-white flex-1 flex flex-col justify-between space-y-4 border-t border-gold/10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-serif text-lg text-neutral-900 font-medium">
                        <Link
                          href={`/products/${styleProductIds[style.name] || 'prod-7'}`}
                          className="group-hover:text-gold-600 transition-colors cursor-pointer"
                          id={`title-link-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {style.name} Setting
                        </Link>
                      </h3>
                      <span className="text-sm font-extrabold text-neutral-800 font-sans tracking-wide">
                        {formatPrice(currentSettingPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-sans font-light leading-relaxed">
                      {style.desc}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-gold/5">
                    <button
                      onClick={() => handleAddSettingToBag(style.name, style.setting, style.image)}
                      className="w-full py-2.5 text-[9px] uppercase tracking-widest font-bold gold-gradient text-white text-center hover:opacity-95 transition-opacity"
                      id={`add-setting-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      Add Setting to Bag
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/configurator?category=Engagement%20Rings&setting=${encodeURIComponent(style.setting)}&metal=${encodeURIComponent(selectedMetal)}&step=4`}
                        className="py-2 text-[9px] uppercase tracking-widest font-semibold border border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-100 text-center transition-colors"
                        id={`customize-setting-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        Customize
                      </Link>
                      <Link
                        href={`/diamonds?shape=Round`}
                        className="py-2 text-[9px] uppercase tracking-widest font-semibold border border-gold-300 text-gold-700 bg-white hover:bg-gold-50/40 text-center transition-colors"
                        id={`pair-stone-${style.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        Pair a Stone
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === SHOP BY DIAMOND SHAPE === */}
      <section className="bg-[#f8f5f0] py-16 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] uppercase tracking-[0.35em] text-gold-600 font-bold block">GIA Certified Stones</span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-900">
              Shop By Stone Shape
            </h2>
            <p className="text-neutral-500 font-sans text-xs tracking-wider font-light">
              Browse our certified diamond inventory by shape to find your perfect center stone.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {shapes.map((shape) => {
              const isSelected = selectedShapes.includes(shape.name);
              return (
                <button
                  key={shape.name}
                  onClick={() => handleToggleShapeFilter(shape.name)}
                  id={`shape-${shape.name.toLowerCase()}`}
                  className={`group p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 aspect-square border cursor-pointer ${
                    isSelected
                      ? 'bg-gold-50/20 border-gold-500 shadow-md ring-1 ring-gold-500/20'
                      : 'bg-white border-gold/15 hover:border-gold-400 hover:shadow-md'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{shape.icon}</span>
                  <span className={`text-[9px] uppercase font-bold tracking-wider group-hover:text-gold-600 transition-colors text-center leading-tight ${
                    isSelected ? 'text-gold-600' : 'text-neutral-700'
                  }`}>{shape.name}</span>
                  {isSelected && <span className="text-[8px] text-gold-500 font-semibold uppercase tracking-widest mt-0.5">Selected</span>}
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/diamonds"
              className="inline-flex items-center gap-2 px-8 py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors"
            >
              View All Certified Diamonds <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* === READY-TO-SHIP PRODUCTS === */}
      {initialProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gold/15 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block">Curated Creations</span>
              <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-900">
                Matching Engagement Rings
              </h2>
            </div>
            {/* Clear filters shortcut */}
            {(selectedStyles.length > 0 || selectedMetals.length > 0 || selectedShapes.length > 0) && (
              <button
                onClick={handleClearAllFilters}
                className="text-[10px] uppercase font-sans tracking-widest text-red-500 hover:text-red-650 transition-colors font-bold cursor-pointer"
              >
                Clear All Filters ({(selectedStyles.length + selectedMetals.length + selectedShapes.length)})
              </button>
            )}
          </div>

          {/* Active filter pills row */}
          {(selectedStyles.length > 0 || selectedMetals.length > 0 || selectedShapes.length > 0) && (
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-[10px] uppercase font-sans font-bold text-neutral-400 tracking-wider mr-1">Active Filters:</span>
              
              {selectedStyles.map((style) => (
                <span key={style} className="inline-flex items-center gap-1 bg-gold-50 border border-gold-300 text-gold-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                  Style: {style}
                  <button onClick={() => handleToggleStyleFilter(style)} className="hover:text-red-500 ml-1 font-bold">×</button>
                </span>
              ))}

              {selectedMetals.map((metal) => (
                <span key={metal} className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-neutral-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                  Metal: {metal}
                  <button onClick={() => handleToggleMetalFilter(metal)} className="hover:text-red-500 ml-1 font-bold">×</button>
                </span>
              ))}

              {selectedShapes.map((shape) => (
                <span key={shape} className="inline-flex items-center gap-1 bg-sky-50 border border-sky-300 text-sky-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                  Shape: {shape}
                  <button onClick={() => handleToggleShapeFilter(shape)} className="hover:text-red-500 ml-1 font-bold">×</button>
                </span>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="border border-dashed border-gold-300/40 p-12 text-center space-y-4 rounded-xl bg-gold-50/10">
              <ShieldAlert className="h-10 w-10 text-gold-500/80 mx-auto stroke-[1.2]" />
              <div>
                <p className="font-serif text-lg text-neutral-800 tracking-wide">No Perfect Match Found</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">We don&apos;t have pre-crafted rings matching this exact combination in stock. Click below to customize this combination in our 3D builder or consult our designers.</p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleClearAllFilters}
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
                <Link
                  href="/configurator"
                  className="px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase font-semibold gold-gradient text-white shadow-md transition-all cursor-pointer"
                >
                  Start Custom Build
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => {
                let styleName = 'Solitaire';
                try {
                  const sp = JSON.parse(prod.specs);
                  if (sp.setting) styleName = sp.setting;
                } catch (e) {}

                return (
                  <div
                    key={prod.id}
                    className="group flex flex-col bg-[#fcfbf9] border border-gold/15 shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/products/${prod.id}`} className="aspect-square bg-gradient-to-b from-[#faf9f6] to-[#f2efea] border-b border-gold/10 p-8 flex items-center justify-center overflow-hidden relative">
                      <SafeImage
                        src={prod.image}
                        alt={prod.title}
                        className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md"
                      />
                      <span className="absolute top-4 right-4 bg-white/70 backdrop-blur-xs border border-gold/25 p-1.5 rounded-full text-gold-600">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block">
                          {prod.material}
                        </span>
                        <Link href={`/products/${prod.id}`} className="font-serif text-base text-neutral-900 group-hover:text-gold-600 transition-colors font-medium block">
                          {prod.title}
                        </Link>
                        <div className="flex items-center gap-1 pt-1 text-xs text-neutral-500">
                          <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                          <span className="font-semibold text-neutral-800">{prod.rating}</span>
                          <span>({prod.reviewsCount || 0} reviews)</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-3 border-t border-gold/5 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-extrabold text-neutral-800">{formatPrice(prod.price)}</span>
                        </div>
                        
                        <button
                          onClick={() => handleAddProductToBag(prod)}
                          className="w-full py-2.5 text-[9px] uppercase tracking-widest font-bold gold-gradient text-white text-center hover:opacity-95 transition-opacity cursor-pointer"
                          id={`add-product-bag-${prod.id}`}
                        >
                          Add to Bag
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/configurator?category=Engagement%20Rings&setting=${styleName}&metal=${encodeURIComponent(prod.material)}&step=4`}
                            className="py-2 text-[9px] uppercase tracking-widest font-bold bg-[#faf8f5] border border-gold/20 text-gold-700 hover:bg-gold-50/20 text-center"
                            id={`customize-${prod.id}`}
                          >
                            Customize
                          </Link>
                          <Link
                            href={`/products/${prod.id}`}
                            className="py-2 text-[9px] uppercase tracking-widest font-bold border border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-100 text-center"
                            id={`details-${prod.id}`}
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* === METAL SELECTOR === */}
      <section className="bg-neutral-950 text-white py-16 border-y border-gold/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20vw] leading-none text-neutral-800/10 tracking-[0.2em] font-bold select-none z-0">
          GOLD
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] uppercase tracking-[0.35em] text-gold-400 font-bold block">Precious Alloys</span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-100">
              Select Your Metal
            </h2>
            <p className="text-neutral-400 font-sans text-xs tracking-wider font-light">
              All metals are individually hallmarked and polished to a luxury mirror finish. Click to change pricing display options on this page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metals.map((m) => {
              const isSelected = selectedMetals.includes(m.name);
              return (
                <button
                  key={m.name}
                  onClick={() => {
                    handleToggleMetalFilter(m.name);
                    // Scroll style catalog into view
                    const catalogSection = document.getElementById('select-setting-solitaire');
                    if (catalogSection) {
                      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  id={`metal-${m.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`border bg-neutral-900/60 backdrop-blur-sm p-6 text-center flex flex-col items-center justify-between hover:bg-neutral-800/60 transition-all duration-300 group w-full cursor-pointer ${
                    isSelected ? 'border-gold-500 shadow-md ring-1 ring-gold-500/30' : 'border-gold/15'
                  }`}
                >
                  <span className={`w-16 h-16 rounded-full border shadow-inner ${m.color} flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300`}>
                    <span className="w-full h-full rounded-full border border-white/30 bg-black/5" />
                  </span>
                  <div className="mt-4 space-y-1">
                    <span className="text-xs uppercase font-bold tracking-wider text-neutral-100 block group-hover:text-gold-400 transition-colors">{m.name}</span>
                    <span className="text-[9px] text-neutral-400 font-medium block">{m.desc}</span>
                  </div>
                  <span className="mt-4 flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-neutral-500 group-hover:text-gold-400 transition-colors">
                    {isSelected ? 'Active Filter' : 'Select Alloy'} <Check className={`h-3 w-3 ${isSelected ? 'text-gold-400 opacity-100' : 'opacity-0'}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold-600 font-bold block">Simple 3-Step Journey</span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-900">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Choose Your Setting',
              desc: 'Select from 9 setting styles and your preferred precious metal from our curated collection.',
              href: '/configurator?category=Engagement%20Rings&step=3',
              cta: 'Choose Setting',
              id: 'how-step-1'
            },
            {
              step: '02',
              title: 'Select Your Stone',
              desc: 'Filter through 10,000+ GIA certified natural and lab diamonds by carat, cut, color, and clarity.',
              href: '/diamonds',
              cta: 'Browse Diamonds',
              id: 'how-step-2'
            },
            {
              step: '03',
              title: 'Review & Complete',
              desc: 'Inspect your assembled ring live, confirm sizing with our free ring sizer, and check out with secure payment.',
              href: '/configurator?category=Engagement%20Rings&step=6',
              cta: 'Open Configurator',
              id: 'how-step-3'
            }
          ].map((item) => (
            <div key={item.step} className="border border-gold/15 bg-[#fcfbf9] p-8 flex flex-col justify-between space-y-5 hover:shadow-lg transition-all duration-300 group">
              <div className="space-y-3">
                <span className="text-3xl font-serif text-gold-400 font-light">{item.step}</span>
                <h4 className="font-serif text-lg uppercase tracking-wider text-neutral-900 group-hover:text-gold-600 transition-colors">{item.title}</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.desc}</p>
              </div>
              <Link
                href={item.href}
                id={item.id}
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-gold-600 hover:text-gold-500 transition-colors mt-2"
              >
                {item.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* === CONSULTATION CTA === */}
      <section className="bg-gradient-to-br from-[#1a1206] via-[#231808] to-[#1a1206] text-white py-20 border-y border-gold/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/assets/images/engagement_rings_banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="text-[9px] tracking-widest text-gold-400 font-bold uppercase block">
            Showroom & Virtual Booking
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-100">
            Consult Our Design Atelier
          </h2>
          <p className="text-xs sm:text-sm font-sans tracking-wider leading-relaxed max-w-xl mx-auto text-neutral-400 font-light">
            Our GIA gemologists guide you through every detail — from loose diamond grading reports to bespoke mount designs. 
            Schedule a virtual video consultation or an in-person showroom visit in London.
          </p>
          <div className="pt-2 flex justify-center">
            <ConsultationButton />
          </div>
        </div>
      </section>

      {/* === WHY US === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: '100% Insured Transit', desc: 'Every shipment is fully registered and insured with FedEx overnight express and requires adult signature.' },
            { icon: Award, title: 'GIA Certified Stones', desc: 'Every loose diamond supplied carries an individual GIA grading report verifiable on the GIA registry.' },
            { icon: Sparkles, title: 'Lifetime Bench Warranty', desc: 'Free stone tightening, polishing, and annual bench inspections for the life of your ring. Forever.' }
          ].map((item) => (
            <div key={item.title} className="border border-gold/20 bg-[#fcfbf9] p-6 flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow">
              <item.icon className="h-8 w-8 text-gold-500 stroke-[1.2]" />
              <h4 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-semibold">{item.title}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Toast Success notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#121212] text-white border border-gold-500/40 px-6 py-4 shadow-2xl flex items-center gap-3 animate-fade-in font-sans rounded-xs">
          <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <div className="text-xs tracking-wider uppercase font-medium">{toastMessage}</div>
        </div>
      )}

    </div>
  );
}
