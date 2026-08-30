// src/app/api/auth/[...nextauth]/route.ts
//
// NextAuth's catch-all route. Handles /api/auth/signin, /api/auth/signout,
// /api/auth/session, etc. All the actual config lives in src/lib/auth.ts —
// this file just wires it into the App Router.
//
// NextAuth v5 exports handlers as { handlers: { GET, POST } }, not as
// top-level GET/POST — this is the destructuring the docs show for
// `auth.ts`, matched with `export const { handlers } = NextAuth(...)`.

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
