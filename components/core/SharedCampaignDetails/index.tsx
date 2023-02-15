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

interface ICampaignDetailsProps {
  campaign: CampaignDto;
  collectedNfts?: Array<NftDto>;
}

export const SharedCampaignDetails: React.FC<ICampaignDetailsProps> = ({
  campaign,
  collectedNfts = [],
}) => {
  const { image, reward, nfts } = getCampaignAssets(campaign);

  const isCollected = (nft: NftDto) => {
    return collectedNfts.some(({ id }) => id === nft.id);
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
          {formatDateRange(campaign?.start_date as string, campaign?.end_date)}
        </Text>
      </Box>

      {campaign?.description && <Text fz="lg">{campaign.description}</Text>}
      {campaign?.additonal_description && (
        <Text fz="sm">{campaign.additonal_description}</Text>
      )}

      <Group>
        <Badge size="lg" variant="filled" color="grape">
          {nfts?.length === 1 ? "1 Item" : `${nfts?.length} Items`} to collect
        </Badge>
      </Group>

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
          <NFTCard key={nft.id} nft={nft} isCollected={isCollected(nft)} />
        ))}
      </Stack>
    </Stack>
  );
};
