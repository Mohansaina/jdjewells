import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateShape } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDbClient();
  try {
    const diamonds = await db.diamond.findMany();
    return NextResponse.json(diamonds);
  } catch (e) {
    console.error("API Get diamonds failure:", e);
    return NextResponse.json({ error: "Failed to read diamonds registry" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { shape, carat, color, clarity, cut, price, certificate } = body;

    // Validate parameter presence
    if (!shape || carat === undefined || price === undefined) {
      return NextResponse.json({ error: "Invalid diamond specifications: Missing required parameters" }, { status: 400 });
    }

    // Validate stone shape bounds
    const sanitizedShape = sanitizeString(shape);
    if (!validateShape(sanitizedShape)) {
      return NextResponse.json({ error: `Unsupported diamond shape: ${sanitizedShape}` }, { status: 400 });
    }

    // Validate float ranges
    const parsedCarat = parseFloat(carat.toString());
    const parsedPrice = parseFloat(price.toString());

    if (isNaN(parsedCarat) || parsedCarat <= 0 || parsedCarat > 30) {
      return NextResponse.json({ error: "Carat weight must be a positive number under 30ct" }, { status: 400 });
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    // Sanitize strings
    const sanitizedColor = sanitizeString(color || 'D');
    const sanitizedClarity = sanitizeString(clarity || 'VVS1');
    const sanitizedCut = sanitizeString(cut || 'Excellent');
    const sanitizedCert = sanitizeString(certificate || 'GIA');

    const certNo = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const stone = await db.diamond.create({
      data: {
        shape: sanitizedShape,
        carat: parsedCarat,
        color: sanitizedColor,
        clarity: sanitizedClarity,
        cut: sanitizedCut,
        price: parsedPrice,
        certificate: sanitizedCert,
        certificateNo: certNo,
        certificateUrl: `https://www.gia.edu/report-check?reportno=${certNo}`,
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
        polish: 'Excellent',
        symmetry: 'Excellent',
        fluorescence: 'None'
      }
    });

    return NextResponse.json(stone);
  } catch (e) {
    console.error("API Create diamond failure:", e);
    return NextResponse.json({ error: "Failed to add diamond to vault" }, { status: 500 });
  }
}
