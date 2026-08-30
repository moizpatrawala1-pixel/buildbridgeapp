// src/lib/auth.ts
//
// NextAuth v5 config. Credentials-based (email + password) for developer
// accounts. Passwords are hashed with bcrypt before storage — never stored
// or compared in plain text.
//
// This only covers Developer accounts. Contractors don't log in yet (you're
// adding them by hand via the seed script / admin page), and the admin page
// itself uses a separate, simpler shared-password gate — see
// src/lib/admin-auth.ts. Mixing three different account types into one auth
// system before any of them are proven out would add complexity this slice
// doesn't need yet.

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const developer = await prisma.developer.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!developer) return null;

        const passwordValid = await bcrypt.compare(password, developer.passwordHash);
        if (!passwordValid) return null;

        return {
          id: developer.id,
          name: developer.name,
          email: developer.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
