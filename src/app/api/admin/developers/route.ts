// src/app/api/admin/developers/route.ts
//
// Lists every Developer account (the site's "users" — people who sign up
// to submit quote requests). Read-only for now: no edit/delete here, since
// there's no product reason yet to modify a developer's account from
// admin. Gated the same way as the rest of /api/admin.

import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const developers = await prisma.developer.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { quoteRequests: true } },
    },
  });

  return NextResponse.json(developers);
}
