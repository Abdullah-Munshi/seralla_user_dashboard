import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    // Prevent default form behavior
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await fetch(`${config.baseUrl}/api/login`, {
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

      if (!response.ok) {
        console.log(response);
        throw new Error("Invalid Credentials");
      }

      const data = await response.json();

      // On success, store the token in localStorage
      sessionStorage.setItem("token", data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.message);
      // You might want to set an error state to display to the user
      setError(err.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    // Check if the user is already logged in
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/"); // Redirect to dashboard if already logged in
    }

    console.log("Login component mounted");
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          className="h-[48px] bg-primary text-lg font-medium text-white rounded-xl px-4 py-2 w-full cursor-pointer transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
