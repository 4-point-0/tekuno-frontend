import {
  Card,
  Center,
  Grid,
  Group,
  Image,
  Loader,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { Pencil } from "tabler-icons-react";

import { FormattedHTML } from "@/components/core/FormattedHTML";
import { IndigoButton } from "@/components/core/IndigoButton";
import { useCampaignControllerFindAll } from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";

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
            component={Link}
            href={`/admin/previous/${campaign.id}`}
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
                <FormattedHTML fz="sm" content={campaign.description} />
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
