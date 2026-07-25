import fs from 'fs';
import path from 'path';

export interface VdbJewelrySearchParams {
  category?: string | null;
  search?: string | null;
  metals?: string[];
  shapes?: string[];
  styles?: string[];
  page?: number;
  limit?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface VdbJewelryItem {
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
  specs: string; // JSON string
  care?: string;
}

export interface VdbJewelryListResponse {
  products: VdbJewelryItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Simple in-memory cache for API responses (5 minutes TTL)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class VdbService {
  private static getCache(key: string): any | null {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
    return null;
  }

  private static setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Main query function. When VDB_JEWELRY_MODE=local (default), serves from
   * .local_db.json instantly. Set VDB_JEWELRY_MODE=api to hit VDB live.
   */
  public static async getProducts(params: VdbJewelrySearchParams): Promise<VdbJewelryListResponse> {
    const cacheKey = JSON.stringify(params);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const jewelryMode = process.env.VDB_JEWELRY_MODE || 'local';
    const apiKey = process.env.VDB_API_KEY || '';
    const accessToken = process.env.VDB_ACCESS_TOKEN || '';
    const page = params.page || 1;
    const limit = params.limit || 9;

    // Skip VDB API when mode is 'local' or no API key is set
    if (jewelryMode === 'local' || !apiKey) {
      const result = this.queryLocalDatabase(params);
      this.setCache(cacheKey, result);
      return result;
    }

    // Build VDB Query parameters
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      page: page.toString(),
      records_per_page: limit.toString(),
    });

    if (accessToken) {
      queryParams.append('access_token', accessToken);
    }

    // Map and append filters if they exist
    if (params.category) {
      queryParams.append('jewelry_category[]', this.mapLocalCategoryToVdb(params.category));
    }
    if (params.search) {
      queryParams.append('keyword', params.search);
    }
    if (params.metals && params.metals.length > 0) {
      params.metals.forEach(metal => queryParams.append('metal[]', metal));
    }
    if (params.shapes && params.shapes.length > 0) {
      params.shapes.forEach(shape => queryParams.append('diamond_shape[]', shape));
    }
    if (params.styles && params.styles.length > 0) {
      params.styles.forEach(style => queryParams.append('jewelry_style[]', style));
    }
    if (params.priceMin) {
      queryParams.append('price_min', params.priceMin.toString());
    }
    if (params.priceMax) {
      queryParams.append('price_max', params.priceMax.toString());
    }

    const vdbUrl = `https://api.vdbapp.com/v3/jewelries?${queryParams.toString()}`;

    try {
      console.log(`[VDB Service] Querying VDB API: ${vdbUrl.replace(apiKey, "HIDDEN")}`);
      
      const res = await fetch(vdbUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Timeout after 8 seconds
        signal: AbortSignal.timeout(8000)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      
      // Check for Heroku crash pages or malformed bodies
      if (!json || typeof json !== 'object' || !json.response) {
        throw new Error("Invalid API response format");
      }

      const rawItems = json.response.body || [];
      const totalCount = parseInt(json.response.total_count || '0') || rawItems.length;
      
      const products: VdbJewelryItem[] = rawItems.map((item: any) => this.mapVdbItemToProduct(item));
      const totalPages = Math.ceil(totalCount / limit) || 1;

      const responseData: VdbJewelryListResponse = {
        products,
        totalCount,
        totalPages,
        currentPage: page
      };

      this.setCache(cacheKey, responseData);
      return responseData;

    } catch (error: any) {
      console.warn(`[VDB Service] VDB API call failed: ${error.message}. Falling back to local offline JSON database.`);
      const result = this.queryLocalDatabase(params);
      this.setCache(cacheKey, result);
      return result;
    }
  }

