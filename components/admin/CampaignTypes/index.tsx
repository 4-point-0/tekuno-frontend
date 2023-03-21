import { IndigoButton } from "@/components/core/IndigoButton";
import { campaignTypeData, TYPES } from "@/enums/CampaignType";
import {
  Card,
  Group,
  Image,
  List,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { CirclePlus } from "tabler-icons-react";

export const CampaignTypes = () => {
  return (
    <SimpleGrid cols={3} maw={1200}>
      {TYPES.map((template) => {
        const { title, image, perks } = campaignTypeData[template].card;

        const href = `/admin/create/${template}`;

        return (
          <Card
            key={template}
            component={NextLink}
            href={href}
            legacyBehavior
            h="100%"
            shadow="sm"
            radius="xl"
            p="xl"
            pb={72}
          >
            <Card.Section mb="xl">
              <Image src={image} w="100%" alt={title} />
            </Card.Section>

            <Stack>
              <Title order={3}>{title}</Title>
              <List size="sm">
                {perks.map((perk) => (
                  <List.Item key={perk}>{perk}</List.Item>
                ))}
              </List>
            </Stack>
            <Group sx={{ position: "absolute", bottom: "12px" }}>
              <IndigoButton leftIcon={<CirclePlus size={20} />}>
                Create POD
              </IndigoButton>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};
