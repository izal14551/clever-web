import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { syncMemberProfile } from "@/app/lib/memberSync";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await syncMemberProfile({
          userId: user.id || "",
          name: user.name || "",
          email: user.email || "",
          image: user.image || undefined,
        });
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.name) {
        token.name = user.name;
      }

      if (trigger === "update" && typeof session?.name === "string") {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
};
