import { RamperProvider } from "@/context/RamperContext";
import { AppShell, Burger, MediaQuery } from "@mantine/core";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useState } from "react";
import { AdminHeader } from "../admin/AdminHeader";

import { AdminNavbar } from "../admin/AdminNavbar";
import { ClientFooter } from "../client/ClientFooter";
import { ClientHeader } from "../client/ClientHeader";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const isRoot = router.route === "/";
  const isLogin = router.route.startsWith("/login");
  const isAdmin = router.route.startsWith("/admin");
  const isClaim = router.route.startsWith("/claim");

  const appShell = () => (
    <AppShell
      padding="md"
      navbar={isAdmin ? <AdminNavbar opened={opened} /> : undefined}
      header={
        isAdmin ? (
          <AdminHeader>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color="#000"
                mr="xl"
              />
            </MediaQuery>
          </AdminHeader>
        ) : isLogin || isRoot ? undefined : (
          <ClientHeader />
        )
      }
      footer={
        isAdmin || isClaim ? undefined : (
          <ClientFooter
            data={[
              {
                title: "Company",
                links: [
                  { label: "About", link: "https://www.tekuno.xyz" },
                  { label: "Blog", link: "https://www.tekuno.xyz" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Help Center", link: "https://www.tekuno.xyz" },
                  {
                    label: "Terms of Service",
                    link: "https://www.tekuno.xyz",
                  },
                  { label: "Privacy Policy", link: "https://www.tekuno.xyz" },
                ],
              },
              {
                title: "Connect",
                links: [
                  { label: "Contact", link: "https://www.tekuno.xyz" },
                  { label: "Newsletter", link: "https://www.tekuno.xyz" },
                ],
              },
            ]}
          />
        )
      }
      navbarOffsetBreakpoint="sm"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          paddingTop: isLogin ? 0 : "md",
        },
      })}
    >
      {children}
    </AppShell>
  );

  return isAdmin ? (
    appShell()
  ) : (
    <>
      <RamperProvider>{appShell()}</RamperProvider>
    </>
  );
};
