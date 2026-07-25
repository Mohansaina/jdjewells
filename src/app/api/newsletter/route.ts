import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateEmail } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const sanitizedEmail = sanitizeString(email);

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    // Check if subscriber already exists
    const existing = await db.newsletterSubscriber.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existing) {
      return NextResponse.json({ message: "You are already subscribed to the newsletter!" }, { status: 200 });
    }

    // Save subscriber
    const subscriber = await db.newsletterSubscriber.create({
      data: {
        email: sanitizedEmail
      }
    });

    return NextResponse.json({ message: "Successfully subscribed to the newsletter!", subscriber }, { status: 201 });
  } catch (e) {
    console.error("API Create newsletter subscriber failure:", e);
    return NextResponse.json({ error: "Failed to record newsletter subscription" }, { status: 500 });
  }
}

export async function GET() {
  const db = getDbClient();
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subscribers);
  } catch (e) {
    console.error("API Get newsletter subscribers failure:", e);
    return NextResponse.json({ error: "Failed to retrieve subscribers" }, { status: 500 });
  }
}
