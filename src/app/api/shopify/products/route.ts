import { NextRequest, NextResponse } from 'next/server';
import { ShopifyService } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20') || 20;
    const handle = searchParams.get('handle');

    if (handle) {
      const product = await ShopifyService.getProductByHandle(handle);
      if (!product) {
        return NextResponse.json({ error: "Shopify product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    const products = await ShopifyService.getProducts(limit);
    return NextResponse.json({ products, total: products.length });
  } catch (error: any) {
    console.error("API Shopify products failure:", error);
    return NextResponse.json({ error: "Failed to fetch products from Shopify Storefront" }, { status: 500 });
  }
}
