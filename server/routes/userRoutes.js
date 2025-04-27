import express from "express";
import {
  getDashboard,
  updatePaypalEmail,
} from "../controllers/userController.js"; // ✅ named import + .js
import authenticateToken from "../middleware/authenticateToken.js"; // ✅ default import + .js

const router = express.Router();

router.get("/user/dashboard", authenticateToken, getDashboard);
router.post("/user/paypal", authenticateToken, updatePaypalEmail);

export default router;
