import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { CirclePlus } from "tabler-icons-react";

interface CallToActionProps {
  description?: string;
  hasOrganization?: boolean;
}

export const CallToAction = ({
  description = "Digital Collectible PODs",
  hasOrganization = true,
}: CallToActionProps) => {
  return (
    <Paper sx={{ backgroundColor: "#ffe6e6" }} p={40} maw={810}>
      <Group spacing={48}>
        <Box>
          <Image src="/images/cta.png" alt="Create POD" />
        </Box>

        <Stack>
          <Title order={4}>Create your new Proof Of Doing</Title>
          <Text>
            {hasOrganization
              ? description
              : "Create your organization to start"}
          </Text>
          <Group position="left">
            {hasOrganization ? (
              <Button
                component={Link}
                href="/admin/create"
                color="dark"
                leftIcon={<CirclePlus size={20} />}
              >
                Create POD
              </Button>
            ) : (
              <Button
                component={Link}
                href="/admin/organization"
                color="dark"
                leftIcon={<CirclePlus size={20} />}
              >
                Create organization
              </Button>
            )}
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
