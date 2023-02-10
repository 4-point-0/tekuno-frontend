import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { AppLayout } from "@/components/layout/AppLayout";
import { tekunoTheme } from "@/styles/theme";
import { AdminGuard } from "@/context/AdminGuard";
import { ModalsProvider } from "@mantine/modals";

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
              <ModalsProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </ModalsProvider>
            </MantineProvider>
          </QueryClientProvider>
        </AdminGuard>
      </SessionProvider>
    </>
  );
}
