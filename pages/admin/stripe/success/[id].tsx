import { useRouter } from "next/router";

import { CampaignDetails } from "@/components/admin/CampaignDetails";

import SuccessfullPayment from "../../../../components/admin/SuccessfullPayment";

function SuccessPage() {
  const router = useRouter();

  return (
    <div>
      <SuccessfullPayment />
    </div>
  );
}

export default SuccessPage;
