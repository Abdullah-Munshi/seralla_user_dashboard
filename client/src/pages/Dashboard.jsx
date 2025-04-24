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
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    // Fetch user data from the backend (dashboard)
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/api/user/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // sessionStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  if (loading) {
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

  return (
    <>
      <Header />
      <main>
        <Container>
          <div className="sm:flex items-center justify-between mb-6 mt-2 sm:mt-6 space-y-2 sm:space-y-0">
            <h1 className="text-primary text-2xl md:text-4xl font-bold font-montserrat capitalize">
              Welcome, {userData.username}
            </h1>
            <KycVerification kyc_status={userData.kyc_status} />
          </div>
          <div className="mb-5">
            <Mission mission={userData.mission} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
            <div className="space-y-5">
              <Balance balance={userData.balance} />
              <Payment userData={userData} />
            </div>
            <div className="space-y-5">
              <ReImbursement />
              <PaypalEmail paypalEmail={userData.paypal_email} />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

export default Dashboard;
