import { useRouter } from "next/router";

import { ChoosePayer } from "../../../components/admin/Stripe/ChoosePayer";

const Stripe = () => {
  const router = useRouter();

  return (
    <div>
      <ChoosePayer campaignId={router.query.id} />
    </div>
  );
};

export default Stripe;
