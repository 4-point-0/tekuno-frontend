import { Button, Text, Title } from "@mantine/core";
import Link from "next/link";

import { ClientContainer } from "../../../components/layout/ClientContainer";

const Success = () => {
  const isBuyer = false;
  return (
    <ClientContainer>
      <Title order={2}>Success</Title>
      {isBuyer ? (
        <Text>
          You have sucessfully transfered the payment to the Tekuno users
        </Text>
      ) : (
        <Text> You have successfullty completed the payment </Text>
      )}
      <Button component={Link} mt={20} href={`/admin`} color="dark">
        Retun to Dashboard
      </Button>
    </ClientContainer>
  );
};

export default Success;
