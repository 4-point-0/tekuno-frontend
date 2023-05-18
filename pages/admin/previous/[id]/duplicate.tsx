import { Container, Paper } from "@mantine/core";

import { getUserServerSideProps } from "@/utils/auth";

import { DuplicateCampaign } from "../../../../components/admin/DuplicateCampaign";

export default function Duplicate() {
  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <DuplicateCampaign />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: false,
});
