import { Container } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders } from "next-auth/react";

import { AuthForm } from "@/components/admin/SignIn/AuthForm";
import { redirectIfActiveSession } from "@/utils/auth";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container size="xs">
      <AuthForm providers={providers} />
    </Container>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { redirect } = await redirectIfActiveSession(ctx);

  if (redirect) {
    return { redirect };
  }

  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
