import React from 'react';
import { getDbClient } from '@/lib/db';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const db = getDbClient();
  const { category, search } = await searchParams;
  
  // Normalize category to map synonyms to seeded database categories
  let targetCategory = category;
  if (category) {
    const catLower = category.toLowerCase();
    if (catLower === 'wedding rings' || catLower === 'wedding bands' || catLower === 'wedding') {
      targetCategory = 'wedding bands';
    } else if (catLower === 'rings' || catLower === 'eternity rings') {
      targetCategory = 'rings';
    }
  }
  
  let products: any[] = [];
  try {
    products = await db.product.findMany();
  } catch (e) {
    console.error("Error fetching catalog products:", e);
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

  return (
    <ProductsClient 
      products={formattedProducts} 
      category={targetCategory || null} 
      search={search || null} 
    />
  );
}

