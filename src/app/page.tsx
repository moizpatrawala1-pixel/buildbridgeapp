// src/app/page.tsx — Landing page.
//
// Unlike the earlier static demo, this does NOT show invented platform
// stats ("2,340+ contractors", "₹840Cr verified value") — those were
// mockup numbers, and showing them on a real site would be showing real
// visitors a lie about how many contractors are actually on the platform.
// Once there's real contractor and quote-request data, a live stats section
// can come back — pulling from an actual COUNT query, not hardcoded text.
//
// Trade category tiles link to /browse?trade=X, which the browse page reads
// on load to pre-select that filter — so this section is a real shortcut
// into the filter we built, not decorative text repeating it.

import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const TRADE_CATEGORIES = [
  { name: 'RCC & Structural', icon: '🏗️' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Waterproofing', icon: '💧' },
  { name: 'Interior Fit-out', icon: '🛋️' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Facade & Cladding', icon: '🧱' },
];

export default function Home() {
  return (
    <>
      <Nav />

      <header className="bg-charcoal text-paper pt-22 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="font-mono text-xs font-medium tracking-widest uppercase text-amber-soft flex items-center gap-2.5 mb-5">
            <span className="w-5 h-[1.5px] bg-amber-soft" />
            Licensed &amp; Verified Network
          </div>
          <p className="font-display text-xl md:text-2xl font-bold text-amber-soft tracking-tight mb-4">Kaam. Connected.</p>
          <h1 className="font-display font-bold text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-tight mb-5 max-w-2xl">
            Build with contractors who&apos;ve <span className="text-amber-soft">proven</span> it before.
          </h1>
          <p className="text-[17px] leading-relaxed text-paper/68 max-w-[480px] mb-9">
            (Kalm) connects developers with licensed contractors — every profile backed by
            verified project history, not just claims.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3.5 rounded-[3px] bg-amber text-white hover:bg-[#be6520] transition-colors"
            >
              Browse Contractors
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3.5 rounded-[3px] border-[1.5px] border-line-dark text-paper hover:border-amber hover:text-amber transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <div className="font-mono text-xs font-medium tracking-widest uppercase text-amber flex items-center justify-center gap-2.5 mb-4">
              <span className="w-5 h-[1.5px] bg-amber" />
              How It Works
              <span className="w-5 h-[1.5px] bg-amber" />
            </div>
            <h2 className="font-display font-bold text-[clamp(30px,3.6vw,42px)] leading-tight tracking-tight mb-4">
              Browse, notify, negotiate.
            </h2>
            <p className="text-lg leading-relaxed text-charcoal/60">
              No middleman on the deal. If a deal happens, it happens between you — same as it
              always has, just with proof upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: '01', title: 'Browse verified profiles', body: 'Filter by location and trade, see real reviews and completed project history.' },
              { n: '02', title: 'Select & request a quote', body: 'Create an account, shortlist contractors, and share your project details.' },
              { n: '03', title: 'They get notified', body: 'Selected contractors receive an instant notification and reach out directly.' },
              { n: '04', title: 'Negotiate & decide', body: 'You talk terms directly. If it\'s a match, great. If not, no obligation either way.' },
            ].map((step) => (
              <div key={step.n}>
                <div className="w-[54px] h-[54px] rounded-full bg-charcoal border-[1.5px] border-amber flex items-center justify-center font-mono font-semibold text-amber-soft mb-5">
                  {step.n}
                </div>
                <h4 className="font-display font-semibold text-base mb-2">{step.title}</h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRADE CATEGORIES — real links into the browse filter, not decoration */}
      <section className="py-20 bg-paper-dim">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <div className="font-mono text-xs font-medium tracking-widest uppercase text-amber flex items-center justify-center gap-2.5 mb-4">
              <span className="w-5 h-[1.5px] bg-amber" />
              What We Cover
              <span className="w-5 h-[1.5px] bg-amber" />
            </div>
            <h2 className="font-display font-bold text-[clamp(30px,3.6vw,42px)] leading-tight tracking-tight mb-4">
              Every trade, one directory.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TRADE_CATEGORIES.map((trade) => (
              <Link
                key={trade.name}
                href={`/browse?trade=${encodeURIComponent(trade.name)}`}
                className="flex items-center gap-4 bg-white border border-line rounded-md p-5 hover:border-charcoal transition-colors"
              >
                <span className="text-2xl">{trade.icon}</span>
                <span className="font-display font-semibold text-[15px]">{trade.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFICATION STANDARD */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="font-mono text-xs font-medium tracking-widest uppercase text-amber flex items-center gap-2.5 mb-4">
              <span className="w-5 h-[1.5px] bg-amber" />
              What &quot;Verified&quot; Actually Means
            </div>
            <h2 className="font-display font-bold text-[clamp(28px,3.2vw,36px)] leading-tight tracking-tight mb-5">
              A badge that means something, not just a color.
            </h2>
            <p className="text-[15.5px] leading-relaxed text-charcoal/65 mb-4">
              Every Verified contractor&apos;s license has been independently checked against the
              issuing state authority — not just submitted and taken at their word.
            </p>
            <p className="text-[15.5px] leading-relaxed text-charcoal/65">
              If we haven&apos;t been able to confirm a license yet, a contractor stays marked
              Pending. We&apos;d rather show fewer Verified profiles than let the badge stop
              meaning what it says.
            </p>
          </div>
          <div className="bg-verified-soft border border-verified/20 rounded-lg p-8">
            <div className="w-14 h-14 rounded-full border-2 border-verified flex items-center justify-center mb-5 bg-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3D5A40" strokeWidth="3" className="w-6 h-6">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h4 className="font-display font-semibold text-lg mb-2 text-verified">Verified means:</h4>
            <ul className="flex flex-col gap-2.5 text-[14.5px] text-charcoal/70">
              <li>✓ License number checked against the state registry</li>
              <li>✓ Contact details confirmed directly with the contractor</li>
              <li>✓ Never marked Verified from self-submitted documents alone</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-24 bg-charcoal text-paper text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-[620px] mx-auto px-8 relative z-10">
          <h2 className="font-display font-bold text-[clamp(32px,3.8vw,44px)] mb-4 leading-tight">
            Your next contractor is one search away.
          </h2>
          <p className="text-paper/60 text-[15.5px] mb-9">
            Browse licensed contractors with verified project history, or list your own business
            to get discovered.
          </p>
          <div className="flex gap-3.5 flex-wrap justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3.5 rounded-[3px] bg-amber text-white hover:bg-[#be6520] transition-colors"
            >
              Browse Contractors
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3.5 rounded-[3px] border-[1.5px] border-line-dark text-paper hover:border-amber hover:text-amber transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}