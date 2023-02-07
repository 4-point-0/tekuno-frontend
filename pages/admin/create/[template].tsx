import { PODForm } from "@/components/admin/PODForm";
import { PODTemplate, TEMPLATES } from "@/enums/PODTempalates";
import { Container, Paper } from "@mantine/core";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function CreatePOD() {
  const router = useRouter();

  return (
    <Container fluid>
      <Paper radius="lg" p="xl">
        <PODForm key={router.query.template as string} />
      </Paper>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { template } = ctx.query;

  if (
    !(
      typeof template === "string" &&
      TEMPLATES.includes(template as PODTemplate)
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
