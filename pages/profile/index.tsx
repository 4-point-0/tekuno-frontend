import {
  Anchor,
  Button,
  Group,
  Image,
  MediaQuery,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  ConnectButton,
  ConnectModal,
  useAccounts,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronRight, Logout, Password, Wallet } from "tabler-icons-react";

import { CopyActionButton } from "@/components/core/CopyActionButton";
import { ClientContainer } from "@/components/layout/ClientContainer";
import { useNetwork } from "@/context/NetworkContext";
import { useIsClient } from "@/hooks/useIsClient";
import { useCampaignUserControllerFindAll } from "@/services/api/client/clientComponents";

export default function Profile() {
  const accounts = useAccounts();

  const currentAccount = useCurrentAccount();

  const { address, chains, features, icon, label, publicKey } =
    accounts[0] || {};

  const { user, loading, openWallet, signOut, signOutSuiUser } = useNetwork();
  //TODO: define how to detect current network
  const isSuiNetwork = accounts.length !== 0 ? true : false;

  const { data: campaigns } = useCampaignUserControllerFindAll(
    { queryParams: { account_id: user?.profile?.wallet_address as string } },
    { enabled: Boolean(user?.profile?.wallet_address) }
  );

  // const suiCampaigns = campaigns?.results?.filter(
  //   (campaing) => campaing.chain.name === "sui"
  // );

  const suiCampaigns = [
    {
      id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
      name: "SUI - campaign 1",
      description: "<p>Say catchy phrase for your campaign</p>",
      additional_description: null,
      chain: {
        id: "50a0ccf2-78a7-468c-89b2-bde26e9906a7",
        name: "sui",
        description: null,
      },
      campaign_type: {
        id: "3108c7da-53f0-4047-86f2-5dce24d98126",
        name: "attendance",
        description:
          "Campaign where you will typically create POAP for attending",
      },
      start_date: "2023-07-31T22:00:00.000Z",
      end_date: null,
      files: [
        {
          id: "826e88d2-0eaf-437f-a14d-ed77e8582f4b",
          name: "LoneSamurai.png",
          tags: ["image"],
          mime_type: "image/png",
          url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/d36cb1d5-4a09-49cb-ab28-b1aa71b2194e",
        },
      ],
      nfts: [
        {
          id: "fb0abfd9-2b2e-451a-92ff-2b5ee1795aaf",
          name: "POD name",
          description: "Describe your POD",
          properties: {
            attributes: [],
          },
          supply: 500,
          file: {
            id: "c106c030-6b1f-4360-9974-aa8fbe68215c",
            name: "login-image2.jpeg",
            tags: [],
            mime_type: "image/jpeg",
            url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/71e5acad-40a5-4345-ada5-7f1e51d5939b",
          },
          nft_type: {
            id: "f62dbb6a-7821-48cd-a936-a2c8e1bae666",
            name: "poap",
            description:
              "QR code is generated for the claims, Soul-bound/Non-transferable",
          },
          campaign_id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
        },
      ],
    },
    {
      id: "129b17f6-3df8-430c-90eb-0133a5a9e069",
      name: "SUI - campaign 2",
      description: "<p>Say catchy phrase for your campaign</p>",
      additional_description: null,
      chain: {
        id: "50a0ccf2-78a7-468c-89b2-bde26e9906a7",
        name: "sui",
        description: null,
      },
      campaign_type: {
        id: "3108c7da-53f0-4047-86f2-5dce24d98126",
        name: "attendance",
        description:
          "Campaign where you will typically create POAP for attending",
      },
      start_date: "2023-07-31T22:00:00.000Z",
      end_date: null,
      files: [
        {
          id: "826e88d2-0eaf-437f-a14d-ed77e8582f4b",
          name: "LoneSamurai.png",
          tags: ["image"],
          mime_type: "image/png",
          url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/d36cb1d5-4a09-49cb-ab28-b1aa71b2194e",
        },
      ],
      nfts: [
        {
          id: "fb0abfd9-2b2e-451a-92ff-2b5ee1795aaf",
          name: "POD name",
          description: "Describe your POD",
          properties: {
            attributes: [],
          },
          supply: 500,
          file: {
            id: "c106c030-6b1f-4360-9974-aa8fbe68215c",
            name: "login-image2.jpeg",
            tags: [],
            mime_type: "image/jpeg",
            url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/71e5acad-40a5-4345-ada5-7f1e51d5939b",
          },
          nft_type: {
            id: "f62dbb6a-7821-48cd-a936-a2c8e1bae666",
            name: "poap",
            description:
              "QR code is generated for the claims, Soul-bound/Non-transferable",
          },
          campaign_id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
        },
      ],
    },
  ];

  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && !user) {
      router.push("/login");
    }
  }, [router, user, isClient]);

  const handleSignOutRamper = () => {
    signOut();
    router.push("/");
  };

  const handleSignOutSui = () => {
    signOutSuiUser();
    router.push("/");
  };

  const getWalletAdress = () => {
    return user?.profile?.wallet_address || address || "";
  };

  const isWalletAdressTooLong = () => {
    return getWalletAdress().length > 20;
  };

  const getAvatarPublicKeySeed = () => {
    const publicKey = user?.profile?.wallet_address;

    if (publicKey?.includes(".testnet"))
      return publicKey?.replace(".testnet", "");
    if (publicKey?.includes(".mainnet"))
      return publicKey?.replace(".mainnet", "");

    return publicKey;
  };

  const getAvatarUrl = () => {
    return `https://api.dicebear.com/5.x/thumbs/svg?seed=${getAvatarPublicKeySeed()}&shapeColor=0a5b83,1c799f,69d2e7&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear,solid`;
  };

  if (!user) {
    return null;
  }

  return (
    <ClientContainer>
      <SimpleGrid breakpoints={[{ minWidth: "sm", cols: 2 }]} mt={"md"}>
        <Stack align={"center"} spacing="xs">
          <Image
            radius={"xl"}
            src={getAvatarUrl()}
            width={300}
            alt="Tekuno logo"
          />
          <Group>
            {isSuiNetwork ? null : (
              <Button
                leftIcon={<Wallet />}
                loading={loading}
                mt={"lg"}
                variant="light"
                radius={"xl"}
                color="indigo.0"
                sx={(theme) => ({
                  color: theme.colors.dark[9],
                })}
                onClick={openWallet}
              >
                Open Wallet
              </Button>
            )}
            {isSuiNetwork ? (
              <Button
                leftIcon={<Logout />}
                loading={loading}
                mt={"lg"}
                variant="light"
                radius={"xl"}
                color="indigo.0"
                sx={(theme) => ({
                  color: theme.colors.dark[9],
                })}
                onClick={handleSignOutSui}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                leftIcon={<Logout />}
                loading={loading}
                mt={"lg"}
                variant="light"
                radius={"xl"}
                color="indigo.0"
                sx={(theme) => ({
                  color: theme.colors.dark[9],
                })}
                onClick={handleSignOutRamper}
              >
                Sign Out
              </Button>
            )}
          </Group>
        </Stack>
        <Stack align={"start"} spacing={24}>
          <Group>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Tooltip
                disabled={!isWalletAdressTooLong()}
                label={getWalletAdress()}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={
                      isSuiNetwork
                        ? "/logo/SUI-logo.svg"
                        : "/logo/NEAR-logo.svg"
                    }
                    alt="Network Logo"
                    width={20}
                    height={20}
                  />
                  <Title
                    sx={{
                      width: !isWalletAdressTooLong() ? "auto" : 240,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      marginLeft: "0.5rem",
                    }}
                    order={2}
                  >
                    Tekuno
                  </Title>
                </div>
              </Tooltip>
            </MediaQuery>
          </Group>
          <Stack hidden={!user?.email} spacing={4}>
            <Text fz={"lg"}>Email Address</Text>
            <Text fz={"lg"}>
              {user?.email ||
                label ||
                "Email address is not linked to the wallet"}
            </Text>
          </Stack>
          <Stack spacing={4}>
            <Text fz={"lg"}>
              {isSuiNetwork ? `SUI Wallet ID` : `NEAR Wallet ID`}
            </Text>
            {/* <Tooltip
              disabled={!isWalletAdressTooLong()}
              label={getWalletAdress()}
            >
              <Anchor
                href={`https://explorer.testnet.near.org/accounts/${getWalletAdress()}`}
                target="_blank"
                rel="norefferer"
                sx={{
                  width: 240,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {getWalletAdress()}
              </Anchor>
            </Tooltip> */}

            <Group>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                {/* <Tooltip
                disabled={!isWalletAdressTooLong()}
                label={getWalletAdress()}
              >
                <Title
                  sx={{
                    width: !isWalletAdressTooLong() ? "auto" : 240,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  order={2}
                >
                  {getWalletAdress()}
                </Title>
              </Tooltip>
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Tooltip
                disabled={!isWalletAdressTooLong()}
                label={getWalletAdress()}
              >
                <Title
                  sx={{
                    width: !isWalletAdressTooLong() ? "auto" : 300,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  order={2}
                >
                  {getWalletAdress()}
                </Title>
              </Tooltip> */}

                <Tooltip
                  disabled={!isWalletAdressTooLong()}
                  label={getWalletAdress()}
                >
                  <Title
                    sx={{
                      width: !isWalletAdressTooLong() ? "auto" : 240,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    order={4}
                  >
                    {getWalletAdress()}
                  </Title>
                </Tooltip>
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Tooltip
                  disabled={!isWalletAdressTooLong()}
                  label={getWalletAdress()}
                >
                  <Title
                    sx={{
                      width: !isWalletAdressTooLong() ? "auto" : 300,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    order={4}
                  >
                    {getWalletAdress()}
                  </Title>
                </Tooltip>
              </MediaQuery>

              <CopyActionButton value={getWalletAdress()} />
            </Group>
          </Stack>
          <Stack spacing={"lg"}>
            <Title order={3}>My Campaigns</Title>
            <Stack align={"start"} spacing={"sm"}>
              {isSuiNetwork
                ? suiCampaigns?.map((campaign) => (
                    <Button
                      key={campaign.id}
                      component={Link}
                      href={`/campaign/${campaign.id}`}
                      variant="light"
                      radius={"md"}
                      sx={(theme) => ({
                        color: theme.colors.dark[9],
                      })}
                      rightIcon={<ChevronRight size={20} />}
                    >
                      <Text fw={700}>{campaign.name}</Text>
                    </Button>
                  ))
                : campaigns?.results.map((campaign) => (
                    <Button
                      key={campaign.id}
                      component={Link}
                      href={`/campaign/${campaign.id}`}
                      variant="light"
                      sx={(theme) => ({
                        color: theme.colors.dark[9],
                      })}
                      rightIcon={<ChevronRight size={20} />}
                    >
                      <Text fw={700}>{campaign.name}</Text>
                    </Button>
                  ))}
            </Stack>
          </Stack>
        </Stack>
      </SimpleGrid>
    </ClientContainer>
  );
}
