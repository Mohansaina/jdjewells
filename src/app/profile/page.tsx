'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useConfigurator } from '@/context/ConfiguratorContext';
import { useToast } from '@/context/ToastContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, ListOrdered, User, Settings, ShieldCheck, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function ProfileContent() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { setSelectedDiamond, setStep } = useConfigurator();
  const { success } = useToast();
  const { user, openAuthModal, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Active tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'configs' | 'details'>('wishlist');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Sync tab with URL search parameter if any
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders') setActiveTab('orders');
    if (tabParam === 'wishlist') setActiveTab('wishlist');
    if (tabParam === 'details') setActiveTab('details');
  }, [searchParams]);

  // Load orders history from API
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            // Sort by newest first
            data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(data);
          }
        } catch (e) {
          console.error("Error loading order logs:", e);
        }
        setLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [activeTab]);

  // Handle wishlist add to cart
  const handleWishlistAddToCart = (item: any) => {
    if (item.type === 'diamond' && item.diamondData) {
      // Direct attach and redirect
      setSelectedDiamond(item.diamondData);
      setStep(6);
      router.push('/configurator');
    } else {
      addToCart({
        productId: item.id,
        productTitle: item.title,
        price: item.price,
        productImage: item.image,
        diamondSpec: item.specSummary
      });
      success(`${item.title} has been added to your shopping bag!`);
    }
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-neutral-400 font-sans tracking-widest uppercase font-semibold">
        Loading Account Studio...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gold/15 pb-6">
        <span className="text-[10px] tracking-widest text-gold-600 font-bold uppercase block">Customer Studio</span>
        <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900">Your Account</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <nav className="bg-white border border-neutral-200 divide-y divide-neutral-100 text-xs font-sans font-semibold tracking-widest uppercase text-neutral-600">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full py-4 px-5 text-left transition-colors flex items-center gap-3 ${
              activeTab === 'wishlist' ? 'text-gold-700 bg-gold-50/20 border-l-2 border-gold-500 font-bold' : 'hover:bg-neutral-50'
            }`}
          >
            <Heart className="h-4.5 w-4.5 text-neutral-400" /> Wishlist ({wishlist.length})
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full py-4 px-5 text-left transition-colors flex items-center gap-3 ${
              activeTab === 'orders' ? 'text-gold-700 bg-gold-50/20 border-l-2 border-gold-500 font-bold' : 'hover:bg-neutral-50'
            }`}
          >
            <ListOrdered className="h-4.5 w-4.5 text-neutral-400" /> Orders History
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`w-full py-4 px-5 text-left transition-colors flex items-center gap-3 ${
              activeTab === 'details' ? 'text-gold-700 bg-gold-50/20 border-l-2 border-gold-500 font-bold' : 'hover:bg-neutral-50'
            }`}
          >
            <User className="h-4.5 w-4.5 text-neutral-400" /> Account Details
          </button>
          
          <Link
            href="/admin"
            className="w-full py-4 px-5 text-left hover:bg-neutral-50 transition-colors flex items-center gap-3 border-t border-gold/15"
          >
            <Settings className="h-4.5 w-4.5 text-neutral-400" /> Administrative Panel
          </Link>
        </nav>

        {/* Content Area */}
        <div className="md:col-span-3">

          {/* TAB 1: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-3 font-semibold">
                Saved Favorites ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-white border border-neutral-200">
                  <Heart className="h-10 w-10 text-neutral-300 mx-auto stroke-[1.2]" />
                  <p className="text-xs text-neutral-500">Your wishlist is empty.</p>
                  <Link href="/products" className="inline-block px-5 py-2 text-[10px] tracking-widest uppercase font-semibold gold-gradient text-white">
                    Explore Jewelry
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white border border-neutral-200 flex flex-col justify-between group relative">
                      
                      {/* Close cross */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2 right-2 text-neutral-300 hover:text-red-500 transition-colors p-1 z-10"
                        title="Remove"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>

                      {/* Image Thumbnail */}
                      <div className="aspect-square bg-gradient-to-b from-[#faf9f6] to-[#f2efea] p-6 flex items-center justify-center border-b border-neutral-100">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg';
                          }}
                          className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow-sm brightness-105" 
                        />
                      </div>

                      {/* Spec summary */}
                      <div className="p-4 space-y-4">
                        <div className="space-y-0.5 text-xs">
                          <h4 className="font-serif font-semibold text-neutral-900 leading-tight">{item.title}</h4>
                          <p className="text-[10px] text-neutral-400 font-sans">{item.specSummary}</p>
                          <span className="text-xs font-bold text-neutral-800 block pt-1.5">{formatPrice(item.price)}</span>
                        </div>

                        <button
                          onClick={() => handleWishlistAddToCart(item)}
                          className="w-full py-2 text-[9px] uppercase tracking-widest font-semibold gold-gradient text-white hover:gold-gradient-hover text-center"
                        >
                          {item.type === 'diamond' ? 'Attach to Config' : 'Add to Bag'}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-3 font-semibold">
                Order Log History
              </h3>

              {loadingOrders ? (
                <div className="py-20 text-center text-xs text-neutral-400">Loading order log history...</div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center space-y-3 bg-white border border-neutral-200">
                  <ListOrdered className="h-10 w-10 text-neutral-300 mx-auto stroke-[1.2]" />
                  <p className="text-xs text-neutral-500">No previous orders found.</p>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-white border border-neutral-200 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <span className="font-mono font-bold text-neutral-900">{ord.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-50 border border-gold-200/50 text-gold-700 font-semibold tracking-wider uppercase">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400">Placed: {new Date(ord.createdAt).toLocaleDateString()}</p>
                        <p className="text-neutral-500 mt-1 font-semibold">{formatPrice(ord.total)}</p>
                      </div>
                      
                      <Link
                        href={`/tracking/${ord.id}`}
                        className="px-4 py-2 text-[10px] uppercase font-semibold tracking-widest border border-gold-300 text-gold-700 hover:bg-gold-50/50 transition-all flex items-center gap-1 bg-white"
                      >
                        Track Progress <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in bg-white border border-neutral-200 p-6 font-sans text-xs text-neutral-600">
              <h3 className="font-serif text-lg tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-3 font-semibold mb-4">
                Registry Credentials
              </h3>

              {user ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">Account Holder</span>
                      <p className="font-semibold text-neutral-900 text-sm">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">Account Privilege</span>
                      <p className="font-bold text-gold-600 tracking-wider uppercase">
                        {user.role === 'ADMIN' ? 'ADMINISTRATIVE PRIVILEGE' : 'PREMIUM COLLECTOR'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">Mailing Address</span>
                    <p className="font-medium text-neutral-800">{user.email}</p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-neutral-400">
                    <p className="flex items-center gap-1.5"><ShieldCheck className="h-4.5 w-4.5 text-gold-500" /> Account authenticated via J&D Jewellers London Registry.</p>
                    <button
                      onClick={logout}
                      className="px-4 py-2 bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors uppercase font-bold tracking-wider rounded-sm flex items-center gap-1.5"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <User className="h-10 w-10 text-neutral-300 mx-auto stroke-[1.2]" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-base uppercase text-neutral-900 tracking-wider">No Active Session</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Sign in or create an account to view your private registry credentials and saved preferences.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="px-6 py-2.5 text-[10px] tracking-widest uppercase font-bold gold-gradient text-white shadow-sm"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="px-6 py-2.5 text-[10px] tracking-widest uppercase font-bold border border-gold-400 text-gold-700 hover:bg-gold-50/50 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-neutral-400 font-sans tracking-widest uppercase font-semibold">Loading Account Studio...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

// Clean local X icon
function X({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
