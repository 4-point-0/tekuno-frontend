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

import { IndigoButton } from "@/components/core/IndigoButton";
import { useAdminUser } from "@/hooks/useAdminUser";
import { getAvatarUrl } from "@/utils/avatar";

export const UserDetails = () => {
  const { data } = useAdminUser();

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
          src={getAvatarUrl(data?.email)}
          alt=""
        />
        <Title order={3}>{data?.username}</Title>

        <Box>
          <Title order={5}>Email address</Title>
          <Text>{data?.email}</Text>
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
