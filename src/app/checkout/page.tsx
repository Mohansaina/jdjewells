'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, Truck, CreditCard, Sparkles, User, Mail, Phone, Home, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { warning, error } = useToast();
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

  // Form step controls
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  // Form inputs
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  
  // Payment inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'affirm'>('card');

  // Verify cart is not empty on mount
  useEffect(() => {
    if (cart.length === 0 && !orderCreated) {
      router.push('/cart');
    }
  }, [cart, orderCreated, router]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Basic validations
      if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingZip) {
        warning("Please fill in all shipping parameters before proceeding.");
        return;
      }
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (cardNumber.length < 16 || !cardExpiry || cardCvv.length < 3) {
        warning("Please enter a valid 16-digit credit card number and security CVV.");
        return;
      }
    }

    setLoading(true);

    // Prepare API items
    const orderItems = cart.map(item => ({
      productId: item.productId || null,
      diamondId: item.diamondId || null,
      quantity: item.quantity,
      price: item.price,
      // Store configuration specs if any
      customConfig: item.customConfig ? {
        category: item.customConfig.category,
        shape: item.customConfig.shape,
        setting: item.customConfig.setting,
        metal: item.customConfig.metal,
        size: item.customConfig.size,
        price: item.customConfig.price,
        diamondVdbId: item.customConfig.diamond?.vdbId || null
      } : null
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: cartTotal,
          shippingName,
          shippingEmail,
          shippingPhone,
          shippingAddress,
          shippingCity,
          shippingZip,
          items: orderItems
        })
      });

      if (res.ok) {
        const order = await res.json();
        setOrderCreated(order);
        clearCart(); // Clear local shopping bag
        setStep(3); // Success layout
      } else {
        throw new Error("Failed to process order registry");
      }
    } catch (e) {
      console.error(e);
      error("There was an error verifying payment. Please retry.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header and Steps */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Secure Checkout</span>
        <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900">Luxury Handover</h1>
        
        {step < 3 && (
          <div className="flex justify-center items-center gap-4 text-xs font-sans font-semibold text-neutral-400 pt-4">
            <span className={step === 1 ? 'text-gold-600 underline underline-offset-4' : 'text-neutral-700'}>1. Shipping</span>
            <span className="text-neutral-300">/</span>
            <span className={step === 2 ? 'text-gold-600 underline underline-offset-4' : ''}>2. Payment</span>
          </div>
        )}
      </div>

      {/* STEP 1: SHIPPING DETAILS */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="bg-white border border-neutral-200 p-6 md:p-8 space-y-6">
          <h3 className="font-serif text-base text-neutral-900 border-b border-neutral-100 pb-3 font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-gold-500" /> Insured Overnight Shipping Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1">
                <User className="h-3 w-3" /> Consignee Full Name
              </label>
              <input
                type="text"
                required
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                placeholder="E.g. Evelyn K."
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address (For GIA Report Updates)
              </label>
              <input
                type="email"
                required
                value={shippingEmail}
                onChange={(e) => setShippingEmail(e.target.value)}
                placeholder="evelyn@domain.com"
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1">
                <Phone className="h-3 w-3" /> Delivery Contact Phone (FedEx Verification)
              </label>
              <input
                type="tel"
                required
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                placeholder="212-555-0198"
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1">
                <Home className="h-3 w-3" /> Delivery Address (No PO Boxes Allowed)
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="15 West 47th St, Showroom 104"
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">City</label>
              <input
                type="text"
                required
                value={shippingCity}
                onChange={(e) => setShippingCity(e.target.value)}
                placeholder="New York"
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">ZIP / Postal Code</label>
              <input
                type="text"
                required
                value={shippingZip}
                onChange={(e) => setShippingZip(e.target.value)}
                placeholder="10036"
                className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all flex items-center gap-1"
            >
              Continue to Payment <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT METHOD */}
      {step === 2 && (
        <form onSubmit={handlePlaceOrder} className="bg-white border border-neutral-200 p-6 md:p-8 space-y-6">
          <h3 className="font-serif text-base text-neutral-900 border-b border-neutral-100 pb-3 font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gold-500" /> Secure Payment Gateway
          </h3>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-4 text-xs font-sans">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                paymentMethod === 'card' ? 'border-gold-500 bg-gold-50/15 text-gold-700 font-bold' : 'border-neutral-200 text-neutral-500'
              }`}
            >
              <CreditCard className="h-4 w-4" /> Credit or Debit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('affirm')}
              className={`p-4 border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                paymentMethod === 'affirm' ? 'border-gold-500 bg-gold-50/15 text-gold-700 font-bold' : 'border-neutral-200 text-neutral-500'
              }`}
            >
              <Sparkles className="h-4 w-4" /> Affirm Split Financing
            </button>
          </div>

          {/* Card fields */}
          {paymentMethod === 'card' ? (
            <div className="grid grid-cols-3 gap-6 text-xs font-sans">
              <div className="flex flex-col gap-1.5 col-span-3">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">16-Digit Card Number</label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g,''))}
                  placeholder="4111 2222 3333 4444"
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="12/29"
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Security Code (CVV)</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,''))}
                  placeholder="123"
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-3 text-xs focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#faf8f5] border border-gold/15 p-5 text-xs font-sans text-neutral-600 leading-relaxed text-center space-y-2">
              <Sparkles className="h-6 w-6 text-gold-500 mx-auto" />
              <p className="font-semibold text-neutral-800 uppercase tracking-widest text-[10px]">Affirm Interest-Free Financing</p>
              <p className="font-light max-w-md mx-auto text-neutral-400">
                You will be redirected to Affirm to complete your credit authorization. Get pre-approved instantly with plans starting at <strong className="text-neutral-700">{formatPrice(cartTotal / 4)} / month</strong>.
              </p>
            </div>
          )}

          {/* Cost and place buttons */}
          <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left font-sans text-xs">
              <span className="text-neutral-400 block">Payout Total (Insured Overnight Shipping Included)</span>
              <strong className="text-base text-neutral-900">{formatPrice(cartTotal)}</strong>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
              >
                {loading ? 'Authorizing Payout...' : 'Place Secure Order'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 3: SUCCESS AND REDIRECT */}
      {step === 3 && orderCreated && (
        <div className="bg-white border border-neutral-200 p-8 text-center space-y-6 animate-fade-in">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto stroke-[1.2]" />
          
          <div className="space-y-2">
            <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Atelier Handover Registered</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-wide">Thank You for Your Order</h2>
            <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto font-light">
              Your order <strong className="text-neutral-700 font-mono">{orderCreated.orderNumber}</strong> has been received. Our bench jewelers are checking GIA markings and preparing your customized casting.
            </p>
          </div>

          <div className="border border-gold/15 bg-[#faf8f5] p-5 max-w-md mx-auto text-xs font-sans text-neutral-600 text-left space-y-2">
            <p><strong>Order Number:</strong> <span className="font-mono text-neutral-800">{orderCreated.orderNumber}</span></p>
            <p><strong>Consignee Name:</strong> {shippingName}</p>
            <p><strong>Overnight Delivery Address:</strong> {shippingAddress}, {shippingCity}</p>
            <p><strong>Subtotal Value:</strong> {formatPrice(orderCreated.total)}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push(`/tracking/${orderCreated.id}`)}
              className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all duration-300"
            >
              Track Bench Progress Live
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-500 hover:bg-neutral-50 bg-white"
            >
              Return to Store
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Clean UI icons ChevronRight and ChevronLeft imported locally
function ChevronRight({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function ChevronLeft({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}
