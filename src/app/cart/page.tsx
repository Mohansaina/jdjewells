'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useConfigurator } from '@/context/ConfiguratorContext';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, HelpCircle, Gift, Sparkles, Truck, Lock } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { resetConfig } = useConfigurator();
  const [currency, setCurrency] = useState('EU / EUR');
  
  // Interactive Gift Options State
  const [wantsGiftWrap, setWantsGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Luxury Checkout Stepper */}
      <div className="w-full flex items-center justify-center font-sans">
        <div className="flex items-center justify-between w-full max-w-2xl text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-neutral-400">
          <div className="flex items-center gap-2 text-gold-600 font-bold">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gold-500 bg-gold-50 text-[10px]">1</span>
            <span>01 / Shopping Bag</span>
          </div>
          <div className="flex-1 h-px bg-gold-200/40 mx-4" />
          <div className="flex items-center gap-2 hover:text-gold-500 transition-colors">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border border-neutral-300 text-[10px]">2</span>
            <Link href="/checkout">02 / Secure Checkout</Link>
          </div>
          <div className="flex-1 h-px bg-neutral-200 mx-4" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border border-neutral-200 text-[10px] text-neutral-300">3</span>
            <span className="text-neutral-300">03 / Atelier Confirmation</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gold/15 pb-6 text-center space-y-2">
        <span className="text-[9px] tracking-[0.3em] text-gold-600 font-bold uppercase block">YOUR SELECTIONS</span>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.15em] uppercase text-neutral-900">Your Shopping Bag</h1>
        <div className="w-12 h-0.5 bg-gold-300 mx-auto mt-4" />
      </div>

      {cart.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-8 bg-[#fafbf9] border border-gold/10 rounded-lg max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-50 rounded-full scale-150 blur-xl opacity-50 animate-pulse" />
            <ShoppingBag className="relative h-14 w-14 text-gold-500 stroke-[1.1]" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl tracking-wider text-neutral-800">Your bag is currently empty</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Atelier pieces reside in your bag for up to 30 days. Explore our fine collection of certified natural diamonds, custom rings, pendants, and chains to begin your story.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/configurator"
              onClick={resetConfig}
              className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md hover:shadow-gold transition-all duration-300"
            >
              Build Custom Ring
            </Link>
            <Link
              href="/products"
              className="px-8 py-3.5 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>

          {/* Quick-Jump Luxury Categories */}
          <div className="w-full pt-10 border-t border-gold/10 mt-8">
            <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold block mb-6">Explore Signature Collections</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/products?category=rings" className="group p-4 bg-white border border-neutral-100 hover:border-gold-300 transition-all rounded hover:shadow-sm">
                <span className="font-serif text-sm text-neutral-800 group-hover:text-gold-600 transition-colors block">Bespoke Rings</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Elegant luxury settings</span>
              </Link>
              <Link href="/products?category=necklaces" className="group p-4 bg-white border border-neutral-100 hover:border-gold-300 transition-all rounded hover:shadow-sm">
                <span className="font-serif text-sm text-neutral-800 group-hover:text-gold-600 transition-colors block">Chains & Necklaces</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Solid gold links & tennis chains</span>
              </Link>
              <Link href="/products?category=pendants" className="group p-4 bg-white border border-neutral-100 hover:border-gold-300 transition-all rounded hover:shadow-sm">
                <span className="font-serif text-sm text-neutral-800 group-hover:text-gold-600 transition-colors block">Signature Pendants</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Custom VVS diamonds</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-neutral-200/80 rounded shadow-sm divide-y divide-neutral-100 overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-neutral-50/30 transition-colors">
                  
                  {/* Left Column: Image and specifications */}
                  <div className="flex gap-6 items-center flex-1">
                    <div className="w-24 h-24 bg-[#fafbf9] border border-gold/15 p-2.5 flex items-center justify-center flex-shrink-0 rounded shadow-inner">
                      <img 
                        src={item.customConfig ? (item.customConfig.diamond?.imageUrl || item.productImage || '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg') : (item.productImage || '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg')} 
                        alt="Jewelry Piece" 
                        className="max-w-full max-h-full object-contain filter drop-shadow" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-lg text-neutral-900 leading-tight font-medium">
                        {item.customConfig ? `Custom ${item.customConfig.category}` : item.productTitle}
                      </h3>
                      
                      {item.customConfig ? (
                        <div className="text-xs text-neutral-500 font-sans space-y-1">
                          <p className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-gold-400 rounded-full" />
                            {item.customConfig.metal} • {item.customConfig.setting} setting • Size {item.customConfig.size}
                          </p>
                          {item.customConfig.diamond && (
                            <p className="text-gold-600 font-medium flex items-center gap-1.5">
                              <Sparkles className="h-3 w-3 text-gold-500 animate-pulse" />
                              Vault Stone: {item.customConfig.diamond.carat}ct {item.customConfig.diamond.shape} ({item.customConfig.diamond.color}/{item.customConfig.diamond.clarity})
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400 font-sans tracking-wide">{item.diamondSpec}</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Qty, Subtotal and remove trigger */}
                  <div className="flex justify-between sm:justify-end items-center gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-200 rounded overflow-hidden shadow-sm bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        title="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-4 py-1.5 text-xs font-semibold text-neutral-800 bg-[#faf8f5]/50 min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Cost */}
                    <div className="text-right">
                      <span className="text-base font-bold text-neutral-900 block tracking-wide">{formatPrice(item.price * item.quantity)}</span>
                      <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">{formatPrice(item.price)} each</span>
                    </div>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50/50 rounded"
                      title="Remove Selection"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>

                  </div>

                </div>
              ))}
            </div>

            {/* Signature Packaging & Calling Gift Experience */}
            <div className="bg-white border border-gold/15 rounded p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                <Gift className="h-5 w-5 text-gold-600" />
                <h4 className="font-serif text-base text-neutral-900 uppercase tracking-wider font-semibold">Complementary Gift Services</h4>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={wantsGiftWrap}
                    onChange={(e) => setWantsGiftWrap(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-gold-600 focus:ring-gold-500 cursor-pointer accent-gold-500"
                  />
                  <div className="text-xs font-sans">
                    <span className="font-semibold text-neutral-800 group-hover:text-gold-600 transition-colors">Request Signature J&D Packaging</span>
                    <p className="text-neutral-400 mt-0.5 leading-relaxed">
                      Your order will arrive in a custom lacquer-finished dark packaging, complete with tissue wrap, plush protection insert, and a hand-tied satin ribbon.
                    </p>
                  </div>
                </label>

                {wantsGiftWrap && (
                  <div className="space-y-2 pt-2 animate-menu-slide-down">
                    <label htmlFor="gift-message-input" className="text-[10px] tracking-widest text-neutral-500 uppercase font-bold block">Calligraphy Message (Optional)</label>
                    <textarea
                      id="gift-message-input"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Write your personal message. We will print it in calligraphy on a wax-sealed envelope card..."
                      className="w-full border border-neutral-200 rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-400 font-sans"
                      rows={3}
                      maxLength={300}
                    />
                    <div className="text-right text-[10px] text-neutral-400">
                      {giftMessage.length}/300 characters
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Checkout Pricing Panel */}
          <div className="lg:col-span-4 bg-white border border-gold/15 rounded p-6 sm:p-8 space-y-6 shadow-md relative">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gold-400" />
            <h3 className="font-serif text-base uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-3 font-semibold text-center">
              Order Summary
            </h3>

            <div className="space-y-4 text-xs font-sans text-neutral-600">
              <div className="flex justify-between items-center">
                <span>Selections Subtotal</span>
                <span className="font-semibold text-neutral-800 text-sm">{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">Insured Express Overnight <Truck className="h-3.5 w-3.5 text-neutral-400" /></span>
                <span className="text-gold-600 font-bold uppercase tracking-wider">Free</span>
              </div>

              {wantsGiftWrap && (
                <div className="flex justify-between items-center text-neutral-500">
                  <span>Signature Packaging Set</span>
                  <span className="text-gold-600 font-semibold uppercase tracking-wider">Free</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Estimated VAT / Duties</span>
                <span className="font-semibold text-neutral-800">{formatPrice(0)}</span>
              </div>
              
              <div className="flex justify-between items-center text-base text-neutral-950 font-bold border-t border-neutral-100 pt-4 mt-2">
                <span className="font-serif tracking-wider uppercase">Grand Total</span>
                <span className="text-lg">{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="text-[10px] text-neutral-400 font-sans italic text-center pt-2 border-b border-neutral-100 pb-4">
                Or 4 interest-free split payments of {formatPrice(cartTotal / 4)} with Affirm.
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md hover:shadow-gold transition-all duration-300 rounded"
              >
                <Lock className="h-3.5 w-3.5" /> Secure Checkout
              </Link>
              <Link
                href="/products"
                className="w-full inline-block text-center py-3.5 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-500 hover:bg-neutral-50 transition-colors bg-white rounded"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Assurance Guarantees */}
            <div className="border-t border-neutral-100 pt-5 space-y-3 text-[10px] text-neutral-400 font-sans leading-relaxed">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-800 block">Insured Hand-Delivery</span>
                  <p className="mt-0.5">Every parcel is double-boxed, security-sealed, and sent via tracked courier with signature requirement.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-4.5 w-4.5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-800 block">Atelier Resizing Guarantee</span>
                  <p className="mt-0.5">Complementary ring sizing adjustments are honored up to 60 days following your purchase delivery.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
