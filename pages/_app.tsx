import { AppLayout } from "@/components/layout/AppLayout";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Open_Sans } from "@next/font/google";

const OpenSans = Open_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Tekuno</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          components: {
            Button: {
              defaultProps: {
                radius: "lg",
              },
            },
            Text: {
              defaultProps: {
                component: "p",
                my: 0,
              },
            },
          },
          fontFamily: OpenSans.style.fontFamily,
          headings: { fontFamily: OpenSans.style.fontFamily },
        }}
      >
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </MantineProvider>
    </>
  );
}
