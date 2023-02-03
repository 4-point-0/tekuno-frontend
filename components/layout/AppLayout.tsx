import { AppShell, Box, Flex, Header, Image, Navbar } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";

import { AdminNavbar } from "../admin/AdminNavbar";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const isAdmin = router.route.startsWith("/admin");

  return (
    <AppShell
      padding="md"
      navbar={
        isAdmin ? (
          <AdminNavbar />
        ) : (
          <Navbar width={{ base: 300 }} height={500} p="xs">
            {router.route}
          </Navbar>
        )
      }
      header={
        <Header height={60} p="xs">
          <Flex align="center" h="100%">
            <Link href={isAdmin ? "/admin" : "/"}>
              <Box w={120}>
                <Image src="/tekuno.svg"></Image>
              </Box>
            </Link>
          </Flex>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
