import { useAdminControllerFindMe } from "@/services/api/admin/adminComponents";
import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  createStyles,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";

interface IButtonProps {
  active: boolean;
}

const useStyles = createStyles((theme, { active }: IButtonProps) => ({
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

export const UserButton: React.FC<UnstyledButtonProps> = ({ ...rest }) => {
  const router = useRouter();
  const { classes } = useStyles({ active: router.route === "/admin/user" });

  const { data: session } = useSession();

  return (
    <UnstyledButton
      component={NextLink}
      href="/admin/user"
      legacyBehavior
      className={classes.user}
      {...rest}
    >
      <Group>
        <Avatar src={session?.user?.image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {session?.user?.name}
          </Text>

          <Text color="dimmed" size="xs">
            {session?.user?.email}
          </Text>
        </div>

        <ChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
};
