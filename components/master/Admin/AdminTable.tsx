import { Button, Card, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";

import { ClientContainer } from "../../layout/ClientContainer";

export const AdminTable = ({ data }: any) => {
  const { results } = data;

  const admins = results.filter((admin: any) => admin.role === "Admin");

  return (
    <ClientContainer>
      <SimpleGrid cols={3} spacing="xl" verticalSpacing="xl" pt={30}>
        {admins.map((admin: any) => (
          <Card key={admin.id}>
            <Text>Username: {admin.email}</Text>
            <Text>Role: {admin.role}</Text>
            <Text>Provider: {admin.provider}</Text>
            <Button
              component={Link}
              mt={20}
              href={`/master/admins/${admin.id}`}
              color="dark"
            >
              Open Profile
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </ClientContainer>
  );
};
