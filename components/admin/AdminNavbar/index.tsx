import { Divider, Navbar } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

interface AdminNavbarProps {
  opened: boolean;
}

export const AdminNavbar = ({ opened }: AdminNavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (router.route.endsWith("preview") || !session?.user) {
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
