import express from "express";
import { login } from "../controllers/authController.js"; // ✅ ESM needs .js extension

const router = express.Router();

router.post("/auth/login", login);

export default router;
