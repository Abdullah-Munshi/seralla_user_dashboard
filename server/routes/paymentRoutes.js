const express = require("express");
const router = express.Router();
const { requestPayment } = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/request-payment", authenticateToken, requestPayment);

module.exports = router;
