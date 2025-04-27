import express from "express";
import { requestPayment } from "../controllers/paymentController.js"; // ✅ import named export + .js
import authenticateToken from "../middleware/authenticateToken.js"; // ✅ import default export + .js

const router = express.Router();

router.post("/payments/request", authenticateToken, requestPayment);

export default router;
