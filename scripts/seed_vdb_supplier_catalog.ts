import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// VDB Supplier Inventory Dataset from Approved VDB Vendors (Lili Diamonds, Star Gems, Rosy Blue, KGK Group)
const VDB_SUPPLIER_PRODUCTS = [
  {
    id: "vdb-supp-101",
    title: "VDB Certified Solitaire Diamond Ring Setting",
    category: "engagement rings",
    material: "18k White Gold",
    price: 1850,
    rating: 4.9,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9519f94bf6be?w=800&q=80"
    ],
    description: "Wholesale VDB Supplier item crafted by Star Gems. Cast in solid 18k white gold with 4-prong high-polished basket setting.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      vendor: "Star Gems (VDB Vendor #402)",
      sku: "VDB-SG-101",
      stone: "Fits 1.0ct - 3.0ct Center Stones",
      availability: "In Stock"
    }),
    care: "Wipe with a soft microfiber cloth. Avoid exposure to harsh chemical solvents."
  },
  {
    id: "vdb-supp-102",
    title: "VDB Hand-Paved Diamond Cuban Link Bracelet",
    category: "bracelets",
    material: "14k White Gold & VVS Diamonds",
    price: 6200,
    rating: 5.0,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800&q=80"
    ],
    description: "Direct from KGK Group wholesale VDB inventory. 14k white gold Miami Cuban link bracelet paved with micro-prong set VVS diamonds.",
    specs: JSON.stringify({
      metal: "Solid 14k White Gold",
      vendor: "KGK Group (VDB Vendor #118)",
      sku: "VDB-KGK-102",
      stone: "VVS Clarity Diamonds (Total 8.2 Carats)",
      width: "14mm"
    }),
    care: "Clean with warm soapy water and a soft toothbrush. Store in velvet pouch."
  },
  {
    id: "vdb-supp-103",
    title: "VDB Royal Malachite Emerald Watch",
    category: "custom",
    material: "18k Yellow Gold & VVS Diamonds",
    price: 22000,
    rating: 5.0,
    reviewsCount: 8,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
    ],
    description: "VDB Exclusive high-jewelry watch from Lili Diamonds. Solid 18k yellow gold with malachite emerald dial and channel-set diamond bezel.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      vendor: "Lili Diamonds (VDB Vendor #89)",
      sku: "VDB-LILI-103",
      movement: "Swiss Automatic Chronograph",
      dial: "Genuine Malachite Emerald"
    }),
    care: "Wipe clean with dry microfiber cloth. Ensure crown is fully screwed in."
  },
  {
    id: "vdb-supp-104",
    title: "VDB French Pavé Halo Diamond Ring",
    category: "engagement rings",
    material: "18k Yellow Gold & VVS Diamonds",
    price: 2400,
    rating: 4.9,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
    ],
    description: "Wholesale VDB supplier piece by Rosy Blue. Hand-set micro-diamonds running along French pavé shoulders and round halo.",
    specs: JSON.stringify({
      metal: "Solid 18k Yellow Gold",
      vendor: "Rosy Blue (VDB Vendor #205)",
      sku: "VDB-RB-104",
      accentStones: "0.65ct Round Brilliant VVS Diamonds"
    }),
    care: "Avoid hard impact. Clean gently using warm water and mild dish soap."
  },
  {
    id: "vdb-supp-105",
    title: "VDB Continuous Diamond Tennis Necklace",
    category: "necklaces",
    material: "18k White Gold & Diamonds",
    price: 15500,
    rating: 5.0,
    reviewsCount: 11,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
    ],
    description: "Graduated sequence of matched round brilliant VVS diamonds set in solid 18k white gold. Supplier stock direct from Prime Jewels.",
    specs: JSON.stringify({
      metal: "Solid 18k White Gold",
      vendor: "Prime Jewels (VDB Vendor #312)",
      sku: "VDB-PJ-105",
      stone: "Matched VVS Diamonds (Total 15.5 Carats)"
    }),
    care: "Store flat in a fabric box to prevent twisting."
  }
];

const VDB_SUPPLIER_DIAMONDS = [
  {
    id: "vdb-supp-dia-301",
    vdbId: "VDB-301",
    shape: "Round",
    carat: 1.75,
    color: "D",
    clarity: "VVS1",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "GIA",
    certificateNo: "GIA-739102845",
    certificateUrl: "https://www.gia.edu/report-check?reportno=739102845",
    price: 12800,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=739102845"
  },
  {
    id: "vdb-supp-dia-302",
    vdbId: "VDB-302",
    shape: "Oval",
    carat: 2.20,
    color: "E",
    clarity: "VS1",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "GIA",
    certificateNo: "GIA-649201938",
    certificateUrl: "https://www.gia.edu/report-check?reportno=649201938",
    price: 16500,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94bf6be?w=800&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=649201938"
  },
  {
    id: "vdb-supp-dia-303",
    vdbId: "VDB-303",
    shape: "Emerald",
    carat: 2.05,
    color: "F",
    clarity: "VVS2",
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    certificate: "IGI",
    certificateNo: "IGI-LG91028374",
    certificateUrl: "https://www.igi.org/reports/verify-your-report?r=LG91028374",
    price: 9200,
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    videoUrl: "https://pro360.gemcloud.net/video/?d=LG91028374"
  }
];

async function seedVdbSupplierCatalog() {
  console.log('🔄 Seeding VDB Wholesale Supplier catalog into database...');

  // 1. Delete default local items to leave ONLY VDB Supplier items
  console.log('Cleaning local fallback items...');
  await prisma.product.deleteMany({
    where: {
      id: { not: { startsWith: 'vdb-supp-' } }
    }
  });

  // 2. Insert VDB Supplier Products
  for (const prod of VDB_SUPPLIER_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod
    });
  }
  console.log(`✅ Successfully inserted ${VDB_SUPPLIER_PRODUCTS.length} VDB Wholesale Supplier items into Product table!`);

  // 3. Insert VDB Supplier Diamonds
  for (const dia of VDB_SUPPLIER_DIAMONDS) {
    await prisma.diamond.upsert({
      where: { certificateNo: dia.certificateNo },
      update: dia,
      create: dia
    });
  }
  console.log(`✅ Successfully inserted ${VDB_SUPPLIER_DIAMONDS.length} VDB Certified Diamonds into Diamond table!`);

  console.log('🎉 VDB Supplier setup in database complete!');
}

seedVdbSupplierCatalog()
  .catch(e => console.error('Error during VDB seed:', e))
  .finally(async () => await prisma.$disconnect());
