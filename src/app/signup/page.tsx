// src/app/signup/page.tsx
//
// After successful signup, we immediately call NextAuth's signIn() with the
// same credentials rather than redirecting to /login and making the person
// type their password twice. If signIn somehow fails right after a
// successful signup (shouldn't normally happen), we fall back to sending
// them to /login rather than leaving them stuck.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/developers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        setSubmitting(false);
        return;
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/browse');
      } else {
        router.push('/login');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <h1 className="font-display font-bold text-3xl tracking-tight mb-2">Create your account</h1>
          <p className="text-charcoal/60 text-sm mb-8">Sign up to browse contractors and request quotes.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-line rounded-[4px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-line rounded-[4px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-line rounded-[4px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber"
              />
              <p className="text-xs text-charcoal/50 mt-1">At least 8 characters.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-amber text-white font-semibold text-sm py-3 rounded-[3px] hover:bg-[#be6520] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-charcoal/60 mt-6 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-amber font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
