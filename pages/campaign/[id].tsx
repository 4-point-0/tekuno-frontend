import React from "react";
import { GetServerSideProps, NextPage } from "next";

import { SharedCampaignDetails } from "@/components/core/SharedCampaignDetails";
import { fetchCampaignUserControllerFindOne } from "@/services/api/client/clientComponents";
import { useRamper } from "@/context/RamperContext";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { ClientContainer } from "@/components/layout/ClientContainer";
import { NextSeo } from "next-seo";
import { getCampaignAssets } from "@/utils/campaign";

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

  const { image } = getCampaignAssets(campaign);

  return (
    <>
      <NextSeo
        title={`Tekuno - ${campaign?.name}`}
        description={campaign?.description || undefined}
        openGraph={{
          siteName: "Tekuno",
          title: campaign?.name,
          description: campaign?.description || undefined,
          images: image?.url ? [{ url: image.url }] : [],
        }}
      />
      <ClientContainer>
        {campaign && <SharedCampaignDetails campaign={campaign} user={user} />}
      </ClientContainer>
    </>
  );
};

export default Campaign;
