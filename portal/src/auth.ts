// portal/src/auth.ts
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email ?? email,
          };
        } catch (err) {
          console.error("[auth] authorize() error", err);
          throw err;
        }
      },
    }),
  ],
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
