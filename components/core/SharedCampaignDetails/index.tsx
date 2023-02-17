import React from "react";
import {
  Box,
  Stack,
  Image,
  Text,
  Title,
  Group,
  Badge,
  Progress,
} from "@mantine/core";

import { CampaignDto, NftDto } from "@/services/api/admin/adminSchemas";
import { getCampaignAssets } from "@/utils/campaign";
import { getImageUrl } from "@/utils/file";
import { formatDateRange } from "@/utils/date";
import { NFTCard } from "../NFTCard";
import { UserNftDto } from "@/services/api/client/clientSchemas";
import { useIsClient } from "@/hooks/useIsClient";
import { DownloadBadge } from "../DownloadBadge";

interface ICampaignDetailsProps {
  campaign: CampaignDto;
  collectedNfts?: Array<NftDto | UserNftDto>;
}

export const SharedCampaignDetails: React.FC<ICampaignDetailsProps> = ({
  campaign,
  collectedNfts = [],
}) => {
  const { image, reward, nfts, documents } = getCampaignAssets(campaign);
  const isClient = useIsClient();

  const isCollected = (nft: NftDto) => {
    return collectedNfts.some((collected) => {
      if ("id" in collected) {
        return collected.id === nft.id;
      }

      if ("nft_id" in collected) {
        return collected.nft_id === nft.id;
      }
    });
  };

  const progress =
    collectedNfts.length > 0 ? (nfts?.length || 0) / collectedNfts.length : 0;

  return (
    <Stack>
      <Box>
        <Image src={getImageUrl(image)} radius="lg" />
      </Box>

      <Box>
        <Title order={2}>{campaign?.name}</Title>
        <Text c="dimmed">
          {isClient &&
            formatDateRange(campaign?.start_date as string, campaign?.end_date)}
        </Text>
      </Box>

      {campaign?.description && <Text fz="lg">{campaign.description}</Text>}
      {campaign?.additional_description && (
        <Text fz="sm">{campaign.additional_description}</Text>
      )}

      <Group>
        <Badge size="lg" variant="filled" color="grape">
          {nfts?.length === 1 ? "1 Item" : `${nfts?.length} Items`} to collect
        </Badge>
      </Group>

      {documents?.length !== 0 && (
        <>
          <Title order={3}>Project documents</Title>

          <Group>
            {documents?.map((document) => (
              <DownloadBadge key={document.id} size="xl" document={document} />
            ))}
          </Group>
        </>
      )}

      <Title order={3}>Digital collectibles</Title>

      <Stack>
        {reward && (
          <NFTCard nft={reward} isCollected={progress === 1}>
            <Progress
              maw={228}
              color="violet"
              size="lg"
              radius="lg"
              value={progress * 100}
            />
          </NFTCard>
        )}
        {nfts?.map((nft) => (
          <NFTCard key={nft.file.id} nft={nft} isCollected={isCollected(nft)} />
        ))}
      </Stack>
    </Stack>
  );
};
