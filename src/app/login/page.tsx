// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/browse');
    } else {
      setError('Incorrect email or password');
      setSubmitting(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <h1 className="font-display font-bold text-3xl tracking-tight mb-2">Sign in</h1>
          <p className="text-charcoal/60 text-sm mb-8">Welcome back.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-line rounded-[4px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-amber text-white font-semibold text-sm py-3 rounded-[3px] hover:bg-[#be6520] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-charcoal/60 mt-6 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-amber font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
