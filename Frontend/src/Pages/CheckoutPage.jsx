import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2, CheckCircle } from "lucide-react";
import {
  fetchOrderForCheckout,
  processPaypalPayment,
  clearOrderState,
} from "../state/checkoutSlice/checkoutSlice";

const LoadingIndicator = () => (
  <div className="text-center py-20">
    <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
  </div>
);

const PaidOrderMessage = () => (
  <div className="text-center py-20 flex flex-col items-center">
    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
    <h1 className="text-2xl font-bold">This order has already been paid.</h1>
  </div>
);

const OrderSummarySection = ({ order }) => (
  <div className="space-y-4 border-b pb-4 mb-6">
    <div className="flex justify-between">
      <span className="text-gray-600">Order ID:</span>{" "}
      <span className="font-mono">{order.oid}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Name:</span>{" "}
      <strong>{order.full_name}</strong>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Email:</span>{" "}
      <strong>{order.email}</strong>
    </div>
    <div className="flex justify-between text-xl font-bold">
      <span>Order Total:</span> <span>${order.total}</span>
    </div>
  </div>
);

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order, loading } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderForCheckout(orderId));
    }
    return () => {
      dispatch(clearOrderState());
    };
  }, [orderId, dispatch]);

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  if (loading || !order) {
    return <LoadingIndicator />;
  }

  if (order.payment_status === "paid") {
    return <PaidOrderMessage />;
  }

  return (
    <div className="bg-gray-50 py-12">
      <main className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Confirm Your Order
        </h1>

        <OrderSummarySection order={order} />

        <div>
          <h2 className="text-lg font-semibold text-center mb-4">
            Complete Payment
          </h2>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    { amount: { value: order.total.toString() } },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  dispatch(
                    processPaypalPayment({
                      order_oid: order.oid,
                      payapl_order_id: details.id,
                    })
                  )
                    .unwrap()
                    .then(() => {
                      navigate(`/order-success/${order.oid}`);
                    });
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
