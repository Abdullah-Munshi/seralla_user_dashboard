import { useState } from "react";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import Loader from "./Loader";
import config from "../config";
const KycVerification = ({ kyc_status }) => {
  const [loading, setLoading] = useState(false);
  const handleKYC = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${config.baseUrl}/api/user/kyc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "KYC request failed");
      }
      const { data } = await res.json();
      window.location.href = data.verification_url;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (kyc_status === 1) {
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
