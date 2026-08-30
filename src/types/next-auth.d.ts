// src/types/next-auth.d.ts
//
// NextAuth's default session type doesn't include `id` on session.user.
// We add it in the jwt/session callbacks in src/lib/auth.ts, so this
// augmentation tells TypeScript that field actually exists.

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
