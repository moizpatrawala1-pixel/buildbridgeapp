// src/app/about/page.tsx
//
// Founder bios are deliberately short and role-based — title + area of
// responsibility only, no invented backstory (years of experience, past
// companies, etc.) since that would be putting words in real people's
// mouths on a real, public page. Update FOUNDERS below directly if bios
// need to grow later; each entry stays independent of any other page.

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const FOUNDERS = [
  {
    name: 'Moiz Patrawala',
    role: 'Co-founder — Tech & Finance',
    bio: 'Leads product and engineering for (kalm), and oversees the numbers behind it.',
  },
  {
    name: 'Hassan Birya',
    role: 'Co-founder — Legal & Finance',
    bio: 'Handles the legal and financial foundations (kalm) is built on.',
  },
  {
    name: 'Anas Maklai',
    role: 'Co-founder — Marketing & Growth',
    bio: 'Drives how (kalm) reaches developers and contractors, and how it grows.',
  },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <>
      <Nav />

      <header className="pt-28 pb-20 text-center">
        <div className="max-w-[680px] mx-auto px-8">
          <h1 className="font-display font-light text-[clamp(32px,4vw,46px)] leading-[1.15] text-ink mb-6">
            Built by people tired of the old way.
          </h1>
          <p className="text-[17px] leading-relaxed text-stone max-w-[480px] mx-auto">
            (kalm) exists to make finding a contractor as straightforward as it should&apos;ve
            always been — verified profiles, real project history, no middleman on the deal.
          </p>
        </div>
      </header>

      <section className="py-24 border-t border-line">
        <div className="max-w-[880px] mx-auto px-8">
          <h2 className="font-display font-light text-[clamp(28px,3.2vw,38px)] text-center text-ink mb-16">
            Meet the founders.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {FOUNDERS.map((f) => (
              <div key={f.name} className="text-center">
                <div className="w-20 h-20 rounded-full bg-ink text-paper font-display text-xl flex items-center justify-center mx-auto mb-5">
                  {initials(f.name)}
                </div>
                <h3 className="font-display text-lg text-ink mb-1">{f.name}</h3>
                <p className="text-xs text-amber font-medium mb-3 tracking-wide uppercase">{f.role}</p>
                <p className="text-sm text-stone leading-relaxed max-w-[240px] mx-auto">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
