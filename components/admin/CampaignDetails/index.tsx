import { IndigoBadge } from "@/components/core/IndigoBadge";
import { IndigoButton } from "@/components/core/IndigoButton";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import { Download, Eye, Pencil } from "tabler-icons-react";
import { StatBox } from "./StatBox";

const campaign = {
  id: 1,
  imageUrl: "https://via.placeholder.com/928",
  name: "Mastercard x Moneymotion",
  description: `Start collecting our special Mastercard Pods to win exclusive gifts from Mastercard after completing the entire collection.`,
  additionalDescription: `Mastercard.hr is a lead Sponsor at Money Motion 2023 conference. In line with being also innovation pioneers at each and every business undertaking, we've teamed up with Tekuno and NEAR Balkans teams to create a new rewarding digital experience  to Money Motion's conference attendees. Scan our special QR codes across the conference venue to collect our first Mastercard digital collectibles. Join our family, and win awards along the way!`,
};

const stats = [
  {
    label: "NFTs CLAIMED",
    value: 1342,
    subLabel: "In Total",
  },
  {
    label: "TOTAL SUPPLY",
    value: 10000,
  },
];

const documents = [
  { name: "Money Motion dresscode.pdf" },
  { name: "Money-Motion-Legal.pdf" },
];

export const CampaignDetails = () => {
  return (
    <Container>
      <Stack>
        <Box>
          <Image height={200} src={campaign.imageUrl} radius="lg" />
        </Box>

        <Box>
          <Title order={2}>{campaign.name}</Title>
          <Text c="dimmed">March 09. to March 10.</Text>
        </Box>

        <Group position="right">
          <IndigoButton
            component={NextLink}
            href={`${campaign.id}/preview`}
            legacyBehavior
            leftIcon={<Eye size={14} />}
          >
            Preview
          </IndigoButton>
          <Button
            component={NextLink}
            href={`${campaign.id}/edit`}
            legacyBehavior
            leftIcon={<Pencil size={14} />}
            color="dark"
          >
            Edit
          </Button>
        </Group>

        <Text fz="lg">{campaign.description}</Text>
        <Text fz="sm">{campaign.additionalDescription}</Text>

        <SimpleGrid cols={4}>
          {stats.map((stat) => (
            <StatBox
              key={stat.label}
              value={stat.value}
              label={stat.label}
              subLabel={stat.subLabel}
            />
          ))}
        </SimpleGrid>

        <Group position="apart" align="flex-start" noWrap>
          <Group miw={200}>
            <Title order={4}>Project documents</Title>
          </Group>

          <Group position="right">
            {documents.map((document) => (
              <IndigoBadge
                key={document.name}
                size="lg"
                leftSection={
                  <ActionIcon variant="transparent" color="dark">
                    <Download size={14} />
                  </ActionIcon>
                }
              >
                {document.name}
              </IndigoBadge>
            ))}
          </Group>
        </Group>

        <Group position="apart">
          <Title order={4}>Digital collectibles</Title>
          <IndigoButton leftIcon={<Download size={14} />}>
            Download all QR codes
          </IndigoButton>
        </Group>
      </Stack>
    </Container>
  );
};
