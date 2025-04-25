import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import config from "../config";
import Loader from "../components/Loader";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    // Prevent default form behavior
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${config.baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        // console.log(response);
        throw new Error(data.error?.message || "Login failed");
      }

      if (!data.success || !data.data?.token) {
        throw new Error("Invalid response from server");
      }

      // Store token in session storage
      sessionStorage.setItem("token", data.data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <div className="bg-transparent flex flex-col items-center justify-center h-screen px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl px-4 py-7 lg:px-8 lg:py-10 shadow-lg max-w-md mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-tertiary">
          Login
        </h1>
        <input
          type="text"
          placeholder="Username"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          className="h-[48px] border border-gray-300 rounded-xl px-3 py-2 mb-5 w-full active:border-primary focus:border-primary focus:outline-none transition duration-200 font-medium text-base"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          className="h-[48px] border border-gray-300 rounded-xl px-3 mb-7 w-full active:border-primary focus:border-primary focus:outline-none transition duration-200 font-medium text-base"
        />
        <button
          type="submit"
          className={`h-[48px] bg-primary text-lg font-medium text-white rounded-xl px-4 py-2 w-full cursor-pointer transition duration-200 flex items-center justify-center gap-2 style-2 ${
            isLoading && "show-loader"
          }`}
        >
          <Loader />
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
