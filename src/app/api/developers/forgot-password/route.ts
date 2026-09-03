// src/app/api/developers/forgot-password/route.ts
//
// Requests a password reset. Always returns the same generic success
// response whether or not the email is actually registered — this is
// deliberate, same reasoning as the signup route's duplicate-email
// handling: returning "no account with that email" here would let anyone
// probe which emails have accounts.

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const schema = z.object({
  email: z.string().trim().email().max(320),
});

const GENERIC_RESPONSE = {
  message: 'If an account exists with that email, a reset link has been sent.',
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(GENERIC_RESPONSE);
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  const developer = await prisma.developer.findUnique({ where: { email: normalizedEmail } });

  if (developer) {
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.developer.update({
      where: { id: developer.id },
      data: { passwordResetToken, passwordResetTokenExpiresAt },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? '';
    await sendPasswordResetEmail({
      toEmail: developer.email,
      toName: developer.name,
      resetUrl: `${baseUrl}/reset-password?token=${passwordResetToken}`,
    });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
