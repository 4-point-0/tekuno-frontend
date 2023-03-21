import { Container } from "@mantine/core";
import { useRouter } from "next/router";

import { SharedCampaignDetails } from "@/components/core/SharedCampaignDetails";
import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";

export const CampaignPreview = () => {
  const router = useRouter();

  const { data: campaign } = useCampaignControllerFindOne({
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
