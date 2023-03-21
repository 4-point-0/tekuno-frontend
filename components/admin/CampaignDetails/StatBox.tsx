import { Box, Flex, Text, useMantineTheme } from "@mantine/core";

interface StatBoxProps {
  label: string;
  subLabel?: string;
  value: number;
}

export const StatBox = ({ value, label, subLabel }: StatBoxProps) => {
  const theme = useMantineTheme();

  return (
    <Flex
      p="md"
      direction="column"
      gap="lg"
      sx={{
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: theme.radius.md,
      }}
    >
      <Text size="sm" color="gray.6" fw={600}>
        {label}
      </Text>

      <Box>
        <Text size="xl" fw={700}>
          {value.toLocaleString()}
        </Text>
        {subLabel && (
          <Text size="xs" c="dimmed">
            {subLabel}
          </Text>
        )}
      </Box>
    </Flex>
  );
};
