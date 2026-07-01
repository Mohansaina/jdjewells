'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Sparkles, Star, ShieldCheck, ArrowRight, Award, Check, ShieldAlert, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import TrustBadges from '@/components/TrustBadges';
import SafeImage from '@/components/SafeImage';

// Category detail specifications
const categoryDetails: Record<string, {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  subcategories?: Array<{ name: string; desc: string; href: string; badge?: string; image?: string }>;
  quickFilters?: Array<{ name: string; href: string }>;
}> = {
  'wedding bands': {
    title: 'Wedding Bands',
    subtitle: 'Commitment & Fidelity',
    desc: 'Heavyweight bands cast in solid 950 platinum and 18k yellow, white, and rose gold. Handcrafted symbols of unified faith.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Classic Court Band', desc: 'Rounded comfort-fit profile in 18k gold. The traditional choice for its superior wearability.', href: '/configurator?category=Wedding%20Bands&step=3', badge: 'Bestseller', image: '/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg' },
      { name: 'Diamond-Set Band', desc: 'A full pavé or channel-set line of matched round brilliant diamonds across the width of the band.', href: '/configurator?category=Wedding%20Bands&setting=Pavé&step=4', badge: 'Max Sparkle', image: '/assets/images/527456245_1483516309728796_6438227833154731815_n.jpg' },
      { name: 'Flat Profile Band', desc: 'A contemporary flat surface with clean linear edges for a bold, architectural modern silhouette.', href: '/products?category=wedding bands', badge: 'Modern Edge', image: '/assets/images/527452581_1067293382187755_69768922388660589_n.jpg' },
      { name: 'Twisted / Rope Band', desc: 'Intertwined strands of precious metal symbolizing two lives beautifully joined as one.', href: '/products?category=wedding bands', badge: 'Symbolic', image: '/assets/images/527452581_1067293382187755_69768922388660589_n.jpg' },
      { name: 'Milgrain Vintage', desc: 'Antique-inspired beaded edge detailing recalling the craftsmanship of early 20th century ateliers.', href: '/configurator?category=Wedding%20Bands&setting=Vintage&step=4', badge: 'Heritage', image: '/assets/images/527452581_1067293382187755_69768922388660589_n.jpg' },
      { name: 'Two-Tone Band', desc: 'Contrasting platinum and yellow gold fused together for a striking, contemporary statement.', href: '/products?category=wedding bands', badge: 'Designer', image: '/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg' },
    ],
    quickFilters: [
      { name: 'White Gold', href: '/configurator?category=Wedding%20Bands&metal=White%20Gold&step=5' },
      { name: 'Yellow Gold', href: '/configurator?category=Wedding%20Bands&metal=Yellow%20Gold&step=5' },
      { name: 'Rose Gold', href: '/configurator?category=Wedding%20Bands&metal=Rose%20Gold&step=5' },
      { name: 'Platinum', href: '/configurator?category=Wedding%20Bands&metal=Platinum&step=5' },
    ]
  },
  'rings': {
    title: 'Eternity Rings',
    subtitle: 'Infinite Radiance',
    desc: 'Continuous loops of matched round brilliant diamonds and lush gemstones. Hand-set bands designed to catch the light from any angle.',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Full Eternity', desc: 'Diamonds run completely around the full circumference — a continuous circle of dazzling light.', href: '/products?category=rings', badge: 'Most Radiant', image: '/assets/images/623095774_18125755780557056_7158002321520812888_n.jpg' },
      { name: 'Half Eternity', desc: 'Diamonds set across the top half of the band — elegant and more comfortable for daily wear.', href: '/products?category=rings', badge: 'Wearability', image: '/assets/images/624643345_18126268120557056_6640496904787464198_n.jpg' },
      { name: 'Channel Set', desc: 'Diamonds secured in a smooth recessed channel — sleek, flush, and ultra protective.', href: '/products?category=rings', badge: 'Secure Setting', image: '/assets/images/639768899_1226931379582435_5669415337838444186_n.jpg' },
      { name: 'Claw Set', desc: 'Each stone individually elevated by fine prongs for the ultimate in diamond light performance.', href: '/products?category=rings', badge: 'Max Light', image: '/assets/images/619991459_870329932295959_21626841659992945_n.jpg' },
      { name: 'Gemstone Eternity', desc: 'Alternating sapphires, rubies, and emeralds with diamonds for a vibrant, colorful statement.', href: '/products?category=rings', badge: 'Coloured Stones', image: '/assets/images/527456245_1483516309728796_6438227833154731815_n.jpg' },
      { name: 'Mixed Shape', desc: 'A curated alternating sequence of round, marquise, and baguette cuts in a single luxurious band.', href: '/products?category=rings', badge: 'Unique', image: '/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg' },
    ],
    quickFilters: [
      { name: 'Round Brilliant', href: '/diamonds?shape=Round' },
      { name: 'Cushion Cut', href: '/diamonds?shape=Cushion' },
      { name: 'Emerald Cut', href: '/diamonds?shape=Emerald' },
      { name: 'Oval Cut', href: '/diamonds?shape=Oval' },
    ]
  },
  'custom': {
    title: 'Custom Atelier',
    subtitle: 'Your Unique Concept',
    desc: 'Solid 18k gold custom-molded items, VVS grillz, and CAD-drafted bespoke masterpieces designed in partnership with our master jewelers.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Custom Grillz', desc: 'Individually molded dental gold and diamond grillz in 10k, 14k, 18k gold or VS clarity stones.', href: '/products?category=custom', badge: 'Top Seller', image: '/assets/images/497435148_597443402699287_4382447146201741254_n.jpg' },
      { name: 'Nameplate Necklaces', desc: 'Custom laser-cut and pave-set VVS initial and name pendants in solid 18k gold and platinum.', href: '/products?category=custom', badge: 'Personalized', image: '/assets/images/499601723_1123628196153982_5964509621593198443_n.jpg' },
      { name: 'Bespoke Ring Design', desc: 'From CAD blueprints to wax casting — a fully custom ring mount entirely to your specifications.', href: '/configurator?category=Custom%20Jewelry&step=1', badge: 'Full Custom', image: '/assets/images/619991459_870329932295959_21626841659992945_n.jpg' },
      { name: 'Custom Pendant', desc: 'Hand-sculpted pendant masterpieces: angels, crosses, initials, and more in solid 18k gold.', href: '/products?category=pendants', badge: 'Statement', image: '/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg' },
      { name: 'Custom Bracelet', desc: 'Personalized tennis and link bracelets with custom stone selection and metal choices.', href: '/products?category=bracelets', badge: 'Wrist Candy', image: '/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg' },
      { name: 'Book Consultation', desc: 'Speak directly with our design team to sketch, prototype, and bring your dream piece to life.', href: '/', badge: 'Book Now', image: '/assets/images/logo.png' },
    ],
  },
  'engagement rings': {
    title: 'Engagement Rings',
    subtitle: 'The Lifelong Vow',
    desc: 'Classic solitaire, vintage filigree, and paved halo mounts cast in recycled precious alloys. Hand-crafted in London.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Solitaire', desc: 'The timeless classic — a single brilliant stone on a four or six prong mount.', href: '/engagement-rings', badge: 'Most Popular', image: '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg' },
      { name: 'Halo', desc: 'A micro-diamond halo amplifies the center stone with breathtaking brilliance.', href: '/engagement-rings', badge: 'Max Sparkle', image: '/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg' },
      { name: 'Vintage', desc: 'Romantic milgrain and filigree detailing evoking golden eras of fine jewelry.', href: '/engagement-rings', badge: 'Heritage', image: '/assets/images/530392375_17867589615426391_5428670915730909007_n.jpg' },
      { name: 'Three Stone', desc: 'Past, present, and future in a trio of brilliant diamonds.', href: '/engagement-rings', badge: 'Symbolic', image: '/assets/images/528715455_17866911102426391_5613703514213438204_n.jpg' },
      { name: 'Pavé', desc: 'A river of micro-diamonds flows across both shoulders of the band.', href: '/engagement-rings', badge: 'Shimmer', image: '/assets/images/527517722_17866470327426391_8999031617680294241_n.jpg' },
      { name: 'Cathedral', desc: 'Soaring arches elevate the center stone for a regal profile.', href: '/engagement-rings', badge: 'Stately', image: '/assets/images/619991459_870329932295959_21626841659992945_n.jpg' },
    ],
  },
  'bracelets': {
    title: 'Tennis Bracelets',
    subtitle: 'Fluid Elegance',
    desc: 'Flexible strands of matched round brilliant stones secured with seamless double-latch safety clasps. The definition of daily luxury.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Classic Tennis', desc: 'Traditional single-row round brilliant diamonds in seamlessly matched claw settings. Timeless elegance.', href: '/products?category=bracelets', badge: 'Icon', image: '/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg' },
      { name: 'Infinity Link', desc: 'A flowing infinity-link chain of diamond-pave set loops for a fluid, effortless wrist statement.', href: '/products?category=bracelets', badge: 'Modern', image: '/assets/images/502999619_24224725797135370_4369163186833760694_n.jpg' },
      { name: 'Double Row', desc: 'Two parallel lines of matched diamonds creating a wide, statement-making band of pure light.', href: '/products?category=bracelets', badge: 'Bold', image: '/assets/images/476432644_1829671981188391_7777518501267256692_n.jpg' },
    ],
  },
  'necklaces': {
    title: 'Chains & Necklaces',
    subtitle: 'Solid-Link Luxury',
    desc: 'Pure gold Miami Cuban links and fluid chains, hand-polished and fitted with heavy custom safety locks.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Miami Cuban Link', desc: 'Heavy solid gold Cuban links, the cornerstone of contemporary fine jewelry. Timeless and bold.', href: '/products?category=necklaces', badge: 'Signature', image: '/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg' },
      { name: 'Rope Chain', desc: 'Twisted gold rope chains in 18k yellow, white, or rose gold — elegantly twisted for maximum shine.', href: '/products?category=necklaces', badge: 'Classic', image: '/assets/images/640917534_1491710782527516_7413562406170824663_n.jpg' },
      { name: 'Pearl Strand', desc: 'Hand-knotted natural and south sea cultured pearl strands for timeless feminine luxury.', href: '/products?category=necklaces', badge: 'Heritage', image: '/assets/images/503482297_17861545896426391_2715749128535163465_n.jpg' },
    ],
  },
  'pendants': {
    title: 'VVS Diamond Pendants',
    subtitle: 'Iced Custom Nameplates',
    desc: 'Hand-sculpted angel face and custom initials encrusted with high-fire brilliant micro-prong set VVS diamonds.',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Iced Initials', desc: 'Custom 18k gold letterforms completely pavé-set with VVS micro diamonds from edge to edge.', href: '/products?category=pendants', badge: 'Custom', image: '/assets/images/499601723_1123628196153982_5964509621593198443_n.jpg' },
      { name: 'Diamond Solitaire', desc: 'A single GIA certified diamond in a polished bezel or prong mount on a fine gold chain.', href: '/products?category=pendants', badge: 'Classic', image: '/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg' },
      { name: 'Angel Face', desc: 'Micro-sculpted angel faces with VVS diamond eyes and halo — a signature J&D design icon.', href: '/products?category=pendants', badge: 'Signature', image: '/assets/images/686281805_1535662337903927_6221901172189905796_n.jpg' },
    ],
  },
  'earrings': {
    title: 'Luxury Earrings',
    subtitle: 'Brilliant Framing',
    desc: 'Exquisite diamond studs and paved hoop earrings cast in 18k gold and platinum. Hand-set for ultimate light dispersion.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    subcategories: [
      { name: 'Diamond Studs', desc: 'Round brilliant or princess cut diamond solitaire studs in 18k gold or platinum four-prong mounts.', href: '/products?category=earrings', badge: 'Essential', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop' },
      { name: 'Paved Hoops', desc: 'Inside-out pavé diamond hoops delivering 360° sparkle from every angle. Available in 3 sizes.', href: '/products?category=earrings', badge: 'Day to Night', image: '/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg' },
      { name: 'Classic Gold Hoops', desc: 'Everyday luxury in its purest form. Crafted in solid 18k yellow gold, these hoops present a sleek profile.', href: '/products?category=earrings', badge: 'Daily', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
    ],
  }
};

