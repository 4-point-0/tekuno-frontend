import { Divider, Navbar } from "@mantine/core";
import { useRouter } from "next/router";

import { useUserOrganization } from "@/hooks/useUserOrganization";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

interface AdminNavbarProps {
  opened: boolean;
}

export const AdminNavbar = ({ opened }: AdminNavbarProps) => {
  const router = useRouter();

  const { user, hasOrganization } = useUserOrganization();

  if (router.route.endsWith("preview") || !user) {
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
      {hasOrganization && (
        <>
          <Navbar.Section>
            <Links />
          </Navbar.Section>
          <Divider mt="xl" mb="md" />
        </>
      )}

      <Navbar.Section>
        <UserButton />
      </Navbar.Section>
    </Navbar>
  );
};
