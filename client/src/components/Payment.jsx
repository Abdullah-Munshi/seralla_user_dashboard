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
      toast.error("You don't have enough balance to send payment request.", {
        id: "toast-error",
      });
      return;
    } else if (balance > 0 && userData.kycStatus === 0) {
      toast.error(
        "Please complete your KYC verification first to send payment request.",
        {
          id: "toast-error",
        }
      );
      return;
    } else if (balance > 0 && userData.kycStatus === 1) {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Please login first to request payment.", {
            id: "toast-error",
          });
          return;
        }

        const response = await fetch(
          `${config.baseUrl}/api/v1/payments/request`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ amount: balance }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Payment Request Failed!");
        }
        toast.success(data.message, {
          id: "toast-success",
        });
        userData.paymentRequestStatus = 1;
      } catch (err) {
        console.error("Payment request error:", err);
        toast.error(
          err.message || "Failed to request payment. Please try again later.",
          {
            id: "toast-error",
          }
        );
      } finally {
        setIsLoading(false);
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
          {userData.paymentRequestStatus === 1 && (
            <p className="text-sm text-green-600 mt-1">
              Your withdrawal request submitted on{" "}
              {formatDate(userData.paymentRequestedTime || Date.now())}, is
              under review.
            </p>
          )}
        </div>
      </Box>

      <button
        onClick={handlePaymentRequest}
        className={`h-[50px] bg-primary text-white rounded-lg px-4 py-2 w-full cursor-pointer text-base font-medium mb-0 flex items-center justify-center gap-2 style-2 ${
          isLoading && "show-loader"
        }`}
      >
        <Loader />
        Withdraw Funds
      </button>
    </>
  );
};

export default Payment;
