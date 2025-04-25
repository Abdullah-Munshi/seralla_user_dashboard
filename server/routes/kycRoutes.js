const express = require("express");
const router = express.Router();
const { startKyc, kycCallback } = require("../controllers/kycController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/user/kyc", authenticateToken, startKyc);
router.post("/user/kyc-status", kycCallback);

module.exports = router;
