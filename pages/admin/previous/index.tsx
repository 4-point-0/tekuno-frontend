import { Container } from "@mantine/core";

import { CampaignList } from "@/components/admin/CampaignList";

export default function PreviousCampaings() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <CampaignList />
    </Container>
  );
}
