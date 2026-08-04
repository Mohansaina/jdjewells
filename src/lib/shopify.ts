/**
 * Shopify Storefront API Client
 * Replaces Supabase backend for JD Jewel storefront catalog and checkout.
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  material: string;
  price: number;
  image: string;
  thumbnails: string[];
  rating: number;
  reviewsCount: number;
  specs: string;
  care?: string;
  handle?: string;
  variantId?: string;
  availableForSale?: boolean;
}

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// High Performance In-Memory Cache (SWR) for Instant 0ms Load Times
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const shopifyCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

async function shopifyFetch<T>({ query, variables = {} }: { query: string; variables?: any }): Promise<T | null> {
  const cacheKey = JSON.stringify({ query, variables });
  const cached = shopifyCache.get(cacheKey);

  // Return cached result immediately if unexpired
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const cleanDomain = SHOPIFY_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!cleanDomain || !SHOPIFY_TOKEN) {
    return cached ? cached.data : null;
  }

  const endpoint = `https://${cleanDomain}/api/${API_VERSION}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      console.warn(`[Shopify API Warning] HTTP ${res.status}: ${res.statusText}`);
      return cached ? cached.data : null;
    }

    const json = await res.json();
    if (json.errors) {
      console.warn(`[Shopify API GraphQL Errors]`, json.errors);
    }
    if (json.data) {
      shopifyCache.set(cacheKey, { data: json.data, timestamp: Date.now() });
    }
    return json.data || (cached ? cached.data : null);
  } catch (err: any) {
    console.warn(`[Shopify API Fetch Error] ${err.message}`);
    return cached ? cached.data : null;
  }
}

/**
 * Format raw GraphQL Shopify Product node into internal Product format
 */
function formatShopifyNode(node: any): ShopifyProduct {
  const priceAmount = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const images = node.images?.edges?.map((e: any) => e.node?.url) || [];
  const primaryImage = images[0] || node.featuredImage?.url || '/assets/images/495796722_17855245344426391_1865744983267983749_n.jpg';
  
  const firstVariant = node.variants?.edges?.[0]?.node;

  return {
    id: node.id || `shopify-${node.handle}`,
    title: node.title || 'Luxury Piece',
    description: node.description || 'Handcrafted luxury piece.',
    category: node.productType ? node.productType.toLowerCase() : 'jewelry',
    material: node.vendor || 'Solid Gold & Diamonds',
    price: priceAmount > 0 ? priceAmount : 2500,
    image: primaryImage,
    thumbnails: images.length > 0 ? images : [primaryImage],
    rating: 4.9,
    reviewsCount: Math.floor(Math.random() * 10) + 1,
    specs: JSON.stringify({
      vendor: node.vendor || 'JD Jewel',
      type: node.productType || 'Fine Jewelry',
      tags: node.tags || []
    }),
    care: 'Clean with warm soapy water and a soft cloth.',
    handle: node.handle,
    variantId: firstVariant?.id,
    availableForSale: node.availableForSale ?? true
  };
}

export class ShopifyService {
  /**
   * Fetch all products from Shopify Storefront API
   */
  public static async getProducts(limit = 20): Promise<ShopifyProduct[]> {
    const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              handle
              title
              description
              productType
              vendor
              availableForSale
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                url
                altText
              }
              images(first: 5) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyFetch<any>({ query, variables: { first: limit } });
    if (!data?.products?.edges) {
      return [];
    }

    return data.products.edges.map((edge: any) => formatShopifyNode(edge.node));
  }

  /**
   * Fetch single product by handle
   */
  public static async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const query = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          handle
          title
          description
          productType
          vendor
          availableForSale
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }
    `;

    const data = await shopifyFetch<any>({ query, variables: { handle } });
    if (!data?.productByHandle) {
      return null;
    }

    return formatShopifyNode(data.productByHandle);
  }

  /**
   * Create Shopify Checkout / Cart for direct checkout redirection
   */
  public static async createCart(lines: Array<{ merchandiseId: string; quantity: number }>): Promise<{ id: string; checkoutUrl: string } | null> {
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await shopifyFetch<any>({
      query,
      variables: {
        input: { lines }
      }
    });

    if (data?.cartCreate?.cart) {
      return data.cartCreate.cart;
    }
    return null;
  }
}
