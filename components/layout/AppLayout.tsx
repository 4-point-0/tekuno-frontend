import { RamperProvider } from "@/context/RamperContext";
import { AppShell } from "@mantine/core";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import { AdminHeader } from "../admin/AdminHeader";

import { AdminNavbar } from "../admin/AdminNavbar";
import { ClientFooter } from "../client/ClientFooter";
import { ClientHeader } from "../client/ClientHeader";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const isLogin = router.route.startsWith("/login");
  const isAdmin = router.route.startsWith("/admin");

  const appShell = () => (
    <AppShell
      padding="md"
      navbar={isAdmin ? <AdminNavbar /> : undefined}
      header={
        isAdmin ? <AdminHeader /> : isLogin ? undefined : <ClientHeader />
      }
      footer={
        isAdmin ? undefined : (
          <ClientFooter
            data={[
              {
                title: "Company",
                links: [
                  { label: "About", link: "#" },
                  { label: "Blog", link: "#" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Help Center", link: "#" },
                  { label: "Terms of Service", link: "#" },
                  { label: "Privacy Policy", link: "#" },
                ],
              },
              {
                title: "Connect",
                links: [
                  { label: "Contact", link: "#" },
                  { label: "Newsletter", link: "#" },
                ],
              },
            ]}
          />
        )
      }
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
