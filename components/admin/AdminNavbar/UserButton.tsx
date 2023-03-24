import {
  Avatar,
  createStyles,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";

import { useAdminUser } from "@/hooks/useAdminUser";
import { getAvatarUrl } from "@/utils/avatar";

interface ButtonProps {
  active: boolean;
}

const useStyles = createStyles((theme, { active }: ButtonProps) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.black,
    borderRadius: theme.radius.md,
    backgroundColor: active ? theme.colors.blue[0] : undefined,

    "&:hover": {
      backgroundColor: active ? theme.colors.blue[0] : theme.colors.gray[0],
    },
  },
}));

export const UserButton = ({ ...rest }: UnstyledButtonProps) => {
  const router = useRouter();
  const { classes } = useStyles({ active: router.route === "/admin/user" });

  const { data } = useAdminUser();

  return (
    <UnstyledButton
      component={Link}
      href="/admin/user"
      className={classes.user}
      {...rest}
    >
      <Group>
        <Avatar src={getAvatarUrl(data?.email)} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {data?.username}
          </Text>

          <Text color="dimmed" size="xs">
            {data?.email}
          </Text>
        </div>

        <ChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
};
