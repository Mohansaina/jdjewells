import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getDbClient();
  const { id } = await params;
  try {
    const product = await db.product.findUnique({
      where: { id }
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (e) {
    console.error("API Get product details failure:", e);
    return NextResponse.json({ error: "Failed to read product details" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getDbClient();
  const { id } = await params;
  try {
    const body = await req.json();
    const { title, description, material, price, image, specs, care } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = sanitizeString(title);
    if (description !== undefined) dataToUpdate.description = sanitizeString(description);
    if (material !== undefined) dataToUpdate.material = sanitizeString(material);
    if (price !== undefined) {
      const parsedPrice = parseFloat(price.toString());
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
      }
      dataToUpdate.price = parsedPrice;
    }
    if (image !== undefined) dataToUpdate.image = sanitizeString(image);
    if (specs !== undefined) dataToUpdate.specs = sanitizeString(typeof specs === 'string' ? specs : JSON.stringify(specs));
    if (care !== undefined) dataToUpdate.care = care ? sanitizeString(care) : null;

    const updated = await db.product.update({
      where: { id },
      data: dataToUpdate
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("API Update product failure:", e);
    return NextResponse.json({ error: "Failed to update product details" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getDbClient();
  const { id } = await params;
  try {
    const deleted = await db.product.delete({
      where: { id }
    });
    return NextResponse.json(deleted);
  } catch (e) {
    console.error("API Delete product failure:", e);
    return NextResponse.json({ error: "Failed to remove product from catalog" }, { status: 500 });
  }
}
