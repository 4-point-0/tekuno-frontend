import { useRouter } from "next/router";

import { ChoosePayer } from "@/components/admin/Payment/ChoosePayer";

export const Order = () => {
  const router = useRouter();
  const campaingId = router.query.id;
  return (
    <div>
      <ChoosePayer campaignId={campaingId} />
    </div>
  );
};

export default Order;
