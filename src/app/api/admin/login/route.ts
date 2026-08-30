// src/app/api/admin/login/route.ts
//
// Checks the submitted password against ADMIN_PASSWORD and sets the admin
// session cookie if it matches. See src/lib/admin-auth.ts for why this is
// a shared-password stopgap rather than real per-user auth.

import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const password = (body as { password?: string })?.password;

  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not set in the environment');
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
