import { useRouter } from "next/router";

import { ChoosePayer } from "../../../components/admin/Stripe/ChoosePayer";

const Stripe = () => {
  const router = useRouter();

  return (
    <div>
      <ChoosePayer />
    </div>
  );
};

export default Stripe;
