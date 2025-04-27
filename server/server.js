import express from "express";
import cors from "cors";
import "dotenv/config";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import kycRoutes from "./routes/kycRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

app.use("/api/v1", authRoutes, userRoutes, kycRoutes, paymentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
