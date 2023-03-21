import { IndigoButton } from "@/components/core/IndigoButton";
import {
  Box,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { Logout } from "tabler-icons-react";

export const UserDetails = () => {
  const { data: session } = useSession({ required: true });

  const handleLogOut = () => {
    signOut();
  };

  return (
    <Container>
      <Stack>
        <Image
          height={160}
          width={160}
          radius="xl"
          src={session?.user?.image}
          alt=""
        />
        <Title order={3}>{session?.user?.name}</Title>

        <Box>
          <Title order={5}>Email address</Title>
          <Text>{session?.user?.email}</Text>
        </Box>

        <Group>
          <IndigoButton leftIcon={<Logout size={14} />} onClick={handleLogOut}>
            Log Out
          </IndigoButton>
        </Group>
      </Stack>
    </Container>
  );
};
