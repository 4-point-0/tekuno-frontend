import {
  ActionIcon,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { Download, Eye, Pencil } from "tabler-icons-react";

import { StatBox } from "./StatBox";
import { IndigoBadge } from "@/components/core/IndigoBadge";
import { IndigoButton } from "@/components/core/IndigoButton";
import { NFTCard } from "@/components/core/NFTCard";
import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { QRPreview } from "./QRPreview";
import { DownloadAll } from "./DownloadAll";
import { NftDto } from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";
import { StatusButtons } from "./StatusButtons";

const stats = [
  {
    label: "NFTs CLAIMED",
    value: 1342,
    subLabel: "In Total",
  },
  {
    label: "TOTAL SUPPLY",
    value: 10000,
  },
];

const documents = [
  { name: "Money Motion dresscode.pdf" },
  { name: "Money-Motion-Legal.pdf" },
];

function formatDateRange(startDate: string, endDate?: string | null) {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!endDate) {
    return dateTimeFormat.format(dayjs(startDate).toDate());
  }

  return dateTimeFormat.formatRange(
    dayjs(startDate).toDate(),
    dayjs(endDate).toDate()
  );
}

export const CampaignDetails = () => {
  const router = useRouter();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const image = campaign?.files?.find(({ tags }) => tags.includes("image"));

  const documents = campaign?.files?.filter(
    ({ tags }) => !tags.includes("image")
  );

  const reward = campaign?.nfts?.find(
    ({ nft_type: { name } }) => name === "reward"
  );

  const nfts = campaign?.nfts?.filter(
    ({ nft_type: { name } }) => name !== "reward"
  );

  return (
    <Container>
      <Stack>
        <Skeleton visible={isLoading}>
          <Box>
            <Image src={getImageUrl(image)} radius="lg" />
          </Box>
        </Skeleton>

        <Box>
          <Skeleton visible={isLoading}>
            <Title order={2}>{campaign?.name}</Title>
          </Skeleton>
          <Skeleton visible={isLoading}>
            <Text c="dimmed">
              {formatDateRange(
                campaign?.start_date as string,
                campaign?.end_date
              )}
            </Text>
          </Skeleton>
        </Box>

        <Group position="right">
          {campaign?.status !== "Ended" && (
            <>
              <IndigoButton
                component={NextLink}
                href={`${router.query.id}/preview`}
                legacyBehavior
                leftIcon={<Eye size={14} />}
              >
                Preview
              </IndigoButton>
              <Button
                component={NextLink}
                href={`/admin/previous/${router.query.id}/edit`}
                legacyBehavior
                leftIcon={<Pencil size={14} />}
                color="dark"
              >
                Edit
              </Button>
            </>
          )}

          <StatusButtons status={campaign?.status} />
        </Group>

        {campaign?.description && <Text fz="lg">{campaign.description}</Text>}
        {campaign?.additonal_description && (
          <Text fz="sm">{campaign.additonal_description}</Text>
        )}

        {/* <SimpleGrid cols={4}>
          {stats.map((stat) => (
            <StatBox
              key={stat.label}
              value={stat.value}
              label={stat.label}
              subLabel={stat.subLabel}
            />
          ))}
        </SimpleGrid> */}
        {documents?.length !== 0 && (
          <Group position="apart" align="flex-start" noWrap>
            <Group miw={200}>
              <Title order={4}>Project documents</Title>
            </Group>

            <Group position="right">
              {documents?.map((document) => (
                <IndigoBadge
                  key={document.name}
                  size="lg"
                  leftSection={
                    <ActionIcon variant="transparent" color="dark">
                      <Download size={14} />
                    </ActionIcon>
                  }
                >
                  {document.name}
                </IndigoBadge>
              ))}
            </Group>
          </Group>
        )}

        <Group position="apart">
          <Title order={4}>Digital collectibles</Title>
          {campaign && (nfts?.length || 0) > 1 && (
            <DownloadAll campaign={campaign} nfts={nfts as Array<NftDto>} />
          )}
        </Group>

        <Grid>
          {reward && (
            <Grid.Col span={12}>
              <NFTCard nft={reward} />
            </Grid.Col>
          )}

          {nfts?.map((nft) => (
            <React.Fragment key={nft.id}>
              <Grid.Col span={8}>
                <NFTCard key={nft.id} nft={nft} />
              </Grid.Col>
              <Grid.Col span={4}>
                <QRPreview nft={nft} />
              </Grid.Col>
            </React.Fragment>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};
