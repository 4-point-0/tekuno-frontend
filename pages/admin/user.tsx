import { UserDetails } from "@/components/admin/UserDetails";
import { Container, Paper } from "@mantine/core";

export default function AdminUser() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <Paper radius="lg" p="xl" h="100%">
        <UserDetails />
      </Paper>
    </Container>
  );
}
