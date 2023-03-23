import {
  Badge,
  Box,
  Group,
  Image,
  Progress,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { PropsWithChildren, useMemo } from "react";

import { ClientContainer } from "@/components/layout/ClientContainer";
import { ClientOnly } from "@/components/layout/ClientOnly";
import { useCollectedNfts } from "@/hooks/useCollectedNfts";
import { useIsClient } from "@/hooks/useIsClient";
import { CampaignDto, NftDto } from "@/services/api/admin/adminSchemas";
import { UserDto } from "@/services/api/client/clientSchemas";
import { getCampaignAssets } from "@/utils/campaign";
import { formatDateRange } from "@/utils/date";
import { getImageUrl } from "@/utils/file";

import { DownloadBadge } from "../DownloadBadge";
import { FormattedHTML } from "../FormattedHTML";
import { NFTCard } from "../NFTCard";

interface ConditionalLinkProps extends PropsWithChildren {
  href: string;
  enabled?: boolean;
}

const ConditionalLink = ({ enabled, href, children }: ConditionalLinkProps) => {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      {children}
    </Link>
  );
};

interface SharedCampaignDetailsProps {
  campaign: CampaignDto;
  user?: UserDto | null;
  isPreview?: boolean;
}

export const SharedCampaignDetails = ({
  campaign,
  user,
  isPreview,
}: SharedCampaignDetailsProps) => {
  const { image, reward, nfts, documents } = getCampaignAssets(campaign);
  const isClient = useIsClient();

  const { isBurned, isCollected, collectedReward, progress } = useCollectedNfts(
    campaign,
    user
  );

  const isNFTCollected = (nft: NftDto) => {
    if (isPreview) {
      return false;
    }

    return isCollected(nft.id);
  };

  const isNFTBurned = (nft: NftDto) => {
    if (isPreview) {
      return false;
    }

    return isBurned(nft.id);
  };

  const hasReward = useMemo(() => {
    if (isPreview) {
      return false;
    }

    return collectedReward;
  }, [isPreview, collectedReward]);

  return (
    <ClientOnly>
      <ClientContainer>
        <Stack>
          <Box>
            <Image
              src={getImageUrl(image)}
              radius="lg"
              alt={campaign.name}
              withPlaceholder
            />
          </Box>

          <Box>
            <Title order={2}>{campaign?.name}</Title>

            <Skeleton visible={!isClient} mih={24.8}>
              <ClientOnly>
                <Text c="dimmed">
                  {formatDateRange(
                    campaign?.start_date as string,
                    campaign?.end_date
                  )}
                </Text>
              </ClientOnly>
            </Skeleton>
          </Box>
          {campaign?.description && (
            <FormattedHTML fz="lg" content={campaign.description} />
          )}
          {campaign?.additional_description && (
            <FormattedHTML fz="sm" content={campaign.additional_description} />
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
                  <DownloadBadge
                    key={document.id}
                    size="sm"
                    document={document}
                  />
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
                    w="228px"
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
      </ClientContainer>
    </ClientOnly>
  );
};
