'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { VdbService, VdbDiamond, VdbSearchParams } from '@/services/vdb';
import { useConfigurator } from '@/context/ConfiguratorContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import DiamondCompare from '@/components/DiamondCompare';
import CertModal from '@/components/CertModal';
import DiamondShapeSvg from '@/components/DiamondShapeSvg';
import { Search, SlidersHorizontal, Heart, Plus, Scale, Award, ArrowUpDown, ShieldCheck, HelpCircle, Settings, ExternalLink, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface DiamondCardImageProps {
  imageUrl: string;
  shape: string;
}

function DiamondCardImage({ imageUrl, shape }: DiamondCardImageProps) {
  const [error, setError] = useState(false);

  if (error || !imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-b from-[#faf9f6] to-[#f5f2ed]">
        <DiamondShapeSvg 
          shape={shape} 
          className="w-[58%] h-[58%] object-contain text-sky-500/80 stroke-[0.8] filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.06)]"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#faf9f6] to-[#f5f2ed] flex items-center justify-center">
      <img
        src={imageUrl}
        alt={`${shape} Diamond`}
        onError={() => setError(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Overlay Geometric Shape outline badge at the bottom-right */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-gold/25 px-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md z-10">
        <div className="w-3.5 h-3.5 flex items-center justify-center">
          <DiamondShapeSvg 
            shape={shape} 
            className="w-full h-full text-neutral-800"
          />
        </div>
        <span className="text-[8px] uppercase tracking-wider font-extrabold text-neutral-700">{shape}</span>
      </div>
    </div>
  );
}

interface DiamondSelectionImageProps {
  imageUrl: string;
  shape: string;
}

function DiamondSelectionImage({ imageUrl, shape }: DiamondSelectionImageProps) {
  const [error, setError] = useState(false);

  if (error || !imageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-2 bg-neutral-900/5">
        <DiamondShapeSvg 
          shape={shape} 
          className="w-[60%] h-[60%] text-neutral-850"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={shape}
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  );
}

function DiamondsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSelectedDiamond, setStep, getSettingPrice } = useConfigurator();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { warning } = useToast();

  // Currency States
  const [currency, setCurrency] = useState('EU / EUR');
  const [isMounted, setIsMounted] = useState(false);

  // Sync currency on mount
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

  // Search filter states
  const [diamonds, setDiamonds] = useState<VdbDiamond[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 1. Shapes
  const [shapes, setShapes] = useState<string[]>([]);
  const availableShapes = [
    'Round', 'Princess', 'Cushion', 'Oval', 'Pear', 'Emerald', 'Heart', 'Radiant', 'Asscher', 'Marquise', 'Old Cuts', 'Kite & Shields', 'Triangulars'
  ];

  // 2. Carat range
  const [caratMin, setCaratMin] = useState<number>(0.18);
  const [caratMax, setCaratMax] = useState<number>(30.0);

  // 3. Colour slider indices (L = 0 to D = 8)
  const colorsList = ['L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'];
  const [colorMinIdx, setColorMinIdx] = useState<number>(0);
  const [colorMaxIdx, setColorMaxIdx] = useState<number>(8);

  // 4. Clarity slider indices (SI2 = 0 to FL = 7)
  const claritiesList = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
  const [clarityMinIdx, setClarityMinIdx] = useState<number>(0);
  const [clarityMaxIdx, setClarityMaxIdx] = useState<number>(7);

  // 5. Cut slider indices (Good = 0 to Cupid's Ideal = 3)
  const cutsList = ['Good', 'Very Good', 'Excellent', "Cupid's Ideal"];
  const [cutMinIdx, setCutMinIdx] = useState<number>(0);
  const [cutMaxIdx, setCutMaxIdx] = useState<number>(3);

  // 6. Price range
  const [priceMin, setPriceMin] = useState<number>(500);
  const [priceMax, setPriceMax] = useState<number>(150000);

  // Origin lab, sorting & page
  const [lab, setLab] = useState<string>('Natural'); 
  const [sort, setSort] = useState<string>('price_asc');
  const [page, setPage] = useState<number>(1);

  // Collapsible Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [certFilters, setCertFilters] = useState<string[]>([]);
  const [polishFilters, setPolishFilters] = useState<string[]>([]);
  const [symFilters, setSymFilters] = useState<string[]>([]);
  const [fluorFilters, setFluorFilters] = useState<string[]>([]);
  const [qSearchText, setQSearchText] = useState<string>('');

  // Selected active diamond in sticky bottom bar
  const [activeSelection, setActiveSelection] = useState<VdbDiamond | null>(null);

  // Compare & Cert Modal states
  const [compareList, setCompareList] = useState<VdbDiamond[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeCert, setActiveCert] = useState<VdbDiamond | null>(null);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'cert' | 'polish' | 'sym' | 'fluor' | null>(null);

  const initializedRef = React.useRef(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize filters from query parameters
  useEffect(() => {
    if (initializedRef.current) return;

    const shapeParam = searchParams.get('shape');
    if (shapeParam) {
      const matched = availableShapes.find(s => s.toLowerCase() === shapeParam.toLowerCase());
      if (matched) {
        setShapes([matched]);
      }
    }
    const labParam = searchParams.get('lab');
    if (labParam) {
      if (labParam.toLowerCase() === 'natural') setLab('Natural');
      else if (labParam.toLowerCase() === 'labgrown' || labParam.toLowerCase() === 'lab grown' || labParam.toLowerCase() === 'lab-grown') setLab('Lab Grown');
    }

    initializedRef.current = true;
  }, [searchParams]);

  // Trigger search on filter changes
  useEffect(() => {
    const fetchDiamonds = async () => {
      setLoading(true);
      
      const activeColors = colorsList.slice(colorMinIdx, colorMaxIdx + 1);
      const activeClarities = claritiesList.slice(clarityMinIdx, clarityMaxIdx + 1);
      
      // Map Cupid's Ideal to Excellent / custom logic in query
      const rawCuts = cutsList.slice(cutMinIdx, cutMaxIdx + 1);
      const activeCuts = rawCuts.map(c => c === "Cupid's Ideal" ? 'Excellent' : c);

      const searchParams: VdbSearchParams = {
        shapes,
        colors: activeColors,
        clarities: activeClarities,
        cuts: activeCuts,
        caratMin,
        caratMax,
        priceMin,
        priceMax,
        lab,
        sort,
        page,
        limit: 12,
        certificates: certFilters,
        polishes: polishFilters,
        symmetries: symFilters,
        fluorescences: fluorFilters,
        q: qSearchText
      };
      
      try {
        const { diamonds: list, total } = await VdbService.search(searchParams);
        setDiamonds(list);
        setTotalCount(total);
        // Default selection to first item if current selection is null or not in list
        if (list.length > 0) {
          setActiveSelection(prev => {
            if (prev && list.some(d => d.id === prev.id)) return prev;
            return list[0];
          });
        } else {
          setActiveSelection(null);
        }
      } catch (e) {
        console.error("VDB query error:", e);
      }
      setLoading(false);
    };

    fetchDiamonds();
  }, [
    shapes, colorMinIdx, colorMaxIdx, clarityMinIdx, clarityMaxIdx, cutMinIdx, cutMaxIdx, 
    caratMin, caratMax, priceMin, priceMax, lab, sort, page, certFilters, polishFilters, symFilters, fluorFilters, qSearchText
  ]);

  // Reset filters
  const handleResetFilters = () => {
    setShapes([]);
    setCaratMin(0.18);
    setCaratMax(30.0);
    setColorMinIdx(0);
    setColorMaxIdx(8);
    setClarityMinIdx(0);
    setClarityMaxIdx(7);
    setCutMinIdx(0);
    setCutMaxIdx(3);
    setPriceMin(500);
    setPriceMax(150000);
    setLab('Natural');
    setSort('price_asc');
    setPage(1);
    setCertFilters([]);
    setPolishFilters([]);
    setSymFilters([]);
    setFluorFilters([]);
    setQSearchText('');
  };

  // Toggle selection lists
  const handleToggleShape = (val: string) => {
    setShapes(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    setPage(1);
  };

  const handleToggleAdvancedFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setList(prev => prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]);
    setPage(1);
  };

  // Compare List controls
  const handleToggleCompare = (diamond: VdbDiamond) => {
    setCompareList(prev => {
      if (prev.some(d => d.id === diamond.id)) {
        return prev.filter(d => d.id !== diamond.id);
      }
      if (prev.length >= 3) {
        warning("You can compare a maximum of 3 diamonds at a time.");
        return prev;
      }
      return [...prev, diamond];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setCompareList(prev => prev.filter(d => d.id !== id));
  };

  // Wishlist favorite controls
  const handleToggleWishlist = (diamond: VdbDiamond) => {
    if (isInWishlist(diamond.id)) {
      removeFromWishlist(diamond.id);
    } else {
      addToWishlist({
        id: diamond.id,
        type: 'diamond',
        title: `${diamond.carat}ct ${diamond.shape} Diamond`,
        price: diamond.price,
        image: diamond.imageUrl,
        specSummary: `${diamond.color}/${diamond.clarity} • ${diamond.cut} Cut • ${diamond.certificate}`,
        diamondData: diamond
      });
    }
  };

  // Attach stone to Configurator
  const handleAttachToConfig = (diamond: VdbDiamond) => {
    setSelectedDiamond(diamond);
    setStep(6); // Forward user directly to step 6 (Review)
    router.push('/configurator');
  };

  // Trigger booking appointment
  const handleBookAppointment = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-96 flex flex-col items-center justify-center text-center space-y-3">
        <span className="w-10 h-10 border-4 border-neutral-950 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans font-bold">Opening Vault Storage...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-sans tracking-widest uppercase pb-1 select-none">
        <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-neutral-500 font-medium">Loose Diamonds</span>
      </div>

      {/* Header and Compare trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gold/15 pb-6">
        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl tracking-widest uppercase text-neutral-900">Loose Diamonds</h1>
          <p className="text-xs text-neutral-500 font-light tracking-wide">Choose a diamond to complement the jewellery you wish to create...</p>
        </div>
        
        {/* Comparison status bar */}
        {compareList.length > 0 && (
          <button
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-md transition-all"
          >
            <Scale className="h-4 w-4" />
            Compare Diamonds ({compareList.length})
          </button>
        )}
      </div>

      <div className="space-y-6 animate-fade-in">
          
          {/* Category Tabs: Natural, Lab-Grown, Coloured, Gemstones */}
          <div className="flex border-b border-neutral-200 justify-start gap-8 font-sans text-[11px] tracking-widest uppercase font-bold text-neutral-400 select-none pb-0.5">
            {['Natural', 'Lab-Grown', 'Coloured', 'Gemstones'].map((tab) => {
              const value = tab === 'Lab-Grown' ? 'Lab Grown' : tab;
              const isActive = lab === value;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setLab(value);
                    setPage(1);
                  }}
                  className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-neutral-900 text-neutral-900 font-black'
                      : 'border-transparent hover:text-neutral-600'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* ========================================== */}
          {/* TOP HORIZONTAL FILTERS BLOCK    */}
          {/* ========================================== */}
          <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-xs space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              
              {/* COL 1: SHAPE GRID SELECTOR */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Shape <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  {shapes.length > 0 && (
                    <button onClick={() => setShapes([])} className="text-[9px] uppercase tracking-wider text-neutral-400 hover:text-gold-600 transition-colors font-semibold">
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableShapes.map((sh) => {
                    const isSelected = shapes.includes(sh);
                    return (
                      <button
                        key={sh}
                        onClick={() => handleToggleShape(sh)}
                        className={`flex flex-col items-center justify-between p-1.5 rounded border transition-all text-center aspect-square ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-50 text-neutral-950 font-bold scale-[1.03] shadow-xs'
                            : 'border-neutral-200 text-neutral-500 bg-white hover:bg-neutral-50/50 hover:border-neutral-300'
                        }`}
                      >
                        <div className="w-[60%] h-[60%] flex items-center justify-center">
                          <DiamondShapeSvg
                            shape={sh}
                            className={`w-full h-full object-contain ${
                              isSelected ? 'text-neutral-900 stroke-[1.2]' : 'text-neutral-400/80 stroke-[0.8]'
                            }`}
                          />
                        </div>
                        <span className="text-[8.5px] tracking-wide mt-1 block truncate max-w-full font-semibold">{sh}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: CARAT RANGE SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Carat <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-neutral-800">
                    {caratMin.toFixed(2)}ct - {caratMax.toFixed(2)}ct
                  </span>
                </div>
                
                <div className="relative pt-4 pb-2">
                  <div className="h-1 bg-neutral-200 rounded-lg relative">
                    <div 
                      className="absolute h-full bg-neutral-900 rounded-lg"
                      style={{
                        left: `${((caratMin - 0.18) / (30 - 0.18)) * 100}%`,
                        right: `${100 - ((caratMax - 0.18) / (30 - 0.18)) * 100}%`
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0.18"
                    max="30"
                    step="0.01"
                    value={caratMin}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val < caratMax) {
                        setCaratMin(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: caratMin > 15 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="0.18"
                    max="30"
                    step="0.01"
                    value={caratMax}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > caratMin) {
                        setCaratMax(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: caratMax < 15 ? 5 : 3 }}
                  />
                </div>

                <div className="flex gap-4 items-center text-xs font-sans pt-1">
                  <div className="relative flex-1">
                    <select
                      value={caratMin}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val < caratMax) {
                          setCaratMin(val);
                          setPage(1);
                        }
                      }}
                      className="w-full bg-[#faf8f5] border border-neutral-200 py-1.5 pl-2.5 pr-8 rounded-lg font-semibold font-sans text-neutral-800 appearance-none focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 cursor-pointer animate-none"
                    >
                      {[0.18, 0.30, 0.50, 0.70, 1.00, 1.50, 2.00, 3.00, 4.00, 5.00].map(v => (
                        <option key={v} value={v}>{v.toFixed(2)} ct</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  <span className="text-neutral-400 font-medium font-sans">to</span>
                  <div className="relative flex-1">
                    <select
                      value={caratMax}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val > caratMin) {
                          setCaratMax(val);
                          setPage(1);
                        }
                      }}
                      className="w-full bg-[#faf8f5] border border-neutral-200 py-1.5 pl-2.5 pr-8 rounded-lg font-semibold font-sans text-neutral-800 appearance-none focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 cursor-pointer animate-none"
                    >
                      {[1.00, 1.50, 2.00, 3.00, 4.00, 5.00, 10.00, 15.00, 20.00, 30.00].map(v => (
                        <option key={v} value={v}>{v.toFixed(2)} ct</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* COL 3: COLOUR RANGE SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Colour <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-800 font-bold">
                    {colorsList[colorMinIdx]} - {colorsList[colorMaxIdx]}
                  </span>
                </div>

                <div className="relative pt-4 pb-4">
                  <div className="h-1 bg-neutral-250 rounded-lg relative w-full">
                    <div 
                      className="absolute h-full bg-neutral-900 rounded-lg"
                      style={{
                        left: `${(colorMinIdx / (colorsList.length - 1)) * 100}%`,
                        right: `${100 - (colorMaxIdx / (colorsList.length - 1)) * 100}%`
                      }}
                    />
                    {colorsList.map((_, idx) => {
                      const percent = (idx / (colorsList.length - 1)) * 100;
                      const isActive = idx >= colorMinIdx && idx <= colorMaxIdx;
                      return (
                        <div
                          key={idx}
                          className={`absolute w-1.5 h-1.5 rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 ${
                            isActive ? 'bg-neutral-900' : 'bg-neutral-300'
                          }`}
                          style={{ left: `${percent}%` }}
                        />
                      );
                    })}
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max={colorsList.length - 1}
                    step="1"
                    value={colorMinIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < colorMaxIdx) {
                        setColorMinIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: colorMinIdx > 4 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={colorsList.length - 1}
                    step="1"
                    value={colorMaxIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > colorMinIdx) {
                        setColorMaxIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: colorMaxIdx < 4 ? 5 : 3 }}
                  />

                  <div className="flex justify-between text-[9px] text-neutral-400 mt-3.5 font-mono select-none px-1">
                    {colorsList.map((c, idx) => (
                      <span 
                        key={c}
                        onClick={() => {
                          if (idx < colorMinIdx) setColorMinIdx(idx);
                          else if (idx > colorMaxIdx) setColorMaxIdx(idx);
                          setPage(1);
                        }}
                        className={`cursor-pointer ${
                          idx >= colorMinIdx && idx <= colorMaxIdx ? 'text-neutral-900 font-bold' : ''
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COL 4: CLARITY RANGE SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Clarity <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-800 font-bold">
                    {claritiesList[clarityMinIdx]} - {claritiesList[clarityMaxIdx]}
                  </span>
                </div>

                <div className="relative pt-4 pb-4">
                  <div className="h-1 bg-neutral-250 rounded-lg relative w-full">
                    <div 
                      className="absolute h-full bg-neutral-900 rounded-lg"
                      style={{
                        left: `${(clarityMinIdx / (claritiesList.length - 1)) * 100}%`,
                        right: `${100 - (clarityMaxIdx / (claritiesList.length - 1)) * 100}%`
                      }}
                    />
                    {claritiesList.map((_, idx) => {
                      const percent = (idx / (claritiesList.length - 1)) * 100;
                      const isActive = idx >= clarityMinIdx && idx <= clarityMaxIdx;
                      return (
                        <div
                          key={idx}
                          className={`absolute w-1.5 h-1.5 rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 ${
                            isActive ? 'bg-neutral-900' : 'bg-neutral-300'
                          }`}
                          style={{ left: `${percent}%` }}
                        />
                      );
                    })}
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max={claritiesList.length - 1}
                    step="1"
                    value={clarityMinIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < clarityMaxIdx) {
                        setClarityMinIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: clarityMinIdx > 4 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={claritiesList.length - 1}
                    step="1"
                    value={clarityMaxIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > clarityMinIdx) {
                        setClarityMaxIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: clarityMaxIdx < 4 ? 5 : 3 }}
                  />

                  <div className="flex justify-between text-[9px] text-neutral-400 mt-3.5 font-mono select-none px-1">
                    {claritiesList.map((c, idx) => (
                      <span 
                        key={c} 
                        onClick={() => {
                          if (idx < clarityMinIdx) setClarityMinIdx(idx);
                          else if (idx > clarityMaxIdx) setClarityMaxIdx(idx);
                          setPage(1);
                        }}
                        className={`cursor-pointer ${
                          idx >= clarityMinIdx && idx <= clarityMaxIdx ? 'text-neutral-900 font-bold' : ''
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COL 5: CUT RANGE SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Cut <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-800 font-bold">
                    {cutsList[cutMinIdx]} - {cutsList[cutMaxIdx]}
                  </span>
                </div>

                <div className="relative pt-4 pb-4">
                  <div className="h-1 bg-neutral-250 rounded-lg relative w-full">
                    <div 
                      className="absolute h-full bg-neutral-900 rounded-lg"
                      style={{
                        left: `${(cutMinIdx / (cutsList.length - 1)) * 100}%`,
                        right: `${100 - (cutMaxIdx / (cutsList.length - 1)) * 100}%`
                      }}
                    />
                    {cutsList.map((_, idx) => {
                      const percent = (idx / (cutsList.length - 1)) * 100;
                      const isActive = idx >= cutMinIdx && idx <= cutMaxIdx;
                      return (
                        <div
                          key={idx}
                          className={`absolute w-1.5 h-1.5 rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 ${
                            isActive ? 'bg-neutral-900' : 'bg-neutral-300'
                          }`}
                          style={{ left: `${percent}%` }}
                        />
                      );
                    })}
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max={cutsList.length - 1}
                    step="1"
                    value={cutMinIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < cutMaxIdx) {
                        setCutMinIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900"
                    style={{ zIndex: cutMinIdx > 2 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={cutsList.length - 1}
                    step="1"
                    value={cutMaxIdx}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > cutMinIdx) {
                        setCutMaxIdx(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900"
                    style={{ zIndex: cutMaxIdx < 2 ? 5 : 3 }}
                  />

                  <div className="flex justify-between text-[9px] text-neutral-400 mt-3.5 font-sans select-none px-1">
                    {cutsList.map((c, idx) => (
                      <span 
                        key={c}
                        onClick={() => {
                          if (idx < cutMinIdx) setCutMinIdx(idx);
                          else if (idx > cutMaxIdx) setCutMaxIdx(idx);
                          setPage(1);
                        }}
                        className={`cursor-pointer truncate max-w-[50px] ${
                          idx >= cutMinIdx && idx <= cutMaxIdx ? 'text-neutral-900 font-bold' : ''
                        }`}
                        title={c}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COL 6: PRICE RANGE SLIDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 font-bold flex items-center gap-0.5">
                    Price <span className="text-[10px] text-neutral-400/80 font-normal">ⓘ</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-neutral-800">
                    {formatPrice(priceMin)} - {formatPrice(priceMax)}
                  </span>
                </div>

                <div className="relative pt-4 pb-2">
                  <div className="h-1 bg-neutral-200 rounded-lg relative">
                    <div 
                      className="absolute h-full bg-neutral-900 rounded-lg"
                      style={{
                        left: `${((priceMin - 500) / (150000 - 500)) * 100}%`,
                        right: `${100 - ((priceMax - 500) / (150000 - 500)) * 100}%`
                      }}
                    />
                  </div>
                  
                  <input
                    type="range"
                    min="500"
                    max="150000"
                    step="500"
                    value={priceMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val < priceMax) {
                        setPriceMin(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: priceMin > 75000 ? 5 : 3 }}
                  />
                  <input
                    type="range"
                    min="500"
                    max="150000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > priceMin) {
                        setPriceMax(val);
                        setPage(1);
                      }
                    }}
                    className="absolute inset-x-0 top-3 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-neutral-900"
                    style={{ zIndex: priceMax < 75000 ? 5 : 3 }}
                  />
                </div>
              </div>

            </div>

            {/* ADVANCED COLLAPSIBLE FILTER HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-neutral-100 relative">
              
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-bold font-sans tracking-widest text-neutral-800 hover:text-gold-600 transition-colors uppercase flex items-center gap-1.5"
                >
                  Advanced Filters {showAdvanced ? '«' : '»'}
                </button>
              </div>

              {/* Text search & Reset */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <button 
                  onClick={handleResetFilters} 
                  className="text-[9.5px] uppercase tracking-widest text-neutral-400 hover:text-gold-600 transition-colors font-bold whitespace-nowrap"
                >
                  Reset All
                </button>
              </div>

            </div>

            {/* ADVANCED COLLAPSIBLE DRAWER PANEL */}
            {showAdvanced && (
              <div className="border-t border-neutral-100 pt-5 flex flex-wrap items-center justify-between gap-4 animate-fade-in text-left">
                
                <div ref={dropdownRef} className="flex flex-wrap items-center gap-3.5">
                  {/* 1. CERTIFICATE DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'cert' ? null : 'cert')}
                      className="px-4 py-2 border border-neutral-200 text-[10px] font-bold text-neutral-700 tracking-wider uppercase bg-white hover:border-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Certificate {openDropdown === 'cert' ? '▲' : '▼'}
                    </button>
                    {openDropdown === 'cert' && (
                      <div className="absolute left-0 mt-1.5 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-30 space-y-2 animate-fade-in">
                        {['GIA', 'IGI', 'HRD', 'GCAL'].map(cert => (
                          <label key={cert} className="flex items-center gap-2.5 text-xs font-sans text-neutral-600 cursor-pointer hover:text-neutral-900 select-none">
                            <input
                              type="checkbox"
                              checked={certFilters.includes(cert)}
                              onChange={() => handleToggleAdvancedFilter(certFilters, setCertFilters, cert)}
                              className="rounded-sm border-neutral-300 text-neutral-800 focus:ring-neutral-400 w-3.5 h-3.5"
                            />
                            <span className="font-semibold">{cert}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. POLISH DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'polish' ? null : 'polish')}
                      className="px-4 py-2 border border-neutral-200 text-[10px] font-bold text-neutral-700 tracking-wider uppercase bg-white hover:border-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Polish {openDropdown === 'polish' ? '▲' : '▼'}
                    </button>
                    {openDropdown === 'polish' && (
                      <div className="absolute left-0 mt-1.5 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-30 space-y-2 animate-fade-in">
                        {['Excellent', 'Very Good', 'Good'].map(pol => (
                          <label key={pol} className="flex items-center gap-2.5 text-xs font-sans text-neutral-600 cursor-pointer hover:text-neutral-900 select-none">
                            <input
                              type="checkbox"
                              checked={polishFilters.includes(pol)}
                              onChange={() => handleToggleAdvancedFilter(polishFilters, setPolishFilters, pol)}
                              className="rounded-sm border-neutral-300 text-neutral-800 focus:ring-neutral-400 w-3.5 h-3.5"
                            />
                            <span className="font-semibold">{pol}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. SYMMETRY DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'sym' ? null : 'sym')}
                      className="px-4 py-2 border border-neutral-200 text-[10px] font-bold text-neutral-700 tracking-wider uppercase bg-white hover:border-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Symmetry {openDropdown === 'sym' ? '▲' : '▼'}
                    </button>
                    {openDropdown === 'sym' && (
                      <div className="absolute left-0 mt-1.5 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-30 space-y-2 animate-fade-in">
                        {['Excellent', 'Very Good', 'Good'].map(sym => (
                          <label key={sym} className="flex items-center gap-2.5 text-xs font-sans text-neutral-600 cursor-pointer hover:text-neutral-900 select-none">
                            <input
                              type="checkbox"
                              checked={symFilters.includes(sym)}
                              onChange={() => handleToggleAdvancedFilter(symFilters, setSymFilters, sym)}
                              className="rounded-sm border-neutral-300 text-neutral-800 focus:ring-neutral-400 w-3.5 h-3.5"
                            />
                            <span className="font-semibold">{sym}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. FLUORESCENCE DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === 'fluor' ? null : 'fluor')}
                      className="px-4 py-2 border border-neutral-200 text-[10px] font-bold text-neutral-700 tracking-wider uppercase bg-white hover:border-gold-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Fluorescence {openDropdown === 'fluor' ? '▲' : '▼'}
                    </button>
                    {openDropdown === 'fluor' && (
                      <div className="absolute left-0 mt-1.5 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 z-30 space-y-2 animate-fade-in">
                        {['None', 'Faint', 'Medium', 'Strong'].map(fl => (
                          <label key={fl} className="flex items-center gap-2.5 text-xs font-sans text-neutral-600 cursor-pointer hover:text-neutral-900 select-none">
                            <input
                              type="checkbox"
                              checked={fluorFilters.includes(fl)}
                              onChange={() => handleToggleAdvancedFilter(fluorFilters, setFluorFilters, fl)}
                              className="rounded-sm border-neutral-300 text-neutral-800 focus:ring-neutral-400 w-3.5 h-3.5"
                            />
                            <span className="font-semibold">{fl}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Text search input on the right */}
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by diamond or Certificate ID"
                    value={qSearchText}
                    onChange={(e) => { setQSearchText(e.target.value); setPage(1); }}
                    className="w-full bg-[#faf8f5] border border-neutral-200 pl-3 pr-8 py-2 text-xs text-neutral-700 rounded-lg focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400"
                  />
                  <Search className="h-4.5 w-4.5 text-neutral-400 absolute right-2.5 top-2.5" />
                </div>

              </div>
            )}

          </div>

          {/* ========================================== */}
          {/* RESULTS GRID LAYOUT (4 COLUMNS)             */}
          {/* ========================================== */}
          <section className="space-y-6">
            
            {/* Header Result Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-neutral-200 px-5 py-4 text-xs font-sans rounded-xl">
              <span className="text-neutral-500">
                Showing <strong className="text-neutral-800 font-bold">{diamonds.length}</strong> of <strong className="text-neutral-800 font-bold">{totalCount}</strong> matching vault stones.
              </span>

              <div className="flex items-center gap-4">
                {/* Sorting */}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 flex items-center gap-0.5"><ArrowUpDown className="h-3.5 w-3.5" /> Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="bg-[#faf8f5] border border-neutral-200 py-1 px-3 text-xs text-neutral-700 focus:outline-none rounded-sm font-semibold cursor-pointer"
                  >
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="carat_desc">Carat: High to Low</option>
                    <option value="carat_asc">Carat: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List results loading state */}
            {loading ? (
              <div className="h-[450px] flex flex-col items-center justify-center text-center space-y-4">
                <span className="w-10 h-10 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans font-bold">Loading diamonds...</p>
              </div>
            ) : diamonds.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-white border border-neutral-200 p-6 rounded-xl">
                <Search className="h-12 w-12 text-gold-300 stroke-[1.2]" />
                <div>
                  <p className="font-serif text-base text-neutral-800 tracking-wider">No matching diamonds found</p>
                  <p className="text-xs text-neutral-400 mt-1">Try resetting or broadening your filter parameters.</p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 text-[10px] font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:gold-gradient-hover shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {diamonds.map((dia) => {
                  const isHighlighted = activeSelection?.id === dia.id;
                  return (
                    <div
                      key={dia.id}
                      onClick={() => setActiveSelection(dia)}
                      className={`bg-white border flex flex-col justify-between hover:shadow-lg transition-all relative group cursor-pointer rounded-xl overflow-hidden ${
                        isHighlighted 
                          ? 'border-neutral-950 ring-1 ring-neutral-950 scale-[1.01]' 
                          : 'border-neutral-200'
                      }`}
                    >
                      {/* Comparison & Wishlist Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWishlist(dia);
                          }}
                          className={`p-1.5 rounded-full border bg-white/95 shadow-sm transition-colors ${
                            isInWishlist(dia.id)
                              ? 'border-red-200 text-red-500'
                              : 'border-neutral-200 hover:border-neutral-900 text-neutral-500 hover:text-neutral-900'
                          }`}
                          title={isInWishlist(dia.id) ? 'Saved' : 'Save to Favorites'}
                        >
                          <Heart className="h-4 w-4" fill={isInWishlist(dia.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(dia);
                          }}
                          className={`p-1.5 rounded-full border bg-white/95 shadow-sm transition-colors ${
                            compareList.some(d => d.id === dia.id)
                              ? 'border-neutral-900 text-neutral-900 font-bold'
                              : 'border-neutral-200 hover:border-neutral-900 text-neutral-500 hover:text-neutral-900'
                          }`}
                          title="Add to Compare"
                        >
                          <Scale className="h-4 w-4" />
                        </button>
                      </div>

                      {/* SAMPLE badge for mock items */}
                      <div className="absolute top-3 left-3 z-10 bg-amber-550/10 border border-amber-500/25 px-2 py-0.5 rounded-full text-[9px] tracking-wider uppercase font-bold text-amber-700">
                        {dia.lab}
                      </div>

                      {/* Diamond Visual Box */}
                      <div className="aspect-square bg-gradient-to-b from-[#faf9f6] to-[#f5f2ed] border-b border-neutral-100 flex items-center justify-center overflow-hidden relative group/img">
                        <DiamondCardImage 
                          imageUrl={dia.imageUrl} 
                          shape={dia.shape} 
                        />
                      </div>

                      {/* Card specifications & Buttons */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4 bg-white text-left">
                        
                        <div className="space-y-1.5">
                          <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-bold block">
                            {dia.lab === 'Lab Grown' ? 'Lab-Grown' : 'Natural'}
                          </span>
                          
                          <h4 className="font-serif text-sm font-semibold text-neutral-900 leading-tight">
                            {dia.carat.toFixed(2)} Carat {dia.shape}
                          </h4>
                          
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-sans">
                            {dia.color} Colour | {dia.clarity} Clarity | {dia.cut === 'Excellent' ? 'EX' : dia.cut === 'Very Good' ? 'VG' : 'GD'} Cut | {dia.certificate}
                          </p>

                          <p className="text-xs font-bold text-neutral-900 pt-1">
                            {formatPrice(dia.price)} <span className="text-[9px] font-normal text-neutral-400">ex VAT</span>
                          </p>
                        </div>

                        {/* More Info & ADD DIAMOND buttons */}
                        <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3.5 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCert(dia);
                            }}
                            className="py-2 text-[9px] uppercase tracking-widest font-bold border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 rounded-sm text-center flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Award className="h-3.5 w-3.5 text-neutral-500" /> GIA Certificate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAttachToConfig(dia);
                            }}
                            className="py-2 text-[9px] uppercase tracking-widest font-bold bg-neutral-900 text-white hover:bg-neutral-800 rounded-sm text-center transition-all"
                          >
                            Add Diamond
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination section */}
            {totalCount > 12 && (
              <div className="flex justify-center items-center gap-4 bg-white border border-neutral-200 py-3.5 text-xs font-sans mt-6 rounded-xl">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-4 py-1 font-bold uppercase tracking-widest ${
                    page === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Previous
                </button>
                <span className="text-neutral-500 font-semibold">Page {page} of {Math.ceil(totalCount / 12)}</span>
                <button
                  onClick={() => setPage(p => Math.min(Math.ceil(totalCount / 12), p + 1))}
                  disabled={page === Math.ceil(totalCount / 12)}
                  className={`px-4 py-1 font-bold uppercase tracking-widest ${
                    page === Math.ceil(totalCount / 12) ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

          </section>

          {/* ========================================== */}
          {/* STICKY BOTTOM SUMMARY BAR FIXED VIEWPORT   */}
          {/* ========================================== */}
          {activeSelection && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcfbf9] border-t border-gold/15 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] py-4.5 px-6 animate-slide-up">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Left side: selected specifications description */}
                <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                  <div className="w-10 h-10 bg-neutral-900/5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-gold/10 relative">
                    <DiamondSelectionImage 
                      imageUrl={activeSelection.imageUrl} 
                      shape={activeSelection.shape} 
                    />
                  </div>
                  <div>
                    <span className="text-[8.5px] uppercase font-sans tracking-wider text-neutral-400 font-bold block">Selected Diamond (ex VAT)</span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <p className="font-serif text-sm text-neutral-900 font-bold">
                        {activeSelection.shape} ({activeSelection.carat.toFixed(2)}, {activeSelection.color}, {activeSelection.clarity})
                      </p>
                      <button
                        onClick={() => setActiveCert(activeSelection)}
                        className="text-[9px] uppercase tracking-wider text-gold-600 hover:text-gold-700 font-bold underline cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
                      >
                        <Award className="h-3 w-3 text-gold-500" /> View GIA Certificate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Middle: total pricing combining diamond and configurator setting price */}
                <div className="text-left md:text-center w-full md:w-auto">
                  <span className="text-[8.5px] uppercase font-sans tracking-wider text-neutral-400 font-bold block">Grand Total (ex VAT)</span>
                  <p className="font-sans text-lg text-neutral-950 font-bold tracking-tight mt-0.5">
                    {formatPrice(activeSelection.price + getSettingPrice())}
                  </p>
                </div>

                {/* Right: appointment booking & attach actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={handleBookAppointment}
                    className="flex-1 md:flex-initial px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase font-bold border border-neutral-350 text-neutral-800 hover:bg-neutral-50 rounded-sm transition-all"
                  >
                    Book An Appointment
                  </button>
                  <button
                    onClick={() => handleAttachToConfig(activeSelection)}
                    className="flex-1 md:flex-initial px-6 py-2.5 text-[10px] font-sans tracking-widest uppercase font-bold bg-neutral-900 text-white hover:bg-neutral-800 rounded-sm transition-all text-center"
                  >
                    Add Diamond
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      {/* Compare Modal */}
      {isCompareOpen && (
        <DiamondCompare
          diamonds={compareList}
          onRemove={handleRemoveCompare}
          onClose={() => setIsCompareOpen(false)}
          onAttach={handleAttachToConfig}
        />
      )}

      {/* GIA Certificate Report Modal */}
      {activeCert && (
        <CertModal
          diamond={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
      
      {/* Mobile Filter Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <span className="font-serif text-sm tracking-widest text-neutral-900 uppercase">Filters</span>
                <button onClick={() => setShowMobileFilters(false)} className="text-neutral-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DiamondsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-96 flex flex-col items-center justify-center text-center space-y-3">
        <span className="w-10 h-10 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-sans font-bold">Opening Vault Storage...</p>
      </div>
    }>
      <DiamondsPageContent />
    </Suspense>
  );
}
