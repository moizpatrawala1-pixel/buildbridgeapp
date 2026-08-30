// src/components/Providers.tsx
//
// Wraps the app in NextAuth's SessionProvider so useSession() works in any
// client component (like Nav). This has to be its own client component
// because SessionProvider itself uses React context, which server
// components can't provide.

'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
