import { useRouter } from "next/router";

import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";
import { SharedCampaignDetails } from "@/components/core/SharedCampaignDetails";
import { Container } from "@mantine/core";

export const CampaignPreview = () => {
  const router = useRouter();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  return (
    <Container>
      {campaign && <SharedCampaignDetails campaign={campaign} isPreview />}
    </Container>
  );
};
