// src/app/page.tsx — Landing page.
//
// Unlike the earlier static demo, this does NOT show invented platform
// stats ("2,340+ contractors", "₹840Cr verified value") — those were
// mockup numbers, and showing them on a real site would be showing real
// visitors a lie about how many contractors are actually on the platform.
// Once there's real contractor and quote-request data, a live stats section
// can come back — pulling from an actual COUNT query, not hardcoded text.

import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

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
        <div className="max-w-[1180px] mx-auto px-8 relative z-10">
          <div className="font-mono text-xs font-medium tracking-widest uppercase text-amber-soft flex items-center gap-2.5 mb-5">
            <span className="w-5 h-[1.5px] bg-amber-soft" />
            Licensed &amp; Verified Network
          </div>
          <h1 className="font-display font-bold text-[clamp(38px,4.6vw,60px)] leading-[1.05] tracking-tight mb-5 max-w-2xl">
            Build with contractors who&apos;ve <span className="text-amber-soft">proven</span> it before.
          </h1>
          <p className="text-[17px] leading-relaxed text-paper/68 max-w-[480px] mb-9">
            BuildBridge connects developers with licensed contractors — every profile backed by
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

      <section className="py-20">
        <div className="max-w-[1180px] mx-auto px-8">
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

      <section className="py-20 bg-charcoal text-paper text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-[620px] mx-auto px-8 relative z-10">
          <h2 className="font-display font-bold text-[clamp(30px,3.6vw,42px)] mb-4">
            Find your next contractor.
          </h2>
          <p className="text-paper/60 text-[15.5px] mb-9">
            Browse licensed contractors with verified project history.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3.5 rounded-[3px] bg-amber text-white hover:bg-[#be6520] transition-colors"
          >
            Browse Contractors
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
