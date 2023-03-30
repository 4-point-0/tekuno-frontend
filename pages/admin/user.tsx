import { Container, Paper } from "@mantine/core";

import { UserDetails } from "@/components/admin/UserDetails";
import { getUserServerSideProps } from "@/utils/auth";

export default function AdminUser() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <Paper radius="lg" p="xl" h="100%">
        <UserDetails />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});
