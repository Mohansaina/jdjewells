'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';

export default function InternationalPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('India');
  const [detectedCurrency, setDetectedCurrency] = useState('Indian Rupee (₹)');
  const [detectedCurrencyCode, setDetectedCurrencyCode] = useState('IN / INR');

  useEffect(() => {
    // Check if the user has already acknowledged or selected a currency
    const onboardingCompleted = localStorage.getItem('currency_onboarding_completed') === 'true';
    if (onboardingCompleted) return;

    // Detect visitor location using a public IP API
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code || 'IN';
          const countryName = data.country_name || 'India';
          
          if (countryCode === 'IN') {
            setDetectedCountry('India');
            setDetectedCurrency('Indian Rupee (₹)');
            setDetectedCurrencyCode('IN / INR');
            setIsOpen(true);
          } else if (countryCode === 'GB') {
            // Keep default, don't show popup
            localStorage.setItem('currency_onboarding_completed', 'true');
          } else if (countryCode === 'US') {
            setDetectedCountry('United States');
            setDetectedCurrency('US Dollar ($)');
            setDetectedCurrencyCode('US / USD');
            setIsOpen(true);
          } else if (countryCode === 'AE') {
            setDetectedCountry('United Arab Emirates');
            setDetectedCurrency('UAE Dirham (AED)');
            setDetectedCurrencyCode('AE / AED');
            setIsOpen(true);
          } else {
            // Other European or rest of world default to EUR
            setDetectedCountry(countryName);
            setDetectedCurrency('Euro (€)');
            setDetectedCurrencyCode('EU / EUR');
            setIsOpen(true);
          }
        } else {
          // Fallback pop up India by default for local testing
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Location detection lookup error:", err);
        // Fallback pop up for local testing
        setIsOpen(true);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-[#fcfbf9] border border-gold/20 shadow-2xl max-w-lg w-full relative overflow-hidden rounded p-6 sm:p-10 text-center space-y-6">
        
        {/* Top gold bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-400" />
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-neutral-400 hover:text-gold-600 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-bold block">International Shipping</span>
        
        <div className="flex justify-center pt-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-100 rounded-full scale-150 blur-xl opacity-40 animate-pulse" />
            <Globe className="relative h-12 w-12 text-gold-600 stroke-[1.2]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-wide uppercase">
            We Ship to {detectedCountry}
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Enjoy premium fully-insured courier delivery, all custom duties included, and zero hidden costs upon checkout.
          </p>
        </div>

        {/* Detection Card */}
        <div className="bg-white border border-gold/15 p-4 rounded flex items-center gap-3 text-left">
          <span className="text-2xl">{detectedCountry === 'India' ? '🇮🇳' : '🌐'}</span>
          <div className="text-xs">
            <span className="font-semibold text-neutral-800">Visiting from {detectedCountry}?</span>
            <p className="text-neutral-400 mt-0.5">Would you like to switch prices to {detectedCurrency}?</p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-4 text-xs font-bold tracking-widest uppercase gold-gradient text-white hover:gold-gradient-hover hover:shadow-gold shadow-md transition-all duration-300 rounded"
          >
            Confirm & Continue
          </button>
          <button
            onClick={handleStayOnUk}
            className="w-full py-3.5 text-xs font-bold tracking-widest uppercase border border-neutral-300 text-neutral-500 hover:bg-neutral-50 bg-white transition-colors rounded"
          >
            Stay on UK Site
          </button>
        </div>

        <div className="border-t border-neutral-100 pt-5 text-[9px] tracking-widest uppercase text-neutral-400 flex items-center justify-center gap-4">
          <span>British Jewellers since 1998</span>
          <span>•</span>
          <span>60-Day Exchange Guarantee</span>
        </div>

      </div>
    </div>
  );
}
