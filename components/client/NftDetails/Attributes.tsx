import { Stack, Text, Title, useMantineTheme } from "@mantine/core";

import { NearNftAttribute } from "@/services/api/client/clientSchemas";

interface AttributesProps {
  attributes: Array<NearNftAttribute>;
}

export const Attributes = ({ attributes }: AttributesProps) => {
  const theme = useMantineTheme();

  return (
    <Stack
      sx={{
        width: "100%",
        alignSelf: "center",
      }}
      spacing={"sm"}
    >
      {attributes?.map((attribute) => (
        <Stack
          sx={(theme) => ({
            width: "100%",
            backgroundColor: theme.colors[theme.primaryColor][0],
            borderRadius: theme.radius.lg,
          })}
          py={6}
          key={attribute.trait_type}
          align={"center"}
          spacing={0}
        >
          <Text align="center" color={theme.primaryColor} fz={"sm"} fw={700}>
            {attribute.trait_type}
          </Text>
          <Title align="center" order={4}>
            {attribute.value}
          </Title>
        </Stack>
      ))}
    </Stack>
  );
};
