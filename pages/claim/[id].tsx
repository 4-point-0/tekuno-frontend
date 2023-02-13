import { useRamper } from "@/context/RamperContext";
import {
  Button,
  Card,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";

const nft = {
  nft_id: "1",
  name: "Explode lil' lolly pop #2349",
  description: `Minted as part of the BTS Army fandom drop, this digital collectible item grants access to special fan content.`,
  attributes: [
    {
      name: "Privacy",
      value: "Low",
    },
    {
      name: "Rarity",
      value: "High",
    },
  ],
  supply: 100,
  file: {
    mime_type: "image/png",
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGRvZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  },
  campaign: {
    id: "1",
    name: "BTS Army Fandom",
    additional_description:
      "Start collecting The BTS Army Fandom digital collectible which will grant access to special content!",
  },
};

export default function ClaimPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const isBigScreen = useMediaQuery("(min-width: 900px)");

  const { user } = useRamper();

  const { id } = router.query;

  const isOwnedByUser = () => {
    if (!user) return false;

    // Check if NFT is owned by user
    return false;
  };

  const onClaimButtonClick = () => {
    if (user) {
      // Claim NFT
    } else {
      router.push(`/login?redirect=/claim/${id}`);
    }
  };

  const claimButton = () => {
    return isOwnedByUser() ? null : (
      <Button fullWidth variant="filled" onClick={onClaimButtonClick}>
        {user ? "Claim" : "Connect to Tekuno"}
      </Button>
    );
  };

  const getContent = () => (
    <Container>
      <Stack align={"start"}>
        <Button
          key={nft.campaign.id}
          component={Link}
          href={`/campaign/${nft.campaign.id}`}
          variant="light"
          radius={"md"}
          sx={(theme) => ({
            color: theme.colors.dark,
          })}
          rightIcon={<ChevronRight size={20} />}
        >
          <Text fw={700}>{nft.campaign.name}</Text>
        </Button>
        <Text>{nft.campaign.additional_description}</Text>
      </Stack>
      <SimpleGrid
        mt={40}
        cols={isBigScreen ? 2 : 1}
        spacing={isBigScreen ? 40 : 16}
      >
        <Stack align={"start"} spacing="md">
          <Image radius={"md"} src={nft.file.url} alt="Nft artwork" />
          {isBigScreen && claimButton()}
        </Stack>
        <Stack align={"start"} spacing={24}>
          <Stack spacing={0}>
            {isOwnedByUser() && (
              <Text fz={"sm"} color={theme.primaryColor}>
                Owned by: you
              </Text>
            )}
            <Title order={2}>{nft.name}</Title>
          </Stack>
          <Stack spacing={4}>
            <Title order={3}>Description</Title>{" "}
            <Text fz={"md"}>{nft.description}</Text>
          </Stack>
          <Stack sx={{ width: "100%" }} align={"start"} spacing={"lg"}>
            <Title order={3}>Attributes</Title>
            <Stack
              sx={{
                width: "100%",
                alignSelf: "center",
              }}
              spacing={"sm"}
            >
              {nft.attributes.map((attribute) => (
                <Stack
                  sx={(theme) => ({
                    width: "100%",
                    backgroundColor: theme.colors[theme.primaryColor][0],
                    borderRadius: theme.radius.lg,
                  })}
                  py={6}
                  key={attribute.name}
                  align={"center"}
                  spacing={0}
                >
                  <Text
                    align="center"
                    color={theme.primaryColor}
                    fz={"sm"}
                    fw={700}
                  >
                    {attribute.name}
                  </Text>
                  <Title align="center" order={4}>
                    {attribute.value}
                  </Title>
                </Stack>
              ))}
            </Stack>
          </Stack>
          {!isBigScreen && claimButton()}
        </Stack>
      </SimpleGrid>
    </Container>
  );

  return isBigScreen ? (
    <Container>
      <Card>{getContent()}</Card>
    </Container>
  ) : (
    <Card>{getContent()}</Card>
  );
}
