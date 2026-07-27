import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateEmail } from '@/lib/validation';
import { verifyPassword, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { email, password } = body;

    const sanitizedEmail = sanitizeString(email || '').toLowerCase();

    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Please enter your password.' }, { status: 400 });
    }

    // Lookup user
    const user = await db.user.findUnique({ where: { email: sanitizedEmail } });
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email. Please check your credentials or sign up.' }, { status: 401 });
    }

    // Verify password
    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = generateToken();

    // Return sanitized user payload
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });

  } catch (e: any) {
    console.error('API Login failure:', e);
    return NextResponse.json({ error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}
