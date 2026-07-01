import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { productId, author, rating, comment } = body;

    // Validate parameter presence
    if (!productId || !author || !comment || rating === undefined) {
      return NextResponse.json({ error: "Missing review details" }, { status: 400 });
    }

    // Validate rating range
    const parsedRating = parseInt(rating.toString(), 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating score must be an integer between 1 and 5" }, { status: 400 });
    }

    // Verify product exists in database to prevent orphaned records or mock reference injection
    const targetProduct = await db.product.findUnique({ where: { id: productId } });
    if (!targetProduct) {
      return NextResponse.json({ error: "Target catalog product not found" }, { status: 400 });
    }

    // Sanitize string inputs (XSS prevention)
    const sanitizedAuthor = sanitizeString(author);
    const sanitizedComment = sanitizeString(comment);

    const review = await db.review.create({
      data: {
        productId,
        author: sanitizedAuthor,
        rating: parsedRating,
        comment: sanitizedComment
      }
    });

    return NextResponse.json(review);
  } catch (e) {
    console.error("API Create review failure:", e);
    return NextResponse.json({ error: "Failed to write review to registry" }, { status: 500 });
  }
}
