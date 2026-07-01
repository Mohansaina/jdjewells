import React from 'react';
import { notFound } from 'next/navigation';
import { getDbClient } from '@/lib/db';
import ProductDetailsClient from './ProductDetailsClient';

export const revalidate = 0; // Disable caching

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const db = getDbClient();
  const { id } = await params;

  let product = null;
  let reviews: any[] = [];

  try {
    product = await db.product.findUnique({
      where: { id }
    });

    if (product) {
      reviews = await db.review.findMany({
        where: { productId: id }
      });
      // Sort reviews newest first
      reviews.reverse();
    }
  } catch (e) {
    console.error("Database query error in product details loader:", e);
  }

  if (!product) {
    return notFound();
  }

  // Format product object for client serialization
  const formattedProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    material: product.material,
    price: product.price,
    image: product.image,
    thumbnails: product.thumbnails || [product.image],
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    specs: product.specs,
    care: product.care || undefined
  };

  const formattedReviews = reviews.map((r: any) => ({
    id: r.id,
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    date: r.date
  }));

  return (
    <ProductDetailsClient
      product={formattedProduct}
      reviews={formattedReviews}
    />
  );
}
