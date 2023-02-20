import { CampaignDetails } from "@/components/admin/CampaignDetails";
import { Container, Paper } from "@mantine/core";

export default function ManageCampaign() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <CampaignDetails />
      </Paper>
    </Container>
  );
}
