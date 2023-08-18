// import { Divider, Navbar, Text, Stack, rem, createStyles} from "@mantine/core";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { useUserOrganization } from "@/hooks/useUserOrganization";
// import { Links } from "./Links";
// import { UserButton } from "./UserButton";
// const useStyles = createStyles((theme) => ({
//   navbar: {
//     backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
//     paddingBottom: 0,
//   },
//   footer: {
//     marginLeft: `calc(${theme.spacing.md} * -1)`,
//     marginRight: `calc(${theme.spacing.md} * -1)`,
//     borderTop: `${rem(1)} solid ${
//       theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
//     }`,
//   },
// }));
// interface AdminNavbarProps {
//   opened: boolean;
// }
// export const AdminNavbar = ({ opened }: AdminNavbarProps) => {
//   const router = useRouter();
//   const { classes } = useStyles();
//   const { data: session } = useSession();
//   const { hasOrganization } = useUserOrganization(Boolean(session));
//   if (router.route.endsWith("preview") || !session) {
//     return null;
//   }
//   return (
//     <Navbar
//       hiddenBreakpoint="sm"
//       hidden={!opened}
//       width={{ base: 300 }}
//       px="sm"
//       py="md"
//     >
//       {hasOrganization && (
//         <>
//           <Navbar.Section>
//             <Links />
//           </Navbar.Section>
//           <Divider mt="xl" mb="md" />
//         </>
//       )}
//       <Navbar.Section>
//         <UserButton />
//       </Navbar.Section>
//     </Navbar>
//   );
// };
import {
  Button,
  createStyles,
  Divider,
  getStylesRef,
  Navbar,
  rem,
  Text,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { GiCoins } from "react-icons/gi";

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
      theme.fn.variant({ variant: "filled", color: "dark" }).background!,
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
  const { hasOrganization } = useUserOrganization(Boolean(session));
  if (router.route.endsWith("preview") || !session) {
    return null;
  }
  // const [active, setActive] = useState("Billing");

  // const links = data.map((item) => (
  //   <a
  //     className={cx(classes.link, {
  //       [classes.linkActive]: item.label === active,
  //     })}
  //     href={item.link}
  //     key={item.label}
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActive(item.label);
  //     }}
  //   >
  //     <span>{item.label}</span>
  //   </a>
  // ));

  return (
    // <Navbar height="auto" width={{ sm: 300 }} p="md" className={classes.navbar}>
    //   <Navbar.Section grow>
    //     <Group className={classes.header} position="apart">
    //       <Code className={classes.version}>v3.1.2</Code>
    //     </Group>
    //     {links}
    //   </Navbar.Section>

    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: 300 }}
      px="sm"
      py="md"
      // p="md"
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
        <Text className={classes.text}>
          <b>Available funds:</b>
        </Text>
        <Text className={classes.text}>
          <GiCoins size={20} style={{ marginRight: "2%" }} />{" "}
          <b style={{ marginRight: "2%" }}>256</b> Tokens
        </Text>
        <Button
          className={classes.button}
          onClick={() => router.push("/admin/tokens")}
          mt="sm"
        >
          Buy more tokens
        </Button>
      </Navbar.Section>
    </Navbar>
  );
};
