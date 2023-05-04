import { Container } from "@mantine/core";

import { CampaignList } from "@/components/admin/CampaignList";
import { getUserServerSideProps } from "@/utils/auth";

export default function PreviousCampaings() {
  return (
    <Container fluid sx={{ height: "100%" }}>
      <CampaignList />
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: true,
});
