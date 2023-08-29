import {
  Box,
  createStyles,
  SimpleGrid,
  Title,
  useMantineTheme,
} from "@mantine/core";

import PricingCards from "@/components/core/PricingCards/PricingCardsAdmin";
import { useStripeControllerGetProducts } from "@/services/api/admin/adminComponents";

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: "white",
    padding: "2%",
    margin: "2%",
    "&:hover": {
      // backgroundColor: theme.colors.gray[3],
      boxShadow: "2px 0px 63px -9px rgba(0,0,0,0.51)",
      transform: "scale(1.05)",
      transition: "transform 0.3s ease-in-out",
    },
  },
  button: {
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: theme.colors.gray[7],
    },
  },
}));

export const Tokens = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

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
