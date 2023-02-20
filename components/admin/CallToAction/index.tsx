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
import { NextLink } from "@mantine/next";
import React from "react";
import { CirclePlus } from "tabler-icons-react";

interface ICallToActionProps {
  emptyState?: boolean;
}

export const CallToAction: React.FC<ICallToActionProps> = ({ emptyState }) => {
  return (
    <Paper sx={{ backgroundColor: "#ffe6e6" }} p={40} maw={810}>
      <Group spacing={48}>
        <Box>
          <Image src="/images/cta.png" alt="Create POD" />
        </Box>

        <Stack>
          <Title order={4}>Create your new Proof Of Doing</Title>
          <Text>
            {emptyState ? "No previous PODs found" : "Digital Collectible PODs"}
          </Text>
          <Group position="left">
            <Button
              component={NextLink}
              href="/admin/create"
              legacyBehavior
              color="dark"
              leftIcon={<CirclePlus size={20} />}
            >
              Create POD
            </Button>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
