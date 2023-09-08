import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "tabler-icons-react";

import {
  fetchCampaignControllerChangePaymentType,
  useCampaignControllerFindOne,
} from "@/services/api/admin/adminComponents";
import { notifications } from "@/utils/notifications";

const useStyles = createStyles((theme) => ({
  card: {
    width: "30%",
    height: "300px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    cursor: "pointer",
    // "&:hover": {
    //   boxShadow: "2px 0px 63px -9px rgba(0,0,0,0.51)",
    //   transform: "scale(1.02)",
    //   transition: "transform 0.3s ease-in-out",
    // },
  },

  section: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

export const ChoosePayer = ({ campaignId }: any) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [isCreator, setIsCreator] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);

  const { data: campaign } = useCampaignControllerFindOne({
    pathParams: {
      id: campaignId as string,
    },
  });

  const handlePayerSelection = (payer: string) => {
    setIsCreator(payer === "Creator");
    setIsBuyer(payer !== "Creator");
  };

  const handleSubmit = async () => {
    notifications.create({
      title: "Selecting payer...",
    });

    try {
      await fetchCampaignControllerChangePaymentType({
        pathParams: {
          id: campaignId as string,
        },
        body: {
          paymentType: isCreator ? "CreatorPays" : "BothPay",
        },
      });

      notifications.success({
        title: "You have selected the payer!",
      });
      router.push(`/admin/activation/payment/${campaignId}`);
    } catch (error) {
      console.error(error);
      notifications.error({
        title: "Payer cannot be selected",
      });
    }
  };

  useEffect(() => {
    if (campaign?.campaign_type.name === "attendance") setIsAttendance(true);
  }, []);

  return (
    <>
      <Group position="center" mt={50}>
        <Title order={2}>Select the prefered payer</Title>
      </Group>

      {isAttendance && isBuyer && (
        <Center mt="xl">
          <Box
            h="auto"
            ta="center"
            sx={{
              opacity: "0.7",
              borderRadius: "10px",
            }}
            p="sm"
          >
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Warning!"
              color="red"
              variant="outline"
            >
              Attendance type campaign can be paid only by the creator of the
              campaign
            </Alert>
          </Box>
        </Center>
      )}

      <Center mt="xl">
        <Card
          radius="md"
          p="md"
          mr="xl"
          className={classes.card}
          sx={{
            border: isCreator ? "1.5px solid #C489DA" : "0.5px solid #f4f4f4",
          }}
          onClick={() => handlePayerSelection("Creator")}
        >
          <Card.Section>
            <Image src={"/images/creator.png"} alt={"Creator"} height={200} />
          </Card.Section>

          <Card.Section className={classes.section} mt="md">
            <Group position="center">
              <Text fz="lg" fw={500}>
                Creator Pays
              </Text>
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} c="dimmed" ta="center">
              Campaign creator will pay for the whole NFT collection
            </Text>
          </Card.Section>
        </Card>
        <Card
          radius="md"
          p="md"
          className={classes.card}
          sx={{
            border: isBuyer ? "1.5px solid #C489DA" : "0.5px solid #f4f4f4",

            // boxShadow: `${
            //   isBuyer ? "2px 0px 63px -9px rgba(0,0,0,0.51)" : null
            // }`,
          }}
          onClick={() => handlePayerSelection("Buyer")}
        >
          <Card.Section>
            <Image src={"/images/buyer.png"} alt={"Creator"} height={200} />
          </Card.Section>

          <Card.Section className={classes.section} mt="md">
            <Group position="center">
              <Text fz="lg" fw={500}>
                Creator & User Pay
              </Text>
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} c="dimmed" ta="center">
              Campaign creator and buyer will pay for a clamed NFT
            </Text>
          </Card.Section>
        </Card>
      </Center>
      <Group position="center">
        <Button
          mt={50}
          color="dark"
          leftIcon={<ArrowLeft size={20} />}
          onClick={() => router.back()}
        >
          Get back to Campaign
        </Button>
        <Button
          mt={50}
          leftIcon={<Check size={20} />}
          color="dark"
          disabled={
            (!isBuyer && !isCreator) ||
            (campaign?.campaign_type.name === "attendance" && isBuyer)
          }
          onClick={() => handleSubmit()}
        >
          Proceed to Order
        </Button>
      </Group>
    </>
  );
};
