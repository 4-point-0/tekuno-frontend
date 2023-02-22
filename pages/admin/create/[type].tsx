import { Container, Paper } from "@mantine/core";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { CampaignForm } from "@/components/admin/CampaignForm";
import { CampaignType, TYPES } from "@/enums/CampaignType";

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (
    !(
      typeof ctx.query.type === "string" &&
      TYPES.includes(ctx.query.type as CampaignType)
    )
  ) {
    return {
      redirect: {
        destination: "/404",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
