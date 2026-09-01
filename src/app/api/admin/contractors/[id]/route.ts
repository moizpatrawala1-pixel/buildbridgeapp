// src/app/api/admin/contractors/[id]/route.ts
//
// Single-contractor admin operations: delete one, or update its
// verification status. Gated by the same shared admin password session as
// the rest of /api/admin.
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

// PATCH updates a contractor's verification status only. Gated the same
// way as DELETE above. Rejects anything that isn't one of the three valid
// enum values so a bad request can't write garbage into the column.
const VALID_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED'] as const;
type VerificationStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const verificationStatus = body?.verificationStatus as VerificationStatus;

  if (!VALID_STATUSES.includes(verificationStatus)) {
    return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
  }

  const existing = await prisma.contractor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
  }

  const updated = await prisma.contractor.update({
    where: { id },
    data: { verificationStatus },
  });

  return NextResponse.json({ ok: true, contractor: updated });
}
