// src/app/browse/page.tsx

'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

type Contractor = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  city: string;
  area: string;
  tradeTypes: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  yearsInBusiness: number | null;
  rating: number;
  reviewCount: number;
  licenseNumber: string;
  _count: { projects: number };
};

function BrowsePageInner() {
  const searchParams = useSearchParams();
  const [contractors, setContractors] = useState<Contractor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string>(searchParams.get('trade') ?? 'all');

  useEffect(() => {
    fetch('/api/contractors')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load contractors');
        return res.json();
      })
      .then(setContractors)
      .catch(() => setError('Could not load contractors right now. Please try again shortly.'));
  }, []);

  const availableTrades = useMemo(() => {
    if (!contractors) return [];
    const allTrades = contractors.flatMap((c) => c.tradeTypes);
    return Array.from(new Set(allTrades)).sort();
  }, [contractors]);

  const filteredContractors = useMemo(() => {
    if (!contractors) return null;
    if (selectedTrade === 'all') return contractors;
    return contractors.filter((c) => c.tradeTypes.includes(selectedTrade));
  }, [contractors, selectedTrade]);

  return (
    <>
      <Nav />

      <header className="bg-paper text-ink border-b border-line pt-11 pb-10">
        <div className="max-w-[1180px] mx-auto px-8">
          <h1 className="font-display font-light text-[clamp(28px,3.6vw,38px)]">
            Find your contractor
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-[1180px] mx-auto px-8 py-10 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        {!error && contractors === null && (
          <p className="text-stone text-sm">Loading contractors…</p>
        )}

        {contractors !== null && filteredContractors !== null && (
          <>
            {availableTrades.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTrade('all')}
                  className={`text-[13px] px-3.5 py-2 rounded-full border transition-colors ${
                    selectedTrade === 'all'
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-paper text-stone border-line hover:border-ink'
                  }`}
                >
                  All trades
                </button>
                {availableTrades.map((trade) => (
                  <button
                    key={trade}
                    onClick={() => setSelectedTrade(trade)}
                    className={`text-[13px] px-3.5 py-2 rounded-full border transition-colors ${
                      selectedTrade === trade
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-paper text-stone border-line hover:border-ink'
                    }`}
                  >
                    {trade}
                  </button>
                ))}
              </div>
            )}

            <p className="text-sm text-stone mb-6">
              {filteredContractors.length === 0
                ? selectedTrade === 'all'
                  ? 'No verified contractors yet.'
                  : `No verified contractors for "${selectedTrade}" yet.`
                : `${filteredContractors.length} verified contractor${filteredContractors.length === 1 ? '' : 's'}`}
            </p>

            {filteredContractors.length === 0 ? (
              <div className="border border-line rounded-md p-10 text-center bg-paper">
                <p className="text-stone font-medium mb-1">No contractors listed yet</p>
                <p className="text-sm text-stone">
                  {selectedTrade === 'all'
                    ? 'Check back soon — new contractors are added and verified regularly.'
                    : 'Try a different trade, or check back soon as more contractors are added.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredContractors.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contractors/${c.slug}`}
                    className="block bg-paper border border-line rounded-md p-6 hover:border-ink transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-ink text-paper font-display text-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {c.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- external Blob URL
                          <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          c.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                          <span className="font-display text-lg">{c.name}</span>
                          {c.verificationStatus === 'VERIFIED' && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-sage bg-sage-soft border border-sage/25 rounded-full px-2.5 py-1">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone mb-3">
                          📍 {c.area}, {c.city} · License {c.licenseNumber}
                        </p>
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {c.tradeTypes.map((t) => (
                            <span key={t} className="text-[11px] font-medium px-2.5 py-1 bg-paper-dim rounded-full text-stone">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="font-medium block">{c._count.projects}</span>
                            <span className="text-xs text-stone">Projects listed</span>
                          </div>
                          {c.reviewCount > 0 && (
                            <div>
                              <span className="font-medium block">
                                {c.rating.toFixed(1)} ★
                              </span>
                              <span className="text-xs text-stone">{c.reviewCount} reviews</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowsePageInner />
    </Suspense>
  );
}
