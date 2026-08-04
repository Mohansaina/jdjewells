/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MASTER_PRODUCTS = [
  {
    id: "vdb-jewel-101",
    title: "Custom VVS Diamond Skull Pendant",
    category: "pendants",
    material: "18k Yellow Gold & VVS Diamonds",
    price: 4500,
    rating: 4.9,
    reviewsCount: 12,
    image: "/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg",
    thumbnails: ["/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg"],
    description: "A custom-molded masterpiece crafted in-house. Features hand-set, brilliant-cut VVS clarity diamonds encrusted on a crowned motif, cast from solid 18k yellow gold.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      stone: "Clarity VVS1, Color D-F Natural Diamonds (Total 4.5 Carats)",
      setting: "Hand-set Micro Pave",
      vendor: "VDB Master Collection",
      sku: "VDB-SKULL-101"
    }),
    care: "Avoid chemical cleaners. Clean using warm water, mild dish soap, and a soft toothbrush. Dry thoroughly with a microfiber cloth."
  },
  {
    id: "vdb-jewel-102",
    title: "18k Miami Cuban Link Chain",
    category: "necklaces",
    material: "18k Solid Yellow Gold",
    price: 3200,
    rating: 4.9,
    reviewsCount: 18,
    image: "/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg",
    thumbnails: ["/assets/images/495915671_1751273732121557_3256046164248814030_n.jpg"],
    description: "The gold standard of luxury streetwear. Heavy 18k Miami Cuban Link Chain with hand-polished solid yellow gold links and custom box lock.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      width: "12mm",
      length: "22 inches",
      vendor: "VDB Master Collection",
      sku: "VDB-CUBAN-102"
    }),
    care: "Store flat in a fabric-lined box. Clean with a gold polishing cloth."
  },
  {
    id: "vdb-jewel-103",
    title: "Custom Solid 18k Gold Grillz",
    category: "custom",
    material: "18k Gold (Set of 6)",
    price: 1850,
    rating: 4.8,
    reviewsCount: 8,
    image: "/assets/images/497435148_597443402699287_4382447146201741254_n.jpg",
    thumbnails: ["/assets/images/497435148_597443402699287_4382447146201741254_n.jpg"],
    description: "Custom molded upper or lower set of 6 teeth grillz. Hand-crafted from premium solid 18k yellow gold, meticulously polished for blinding shine.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      fit: "Custom molded (includes dental impression kit)",
      vendor: "VDB Master Collection",
      sku: "VDB-GRILLZ-103"
    }),
    care: "Remove before eating or sleeping. Wash with warm water and dry immediately."
  },
  {
    id: "vdb-jewel-104",
    title: "Iced Out Royal Automatic Chronograph",
    category: "custom",
    material: "Moissanite & Stainless Steel",
    price: 9500,
    rating: 5.0,
    reviewsCount: 14,
    image: "/assets/images/497833627_1393279941815368_7853538822560960896_n.jpg",
    thumbnails: ["/assets/images/497833627_1393279941815368_7853538822560960896_n.jpg"],
    description: "Features a custom iced-out bezel and integrated bracelet, fully hand-paved with high-dispersion VVS Moissanite stones. Japanese automatic movement.",
    specs: JSON.stringify({
      movement: "Japanese Automatic Chronograph",
      stone: "VVS1 Moissanite Diamonds (Total 18.5 Carats)",
      vendor: "VDB Watchmaking",
      sku: "VDB-ROYAL-104"
    }),
    care: "Gently wipe with a damp microfiber cloth. Ensure crown is fully screwed down."
  },
  {
    id: "vdb-jewel-105",
    title: "VVS Diamond Tennis Bracelet",
    category: "bracelets",
    material: "14k White Gold & Diamonds",
    price: 3800,
    rating: 4.9,
    reviewsCount: 10,
    image: "/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg",
    thumbnails: ["/assets/images/498699131_2986753871486070_5423507970220177199_n.jpg"],
    description: "Fluid line of matched round brilliant-cut VVS diamonds prong-set in solid 14k white gold with double-latch safety clasp.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      stone: "Matched Round Brilliant VVS2 Diamonds (Total 5.5 Carats)",
      vendor: "VDB Master Collection",
      sku: "VDB-TENNIS-105"
    }),
    care: "Clean regularly using jewelry cleaning solution. Avoid abrasive surfaces."
  },
  {
    id: "vdb-jewel-106",
    title: "Solitaire Diamond Engagement Ring",
    category: "engagement rings",
    material: "18k White Gold",
    price: 1500,
    rating: 5.0,
    reviewsCount: 6,
    image: "/assets/images/500200745_1440969573569043_5648713193081653598_n.jpg",
    thumbnails: ["/assets/images/500200745_1440969573569043_5648713193081653598_n.jpg"],
    description: "An elegant solitaire engagement ring setting that elevates your chosen center stone. Meticulously hand-set in 18k white gold.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      setting: "Solitaire",
      width: "2.0mm",
      vendor: "VDB Bridal",
      sku: "VDB-RING-106"
    }),
    care: "Wipe down regularly with a soft lint-free polishing cloth."
  },
  {
    id: "vdb-jewel-107",
    title: "Classic Platinum Wedding Band",
    category: "wedding bands",
    material: "Solid 950 Platinum",
    price: 950,
    rating: 5.0,
    reviewsCount: 9,
    image: "/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg",
    thumbnails: ["/assets/images/502959115_1891856875001496_4642517900112077570_n.jpg"],
    description: "A heavy-weight Comfort Fit wedding band made of pure solid 950 platinum with a mirror-finish polish.",
    specs: JSON.stringify({
      metal: "Solid 950 Platinum",
      width: "4mm",
      fit: "Comfort Fit",
      vendor: "VDB Bridal",
      sku: "VDB-BAND-107"
    }),
    care: "Wipe with a lint-free cloth. Professional polish recommended annually."
  },
  {
    id: "vdb-jewel-108",
    title: "Stellar Diamond Hoop Earrings",
    category: "earrings",
    material: "14k Yellow Gold & Diamonds",
    price: 1650,
    rating: 4.9,
    reviewsCount: 7,
    image: "/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg",
    thumbnails: ["/assets/images/500666499_1439534170548062_7134822271212927486_n.jpg"],
    description: "Stellar hoop earrings paved with micro-prong brilliant round diamonds inside and out for maximum radiance.",
    specs: JSON.stringify({
      metal: "Solid 14k Yellow Gold",
      stone: "0.75ct Brilliant Round Diamonds",
      vendor: "VDB Master Collection",
      sku: "VDB-HOOPS-108"
    }),
    care: "Clean regularly in warm soapy water using a soft brush."
  }
];

