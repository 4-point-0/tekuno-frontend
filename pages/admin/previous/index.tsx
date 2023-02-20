import { CampaignList } from "@/components/admin/CampaignList";
import { Box, Container } from "@mantine/core";

export default function PreviousCampaings() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <CampaignList />
    </Container>
  );
}
