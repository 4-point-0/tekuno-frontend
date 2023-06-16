// import {
//   LinkAuthenticationElement,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { Button } from "@stripe/ui-extension-sdk/ui";
// import React from "react";
// import OrderDetails from "./OrderDetails";
// export default function Payment() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [email, setEmail] = React.useState("");
//   const [message, setMessage] = React.useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   React.useEffect(() => {
//     if (!stripe) {
//       return;
//     }
//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );
//     if (!clientSecret) {
//       return;
//     }
//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent?.status) {
//         case "succeeded":
//           setMessage("Payment succeeded!");
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     });
//   }, [stripe]);
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }
//     setIsLoading(true);
//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Make sure to change this to your payment completion page
//         return_url: "http://localhost:3000/admin/stripe/success",
//       },
//     });
//     // This point will only be reached if there is an immediate error when
//     // confirming the payment. Otherwise, your customer will be redirected to
//     // your `return_url`. For some payment methods like iDEAL, your customer will
//     // be redirected to an intermediate site first to authorize the payment, then
//     // redirected to the `return_url`.
//     if (error.type === "card_error" || error.type === "validation_error") {
//       setMessage(error.message);
//     } else {
//       setMessage("An unexpected error occurred.");
//     }
//     setIsLoading(false);
//   };
//   const paymentElementOptions = {
//     layout: "tabs",
//   };
//   return (
//     <>
//       <OrderDetails orderCompleted={true} />
//       <form id="payment-form" onSubmit={handleSubmit}>
//         <LinkAuthenticationElement
//           id="link-authentication-element"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <PaymentElement id="payment-element" options={paymentElementOptions} />
//         <button disabled={isLoading || !stripe || !elements} id="submit">
//           <span id="button-text">
//             {isLoading ? (
//               <div className="spinner" id="spinner"></div>
//             ) : (
//               "Pay now"
//             )}
//           </span>
//         </button>
//         {/* Show any error or success messages */}
//         {message && <div id="payment-message">{message}</div>}
//       </form>
//     </>
//   );
// }
//--------------------------------------------------------
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
import OrderDetails from "./OrderDetails";

export default function CheckoutForm() {
  const stripe: any = useStripe();
  const elements: any = useElements();

  const router = useRouter();

  const { data: session } = useSession();

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [mail, setMail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    if (response.error) {
      // Show error from server on payment form
    } else if (response.status === "requires_action") {
      // Use Stripe.js to handle the required next action
      const { error, paymentIntent } = await stripe.handleNextAction({
        clientSecret: response.clientSecret,
      });

      if (error) {
        // Show error from Stripe.js in payment form
      } else {
        // Actions handled, show success message
      }
    } else {
      // No actions needed, show success message
      setSuccessMessage("Success!");
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
