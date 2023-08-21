import {
  Box,
  Button,
  Card,
  createStyles,
  Image,
  Loader,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { fetchAdminControllerFindMe } from "../../../services/api/admin/adminComponents";

const PRIMARY_COL_HEIGHT = rem(470);

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

type CardName = "Small" | "Medium" | "Large" | "Custom";

const CardData: Record<CardName, { image: string; description: string }> = {
  Small: {
    image: "/images/small.png",
    description: "Enough for few small campaigns",
  },
  Medium: {
    image: "/images/medium.png",
    description: "Enough for a medium campaign",
  },
  Large: {
    image: "/images/large.png",
    description: "Enough for a large campaign",
  },
  Custom: {
    image: "/images/custom.png",
    description: "Custom size campaign",
  },
};

export const PricingCards = ({ cards }: any) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchAdminControllerFindMe({});
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return <Loader />;
  }

  console.log("userId", userData);

  return (
    <>
      {cards.map((card: any, index: number) => {
        const values = CardData[card.name as CardName];
        return (
          <Card
            key={index}
            h={PRIMARY_COL_HEIGHT}
            className={classes.container}
            ta="center"
            radius="lg"
          >
            <Box h="85%" mt="md">
              <Title order={1}>{card.name}</Title>
              <Box
                mx="auto"
                w={`${card.name === "Custom" ? "70%" : "30%"}`}
                mt="md"
              >
                <Text fz={card.name === "Custom" ? 40 : 50} fw={700}>
                  {card.name === "Custom" ? "0.5 - 10k" : card.price / 100}
                </Text>
                <Text fz={20} fw={700}>
                  euros
                </Text>
              </Box>
              <Box w={`${card.name === "Custom" ? "25%" : "30%"}`} mx="auto">
                <Image src={values.image}></Image>
              </Box>
              <Box mt="xl">
                <Text c="dimmed">{values.description}</Text>
              </Box>
            </Box>
            <Button
              className={classes.button}
              onClick={() =>
                router.push(
                  `${card.payment_url}?client_reference_id=${userData.id}`
                )
              }
            >
              Order Now
            </Button>
          </Card>
        );
      })}
    </>
  );
};

export default PricingCards;
