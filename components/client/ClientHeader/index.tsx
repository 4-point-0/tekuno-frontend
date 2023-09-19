import {
  Box,
  Burger,
  Button,
  Center,
  Container,
  createStyles,
  Drawer,
  Group,
  Header,
  Image,
  Menu,
  NavLink,
  Popover,
  ScrollArea,
  Skeleton,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiCoinsDuotone, PiHandCoinsDuotone } from "react-icons/pi";
import { ChevronDown, Disc, User } from "tabler-icons-react";

import { useRamper } from "@/context/RamperContext";
import { useCampaignUserControllerFindAll } from "@/services/api/client/clientComponents";
import { CampaignDto } from "@/services/api/client/clientSchemas";

import { IndigoButton } from "../../core/IndigoButton";

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

export function ClientHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { classes } = useStyles();
  const router = useRouter();

  const { user, refreshTokens } = useRamper();

  const [isClient, setIsClient] = useState(false);

  const { data: campaigns } = useCampaignUserControllerFindAll(
    {
      queryParams: {
        account_id: user?.profile?.wallet_address as string,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address),
    }
  );

  useEffect(() => {
    refreshTokens();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, [setIsClient]);

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
      <Skeleton visible={!isClient}>
        <NavLink
          component={Link}
          href="/login"
          label="Log In"
          icon={<User size={16} />}
          variant="subtle"
          active={router.pathname === "/login"}
        />
      </Skeleton>
    );
  };

  const buyTokensLink = () => {
    return (
      <IndigoButton onClick={() => router.push("/tokens")}>
        Buy more Tekunos
      </IndigoButton>
    );
  };

  const campaignDropdownLinks = (campaigns?: CampaignDto[]) => {
    if (!(isClient && user && campaigns?.length)) return null;

    const menuItems = campaigns?.map((campaign) => (
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
        <Menu
          key={"Campaigns"}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
        >
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

  const campaignLinks = (campaigns?: CampaignDto[]) => {
    if (!user) return null;

    return campaigns?.map((campaign) => (
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
              {campaignDropdownLinks(campaigns?.results)}
              <Box>Tekunos</Box>
              <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button>
                    {" "}
                    <Image src={"/tekuno-symbol.svg"} width={16} mr="5px" />
                    {user?.profile?.balance || "0"}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Box>{buyTokensLink()}</Box>
                </Popover.Dropdown>
              </Popover>

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
            <Image src="/tekuno.svg" alt="Tekuno logo" />
          </Link>
        }
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Stack mt={"lg"} spacing={4}>
            {profileLink()}

            {campaignLinks(campaigns?.results)}
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
