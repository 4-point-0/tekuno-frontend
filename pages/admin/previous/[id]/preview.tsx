import { Container, Paper } from "@mantine/core";

import { CampaignPreview } from "@/components/admin/CampaignPreview";

export default function PreviewCampaign() {
  return (
    <Container size="xl" p="0">
      <Paper radius="lg" py={40}>
        <CampaignPreview />
      </Paper>
    </Container>
  );
}
