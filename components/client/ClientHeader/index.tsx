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
import { useAccounts } from "@mysten/dapp-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiCoinsDuotone, PiHandCoinsDuotone } from "react-icons/pi";
import { ChevronDown, Disc, User } from "tabler-icons-react";

import { useNetwork } from "@/context/NetworkContext";
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

const suiCampaigns = [
  {
    id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
    name: "SUI - campaign 1",
    description: "<p>Say catchy phrase for your campaign</p>",
    additional_description: null,
    chain: {
      id: "50a0ccf2-78a7-468c-89b2-bde26e9906a7",
      name: "sui",
      description: null,
    },
    campaign_type: {
      id: "3108c7da-53f0-4047-86f2-5dce24d98126",
      name: "attendance",
      description:
        "Campaign where you will typically create POAP for attending",
    },
    start_date: "2023-07-31T22:00:00.000Z",
    end_date: null,
    files: [
      {
        id: "826e88d2-0eaf-437f-a14d-ed77e8582f4b",
        name: "LoneSamurai.png",
        tags: ["image"],
        mime_type: "image/png",
        url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/d36cb1d5-4a09-49cb-ab28-b1aa71b2194e",
      },
    ],
    nfts: [
      {
        id: "fb0abfd9-2b2e-451a-92ff-2b5ee1795aaf",
        name: "POD name",
        description: "Describe your POD",
        properties: {
          attributes: [],
        },
        supply: 500,
        file: {
          id: "c106c030-6b1f-4360-9974-aa8fbe68215c",
          name: "login-image2.jpeg",
          tags: [],
          mime_type: "image/jpeg",
          url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/71e5acad-40a5-4345-ada5-7f1e51d5939b",
        },
        nft_type: {
          id: "f62dbb6a-7821-48cd-a936-a2c8e1bae666",
          name: "poap",
          description:
            "QR code is generated for the claims, Soul-bound/Non-transferable",
        },
        campaign_id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
      },
    ],
  },
  {
    id: "129b17f6-3df8-430c-90eb-0133a5a9e069",
    name: "SUI - campaign 2",
    description: "<p>Say catchy phrase for your campaign</p>",
    additional_description: null,
    chain: {
      id: "50a0ccf2-78a7-468c-89b2-bde26e9906a7",
      name: "sui",
      description: null,
    },
    campaign_type: {
      id: "3108c7da-53f0-4047-86f2-5dce24d98126",
      name: "attendance",
      description:
        "Campaign where you will typically create POAP for attending",
    },
    start_date: "2023-07-31T22:00:00.000Z",
    end_date: null,
    files: [
      {
        id: "826e88d2-0eaf-437f-a14d-ed77e8582f4b",
        name: "LoneSamurai.png",
        tags: ["image"],
        mime_type: "image/png",
        url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/d36cb1d5-4a09-49cb-ab28-b1aa71b2194e",
      },
    ],
    nfts: [
      {
        id: "fb0abfd9-2b2e-451a-92ff-2b5ee1795aaf",
        name: "POD name",
        description: "Describe your POD",
        properties: {
          attributes: [],
        },
        supply: 500,
        file: {
          id: "c106c030-6b1f-4360-9974-aa8fbe68215c",
          name: "login-image2.jpeg",
          tags: [],
          mime_type: "image/jpeg",
          url: "https://tekunodevstorage.blob.core.windows.net/tekunodevcontainer/71e5acad-40a5-4345-ada5-7f1e51d5939b",
        },
        nft_type: {
          id: "f62dbb6a-7821-48cd-a936-a2c8e1bae666",
          name: "poap",
          description:
            "QR code is generated for the claims, Soul-bound/Non-transferable",
        },
        campaign_id: "129b17f6-3df8-430c-90eb-0133a5a9e065",
      },
    ],
  },
];

export function ClientHeader() {
  const isSuiNetwork = true;
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { classes } = useStyles();
  const router = useRouter();

  const { user, refreshTokens } = useNetwork();

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

    const menuItemsNear = campaigns?.map((campaign) => (
      <Menu.Item
        component={Link}
        href={`/campaign/${campaign.id}`}
        key={campaign.id}
        color={router.pathname === `/campaign/${campaign.id}` ? "blue" : "gray"}
      >
        {campaign.name}
      </Menu.Item>
    ));

    const menuItemsSui = suiCampaigns?.map((campaign) => (
      <Menu.Item
        component={Link}
        href={`/campaign/${campaign.id}`}
        key={campaign.id}
        color={router.pathname === `/campaign/${campaign.id}` ? "blue" : "grey"}
      >
        {campaign.name}
      </Menu.Item>
    ));

    if (menuItemsNear || menuItemsSui) {
      return !isSuiNetwork ? (
        <Menu
          key={"Campaigns"}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
        >
          <Menu.Target>
            <Center>
              <NavLink
                icon={<Disc size={20} />}
                label={isSuiNetwork ? `SUI Campaigns` : `NEAR Campaigns`}
                rightSection={<ChevronDown size={12} />}
              />
            </Center>
          </Menu.Target>
          <Menu.Dropdown>{menuItemsSui}</Menu.Dropdown>
        </Menu>
      ) : (
        <Menu
          key={"Campaigns"}
          trigger="hover"
          transitionProps={{ exitDuration: 0 }}
        >
          <Menu.Target>
            <Center>
              <NavLink
                icon={<Disc size={20} />}
                label="Campaigns"
                rightSection={<ChevronDown size={12} />}
              />
            </Center>
          </Menu.Target>
          <Menu.Dropdown>{menuItemsNear}</Menu.Dropdown>
        </Menu>
      );
    }

    return null;
  };

  const campaignLinks = (campaigns?: CampaignDto[]) => {
    if (!user) return null;

    return isSuiNetwork
      ? !suiCampaigns?.map((campaign) => (
          <NavLink
            component={Link}
            href={`/campaign/${campaign.id}`}
            key={campaign.id}
            label={campaign.name}
            icon={<Disc size={16} />}
            active={router.pathname === `/campaign/${campaign.id}`}
          />
        ))
      : campaigns?.map((campaign) => (
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
