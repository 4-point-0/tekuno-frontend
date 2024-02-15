import {
  Box,
  Button,
  Container,
  Image,
  MediaQuery,
  Stack,
} from "@mantine/core";
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useNetwork } from "@/context/NetworkContext";

export default function Login() {
  const { signIn, loading, user, signInSuiUser } = useNetwork();
  const currentAccount = useCurrentAccount();

  const router = useRouter();

  const suiAddress = useCurrentAccount()?.address;

  const { redirect } = router.query;

  useEffect(() => {
    if (user) {
      if (redirect) {
        router.push(redirect as string);
      } else {
        router.push("/");
      }
    }
  }, [router, user, redirect]);

  useEffect(() => {
    if (suiAddress) {
      signInSuiUser();
    }
  }, [suiAddress]);

  return (
    <Container>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Stack align={"center"}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <Image fit="contain" src="/login-gradient.svg" alt="" />
          </Box>
          <Image mt={40} src="/tekuno.svg" width={300} alt="Tekuno logo" />
          <Button
            loading={loading}
            variant={"default"}
            onClick={signIn}
            size={"md"}
            mt={"7%"}
          >
            <>
              <Image
                src={"/logo/near-logo.svg"}
                width={20}
                style={{ marginRight: 8 }}
                alt="Connect Icon"
              />
              {"Connect to Tekuno with NEAR"}
            </>
          </Button>
          <ConnectModal
            trigger={
              <Button loading={loading} variant="default" size="md">
                {currentAccount ? (
                  "Connecting to Tekuno"
                ) : (
                  <>
                    <Image
                      src={"/logo/sui-logo.svg"}
                      width={20}
                      style={{ marginRight: 8 }}
                      alt="Connect Icon"
                    />
                    {"Connect to Tekuno with SUI"}
                  </>
                )}
              </Button>
            }
          />
        </Stack>
      </MediaQuery>

      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <Stack align={"center"}>
          <Box
            sx={{
              width: "50vw",
            }}
          >
            <Image fit="contain" src="/login-gradient.svg" alt="" />
          </Box>
          <Image mt={80} src="/tekuno.svg" width={300} alt="Tekuno logo" />
          <Button
            loading={loading}
            variant={"default"}
            onClick={signIn}
            size={"md"}
            mt={"7%"}
            style={{ width: "35%" }}
          >
            <>
              <Image
                src={"/logo/near-logo.svg"}
                width={18}
                style={{ marginRight: 10 }}
                alt="Connect Icon"
              />
              {"Connect to Tekuno with NEAR"}
            </>
          </Button>
          <ConnectModal
            trigger={
              <Button
                loading={loading}
                variant="default"
                size={"md"}
                style={{ width: "35%" }}
              >
                {currentAccount ? (
                  "Connecting to Tekuno"
                ) : (
                  <>
                    <Image
                      src={"/logo/sui-logo.svg"}
                      width={20}
                      style={{ marginRight: 8 }}
                      alt="Connect Icon"
                    />
                    {"Connect to Tekuno with SUI"}
                  </>
                )}
              </Button>
            }
          />
        </Stack>
      </MediaQuery>
    </Container>
  );
}
