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
        <UserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name="Ann Nullpointer"
          email="anullpointer@yahoo.com"
        />
      </Navbar.Section>
    </Navbar>
  );
};
