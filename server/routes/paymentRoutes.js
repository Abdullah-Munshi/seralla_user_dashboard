const express = require("express");
const router = express.Router();
const { requestPayment } = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/payments/request", authenticateToken, requestPayment);

module.exports = router;
