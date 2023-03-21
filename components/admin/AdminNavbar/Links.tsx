import {
  Button,
  Stack,
  ThemeIcon,
  createStyles,
  Box,
  Collapse,
  MantineColor,
} from "@mantine/core";
import { CircleDot, CirclePlus, Clock, Icon } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";
import { useCampaignControllerFindAll } from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";

interface ButtonProps {
  active: boolean;
  child: boolean;
}

const COLORS: Record<CampaignDto["status"], MantineColor> = {
  Created: "green",
  Started: "violet",
  Ended: "gray",
  Paused: "pink",
};

const useStlyes = createStyles((theme, { active, child }: ButtonProps) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    borderRadius: "4px",
    backgroundColor: active ? theme.colors.blue[0] : undefined,
  },
  label: {
    color: active ? undefined : theme.colors.dark[9],
    fontWeight: "normal",
  },
  leftIcon: {
    paddingLeft: child ? 30 : undefined,
  },
}));

interface LinkButtonProps {
  label: string;
  href: string;
  isChild?: boolean;
  Icon?: Icon;
  color?: string;
  links?: Array<LinkButtonProps>;
}

export const LinkButton = ({
  href,
  label,
  Icon,
  links,
  color,
  isChild,
}: LinkButtonProps) => {
  const router = useRouter();
  const isOpen = router.asPath.startsWith(href);
  const isActive = router.asPath === href;
  const { classes } = useStlyes({ active: isActive, child: Boolean(isChild) });

  return (
    <>
      <Button
        component={NextLink}
        href={href}
        legacyBehavior
        key={label}
        variant="subtle"
        leftIcon={
          Icon ? (
            <ThemeIcon color={color} size={26} variant="light">
              <Icon size={19} />
            </ThemeIcon>
          ) : (
            color && (
              <Box
                sx={{
                  background: color,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                }}
              />
            )
          )
        }
        classNames={classes}
      >
        {label}
      </Button>
      <Collapse in={isOpen}>
        {links?.map((props) => (
          <LinkButton key={props.href} {...props} isChild />
        ))}
      </Collapse>
    </>
  );
};

export const Links = () => {
  const { data } = useCampaignControllerFindAll({});

  const previousCampaings = data?.results;

  const links = [
    {
      label: "Create POD",
      href: "/admin/create",
      Icon: CirclePlus,
      links: [
        {
          label: "Attendance",
          href: "/admin/create/attendance",
          color: "#f06595",
        },
        {
          label: "Loyalty / Rewards",
          href: "/admin/create/loyalty",
          color: "#cc5de8",
        },
      ],
    },
    {
      label: "Previous PODs",
      href: "/admin/previous",
      Icon: Clock,
      links: previousCampaings?.map(({ name, id, status }) => {
        return {
          label: name,
          href: `/admin/previous/${id}`,
          Icon: CircleDot,
          color: COLORS[status],
        };
      }),
    },
  ];

  return (
    <Stack spacing={0}>
      {links.map(({ label, href, Icon, links }) => (
        <LinkButton
          key={href}
          label={label}
          href={href}
          Icon={Icon}
          links={links}
        />
      ))}
    </Stack>
  );
};
