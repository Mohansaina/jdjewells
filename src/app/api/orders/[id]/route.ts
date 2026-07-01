import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getDbClient();
  const { id } = await params;
  try {
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Missing status field" }, { status: 400 });
    }

    const updated = await db.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("API Update order failure:", e);
    return NextResponse.json({ error: "Failed to modify order status" }, { status: 500 });
  }
}
