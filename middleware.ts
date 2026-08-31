// middleware.ts
//
// Server-side gate for everything under /admin except the login page itself.
// Runs before any /admin/* page renders, so visiting a URL like
// /admin/contractors/new directly no longer shows the form to a logged-out
// visitor — it redirects to /admin (the login page) instead.
//
// Uses the same shared-password cookie scheme as src/lib/admin-auth.ts
// (bb_admin_session === ADMIN_PASSWORD). Middleware can't use next/headers'
// cookies() helper or touch Prisma, so this reads the cookie directly off
// the request instead of importing isAdminAuthenticated().

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'bb_admin_session';

export function middleware(req: NextRequest) {
  // /admin itself is the login page — never gate it, or a logged-out
  // visitor gets redirected to /admin, which redirects to /admin, forever.
  if (req.nextUrl.pathname === '/admin') {
    return NextResponse.next();
  }

  const session = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

// Protects every /admin/* subpage. Does NOT need to cover /api/admin/*:
// those routes already call isAdminAuthenticated() themselves and return
// 401 on their own — this is just for the page UI.
export const config = {
  matcher: ['/admin/:path*'],
};
