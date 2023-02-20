import { EditCampaign } from "@/components/admin/EditCampaign";
import { Container, Paper } from "@mantine/core";

export default function EditCampaignPage() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <EditCampaign />
      </Paper>
    </Container>
  );
}
