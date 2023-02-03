import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
}));

interface IUserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
}

export function UserButton({ image, name, email, ...rest }: IUserButtonProps) {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.user} {...rest}>
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        <ChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
}
