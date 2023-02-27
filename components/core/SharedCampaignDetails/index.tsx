import React, { PropsWithChildren, useMemo } from "react";
import {
  Box,
  Stack,
  Image,
  Text,
  Title,
  Group,
  Badge,
  Progress,
  Skeleton,
} from "@mantine/core";

import { CampaignDto, NftDto } from "@/services/api/admin/adminSchemas";
import { getCampaignAssets } from "@/utils/campaign";
import { getImageUrl } from "@/utils/file";
import { formatDateRange } from "@/utils/date";
import { NFTCard } from "../NFTCard";
import { UserDto } from "@/services/api/client/clientSchemas";
import { useIsClient } from "@/hooks/useIsClient";
import { DownloadBadge } from "../DownloadBadge";
import { useNftControllerFindAll } from "@/services/api/client/clientComponents";
import Link from "next/link";

interface IConditionalLinkProps extends PropsWithChildren {
  href: string;
  enabled?: boolean;
}

const ConditionalLink: React.FC<IConditionalLinkProps> = ({
  enabled,
  href,
  children,
}) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  );
};

interface ICampaignDetailsProps {
  campaign: CampaignDto;
  user?: UserDto | null;
  isPreview?: boolean;
}

export const SharedCampaignDetails: React.FC<ICampaignDetailsProps> = ({
  campaign,
  user,
  isPreview,
}) => {
  const { image, reward, nfts, documents } = getCampaignAssets(campaign);
  const isClient = useIsClient();

  const { data: collectedNfts, isLoading } = useNftControllerFindAll(
    {
      queryParams: {
        account_id: user?.profile?.wallet_address as string,
        campaign_id: campaign?.id,
        limit: campaign?.nfts?.length,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address),
    }
  );

  const collectedWithoutReward = collectedNfts?.results.filter(({ nft_id }) => {
    return nft_id !== reward?.id;
  });

  const isNFTCollected = (nft: NftDto) => {
    if (isPreview) {
      return false;
    }

    return collectedNfts?.results.some(({ nft_id }) => {
      return nft_id === nft.id;
    });
  };

  const isNFTBurned = (nft: NftDto) => {
    if (isPreview) {
      return false;
    }

    return collectedNfts?.results.find(({ nft_id }) => {
      return nft_id === nft.id;
    })?.is_burned;
  };

  const hasReward = useMemo(() => {
    if (isPreview) {
      return false;
    }

    if (!reward) {
      return false;
    }

    return collectedNfts?.results.some(({ nft_id }) => {
      return nft_id === reward.id;
    });
  }, [collectedNfts, reward, isPreview]);

  const progress = useMemo(() => {
    if (!collectedWithoutReward) {
      return 0;
    }

    return collectedWithoutReward.length > 0
      ? collectedWithoutReward.length / (nfts?.length || 1)
      : 0;
  }, [collectedWithoutReward, nfts]);

  return (
    <Stack>
      <Box>
        <Image src={getImageUrl(image)} radius="lg" alt={campaign.name} />
      </Box>

      <Box>
        <Title order={2}>{campaign?.name}</Title>

        <Skeleton visible={!isClient} mih={24.8}>
          <Text c="dimmed">
            {isClient &&
              formatDateRange(
                campaign?.start_date as string,
                campaign?.end_date
              )}
          </Text>
        </Skeleton>
      </Box>

      {campaign?.description && <Text fz="lg">{campaign.description}</Text>}
      {campaign?.additional_description && (
        <Text fz="sm">{campaign.additional_description}</Text>
      )}

      <Group>
        <Badge size="lg" variant="filled" color="grape">
          {nfts?.length === 1 ? "1 Item" : `${nfts?.length} Items`} in
          collection
        </Badge>
      </Group>

      {documents?.length !== 0 && (
        <>
          <Title order={3}>Documents</Title>

          <Group>
            {documents?.map((document) => (
              <DownloadBadge key={document.id} size="sm" document={document} />
            ))}
          </Group>
        </>
      )}

      <Title order={3}>Digital collectibles</Title>

      <Stack>
        {reward && (
          <ConditionalLink
            href={`/collectibles/${reward.id}`}
            enabled={hasReward}
          >
            <NFTCard nft={reward} isCollected={hasReward}>
              <Progress
                maw={228}
                color="violet"
                size="lg"
                radius="lg"
                value={progress * 100}
              />
            </NFTCard>
          </ConditionalLink>
        )}
        {nfts?.map((nft) => (
          <ConditionalLink
            key={nft.id}
            href={`/collectibles/${nft.id}`}
            enabled={isNFTCollected(nft)}
          >
            <NFTCard
              nft={nft}
              isCollected={isNFTCollected(nft)}
              isBurned={isNFTBurned(nft)}
            />
          </ConditionalLink>
        ))}
      </Stack>
    </Stack>
  );
};
