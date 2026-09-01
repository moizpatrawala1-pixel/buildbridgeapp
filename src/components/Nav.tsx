// src/components/Nav.tsx
//
// Shared nav across all pages. Session-aware: shows "Sign in / Get Started"
// for anonymous visitors, or the developer's name + a sign-out link once
// they're logged in. This is a client component (needs useSession) — pages
// that render it can still be server components themselves.
//
// Logo: built as live text, not an image, so the weight contrast between
// the thin parens and bold "kalm" (per the brand mark) stays crisp at any
// size and is easy to re-tune later — see globals.css for the Outfit
// weights this depends on (300 for the parens, 800 for the wordmark).

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight text-charcoal flex items-baseline">
          <span className="font-light">(kalm)</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/browse" className="text-sm font-medium text-charcoal/65 hover:text-charcoal transition-colors">
            Browse Contractors
          </Link>
          {status === 'authenticated' && (
            <Link href="/dashboard" className="text-sm font-medium text-charcoal/65 hover:text-charcoal transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5">
          {status === 'loading' ? null : status === 'authenticated' ? (
            <>
              <span className="text-sm font-medium text-charcoal/80">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-medium text-charcoal/65 hover:text-charcoal transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-charcoal/80 hover:text-charcoal transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3 rounded-[3px] bg-amber text-white hover:bg-amber-dark transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
