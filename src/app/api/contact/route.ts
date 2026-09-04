// src/app/api/contact/route.ts
//
// Handles the public contact form on /contact. No auth required — anyone
// can reach out. Rate limiting isn't in place yet (same as signup/login),
// worth adding if this gets abused.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactFormEmail } from '@/lib/email';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Enter a valid email address').max(320),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const sent = await sendContactFormEmail(parsed.data);

  if (!sent) {
    return NextResponse.json(
      { error: 'Could not send your message right now. Please try again shortly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
