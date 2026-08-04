'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, signup } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      if (authModalMode === 'signup') {
        const res = await signup(name, email, password);
        if (res.success) {
          success(`Welcome to J&D Jewellers, ${name}! Your account is ready.`);
          resetForm();
        } else {
          setFormError(res.error || 'Failed to create account.');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          success('Welcome back! You are now logged in.');
          resetForm();
        } else {
          setFormError(res.error || 'Invalid email or password.');
        }
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setFormError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fcfbf9] border border-gold-400/30 rounded-2xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header decoration bar */}
        <div className="h-1.5 w-full gold-gradient" />

        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();
            closeAuthModal();
          }}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 rounded-full hover:bg-neutral-100"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.25em] font-bold text-gold-600 uppercase">
              <Sparkles className="w-3 h-3 text-gold-500" /> Private Collector Registry
            </span>
            <h2 className="font-serif text-2xl tracking-widest text-neutral-900 uppercase">
              {authModalMode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              {authModalMode === 'signup' 
                ? 'Register to save custom ring configurations, wishlist favorites, and track orders.'
                : 'Sign in to access your luxury jewelry vault and private account details.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-neutral-200 text-xs font-semibold tracking-wider uppercase">
            <button
              onClick={() => {
                setFormError('');
                setAuthModalMode('login');
              }}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                authModalMode === 'login'
                  ? 'border-gold-500 text-gold-700 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setFormError('');
                setAuthModalMode('signup');
              }}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                authModalMode === 'signup'
                  ? 'border-gold-500 text-gold-700 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Alert Error */}
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="font-bold">Error:</span> {formError}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name field (Signup only) */}
            {authModalMode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohan Saina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-250 rounded-xl focus:outline-none focus:border-gold-500 transition-colors text-neutral-800 placeholder-neutral-400"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-250 rounded-xl focus:outline-none focus:border-gold-500 transition-colors text-neutral-800 placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-600">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder={authModalMode === 'signup' ? 'At least 6 characters' : 'Enter password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-250 rounded-xl focus:outline-none focus:border-gold-500 transition-colors text-neutral-800 placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-semibold uppercase tracking-widest text-[11px] text-white gold-gradient hover:gold-gradient-hover rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {authModalMode === 'signup' ? 'Create My Account' : 'Sign In To Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-center text-[10px] text-neutral-400 gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-500" /> Secure 256-bit encrypted authentication.
          </div>

        </div>
      </div>
    </div>
  );
}
