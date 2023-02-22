import {
  Badge,
  BadgeProps,
  createPolymorphicComponent,
  createStyles,
} from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";
import React from "react";

const useStyles = createStyles((theme) => ({
  root: {
    paddingLeft: 4,
    color: theme.colors.dark[8],
    textTransform: "none",
    fontWeight: 600,
  },

  leftSection: {
    color: theme.colors.dark[8],
  },
}));

export const IndigoBadge = createPolymorphicComponent<"div", BadgeProps>(
  (props: PolymorphicComponentProps<"div", BadgeProps>) => {
    const { classes } = useStyles();

    return <Badge color="indigo" classNames={classes} {...props} />;
  }
);
