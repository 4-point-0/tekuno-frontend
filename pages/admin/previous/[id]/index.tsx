import { Container, Paper } from "@mantine/core";

import { CampaignDetails } from "@/components/admin/CampaignDetails";

export default function ManageCampaign() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <CampaignDetails />
      </Paper>
    </Container>
  );
}
