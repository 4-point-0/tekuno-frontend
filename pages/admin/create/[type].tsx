import { Container, Paper } from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { CampaignForm } from "@/components/admin/CampaignForm";
import { CampaignType, TYPES } from "@/enums/CampaignType";
import { getUserServerSideProps } from "@/utils/auth";

export default function CreatePOD() {
  const router = useRouter();

  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <CampaignForm key={router.query.type as string} />
      </Paper>
    </Container>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (
    !(
      typeof ctx.query.type === "string" &&
      TYPES.includes(ctx.query.type as CampaignType)
    )
  ) {
    return {
      notFound: true,
    };
  }

  return getUserServerSideProps({ organizationRequired: true })(ctx);
};
