// src/components/Nav.tsx
//
// Shared nav across all pages. Session-aware: shows "Sign in / Get Started"
// for anonymous visitors, or the developer's name + a sign-out link once
// they're logged in. This is a client component (needs useSession) — pages
// that render it can still be server components themselves.

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-charcoal/97 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-paper tracking-tight">
          <span className="w-[30px] h-[30px] border-[1.5px] border-amber rounded-full flex items-center justify-center relative shrink-0">
            <span className="w-2.5 h-2.5 bg-amber rotate-45 block" />
          </span>
          (Kalm)
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/browse" className="text-sm font-medium text-paper/65 hover:text-paper transition-colors">
            Browse Contractors
          </Link>
          {status === 'authenticated' && (
            <Link href="/dashboard" className="text-sm font-medium text-paper/65 hover:text-paper transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-5">
          {status === 'loading' ? null : status === 'authenticated' ? (
            <>
              <span className="text-sm font-medium text-paper/80">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-medium text-paper/65 hover:text-paper transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-paper/80 hover:text-paper transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center font-semibold text-sm px-6 py-3 rounded-[3px] bg-amber text-white hover:bg-[#be6520] transition-colors"
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