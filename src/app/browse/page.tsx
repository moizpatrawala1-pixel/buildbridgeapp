// src/app/browse/page.tsx
//
// Fetches real contractors from /api/contractors. Deliberately does NOT
// show a fake "N contractors match" count with a large invented number —
// it shows the real count, including when that's zero or one. A new
// platform with 3 contractors looking like it has hundreds isn't a good
// look when someone actually clicks into it and sees otherwise.
//
// Trade filter options are derived from the actual fetched contractors,
// not a hardcoded list — this guarantees every option shown has at least
// one real result, and the list never needs manual updating as new trades
// get added via the admin page.

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
  // Pre-select the trade filter from ?trade=X in the URL (used by the
  // landing page's trade-category links) — falls back to 'all' if absent
  // or if it doesn't match any real trade once contractors load.
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

      <header className="bg-charcoal text-paper pt-11 pb-10">
        <div className="max-w-[1440px] mx-auto px-8">
          <h1 className="font-display font-bold text-[clamp(28px,3.6vw,38px)] tracking-tight">
            Find your contractor
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-10 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4 mb-6">
            {error}
          </div>
        )}

        {!error && contractors === null && (
          <p className="text-charcoal/50 text-sm">Loading contractors…</p>
        )}

        {contractors !== null && filteredContractors !== null && (
          <>
            {availableTrades.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTrade('all')}
                  className={`text-[13px] font-medium px-3.5 py-2 rounded-full border transition-colors ${
                    selectedTrade === 'all'
                      ? 'bg-charcoal text-paper border-charcoal'
                      : 'bg-white text-charcoal/70 border-line hover:border-charcoal'
                  }`}
                >
                  All trades
                </button>
                {availableTrades.map((trade) => (
                  <button
                    key={trade}
                    onClick={() => setSelectedTrade(trade)}
                    className={`text-[13px] font-medium px-3.5 py-2 rounded-full border transition-colors ${
                      selectedTrade === trade
                        ? 'bg-charcoal text-paper border-charcoal'
                        : 'bg-white text-charcoal/70 border-line hover:border-charcoal'
                    }`}
                  >
                    {trade}
                  </button>
                ))}
              </div>
            )}

            <p className="text-sm text-charcoal/60 mb-6">
              {filteredContractors.length === 0
                ? selectedTrade === 'all'
                  ? 'No verified contractors yet.'
                  : `No verified contractors for "${selectedTrade}" yet.`
                : `${filteredContractors.length} verified contractor${filteredContractors.length === 1 ? '' : 's'}`}
            </p>

            {filteredContractors.length === 0 ? (
              <div className="border border-line rounded-md p-10 text-center bg-white">
                <p className="text-charcoal/70 font-medium mb-1">No contractors listed yet</p>
                <p className="text-sm text-charcoal/50">
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
                    className="block bg-white border border-line rounded-md p-6 hover:border-charcoal transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-charcoal text-amber-soft font-display font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {c.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- external Blob URL
                          <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          c.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                          <span className="font-display font-semibold text-lg">{c.name}</span>
                          {c.verificationStatus === 'VERIFIED' && (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-verified bg-verified-soft border border-verified/25 rounded-full px-2.5 py-1">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-charcoal/50 mb-3">
                          📍 {c.area}, {c.city} · License {c.licenseNumber}
                        </p>
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {c.tradeTypes.map((t) => (
                            <span key={t} className="text-[11px] font-medium px-2.5 py-1 bg-paper-dim rounded-full text-charcoal/60">
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="font-mono font-semibold block">{c._count.projects}</span>
                            <span className="text-xs text-charcoal/50">Projects listed</span>
                          </div>
                          {c.reviewCount > 0 && (
                            <div>
                              <span className="font-mono font-semibold block">
                                {c.rating.toFixed(1)} ★
                              </span>
                              <span className="text-xs text-charcoal/50">{c.reviewCount} reviews</span>
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