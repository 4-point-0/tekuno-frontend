import { CampaignDetails } from "@/components/admin/CampaignDetails";
import { getUserServerSideProps } from "@/utils/auth";

export default function ManageCampaign() {
  return <CampaignDetails />;
}

export const getServerSideProps = getUserServerSideProps({
  organizationRequired: true,
});
