import { NftDto } from "@/services/api/admin/adminSchemas";
import { Box, Group, Image, Text, ThemeIcon, Title } from "@mantine/core";
import React from "react";
import { Lock } from "tabler-icons-react";

interface INFTCardProps {
  nft: NftDto;
}

export const NFTCard: React.FC<INFTCardProps> = ({ nft }) => {
  const isReward = nft.nft_type.name === "reward";

  return (
    <Group p="md" align="flex-start">
      <Box w={88} sx={{ position: "relative" }}>
        <Image src={nft.file.url} radius="lg" />
        {isReward && (
          <ThemeIcon
            size="xl"
            variant="light"
            color="grape"
            radius="md"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.7,
            }}
          >
            <Lock size={24} />
          </ThemeIcon>
        )}
      </Box>

      <Box>
        <Title order={5}>{nft.name}</Title>
        <Text size="xs">{nft.description}</Text>
      </Box>
    </Group>
  );
};
