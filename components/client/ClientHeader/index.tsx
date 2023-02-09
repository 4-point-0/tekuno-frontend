import { useRamper } from "@/context/RamperContext";
import {
  Box,
  Burger,
  Center,
  Container,
  createStyles,
  Drawer,
  Group,
  Header,
  Image,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChevronDown, Disc, User } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

// TODO: Get campaigns from API
const campaigns = [
  {
    id: 1,
    name: "Campaign 1",
  },
  {
    id: 2,
    name: "Campaign 2",
  },
  {
    id: 3,
    name: "Campaign 3",
  },
];

export function ClientHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { classes } = useStyles();
  const router = useRouter();

  const { user } = useRamper();

  useEffect(() => {
    router.events.on("routeChangeStart", (url, { shallow }) => {
      closeDrawer();
    });
  }, [closeDrawer, router.events]);

  const profileLink = () => {
    return user ? (
      <NavLink
        component={Link}
        href="/profile"
        label="Profile"
        icon={<User size={16} />}
        variant="subtle"
        active={router.pathname === "/profile"}
      />
    ) : (
      <NavLink
        component={Link}
        href="/login"
        label="Log In"
        icon={<User size={16} />}
        variant="subtle"
        active={router.pathname === "/login"}
      />
    );
  };

  const campaignDropdownLinks = (campaigns: any[]) => {
    if (!user) return null;

    const menuItems = campaigns.map((campaign) => (
      <Menu.Item
        component={Link}
        href={`/campaign/${campaign.id}`}
        key={campaign.id}
        color={router.pathname === `/campaign/${campaign.id}` ? "blue" : "gray"}
      >
        {campaign.name}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={"Campaigns"} trigger="hover" exitTransitionDuration={0}>
          <Menu.Target>
            <Center>
              <NavLink
                icon={<Disc size={10} />}
                label="Campaigns"
                rightSection={<ChevronDown size={12} />}
              />
            </Center>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return null;
  };

  const campaignLinks = (campaigns: any[]) => {
    if (!user) return null;

    return campaigns.map((campaign) => (
      <NavLink
        component={Link}
        href={`/campaign/${campaign.id}`}
        key={campaign.id}
        label={campaign.name}
        icon={<Disc size={16} />}
        active={router.pathname === `/campaign/${campaign.id}`}
      />
    ));
  };

  return (
    <Box>
      <Header height={56}>
        <Container>
          <div className={classes.inner}>
            <Link href="/">
              <Box w={120}>
                <Image src="/tekuno.svg" alt="Tekuno logo"></Image>
              </Box>
            </Link>
            <Group className={classes.hiddenMobile}>
              {campaignDropdownLinks(campaigns)}

              <Box>{profileLink()}</Box>
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </div>
        </Container>
      </Header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Link href="/">
            <Box w={120}>
              <Image src="/tekuno.svg" alt="Tekuno logo"></Image>
            </Box>
          </Link>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Stack mt={"lg"} spacing={4}>
            {profileLink()}

            {campaignLinks(campaigns)}
            <NavLink
              component={Link}
              href="/about"
              label="About Tekuno"
              icon={
                <Image
                  src="/tekuno-symbol.svg"
                  alt="Tekuno logo"
                  width={16}
                ></Image>
              }
              active={router.pathname === "/about"}
            />
          </Stack>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}