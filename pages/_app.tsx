"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { registerZkSendWallet } from "@mysten/zksend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout/AppLayout";
import { tekunoTheme } from "@/styles/theme";

const queryClient = new QueryClient();

//TODO: implement ZkLogin
// const ZK_SEND_HOST = window.location.host.includes("localhost")
//   ? "http://localhost:3000"
//   : "https://preview.zksend.com";

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

// registerZkSendWallet("Tekuno", {
//   origin: `https://preview.zksend.com`,
// });

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
              <SuiClientProvider
                networks={networkConfig}
                defaultNetwork="mainnet"
              >
                <WalletProvider autoConnect>
                  <Notifications />
                  <AppLayout>
                    <Component {...pageProps} />
                  </AppLayout>
                </WalletProvider>
              </SuiClientProvider>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
