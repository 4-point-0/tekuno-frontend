import {
  Button,
  Image,
  MediaQuery,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { ChevronRight } from "tabler-icons-react";

import { useRamper } from "@/context/RamperContext";
import {
  useNftControllerDropNft,
  useNftControllerFindOne,
} from "@/services/api/client/clientComponents";
import { NftDto } from "@/services/api/client/clientSchemas";
import { useIsClient } from "@/hooks/useIsClient";

interface IClaimNftProps {
  nft: NftDto;
}

export const ClaimNft: React.FC<IClaimNftProps> = ({ nft }) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const { user } = useRamper();
  const isClient = useIsClient();
  const drop = useNftControllerDropNft({ retry: false });

  const { data: userNft, isLoading: isLoadingUserNft } =
    useNftControllerFindOne(
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
    if (!isClient) {
      return false;
    }

    if (isLoadingUserNft) {
      return false;
    }

    if (isOwnedByUser) {
      return false;
    }

    return true;
  }, [isClient, isLoadingUserNft, isOwnedByUser]);

  const onClaimButtonClick = async () => {
    if (user) {
      await drop.mutateAsync({
        pathParams: {
          nftId: nft.id as string,
          accountId: user.profile?.wallet_address as string,
        },
      });
    } else {
      router.push(`/login?redirect=/claim/${nft.id}`);
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
        onClick={onClaimButtonClick}
        display={showClaimButton ? undefined : "none"}
      >
        {user ? "Claim" : "Connect to Tekuno"}
      </Button>
    );
  };

  return (
    <>
      <Stack align="start">
        <Button
          key={nft?.campaign?.id}
          component={Link}
          href={`/campaign/${nft?.campaign?.id}`}
          variant="light"
          radius={"md"}
          sx={(theme) => ({
            color: theme.colors.dark,
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
          <Image radius={"md"} src={nft?.file.url} alt="Nft artwork" />

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
            <Title order={3}>Description</Title>{" "}
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

          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            {claimButton()}
          </MediaQuery>
        </Stack>
      </SimpleGrid>
    </>
  );
};