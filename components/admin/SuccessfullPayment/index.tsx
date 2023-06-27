import {
  Button,
  Card,
  Center,
  Grid,
  Group,
  Image,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { formatDateRange } from "@/utils/date";

import { ClientContainer } from "../../layout/ClientContainer";

const SuccessfullPayment = () => {
  const isBuyer = false;
  const router = useRouter();

  const { id } = router.query;

  const { data: campaign } = useCampaignControllerFindOne({
    pathParams: {
      id: id as string,
    },
  });
  const campaignData = [
    {
      label: !campaign?.end_date
        ? `${formatDateRange(campaign?.start_date as string)}- ∞`
        : `${formatDateRange(
            campaign?.start_date as string
          )} - ${formatDateRange(campaign?.end_date as string)}`,
      icon: IconCalendar,
    },
    { label: `Type: ${campaign?.campaign_type.name}`, icon: IconInfoCircle },
  ];
  const features = campaignData.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));
  return (
    <>
      <ClientContainer>
        <Title order={2}>Successful payment</Title>
        {isBuyer ? (
          <Text pb={10}>
            You have sucessfully transfered the payment for the
            <b>{` ${campaign?.name} `}</b>
            to the Tekuno users!
          </Text>
        ) : (
          <Text pt="md">
            {" "}
            You have successfully completed the payment for the
            <b>{` ${campaign?.name} `}</b>
            campaign!
          </Text>
        )}
        <Grid align="md" ml={0} m="auto">
          <Grid.Col md={1} lg={4}>
            <Image
              src={`${campaign?.files![0].url}`}
              mx="auto"
              mt={50}
              m="auto"
              maw={600}
              radius="xl"
              alt="Campaign Image"
            />
          </Grid.Col>
          <Grid.Col md={1} lg={5} ml={0} m="auto">
            <Card.Section m={50}>
              <Title order={4}>{campaign?.name}</Title>
              <Text fz="sm" c="dimmed" p={8} pl={0}>
                Campaign details
              </Text>
              <Group spacing={8} mb={3}>
                {features}
              </Group>
            </Card.Section>
            <Button component={Link} href={`/admin`} color="dark" ml={45}>
              Retun to Dashboard
            </Button>
          </Grid.Col>
        </Grid>
      </ClientContainer>
    </>
  );
};

export default SuccessfullPayment;
