import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import {
  fetchAdminControllerFindMe,
  fetchAuthControllerConfirmInvite,
  fetchAuthControllerLogin,
  fetchAuthControllerRegister,
  fetchGoogleControllerAuthenticate,
} from "@/services/api/admin/adminComponents";
import {
  GoogleVerificationDto,
  UserDto,
} from "@/services/api/admin/adminSchemas";

interface CredentialsRequestBody {
  type: "register" | "login";
  password: string;
  email: string;
  passwordConfirm?: string;
  inviteCode?: string;
}

interface WithToken {
  token: string;
}

async function login(email: string, password: string): Promise<WithToken> {
  return (await fetchAuthControllerLogin({
    body: {
      email,
      password,
    },
  })) as unknown as WithToken;
}

async function registerOrConfirmInvite({
  password,
  passwordConfirm,
  email,
  inviteCode,
}: Omit<CredentialsRequestBody, "type">) {
  const body = {
    email,
    password,
    password_confirm: passwordConfirm as string,
  };

  if (inviteCode) {
    return await fetchAuthControllerConfirmInvite({
      body,
      pathParams: { code: inviteCode },
    });
  } else {
    return await fetchAuthControllerRegister({ body });
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/admin/auth/signin",
  },
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(_, req) {
        const { password, email, type, passwordConfirm, inviteCode } =
          req.body as unknown as CredentialsRequestBody;

        if (type === "register" && passwordConfirm) {
          try {
            const user = await registerOrConfirmInvite({
              email,
              password,
              passwordConfirm,
              inviteCode,
            });

            const { token } = await login(email, password);

            return { token, ...user };
          } catch (error) {
            console.error(error);
            return null;
          }
        }

        try {
          const { token } = await login(email, password);

          const user = (await fetchAdminControllerFindMe({
            headers: { authorization: `Bearer ${token}` },
          })) as unknown as UserDto;

          return { token, ...user };
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
    async jwt({ token: jwt, account, user }) {
      const userWithToken = user as unknown as WithToken;

      if (account?.access_token) {
        const { token } = (await fetchGoogleControllerAuthenticate({
          body: { token: account?.access_token },
        })) as unknown as GoogleVerificationDto;

        jwt.token = token;
      } else if (userWithToken?.token) {
        jwt.token = userWithToken.token;
      }

      return jwt;
    },
    async session({ session, token }) {
      session.token = (token as unknown as WithToken).token;

      return session;
    },
  },
};

export default NextAuth(authOptions);
