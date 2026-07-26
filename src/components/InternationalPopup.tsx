'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';

export default function InternationalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('India');
  const [countryFlag, setCountryFlag] = useState('🇮🇳');
  const [detectedCurrency, setDetectedCurrency] = useState('Indian Rupee (₹)');
  const [detectedCurrencyCode, setDetectedCurrencyCode] = useState('IN / INR');

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('currency_onboarding_completed');

    const detectLocation = async () => {
      try {
        let currencyCode = 'GB / GBP';
        let countryName = 'United Kingdom';
        let flag = '🇬🇧';
        let currencyLabel = 'British Pound (£)';

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

        if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || timeZone.includes('India')) {
          currencyCode = 'IN / INR';
          countryName = 'India';
          flag = '🇮🇳';
          currencyLabel = 'Indian Rupee (₹)';
        } else if (timeZone.includes('London')) {
          currencyCode = 'GB / GBP';
          countryName = 'United Kingdom';
          flag = '🇬🇧';
          currencyLabel = 'British Pound (£)';
        } else if (timeZone.includes('America') || timeZone.includes('New_York') || timeZone.includes('Los_Angeles') || timeZone.includes('Chicago')) {
          currencyCode = 'US / USD';
          countryName = 'United States';
          flag = '🇺🇸';
          currencyLabel = 'US Dollar ($)';
        } else if (timeZone.includes('Dubai') || timeZone.includes('Muscat')) {
          currencyCode = 'AE / AED';
          countryName = 'United Arab Emirates';
          flag = '🇦🇪';
          currencyLabel = 'UAE Dirham (AED)';
        } else if (timeZone.includes('Europe')) {
          currencyCode = 'EU / EUR';
          countryName = 'Europe';
          flag = '🇪🇺';
          currencyLabel = 'Euro (€)';
        }

        setDetectedCountry(countryName);
        setCountryFlag(flag);
        setDetectedCurrency(currencyLabel);
        setDetectedCurrencyCode(currencyCode);

        // Auto trigger location popup if onboarding has not been completed
        if (!onboardingCompleted) {
          setTimeout(() => {
            setIsOpen(true);
          }, 1200);
        }

        // Background IP lookup refinement
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code;

          if (countryCode === 'IN') {
            setDetectedCountry('India');
            setCountryFlag('🇮🇳');
            setDetectedCurrency('Indian Rupee (₹)');
            setDetectedCurrencyCode('IN / INR');
          } else if (countryCode === 'GB') {
            setDetectedCountry('United Kingdom');
            setCountryFlag('🇬🇧');
            setDetectedCurrency('British Pound (£)');
            setDetectedCurrencyCode('GB / GBP');
          } else if (countryCode === 'US' || countryCode === 'CA') {
            setDetectedCountry('United States');
            setCountryFlag('🇺🇸');
            setDetectedCurrency('US Dollar ($)');
            setDetectedCurrencyCode('US / USD');
          } else if (countryCode === 'AE' || countryCode === 'SA' || countryCode === 'QA') {
            setDetectedCountry('United Arab Emirates');
            setCountryFlag('🇦🇪');
            setDetectedCurrency('UAE Dirham (AED)');
            setDetectedCurrencyCode('AE / AED');
          }
        }
      } catch (err) {
        if (!onboardingCompleted) {
          setTimeout(() => {
            setIsOpen(true);
          }, 1200);
        }
      }
    };

    detectLocation();
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('currency', detectedCurrencyCode);
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

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-[#0e0e11] border border-gold-500/35 shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-w-lg w-full relative overflow-hidden rounded-2xl p-6 sm:p-8 text-center space-y-6 text-white">
        
        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] tracking-[0.35em] text-gold-400 uppercase font-bold block">
            INTERNATIONAL SHIPPING
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-wider uppercase font-light">
            We Ship To {detectedCountry} {countryFlag}
          </h2>
        </div>

        <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed font-light font-sans">
          You are visiting from <span className="text-gold-300 font-bold">{detectedCountry}</span>. We offer fully-insured express delivery directly to your doorstep with pre-calculated taxes in your local currency.
        </p>

        {/* Location Detection Box */}
        <div className="bg-[#141417] border border-gold-500/30 p-4 rounded-xl flex items-center gap-4 text-left">
          <span className="text-3xl">{countryFlag}</span>
          <div className="text-xs space-y-0.5">
            <p className="font-serif text-sm font-bold text-white uppercase tracking-wide">
              Show prices in {detectedCurrency}?
            </p>
            <p className="text-[11px] text-neutral-400 font-sans font-light">
              Browsing from {detectedCountry} • Direct express courier dispatch
            </p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleConfirm}
            className="w-full py-4 text-xs font-bold tracking-[0.2em] uppercase gold-gradient text-white hover:gold-gradient-hover shadow-lg transition-all duration-300 rounded-xl cursor-pointer"
          >
            CONTINUE SHOPPING IN {detectedCurrencyCode.split('/')[1]?.trim() || 'INR'}
          </button>
          <button
            onClick={handleStayOnUk}
            className="w-full py-3.5 text-xs font-bold tracking-[0.2em] uppercase border border-gold-500/40 text-gold-300 hover:text-white hover:border-gold-400 hover:bg-gold-500/10 transition-all rounded-xl cursor-pointer"
          >
            STAY ON UK CATALOG (£)
          </button>
        </div>

        <div className="border-t border-neutral-800 pt-4 text-[9.5px] font-mono tracking-widest uppercase text-neutral-400 flex items-center justify-center gap-3">
          <span>Mayfair Atelier</span>
          <span>•</span>
          <span>Fully Insured Global Logistics</span>
        </div>

      </div>
    </div>
  );
}
