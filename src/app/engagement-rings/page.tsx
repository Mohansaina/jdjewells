import React from 'react';
import { VdbService } from '@/services/vdbService';
import EngagementRingsClient from './EngagementRingsClient';

export const revalidate = 0;

export default async function EngagementRingsPage() {
  let products: any[] = [];
  try {
    const data = await VdbService.getProducts({
      category: 'engagement rings',
      limit: 100
    });
    products = data.products;
  } catch (e) {
    console.error("Failed to load engagement rings from VDB Service:", e);
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


