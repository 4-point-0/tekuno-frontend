import { IndigoButton } from "@/components/core/IndigoButton";
import { useCampaignControllerFindAll } from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";
import {
  Card,
  Image,
  Stack,
  Title,
  Group,
  Text,
  Grid,
  Paper,
  Center,
  Loader,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Pencil } from "tabler-icons-react";
import { CallToAction } from "../CallToAction";
import { CampaignStatus } from "../CampaignStatus";

export const CampaignList = () => {
  const { data, isLoading } = useCampaignControllerFindAll({});

  const getCampaingImage = (campaign: CampaignDto) => {
    const imageFile = campaign.files?.find((file) =>
      file.tags.includes("image")
    );

    return getImageUrl(imageFile);
  };

  if (isLoading) {
    return (
      <Center h="100%">
        <Loader color="indigo" />
      </Center>
    );
  }

  if (!isLoading && data?.results.length === 0) {
    return (
      <Paper radius="lg" p="xl" h="100%">
        <CallToAction emptyState />
      </Paper>
    );
  }

  return (
    <Grid>
      {data?.results.map((campaign) => (
        <Grid.Col key={campaign.id} span="content">
          <Card
            component={NextLink}
            href={`/admin/previous/${campaign.id}`}
            legacyBehavior
            h="100%"
            w={332}
            shadow="sm"
            radius="xl"
            p="xl"
            pb={72}
          >
            <Card.Section mb="xl">
              <Image
                src={getCampaingImage(campaign)}
                w="100%"
                height={184}
                alt={campaign.name}
              />
            </Card.Section>

            <Stack>
              <Title order={4}>{campaign.name}</Title>

              {campaign.description && (
                <Text fz="sm">{campaign.description}</Text>
              )}

              <Group position="right" noWrap>
                <CampaignStatus status={campaign.status} />
              </Group>
            </Stack>
            <Group sx={{ position: "absolute", bottom: "12px" }}>
              <IndigoButton leftIcon={<Pencil size={14} />}>
                POD Manager
              </IndigoButton>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
