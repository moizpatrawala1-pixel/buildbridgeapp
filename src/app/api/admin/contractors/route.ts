// src/app/api/admin/contractors/route.ts
//
// Add (POST) or list (GET) contractors as admin. Gated by the shared admin
// password session — see src/lib/admin-auth.ts. This is what the admin
// add-contractor page submits to.
//
// GET here deliberately includes unverified contractors and all fields
// (including phone) — this is the admin's own view, not the public browse
// API, so the restrictions in src/app/api/contractors/route.ts don't apply.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  clientName: z.string().trim().max(200).optional(),
  projectType: z.string().trim().max(200).optional(),
  contractValueLakh: z.number().int().positive().optional(),
  completedYear: z.number().int().min(1990).max(2100).optional(),
});

const contractorSchema = z.object({
  name: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  area: z.string().trim().min(1).max(100),
  tradeTypes: z.array(z.string().trim().min(1)).min(1, 'At least one trade type is required'),
  licenseNumber: z.string().trim().min(1).max(100),
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('PENDING'),
  yearsInBusiness: z.number().int().min(0).max(150).optional(),
  teamSizeMin: z.number().int().min(0).optional(),
  teamSizeMax: z.number().int().min(0).optional(),
  gstRegistered: z.boolean().default(false),
  insuranceCoverLakh: z.number().int().positive().optional(),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().optional().or(z.literal('')),
  bio: z.string().trim().max(2000).optional(),
  projects: z.array(projectSchema).default([]),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const contractors = await prisma.contractor.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { projects: true, quoteRequests: true } } },
  });

  return NextResponse.json(contractors);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = contractorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  const existingLicense = await prisma.contractor.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });
  if (existingLicense) {
    return NextResponse.json(
      { error: `A contractor with license number ${data.licenseNumber} already exists` },
      { status: 400 }
    );
  }

  const contractor = await prisma.contractor.create({
    data: {
      name: data.name,
      slug,
      city: data.city,
      area: data.area,
      tradeTypes: data.tradeTypes,
      licenseNumber: data.licenseNumber,
      verificationStatus: data.verificationStatus,
      verifiedAt: data.verificationStatus === 'VERIFIED' ? new Date() : null,
      yearsInBusiness: data.yearsInBusiness,
      teamSizeMin: data.teamSizeMin,
      teamSizeMax: data.teamSizeMax,
      gstRegistered: data.gstRegistered,
      insuranceCoverLakh: data.insuranceCoverLakh,
      phone: data.phone,
      email: data.email || undefined,
      bio: data.bio,
      projects: {
        create: data.projects.map((p) => ({
          title: p.title,
          clientName: p.clientName,
          projectType: p.projectType,
          contractValueLakh: p.contractValueLakh,
          completedYear: p.completedYear,
        })),
      },
    },
    include: { projects: true },
  });

  return NextResponse.json(contractor);
}
