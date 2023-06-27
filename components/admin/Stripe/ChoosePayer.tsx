import { Box, Button, Group, Image, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import {
  fetchCampaignControllerChangePaymentType,
  OrderControllerCreateError,
  useOrderControllerCreate,
} from "@/services/api/admin/adminComponents";
import { notifications } from "@/utils/notifications";

import { ClientContainer } from "../../layout/ClientContainer";

export const ChoosePayer = () => {
  const router = useRouter();

  const [isCreator, setIsCreator] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  const handlePayerSelection = (payer: string) => {
    setIsCreator(payer === "Creator");
    setIsBuyer(payer === "Buyer");
  };

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

  const handleCreateOrder = async () => {
    createOrder({
      body: {
        campaign_id: router.query.id as string,
      },
    });
  };

  const handleSubmit = async () => {
    notifications.create({
      title: "Selecting payer...",
    });

    try {
      await fetchCampaignControllerChangePaymentType({
        pathParams: {
          id: router.query.id as string,
        },
        body: {
          paymentType: isCreator ? "CreatorPays" : "BuyerPays",
        },
      });

      handleCreateOrder();

      notifications.success({
        title: "You have selected the payer!",
      });
    } catch (error) {
      console.error(error);
      notifications.error({
        title: "Payer cannot be selected",
      });
    }
  };

  return (
    <>
      <ClientContainer>
        <Group position="center" mt={50}>
          <Title order={2}>Select the prefered payer</Title>
        </Group>

        <Group position="center" mt={50}>
          <Box
            sx={(theme): any => ({
              backgroundColor: isCreator
                ? "#fbbab3"
                : theme.colorScheme === "dark",
              textAlign: "center",
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#fbbab3",
              },
            })}
            onClick={() => handlePayerSelection("Creator")}
          >
            <Text c="dimmed">Creator</Text>
            <Image
              width={400}
              height={250}
              my={20}
              radius="lg"
              src="https://cdn.dribbble.com/users/1946759/screenshots/4596801/media/d458fd1d425fee348d73c70b98d50c34.png"
              alt="Buyer"
            />
            <Text c="dimmed">
              Creator will pay for the whole NFT collection
            </Text>
          </Box>
          <Box
            sx={(theme): any => ({
              backgroundColor: isBuyer
                ? "#faa1b1"
                : theme.colorScheme === "dark",
              textAlign: "center",
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#faa1b1",
              },
            })}
            onClick={() => handlePayerSelection("Buyer")}
          >
            <Text c="dimmed">Buyer</Text>
            <Image
              width={400}
              height={250}
              my={20}
              radius="lg"
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/2ff14972501477.5be9ceade6db8.jpg"
              alt="Buyer"
            />
            <Text c="dimmed">User will pay for clamed NFT</Text>
          </Box>
        </Group>
        <Group position="center">
          <Button
            mt={50}
            component={Link}
            href={
              isBuyer
                ? `/admin/stripe/success/${router.query.id}`
                : `/admin/stripe/order/${router.query.id}`
            }
            color="dark"
            disabled={!isBuyer && !isCreator}
            onClick={() => handleSubmit()}
          >
            Proceed to Order
          </Button>
        </Group>
      </ClientContainer>
    </>
  );
};
