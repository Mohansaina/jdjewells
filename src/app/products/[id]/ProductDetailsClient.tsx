'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Sparkles, Star, ShieldCheck, HelpCircle, Truck, Heart, ArrowRight, CornerDownRight } from 'lucide-react';

const modelPreviews: Record<string, { image: string; title: string; desc: string; specs?: string }[]> = {
  'rings': [
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      title: 'Eternity Bands Fit & Scale',
      desc: 'Our eternity bands are designed with a low-profile comfort inner court to sit flush against engagement mounts.',
      specs: 'Model wearing size 6.0 eternity band.'
    },
    {
      image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=800&auto=format&fit=crop',
      title: 'Diamond Brilliance Display',
      desc: 'Continuous round brilliant-cut diamonds catch light from all directions, creating infinite fire.',
      specs: 'Total 2.5 carats round brilliant stones.'
    }
  ],
  'engagement rings': [
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      title: 'Solitaire Setting Height',
      desc: 'Our four-prong setting elevates the center stone gracefully, allowing maximum light passage from underneath.',
      specs: 'Model wearing size 6.5 solitaire setting.'
    },
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      title: 'Dynamic Stack Preview',
      desc: 'The clean cathedral shoulders stack seamlessly next to flat-edge court wedding bands.',
      specs: 'Shown with 1.5ct cushion center stone.'
    }
  ],
  'wedding bands': [
    {
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      title: 'Solid Court Band Scale',
      desc: 'A 4mm rounded comfort-fit wedding band showing weight and profile thickness on hand.',
      specs: 'Shown on size 6.5 finger in yellow gold.'
    },
    {
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      title: 'Matching Set Synergy',
      desc: 'Hand-burnished satin-finished wedding bands designed to pair with traditional engagement styles.',
      specs: 'Pairing illustration of matching bands.'
    }
  ],
  'earrings': [
    {
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop',
      title: 'Huggie Hoops Drop Proportion',
      desc: '35mm diameter gold hoops frame the face and hang naturally, showing soft evening ambient reflection.',
      specs: 'Hoops shown on ear close up.'
    }
  ],
  'bracelets': [
    {
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
      title: 'Tennis Link Drape',
      desc: 'Fluid tennis link structures rest naturally against the wrist bone, showing the double security latch.',
      specs: 'Total 5.5 carats diamond tennis bracelet.'
    }
  ],
  'necklaces': [
    {
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      title: 'Chain Length Scale (22")',
      desc: 'A heavy 12mm Cuban link sits at the neck collarbone, illustrating link thickness and polish facets.',
      specs: 'Rope chain styling preview.'
    }
  ],
  'pendants': [
    {
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      title: 'Nameplate Pendant Drop',
      desc: 'The custom bail is fitted on a rope chain showing pendant dimensions relative to casual shirt necklines.',
      specs: 'Initial nameplate pendant scale.'
    }
  ]
};

const defaultPreviews = [
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    title: 'Bespoke Atelier Fit',
    desc: 'Custom-tailored diamond settings molded directly for maximum light capture.',
    specs: 'Handcrafted luxury pieces.'
  }
];