  /**
   * Fetches detailed data for a single jewelry item.
   * Uses local database when VDB_JEWELRY_MODE=local (default).
   */
  public static async getProductById(id: string): Promise<VdbJewelryItem | null> {
    const jewelryMode = process.env.VDB_JEWELRY_MODE || 'local';
    const apiKey = process.env.VDB_API_KEY || '';
    const accessToken = process.env.VDB_ACCESS_TOKEN || '';

    // Use local database when mode is 'local', item is local, or no key
    if (jewelryMode === 'local' || !id.startsWith('vdb-') || !apiKey) {
      return this.getLocalProductById(id);
    }

    const cleanId = id.replace('vdb-', '');
    const queryParams = new URLSearchParams({ api_key: apiKey });
    if (accessToken) queryParams.append('access_token', accessToken);

    const vdbUrl = `https://api.vdbapp.com/v3/jewelries/${cleanId}?${queryParams.toString()}`;

    try {
      console.log(`[VDB Service] Fetching VDB item: ${cleanId}`);

      const res = await fetch(vdbUrl, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      if (json?.response?.body?.[0]) {
        return this.mapVdbItemToProduct(json.response.body[0]);
      }
      return null;
    } catch (error: any) {
      console.warn(`[VDB Service] VDB item fetch failed (${error.message}). Falling back to local JSON database.`);
      return this.getLocalProductById(id);
    }
  }

  /**
   * Helper mapping local categories to VDB Jewelry Categories
   */
  private static mapLocalCategoryToVdb(category: string): string {
    const catMap: Record<string, string> = {
      'rings': 'Rings',
      'wedding bands': 'Bands',
      'engagement rings': 'Rings',
      'bracelets': 'Bracelets',
      'necklaces': 'Necklaces',
      'pendants': 'Pendants',
      'earrings': 'Earrings',
      'custom': 'Custom',
    };
    return catMap[category.toLowerCase()] || category;
  }

  /**
   * Helper mapping VDB Categories back to local categories
   */
  private static mapVdbCategoryToLocal(vdbCategory: string): string {
    const catMap: Record<string, string> = {
      'Rings': 'rings',
      'Bands': 'wedding bands',
      'Engagement Rings': 'engagement rings',
      'Bracelets': 'bracelets',
      'Necklaces': 'necklaces',
      'Pendants': 'pendants',
      'Earrings': 'earrings',
      'Custom': 'custom',
    };
    return catMap[vdbCategory] || vdbCategory?.toLowerCase() || 'rings';
  }

  /**
   * Converts raw VDB API jewelry object to the frontend client format
   */
  private static mapVdbItemToProduct(item: any): VdbJewelryItem {
    const id = `vdb-${item.item_id}`;
    const category = this.mapVdbCategoryToLocal(item.jewelry_category || 'Rings');
    const price = Number(item.retail_price || item.price || 1500);
    const material = item.metal || item.metal_type || '18k White Gold';
    
    // Fallback/Synthetic ratings and reviews for VDB inventory
    const numericId = parseInt(item.item_id) || 100;
    const rating = parseFloat((4.6 + (numericId % 5) * 0.1).toFixed(1));
    const reviewsCount = (numericId % 20) + 1;

    // Collect multiple thumbnails if present in VDB response
    const images: string[] = [];
    if (item.image_url) images.push(item.image_url);
    if (Array.isArray(item.images)) {
      item.images.forEach((img: any) => {
        const url = typeof img === 'string' ? img : img.image_url || img.url;
        if (url && !images.includes(url)) images.push(url);
      });
    }
    if (images.length === 0) {
      images.push('/assets/images/logo.png'); // absolute fallback
    }

    const title = item.jewelry_title || item.name || item.title || `${material} ${item.jewelry_category || 'Jewelry'}`;
    const description = item.description || item.jewelry_desc || `An exquisite ${material} ${category} masterfully crafted to meet the highest benchmarks of quality and detailing.`;

    const specsJson = JSON.stringify({
      metal: material,
      stone: item.stone_type || item.diamond_type || 'Natural Round Diamonds',
      setting: item.jewelry_style || item.style || 'Classic Prong Setting',
      width: item.width || '2.2mm',
      SKU: item.sku || item.stock_number || `VDB-${item.item_id}`,
      availability: item.availability || 'In Stock',
      vendor: item.vendor_name || 'VDB Wholesale Vendor'
    });

    return {
      id,
      title,
      description,
      category,
      material,
      price,
      image: images[0],
      thumbnails: images,
      rating,
      reviewsCount,
      specs: specsJson,
      care: item.care_instructions || "Avoid exposing to abrasive chemicals. Clean using warm water, mild soap, and a soft toothbrush. Dry with a lint-free cloth."
    };
  }

  /**
   * Executes search, filters, and pagination locally over the .local_db.json file
   */
  private static queryLocalDatabase(params: VdbJewelrySearchParams): VdbJewelryListResponse {
    try {
      const dbPath = path.join(process.cwd(), '.local_db.json');
      if (!fs.existsSync(dbPath)) {
        return { products: [], totalCount: 0, totalPages: 0, currentPage: 1 };
      }

      const fileData = fs.readFileSync(dbPath, 'utf-8');
      const dbObj = JSON.parse(fileData);
      let items: any[] = dbObj.products || [];

      // Filter by Category
      if (params.category) {
        items = items.filter(item => item.category?.toLowerCase() === params.category?.toLowerCase());
      }

      // Filter by Search Keyword
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter(item => 
          item.title?.toLowerCase().includes(q) || 
          item.description?.toLowerCase().includes(q) ||
          item.material?.toLowerCase().includes(q)
        );
      }

      // Filter by Metals
      if (params.metals && params.metals.length > 0) {
        const selectedMetalsLower = params.metals.map(m => m.toLowerCase());
        items = items.filter(item => {
          const materialLower = item.material?.toLowerCase() || '';
          return selectedMetalsLower.some(metal => materialLower.includes(metal));
        });
      }

      // Filter by Shapes
      if (params.shapes && params.shapes.length > 0) {
        const selectedShapesLower = params.shapes.map(s => s.toLowerCase());
        items = items.filter(item => {
          let shapeMatch = false;
          try {
            const specs = JSON.parse(item.specs || '{}');
            if (specs.shape) shapeMatch = selectedShapesLower.includes(specs.shape.toLowerCase());
          } catch(e) {}
          
          if (!shapeMatch) {
            const titleLower = item.title?.toLowerCase() || '';
            shapeMatch = selectedShapesLower.some(s => titleLower.includes(s));
          }
          return shapeMatch;
        });
      }

      // Filter by Styles
      if (params.styles && params.styles.length > 0) {
        const selectedStylesLower = params.styles.map(s => s.toLowerCase());
        items = items.filter(item => {
          let styleMatch = false;
          try {
            const specs = JSON.parse(item.specs || '{}');
            if (specs.setting) styleMatch = selectedStylesLower.includes(specs.setting.toLowerCase());
          } catch(e) {}
          
          if (!styleMatch) {
            const titleLower = item.title?.toLowerCase() || '';
            styleMatch = selectedStylesLower.some(s => titleLower.includes(s));
          }
          return styleMatch;
        });
      }

      // Filter by Price range
      if (params.priceMin !== undefined) {
        items = items.filter(item => Number(item.price) >= params.priceMin!);
      }
      if (params.priceMax !== undefined) {
        items = items.filter(item => Number(item.price) <= params.priceMax!);
      }

      // Total count before pagination slicing
      const totalCount = items.length;
      const page = params.page || 1;
      const limit = params.limit || 9;
      const totalPages = Math.ceil(totalCount / limit) || 1;

      // Slice page
      const startIdx = (page - 1) * limit;
      const slicedItems = items.slice(startIdx, startIdx + limit);

      // Map mock items to VdbJewelryItem shape
      const products: VdbJewelryItem[] = slicedItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: item.category,
        material: item.material || '',
        price: Number(item.price),
        image: item.image,
        thumbnails: item.thumbnails || [item.image],
        rating: Number(item.rating || 5),
        reviewsCount: Number(item.reviewsCount || 0),
        specs: item.specs || '{}',
        care: item.care || undefined
      }));

      return {
        products,
        totalCount,
        totalPages,
        currentPage: page
      };

    } catch (e) {
      console.error("[VDB Service] Fallback database query crashed:", e);
      return { products: [], totalCount: 0, totalPages: 0, currentPage: 1 };
    }
  }

  /**
   * Fetches single item from mock database
   */
  private static getLocalProductById(id: string): VdbJewelryItem | null {
    try {
      const dbPath = path.join(process.cwd(), '.local_db.json');
      if (!fs.existsSync(dbPath)) return null;

      const fileData = fs.readFileSync(dbPath, 'utf-8');
      const dbObj = JSON.parse(fileData);
      const product = (dbObj.products || []).find((p: any) => p.id === id);

      if (!product) return null;

      return {
        id: product.id,
        title: product.title,
        description: product.description || '',
        category: product.category,
        material: product.material || '',
        price: Number(product.price),
        image: product.image,
        thumbnails: product.thumbnails || [product.image],
        rating: Number(product.rating || 5),
        reviewsCount: Number(product.reviewsCount || 0),
        specs: product.specs || '{}',
        care: product.care || undefined
      };
    } catch (e) {
      console.error("[VDB Service] Fallback item retrieve crashed:", e);
      return null;
    }
  }
}
