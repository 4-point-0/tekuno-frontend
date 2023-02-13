import { useRamper } from "@/context/RamperContext";
import { Box, Button, Container, Image, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const isBigScreen = useMediaQuery("(min-width: 900px)");
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
  }, [router, user]);

  return (
    <Container>
      <Stack align={"center"}>
        <Box
          sx={{
            width: isBigScreen ? "50vw" : "100vw",
          }}
        >
          <Image
            fit="contain"
            src="/login-gradient.svg"
            alt="Half circle with gradient"
          />
        </Box>
        <Image
          mt={isBigScreen ? 80 : 40}
          src="/tekuno.svg"
          width={300}
          alt="Tekuno logo"
        />
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
    </Container>
  );
}