interface ProductDetailsClientProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    material: string;
    price: number;
    image: string;
    thumbnails: string[];
    rating: number;
    reviewsCount: number;
    specs: string; // JSON string
    care?: string;
    videoUrl?: string;
  };
  reviews: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export default function ProductDetailsClient({ product, reviews: initialReviews }: ProductDetailsClientProps) {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [currency, setCurrency] = useState('EU / EUR');

  React.useEffect(() => {
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
  
  const categoryKey = product.category ? product.category.toLowerCase() : '';
  const previews = modelPreviews[categoryKey] || defaultPreviews;
  
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedMetal, setSelectedMetal] = useState('White Gold');
  const [selectedSize, setSelectedSize] = useState('6.5');
  const [reviews, setReviews] = useState(initialReviews);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-dismiss toast
  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
  // 360 degree rotation simulation states
  const [is360Active, setIs360Active] = useState(false);
  const [sheenOffset, setSheenOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef({ x: 0, offset: 0 });
  const visualizerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = visualizerRef.current;
    if (!el) return;

    const preventDefault = (e: TouchEvent) => {
      if (is360Active) {
        e.preventDefault();
      }
    };

    // Use passive: false to allow e.preventDefault() to actually block page scroll
    el.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      el.removeEventListener('touchmove', preventDefault);
    };
  }, [is360Active]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!is360Active) return;
    e.preventDefault(); // Prevent browser from triggering native text selection or ghost card image drag-and-drop
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, offset: sheenOffset };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const diffX = e.clientX - dragStartRef.current.x;
    const sensitivity = 4; // drag sensitivity factor
    const newOffset = Math.max(-40, Math.min(40, dragStartRef.current.offset + diffX / sensitivity));
    setSheenOffset(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Reviews input states
  const [revAuthor, setRevAuthor] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Parse specifications
  let specsObj: Record<string, string> = {};
  try {
    specsObj = JSON.parse(product.specs);
  } catch (e) {
    console.error("Specs parsing error:", e);
  }

  // Affirm split calculation
  const affirmInstallment = Math.round(product.price / 4);

  const handleAddToBag = () => {
    addToCart({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      price: product.price,
      diamondSpec: `${selectedMetal} • Size ${selectedSize}`
    });
    setToastMessage(`${product.title} added to your shopping bag!`);
    setShowToast(true);
    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

  const handleToggleWishlist = () => {
    addToWishlist({
      id: product.id,
      type: 'product',
      title: product.title,
      price: product.price,
      image: product.image,
      specSummary: `${product.material} • ${selectedMetal}`
    });
    setToastMessage(`${product.title} saved to your wishlist.`);
    setShowToast(true);
  };

  // Submit reviews
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor || !revComment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          author: revAuthor,
          rating: revRating,
          comment: revComment
        })
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [newReview, ...prev]);
        setReviewSuccess(true);
        setRevAuthor('');
        setRevComment('');
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
    setIsSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Product Information Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Viewer */}
        <div className="lg:col-span-7 space-y-4 flex flex-col items-center">
          
          {/* Main Visual box */}
          <div 
            ref={visualizerRef}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={`relative w-full max-w-[440px] aspect-[4/5] border border-gold-400/20 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl group select-none touch-none transition-colors duration-300 bg-gradient-to-b from-[#faf8f5] to-[#f2ede0]`}
          >
            
            {!is360Active ? (
              <div className="relative w-full h-full p-3 flex items-center justify-center pointer-events-none select-none">
                <img
                  src={activeImage}
                  alt={product.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-103 filter drop-shadow-md select-none"
                />
              </div>
            ) : (
              // 360 degree vector simulated view
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={`w-full h-full flex items-center justify-center relative select-none touch-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
              >
                {/* 2D Container wrapping only the image and sheen overlay (translates and tilts sideways inside the card) */}
                <div 
                  className="relative w-full h-full p-3 flex items-center justify-center pointer-events-none select-none"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    transform: `translateX(${sheenOffset * 1.5}px) rotateY(${sheenOffset * 0.8}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    perspective: '1000px',
                  }}
                >
                  {/* 1. The product image itself, blends cleanly without showing borders */}
                  <img
                    src={product.image}
                    alt={product.title}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className="w-full h-full object-cover rounded-2xl filter drop-shadow-lg select-none"
                  />

                  {/* 2. The sheen overlay, matched to the rotation angle and applying linear reflection shine */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay select-none"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      background: `linear-gradient(to right, transparent 20%, rgba(255, 255, 255, 0.4) ${50 - sheenOffset * 0.8}%, transparent 80%)`,
                      transition: isDragging ? 'none' : 'background 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                      WebkitMaskImage: `url('${product.image}')`,
                      maskImage: `url('${product.image}')`,
                      WebkitMaskSize: 'cover',
                      maskSize: 'cover',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat'
                    }}
                  />
                </div>
                
                {/*twinkle sparkle*/}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-sparkle text-white pointer-events-none">
                  <Sparkles className="h-4 w-4 fill-white" />
                </div>

                {/* Drag instruction overlay */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-[#e7d3a2] text-[8px] uppercase tracking-widest px-3.5 py-1.5 rounded-full pointer-events-none font-sans font-bold flex items-center gap-1.5 shadow-sm border border-gold/15 select-none animate-pulse">
                  <span>← Drag Left / Right to Shine →</span>
                </div>
              </div>
            )}

            {/* Simulated Live Rendering Banner */}
            <div className="absolute top-4 left-4 bg-white/70 backdrop-blur-xs border border-gold/25 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
              <span className="text-[8px] tracking-widest font-bold text-gold-600 uppercase font-sans">HD Showcase</span>
            </div>

            {/* Play HD Video button if videoUrl exists */}
            {product.videoUrl && (
              <button
                onClick={() => {
                  window.open(product.videoUrl, '_blank');
                }}
                className="absolute bottom-4 left-4 px-3 py-1.5 text-[9px] uppercase tracking-widest font-semibold font-sans border bg-white/80 border-neutral-300 text-neutral-600 hover:bg-white flex items-center gap-1 cursor-pointer"
              >
                <span>▶ Play Video</span>
              </button>
            )}

            {/* Toggle 360 visualizer */}
            <button
              onClick={() => setIs360Active(!is360Active)}
              className={`absolute bottom-4 right-4 px-3 py-1.5 text-[9px] uppercase tracking-widest font-semibold font-sans border transition-colors ${
                is360Active
                  ? 'bg-gold-500 border-gold-600 text-white'
                  : 'bg-white/80 border-neutral-300 text-neutral-600 hover:bg-white'
              }`}
            >
              {is360Active ? 'Image view' : '360° Studio Sheen'}
            </button>
          </div>

          {/* 360 Rotation Control slider */}
          {is360Active && (
            <div className="w-full max-w-md flex flex-col items-center gap-1 bg-[#faf8f5] border border-gold/15 p-3">
              <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans font-bold">Shift Light reflection angle</label>
              <input
                type="range"
                min="-40"
                max="40"
                value={sheenOffset}
                onChange={(e) => setSheenOffset(parseInt(e.target.value))}
                className="w-4/5 h-1 accent-gold-500 bg-neutral-200 cursor-ew-resize appearance-none"
              />
            </div>
          )}

          {/* Thumbnails grid */}
          <div className="flex gap-2">
            {product.thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveImage(thumb); setIs360Active(false); }}
                className={`w-16 h-16 border bg-white p-1 rounded-sm transition-colors flex items-center justify-center ${
                  activeImage === thumb && !is360Active ? 'border-gold-500 bg-gold-50/10' : 'border-neutral-200'
                }`}
              >
                <img src={thumb} alt="thumbnail" className="max-w-full max-h-full object-contain" />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Specification panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1.5 border-b border-gold/10 pb-4">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans font-medium">
              {product.category} • {product.material}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-wide font-normal">
              {product.title}
            </h1>
            
            {/* Reviews count info */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
              <div className="flex text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-neutral-200'}`}
                  />
                ))}
              </div>
              <span className="font-semibold text-neutral-800">{product.rating}</span>
              <span>({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price & Financing Block */}
          <div className="space-y-1 bg-[#faf8f5] border border-gold/15 p-4">
            <div className="text-xl font-bold text-neutral-900">{formatPrice(product.price)}</div>
            <div className="text-[10px] text-neutral-400 font-sans uppercase tracking-widest">
              Or <strong className="text-neutral-800">{formatPrice(product.price / 4)} / month</strong> interest-free with Affirm.
            </div>
          </div>

          {/* Configuration options (Metal & Sizes) */}
          <div className="space-y-4 border-b border-neutral-100 pb-6">
            
            {/* Metal select */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold block">Select Metal</label>
              <div className="flex gap-2">
                {['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum'].map((metalOpt) => (
                  <button
                    key={metalOpt}
                    onClick={() => setSelectedMetal(metalOpt)}
                    className={`px-3 py-2 border text-[10px] uppercase tracking-wider font-semibold transition-all ${
                      selectedMetal === metalOpt
                        ? 'border-gold-500 bg-gold-50/20 text-gold-700 font-bold'
                        : 'border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    {metalOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Size select */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold">Ring Size</label>
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 hover:text-gold-500 cursor-pointer font-semibold underline underline-offset-2">Size Guide</span>
              </div>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs text-neutral-700 focus:outline-none"
              >
                {Array.from({ length: 17 }, (_, i) => (4 + i * 0.5).toFixed(1)).map((sz) => (
                  <option key={sz} value={sz}>Size {sz}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Checkout CTA */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleAddToBag}
              className="w-full py-4 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Add to Shopping Bag
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className="w-full py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Heart className="h-4 w-4" /> Save to Wishlist
            </button>
          </div>

          {/* Specifications collapse box */}
          <div className="bg-white border border-neutral-200 p-5 space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2 font-semibold">
              Specifications
            </h4>
            <table className="w-full text-xs font-sans text-neutral-600">
              <tbody className="divide-y divide-neutral-100">
                {Object.entries(specsObj).map(([key, val]) => (
                  <tr key={key} className="flex justify-between py-2">
                    <td className="text-neutral-400 lowercase first-letter:uppercase">{key}</td>
                    <td className="font-semibold text-neutral-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Jewelry care details */}
          {product.care && (
            <div className="bg-[#faf8f5] border border-gold/15 p-4 text-xs font-sans text-neutral-500 leading-relaxed space-y-1">
              <h5 className="font-serif text-[10px] uppercase tracking-widest text-neutral-800 font-semibold">Jewelry Care</h5>
              <p className="font-light">{product.care}</p>
            </div>
          )}

        </div>

      </div>

      {/* On-Model Showcase Section */}
      <section className="border-t border-gold/15 pt-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold-600 font-bold block">Atelier Fit Showcase</span>
          <h2 className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-neutral-900">
            See How It Wears
          </h2>
          <p className="text-neutral-500 font-sans text-xs tracking-wider font-light leading-relaxed">
            Real-life scale, proportions, and lighting reflection of our pieces, photographed in our London studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {previews.map((preview, idx) => (
            <div 
              key={idx}
              className="group bg-[#fcfbf9] border border-gold/10 overflow-hidden flex flex-col md:flex-row hover:shadow-xl hover:border-gold/20 transition-all duration-300"
            >
              {/* Image box */}
              <div className="md:w-1/2 aspect-square relative overflow-hidden bg-neutral-100 flex items-center justify-center">
                <img
                  src={preview.image}
                  alt={preview.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                />
              </div>
              {/* Description box */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4 bg-white">
                <div className="space-y-2">
                  <h3 className="font-serif text-base text-neutral-900 group-hover:text-gold-600 transition-colors font-medium">
                    {preview.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans font-light leading-relaxed">
                    {preview.desc}
                  </p>
                </div>
                {preview.specs && (
                  <div className="border-t border-neutral-100 pt-3 flex items-center gap-1 text-[10px] uppercase font-sans tracking-wider text-gold-600 font-bold">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <span>{preview.specs}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Panel and submission Form */}
      <div className="border-t border-gold/15 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Reviews Listing */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="font-serif text-xl tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-3">
            Customer Reviews ({reviews.length})
          </h3>
          
          {reviews.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">No reviews yet for this piece. Be the first to share your thoughts.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="space-y-2 pb-6 border-b border-neutral-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif text-sm font-semibold text-neutral-800">{rev.author}</span>
                    <span className="text-[10px] text-neutral-400 font-sans">{rev.date || 'Recently'}</span>
                  </div>
                  
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Submission Form */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-serif text-sm tracking-widest uppercase text-neutral-900 font-semibold border-b border-neutral-100 pb-3">
            Write a Review
          </h3>
          
          {reviewSuccess ? (
            <div className="bg-gold-50 border border-gold-200 text-gold-800 text-xs p-4 text-center font-medium animate-fade-in">
              Thank you. Your review has been added to our public registry successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-sans">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Your Name</label>
                <input
                  type="text"
                  required
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  placeholder="E.g. Evelyn K."
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Rating</label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(parseInt(e.target.value))}
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Good)</option>
                  <option value="2">2 Stars (Fair)</option>
                  <option value="1">1 Star (Poor)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Your Comments</label>
                <textarea
                  required
                  rows={4}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Share details of the weight, sparkle, and fit of this piece..."
                  className="bg-[#faf8f5] border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3 text-[10px] font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-sm transition-all"
              >
                {isSubmittingReview ? 'Submitting Registry...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>

      </div>

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
