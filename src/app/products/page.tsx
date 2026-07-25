import React from 'react';
import { VdbService } from '@/services/vdbService';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search } = await searchParams;
  
  // Normalize category to map synonyms to seeded VDB jewelry categories
  let targetCategory = category || null;
  if (category) {
    const catLower = category.toLowerCase();
    if (catLower === 'wedding rings' || catLower === 'wedding bands' || catLower === 'wedding') {
      targetCategory = 'wedding bands';
    } else if (catLower === 'rings' || catLower === 'eternity rings') {
      targetCategory = 'rings';
    }
  }
  
  let initialData = { products: [] as any[], totalCount: 0, totalPages: 1, currentPage: 1 };
  try {
    initialData = await VdbService.getProducts({
      category: targetCategory,
      search: search || null,
      page: 1,
      limit: 9
    });
  } catch (e) {
    console.error("Error fetching initial catalog products on server:", e);
  }

  return (
    <ProductsClient 
      initialProducts={initialData.products}
      initialTotalCount={initialData.totalCount}
      initialTotalPages={initialData.totalPages}
      category={targetCategory} 
      search={search || null} 
    />
  );
}

