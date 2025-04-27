import express from "express";
import { startKyc, kycCallback } from "../controllers/kycController.js"; // ✅ import with .js
import authenticateToken from "../middleware/authenticateToken.js"; // ✅ import with .js

const router = express.Router();

router.post("/kyc/initiate", authenticateToken, startKyc);
router.post("/kyc/status", kycCallback);

export default router;
