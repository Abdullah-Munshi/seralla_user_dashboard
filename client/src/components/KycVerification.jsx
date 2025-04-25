import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Loader from "./Loader";
import config from "../config";
const KycVerification = ({ kycStatus }) => {
  const [loading, setLoading] = useState(false);
  const handleKYC = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${config.baseUrl}/api/v1/kyc/initiate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "KYC request failed");
      }
      if (!data.success) {
        throw new Error(data.error?.message || "KYC request failed");
      }
      toast.success(data.message);
      window.location.href = data.data.verification_url;
    } catch (err) {
      console.error("KYC request error:", err);
      toast.error(err.message || "KYC request failed!");
    } finally {
      setLoading(false);
    }
  };

  if (kycStatus === 1) {
    return (
      <div className="inline-flex items-center gap-1 text-green-500 text-base font-medium">
        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
        Verified
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-3">
      {loading && <Loader />}
      <button
        onClick={handleKYC}
        type="button"
        className="text-primary font-semibold text-lg cursor-pointer"
      >
        Complete KYC verification
      </button>
    </div>
  );
};

export default KycVerification;