const categoryOrder = [
  { key: null, title: 'All Collections' },
  { key: 'engagement rings', title: 'Engagement Rings' },
  { key: 'wedding bands', title: 'Wedding Bands' },
  { key: 'rings', title: 'Eternity Rings' },
  { key: 'custom', title: 'Custom Atelier' },
  { key: 'bracelets', title: 'Tennis Bracelets' },
  { key: 'necklaces', title: 'Chains & Necklaces' },
  { key: 'pendants', title: 'VVS Diamond Pendants' },
  { key: 'earrings', title: 'Luxury Earrings' }
];

interface ProductsClientProps {
  products: any[];
  category: string | null;
  search: string | null;
}

export default function ProductsClient({ products, category, search }: ProductsClientProps) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currency, setCurrency] = useState('EU / EUR');

  // Accordion Sidebar Toggles
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    categories: true,
    metals: true,
    shapes: true,
    styles: false
  });

  const toggleFilter = (section: string) => {
    setOpenFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamic active category state
  const [activeCategory, setActiveCategory] = useState<string | null>(category);

  const catKey = activeCategory ? activeCategory.toLowerCase() : '';

  // Multi-select filters
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  // Sync category param from router/props
  useEffect(() => {
    setActiveCategory(category);
    setSelectedStyles([]);
    setSelectedMetals([]);
    setSelectedShapes([]);
  }, [category]);

  const handleToggleStyleFilter = (styleName: string) => {
    setSelectedStyles(prev => 
      prev.includes(styleName) ? prev.filter(s => s !== styleName) : [...prev, styleName]
    );
  };

  const handleToggleShapeFilter = (shapeName: string) => {
    setSelectedShapes(prev => 
      prev.includes(shapeName) ? prev.filter(s => s !== shapeName) : [...prev, shapeName]
    );
  };

  const handleToggleMetalFilter = (metalName: string) => {
    setSelectedMetals(prev => 
      prev.includes(metalName) ? prev.filter(m => m !== metalName) : [...prev, metalName]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedMetals([]);
    setSelectedShapes([]);
    setActiveCategory(category);
  };

  const handleSelectCategory = (catKey: string | null) => {
    setActiveCategory(catKey);
    setSelectedStyles([]);
    setSelectedMetals([]);
    setSelectedShapes([]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = categoryOrder.findIndex(cat => cat.key === activeCategory);
      const nextIndex = (currentIndex + 1) % categoryOrder.length;
      handleSelectCategory(categoryOrder[nextIndex].key);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCategory]);

  // Helper matching functions
  const getProductStyle = (prod: any): string => {
    try {
      const specs = JSON.parse(prod.specs);
      if (specs.setting) return specs.setting.toLowerCase();
    } catch (e) {}
    const titleLower = prod.title.toLowerCase();
    for (const style of ['solitaire', 'halo', 'vintage', 'three stone', 'trilogy', 'pavé', 'pave', 'cathedral', 'bezel', 'tension', 'split shank', 'court', 'flat profile', 'rope', 'milgrain', 'two-tone', 'full eternity', 'half eternity', 'channel', 'claw']) {
      if (titleLower.includes(style)) return style === 'pave' ? 'pavé' : style;
    }
    return '';
  };

  const getProductMetal = (prod: any): string => {
    const matLower = prod.material.toLowerCase();
    if (matLower.includes('white gold')) return 'white gold';
    if (matLower.includes('yellow gold')) return 'yellow gold';
    if (matLower.includes('rose gold')) return 'rose gold';
    if (matLower.includes('platinum')) return 'platinum';
    return '';
  };

  const getProductShape = (prod: any): string => {
    try {
      const specs = JSON.parse(prod.specs);
      if (specs.shape) return specs.shape.toLowerCase();
    } catch (e) {}
    const titleLower = prod.title.toLowerCase();
    for (const shape of ['round', 'princess', 'cushion', 'oval', 'pear', 'emerald', 'heart', 'radiant', 'marquise', 'asscher']) {
      if (titleLower.includes(shape)) return shape;
    }
    return '';
  };

  const handleToggleQuickFilter = (filterName: string) => {
    const nameLower = filterName.toLowerCase();
    if (['white gold', 'yellow gold', 'rose gold', 'platinum'].some(m => nameLower.includes(m))) {
      const metal = ['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum'].find(m => nameLower.includes(m.toLowerCase()));
      if (metal) {
        setSelectedMetals(prev => 
          prev.includes(metal) ? prev.filter(m => m !== metal) : [...prev, metal]
        );
      }
    } else if (['round', 'princess', 'cushion', 'oval', 'pear', 'emerald', 'heart', 'radiant', 'marquise', 'asscher'].some(s => nameLower.includes(s))) {
      const shape = ['Round', 'Princess', 'Cushion', 'Oval', 'Pear', 'Emerald', 'Heart', 'Radiant', 'Marquise', 'Asscher'].find(s => nameLower.includes(s.toLowerCase()));
      if (shape) {
        setSelectedShapes(prev => 
          prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
        );
      }
    }
  };

  const filteredProducts = products.filter((prod: any) => {
    if (activeCategory) {
      const cat = prod.category ? prod.category.toLowerCase() : '';
      if (cat !== activeCategory.toLowerCase()) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matches = 
        prod.title.toLowerCase().includes(q) || 
        (prod.description && prod.description.toLowerCase().includes(q)) ||
        (prod.material && prod.material.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (selectedStyles.length > 0) {
      const style = getProductStyle(prod);
      const matched = selectedStyles.some(sel => {
        const selLower = sel.toLowerCase();
        return style.includes(selLower) || prod.title.toLowerCase().includes(selLower);
      });
      if (!matched) return false;
    }
    if (selectedMetals.length > 0) {
      const metal = getProductMetal(prod);
      const matched = selectedMetals.some(sel => metal.includes(sel.toLowerCase()));
      if (!matched) return false;
    }
    if (selectedShapes.length > 0) {
      const shape = getProductShape(prod);
      const matched = selectedShapes.some(sel => shape.includes(sel.toLowerCase()) || prod.title.toLowerCase().includes(sel.toLowerCase()));
      if (!matched) return false;
    }
    return true;
  });

  const defaultSubcategories = [
    { name: 'Engagement Rings', desc: 'Solitaire, halo, vintage, and trilogy settings.', href: '/products?category=engagement rings', image: '/assets/images/500288698_1229972801842035_6145526371360903892_n.jpg', key: 'engagement rings' },
    { name: 'Wedding Rings', desc: 'Classic comfort-fit bands and diamond-set wedding rings.', href: '/products?category=wedding bands', image: '/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg', key: 'wedding bands' },
    { name: 'Eternity Rings', desc: 'Continuous loops of matched round brilliant diamonds.', href: '/products?category=rings', image: '/assets/images/623095774_18125755780557056_7158002321520812888_n.jpg', key: 'rings' },
    { name: 'Luxury Earrings', desc: 'Exquisite diamond studs and paved hoop earrings.', href: '/products?category=earrings', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop', key: 'earrings' },
    { name: 'Chains & Necklaces', desc: 'Miami Cuban links and fluid chains.', href: '/products?category=necklaces', image: '/assets/images/640917534_1491710782527516_7413562406170824663_n.jpg', key: 'necklaces' },
    { name: 'Tennis Bracelets', desc: 'Flexible strands of matched round brilliant stones.', href: '/products?category=bracelets', image: '/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg', key: 'bracelets' },
    { name: 'VVS Diamond Pendants', desc: 'Hand-sculpted angel face and custom initials.', href: '/products?category=pendants', image: '/assets/images/499601723_1123628196153982_5964509621593198443_n.jpg', key: 'pendants' },
    { name: 'Custom Atelier', desc: 'Solid gold custom-molded items and bespoke masterpieces.', href: '/products?category=custom', image: '/assets/images/gemstones_banner.png', key: 'custom' },
  ];

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

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddProductToBag = (prod: any) => {
    addToCart({
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.image,
      price: prod.price,
      diamondSpec: `${prod.material} • Standard Size 6.5`
    });

    setToastMessage(`${prod.title} added to your shopping bag!`);
    setShowToast(true);

    // Slide open cart drawer automatically
    window.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

    // Dynamic mutation observer to capture newly rendered elements in wizard/stepper views
  const details = {
    title: activeCategory ? (categoryDetails[catKey]?.title || activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)) : 'All Collections',
    subtitle: activeCategory ? (categoryDetails[catKey]?.subtitle || 'Vault Catalog') : 'Vault Catalog',
    desc: activeCategory ? (categoryDetails[catKey]?.desc || 'Masterfully cast solid pieces with matched hand-set stones.') : 'Masterfully cast solid pieces with matched hand-set stones.',
    image: activeCategory ? (categoryDetails[catKey]?.image || '/assets/images/fine_jewellery_banner.png') : '/assets/images/fine_jewellery_banner.png',
    subcategories: activeCategory ? categoryDetails[catKey]?.subcategories : defaultSubcategories,
    quickFilters: activeCategory ? categoryDetails[catKey]?.quickFilters : undefined,
  };

  if (search) {
    details.title = `${details.title} - ${search.charAt(0).toUpperCase() + search.slice(1)}`;
    details.desc = `Showing matches for "${search}" in our ${activeCategory ? activeCategory.toLowerCase() : 'catalog'}.`;
  }

  return (
    <div className="space-y-0 pb-20 relative">
      
      {/* === HERO BANNER === */}
      <div className="relative w-full h-[45vh] min-h-[280px] bg-neutral-950 overflow-hidden flex items-center">
        {/* Slideshow background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-luminosity transition-all duration-1000 ease-in-out transform scale-102"
          style={{ backgroundImage: `url('${details.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 space-y-4 text-left">
          <span className="text-[10px] tracking-[0.5em] text-gold-300 uppercase block font-bold transition-all duration-500">
            {details.subtitle}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white tracking-widest uppercase font-light leading-tight transition-all duration-500">
            {details.title}
          </h1>
          <p className="text-neutral-300 font-sans text-sm tracking-wide font-light leading-relaxed max-w-lg transition-all duration-500">
            {details.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/configurator"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:opacity-90 shadow-md transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Design Custom Piece
            </Link>
            {activeCategory && (
              <button
                onClick={() => handleSelectCategory(null)}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-sans tracking-widest uppercase font-semibold border border-white/30 text-white hover:border-gold-300 hover:text-gold-300 transition-all cursor-pointer bg-transparent"
              >
                All Collections <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Controls */}
        <>
          <button
            onClick={() => {
              const currentIndex = categoryOrder.findIndex(cat => cat.key === activeCategory);
              const prevIndex = (currentIndex - 1 + categoryOrder.length) % categoryOrder.length;
              handleSelectCategory(categoryOrder[prevIndex].key);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-neutral-950/40 hover:bg-neutral-900/80 text-white border border-white/10 rounded-full transition-all focus:outline-none cursor-pointer"
            aria-label="Previous category"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              const currentIndex = categoryOrder.findIndex(cat => cat.key === activeCategory);
              const nextIndex = (currentIndex + 1) % categoryOrder.length;
              handleSelectCategory(categoryOrder[nextIndex].key);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-neutral-950/40 hover:bg-neutral-900/80 text-white border border-white/10 rounded-full transition-all focus:outline-none cursor-pointer"
            aria-label="Next category"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Category Pagination Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {categoryOrder.map((cat, idx) => {
              const isActive = cat.key === activeCategory;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCategory(cat.key)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'bg-gold-500 w-6' : 'bg-white/40'}`}
                  title={cat.title}
                />
              );
            })}
          </div>
        </>
      </div>

      {/* === TRUST BADGES === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TrustBadges />
      </div>

      {/* === TWO-COLUMN SPLIT CATALOG LAYOUT (Inspired by The Diamond Store UK) === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LEFT COLUMN: COLLAPSIBLE ACCORDION SIDEBAR FILTERS */}
          <aside className="lg:col-span-1 space-y-4 bg-white border border-gold/15 p-5 rounded shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-800 font-sans">Filters</span>
              {(selectedStyles.length > 0 || selectedMetals.length > 0 || selectedShapes.length > 0 || activeCategory !== category) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-[10px] uppercase font-sans tracking-widest text-red-500 hover:text-red-750 transition-colors font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Accordion Section 1: Categories */}
            <div className="border-b border-neutral-100 pb-3">
              <button
                onClick={() => toggleFilter('categories')}
                className="w-full flex justify-between items-center text-xs font-sans font-bold uppercase tracking-wider text-neutral-800 py-2 cursor-pointer"
              >
                <span>Category</span>
                {openFilters.categories ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {openFilters.categories && (
                <div className="space-y-1.5 pt-2 animate-menu-slide-down">
                  {[
                    { label: 'All Collections', key: null },
                    { label: 'Engagement Rings', key: 'engagement rings' },
                    { label: 'Wedding Rings', key: 'wedding bands' },
                    { label: 'Eternity Rings', key: 'rings' },
                    { label: 'Earrings', key: 'earrings' },
                    { label: 'Necklaces', key: 'necklaces' },
                    { label: 'Bracelets', key: 'bracelets' },
                    { label: 'Pendants', key: 'pendants' },
                    { label: 'Bespoke / Custom', key: 'custom' },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleSelectCategory(cat.key)}
                      className={`w-full text-left py-1 px-2 text-[11px] font-sans tracking-wide transition-colors flex justify-between items-center rounded ${
                        activeCategory === cat.key
                          ? 'bg-gold-50/40 text-gold-700 font-bold border-l-2 border-gold-500'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {activeCategory === cat.key && <Check className="h-3 w-3 text-gold-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion Section 2: Metals */}
            <div className="border-b border-neutral-100 pb-3">
              <button
                onClick={() => toggleFilter('metals')}
                className="w-full flex justify-between items-center text-xs font-sans font-bold uppercase tracking-wider text-neutral-800 py-2 cursor-pointer"
              >
                <span>Metal Alloy</span>
                {openFilters.metals ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {openFilters.metals && (
                <div className="space-y-2 pt-2 animate-menu-slide-down">
                  {['Platinum', 'Yellow Gold', 'White Gold', 'Rose Gold'].map((metal) => {
                    const isChecked = selectedMetals.includes(metal);
                    return (
                      <label key={metal} className="flex items-center gap-2 text-[11px] font-sans tracking-wide text-neutral-600 cursor-pointer hover:text-gold-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMetalFilter(metal)}
                          className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 accent-gold-500"
                        />
                        <span>{metal}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion Section 3: Shapes */}
            <div className="border-b border-neutral-100 pb-3">
              <button
                onClick={() => toggleFilter('shapes')}
                className="w-full flex justify-between items-center text-xs font-sans font-bold uppercase tracking-wider text-neutral-800 py-2 cursor-pointer"
              >
                <span>Diamond Shape</span>
                {openFilters.shapes ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {openFilters.shapes && (
                <div className="grid grid-cols-2 gap-1.5 pt-2 animate-menu-slide-down">
                  {['Round', 'Princess', 'Cushion', 'Oval', 'Pear', 'Emerald', 'Heart', 'Radiant', 'Marquise', 'Asscher'].map((shape) => {
                    const isSelected = selectedShapes.includes(shape);
                    return (
                      <button
                        key={shape}
                        onClick={() => handleToggleShapeFilter(shape)}
                        className={`py-1.5 px-2 text-[10px] font-sans tracking-wide border transition-all text-center rounded ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-700 font-bold'
                            : 'border-neutral-200 text-neutral-500 hover:border-gold-300'
                        }`}
                      >
                        {shape}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion Section 4: Styles */}
            <div className="pb-1">
              <button
                onClick={() => toggleFilter('styles')}
                className="w-full flex justify-between items-center text-xs font-sans font-bold uppercase tracking-wider text-neutral-800 py-2 cursor-pointer"
              >
                <span>Setting Style</span>
                {openFilters.styles ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {openFilters.styles && (
                <div className="space-y-2 pt-2 animate-menu-slide-down">
                  {['Solitaire', 'Halo', 'Vintage', 'Three Stone', 'Pavé', 'Cathedral'].map((style) => {
                    const isChecked = selectedStyles.includes(style);
                    return (
                      <label key={style} className="flex items-center gap-2 text-[11px] font-sans tracking-wide text-neutral-600 cursor-pointer hover:text-gold-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleStyleFilter(style)}
                          className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 accent-gold-500"
                        />
                        <span>{style}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

          </aside>

          {/* RIGHT COLUMN: PRODUCTS GRID & HEADER */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Catalog Info header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gold/10 pb-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-600 font-bold block">Curated Selection</span>
                <h2 className="font-serif text-xl sm:text-2xl tracking-widest uppercase text-neutral-900">
                  {details.title}
                </h2>
              </div>
              <span className="text-[10px] font-sans text-neutral-400 font-light">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} matches
              </span>
            </div>

            {/* Active filters summary tags */}
            {(selectedStyles.length > 0 || selectedMetals.length > 0 || selectedShapes.length > 0 || activeCategory !== category) && (
              <div className="flex flex-wrap gap-2 items-center text-xs bg-gold-50/20 border border-gold-200/40 p-3 rounded">
                <span className="text-[10px] uppercase font-sans font-bold text-neutral-400 tracking-wider mr-1">Active Filters:</span>
                
                {activeCategory !== category && activeCategory !== null && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-250 text-amber-800 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                    Category: {
                      [
                        { label: 'Engagement Rings', key: 'engagement rings' },
                        { label: 'Wedding Rings', key: 'wedding bands' },
                        { label: 'Eternity Rings', key: 'rings' },
                        { label: 'Earrings', key: 'earrings' },
                        { label: 'Necklaces', key: 'necklaces' },
                        { label: 'Bracelets', key: 'bracelets' },
                        { label: 'Pendants', key: 'pendants' },
                        { label: 'Bespoke / Custom', key: 'custom' },
                      ].find(c => c.key === activeCategory)?.label || activeCategory
                    }
                    <button onClick={() => handleSelectCategory(category)} className="hover:text-red-500 ml-1 font-bold">×</button>
                  </span>
                )}

                {selectedStyles.map((style) => (
                  <span key={style} className="inline-flex items-center gap-1 bg-gold-50 border border-gold-300 text-gold-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                    Style: {style}
                    <button onClick={() => handleToggleStyleFilter(style)} className="hover:text-red-500 ml-1 font-bold">×</button>
                  </span>
                ))}

                {selectedMetals.map((metal) => (
                  <span key={metal} className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-neutral-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                    Metal: {metal}
                    <button onClick={() => handleToggleMetalFilter(metal)} className="hover:text-red-500 ml-1 font-bold">×</button>
                  </span>
                ))}

                {selectedShapes.map((shape) => (
                  <span key={shape} className="inline-flex items-center gap-1 bg-sky-50 border border-sky-300 text-sky-700 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full">
                    Shape: {shape}
                    <button onClick={() => handleToggleShapeFilter(shape)} className="hover:text-red-500 ml-1 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Product card grid */}
            {filteredProducts.length === 0 ? (
              <div className="border border-dashed border-gold-300/40 p-12 text-center space-y-4 rounded bg-gold-50/10">
                <ShieldAlert className="h-10 w-10 text-gold-500/80 mx-auto stroke-[1.2]" />
                <div>
                  <p className="font-serif text-lg text-neutral-800 tracking-wide">No Perfect Match Found</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">We don&apos;t have pre-crafted pieces matching this exact filter combination in stock. Click below to customize this combination or consult our designers.</p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={handleClearAllFilters}
                    className="px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase font-semibold border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <Link
                    href="/configurator"
                    className="px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase font-semibold gold-gradient text-white shadow-md transition-all"
                  >
                    Start Custom Build
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((prod: any) => {
                  let styleName = 'Solitaire';
                  try {
                    const sp = JSON.parse(prod.specs);
                    if (sp.setting) styleName = sp.setting;
                  } catch (e) {}

                  const handleAddProductToBag = (p: any) => {
                    addToCart({
                      productId: p.id,
                      productTitle: p.title,
                      price: p.price,
                      productImage: p.image,
                      diamondSpec: p.material
                    });
                    setToastMessage(`${p.title} added to shopping bag.`);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3500);
                  };

                  return (
                    <div
                      key={prod.id}
                      className="group bg-white border border-gold-200/30 flex flex-col justify-between hover:shadow-[0_15px_35px_rgba(197,160,41,0.08)] hover:-translate-y-1 hover:border-gold-300/60 transition-all duration-500 relative rounded overflow-hidden"
                    >
                      {/* Clickable Image Area */}
                      <Link
                        href={`/products/${prod.id}`}
                        id={`product-image-${prod.id}`}
                        className="aspect-square bg-gradient-to-b from-[#faf9f6]/40 to-[#f2efea]/40 border-b border-gold/10 p-6 flex items-center justify-center overflow-hidden cursor-pointer relative"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md"
                        />
                        
                        {/* Insured Shipping Tag */}
                        <span className="absolute top-3 left-3 text-[7.5px] uppercase font-sans tracking-widest font-bold bg-white/90 border border-gold-300/30 text-gold-700 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                          Free Insured Delivery
                        </span>

                        {/* Premium Hover Overlay */}
                        <div className="absolute inset-0 bg-[#07090e]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-4 py-2 bg-white/90 text-neutral-900 text-[9px] uppercase font-bold tracking-widest border border-gold-400/20 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            Explore Masterpiece
                          </span>
                        </div>
                      </Link>

                      {/* Info panel */}
                      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <h3 className="font-serif text-sm text-neutral-900 font-medium">
                              <Link
                                href={`/products/${prod.id}`}
                                className="group-hover:text-gold-600 transition-colors cursor-pointer"
                                id={`product-title-${prod.id}`}
                              >
                                {prod.title}
                              </Link>
                            </h3>
                            <span className="text-xs font-serif font-bold text-neutral-900 flex-shrink-0">{formatPrice(prod.price)}</span>
                          </div>
                          <p className="text-[8.5px] text-neutral-400 font-sans uppercase tracking-[0.15em]">
                            {prod.material}
                          </p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-sans">
                          <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                          <span className="font-bold text-neutral-800">{prod.rating}</span>
                          <span className="font-light">({prod.reviewsCount} reviews)</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-gold/5 mt-auto">
                          <button
                            onClick={() => handleAddProductToBag(prod)}
                            className="w-full py-2.5 text-[9px] uppercase tracking-widest font-bold gold-gradient text-white text-center hover:opacity-95 transition-opacity rounded-xs shadow-xs cursor-pointer"
                            id={`add-catalog-bag-${prod.id}`}
                          >
                            Add to Bag
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href={`/products/${prod.id}`}
                              className="py-2 text-[9px] uppercase tracking-widest font-bold border border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 text-center rounded-xs transition-colors"
                              id={`details-catalog-${prod.id}`}
                            >
                              Details
                            </Link>
                            {prod.category === 'engagement rings' ? (
                              <Link
                                href={`/configurator?category=Engagement%20Rings&setting=${styleName}&metal=${encodeURIComponent(prod.material)}&step=4`}
                                className="py-2 text-[9px] uppercase tracking-widest font-bold bg-white border border-gold/25 text-gold-700 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-center rounded-xs transition-all"
                                id={`customize-catalog-${prod.id}`}
                              >
                                Customize
                              </Link>
                            ) : prod.category === 'wedding bands' ? (
                              <Link
                                href={`/configurator?category=Wedding%20Bands&setting=${styleName}&metal=${encodeURIComponent(prod.material)}&step=4`}
                                className="py-2 text-[9px] uppercase tracking-widest font-bold bg-white border border-gold/25 text-gold-700 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-center rounded-xs transition-all"
                                id={`customize-catalog-${prod.id}`}
                              >
                                Customize
                              </Link>
                            ) : prod.category === 'rings' ? (
                              <Link
                                href={`/configurator?category=Rings&setting=${styleName}&metal=${encodeURIComponent(prod.material)}&step=4`}
                                className="py-2 text-[9px] uppercase tracking-widest font-bold bg-white border border-gold/25 text-gold-700 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-center rounded-xs transition-all"
                                id={`customize-catalog-${prod.id}`}
                              >
                                Customize
                              </Link>
                            ) : (
                              <Link
                                href={`/configurator?category=Custom%20Jewelry&step=3`}
                                className="py-2 text-[9px] uppercase tracking-widest font-bold bg-white border border-gold/25 text-gold-700 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-center rounded-xs transition-all"
                                id={`customize-catalog-${prod.id}`}
                              >
                                Bespoke
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* === BOTTOM CTA === */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-neutral-950 text-white p-10 text-center space-y-4 border border-gold/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url('${details.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <span className="text-[9px] uppercase tracking-widest text-gold-400 font-bold block relative z-10">Can&apos;t Find What You Need?</span>
          <h3 className="font-serif text-xl sm:text-2xl tracking-widest uppercase text-neutral-100 relative z-10">Design It Bespoke</h3>
          <p className="text-xs text-neutral-400 font-light max-w-md mx-auto leading-relaxed relative z-10">
            Our master jewelers can craft any piece to your exact specifications. Book a consultation or open the configurator to begin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 relative z-10">
            <Link
              href="/configurator"
              className="inline-flex items-center gap-2 px-8 py-3 text-xs font-sans tracking-widest uppercase font-semibold gold-gradient text-white hover:opacity-90 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Open Configurator
            </Link>
          </div>
        </div>
      </section>

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
