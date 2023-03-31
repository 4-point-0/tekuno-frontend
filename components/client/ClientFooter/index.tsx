import {
  ActionIcon,
  Container,
  createStyles,
  Group,
  Image,
  Text,
} from "@mantine/core";
import {
  BrandDiscord,
  BrandInstagram,
  BrandLinkedin,
  BrandTwitter,
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  footer: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  logo: {
    maxWidth: 240,

    [theme.fn.smallerThan("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  groups: {
    display: "flex",
    flexWrap: "wrap",

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  wrapper: {
    width: 160,
  },

  link: {
    display: "block",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: 3,
    paddingBottom: 3,

    "&:hover": {
      textDecoration: "underline",
    },
  },

  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: `calc(${theme.spacing.xs} / 2)`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  afterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  social: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
    },
  },
}));

interface FooterLinksProps {
  data: {
    title: string;
    links: { label: string; link: string }[];
  }[];
}

export function ClientFooter({ data }: FooterLinksProps) {
  const { classes } = useStyles();

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        target="_blank"
        rel="noreferrer"
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image
            src="/tekuno.svg"
            mb={"sm"}
            alt="Tekuno Logo"
            width={120}
          ></Image>
          <Text size="xs" color="dimmed" className={classes.description}>
            Your experiences, your proof, your value. All what is left to do is
            the doings
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          © 2023 Near Balkans Hub. All rights reserved
        </Text>

        <Group spacing={0} className={classes.social} position="right" noWrap>
          <ActionIcon
            component="a"
            href="https://discord.gg/Excj7hkxTy"
            target="_blank"
            rel="noreferrer"
            size="lg"
          >
            <BrandDiscord size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.instagram.com/tekuno.app"
            target="_blank"
            rel="noreferrer"
            size="lg"
          >
            <BrandInstagram size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://twitter.com/TekunoApp"
            target="_blank"
            rel="noreferrer"
            size="lg"
          >
            <BrandTwitter size={18} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://www.linkedin.com/company/tekunoapp"
            target="_blank"
            rel="noreferrer"
            size="lg"
          >
            <BrandLinkedin size={18} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
