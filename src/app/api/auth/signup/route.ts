import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateEmail } from '@/lib/validation';
import { hashPassword, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const sanitizedName = sanitizeString(name || '');
    const sanitizedEmail = sanitizeString(email || '').toLowerCase();

    // Validation checks
    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid name (at least 2 characters).' }, { status: 400 });
    }

    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email: sanitizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email address already exists. Please sign in instead.' }, { status: 400 });
    }

    // Hash password & create user
    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        role: 'CUSTOMER'
      }
    });

    const token = generateToken();

    // Return sanitized user object (excluding passwordHash)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    }, { status: 201 });

  } catch (e: any) {
    console.error('API Signup failure:', e);
    return NextResponse.json({ error: 'Failed to create user account. Please try again.' }, { status: 500 });
  }
}
