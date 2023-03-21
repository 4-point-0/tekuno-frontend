import { useRouter } from "next/router";
import {
  Alert,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

import { NFTCard } from "@/components/core/NFTCard";
import { EditForm } from "./EditForm";
import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { Fragment } from "react";

export const EditCampaign = () => {
  const router = useRouter();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const reward = campaign?.nfts?.find(
    ({ nft_type: { name } }) => name === "reward"
  );

  const nfts = campaign?.nfts?.filter(
    ({ nft_type: { name } }) => name !== "reward"
  );

  return (
    <Container>
      {campaign && (
        <Stack>
          <EditForm campaign={campaign} />

          <Group mt={72} position="center">
            <Alert
              icon={<AlertCircle color="#000" size={14} />}
              color="pink"
              radius="md"
              bg="pink.2"
            >
              <Text color="dark" fw={600}>
                POD data cannot be changed
              </Text>
            </Alert>
          </Group>

          <Title order={3}>Digital collectibles</Title>

          <Grid>
            {reward && (
              <Grid.Col span={12}>
                <NFTCard nft={reward} />
              </Grid.Col>
            )}

            {nfts?.map((nft) => (
              <Fragment key={nft.id}>
                <Grid.Col span={8}>
                  <NFTCard key={nft.id} nft={nft} />
                </Grid.Col>
                <Grid.Col span={4}></Grid.Col>
              </Fragment>
            ))}
          </Grid>
        </Stack>
      )}
    </Container>
  );
};
