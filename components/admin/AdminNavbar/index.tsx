import { Navbar, Divider } from "@mantine/core";
import React from "react";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

export const AdminNavbar = () => {
  return (
    <Navbar width={{ base: 300 }} px="sm" py="md">
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
