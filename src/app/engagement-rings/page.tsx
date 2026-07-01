import React from 'react';
import { getDbClient } from '@/lib/db';
import EngagementRingsClient from './EngagementRingsClient';

export const revalidate = 0;

export default async function EngagementRingsPage() {
  const db = getDbClient();
  let products: any[] = [];
  try {
    products = await db.product.findMany({
      where: { category: 'engagement rings' }
    });
  } catch (e) {
    console.error("Failed to load engagement rings:", e);
  }

  // Format products for Next.js Client Component serialization safety
  const formattedProducts = products.map((prod) => ({
    id: prod.id,
    title: prod.title,
    description: prod.description || '',
    category: prod.category,
    material: prod.material || '',
    price: Number(prod.price),
    image: prod.image,
    rating: Number(prod.rating || 5),
    reviewsCount: Number(prod.reviewsCount || 0),
    specs: prod.specs || '{}',
    care: prod.care || ''
  }));

  return <EngagementRingsClient initialProducts={formattedProducts} />;
}

