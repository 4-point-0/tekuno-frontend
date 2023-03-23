import { useMemo } from "react";

import { useNftControllerFindAll } from "@/services/api/client/clientComponents";
import {
  CampaignDto,
  UserDto,
  UserNftDto,
} from "@/services/api/client/clientSchemas";
import { getCampaignAssets } from "@/utils/campaign";

function toRecord(nfts?: UserNftDto[]) {
  return nfts?.reduce((record, nft) => {
    record[nft.nft_id] = true;

    return record;
  }, {} as Record<string, boolean>);
}

export function useCollectedNfts(campaign: CampaignDto, user?: UserDto | null) {
  const { reward, nfts } = getCampaignAssets(campaign);

  const { data: userNfts } = useNftControllerFindAll(
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

  const collectedWithoutReward = userNfts?.results.filter(({ nft_id }) => {
    return nft_id !== reward?.id;
  });

  const progress = useMemo(() => {
    if (!collectedWithoutReward) {
      return 0;
    }

    return collectedWithoutReward.length > 0
      ? collectedWithoutReward.length / (nfts?.length || 1)
      : 0;
  }, [collectedWithoutReward, userNfts]);

  const collected = toRecord(userNfts?.results);
  const burned = toRecord(
    userNfts?.results.filter(({ is_burned }) => is_burned)
  );

  const isCollected = (nftId: string) => {
    if (!userNfts) {
      return;
    }

    return Boolean(collected?.[nftId]);
  };

  const isBurned = (nftId: string) => {
    if (!userNfts) {
      return;
    }

    return Boolean(burned?.[nftId]);
  };

  return {
    progress,
    isCollected,
    isBurned,
    collectedReward: userNfts?.results.some(({ nft_id }) => {
      return nft_id === reward?.id;
    }),
  };
}
