const express = require("express");
const { startKyc, kycCallback } = require("../controllers/kycController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/kyc/initiate", authenticateToken, startKyc);
router.post("/kyc/status", kycCallback);

module.exports = router;
