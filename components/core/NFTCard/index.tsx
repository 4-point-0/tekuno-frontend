import { NftDto } from "@/services/api/admin/adminSchemas";
import {
  ActionIcon,
  Badge,
  Box,
  Flex,
  Group,
  Image,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { Check, Lock, Minus } from "tabler-icons-react";

interface INFTCardProps extends PropsWithChildren {
  nft: NftDto;
  isCollected?: boolean;
}

export const NFTCard: React.FC<INFTCardProps> = ({
  nft,
  isCollected,
  children,
}) => {
  const isReward = nft.nft_type.name === "reward";

  return (
    <Group p="md" align="flex-start" noWrap>
      <Box w={88} sx={{ position: "relative", flexShrink: 0 }}>
        <Image
          src={nft.file.url}
          radius="lg"
          opacity={isCollected === false ? 0.5 : 1}
        />
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
          <Title order={5}>{nft.name}</Title>
          <Text size="xs">{nft.description}</Text>
        </Box>

        {children && <Box mt="xs">{children}</Box>}

        {isCollected !== undefined && !isReward && (
          <Box mt="xs">
            <Badge
              size="lg"
              variant="filled"
              color={isCollected ? "grape" : "gray"}
              leftSection={
                <Box sx={{ lineHeight: "14px" }}>
                  {isCollected ? (
                    <Check color="#fff" size={14} />
                  ) : (
                    <Minus size={14} />
                  )}
                </Box>
              }
              sx={{ alignItems: "center" }}
            >
              {isCollected ? "Collected" : "Not Collected"}
            </Badge>
          </Box>
        )}
      </Flex>
    </Group>
  );
};