const MASTER_DIAMONDS = [
  {
    id: "vdb-dia-201",
    vdbId: "201",
    shape: "Round",
    carat: 1.51,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "GIA",
    certificateNo: "GIA-221849102",
    certificateUrl: "https://www.gia.edu/report-check?reportno=221849102",
    price: 9450,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=221849102"
  },
  {
    id: "vdb-dia-202",
    vdbId: "202",
    shape: "Oval",
    carat: 2.05,
    color: "E",
    clarity: "VS1",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Very Good",
    fluorescence: "None",
    certificate: "GIA",
    certificateNo: "GIA-642910481",
    certificateUrl: "https://www.gia.edu/report-check?reportno=642910481",
    price: 14200,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94bf6be?w=600&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=642910481"
  },
  {
    id: "vdb-dia-203",
    vdbId: "203",
    shape: "Emerald",
    carat: 1.80,
    color: "F",
    clarity: "VVS2",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "IGI",
    certificateNo: "IGI-LG58291039",
    certificateUrl: "https://www.igi.org/reports/verify-your-report?r=LG58291039",
    price: 7800,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=LG58291039"
  },
  {
    id: "vdb-dia-204",
    vdbId: "204",
    shape: "Cushion",
    carat: 2.30,
    color: "G",
    clarity: "VS2",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Very Good",
    fluorescence: "Faint",
    certificate: "GIA",
    certificateNo: "GIA-519284019",
    certificateUrl: "https://www.gia.edu/report-check?reportno=519284019",
    price: 11900,
    imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=519284019"
  }
];

async function main() {
  console.log('🚀 Arranging and seeding master database...');

  // 1. Seed Admin User
  await prisma.user.upsert({
    where: { email: 'admin@jdjewel.com' },
    update: { name: 'Mohan Saina', role: 'ADMIN' },
    create: {
      id: 'admin-1',
      email: 'admin@jdjewel.com',
      passwordHash: '$2b$10$UoW1iL39X1Q1eE4m3lP7fObT4m2V4o7W9l6E5r5Y5z5w5e5r5t5y',
      name: 'Mohan Saina',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin User configured in database.');

  // 2. Seed Master Products
  for (const prod of MASTER_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod
    });
  }
  console.log(`✅ ${MASTER_PRODUCTS.length} Master Products configured in database.`);

  // 3. Seed Master Diamonds
  for (const dia of MASTER_DIAMONDS) {
    await prisma.diamond.upsert({
      where: { certificateNo: dia.certificateNo },
      update: dia,
      create: dia
    });
  }
  console.log(`✅ ${MASTER_DIAMONDS.length} Master Certified Diamonds configured in database.`);

  console.log('🎉 Master Database setup complete!');
}

main()
  .catch(e => console.error('Error during master seed:', e))
  .finally(async () => await prisma.$disconnect());
