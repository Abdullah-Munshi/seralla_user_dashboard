import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  const isTokenExpired = () => {
    try {
      // JWT tokens are split into three parts by dots
      const payload = token.split(".")[1];
      // Decode the base64 payload
      const decodedPayload = JSON.parse(atob(payload));
      // Get current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // If the expiration time is before current time, token is expired
      return decodedPayload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true; // Consider token expired if there's an error
    }
  };

  // Redirect to login if token is expired
  if (isTokenExpired()) {
    // Optionally clear the expired token
    sessionStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
