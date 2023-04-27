import { AppShell, Burger, MediaQuery } from "@mantine/core";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";

import { RamperProvider } from "@/context/RamperContext";

import { AdminHeader } from "../admin/AdminHeader";
import { AdminNavbar } from "../admin/AdminNavbar";
import { ClientFooter } from "../client/ClientFooter";
import { ClientHeader } from "../client/ClientHeader";

export const AppLayout = ({ children }: PropsWithChildren) => {
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
                  { label: "About", link: "https://tekuno.app/about-us/" },
                  { label: "Blog", link: "https://medium.com/@tekuno" },
                ],
              },
              {
                title: "Support",
                links: [
                  {
                    label: "Terms of Service",
                    link: "https://tekuno.app/terms-of-use/",
                  },
                  {
                    label: "Privacy Policy",
                    link: "https://tekuno.app/privacy-policy/",
                  },
                ],
              },
              {
                title: "Connect",
                links: [
                  { label: "Contact", link: "https://medium.com/@tekuno" },
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
