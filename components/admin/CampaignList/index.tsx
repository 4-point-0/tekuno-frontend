import { IndigoButton } from "@/components/core/IndigoButton";
import { Card, Image, Stack, Title, Group, Text, Grid } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import { Pencil } from "tabler-icons-react";

export const CampaignList = () => {
  const campaigns = [
    {
      id: "1",
      name: "Moneymotion x Mastercard",
      description:
        "Collecting our special Mastercard Pods to win exclusive gifts from Mastercard after completing the entire collection.",
      imageUrl: "https://via.placeholder.com/332",
    },
    {
      id: "2",
      name: "BlockSplit 3.0",
      description:
        "BlockSplit 3 is an international conference for blockchain and development, which offers an opportunity to get acquainted with cutting edge technologies and network with leading experts in the industry.",
      imageUrl: "https://via.placeholder.com/332",
    },
  ];

  return (
    <Grid>
      {campaigns.map((campaign) => (
        <Grid.Col span="content">
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
                src={campaign.imageUrl}
                w="100%"
                height={184}
                alt={campaign.name}
              />
            </Card.Section>

            <Stack>
              <Title order={4}>{campaign.name}</Title>

              <Text fz="sm">{campaign.description}</Text>
            </Stack>
            <Group sx={{ position: "absolute", bottom: "12px" }}>
              <IndigoButton leftIcon={<Pencil size={14} />}>
                Campaign Manager
              </IndigoButton>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
