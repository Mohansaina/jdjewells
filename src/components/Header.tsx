'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, ChevronDown, Sparkles, AlertCircle, Calendar, Phone, Globe, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useConfigurator, DiamondShape, SettingStyle, MetalType, JewelryCategory } from '@/context/ConfiguratorContext';
import { useToast } from '@/context/ToastContext';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';
import InternationalPopup from '@/components/InternationalPopup';

function HeaderContent() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { resetConfig, setCategory, setShape, setSetting, setMetal, setStep } = useConfigurator();
  const { warning } = useToast();
  
  const headerRef = React.useRef<HTMLDivElement>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Active mega menu state
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const closeAllMenusImmediately = () => {
    setActiveMegaMenu(null);
  };
  
  // Currency States
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState('EU / EUR');

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

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingType, setBookingType] = useState('Showroom Visit');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get('category')?.toLowerCase() : null;

  React.useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrency(saved);

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('currency');
      if (updated) setCurrency(updated);
    };

    const handleOpenBooking = () => setIsBookingModalOpen(true);
    const handleOpenCart = () => setIsCartOpen(true);
    
    window.addEventListener('currency-change', handleCurrencyChange);
    window.addEventListener('open-booking-modal', handleOpenBooking);
    window.addEventListener('open-cart-drawer', handleOpenCart);

    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('currency-change', handleCurrencyChange);
      window.removeEventListener('open-booking-modal', handleOpenBooking);
      window.removeEventListener('open-cart-drawer', handleOpenCart);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on successful page/query transitions
  React.useEffect(() => {
    closeAllMenusImmediately();
  }, [pathname, searchParams]);

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfiguratorNav = (options: {
    category?: JewelryCategory;
    shape?: DiamondShape;
    setting?: SettingStyle;
    metal?: MetalType;
    step?: number;
  }) => {
    resetConfig();
    if (options.category) setCategory(options.category);
    if (options.shape) setShape(options.shape);
    if (options.setting) setSetting(options.setting);
    if (options.metal) setMetal(options.metal);
    if (options.step) setStep(options.step);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDate) {
      warning("Please fill in all required fields.");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      // Auto close modal after successful booking
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
      // Reset form
      setBookingName('');
      setBookingEmail('');
      setBookingDate('');
    }, 4000);
  };

  // Navigation tab highlights based on path and query parameters
  const isEngagementActive = pathname.startsWith('/engagement-rings') || (pathname === '/products' && categoryParam === 'engagement rings');
  const isWeddingActive = pathname === '/products' && categoryParam === 'wedding bands';
  const isEternityActive = pathname === '/products' && categoryParam === 'rings';
  const isGemstonesActive = pathname === '/products' && categoryParam === 'custom';
  const isDiamondsActive = pathname.startsWith('/diamonds');
  const isBespokeActive = pathname === '/configurator';

  const isJewelleryActive = pathname === '/products' && 
    categoryParam !== 'wedding bands' && 
    categoryParam !== 'rings' && 
    categoryParam !== 'engagement rings' && 
    categoryParam !== 'custom';

  return (
    <>
      {/* Top Banner Utility & Trust Bar */}
      <div className="w-full bg-[#121212] text-[#e7d3a2] text-[10px] sm:text-[11px] py-2 px-4 border-b border-gold/20 z-50 relative font-sans tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-gold-300">🚚</span>
            <span>Free Insured Next Day Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-emerald-400 font-bold">★ ★ ★ ★ ★</span>
            <span>Excellent 4.9/5 Trustpilot Rating</span>
          </div>
        </div>
      </div>

      <header ref={headerRef} className="sticky top-0 z-40 bg-[#fcfbf9]/80 backdrop-blur-xl border-b border-gold-400/20 transition-all duration-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* DESKTOP TWO-ROW HEADER LAYOUT */}
          <div className="hidden lg:flex flex-col">
            
            {/* ROW 1: Logo & Actions */}
            <div className="relative flex justify-between items-center py-5 border-b border-gold/5">
              
              {/* Left Side: Currency & Help */}
              <div className="flex items-center space-x-6">
                
                {/* Currency dropdown selector */}
                <div className="relative">
                  <button 
                    onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                    className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold text-neutral-600 hover:text-gold-600 transition-colors uppercase"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    {currency}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isCurrencyDropdownOpen && (
                    <div className="absolute left-0 mt-2.5 w-36 bg-[#fcfbf9] border border-gold/20 shadow-xl py-1.5 z-50 text-[10px] tracking-widest font-sans font-medium uppercase">
                      {['AE / AED', 'GB / GBP', 'US / USD', 'EU / EUR', 'IN / INR'].map((cur) => (
                        <button
                          key={cur}
                          onClick={() => {
                            setCurrency(cur);
                            localStorage.setItem('currency', cur);
                            window.dispatchEvent(new Event('currency-change'));
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gold-50 hover:text-gold-600 transition-colors flex justify-between items-center"
                        >
                          {cur}
                          {currency === cur && <Check className="h-3 w-3 text-gold-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Need Help link */}
                <a 
                  href="tel:+447494554171" 
                  className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold text-neutral-600 hover:text-gold-600 transition-colors uppercase"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Need Help?
                </a>
              </div>

              {/* Center Brand Logo Monogram */}
              <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center group">
                  <img 
                    src="/assets/images/logo.png" 
                    alt="J&D Jewellers London Monogram" 
                    className="h-8 w-auto object-contain mb-1.5 mt-0.5 filter drop-shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <span className="font-serif text-2xl tracking-[0.22em] font-light text-neutral-900 group-hover:text-gold-600 transition-colors leading-tight">
                    J&D JEWELLERS
                  </span>
                  <span className="text-[8px] font-sans tracking-[0.6em] text-neutral-400 group-hover:text-gold-500 transition-colors mt-1.5 uppercase font-medium">
                    LONDON
                  </span>
                </Link>
              </div>

              {/* Right Side: Appointment Booking & Icons */}
              <div className="flex items-center space-x-6">
                
                {/* Search Bar Input Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
                    if (target?.value.trim()) {
                      router.push(`/products?search=${encodeURIComponent(target.value.trim())}`);
                    }
                  }}
                  className="relative hidden xl:flex items-center"
                >
                  <input
                    type="text"
                    name="search"
                    placeholder="Search Fine Jewelry..."
                    className="border border-gold/15 bg-[#fafbf9]/50 rounded-full py-1 pl-3 pr-8 text-[9px] font-sans tracking-wider w-40 focus:outline-none focus:border-gold-500 transition-all placeholder-neutral-400"
                  />
                  <button type="submit" className="absolute right-2 text-neutral-400 hover:text-gold-600 transition-colors">
                    <svg className="h-3 w-3 stroke-[1.8]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </form>

                {/* Book Appointment button */}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold text-neutral-600 hover:text-gold-600 transition-colors uppercase"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Book an Appointment
                </button>

                {/* Account / User */}
                <Link 
                  href="/profile"
                  className="text-neutral-700 hover:text-gold-500 transition-colors p-1"
                  title="Account"
                >
                  <User className="h-4.5 w-4.5" />
                </Link>

                {/* Wishlist */}
                <Link 
                  href="/profile?tab=wishlist" 
                  className="text-neutral-700 hover:text-gold-500 transition-colors p-1 relative"
                  title="Wishlist"
                >
                  <Heart className="h-4.5 w-4.5" />
                </Link>

                {/* Cart Bag */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-neutral-700 hover:text-gold-500 transition-colors p-1 relative"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[8px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border border-[#fcfbf9]">
                      {totalItemsCount}
                    </span>
                  )}
                </button>
              </div>

            </div>

            {/* ROW 2: Horizontal centered menu links */}
            <nav className="flex justify-center space-x-8 text-[11px] font-sans font-semibold tracking-widest uppercase py-4 relative">

              {/* === NAV ITEMS === */}

              {/* Engagement Rings */}
              <div className="relative">
                <Link
                  href="/engagement-rings"
                  onClick={(e) => {
                    if (activeMegaMenu !== 'engagement') {
                      e.preventDefault();
                      setActiveMegaMenu('engagement');
                    }
                  }}
                  className={`hover:text-gold-500 transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isEngagementActive || activeMegaMenu === 'engagement'
                      ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5'
                      : 'text-neutral-700'
                  }`}
                >
                  Engagement Rings <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMegaMenu === 'engagement' ? 'rotate-180 text-gold-600' : 'opacity-50'}`} />
                </Link>

                {/* MEGA MENU: ENGAGEMENT RINGS — fixed full-width below header */}
                {activeMegaMenu === 'engagement' && (
                  <div
                    className="fixed left-0 right-0 z-[200] glass-panel border-t border-b border-gold-500/20 shadow-2xl py-8 px-6 animate-menu-slide-down"
                    style={{ top: '130px' }}
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10">

                      {/* COL 1: CREATE YOUR OWN */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Create Your Own</h3>
                        <div className="flex flex-col space-y-2">
                          {[
                            {
                              label: 'Start With A Diamond Setting',
                              href: '/configurator?category=Engagement Rings&step=3',
                              action: () => handleConfiguratorNav({ category: 'Engagement Rings', step: 3 }),
                              icon: (
                                <svg className="w-4.5 h-4.5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="12" cy="14" r="6" />
                                  <path d="M12 8V5M10 5h4" strokeWidth="1.5" />
                                  <polygon points="12,3 15,5 12,7 9,5" fill="none" strokeWidth="1" />
                                </svg>
                              )
                            },
                            {
                              label: 'Start With A Gemstone',
                              href: '/configurator?category=Engagement Rings&stoneType=gemstone&step=3',
                              action: () => handleConfiguratorNav({ category: 'Engagement Rings', step: 3 }),
                              icon: (
                                <svg className="w-4.5 h-4.5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="12" cy="14" r="6" />
                                  <path d="M12 8V5M10 5h4" strokeWidth="1.5" />
                                  <circle cx="12" cy="5" r="2.5" fill="none" strokeWidth="1" />
                                </svg>
                              )
                            },
                            {
                              label: 'Start With A Diamond',
                              href: '/diamonds?lab=Natural',
                              action: () => closeAllMenusImmediately(),
                              icon: (
                                <svg className="w-4.5 h-4.5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polygon points="12,3 18,8 12,21 6,8" />
                                  <line x1="6" y1="8" x2="18" y2="8" />
                                  <line x1="12" y1="3" x2="12" y2="21" />
                                  <line x1="9" y1="8" x2="12" y2="3" />
                                  <line x1="15" y1="8" x2="12" y2="3" />
                                </svg>
                              )
                            },
                            {
                              label: 'Start With A Coloured Diamond',
                              href: '/diamonds?lab=Coloured',
                              action: () => closeAllMenusImmediately(),
                              icon: (
                                <svg className="w-4.5 h-4.5 text-amber-500 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polygon points="12,3 18,8 12,21 6,8" fill="rgba(245, 158, 11, 0.2)" />
                                  <line x1="6" y1="8" x2="18" y2="8" />
                                  <line x1="12" y1="3" x2="12" y2="21" />
                                  <line x1="9" y1="8" x2="12" y2="3" />
                                  <line x1="15" y1="8" x2="12" y2="3" />
                                </svg>
                              )
                            },
                            {
                              label: 'Start With A Loose Gemstone',
                              href: '/diamonds?lab=Gemstones',
                              action: () => closeAllMenusImmediately(),
                              icon: (
                                <svg className="w-4.5 h-4.5 text-sky-500 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <polygon points="12,3 19,9 12,21 5,9" fill="rgba(14, 165, 233, 0.25)" />
                                  <line x1="5" y1="9" x2="19" y2="9" />
                                  <line x1="12" y1="3" x2="12" y2="21" />
                                </svg>
                              )
                            }
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={item.action}
                              className="flex items-center gap-3 group text-left w-full py-1"
                            >
                              <div className="w-7.5 h-7.5 bg-gold-50/50 border border-gold/15 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-gold-100/50 transition-colors">
                                {item.icon}
                              </div>
                              <span className="text-[11px] font-semibold tracking-wide text-neutral-750 group-hover:text-gold-600 transition-colors">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 2: SHOP BY SHAPE */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Shop By Shape</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {['Round','Princess','Cushion','Oval','Pear','Emerald','Heart','Radiant','Marquise'].map((shape) => (
                            <Link
                              key={shape}
                              href={`/diamonds?shape=${shape}`}
                              onClick={closeAllMenusImmediately}
                              className="flex items-center gap-2.5 py-1 px-1.5 rounded-lg hover:bg-gold-50/40 text-neutral-700 transition-all text-left group w-full"
                            >
                              <div className="w-7 h-7 bg-white border border-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-gold-300 transition-colors">
                                <DiamondShapeSvg
                                  shape={shape as any}
                                  className="w-[70%] h-[70%] text-gold-500/80 stroke-[0.8]"
                                />
                              </div>
                              <span className="text-[11px] font-semibold tracking-wide group-hover:text-gold-600 transition-colors">{shape}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 3: SHOP BY STYLE */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Shop By Style</h3>
                        <div className="flex flex-col space-y-2">
                          {[
                            {
                              name: 'Solitaire',
                              href: '/products?category=engagement rings',
                              icon: (
                                <svg className="w-6 h-6 text-neutral-600 group-hover:text-gold-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                  <circle cx="12" cy="14" r="5" />
                                  <polygon points="12,6 14,8 12,10 10,8" />
                                </svg>
                              )
                            },
                            {
                              name: 'Vintage',
                              href: '/products?category=engagement rings',
                              icon: (
                                <svg className="w-6 h-6 text-neutral-600 group-hover:text-gold-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                  <circle cx="12" cy="14" r="5" />
                                  <path d="M8 14a4 4 0 0 1 8 0" strokeDasharray="1 1" />
                                  <circle cx="12" cy="8" r="1.5" />
                                </svg>
                              )
                            },
                            {
                              name: 'Halo',
                              href: '/products?category=engagement rings',
                              icon: (
                                <svg className="w-6 h-6 text-neutral-600 group-hover:text-gold-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                  <circle cx="12" cy="14" r="5" />
                                  <circle cx="12" cy="8" r="2" />
                                  <circle cx="12" cy="8" r="3.5" strokeDasharray="1 1.5" />
                                </svg>
                              )
                            },
                            {
                              name: 'Diamond Band',
                              href: '/products?category=engagement rings',
                              icon: (
                                <svg className="w-6 h-6 text-neutral-600 group-hover:text-gold-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                  <circle cx="12" cy="14" r="5" />
                                  <circle cx="9" cy="11" r="0.8" fill="currentColor" />
                                  <circle cx="10.5" cy="10" r="0.8" fill="currentColor" />
                                  <circle cx="12" cy="9" r="0.8" fill="currentColor" />
                                  <circle cx="13.5" cy="10" r="0.8" fill="currentColor" />
                                  <circle cx="15" cy="11" r="0.8" fill="currentColor" />
                                </svg>
                              )
                            },
                            {
                              name: 'Trilogy',
                              href: '/products?category=engagement rings',
                              icon: (
                                <svg className="w-6 h-6 text-neutral-600 group-hover:text-gold-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                  <circle cx="12" cy="14" r="5" />
                                  <circle cx="12" cy="8" r="1.8" />
                                  <circle cx="8.5" cy="9.5" r="1.2" />
                                  <circle cx="15.5" cy="9.5" r="1.2" />
                                </svg>
                              )
                            }
                          ].map((st) => (
                            <Link
                              key={st.name}
                              href={st.href}
                              onClick={closeAllMenusImmediately}
                              className="flex items-center gap-3 py-1 px-1.5 rounded-lg hover:bg-gold-50/40 text-left group transition-all"
                            >
                              <div className="w-8 h-8 bg-white border border-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-gold-300 transition-colors">
                                {st.icon}
                              </div>
                              <span className="text-[11px] font-semibold tracking-wide text-neutral-700 group-hover:text-gold-600 transition-colors">{st.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 4: SHOP BY METAL */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Shop By Metal</h3>
                        <div className="flex flex-col space-y-2.5">
                          {[
                            { name: 'White Gold', metal: 'White Gold' as const, color: 'bg-neutral-100 border-neutral-250' },
                            { name: 'Yellow Gold', metal: 'Yellow Gold' as const, color: 'bg-amber-100 border-amber-250' },
                            { name: 'Platinum', metal: 'Platinum' as const, color: 'bg-slate-100 border-slate-250' },
                          ].map((m) => (
                            <Link
                              key={m.name}
                              href={`/configurator?category=Engagement Rings&metal=${m.metal}&step=5`}
                              onClick={() => handleConfiguratorNav({ category: 'Engagement Rings', metal: m.metal, step: 5 })}
                              className="flex items-center gap-3.5 py-1.5 px-2 rounded-lg hover:bg-gold-50/40 group transition-all text-left"
                            >
                              <span className={`w-4 h-4 rounded-full border shadow-inner ${m.color} flex-shrink-0`} />
                              <div>
                                <p className="text-[11px] font-bold text-neutral-850 group-hover:text-gold-600 transition-colors">{m.name}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="bg-gold-50/40 border border-gold/15 p-3.5 rounded-xl space-y-1 mt-2">
                          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold-600 block">London Vault Standards</span>
                          <p className="text-[10px] text-neutral-500 font-normal normal-case leading-relaxed">100% recycled precious alloys, individually hallmarked and mirror-polished.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Wedding Rings */}
              <div className="relative">
                <Link
                  href="/products?category=wedding bands"
                  onClick={(e) => {
                    if (activeMegaMenu !== 'wedding') {
                      e.preventDefault();
                      setActiveMegaMenu('wedding');
                    }
                  }}
                  className={`hover:text-gold-500 transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isWeddingActive || activeMegaMenu === 'wedding'
                      ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5'
                      : 'text-neutral-700'
                  }`}
                >
                  Wedding Rings <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMegaMenu === 'wedding' ? 'rotate-180 text-gold-600' : 'opacity-50'}`} />
                </Link>

                {activeMegaMenu === 'wedding' && (
                  <div
                    className="fixed left-0 right-0 z-[200] glass-panel border-t border-b border-gold-500/20 shadow-2xl py-8 px-6 animate-menu-slide-down"
                    style={{ top: '130px' }}
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10">

                      {/* COL 1: BAND STYLES */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Band Styles</h3>
                        <div className="flex flex-col space-y-1.5">
                          {[
                            { name: 'Classic Court Band', desc: 'Rounded comfort-fit, the traditional choice', href: '/products?category=wedding bands' },
                            { name: 'Diamond-Set Band', desc: 'Pavé or channel-set brilliance across the band', href: '/configurator?category=Wedding Bands&setting=Pavé&step=4' },
                            { name: 'Flat Profile Band', desc: 'Contemporary clean linear edges', href: '/products?category=wedding bands' },
                            { name: 'Twisted / Rope Band', desc: 'Two strands beautifully intertwined', href: '/products?category=wedding bands' },
                            { name: 'Milgrain Vintage', desc: 'Antique-inspired beaded edge detailing', href: '/configurator?category=Wedding Bands&setting=Vintage&step=4' },
                            { name: 'Two-Tone Band', desc: 'Contrasting platinum & yellow gold fusion', href: '/products?category=wedding bands' },
                          ].map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={closeAllMenusImmediately}
                              className="flex flex-col py-2 px-2.5 rounded-lg hover:bg-gold-50/40 text-left group transition-all"
                            >
                              <span className="text-[11px] font-bold tracking-wide text-neutral-800 group-hover:text-gold-600 transition-colors">{item.name}</span>
                              <span className="text-[10px] text-neutral-400 font-normal normal-case">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 2: SHOP BY METAL */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Shop By Metal</h3>
                        <div className="flex flex-col space-y-2">
                          {[
                            { name: 'White Gold 18k', color: 'bg-neutral-200 border-neutral-300', href: '/configurator?category=Wedding Bands&metal=White Gold&step=5' },
                            { name: 'Yellow Gold 18k', color: 'bg-amber-300 border-amber-400', href: '/configurator?category=Wedding Bands&metal=Yellow Gold&step=5' },
                            { name: 'Rose Gold 18k', color: 'bg-red-200 border-red-300', href: '/configurator?category=Wedding Bands&metal=Rose Gold&step=5' },
                            { name: 'Platinum 950', color: 'bg-slate-300 border-slate-400', href: '/configurator?category=Wedding Bands&metal=Platinum&step=5' },
                          ].map((m) => (
                            <Link
                              key={m.name}
                              href={m.href}
                              onClick={closeAllMenusImmediately}
                              className="flex items-center gap-3 py-2 px-2.5 rounded-lg hover:bg-gold-50/40 group transition-all text-left"
                            >
                              <span className={`w-5 h-5 rounded-full border shadow-inner ${m.color} flex-shrink-0`} />
                              <span className="text-[11px] font-bold text-neutral-800 group-hover:text-gold-600 transition-colors">{m.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 3: QUICK LINKS */}
                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                          <Link href="/products?category=wedding bands" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Browse All Wedding Bands →</Link>
                          <Link href="/configurator?category=Wedding Bands&step=1" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Design a Custom Band →</Link>
                          <Link href="/engagement-rings" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">View Engagement Rings →</Link>
                        </div>
                        <div className="bg-neutral-950 text-white p-4 rounded-xl space-y-1.5 mt-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400 block">Matching Sets Available</span>
                          <p className="text-[10px] text-neutral-400 font-normal normal-case leading-relaxed">We craft matching engagement & wedding band sets in identical metal and finish for a perfect pairing.</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Eternity Rings */}
              <div className="relative">
                <Link
                  href="/products?category=rings"
                  onClick={(e) => {
                    if (activeMegaMenu !== 'eternity') {
                      e.preventDefault();
                      setActiveMegaMenu('eternity');
                    }
                  }}
                  className={`hover:text-gold-500 transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isEternityActive || activeMegaMenu === 'eternity'
                      ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5'
                      : 'text-neutral-700'
                  }`}
                >
                  Eternity Rings <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMegaMenu === 'eternity' ? 'rotate-180 text-gold-600' : 'opacity-50'}`} />
                </Link>

                {activeMegaMenu === 'eternity' && (
                  <div
                    className="fixed left-0 right-0 z-[200] glass-panel border-t border-b border-gold-500/20 shadow-2xl py-8 px-6 animate-menu-slide-down"
                    style={{ top: '130px' }}
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-3 gap-10">

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Setting Types</h3>
                        <div className="flex flex-col space-y-1.5">
                          {[
                            { name: 'Full Eternity', desc: 'Diamonds around the complete circumference', href: '/products?category=rings' },
                            { name: 'Half Eternity', desc: 'Diamonds set across the top half', href: '/products?category=rings' },
                            { name: 'Channel Set', desc: 'Smooth recessed channel – ultra protective', href: '/products?category=rings' },
                            { name: 'Claw Set', desc: 'Each stone elevated by fine prongs', href: '/products?category=rings' },
                            { name: 'Gemstone Eternity', desc: 'Alternating sapphires, rubies & diamonds', href: '/products?category=rings' },
                            { name: 'Mixed Shape', desc: 'Round, marquise & baguette alternating', href: '/products?category=rings' },
                          ].map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={closeAllMenusImmediately}
                              className="flex flex-col py-2 px-2.5 rounded-lg hover:bg-gold-50/40 text-left group transition-all"
                            >
                              <span className="text-[11px] font-bold tracking-wide text-neutral-800 group-hover:text-gold-600 transition-colors">{item.name}</span>
                              <span className="text-[10px] text-neutral-400 font-normal normal-case">{item.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Shop By Stone Shape</h3>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                          {['Round','Cushion','Emerald','Oval','Princess','Radiant'].map((shape) => (
                            <Link
                              key={shape}
                              href={`/diamonds?shape=${shape}`}
                              onClick={closeAllMenusImmediately}
                              className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gold-50/40 text-neutral-700 transition-all text-left group w-full"
                            >
                              <span className="w-2 h-2 rotate-45 border border-gold-300/60 bg-gold-50/20 flex-shrink-0 group-hover:rotate-90 group-hover:border-gold-500 group-hover:bg-gold-500/20 transition-all duration-500" />
                              <span className="text-[11px] font-semibold group-hover:text-gold-600 transition-colors">{shape}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                          <Link href="/products?category=rings" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Browse All Eternity Rings →</Link>
                          <Link href="/diamonds" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Browse Certified Diamonds →</Link>
                          <Link href="/configurator?category=Rings&step=1" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Design Custom Ring →</Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Jewellery */}
              <div className="relative">
                <Link
                  href="/products"
                  onClick={(e) => {
                    if (activeMegaMenu !== 'jewellery') {
                      e.preventDefault();
                      setActiveMegaMenu('jewellery');
                    }
                  }}
                  className={`hover:text-gold-500 transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isJewelleryActive || activeMegaMenu === 'jewellery'
                      ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5'
                      : 'text-neutral-700'
                  }`}
                >
                  Jewellery <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMegaMenu === 'jewellery' ? 'rotate-180 text-gold-600' : 'opacity-50'}`} />
                </Link>

                {activeMegaMenu === 'jewellery' && (
                  <div
                    className="fixed left-0 right-0 z-[200] glass-panel border-t border-b border-gold-500/20 shadow-2xl py-8 px-6 animate-menu-slide-down"
                    style={{ top: '130px' }}
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10">

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Earrings</h3>
                        <div className="flex flex-col space-y-1.5">
                          {[
                            { name: 'Diamond Studs', href: '/products?category=earrings&search=stud' },
                            { name: 'Pavé Hoops', href: '/products?category=earrings&search=hoop' },
                            { name: 'Drop Earrings', href: '/products?category=earrings&search=earring' },
                            { name: 'Chandelier Earrings', href: '/products?category=earrings&search=earring' },
                            { name: 'Huggie Hoops', href: '/products?category=earrings&search=hoop' },
                          ].map((item) => (
                            <Link key={item.name} href={item.href} onClick={closeAllMenusImmediately}
                              className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Necklaces & Chains</h3>
                        <div className="flex flex-col space-y-1.5">
                          {[
                            { name: 'Miami Cuban Link', href: '/products?category=necklaces&search=cuban' },
                            { name: 'Rope Chain', href: '/products?category=necklaces&search=rope' },
                            { name: 'Box Chain', href: '/products?category=necklaces&search=chain' },
                            { name: 'Diamond Station', href: '/products?category=necklaces&search=necklace' },
                            { name: 'Pearl Strand', href: '/products?category=necklaces&search=pearl' },
                          ].map((item) => (
                            <Link key={item.name} href={item.href} onClick={closeAllMenusImmediately}
                              className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">Bracelets & Pendants</h3>
                        <div className="flex flex-col space-y-1.5">
                          {[
                            { name: 'Tennis Bracelets', href: '/products?category=bracelets&search=tennis' },
                            { name: 'Infinity Link', href: '/products?category=bracelets&search=infinity' },
                            { name: 'VVS Diamond Pendants', href: '/products?category=pendants&search=vvs' },
                            { name: 'Iced Initials', href: '/products?category=pendants&search=nameplate' },
                            { name: 'Angel Face Pendant', href: '/products?category=pendants&search=angel' },
                          ].map((item) => (
                            <Link key={item.name} href={item.href} onClick={closeAllMenusImmediately}
                              className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2 font-bold">All Collections</h3>
                        <div className="flex flex-col space-y-1.5">
                          <Link href="/products" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">Full Jewellery Catalog →</Link>
                          <Link href="/products?category=earrings" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">All Earrings →</Link>
                          <Link href="/products?category=necklaces" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">All Necklaces →</Link>
                          <Link href="/products?category=bracelets" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">All Bracelets →</Link>
                          <Link href="/products?category=pendants" onClick={closeAllMenusImmediately} className="text-[11px] font-semibold text-neutral-700 hover:text-gold-600 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40">All Pendants →</Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Diamonds */}
              <div className="relative">
                <Link
                  href="/diamonds"
                  onClick={(e) => {
                    if (activeMegaMenu !== 'diamonds') {
                      e.preventDefault();
                      setActiveMegaMenu('diamonds');
                    }
                  }}
                  className={`hover:text-gold-500 transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                    isDiamondsActive || activeMegaMenu === 'diamonds'
                      ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5'
                      : 'text-neutral-700'
                  }`}
                >
                  Diamonds <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeMegaMenu === 'diamonds' ? 'rotate-180 text-gold-600' : 'opacity-50'}`} />
                </Link>

                {activeMegaMenu === 'diamonds' && (
                  <div
                    className="fixed left-0 right-0 z-[200] glass-panel border-t border-b border-gold-500/20 shadow-2xl py-8 px-6 animate-menu-slide-down"
                    style={{ top: '130px' }}
                  >
                    <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

                      {/* COL 1: CREATE YOUR OWN (col-span-4) */}
                      <div className="col-span-3 space-y-5">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2.5 font-bold">Create Your Own</h3>
                        <div className="flex flex-col space-y-4">
                          {[
                            {
                              label: 'Diamond Rings',
                              sub: 'Choose setting, then select a stone',
                              href: '/configurator?category=Engagement Rings&step=3',
                              action: () => handleConfiguratorNav({ category: 'Engagement Rings', step: 3 }),
                              icon: (
                                <svg className="w-5 h-5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="12" cy="14" r="6" />
                                  <path d="M12 8V5M10 5h4" strokeWidth="1.5" />
                                  <polygon points="12,3 15,5 12,7 9,5" fill="currentColor" strokeWidth="1" />
                                </svg>
                              )
                            },
                            {
                              label: 'Diamond Earrings',
                              sub: 'Design matching brilliant stud earrings',
                              href: '/configurator?category=Earrings&step=3',
                              action: () => handleConfiguratorNav({ category: 'Earrings', step: 3 }),
                              icon: (
                                <svg className="w-5 h-5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="7" cy="16" r="3" />
                                  <circle cx="17" cy="16" r="3" />
                                  <path d="M7 13V7c0-1.5 1-2.5 2.5-2.5h5c1.5 0 2.5 1 2.5 2.5v6" />
                                </svg>
                              )
                            },
                            {
                              label: 'Diamond Necklace',
                              sub: 'Craft a diamond pendant or necklace chain',
                              href: '/configurator?category=Necklaces&step=3',
                              action: () => handleConfiguratorNav({ category: 'Necklaces', step: 3 }),
                              icon: (
                                <svg className="w-5 h-5 text-gold-600 stroke-[1.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M6 4c0 0 3 6 6 6s6-6 6-6" />
                                  <polygon points="12,10 15,13 12,16 9,13" fill="currentColor" />
                                </svg>
                              )
                            }
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={item.action}
                              className="flex items-center gap-3 group text-left w-full py-1"
                            >
                              <div className="w-7.5 h-7.5 bg-gold-50/50 border border-gold/15 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-gold-100/50 transition-colors">
                                {item.icon}
                              </div>
                              <span className="text-[11px] font-semibold tracking-wide text-neutral-750 group-hover:text-gold-600 transition-colors">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 2: LOOSE DIAMONDS (col-span-5) */}
                      <div className="col-span-5 space-y-5">
                        <h3 className="font-serif text-[11px] uppercase tracking-widest text-neutral-900 border-b border-gold/10 pb-2.5 font-bold">Loose Diamonds</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                          {['Round', 'Princess', 'Cushion', 'Oval', 'Pear', 'Emerald', 'Heart', 'Radiant', 'Marquise'].map((shape) => (
                            <Link
                              key={shape}
                              href={`/diamonds?shape=${shape}`}
                              onClick={closeAllMenusImmediately}
                              className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg hover:bg-gold-50/40 text-neutral-700 transition-all group w-full text-left"
                            >
                              <div className="w-7 h-7 bg-white border border-gold/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-gold-300 transition-colors">
                                <DiamondShapeSvg
                                  shape={shape as DiamondShape}
                                  className="w-[70%] h-[70%] text-gold-500/80 stroke-[0.8]"
                                />
                              </div>
                              <span className="text-[11px] font-semibold tracking-wide text-neutral-700 group-hover:text-gold-600 transition-colors">{shape}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* COL 3: ILLUSTRATIVE CARD (col-span-4) */}
                      <div className="col-span-4 flex items-center justify-center">
                        <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gold/15 bg-[#0a1021] aspect-[16/10] flex flex-col justify-end p-5">
                          <img
                            src="/assets/images/diamonds_menu_banner.png"
                            alt="J&D Jewellers London Cherub Banner"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1021]/95 via-[#0a1021]/30 to-transparent pointer-events-none" />
                          <div className="relative z-10 space-y-1 text-left">
                            <span className="text-[8px] font-sans font-bold tracking-widest text-gold-400 uppercase">Vault Collection</span>
                            <h4 className="font-serif text-xs text-white uppercase tracking-wider font-bold">The Fine Diamond Registry</h4>
                            <p className="text-[9.5px] text-neutral-300 font-light font-sans normal-case leading-relaxed">
                              GIA certified stones hand-selected for exceptional fire and optical performance.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Gemstones (simple link, no mega menu) */}
              <Link
                href="/products?category=custom"
                onMouseEnter={closeAllMenusImmediately}
                className={`hover:text-gold-500 transition-colors py-1 ${
                  isGemstonesActive ? 'text-gold-500 font-bold border-b border-gold-500/80 pb-0.5' : 'text-neutral-700'
                }`}
              >
                Gemstones
              </Link>

            </nav>
          </div>

          {/* MOBILE NAVIGATION LAYOUT */}
          <div className="flex justify-between items-center h-20 lg:hidden">
            
            {/* Left: Mobile Drawer trigger */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-800 hover:text-gold-500 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Center Logo Monogram */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center group">
                <img 
                  src="/assets/images/logo.png" 
                  alt="J&D Jewellers London Logo" 
                  className="h-8 w-auto object-contain mt-0.5 transition-transform group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Right Side Cart Action */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-neutral-700 hover:text-gold-500 transition-colors p-1.5 relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#fcfbf9] h-full p-6 flex flex-col justify-between shadow-2xl border-r border-gold/20 animate-fade-in overflow-y-auto z-50">
            <div>
              <div className="flex justify-between items-center pb-5 border-b border-gold/15">
                <div className="flex items-center gap-2">
                  <img src="/assets/images/logo.png" alt="J&D Logo" className="h-6 w-auto" />
                  <span className="font-serif text-base tracking-widest text-neutral-900 uppercase">J&D JEWELLERS</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-600 p-1 hover:text-gold-600 transition-colors">
                  <X className="h-5.5 w-5.5" />
                </button>
              </div>

              {/* Mobile Quick Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBookingModalOpen(true);
                  }}
                  className="py-2.5 px-3 text-[9px] uppercase font-bold tracking-widest gold-gradient text-white rounded-sm text-center shadow-xs"
                >
                  Book Salon
                </button>
                <Link
                  href="/configurator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-3 text-[9px] uppercase font-bold tracking-widest border border-gold-400 text-gold-700 bg-gold-50/50 rounded-sm text-center hover:bg-gold-100/50 transition-colors"
                >
                  Design Ring
                </Link>
              </div>

              <nav className="mt-6 space-y-1 text-xs font-sans tracking-widest uppercase font-medium">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-neutral-800 py-3 border-b border-gold/10 hover:text-gold-600 transition-colors"
                >
                  Home Overview
                </Link>
                <Link
                  href="/diamonds"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-neutral-800 py-3 border-b border-gold/10 hover:text-gold-600 transition-colors"
                >
                  Diamond Explorer (GIA Index)
                </Link>

                <div className="py-3 border-b border-gold/10 space-y-2">
                  <span className="text-gold-600 font-serif text-[10px] tracking-[0.2em] font-bold block uppercase">Bespoke Collections</span>
                  <div className="pl-3 space-y-2.5 text-[11px] font-normal normal-case">
                    <Link href="/engagement-rings" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">Engagement Rings</Link>
                    <Link href="/products?category=wedding bands" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">Wedding Bands</Link>
                    <Link href="/products?category=rings" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">Eternity & Statement Rings</Link>
                    <Link href="/products?category=pendants" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">VVS Diamond Pendants</Link>
                    <Link href="/products?category=bracelets" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">Tennis Bracelets</Link>
                    <Link href="/products?category=custom" onClick={() => setIsMobileMenuOpen(false)} className="block text-neutral-800 hover:text-gold-600 transition-colors">Custom Gold Atelier & Grillz</Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-gold-600 font-semibold uppercase text-[10px] tracking-wider pt-1">Explore Full Catalog →</Link>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-neutral-800 py-3 border-b border-gold/10 hover:text-gold-600 transition-colors"
                >
                  My Account & Orders
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-gold/15 mt-6">
              <span className="font-serif text-xs tracking-widest text-neutral-900 block font-semibold">J&D JEWELLERS LONDON</span>
              <span className="text-[9.5px] text-neutral-500 font-sans tracking-wider mt-1 block">Mayfair Salon • Registered GIA Dealer</span>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#fcfbf9] h-full flex flex-col justify-between shadow-2xl border-l border-gold/20">
            
            {/* Header */}
            <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-[#faf8f5]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold-500" />
                <span className="font-serif text-lg tracking-widest text-neutral-900 uppercase">Shopping Bag</span>
                <span className="text-xs text-neutral-400 font-sans font-medium">({totalItemsCount})</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 hover:text-neutral-800 transition-colors p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 text-gold-300 stroke-[1.5]" />
                  <div>
                    <p className="font-serif text-base text-neutral-800 tracking-wider">Your bag is empty</p>
                    <p className="text-xs text-neutral-400 mt-1">Explore our exclusive collections or custom craft a diamond piece.</p>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); resetConfig(); router.push('/configurator'); }}
                    className="mt-2 inline-block px-5 py-2.5 text-[11px] font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover transition-all"
                  >
                    Build Custom Ring
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-gold/10">
                    <div className="w-20 h-20 bg-neutral-100 border border-gold/10 flex-shrink-0 flex items-center justify-center p-1">
                      <img 
                        src={item.customConfig ? (item.customConfig.diamond?.imageUrl || item.productImage || '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg') : (item.productImage || '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg')} 
                        alt="Jewelry Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-serif text-sm tracking-wide text-neutral-900 leading-tight">
                            {item.customConfig ? `Custom ${item.customConfig.category}` : item.productTitle}
                          </h4>
                          <span className="text-xs font-semibold text-neutral-950">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                        
                        {item.customConfig ? (
                          <div className="text-[10px] text-neutral-500 font-sans mt-1 space-y-0.5">
                            <p>{item.customConfig.metal} • {item.customConfig.setting} Band • Size {item.customConfig.size}</p>
                            {item.customConfig.diamond ? (
                              <p className="text-gold-600 font-medium">
                                Stone: {item.customConfig.diamond.carat}ct {item.customConfig.diamond.shape} ({item.customConfig.diamond.color}/{item.customConfig.diamond.clarity})
                              </p>
                            ) : (
                              <p className="text-red-500 flex items-center gap-0.5"><AlertCircle className="h-3 w-3" /> No diamond attached</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] text-neutral-400 font-sans mt-1">{item.diamondSpec || 'Exclusive Fine Collection'}</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Controls */}
                        <div className="flex border border-gold/20 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-gold-50 text-neutral-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-0.5 text-neutral-800 font-medium bg-[#faf8f5]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-gold-50 text-neutral-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 hover:text-red-500 transition-colors font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Calculations */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#faf8f5] border-t border-gold/20 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-500 font-sans">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500 font-sans">
                    <span>Shipping (Insured Overnight)</span>
                    <span className="text-gold-600 font-semibold uppercase tracking-wider">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-900 font-semibold border-t border-gold/10 pt-3">
                    <span className="font-serif tracking-wider">Estimated Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans italic text-center pt-1">
                    Or {formatPrice(cartTotal / 4)}/mo interest-free with Affirm.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all duration-300"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* APPOINTMENT BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-fade-in" onClick={() => setIsBookingModalOpen(false)} />
          <div className="relative w-full max-w-lg glass-panel shadow-2xl p-8 rounded-sm z-50 animate-menu-slide-down">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 transition-colors p-1"
            >
              <X className="h-5.5 w-5.5" />
            </button>
 
            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-gold-50 border border-gold-300 rounded-full flex items-center justify-center mx-auto text-gold-600">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-neutral-900">Consultation Scheduled</h3>
                <div className="text-xs text-neutral-600 font-sans leading-relaxed max-w-sm mx-auto space-y-1.5">
                  <p className="font-bold">Thank you, {bookingName}.</p>
                  <p>A J&D personal concierge will review your request and reach out to you at <span className="underline">{bookingEmail}</span> with your showroom calendar invite and access instructions shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="border-b border-gold-300/20 pb-4 space-y-1 text-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold-600 font-bold block">Exclusive Showroom Visit</span>
                  <h3 className="font-serif text-2xl uppercase tracking-wider text-neutral-950">Book a Private Consultation</h3>
                  <p className="text-[11px] text-neutral-400 font-sans mt-1">Schedule a showroom viewing in London or organize a virtual zoom session.</p>
                </div>
 
                <div className="space-y-4 text-xs font-sans">
                  
                  {/* Service Type Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    {['Showroom Visit', 'Virtual Zoom'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBookingType(t)}
                        className={`py-3 text-[10px] uppercase font-bold tracking-widest border transition-luxury text-center rounded-sm cursor-pointer ${
                          bookingType === t
                            ? 'border-gold-500 bg-gold-500/10 text-gold-600 shadow-sm'
                            : 'border-gold-300/30 text-neutral-500 bg-[#fdfcfb] hover:bg-gold-50/30 hover:text-neutral-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
 
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Evelyn Vance"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full bg-[#fdfcfb] border border-gold-300/35 rounded-sm py-3 px-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 text-neutral-800 tracking-wide transition-luxury placeholder:text-neutral-400"
                    />
                  </div>
 
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="evelyn@example.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full bg-[#fdfcfb] border border-gold-300/35 rounded-sm py-3 px-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 text-neutral-800 tracking-wide transition-luxury placeholder:text-neutral-400"
                    />
                  </div>
 
                  {/* Date and Time slots */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#fdfcfb] border border-gold-300/35 rounded-sm py-3 px-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 text-neutral-800 tracking-wide transition-luxury"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Time Slot *</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-[#fdfcfb] border border-gold-300/35 rounded-sm py-3 px-4 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 text-neutral-800 tracking-wide transition-luxury cursor-pointer"
                      >
                        <option value="10:00 AM">10:00 AM (Morning)</option>
                        <option value="11:00 AM">11:00 AM (Morning)</option>
                        <option value="01:00 PM">01:00 PM (Afternoon)</option>
                        <option value="03:00 PM">03:00 PM (Afternoon)</option>
                        <option value="05:00 PM">05:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>
 
                </div>
 
                <button
                  type="submit"
                  className="w-full py-4 text-xs font-sans tracking-widest uppercase font-bold gold-gradient text-white hover:gold-gradient-hover rounded-sm shadow-md hover:shadow-gold transition-luxury cursor-pointer"
                >
                  Request Concierge Consultation
                </button>
              </form>
            )}
 
          </div>
        </div>
      )}
      <InternationalPopup />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-gold/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold text-neutral-400 uppercase">
            Loading navigation...
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  );
}
