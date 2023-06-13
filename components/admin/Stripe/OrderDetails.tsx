import {
  Badge,
  Button,
  Card,
  Center,
  createStyles,
  Group,
  Image,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ClientContainer } from "@/components/layout/ClientContainer";
import { notifications } from "@/utils/notifications";

import {
  OrderControllerCreateError,
  useCampaignControllerFindOne,
  useOrderControllerCreate,
  useOrderControllerFindOne,
} from "../../../services/api/admin/adminComponents";
import { OrderDto } from "../../../services/api/admin/adminSchemas";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: rem(-0.25),
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

const OrderDetails = (props: any) => {
  const { classes } = useStyles();
  const { orderCompleted } = props;

  const router = useRouter();

  const { data: campaign } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const { mutate: createOrder } = useOrderControllerCreate({
    onSuccess: () => {
      notifications.success({
        title: "Order successfully created!",
      });
    },
    onError: (error: OrderControllerCreateError) => {
      console.error(error);
      notifications.error({
        title: "Error while creating the order",
      });
    },
  });

  console.log(router.query.id);

  const handleCreateOrder = async () => {
    createOrder({
      body: {
        campaign_id: router.query.id as string,
      },
    });
  };

  useEffect(() => {
    if (!orderCompleted) {
      handleCreateOrder();
    }
  }, []);

  const { data: order } = useOrderControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const campaignData = [
    { label: `${campaign?.start_date.split("T")[0]}`, icon: IconCalendar },
    { label: `Type: ${campaign?.campaign_type.name}`, icon: IconCalendar },
  ];

  const features = campaignData.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  return (
    <ClientContainer>
      <Card radius="md" className={classes.card}>
        <Title order={2} my={5}>
          {orderCompleted ? "Checkout" : "Order Confirmation"}
        </Title>
        <Card.Section className={classes.imageSection}>
          <Image
            src={`${campaign?.files![0].url}`}
            radius="xl"
            alt="Campaing Image"
          />
        </Card.Section>

        <Group position="apart" mt="md">
          <div>
            <Text fw={500}>{campaign?.name}</Text>
            <Text fz="xs" c="dimmed">
              {campaign?.campaign_type.description}
            </Text>
          </div>
          <Badge variant="outline">Creator Pays</Badge>
        </Group>

        <Card.Section className={classes.section} mt="md">
          <Text fz="sm" c="dimmed" className={classes.label}>
            Payment Information
          </Text>

          <Group spacing={8} mb={-8}>
            {features}
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Group spacing={30}>
            <div>
              <Text fz="xl" fw={700} sx={{ lineHeight: 1 }}>
                {`${order?.price} $`}
              </Text>
              <Text fz="sm" c="dimmed" fw={500} sx={{ lineHeight: 1 }} mt={3}>
                One time payment
              </Text>
            </div>
            {orderCompleted ? null : (
              <Button
                component={Link}
                href={`/admin/stripe/payment/${router.query.id}`}
                color="dark"
                size="sm"
                mt="md"
                radius="xl"
                style={{ flex: 1 }}
              >
                Confirm Order
              </Button>
            )}
          </Group>
        </Card.Section>
      </Card>
    </ClientContainer>
  );
};

export default OrderDetails;
