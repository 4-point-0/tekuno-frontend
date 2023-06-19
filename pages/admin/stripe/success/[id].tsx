import { useRouter } from "next/router";

import { CampaignDetails } from "@/components/admin/CampaignDetails";

import Success from "../../../../components/admin/Success";

function SuccessPage() {
    const router = useRouter();


  return (
    <div>
      <Success />
    </div>
  );
}

export default SuccessPage;
