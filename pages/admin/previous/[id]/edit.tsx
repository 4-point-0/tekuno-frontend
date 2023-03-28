import { Container, Paper } from "@mantine/core";

import { EditCampaign } from "@/components/admin/EditCampaign";
import { getUserServerSideProps } from "@/utils/organization";

export default function EditCampaignPage() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <EditCampaign />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});
