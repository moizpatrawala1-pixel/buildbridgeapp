// src/app/admin/contractors/new/page.tsx
//
// The form you'll actually use to add contractors. Posts to
// /api/admin/contractors, which is gated by the admin session cookie — if
// that cookie is missing or wrong, the POST returns 401 and this page shows
// that error rather than pretending it worked.
//
// verificationStatus defaults to PENDING, not VERIFIED — see the comment on
// the schema's VerificationStatus enum. Only flip it to VERIFIED here once
// you've actually confirmed the license number.

'use client';

import { useState } from 'react';
import Link from 'next/link';

type ProjectDraft = {
  title: string;
  clientName: string;
  projectType: string;
  contractValueLakh: string;
  completedYear: string;
};

const emptyProject = (): ProjectDraft => ({
  title: '',
  clientName: '',
  projectType: '',
  contractValueLakh: '',
  completedYear: '',
});

export default function NewContractorPage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [area, setArea] = useState('');
  const [tradeTypesInput, setTradeTypesInput] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'VERIFIED'>('PENDING');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [teamSizeMin, setTeamSizeMin] = useState('');
  const [teamSizeMax, setTeamSizeMax] = useState('');
  const [gstRegistered, setGstRegistered] = useState(false);
  const [insuranceCoverLakh, setInsuranceCoverLakh] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [projects, setProjects] = useState<ProjectDraft[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addProjectRow() {
    setProjects((p) => [...p, emptyProject()]);
  }

  function updateProject(index: number, field: keyof ProjectDraft, value: string) {
    setProjects((p) => p.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj)));
  }

  function removeProject(index: number) {
    setProjects((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const payload = {
      name,
      city,
      area,
      tradeTypes: tradeTypesInput.split(',').map((t) => t.trim()).filter(Boolean),
      licenseNumber,
      verificationStatus,
      yearsInBusiness: yearsInBusiness ? Number(yearsInBusiness) : undefined,
      teamSizeMin: teamSizeMin ? Number(teamSizeMin) : undefined,
      teamSizeMax: teamSizeMax ? Number(teamSizeMax) : undefined,
      gstRegistered,
      insuranceCoverLakh: insuranceCoverLakh ? Number(insuranceCoverLakh) : undefined,
      phone,
      email: email || undefined,
      bio: bio || undefined,
      projects: projects
        .filter((p) => p.title.trim())
        .map((p) => ({
          title: p.title,
          clientName: p.clientName || undefined,
          projectType: p.projectType || undefined,
          contractValueLakh: p.contractValueLakh ? Number(p.contractValueLakh) : undefined,
          completedYear: p.completedYear ? Number(p.completedYear) : undefined,
        })),
    };

    try {
      const res = await fetch('/api/admin/contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('Your admin session has expired. Please log in again.');
        } else {
          setError(data.error ?? 'Something went wrong');
        }
        setSubmitting(false);
        return;
      }

      setSuccess(`Added ${data.name}. You can add another below.`);
      // Reset the form for the next contractor.
      setName('');
      setArea('');
      setTradeTypesInput('');
      setLicenseNumber('');
      setVerificationStatus('PENDING');
      setYearsInBusiness('');
      setTeamSizeMin('');
      setTeamSizeMax('');
      setGstRegistered(false);
      setInsuranceCoverLakh('');
      setPhone('');
      setEmail('');
      setBio('');
      setProjects([]);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display font-bold text-2xl tracking-tight">Add a Contractor</h1>
          <Link href="/browse" className="text-sm text-charcoal/50 hover:text-amber">
            View live site →
          </Link>
        </div>
        <p className="text-charcoal/60 text-sm mb-8">
          Only set status to Verified once you&apos;ve confirmed the license number.
        </p>

        {success && (
          <div className="bg-verified-soft border border-verified/25 text-verified text-sm rounded-md p-3.5 mb-5">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3.5 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white border border-line rounded-md p-6">
          <Field label="Business name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="City">
              <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Area / neighborhood">
              <input required value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Thane" className={inputCls} />
            </Field>
          </div>

          <Field label="Trade types (comma-separated)">
            <input
              required
              value={tradeTypesInput}
              onChange={(e) => setTradeTypesInput(e.target.value)}
              placeholder="RCC & Structural, Waterproofing"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="License number">
              <input required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Verification status">
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as 'PENDING' | 'VERIFIED')}
                className={inputCls}
              >
                <option value="PENDING">Pending — not yet checked</option>
                <option value="VERIFIED">Verified — license confirmed</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Years in business">
              <input type="number" min="0" value={yearsInBusiness} onChange={(e) => setYearsInBusiness(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Team size (min)">
              <input type="number" min="0" value={teamSizeMin} onChange={(e) => setTeamSizeMin(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Team size (max)">
              <input type="number" min="0" value={teamSizeMax} onChange={(e) => setTeamSizeMax(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Insurance cover (₹ lakh)">
              <input type="number" min="0" value={insuranceCoverLakh} onChange={(e) => setInsuranceCoverLakh(e.target.value)} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-medium pb-2.5">
              <input type="checkbox" checked={gstRegistered} onChange={(e) => setGstRegistered(e.target.checked)} />
              GST registered
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone (used for quote notifications)">
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" className={inputCls} />
            </Field>
            <Field label="Email (optional)">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Bio (optional)">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className={inputCls} />
          </Field>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm">Completed projects (optional)</h3>
              <button type="button" onClick={addProjectRow} className="text-xs font-medium text-amber">
                + Add project
              </button>
            </div>
            {projects.length === 0 && (
              <p className="text-xs text-charcoal/50">
                No projects added. It&apos;s fine to leave this empty and add projects later — an empty
                list is more honest than one made up.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {projects.map((p, i) => (
                <div key={i} className="border border-line rounded-md p-3.5 bg-paper">
                  <div className="flex justify-between items-start mb-2.5">
                    <input
                      value={p.title}
                      onChange={(e) => updateProject(i, 'title', e.target.value)}
                      placeholder="Project title"
                      className={`${inputCls} flex-1 mr-2`}
                    />
                    <button type="button" onClick={() => removeProject(i)} className="text-xs text-red-600 px-1">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      value={p.clientName}
                      onChange={(e) => updateProject(i, 'clientName', e.target.value)}
                      placeholder="Client name (optional)"
                      className={inputCls}
                    />
                    <input
                      value={p.projectType}
                      onChange={(e) => updateProject(i, 'projectType', e.target.value)}
                      placeholder="e.g. Residential, 12 floors"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={p.contractValueLakh}
                      onChange={(e) => updateProject(i, 'contractValueLakh', e.target.value)}
                      placeholder="Contract value (₹ lakh)"
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={p.completedYear}
                      onChange={(e) => updateProject(i, 'completedYear', e.target.value)}
                      placeholder="Year completed"
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-amber text-white font-semibold text-sm py-3 rounded-[3px] hover:bg-[#be6520] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Adding…' : 'Add Contractor'}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-line rounded-[4px] text-[13.5px] bg-paper focus:outline-none focus:ring-2 focus:ring-amber';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
