'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';

export default function InternationalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [detectedCountryName, setDetectedCountryName] = useState('India');
  const [currencySymbol, setCurrencySymbol] = useState('Indian Rupee (₹)');
  const [currencyCode, setCurrencyCode] = useState('IN / INR');

  // Country options list
  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'Indian Rupee (₹)', fullCode: 'IN / INR' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'British Pound (£)', fullCode: 'GB / GBP' },
    { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'US Dollar ($)', fullCode: 'US / USD' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'UAE Dirham (AED)', fullCode: 'AE / AED' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'Australian Dollar ($)', fullCode: 'AU / AUD' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'Canadian Dollar ($)', fullCode: 'CA / CAD' },
    { code: 'EU', name: 'Europe', flag: '🇪🇺', currency: 'Euro (€)', fullCode: 'EU / EUR' },
  ];

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('currency_onboarding_completed');

    const detectLocation = async () => {
      try {
        let defaultCountryCode = 'GB';
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

        if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || timeZone.includes('India')) {
          defaultCountryCode = 'IN';
        } else if (timeZone.includes('London')) {
          defaultCountryCode = 'GB';
        } else if (timeZone.includes('America') || timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago')) {
          defaultCountryCode = 'US';
        } else if (timeZone.includes('Dubai') || timeZone.includes('Muscat')) {
          defaultCountryCode = 'AE';
        } else if (timeZone.includes('Europe')) {
          defaultCountryCode = 'EU';
        }

        updateCountrySelection(defaultCountryCode);

        // Auto trigger modal if onboarding has not been completed
        if (!onboardingCompleted) {
          setTimeout(() => {
            setIsOpen(true);
          }, 1000);
        }

        // IP lookup refinement
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code && ['IN', 'GB', 'US', 'AE', 'AU', 'CA', 'EU'].includes(data.country_code)) {
            updateCountrySelection(data.country_code);
          }
        }
      } catch (err) {
        if (!onboardingCompleted) {
          setTimeout(() => {
            setIsOpen(true);
          }, 1000);
        }
      }
    };

    detectLocation();
  }, []);

  const updateCountrySelection = (code: string) => {
    const matched = countries.find(c => c.code === code) || countries[0];
    setSelectedCountry(matched.code);
    setDetectedCountryName(matched.name);
    setCurrencySymbol(matched.currency);
    setCurrencyCode(matched.fullCode);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCountrySelection(e.target.value);
  };

  const handleConfirm = () => {
    localStorage.setItem('currency', currencyCode);
    localStorage.setItem('currency_onboarding_completed', 'true');
    window.dispatchEvent(new Event('currency-change'));
    setIsOpen(false);
  };

  const handleStayOnUk = () => {
    localStorage.setItem('currency', 'GB / GBP');
    localStorage.setItem('currency_onboarding_completed', 'true');
    window.dispatchEvent(new Event('currency-change'));
    setIsOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem('currency_onboarding_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentObj = countries.find(c => c.code === selectedCountry) || countries[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[999] flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white border border-neutral-200 shadow-2xl max-w-[480px] w-full relative overflow-hidden p-6 sm:p-10 text-left">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 stroke-[1.5]" />
        </button>

        {/* Top Header Monogram & Sub-label */}
        <div className="text-center space-y-1">
          <DiamondShapeSvg shape="Round" className="w-5 h-5 text-neutral-800 mx-auto opacity-80" />
          <span className="text-[10px] font-sans tracking-[0.3em] text-neutral-400 uppercase font-light block">
            INTERNATIONAL
          </span>
          <h3 className="font-serif text-xs uppercase tracking-[0.25em] text-neutral-800 font-bold pt-0.5">
            THE DIAMOND STORE
          </h3>
          <span className="text-[8px] tracking-[0.3em] uppercase text-neutral-400 block font-mono">LONDON</span>
        </div>

        {/* Headline & Subtitle */}
        <div className="text-center mt-6 space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-wide font-light">
            We ship to {detectedCountryName}
          </h2>
          <p className="text-xs text-neutral-500 font-sans font-light leading-relaxed">
            Free, fully insured delivery. Including duties, no hidden costs.
          </p>
        </div>

        {/* Detected Info Box */}
        <div className="bg-[#faf9f6] border border-neutral-200 p-3.5 mt-6 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-sans leading-snug">
            <span className="text-lg flex-shrink-0">{currentObj.flag}</span>
            <span>
              It looks like you're visiting from <strong className="font-semibold text-neutral-900">{detectedCountryName}</strong>. Would you like to switch to {currencySymbol}?
            </span>
          </div>
          <span className="text-[8.5px] font-mono tracking-widest uppercase font-bold text-neutral-400 border border-neutral-200 px-2 py-1 flex-shrink-0 bg-white">
            DETECTED
          </span>
        </div>

        {/* Ship To Dropdown Input */}
        <div className="mt-5 space-y-1.5">
          <label className="text-[9px] font-sans font-bold uppercase tracking-widest text-neutral-400 block">
            SHIP TO
          </label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full border border-neutral-300 px-4 py-3.5 bg-white text-xs font-sans font-medium text-neutral-900 appearance-none focus:outline-none focus:border-neutral-900 cursor-pointer pr-10"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none stroke-[1.5]" />
          </div>
          <p className="text-[11px] text-neutral-500 font-sans pt-1">
            Prices will be shown in <span className="font-medium text-neutral-800">{currencySymbol}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-none shadow-sm cursor-pointer"
          >
            CONFIRM & CONTINUE
          </button>
          <button
            onClick={handleStayOnUk}
            className="text-[11px] font-sans tracking-widest uppercase text-neutral-500 hover:text-neutral-900 underline block text-center w-full cursor-pointer py-1"
          >
            STAY ON UK SITE
          </button>
        </div>

        {/* Footer info bar */}
        <div className="border-t border-neutral-100 pt-5 mt-6 text-[8.5px] font-sans tracking-widest uppercase text-neutral-400 flex items-center justify-center gap-2.5 text-center">
          <span>BRITISH JEWELLERS SINCE 1998</span>
          <span>•</span>
          <span>FREE WORLDWIDE DELIVERY</span>
          <span>•</span>
          <span>60-DAY EXCHANGE</span>
        </div>

      </div>
    </div>
  );
}
