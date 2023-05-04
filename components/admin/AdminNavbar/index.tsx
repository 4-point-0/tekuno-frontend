import { Divider, Navbar } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useUserOrganization } from "@/hooks/useUserOrganization";

import { Links } from "./Links";
import { UserButton } from "./UserButton";

interface AdminNavbarProps {
  opened: boolean;
}

export const AdminNavbar = ({ opened }: AdminNavbarProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { hasOrganization } = useUserOrganization(Boolean(session));

  if (router.route.endsWith("preview") || !session) {
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
