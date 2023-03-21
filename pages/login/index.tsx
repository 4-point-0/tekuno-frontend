import {
  Box,
  Button,
  Container,
  Image,
  MediaQuery,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useRamper } from "@/context/RamperContext";

export default function Login() {
  const { signIn, loading, user } = useRamper();
  const router = useRouter();

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
            mt={"lg"}
            variant="filled"
            color="dark"
            radius={"xl"}
            size="lg"
            onClick={signIn}
          >
            Connect to Tekuno
          </Button>
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
            mt={"lg"}
            variant="filled"
            color="dark"
            radius={"xl"}
            size="lg"
            onClick={signIn}
          >
            Connect to Tekuno
          </Button>
        </Stack>
      </MediaQuery>
    </Container>
  );
}
