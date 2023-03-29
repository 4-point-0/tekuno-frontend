import { Container, Paper } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";

import { OrganizationDetails } from "@/components/admin/OrganizationDetails";
import { getUserServerSideProps } from "@/utils/organization";

const Organization = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <Container size="sm">
          <OrganizationDetails user={user} />
        </Container>
      </Paper>
    </Container>
  );
};

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
  adminOnly: true,
});

export default Organization;
