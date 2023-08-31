import {
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Grid,
  Group,
  Image,
  Paper,
  rem,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsCardImage, BsMegaphone } from "react-icons/bs";
import { ArrowLeft, Calendar, Check, Wallet } from "tabler-icons-react";

import { useUserOrganization } from "@/hooks/useUserOrganization";
import {
  OrderControllerPreviewOrderError,
  useCampaignControllerFindOne,
  useOrderControllerCreateOrder,
  useOrderControllerPreviewOrder,
} from "@/services/api/admin/adminComponents";
import { getCampaignAssets } from "@/utils/campaign";
import { formatDateRange } from "@/utils/date";
import { notifications } from "@/utils/notifications";

//TODO: refactor this page!

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: "#DDE1E8",
    textAlign: "center",
    paddingTop: "20%",
    borderRadius: "10px",
  },
  paymentDetails: {
    backgroundColor: "#DDE1E8",
    borderRadius: "10px",
    padding: "5%",
  },

  wrapper: {
    padding: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

const Payment = () => {
  const router = useRouter();
  const { classes, theme } = useStyles();
  const [hasEnoughTokens, setHasEnoughTokens] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const { data: session } = useSession();

  const campaignId = router.query.id as string;

  const { data } = useOrderControllerPreviewOrder({
    pathParams: {
      campaignId: campaignId as string,
    },
  });

  const { data: campaign } = useCampaignControllerFindOne({
    pathParams: {
      id: campaignId,
    },
  });

  const { image } = getCampaignAssets(campaign);

  const { organization } = useUserOrganization(Boolean(session));

  const { mutate: createOrder } = useOrderControllerCreateOrder({
    onSuccess: () => {
      notifications.success({
        title: "Order successfully created!",
      });
      router.push(`/admin/previous/${campaignId}`);
    },
    onError: (error: OrderControllerPreviewOrderError) => {
      console.error(error);
      notifications.error({
        title: "Error while creating the order",
      });
    },
  });

  const handleCreateOrder = async () => {
    createOrder({
      body: {
        campaign_id: router.query.id as string,
      },
    });
  };

  useEffect(() => {
    if (data && organization?.balance) {
      setCurrentPrice(data.price);
      if (data.price > organization.balance) {
        setHasEnoughTokens(false);
      } else {
        setHasEnoughTokens(true);
      }
    }
  }, [data]);

  return (
    <>
      <Container my="md">
        <Title order={2}>Order details</Title>
        <Box mt="md">
          <Text fw={700} c="dimmed">
            Campaign
          </Text>
          <Title order={3}>{`${campaign?.name}`}</Title>
        </Box>
        <Box w="80%" mx="auto" mt="md">
          <Image radius="lg" src={`${image?.url}`} />
        </Box>
        <Box mt="xl">
          <Text fw={700} c="dimmed">
            Campaign details
          </Text>
        </Box>
        <Grid mt="sm">
          <Grid.Col xs={4}>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <ThemeIcon
                  size={35}
                  radius="md"
                  variant="gradient"
                  gradient={{ deg: 120, from: "pink", to: "dark" }}
                >
                  <Calendar size={rem(26)} />
                </ThemeIcon>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Start Date
                  </Text>
                  <Text weight={700} ta="center" size="md">
                    {campaign?.start_date
                      ? formatDateRange(campaign?.start_date)
                      : "Not Defined"}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col xs={4}>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <ThemeIcon
                  size={35}
                  radius="md"
                  variant="gradient"
                  gradient={{ deg: 120, from: "pink", to: "dark" }}
                >
                  <Calendar size={rem(26)} />
                </ThemeIcon>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    End Date
                  </Text>
                  <Text weight={700} ta="center" size="md">
                    {!campaign?.end_date
                      ? "Not Defined"
                      : formatDateRange(campaign.end_date)}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col xs={4}>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <ThemeIcon
                  size={35}
                  radius="md"
                  variant="gradient"
                  gradient={{ deg: 120, from: "pink", to: "dark" }}
                >
                  <BsCardImage size={rem(22)} />
                </ThemeIcon>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Number of NFTs
                  </Text>
                  <Text weight={700} ta="center" size="md">
                    {campaign?.nfts?.length}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
          <Grid.Col xs={4}>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <ThemeIcon
                  size={35}
                  radius="md"
                  variant="gradient"
                  gradient={{ deg: 120, from: "pink", to: "dark" }}
                >
                  <BsMegaphone size={rem(22)} />
                </ThemeIcon>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Campaign type
                  </Text>
                  <Text weight={700} ta="center" size="md">
                    {campaign?.campaign_type.name}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
        <SimpleGrid
          mt="md"
          cols={1}
          spacing="md"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          {!hasEnoughTokens && (
            <Box
              h="auto"
              ta="center"
              sx={{
                backgroundColor: "#ff5252",
                opacity: "0.8",
                borderRadius: "10px",
              }}
              py="sm"
            >
              <Text fw={600}>Not enough funds, please buy more tokens</Text>
            </Box>
          )}
        </SimpleGrid>

        <Box mt="md">
          <Text fw={700} c="dimmed">
            Payment Details
          </Text>

          <SimpleGrid
            mt="md"
            cols={3}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            <Paper withBorder radius="md" p="xs">
              <Group>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Available tokens
                  </Text>
                  <Text weight={700} ta="center" size="xl">
                    {`${organization?.balance}` || `0`}
                  </Text>
                </Box>
              </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    Campaign cost
                  </Text>
                  <Text weight={700} size="xl" ta="center">
                    {` ${currentPrice}` || "Price is being calculated"}
                  </Text>
                </Box>
              </Group>
            </Paper>
            <Paper withBorder radius="md" p="xs">
              <Group>
                <Box mx="auto">
                  <Text
                    color="dimmed"
                    size="xs"
                    transform="uppercase"
                    weight={700}
                  >
                    New balance after payment
                  </Text>
                  <Text weight={700} size="xl" ta="center">
                    {`${((organization?.balance ?? 0) - currentPrice).toFixed(
                      2
                    )}`}
                  </Text>
                </Box>
              </Group>
            </Paper>
          </SimpleGrid>
        </Box>
        <Box w="100%" mx="auto" mt="lg">
          <Center>
            <Button
              mr="md"
              color="dark"
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button
              color="dark"
              leftIcon={<Check size={20} />}
              disabled={!hasEnoughTokens}
              onClick={() => handleCreateOrder()}
            >
              Confirm payment
            </Button>
          </Center>
        </Box>
      </Container>
    </>
  );
};

export default Payment;
