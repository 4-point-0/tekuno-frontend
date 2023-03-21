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
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronRight, Logout, Wallet } from "tabler-icons-react";

import { CopyActionButton } from "@/components/core/CopyActionButton";
import { ClientContainer } from "@/components/layout/ClientContainer";
import { useRamper } from "@/context/RamperContext";
import { useIsClient } from "@/hooks/useIsClient";
import { useCampaignUserControllerFindAll } from "@/services/api/client/clientComponents";

export default function Profile() {
  const { user, loading, openWallet, signOut } = useRamper();

  const { data: campaigns } = useCampaignUserControllerFindAll(
    { queryParams: { account_id: user?.profile?.wallet_address as string } },
    { enabled: Boolean(user?.profile?.wallet_address) }
  );

  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && !user) {
      router.push("/login");
    }
  }, [router, user, isClient]);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const getWalletAdress = () => {
    return user?.profile?.wallet_address || "";
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
      <SimpleGrid breakpoints={[{ minWidth: "sm", cols: 2 }]}>
        <Stack align={"center"} spacing="xs">
          <Image
            radius={"xl"}
            src={getAvatarUrl()}
            width={300}
            alt="Tekuno logo"
          />
          <Group>
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
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Group>
        </Stack>
        <Stack align={"start"} spacing={24}>
          <Group>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
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
              </Tooltip>
            </MediaQuery>

            <CopyActionButton value={getWalletAdress()} />
          </Group>
          <Stack hidden={!user?.email} spacing={4}>
            <Text fz={"lg"}>Email Address</Text>
            <Text fz={"md"}>{user?.email}</Text>
          </Stack>
          <Stack spacing={4}>
            <Text fz={"lg"}>Wallet ID</Text>
            <Tooltip
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
            </Tooltip>
          </Stack>
          <Stack spacing={"lg"}>
            <Title order={3}>My Campaigns</Title>
            <Stack align={"start"} spacing={"sm"}>
              {campaigns?.results.map((campaign) => (
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
              ))}
            </Stack>
          </Stack>
        </Stack>
      </SimpleGrid>
    </ClientContainer>
  );
}
