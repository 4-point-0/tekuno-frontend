import { AssetPreview } from "@/components/admin/CampaignForm/AssetPreview";
import { NftDto } from "@/services/api/admin/adminSchemas";
import { Badge, Box, Flex, Group, Text, ThemeIcon, Title } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { Check, Flame, Lock, Minus } from "tabler-icons-react";

interface INFTCardProps extends PropsWithChildren {
  nft: NftDto;
  isCollected?: boolean;
  isBurned?: boolean;
}

export const NFTCard: React.FC<INFTCardProps> = ({
  nft,
  isCollected,
  isBurned,
  children,
}) => {
  const isReward = nft.nft_type.name === "reward";

  return (
    <Group p="md" align="flex-start" noWrap>
      <Box w={88} sx={{ position: "relative", flexShrink: 0 }}>
        <AssetPreview isCollected={isCollected} file={nft.file} />

        {isReward && !isCollected && (
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

      <Flex h="100%" direction="column">
        <Box>
          <Title order={5} color="dark">
            {nft.name}
          </Title>
          <Text size="xs" color="dark">
            {nft.description}
          </Text>
        </Box>

        {children && <Box mt="xs">{children}</Box>}

        {isCollected !== undefined && !isReward && (
          <Box mt="xs">
            <Badge
              size="lg"
              variant="filled"
              color={isBurned ? "red" : isCollected ? "grape" : "gray"}
              leftSection={
                <Box sx={{ lineHeight: "14px" }}>
                  {isBurned ? (
                    <Flame color="#fff" size={14} />
                  ) : isCollected ? (
                    <Check color="#fff" size={14} />
                  ) : (
                    <Minus size={14} />
                  )}
                </Box>
              }
              sx={{ alignItems: "center" }}
            >
              {isBurned
                ? "Burned"
                : isCollected
                ? "Collected"
                : "Not Collected"}
            </Badge>
          </Box>
        )}
      </Flex>
    </Group>
  );
};
