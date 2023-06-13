import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect } from "react";

import PaymentForm from "../../../../components/admin/Stripe/PaymentForm";
import { ClientContainer } from "../../../../components/layout/ClientContainer";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = React.useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "minimal",
    variables: {
      marginTop: "20px",
    },
    labels: "floating",
  };

  // const appearance = {
  //   theme: "stripe",
  //   variables: {
  //     fontFamily: ' "Gill Sans", sans-serif',
  //     fontLineHeight: "1.5",
  //     borderRadius: "10px",
  //     colorBackground: "#F6F8FA",
  //     colorPrimaryText: "#262626",
  //   },
  //   rules: {
  //     ".Block": {
  //       backgroundColor: "var(--colorBackground)",
  //       boxShadow: "none",
  //       padding: "12px",
  //     },
  //     ".Input": {
  //       padding: "12px",
  //     },
  //     ".Input:disabled, .Input--invalid:disabled": {
  //       color: "lightgray",
  //     },
  //     ".Tab": {
  //       padding: "10px 12px 8px 12px",
  //       border: "none",
  //     },
  //     ".Tab:hover": {
  //       border: "none",
  //       boxShadow:
  //         "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
  //     },
  //     ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
  //       border: "none",
  //       backgroundColor: "#fff",
  //       boxShadow:
  //         "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
  //     },
  //     ".Label": {
  //       fontWeight: "500",
  //     },
  //   },
  // };

  const options: any = {
    clientSecret,
    appearance,
    paymentMethodCreation: "manual",
  };

  return (
    <div className="App">
      <ClientContainer>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
      </ClientContainer>
    </div>
  );
}
