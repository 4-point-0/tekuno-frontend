import { CopyActionButton } from "@/components/core/CopyActionButton";
import { useRamper } from "@/context/RamperContext";
import {
  Anchor,
  Button,
  Card,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronRight, Logout, Wallet } from "tabler-icons-react";

// TODO: Get campaigns from API
const campaigns = [
  {
    id: 1,
    name: "Campaign 1",
  },
  {
    id: 2,
    name: "Campaign 2",
  },
  {
    id: 3,
    name: "Campaign 3",
  },
];

export default function Profile() {
  const isBigScreen = useMediaQuery("(min-width: 900px)");

  const { user, loading, openWallet, signOut } = useRamper();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  const onSignOut = () => {
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

  const campaignLinks = (campaigns: any[]) => {
    return campaigns.map((campaign) => (
      <Button
        key={campaign.id}
        component={Link}
        href={`/campaign/${campaign.id}`}
        variant="light"
        radius={"md"}
        rightIcon={<ChevronRight size={20} />}
      >
        {campaign.name}
      </Button>
    ));
  };

  const getContent = () => {
    return (
      <SimpleGrid cols={isBigScreen ? 2 : 1}>
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
              onClick={onSignOut}
            >
              Sign Out
            </Button>
          </Group>
        </Stack>
        <Stack align={"start"} spacing={24}>
          <Group>
            <Tooltip
              disabled={!isWalletAdressTooLong()}
              label={getWalletAdress()}
            >
              <Title
                sx={{
                  width: !isWalletAdressTooLong()
                    ? "auto"
                    : isBigScreen
                    ? 300
                    : 240,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                order={2}
              >
                {getWalletAdress()}
              </Title>
            </Tooltip>
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
              {campaignLinks(campaigns)}
            </Stack>
          </Stack>
        </Stack>
      </SimpleGrid>
    );
  };

  if (!user) return <></>;

  return isBigScreen ? (
    <Container>
      <Card>{getContent()}</Card>
    </Container>
  ) : (
    <Card>{getContent()}</Card>
  );
}
