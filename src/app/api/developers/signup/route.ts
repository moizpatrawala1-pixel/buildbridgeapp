// src/app/api/developers/signup/route.ts
//
// Creates a new Developer account. Password is hashed with bcrypt before
// storage. Returns a generic error on duplicate email rather than confirming
// "that email is already registered" — this is a small but standard
// precaution against using the signup endpoint to enumerate which emails
// already have accounts.

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
  phone: z.string().trim().max(20).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const { name, email, password, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.developer.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    // Deliberately generic — see file header comment.
    return NextResponse.json(
      { error: 'Could not create account with these details' },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const developer = await prisma.developer.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      phone,
    },
  });

  return NextResponse.json({ id: developer.id, name: developer.name, email: developer.email });
}
