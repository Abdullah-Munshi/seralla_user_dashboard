// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const kycRoutes = require("./routes/kycRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api", authRoutes, userRoutes, kycRoutes, paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
