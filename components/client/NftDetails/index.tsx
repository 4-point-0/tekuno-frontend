import {
  Badge,
  Box,
  Button,
  MediaQuery,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Check, ChevronRight, Flame } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";

import { useRamper } from "@/context/RamperContext";
import {
  useCampaignUserControllerFindAll,
  useNftControllerDropNft,
  useNftControllerFindOne,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";
import { useIsClient } from "@/hooks/useIsClient";
import { AssetPreview } from "@/components/admin/CampaignForm/AssetPreview";

interface INftDetailsProps {
  nft: NftDto;
  disableClaim?: boolean;
}

export const NftDetails: React.FC<INftDetailsProps> = ({
  nft,
  disableClaim,
}) => {
  const theme = useMantineTheme();
  const { user, signIn, loading: ramperLoading } = useRamper();
  const isClient = useIsClient();
  const drop = useNftControllerDropNft({ retry: false });
  const [claimed, setClaimed] = useState(false);
  const { refetch: refechUserCampaigns } = useCampaignUserControllerFindAll(
    { queryParams: { account_id: user?.profile?.wallet_address as string } },
    { enabled: false, refetchOnWindowFocus: false }
  );

  const {
    data: userNft,
    isLoading: isLoadingUserNft,
    refetch,
  } = useNftControllerFindOne(
    {
      pathParams: {
        nftId: nft.id as string,
        accountId: user?.profile?.wallet_address as string,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address && nft.id),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const isOwnedByUser = useMemo(() => {
    if (!user) {
      return false;
    }

    return Boolean(userNft);
  }, [userNft, user]);

  const showClaimButton = useMemo(() => {
    if (disableClaim) {
      return false;
    }

    if (!isClient) {
      return false;
    }

    if (user && isLoadingUserNft) {
      return false;
    }

    if (isOwnedByUser) {
      return false;
    }

    return true;
  }, [isClient, isLoadingUserNft, isOwnedByUser, user]);

  const handleClaim = async () => {
    if (user) {
      await drop.mutateAsync({
        pathParams: {
          nftId: nft.id as string,
          accountId: user.profile?.wallet_address as string,
        },
      });

      showNotification({ message: `${nft.name} claimed! 🎉`, autoClose: 3000 });
      setClaimed(true);
      refetch();
      refechUserCampaigns();
    } else {
      await signIn();
    }
  };

  const claimButton = () => {
    return (
      <Button
        size="lg"
        radius="xl"
        color={user ? undefined : "dark"}
        fullWidth
        variant="filled"
        onClick={handleClaim}
        display={showClaimButton ? undefined : "none"}
        disabled={drop.isLoading}
        loading={drop.isLoading || ramperLoading}
        loaderPosition="right"
      >
        {user ? "Claim" : "Connect to Tekuno"}
      </Button>
    );
  };

  return (
    <>
      {claimed && (
        <Box pos="fixed" top={0} bottom={0} left={0} right={0}>
          <ConfettiExplosion force={0.8} duration={3000} particleCount={300} />
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
        <Text>{nft?.campaign?.description}</Text>
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
            {claimButton()}
          </MediaQuery>
        </Stack>
        <Stack align={"start"} spacing={24}>
          <Stack spacing={0}>
            <Text fz={"sm"} color={theme.primaryColor}>
              {isOwnedByUser ? "Owned by: you" : "\u00A0"}
            </Text>
            <Title order={2}>{nft?.name}</Title>
          </Stack>
          <Stack spacing={4}>
            <Title order={3}>Description</Title>
            <Text fz={"md"}>{nft?.description}</Text>
          </Stack>

          {Boolean(nft?.properties?.attributes.length) && (
            <Stack sx={{ width: "100%" }} align={"start"} spacing={"lg"}>
              <Title order={3}>Attributes</Title>
              <Stack
                sx={{
                  width: "100%",
                  alignSelf: "center",
                }}
                spacing={"sm"}
              >
                {nft?.properties?.attributes?.map(
                  (attribute: { trait_type: string; value: string }) => (
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
                      <Text
                        align="center"
                        color={theme.primaryColor}
                        fz={"sm"}
                        fw={700}
                      >
                        {attribute.trait_type}
                      </Text>
                      <Title align="center" order={4}>
                        {attribute.value}
                      </Title>
                    </Stack>
                  )
                )}
              </Stack>
            </Stack>
          )}

          {userNft && (
            <Box>
              {userNft.is_burned ? (
                <Badge
                  size="xl"
                  variant="filled"
                  color="red"
                  leftSection={
                    <Box sx={{ lineHeight: "14px" }}>
                      <Flame size={14} />
                    </Box>
                  }
                >
                  Burned
                </Badge>
              ) : (
                <Badge
                  variant="filled"
                  color="grape"
                  size="xl"
                  leftSection={
                    <Box sx={{ lineHeight: "14px" }}>
                      <Check size={14} />
                    </Box>
                  }
                >
                  Collected
                </Badge>
              )}
            </Box>
          )}

          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Box w="100%" pos="fixed" left={0} bottom={0} p="md">
              {claimButton()}
            </Box>
          </MediaQuery>
        </Stack>
      </SimpleGrid>
    </>
  );
};