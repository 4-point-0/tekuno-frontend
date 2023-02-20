import {
  Button,
  ButtonProps,
  createPolymorphicComponent,
  createStyles,
} from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";
import React from "react";

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
  rightIcon: {
    color: theme.colors.dark,
  },
}));

export const IndigoButton = createPolymorphicComponent<"button", ButtonProps>(
  (props: PolymorphicComponentProps<"button", ButtonProps>) => {
    const { classes } = useStyles();

    return <Button color="indigo" classNames={classes} {...props} />;
  }
);
