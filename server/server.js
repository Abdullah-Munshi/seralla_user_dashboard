const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const env = process.env.NODE_ENV.trim() || "development";
dotenv.config({ path: `.env.${env}` });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const kycRoutes = require("./routes/kycRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

app.use("/api/v1", authRoutes, userRoutes, kycRoutes, paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
