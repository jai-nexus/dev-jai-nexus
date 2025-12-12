// portal/src/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

type UserRole = "ADMIN" | "AGENT";

type UserWithRole = {
  id: string;
  email: string;
  name?: string | null;
  role?: UserRole;
};

type TokenWithRole = {
  role?: UserRole;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV !== "production",

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            if (process.env.NODE_ENV !== "production") {
              console.log("[auth] Missing email or password");
            }
            return null;
          }

          const email = credentials.email.toString().toLowerCase();

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (process.env.NODE_ENV !== "production") {
            console.log("[auth] Loaded user", {
              email,
              found: !!user,
              hasHash: !!user?.passwordHash,
              role: user?.role,
            });
          }

          if (!user || !user.passwordHash) {
            return null;
          }

          const ok = await bcrypt.compare(
            credentials.password.toString(),
            user.passwordHash,
          );

          if (process.env.NODE_ENV !== "production") {
            console.log("[auth] Password compare result", { email, ok });
          }

          if (!ok) {
            return null;
          }

          const baseUser: UserWithRole = {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email ?? email,
            role: user.role as UserRole | undefined,
          };

          return baseUser;
        } catch (err) {
          console.error("[auth] authorize() error", err);
          throw err;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // attach role from user -> token on login
      if (user) {
        const u = user as UserWithRole;
        (token as TokenWithRole).role = u.role;
      }
      return token;
    },

    async session({ session, token }) {
      // surface role on session.user for UI / RBAC
      if (session.user) {
        const t = token as TokenWithRole;
        (session.user as UserWithRole).role = t.role;
      }
      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
