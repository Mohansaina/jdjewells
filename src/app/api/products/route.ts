import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateCategory } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDbClient();
  try {
    const products = await db.product.findMany();
    return NextResponse.json(products);
  } catch (e) {
    console.error("API Get products failure:", e);
    return NextResponse.json({ error: "Failed to read products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { title, description, category, material, price, image, specs, care } = body;

    // Validate parameter presence
    if (!title || !category || price === undefined || !image) {
      return NextResponse.json({ error: "Invalid product parameters: Missing required parameters" }, { status: 400 });
    }

    // Validate category sets
    const sanitizedCategory = sanitizeString(category).toLowerCase();
    if (!validateCategory(sanitizedCategory)) {
      return NextResponse.json({ error: `Unsupported product category: ${sanitizedCategory}` }, { status: 400 });
    }

    // Validate price range
    const parsedPrice = parseFloat(price.toString());
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    // Sanitize string inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedDesc = sanitizeString(description || material || "Fine exclusive collection");
    const sanitizedMaterial = sanitizeString(material || '');
    const sanitizedImage = sanitizeString(image);
    const sanitizedCare = care ? sanitizeString(care) : null;
    const sanitizedSpecs = specs ? sanitizeString(specs) : '{}';

    const item = await db.product.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDesc,
        category: sanitizedCategory,
        material: sanitizedMaterial,
        price: parsedPrice,
        image: sanitizedImage,
        specs: sanitizedSpecs,
        care: sanitizedCare
      }
    });

    return NextResponse.json(item);
  } catch (e) {
    console.error("API Create product failure:", e);
    return NextResponse.json({ error: "Failed to add product to catalog" }, { status: 500 });
  }
}
