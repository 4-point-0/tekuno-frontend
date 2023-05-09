import {
  Box,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { CirclePlus, Logout, Settings } from "tabler-icons-react";

import { IndigoButton } from "@/components/core/IndigoButton";
import { useUserOrganization } from "@/hooks/useUserOrganization";
import { getAvatarUrl } from "@/utils/avatar";

export const UserDetails = () => {
  const { user, hasOrganization, organization } = useUserOrganization();

  const handleLogOut = () => {
    signOut();
  };

  const isAdmin = user?.role === "Admin";

  return (
    <Container>
      <Stack>
        <Image
          height={160}
          width={160}
          radius="xl"
          src={getAvatarUrl(user?.email)}
          alt=""
        />

        <Title order={3}>{user?.username}</Title>

        {hasOrganization && (
          <Box>
            <Title order={5}>Organization</Title>
            <Text>{organization?.name}</Text>
          </Box>
        )}

        <Box>
          <Title order={5}>Email address</Title>
          <Text>{user?.email}</Text>
        </Box>

        <Group>
          {!user?.provider ? (
            <Link href="/admin/profile">
              <IndigoButton leftIcon={<Settings size={14} />}>
                Edit profile
              </IndigoButton>
            </Link>
          ) : null}

          {isAdmin && (
            <Link href="/admin/organization">
              <IndigoButton
                leftIcon={
                  hasOrganization ? (
                    <Settings size={14} />
                  ) : (
                    <CirclePlus size={14} />
                  )
                }
              >
                {hasOrganization
                  ? "Manage organization"
                  : "Create organization"}
              </IndigoButton>
            </Link>
          )}

          <IndigoButton leftIcon={<Logout size={14} />} onClick={handleLogOut}>
            Log Out
          </IndigoButton>
        </Group>
      </Stack>
    </Container>
  );
};
