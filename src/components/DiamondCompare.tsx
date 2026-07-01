'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { VdbDiamond } from '@/services/vdb';
import DiamondShapeSvg from './DiamondShapeSvg';
import CertModal from './CertModal';

interface DiamondCompareImageProps {
  imageUrl: string;
  shape: string;
}

function DiamondCompareImage({ imageUrl, shape }: DiamondCompareImageProps) {
  const [error, setError] = useState(false);

  if (error || !imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2.5 bg-neutral-100">
        <DiamondShapeSvg 
          shape={shape} 
          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(14,165,233,0.1)]"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={shape}
      onError={() => setError(true)}
      className="w-full h-full object-cover animate-fade-in"
    />
  );
}

interface DiamondCompareProps {
  diamonds: VdbDiamond[];
  onRemove: (id: string) => void;
  onClose: () => void;
  onAttach?: (diamond: VdbDiamond) => void;
}

export default function DiamondCompare({ diamonds, onRemove, onClose, onAttach }: DiamondCompareProps) {
  const [currency, setCurrency] = useState('EU / EUR');
  const [activeCert, setActiveCert] = useState<VdbDiamond | null>(null);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) setCurrency(savedCurrency);

    const handleCurrencyChange = () => {
      const updated = localStorage.getItem('currency') || 'EU / EUR';
      setCurrency(updated);
    };
    window.addEventListener('currency-change', handleCurrencyChange);
    return () => window.removeEventListener('currency-change', handleCurrencyChange);
  }, []);

  const formatPrice = (amount: number) => {
    const symbol = {
      'AE / AED': 'AED ',
      'GB / GBP': '£',
      'US / USD': '$',
      'EU / EUR': '€',
    }[currency] || '$';

    const rate = {
      'AE / AED': 3.67,
      'GB / GBP': 0.78,
      'US / USD': 1.0,
      'EU / EUR': 0.92,
    }[currency] || 1.0;

    const converted = amount * rate;
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (diamonds.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcfbf9] border border-gold/30 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="p-5 border-b border-gold/15 bg-[#faf8f5] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold-500" />
            <h3 className="font-serif text-lg tracking-widest uppercase text-neutral-900">Compare Diamonds</h3>
            <span className="text-xs font-sans text-neutral-400">({diamonds.length} of 3 selected)</span>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/15">
                <th className="py-4 font-serif text-xs uppercase text-neutral-400 w-1/4">Specification</th>
                {diamonds.map((dia) => (
                  <th key={dia.id} className="py-4 px-4 w-1/4 relative group">
                    <button
                      onClick={() => onRemove(dia.id)}
                      className="absolute top-1 right-2 text-neutral-400 hover:text-red-500 transition-colors p-1"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex flex-col items-center text-center mt-2">
                      <div className="w-14 h-14 bg-neutral-100 border border-gold/10 flex items-center justify-center rounded-lg overflow-hidden relative">
                        <DiamondCompareImage 
                          imageUrl={dia.imageUrl} 
                          shape={dia.shape} 
                        />
                      </div>
                      <span className="font-serif text-sm font-medium text-neutral-900 mt-2">
                        {dia.carat}ct {dia.shape}
                      </span>
                      <span className="text-gold-600 font-semibold mt-1">{formatPrice(dia.price)}</span>
                    </div>
                  </th>
                ))}
                {/* Pad columns if comparing less than 3 */}
                {Array.from({ length: 3 - diamonds.length }).map((_, idx) => (
                  <th key={`pad-${idx}`} className="py-4 px-4 w-1/4 text-center text-neutral-300 font-light border-dashed border-l border-gold/10">
                    <div className="flex flex-col items-center py-4">
                      <Plus className="h-6 w-6 stroke-[1.2] mb-1" />
                      <span className="text-[10px] uppercase tracking-wider">Add Diamond</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5 text-neutral-700">
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Carat Weight</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center font-semibold text-neutral-800">{d.carat} Carat</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Cut Quality</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center">{d.cut}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Color Grade</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center">{d.color}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Clarity Grade</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center">{d.clarity}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Lab Certification</td>
                {diamonds.map((d) => (
                  <td key={d.id} className="py-3.5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-neutral-800">{d.certificate}</span>
                      <button
                        onClick={() => setActiveCert(d)}
                        className="text-[9px] uppercase tracking-wider text-gold-600 hover:text-gold-700 font-bold underline cursor-pointer bg-transparent border-none p-0"
                      >
                        View Report
                      </button>
                    </div>
                  </td>
                ))}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Polish / Symmetry</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center text-neutral-500">{d.polish} / {d.symmetry}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Fluorescence</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center text-neutral-500">{d.fluorescence}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Measurements</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center text-neutral-500">{d.measLength} x {d.measWidth} x {d.measDepth} mm</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Table / Depth %</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center text-neutral-500">{d.tablePercent}% / {d.depthPercent}%</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-neutral-900">Certificate Number</td>
                {diamonds.map((d) => <td key={d.id} className="py-3.5 px-4 text-center text-neutral-400 font-mono select-all">{d.certificateNo}</td>)}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
              <tr>
                <td className="py-4"></td>
                {diamonds.map((dia) => (
                  <td key={dia.id} className="py-4 px-4 text-center">
                    {onAttach ? (
                      <button
                        onClick={() => {
                          onAttach(dia);
                          onClose();
                        }}
                        className="w-full py-2 text-[10px] uppercase font-semibold tracking-wider gold-gradient text-white hover:gold-gradient-hover shadow-sm transition-all duration-300"
                      >
                        Choose Stone
                      </button>
                    ) : (
                      <span className="text-neutral-400 italic text-[10px]">Comparative Review</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - diamonds.length }).map((_, i) => <td key={i} />)}
              </tr>
            </tbody>
          </table>
        </div>

        {activeCert && (
          <CertModal
            diamond={activeCert}
            onClose={() => setActiveCert(null)}
          />
        )}

      </div>
    </div>
  );
}
