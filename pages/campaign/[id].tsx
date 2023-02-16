import { Container, Paper } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { SharedCampaignDetails } from "@/components/core/SharedCampaignDetails";
import { useNftControllerFindAll } from "@/services/api/client/clientComponents";
import { useRamper } from "@/context/RamperContext";

export default function Campaign() {
  const router = useRouter();
  const { user } = useRamper();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: { id: router.query.id as string },
  });

  const { data: nfts } = useNftControllerFindAll(
    {
      queryParams: {
        account_id: user?.profile?.wallet_address as string,
        campaign_id: router.query.id as string,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address),
    }
  );

  return (
    <Container>
      <Paper>
        {campaign && (
          <SharedCampaignDetails
            campaign={campaign}
            collectedNfts={nfts?.results || []}
          />
        )}
      </Paper>
    </Container>
  );
}
