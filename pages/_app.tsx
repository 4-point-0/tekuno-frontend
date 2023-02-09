import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";

const queryClient = new QueryClient();

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminGuard } from "@/context/AdminGuard";
import { tekunoTheme } from "@/styles/theme";
import { NotificationsProvider } from "@mantine/notifications";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>Tekuno</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <SessionProvider session={session}>
        <AdminGuard>
          <QueryClientProvider client={queryClient}>
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={tekunoTheme}
            >
              <NotificationsProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </NotificationsProvider>
            </MantineProvider>
          </QueryClientProvider>
        </AdminGuard>
      </SessionProvider>
    </>
  );
}
