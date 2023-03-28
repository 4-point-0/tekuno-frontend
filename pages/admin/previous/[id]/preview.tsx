import { CampaignPreview } from "@/components/admin/CampaignPreview";
import { getUserServerSideProps } from "@/utils/organization";

export default function PreviewCampaign() {
  return <CampaignPreview />;
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: true,
});
