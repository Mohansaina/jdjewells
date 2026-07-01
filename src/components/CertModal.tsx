'use client';

import React from 'react';
import { X, Shield, Award, Check } from 'lucide-react';
import { VdbDiamond } from '@/services/vdb';

interface CertModalProps {
  diamond: VdbDiamond;
  onClose: () => void;
}

export default function CertModal({ diamond, onClose }: CertModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-neutral-800 w-full max-w-2xl h-[92vh] max-h-[750px] flex flex-col shadow-2xl animate-fade-in font-sans relative border-t-4 border-gold-500">
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
          aria-label="Close certificate"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-gold-200">
            <span className="font-serif text-2xl tracking-[0.2em] font-light text-neutral-900 block">
              {diamond.certificate}
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 block mt-1">
              GEMOLOGICAL INSTITUTE OF AMERICA
            </span>
            <h4 className="font-serif text-sm tracking-wider uppercase text-neutral-700 mt-4 font-medium">
              DIAMOND GRADING REPORT
            </h4>
            <div className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full mt-3">
              <Shield className="h-3.5 w-3.5 text-gold-600" />
              <span className="text-[9px] uppercase tracking-widest font-semibold text-gold-700">
                Official Registry Inscribed • Verified
              </span>
            </div>
          </div>

          {/* Certificate Main Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Left Column: Grade Specifications */}
            <div className="space-y-4">
              <h5 className="font-serif text-xs font-semibold tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-2">
                Grading Results
              </h5>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Carat Weight</span>
                  <span className="font-semibold text-neutral-800">{diamond.carat} Carat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Color Grade</span>
                  <span className="font-semibold text-neutral-800">{diamond.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Clarity Grade</span>
                  <span className="font-semibold text-neutral-800">{diamond.clarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cut Grade</span>
                  <span className="font-semibold text-neutral-800">{diamond.cut}</span>
                </div>
              </div>

              <h5 className="font-serif text-xs font-semibold tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-2 pt-2">
                Additional Grading Info
              </h5>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Polish</span>
                  <span className="font-medium text-neutral-800">{diamond.polish || 'Excellent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Symmetry</span>
                  <span className="font-medium text-neutral-800">{diamond.symmetry || 'Excellent'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Fluorescence</span>
                  <span className="font-medium text-neutral-800">{diamond.fluorescence || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Laser Inscription</span>
                  <span className="font-mono text-neutral-600 select-all">
                    {diamond.certificate} {diamond.certificateNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Proportion Layout Diagram */}
            <div className="flex flex-col items-center justify-between border-l border-gold-200/30 pl-0 md:pl-8">
              <div className="w-full text-center space-y-2">
                <h5 className="font-serif text-xs font-semibold tracking-widest uppercase text-neutral-900 border-b border-neutral-100 pb-2 text-left">
                  Proportion Mapping
                </h5>
                
                {/* SVG representing a profile wireframe diagram of a diamond */}
                <div className="flex justify-center py-4 bg-neutral-50 border border-neutral-100 rounded-sm">
                  <svg viewBox="0 0 100 70" className="w-[140px] h-[98px] text-neutral-300 stroke-neutral-400 stroke-[0.8] fill-none">
                    {/* Crown */}
                    <polygon points="10,25 30,5 70,5 90,25" />
                    {/* Pavilion */}
                    <polygon points="10,25 50,65 90,25" />
                    {/* Facet details */}
                    <line x1="30" y1="5" x2="30" y2="25" />
                    <line x1="70" y1="5" x2="70" y2="25" />
                    <line x1="50" y1="5" x2="50" y2="65" />
                    <line x1="30" y1="25" x2="50" y2="65" />
                    <line x1="70" y1="25" x2="50" y2="65" />
                    
                    {/* Label Dimensions */}
                    <text x="50" y="4" textAnchor="middle" fontSize="4.5" fill="#c5a029" fontWeight="bold">Table {diamond.tablePercent}%</text>
                    <text x="5" y="45" fontSize="4.5" fill="#c5a029" fontWeight="bold">Depth {diamond.depthPercent}%</text>
                    <text x="50" y="69" textAnchor="middle" fontSize="4" fill="#a1a1a1">Culet: None</text>
                  </svg>
                </div>
              </div>

              {/* Inscription stamp & QR verify code */}
              <div className="w-full flex justify-between items-end border-t border-neutral-100 pt-4 mt-4 text-[10px] text-neutral-500">
                <div className="space-y-1 text-left">
                  <p className="font-semibold text-neutral-800 uppercase tracking-wider">Security Features</p>
                  <p className="flex items-center gap-1"><Check className="h-3 w-3 text-green-600" /> Microprint Lines</p>
                  <p className="flex items-center gap-1"><Check className="h-3 w-3 text-green-600" /> Hologram Security Seal</p>
                  <p className="flex items-center gap-1"><Check className="h-3 w-3 text-green-600" /> Registry QR Cross-Check</p>
                </div>
                
                {/* Simulated QR block */}
                <div className="w-16 h-16 border border-neutral-300 p-1 bg-white flex flex-col justify-between items-center flex-shrink-0">
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-75">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-full ${
                          (i * 3 + 7) % 5 === 0 || i % 4 === 0 ? 'bg-black' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[7px] text-neutral-400 mt-1 uppercase font-bold tracking-tighter">Scan to Verify</span>
                </div>
              </div>
            </div>

          </div>

          {/* Certificate Specifications Footer */}
          <div className="pt-4 border-t border-neutral-100 text-center space-y-3">
            <div className="flex justify-center items-center gap-2 text-neutral-400 text-xs">
              <Award className="h-5 w-5 text-gold-500" />
              <span>GIA Report Number: <span className="font-mono text-neutral-700 font-semibold select-all">{diamond.certificateNo}</span></span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed text-justify px-2">
              The grading report represents the opinion of the GIA laboratory at the time of examination. GIA does not issue certifications as warranties, guarantees or valuations. To verify the details of the report, please visit the official GIA website and input the report registry number.
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 bg-[#faf8f5] border-t border-gold-15 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-sm transition-all"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
