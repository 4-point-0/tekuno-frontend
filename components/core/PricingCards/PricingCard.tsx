import {
  Box,
  Button,
  Card,
  createStyles,
  Image,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";

const PRIMARY_COL_HEIGHT = rem(470);

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: "white",
    padding: "2%",
    margin: "2%",
    // "&:hover": {
    //   boxShadow: "2px 0px 63px -9px rgba(0,0,0,0.51)",
    //   transform: "scale(1.05)",
    //   transition: "transform 0.3s ease-in-out",
    // },
  },
  button: {
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: theme.colors.gray[7],
    },
  },
}));

type CardName = "Small" | "Medium" | "Large" | "Custom";

const CardData: Record<CardName, { image: string; description: string }> = {
  Small: {
    image: "/images/small.png",
    description: "10 Tokens",
  },
  Medium: {
    image: "/images/medium.png",
    description: "20 Tokens",
  },
  Large: {
    image: "/images/large.png",
    description: "50 Tokens",
  },
  Custom: {
    image: "/images/custom.png",
    description: "5 - 10k Tokens",
  },
};

const PricingCard = ({ card, userData }: { card: any; userData: any }) => {
  const { classes } = useStyles();
  const router = useRouter();

  const values = CardData[card.name as CardName];

  return (
    <Card
      withBorder
      h={PRIMARY_COL_HEIGHT}
      className={classes.container}
      ta="center"
      radius="lg"
    >
      <Box mt="md">
        <Title order={1}>{card.name}</Title>
        <Box w={`${card.name === "Custom" ? "25%" : "30%"}`} mx="auto" mt="lg">
          <Image src={values.image} alt={card.name}></Image>
        </Box>
        <Box mx="auto" w={`${card.name === "Custom" ? "70%" : "30%"}`} mt="md">
          <Text fz={card.name === "Custom" ? 40 : 50} fw={700}>
            {card.name === "Custom" ? "0.5 - 10k" : card.price}
          </Text>
          <Text fz={20} fw={700}>
            euros
          </Text>
        </Box>

        <Box mt="md">
          <Text size="lg" c="dimmed">
            {values.description}
          </Text>
        </Box>
      </Box>
      <Button
        mt="md"
        className={classes.button}
        onClick={() =>
          router.push(`${card.payment_url}?client_reference_id=${userData.id}`)
        }
      >
        Order Now
      </Button>
    </Card>
  );
};

export default PricingCard;