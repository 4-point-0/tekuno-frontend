import { Container, Paper } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";

import { CallToAction } from "@/components/admin/CallToAction";
import { getUserServerSideProps } from "@/utils/organization";

export default function Admin({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <Paper radius="lg" p="xl" h="100%">
        <CallToAction hasOrganization={Boolean(user.organization_id)} />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});
