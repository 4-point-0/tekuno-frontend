import { createStyles, Divider, Navbar, rem, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GiCoins } from "react-icons/gi";
import { PiHandCoinsDuotone } from "react-icons/pi";

import { IndigoButton } from "@/components/core/IndigoButton";
import { useUserOrganization } from "@/hooks/useUserOrganization";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

interface ButtonProps {
  active: boolean;
}

const useStyles = createStyles((theme, { active }: ButtonProps) => ({
  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: "gray" }).background!,
      0.1
    )}`,
  },

  button: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: "white",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    backgroundColor: "black",

    "&:hover": {
      backgroundColor: theme.colors.gray[7],
    },
  },

  text: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: "black",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
  },
}));

const data = [
  { link: "", label: "Notifications" },
  { link: "", label: "Billing" },
  { link: "", label: "Security;" },
  { link: "", label: "SSH Keys" },
  { link: "", label: "Databases" },
  { link: "", label: "Authentication" },
  { link: "", label: "Other Settings" },
];

interface AdminNavbarProps {
  opened: boolean;
}
export const AdminNavbar = ({ opened }: AdminNavbarProps) => {
  const router = useRouter();
  const { classes } = useStyles({ active: router.route === "/admin/user" });
  const { data: session } = useSession();
  const { organization, hasOrganization } = useUserOrganization(
    Boolean(session)
  );

  if (router.route.endsWith("preview") || !session) {
    return null;
  }

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: 300 }}
      px="sm"
      py="md"
      height="auto"
    >
      {hasOrganization && (
        <>
          <Navbar.Section>
            <Links />
          </Navbar.Section>
          <Divider mt="xl" mb="md" />
        </>
      )}
      <Navbar.Section grow>
        <UserButton />
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Text className={classes.text} c="dimmed">
          <b>Available Tokens:</b>
        </Text>
        <Text className={classes.text} fz={17}>
          <GiCoins size={25} style={{ marginRight: "2%" }} />
          <b style={{ marginRight: "2%" }}>{organization?.balance || "0"}</b>
        </Text>
        <IndigoButton
          onClick={() => router.push("/admin/tokens")}
          mt="sm"
          leftIcon={<PiHandCoinsDuotone size={20} />}
        >
          Buy more tokens
        </IndigoButton>
      </Navbar.Section>
    </Navbar>
  );
};
