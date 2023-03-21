import fetch from "isomorphic-fetch";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        const res = await fetch(`${process.env.API_URL}/api/v1/google/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token: account?.access_token,
          }),
        });

        token.res = await res.json();
      }

      return token;
    },
    async session({ session, token, user }) {
      session.token = (token.res as any).token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
