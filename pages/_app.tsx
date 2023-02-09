import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import { AppLayout } from "@/components/layout/AppLayout";
import { tekunoTheme } from "@/styles/theme";

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
        <MantineProvider withGlobalStyles withNormalizeCSS theme={tekunoTheme}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
