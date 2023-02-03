import React from "react";
import {
  Button,
  Stack,
  ThemeIcon,
  createStyles,
  Box,
  Collapse,
} from "@mantine/core";
import { CirclePlus, Clock, Icon } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useRouter } from "next/router";

interface IButtonProps {
  active: boolean;
  child: boolean;
}

const useStlyes = createStyles((theme, { active, child }: IButtonProps) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    borderRadius: "4px",
    backgroundColor: active ? theme.colors.blue[0] : undefined,
  },
  label: {
    color: active ? undefined : theme.colors.dark,
    fontWeight: "normal",
  },
  leftIcon: {
    paddingLeft: child ? 30 : undefined,
  },
}));

interface ILinkButtonProps {
  label: string;
  href: string;
  isChild?: boolean;
  Icon?: Icon;
  color?: string;
  links?: Array<ILinkButtonProps>;
}

export const LinkButton: React.FC<ILinkButtonProps> = ({
  href,
  label,
  Icon,
  links,
  color,
  isChild,
}) => {
  const router = useRouter();
  const isOpen = router.asPath.startsWith(href);
  const isActive = router.asPath === href;
  const { classes } = useStlyes({ active: isActive, child: Boolean(isChild) });

  console.log(isActive, label, router.asPath, href);

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
            <ThemeIcon size={26} variant="light">
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
