import {
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Grid,
  Group,
  Image,
  rem,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { FaEuroSign } from "react-icons/fa";

import {
  useStripeControllerGetProduct,
  useStripeControllerGetProducts,
} from "@/services/api/admin/adminComponents";

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

export const Tokens = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - ${theme.spacing.md} / 2)`;

  // const data = useStripeControllerGetProducts();

  return (
    <Box w="90%" mx="auto" h="100%" ta="center">
      <Box mt="xl">
        <Title fz={40}>Package Selection</Title>
      </Box>
      <Box mt="xl">
        <Title c="dimmed" fz={20}>
          {`We've got the plan that is perfect for you}`}
        </Title>
      </Box>
      <SimpleGrid
        cols={3}
        spacing="md"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        mt="xl"
      >
        {/* <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />
        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />
        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} />
        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={false} /> */}

        <Card
          h={PRIMARY_COL_HEIGHT}
          className={classes.container}
          ta="center"
          radius="lg"
          px="auto"
          py="auto"
        >
          <Box h="85%" mt="md">
            <Title order={1}>Small</Title>

            <Box mx="auto" w="30%" mt="md">
              <Text fz={50} fw={700}>
                10
              </Text>
              <Text fz={20} fw={700}>
                euros
              </Text>
            </Box>
            <Box w="30%" h="30%" mx="auto">
              <Image src={"/images/small.png"}></Image>
            </Box>

            <Box mt="xl">
              <Text c="dimmed">Enough for few small campaigns</Text>
            </Box>
          </Box>
          <Button className={classes.button}>Order Now</Button>
        </Card>
        <Card
          h={PRIMARY_COL_HEIGHT}
          className={classes.container}
          ta="center"
          radius="lg"
        >
          <Box h="85%" mt="md">
            <Title order={1}>Medium</Title>
            <Box mx="auto" w="30%" mt="md">
              <Text fz={50} fw={700}>
                20
              </Text>
              <Text fz={20} fw={700}>
                euros
              </Text>
            </Box>
            <Box w="30%" mx="auto">
              <Image src={"/images/medium.png"}></Image>
            </Box>
            <Box mt="xl">
              <Text c="dimmed">Enough for few medium campaigns</Text>
            </Box>
          </Box>
          <Button className={classes.button}>Order Now</Button>
        </Card>
        <Card
          h={PRIMARY_COL_HEIGHT}
          className={classes.container}
          ta="center"
          radius="lg"
        >
          <Box h="85%" mt="md">
            <Title order={1}>Big</Title>
            <Box mx="auto" w="30%" mt="md">
              <Text fz={50} fw={700}>
                50
              </Text>
              <Text fz={20} fw={700}>
                euros
              </Text>
            </Box>
            <Box w="30%" mx="auto">
              <Image src={"/images/big.png"}></Image>
            </Box>
            <Box mt="xl">
              <Text c="dimmed">Enough for a bigger campaign</Text>
            </Box>
          </Box>
          <Button className={classes.button}>Order Now</Button>
        </Card>
        <Card
          h={PRIMARY_COL_HEIGHT}
          className={classes.container}
          ta="center"
          radius="lg"
        >
          <Box h="85%" mt="md">
            <Title order={1}>Custom</Title>
            <Box mx="auto" w="60%" mt="md">
              <Text fz={50} fw={700}>
                0,5 - 10k
              </Text>
              <Text fz={20} fw={700}>
                euros
              </Text>
            </Box>

            <Box w="30%" mx="auto">
              <Image src={"/images/custom.png"}></Image>
            </Box>

            <Box mt="xl">
              <Text c="dimmed">Custom size campaign</Text>
            </Box>
          </Box>
          <Button className={classes.button}>Order Now</Button>
        </Card>

        {/* <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
        </Grid> */}
      </SimpleGrid>
    </Box>
  );
};

export default Tokens;
