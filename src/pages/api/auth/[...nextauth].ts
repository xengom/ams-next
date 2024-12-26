import NextAuth, { Account, Profile } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = Number(token.sub);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ account, profile, user }) {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: profile?.email! },
      });

      if (existingUser) {
        // Link the account to the existing user
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account?.provider!,
              providerAccountId: account?.providerAccountId!,
            },
          },
          update: {
            userId: existingUser.id,
          },
          create: {
            userId: existingUser.id,
            type: account?.type!,
            provider: account?.provider!,
            providerAccountId: account?.providerAccountId!,
            access_token: account?.access_token,
            refresh_token: account?.refresh_token,
            expires_at: account?.expires_at,
            token_type: account?.token_type,
            scope: account?.scope,
            id_token: account?.id_token,
            session_state: account?.session_state,
          },
        });
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
  },
});
