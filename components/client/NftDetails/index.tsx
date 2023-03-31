import {
  Box,
  Button,
  MediaQuery,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "tabler-icons-react";

import { AssetPreview } from "@/components/admin/CampaignForm/AssetPreview";
import { FormattedHTML } from "@/components/core/FormattedHTML";
import { ClientContainer } from "@/components/layout/ClientContainer";
import { ClientOnly } from "@/components/layout/ClientOnly";
import { useRamper } from "@/context/RamperContext";
import { useNftOwned } from "@/hooks/useNftOwned";
import { useCampaignUserControllerFindAll } from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";

import { Attributes } from "./Attributes";
import { ClaimButton } from "./ClaimButton";
import { OwnershipBadge } from "./OwnershipBadge";

interface NftDetailsProps {
  nft: NftDto;
  disableClaim?: boolean;
}

const ConfettiExplosion = dynamic(() => import("react-confetti-explosion"));

export const NftDetails = ({ nft, disableClaim }: NftDetailsProps) => {
  const theme = useMantineTheme();
  const { user } = useRamper();
  const [claimed, setClaimed] = useState(false);
  const { refetch: refechUserCampaigns } = useCampaignUserControllerFindAll(
    { queryParams: { account_id: user?.profile?.wallet_address as string } },
    { enabled: false, refetchOnWindowFocus: false }
  );

  const { isOwned } = useNftOwned(nft.id);

  const handleClaim = () => {
    setClaimed(true);
    refechUserCampaigns();
  };

  return (
    <ClientOnly>
      <ClientContainer>
        {claimed && (
          <Box pos="fixed" top={0} bottom={0} left={0} right={0}>
            <ConfettiExplosion
              force={0.8}
              duration={3000}
              particleCount={300}
            />
          </Box>
        )}

        <Stack align="start">
          <Button
            key={nft?.campaign?.id}
            component={Link}
            href={`/campaign/${nft?.campaign?.id}`}
            variant="light"
            radius={"md"}
            sx={(theme) => ({
              color: theme.colors.dark[9],
            })}
            rightIcon={<ChevronRight size={20} />}
          >
            <Text fw={700}>{nft?.campaign?.name}</Text>
          </Button>
          <FormattedHTML content={nft.campaign?.description} />
        </Stack>

        <SimpleGrid
          mt={40}
          breakpoints={[{ minWidth: "sm", cols: 2, spacing: 40 }]}
          cols={1}
          spacing={16}
        >
          <Stack align={"start"} spacing="md">
            <Box w="100%">
              <AssetPreview file={nft.file} />
            </Box>

            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Box w="100%">
                {!disableClaim && (
                  <ClaimButton nft={nft} onClaim={handleClaim} />
                )}
              </Box>
            </MediaQuery>
          </Stack>

          <Stack align="flex-start" spacing={24}>
            <Stack spacing={0}>
              <Text fz="sm" color={theme.primaryColor}>
                {isOwned ? "Owned by: you" : "\u00A0"}
              </Text>
              <Title order={2}>{nft?.name}</Title>
            </Stack>
            {nft.description && (
              <Stack spacing={4}>
                <Title order={3}>Description</Title>
                <Text fz={"md"}>{nft?.description}</Text>
              </Stack>
            )}

            {Boolean(nft?.properties?.attributes.length) && (
              <Stack sx={{ width: "100%" }} align={"start"} spacing={"lg"}>
                <Title order={3}>Attributes</Title>
                <Attributes attributes={nft?.properties?.attributes} />
              </Stack>
            )}

            <Box>
              <OwnershipBadge nftId={nft.id} />
            </Box>

            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Box w="100%" pos="fixed" left={0} bottom={0} p="md">
                {!disableClaim && (
                  <ClaimButton nft={nft} onClaim={handleClaim} />
                )}
              </Box>
            </MediaQuery>
          </Stack>
        </SimpleGrid>
      </ClientContainer>
    </ClientOnly>
  );
};
