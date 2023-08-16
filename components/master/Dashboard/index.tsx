import {
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

import { ClientContainer } from "../../layout/ClientContainer";

export const MasterDashboard = () => {
  return (
    <ClientContainer>
      <Title>Dashboard</Title>
      <SimpleGrid cols={3} spacing="xl" verticalSpacing="xl" pt={30}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://i.pinimg.com/564x/94/09/7e/94097e458fbb22184941be57aaab2c8f.jpg"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Admins</Text>
          </Group>

          <Button component={Link} href={`/master/admins`} color="dark">
            List all the admins
          </Button>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://i.pinimg.com/564x/77/75/5e/77755e565ef7ddbff2546231cd8732bf.jpg"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Users</Text>
          </Group>

          <Button component={Link} href={`/master/users`} color="dark">
            List all users
          </Button>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Image
              src="https://i.pinimg.com/564x/48/cc/24/48cc24070f83f56a25eb8b00862ef514.jpg"
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>Campaigns</Text>
          </Group>

          <Button component={Link} href={``} color="dark">
            List all Campaigns
          </Button>
        </Card>
      </SimpleGrid>
    </ClientContainer>
  );
};
