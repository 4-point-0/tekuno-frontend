import { Container, Paper } from "@mantine/core";

import { CampaignTypes } from "@/components/admin/CampaignTypes";
import { getUserServerSideProps } from "@/utils/auth";

export default function SelectPODTemplate() {
  return (
    <Container fluid>
      <CampaignTypes />
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: true,
});
