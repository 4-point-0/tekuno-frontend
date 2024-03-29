import {
  Box,
  Button,
  Collapse,
  createStyles,
  MantineColor,
  ScrollArea,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { CircleDot, CirclePlus, Clock, Icon } from "tabler-icons-react";

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
  links?: LinkButtonProps[];
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

  const [collapseOpen, setCollapseOpen] = useState(isOpen);

  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  return (
    <>
      <Button
        component={Link}
        href={href}
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
        onClick={toggleCollapse}
      >
        {label}
      </Button>
      <Collapse in={collapseOpen}>
        {collapseOpen && label === "Previous PODs" ? (
          <ScrollArea h={500}>
            {links?.map((props) => (
              <LinkButton key={props.href} {...props} isChild />
            ))}
          </ScrollArea>
        ) : (
          links?.map((props) => (
            <LinkButton key={props.href} {...props} isChild />
          ))
        )}
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
          label: name.length >= 25 ? `${name.substring(0, 25)}...` : name,
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
