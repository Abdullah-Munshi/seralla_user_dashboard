import { useState, useEffect, useRef } from "react";
import { EnvelopeIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { BlkTitle, Box } from "./Utils";
import Loader from "./Loader";
import config from "../config";

const PaypalEmail = ({ paypalEmail }) => {
  const [email, setEmail] = useState(paypalEmail || "");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (paypalEmail) {
      setEmail(paypalEmail);
      setShowEditBtn(true);
    }
  }, [paypalEmail]);

  const handleForm = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your PayPal email.");
      return;
    } else if (!isValidEmail(email)) {
      toast.error("Please enter a valid PayPal email.");
      return;
    }
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${config.baseUrl}/api/user/paypal-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Fixed capitalization of "application"
        },
        body: JSON.stringify({ email }), // Changed key to match server expectation
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Email saved successfully!");
        setLoading(false);
        setIsEditing(false);
        setShowEditBtn(true);
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Email save error:", err);

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (err.name === "SyntaxError") {
        toast.error(
          "Received invalid response from server. Please contact support."
        );
      } else {
        toast.error("Failed to save paypal email. Please try again later.");
      }
    }
  };

  function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  }

  return (
    <Box>
      <div className="flex items-center gap-2 mb-2">
        <EnvelopeIcon className="h-6 w-6 " />
        <BlkTitle>PayPal Email</BlkTitle>
      </div>
      <form onSubmit={handleForm}>
        <div className="relative">
          <input
            ref={inputRef}
            type="email"
            value={email}
            placeholder="Enter your PayPal email"
            className="focus:outline-none mail-field h-[44px] border border-[#ddd] rounded-lg px-3 py-1 w-full transition-all duration-200 ease-in-out"
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing}
          />

          {showEditBtn && (
            <button
              type="button"
              className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-black font-normal text-sm"
              onClick={() => {
                setIsEditing(true);
                inputRef.current.focus();
              }}
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-3 inline-flex items-center gap-3">
          <button
            type="submit"
            className="bg-primary px-5 py-2 text-white font-medium cursor-pointer rounded-lg"
          >
            Save
          </button>

          {loading && <Loader></Loader>}
        </div>
      </form>
    </Box>
  );
};

export default PaypalEmail;
