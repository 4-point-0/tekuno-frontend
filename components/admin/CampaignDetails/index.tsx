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
import { useRouter } from "next/router";
import React from "react";
import { ExternalLink, Eye, Pencil } from "tabler-icons-react";

import { StatBox } from "./StatBox";
import { IndigoButton } from "@/components/core/IndigoButton";
import { NFTCard } from "@/components/core/NFTCard";
import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { QRPreview } from "./QRPreview";
import { DownloadAll } from "./DownloadAll";
import { NftDto } from "@/services/api/admin/adminSchemas";
import { getImageUrl } from "@/utils/file";
import { StatusButtons } from "./StatusButtons";
import { DownloadBadge } from "@/components/core/DownloadBadge";
import { getCampaignAssets } from "@/utils/campaign";
import { formatDateRange } from "@/utils/date";

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

export const CampaignDetails = () => {
  const router = useRouter();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const { image, documents, reward, nfts } = getCampaignAssets(campaign);

  return (
    <Container>
      <Stack>
        <Skeleton visible={isLoading}>
          <Box>
            <Image src={getImageUrl(image)} radius="lg" alt="" />
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
          {campaign?.status === "Created" && (
            <>
              <IndigoButton
                component="a"
                href={`${location.origin}/admin/previous/${router.query.id}/preview`}
                target="_blank"
                referrerPolicy="no-referrer"
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
          {campaign?.status !== "Created" && (
            <IndigoButton
              component="a"
              href={`${location.origin}/campaign/${router.query.id}`}
              target="_blank"
              referrerPolicy="no-referrer"
              leftIcon={<ExternalLink size={14} />}
            >
              Open campaign
            </IndigoButton>
          )}

          <StatusButtons status={campaign?.status} />
        </Group>

        {campaign?.description && <Text fz="lg">{campaign.description}</Text>}
        {campaign?.additional_description && (
          <Text fz="sm">{campaign.additional_description}</Text>
        )}

        <SimpleGrid display="none" cols={4}>
          {stats.map((stat) => (
            <StatBox
              key={stat.label}
              value={stat.value}
              label={stat.label}
              subLabel={stat.subLabel}
            />
          ))}
        </SimpleGrid>
        {documents?.length !== 0 && (
          <Group position="apart" align="flex-start" noWrap>
            <Group miw={200}>
              <Title order={4}>Project documents</Title>
            </Group>

            <Group position="right">
              {documents?.map((document) => (
                <DownloadBadge key={document.id} document={document} />
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

        <Grid align="center">
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
