import { templateData, TEMPLATES } from "@/enums/PODTempalates";
import {
  Button,
  Card,
  createStyles,
  Group,
  Image,
  List,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import React from "react";
import { CirclePlus } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.indigo[0],

    "&:hover": {
      backgroundColor: theme.colors.indigo[1],
    },
  },
  label: {
    color: theme.colors.dark,
  },
  leftIcon: {
    color: theme.colors.dark,
  },
}));

export const PODTemplates = () => {
  const { classes } = useStyles();

  return (
    <SimpleGrid cols={3} maw={1200}>
      {TEMPLATES.map((template) => {
        const { title, image, perks } = templateData[template].card;

        const href = `/admin/create/${template}`;

        return (
          <Card
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
                  <List.Item>{perk}</List.Item>
                ))}
              </List>
            </Stack>
            <Group sx={{ position: "absolute", bottom: "12px" }}>
              <Button
                component={NextLink}
                color="indigo"
                href={href}
                legacyBehavior
                leftIcon={<CirclePlus size={20} />}
                classNames={classes}
              >
                Create POD
              </Button>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};
