import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminGuard } from "@/context/AdminGuard";
import { tekunoTheme } from "@/styles/theme";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  const isAdminPages = router.route.startsWith("/admin");
  const isCampaignPages = router.route.startsWith("/campaign");
  return (
    <>
      <Head>
        <title>Tekuno</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {!isCampaignPages && <meta name="robots" content="noindex" />}
      </Head>

      <SessionProvider session={session}>
        <AdminGuard>
          <QueryClientProvider client={queryClient}>
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={
                isAdminPages
                  ? tekunoTheme
                  : { ...tekunoTheme, primaryColor: "violet" }
              }
            >
              <ModalsProvider>
                <Notifications />
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
