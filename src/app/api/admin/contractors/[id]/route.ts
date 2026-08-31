// src/app/api/admin/contractors/[id]/route.ts
//
// Single-contractor admin operations: delete one. Gated by the same shared
// admin password session as the rest of /api/admin.
//
// DELETE cascades to that contractor's Projects AND their QuoteRequests —
// see the onDelete: Cascade on both relations in schema.prisma. This means
// deleting a contractor with real quote-request history permanently erases
// that history, not just the contractor's profile. There's no "soft delete"
// or undo here; the confirmation step lives in the admin UI, not here.

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.contractor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
  }

  await prisma.contractor.delete({ where: { id } });

  return NextResponse.json({ ok: true, deletedName: existing.name });
}