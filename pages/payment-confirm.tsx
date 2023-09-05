import {
  AspectRatio,
  Box,
  Center,
  Container,
  Image,
  Text,
} from "@mantine/core";
import { useRouter } from "next/router";

import { IndigoButton } from "@/components/core/IndigoButton";

export const PaymentConfirm = () => {
  const router = useRouter();

  return (
    <Container>
      <Box mt="xl">
        <Text fz={30} fw={700} ta="center">
          Thank You for Your Purchase!
        </Text>
      </Box>
      <AspectRatio ratio={720 / 950} maw={400} mx="auto">
        <Image
          src={"/images/confirm-payment.png"}
          alt="Payment is confirmed"
          radius="xl"
        />
      </AspectRatio>
      <Text fz="lg" ta="center" mt="md">
        We appreciate your support and hope you enjoy your new tokens.
      </Text>
      <Text fz="lg" ta="center" mt="md">
        If you have any questions or need assistance, feel free to contact our
        support team.
      </Text>
      <Center>
        <IndigoButton
          variant="primary"
          size="lg"
          mt="xl"
          onClick={() => {
            const path = localStorage.getItem("tkn_return_path");
            localStorage.removeItem("tkn_return_path");
            router.replace(path || "/");
          }}
        >
          Back to Tekuno
        </IndigoButton>
      </Center>
    </Container>
  );
};

export default PaymentConfirm;
