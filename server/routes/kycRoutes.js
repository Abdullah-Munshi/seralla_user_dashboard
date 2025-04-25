const express = require("express");
const router = express.Router();
const { startKyc, kycCallback } = require("../controllers/kycController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/kyc/initiate", authenticateToken, startKyc);
router.post("/kyc/status", kycCallback);

module.exports = router;
