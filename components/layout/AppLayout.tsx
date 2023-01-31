import { AppShell, Header, Navbar, Title } from "@mantine/core";
import React, { PropsWithChildren } from "react";

export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} p="xs">
          Navbar
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Title order={1}>Tekuno</Title>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};
