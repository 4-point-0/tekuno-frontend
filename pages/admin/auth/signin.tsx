import { Container } from "@mantine/core";
import type { InferGetServerSidePropsType } from "next";
import { getCsrfToken, getProviders } from "next-auth/react";

import { AuthForm } from "@/components/admin/SignIn/AuthForm";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container size="xs">
      <AuthForm providers={providers} />
    </Container>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
