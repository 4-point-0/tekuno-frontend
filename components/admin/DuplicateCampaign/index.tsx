import { Container, Stack } from "@mantine/core";
import { useRouter } from "next/router";

import { useCampaignControllerFindOne } from "@/services/api/admin/adminComponents";

import { DuplicateForm } from "./DuplicateForm";

export const DuplicateCampaign = () => {
  const router = useRouter();

  const { data: campaign, isLoading } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const reward = campaign?.nfts?.find(
    ({ nft_type: { name } }) => name === "reward"
  );

  const nfts = campaign?.nfts?.filter(
    ({ nft_type: { name } }) => name !== "reward"
  );

  return (
    <Container>
      {campaign && (
        <Stack>
          <DuplicateForm campaign={campaign} />
        </Stack>
      )}
    </Container>
  );
};
