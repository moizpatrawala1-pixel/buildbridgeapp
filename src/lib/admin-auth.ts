// src/lib/admin-auth.ts
//
// A deliberately simple gate for the admin contractor-add page: one shared
// password, stored in ADMIN_PASSWORD, checked against a cookie.
//
// This is NOT real auth. There's no user record, no per-admin audit trail,
// and the password is a single shared secret. That's a reasonable tradeoff
// while it's just you adding contractors by hand — but the moment a second
// person needs admin access, or you want to know *who* verified a given
// contractor, replace this with a real admin user table and proper
// authentication. Don't let this stopgap outlive its reason for existing.

import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'bb_admin_session';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === process.env.ADMIN_PASSWORD;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, process.env.ADMIN_PASSWORD ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
