import { Container, Paper } from "@mantine/core";

import { EditCampaign } from "@/components/admin/EditCampaign";

export default function EditCampaignPage() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <EditCampaign />
      </Paper>
    </Container>
  );
}
