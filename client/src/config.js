// src/config.js
const dev = {
  baseUrl: "http://localhost:5000",
};

const prod = {
  baseUrl: "https://serrala.globalsimguide.com",
};

// Use NODE_ENV to determine which environment we're in
// This is automatically set by React when running or building
const config = process.env.NODE_ENV === "production" ? prod : dev;

export default config;
