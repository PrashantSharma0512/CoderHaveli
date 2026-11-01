import React from "react";
import axiosInstance from "../helper/axiosInstance"; // your axios with baseURL

export default function PaymentButton({ amount }) {

  const handlePayment = async () => {
    try {
      // Step 1: Create order on backend
      const { data } = await axiosInstance.post("/api/payment/order", { amount });
      const { order } = data;

      // Step 2: Configure Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // your public key (from .env)
        amount: order.amount || 999,
        currency: order.currency || "INR",
        name: "CoderHaveli",
        description: "Course Purchase",
        order_id: order.id || "testing",
        handler: async (response) => {
          // Step 3: Verify payment on backend
          const verifyRes = await axiosInstance.post("/api/payment/verify", response);
          if (verifyRes.data.success) {
            alert("✅ Payment Successful!");
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: "Prashant Sharma",
          email: "prashant@coderhaveli.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
    >
      Pay ₹{amount}
    </button>
  );
}
