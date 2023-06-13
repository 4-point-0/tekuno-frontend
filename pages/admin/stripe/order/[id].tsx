import { useRouter } from "next/router";

import OrderDetails from "../../../../components/admin/Stripe/OrderDetails";

const Order = () => {
  const router = useRouter();
  return (
    <div>
      <OrderDetails campaignId={router.query.id} orderCompleted={false} />
    </div>
  );
};

export default Order;
