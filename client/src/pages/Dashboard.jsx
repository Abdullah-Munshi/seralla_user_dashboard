import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Container } from "../components/Utils";
import Mission from "../components/Mission";
import Balance from "../components/Balance";
import Payment from "../components/Payment";
import ReImbursement from "../components/ReImbursement";
import PaypalEmail from "../components/PaypalEmail";
import KycVerification from "../components/KycVerification";
import Loader from "../components/Loader";
import config from "../config";

function Dashboard() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

    // Fetch user data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${config.baseUrl}/api/v1/user/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error?.message ||
              "An error occurred while retrieving dashboard data"
          );
        }
        if (!data.success) {
          throw new Error(data.error?.message || "Failed to fetch user data");
        }
        setData(data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen grid place-content-center">
        <div className="text-center space-y-1 flex items-center gap-2 ">
          <Loader />
          <p className="text-primary text-base font-medium text-center -translate-y-0.5">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (fallback) {
    return (
      <div className="h-screen w-screen grid place-content-center">
        <p className="text-primary text-base font-medium text-center -translate-y-0.5">
          Failed to load data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Container>
          <div className="sm:flex items-center justify-between mb-6 mt-2 sm:mt-6 space-y-2 sm:space-y-0">
            <h1 className="text-primary text-2xl md:text-4xl font-bold font-montserrat capitalize">
              Welcome, {data.username}
            </h1>
            <KycVerification kycStatus={data.kycStatus} />
          </div>
          <div className="mb-5">
            <Mission mission={data.mission} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
            <div className="space-y-5">
              <Balance balance={data.balance} />
              <Payment userData={data} />
            </div>
            <div className="space-y-5">
              <ReImbursement />
              <PaypalEmail paypalEmail={data.paypalEmail} />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default Dashboard;
