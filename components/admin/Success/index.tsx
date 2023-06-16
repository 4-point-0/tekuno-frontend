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
import Link from "next/link";
import { useRouter } from "next/router";

import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";

import { ClientContainer } from "../../../components/layout/ClientContainer";

const Success = () => {
  const isBuyer = false;
  const router = useRouter();

  const { id } = router.query;

  const { data: campaign } = useCampaignControllerFindOne({
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
      <feature.icon size="1.05rem" />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  console.log(campaign);

  const getCampaignImage = (campaign: CampaignDto) => {
    const imageFile = campaign.files?.find((file) =>
      file.tags.includes("image")
    );
    return getImageUrl(imageFile);
  };
  return (
    <>
      <ClientContainer>
        <Title order={2}>Success</Title>
        {isBuyer ? (
          <Text pb={10}>
            You have sucessfully transfered the payment for the
            <span style={{ fontWeight: "bold" }}>{campaign?.name}</span> to the
            Tekuno users!
          </Text>
        ) : (
          <Text pt="md">
            {" "}
            You have successfully completed the payment for the
            <span style={{ fontWeight: "bold" }}>{campaign?.name}</span>{" "}
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

export default Success;
