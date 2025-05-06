const express = require("express");
const { requestPayment } = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/payments/request", authenticateToken, requestPayment);

module.exports = router;
