import { CDOForm } from "@/components/admin/PODForm";
import { Container, Paper } from "@mantine/core";
import { useRouter } from "next/router";

export default function PODTemplate() {
  const router = useRouter();

  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <CDOForm />
      </Paper>
    </Container>
  );
}
