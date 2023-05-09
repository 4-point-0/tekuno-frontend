import { Container, Paper } from "@mantine/core";
import { InferGetServerSidePropsType } from "next";

import { ProfileForm } from "@/components/admin/EditProfile";
import { getUserServerSideProps } from "@/utils/auth";

const Profile = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <Container size="sm">
          <ProfileForm user={user} />
        </Container>
      </Paper>
    </Container>
  );
};

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});

export default Profile;
