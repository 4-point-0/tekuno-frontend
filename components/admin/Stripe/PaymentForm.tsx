import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useOrderControllerFindOne } from "../../../services/api/admin/adminComponents";
import { notifications } from "../../../utils/notifications";
import OrderDetails from "./OrderDetails";

export default function CheckoutForm() {
  const stripe: any = useStripe();
  const elements: any = useElements();

  const router = useRouter();

  const { data: session } = useSession();

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [mail, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error: any) => {
    setIsLoading(false);
    setErrorMessage(error.message);
  };

  const { data: order } = useOrderControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });

  const handleServerResponse = async (response: any) => {
    notifications.create({ title: "Processing payment" });

    if (response.statusCode !== 200) {
      notifications.error({
        title: "Payment Error",
        message: response.message,
      });

      setTimeout(() => {
        router.push(`admin/previous/${router.query.id}`);
      }, 4000);
    } else {
      notifications.success({
        title: "Payment Success",
        message: "Payment processed successfully!",
      });
    }
  };

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the PaymentMethod using the details collected by the Payment Element
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          email: mail,
        },
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    // Create the PaymentIntent
    // TODO: Needs to be implemented in adminComponents file
    const res = await fetch(
      "https://api-dev.tekuno.app/api/v1/payment/create-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          order_id: `${order?.order_id}`,
        }),
      }
    );

    const data = await res.json();

    if (data.status === "succeeded") {
      router.push("/admin/stripe/success");
    }

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <OrderDetails orderCompleted={true} />
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement id="payment-element" />
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className=""
          style={{
            padding: "10px 20px",
            margin: "2% 0 ",
            borderRadius: "45px",
            color: "white",
            background: "black",
            border: "none",
            cursor:
              isLoading || !stripe || !elements ? "not-allowed" : "pointer",
            opacity: isLoading || !stripe || !elements ? 0.6 : 1,
          }}
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
