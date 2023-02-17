import { Navbar, Divider } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

interface IAdminNavbarProps {
  opened: boolean;
}

export const AdminNavbar: React.FC<IAdminNavbarProps> = ({ opened }) => {
  const router = useRouter();

  if (router.route.endsWith("preview")) {
    return null;
  }

  return (
    <Navbar
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ base: 300 }}
      px="sm"
      py="md"
    >
      <Navbar.Section>
        <Links />
      </Navbar.Section>

      <Divider mt="xl" mb="md" />

      <Navbar.Section>
        <UserButton />
      </Navbar.Section>
    </Navbar>
  );
};
