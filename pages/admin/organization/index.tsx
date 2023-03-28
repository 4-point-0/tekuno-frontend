import { Container, Paper } from "@mantine/core";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";

import { OrganizationDetails } from "@/components/admin/OrganizationDetails";
import { fetchAdminControllerFindMe } from "@/services/api/admin/adminComponents";

import { authOptions } from "../../api/auth/[...nextauth]";

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.token) {
    return { notFound: true };
  }

  const user = await fetchAdminControllerFindMe({
    headers: { authorization: `Bearer ${session.token}` },
  });

  if (user.role !== "Admin") {
    return { notFound: true };
  }

  return {
    props: {
      user,
    },
  };
}

export default Organization;
