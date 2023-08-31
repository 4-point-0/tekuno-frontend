import { Box, SimpleGrid, Title } from "@mantine/core";

import PricingCards from "@/components/core/PricingCards/PricingCardsAdmin";
import { useStripeControllerGetProducts } from "@/services/api/admin/adminComponents";

export const Tokens = () => {
  const { data } = useStripeControllerGetProducts({});

  return (
    <Box w="90%" mx="auto" h="100%" ta="center">
      <Box mt="xl">
        <Title fz={40}>Package Selection</Title>
      </Box>
      <Box mt="xl">
        <Title c="dimmed" fz={20}>
          {`We've got the plan that is perfect for you`}
        </Title>
      </Box>
      <SimpleGrid
        cols={3}
        spacing="md"
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "lg", cols: 2 },
        ]}
        mt="xl"
      >
        {data && <PricingCards cards={data?.results} />}
      </SimpleGrid>
    </Box>
  );
};

export default Tokens;