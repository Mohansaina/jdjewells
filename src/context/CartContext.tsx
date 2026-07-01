'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VdbDiamond } from '@/services/vdb';

export interface CartItem {
  id: string; // Unique instance id
  productId?: string;
  productTitle?: string;
  productImage?: string;
  diamondId?: string;
  diamondSpec?: string;
  diamondImage?: string;
  customConfig?: {
    category: string;
    shape: string;
    setting: string;
    metal: string;
    size: string;
    price: number;
    diamond?: VdbDiamond;
  };
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  type: 'product' | 'diamond';
  title: string;
  price: number;
  image: string;
  specSummary: string;
  diamondData?: VdbDiamond;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync with localStorage after mount (SSR safe)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jd_cart');
      const savedWishlist = localStorage.getItem('jd_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Local storage error:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('jd_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('jd_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    setCart((prev) => {
      // For custom configurations, generate a new item always
      if (item.customConfig) {
        return [...prev, { ...item, id: `item-${Date.now()}-${Math.random()}`, quantity: item.quantity || 1 } as CartItem];
      }

      // Check if product is already in cart
      const existingIdx = prev.findIndex((i) => i.productId === item.productId && !i.customConfig);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity || 1;
        return updated;
      }

      return [...prev, { ...item, id: `item-${Date.now()}`, quantity: item.quantity || 1 } as CartItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
