import { CallToAction } from "@/components/admin/CallToAction";
import { Container, Paper } from "@mantine/core";

export default function Admin() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <Paper radius="lg" p="xl" h="100%">
        <CallToAction />
      </Paper>
    </Container>
  );
}
