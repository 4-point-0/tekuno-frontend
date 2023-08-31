import { Container, Paper } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";

import { CallToAction } from "@/components/admin/CallToAction";
import { getUserServerSideProps } from "@/utils/auth";

type User = {
  organization_id?: string;
};

export default function Admin({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const hasOrganization = Boolean(user?.organization_id);

  return (
    <Container fluid sx={{ height: "100%" }}>
      <Paper radius="lg" p="xl" h="100%">
        <CallToAction hasOrganization={Boolean(user?.organization_id)} />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});
