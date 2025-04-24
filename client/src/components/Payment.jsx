import React, { useState } from "react";
import toast from "react-hot-toast";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { BlkTitle, Box } from "./Utils";
import config from "../config";
import Loader from "./Loader";

const Payment = ({ userData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePaymentRequest = async () => {
    const balance = parseInt(userData.balance);
    if (balance <= 0) {
      toast.error("You don't have enough balance to send payment request.");
      return;
    } else if (balance > 0 && userData.kyc_status === 0) {
      toast.error(
        "Please complete your KYC verification first to send payment request."
      );
      return;
    } else if (balance > 0 && userData.kyc_status === 1) {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to request payment.");
          return;
        }

        const response = await fetch(`${config.baseUrl}/api/request-payment`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ amount: balance }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Please log in again.");
            // Potentially redirect to login
            return;
          } else if (response.status === 400) {
            toast.error(
              data.message || "Invalid request. Please check your details."
            );
            return;
          } else if (response.status === 403) {
            toast.error("You don't have permission to perform this action.");
            return;
          } else if (response.status === 429) {
            toast.error("Too many requests. Please try again later.");
            return;
          } else {
            toast.error(
              data.message || "Something went wrong. Please try again later."
            );
            return;
          }
        }

        const data = await response.json();
        setIsLoading(false);
        toast.success(data.message);
        userData.payment_request_status = 1;
      } catch (err) {
        // Handle network errors or JSON parsing errors
        console.error("Payment request error:", err);

        if (err.name === "TypeError" && err.message.includes("fetch")) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else if (err.name === "SyntaxError") {
          toast.error(
            "Received invalid response from server. Please contact support."
          );
        } else {
          toast.error("Failed to request payment. Please try again later.");
        }
      }
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }
  return (
    <>
      <Box>
        <div className="flex items-center gap-2 mb-2">
          <CurrencyDollarIcon className="h-6 w-6 " />
          <BlkTitle>Payment</BlkTitle>
        </div>
        <div>
          <p className="text-sm sm:text-base">
            You will receive ${userData.balance} upon successful completion.
          </p>
        </div>
      </Box>

      <button
        onClick={handlePaymentRequest}
        className={`h-[50px] bg-primary text-white rounded-lg px-4 py-2 w-full cursor-pointer text-base font-medium mb-0 flex items-center justify-center gap-2 style-2 ${
          isLoading && "show-loader"
        }`}
      >
        <Loader />
        Request Payment payout
      </button>
      {userData.payment_request_status === 1 && (
        <p className="text-sm text-green-600 mt-1">
          Your payment request initiated at{" "}
          {formatDate(userData.payment_requested_time || Date.now())}
        </p>
      )}
    </>
  );
};

export default Payment;
