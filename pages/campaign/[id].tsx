import React from "react";
import { GetServerSideProps, NextPage } from "next";

import { SharedCampaignDetails } from "@/components/core/SharedCampaignDetails";
import {
  fetchCampaignUserControllerFindOne,
  useNftControllerFindAll,
} from "@/services/api/client/clientComponents";
import { useRamper } from "@/context/RamperContext";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { ClientContainer } from "@/components/layout/ClientContainer";

interface IClaimPageProps {
  campaign?: CampaignDto;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const campaignId = ctx.query.id as string;

  try {
    const campaign = await fetchCampaignUserControllerFindOne({
      pathParams: { campaignId },
    });

    return { props: { campaign } };
  } catch {
    return {
      notFound: true,
    };
  }
};

export const Campaign: NextPage<IClaimPageProps> = ({ campaign }) => {
  const { user } = useRamper();

  const { data: nfts } = useNftControllerFindAll(
    {
      queryParams: {
        account_id: user?.profile?.wallet_address as string,
        campaign_id: campaign?.id,
      },
    },
    {
      enabled: Boolean(user?.profile?.wallet_address),
    }
  );

  return (
    <ClientContainer>
      {campaign && (
        <SharedCampaignDetails
          campaign={campaign}
          collectedNfts={nfts?.results || []}
        />
      )}
    </ClientContainer>
  );
};

export default Campaign;
