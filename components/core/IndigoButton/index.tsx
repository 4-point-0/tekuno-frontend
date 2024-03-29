import {
  Button,
  ButtonProps,
  createPolymorphicComponent,
  createStyles,
} from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.indigo[0],

    "&:hover:not([data-disabled])": {
      backgroundColor: theme.colors.indigo[1],
    },
  },
  label: {
    color: theme.colors.dark[9],
  },
  icon: {
    color: theme.colors.dark[9],

    svg: {
      stroke: theme.colors.dark[9],
    },
  },
}));

export const IndigoButton = createPolymorphicComponent<"button", ButtonProps>(
  (props: PolymorphicComponentProps<"button", ButtonProps>) => {
    const { classes } = useStyles();

    return <Button color="indigo" classNames={classes} {...props} />;
  }
);
