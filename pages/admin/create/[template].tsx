import { Container, Paper } from "@mantine/core";
import { useRouter } from "next/router";

export default function PODTemplate() {
  const router = useRouter();

  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        {router.query.template}
      </Paper>
    </Container>
  );
}
