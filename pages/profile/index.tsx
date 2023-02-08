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

  const { user, publicKey, loading, openWallet, signOut } = useRamper();

  const router = useRouter();

  const onSignOut = () => {
    signOut();
    router.push("/");
  };

  const getAvatarPublicKeySeed = () => {
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

  const shorterPublicKey = () => {
    if (!publicKey) return "";
    if (publicKey.length < 25) return publicKey;
    return `${publicKey.substring(0, 20)}...${publicKey.substring(
      publicKey.length - 4,
      publicKey.length
    )}`;
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
          <Tooltip disabled={(publicKey?.length ?? 0) < 20} label={publicKey}>
            <Title order={2}>{shorterPublicKey() ?? "Not connected"}</Title>
          </Tooltip>
          <Stack hidden={!Object.hasOwn(user ?? {}, "email")} spacing={4}>
            <Text fz={"lg"}>Email Address</Text>
            <Text fz={"md"}>{user?.email}</Text>
          </Stack>
          <Stack spacing={4}>
            <Text fz={"lg"}>Wallet ID</Text>
            <Tooltip disabled={(publicKey?.length ?? 0) < 20} label={publicKey}>
              <Anchor
                href={`https://explorer.testnet.near.org/accounts/${publicKey}`}
                target="_blank"
              >
                {shorterPublicKey()}
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
