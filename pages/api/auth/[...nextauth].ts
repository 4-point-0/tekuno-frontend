import fetch from "isomorphic-fetch";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import {
  fetchAuthControllerLogin,
  fetchAuthControllerRegister,
} from "@/services/api/admin/adminComponents";
import { GoogleVerificationDto } from "@/services/api/admin/adminSchemas";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/admin/auth/signin",
  },
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(_, req) {
        const { password, email, type, password_confirm } = req.body as any;

        if (type === "register") {
          try {
            await fetchAuthControllerRegister({
              body: {
                email,
                password,
                password_confirm,
              },
            });
          } catch (error) {
            console.error(error);

            return null;
          }
        }

        try {
          const jwt = await fetchAuthControllerLogin({
            body: {
              email,
              password,
            },
          });

          return { id: email, token: (jwt as any).token };
        } catch (error) {
          console.error(error);

          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
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

        token.res = (await res.json()) as GoogleVerificationDto;
      } else if ((user as any)?.token) {
        token.res = { token: (user as any).token };
      }

      return token;
    },
    async session({ session, token }) {
      session.token = (token.res as GoogleVerificationDto).token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
