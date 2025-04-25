const express = require("express");
const router = express.Router();
const {
  getDashboard,
  updatePaypalEmail,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/user/dashboard", authenticateToken, getDashboard);
router.post("/user/paypal-email", authenticateToken, updatePaypalEmail);

module.exports = router;
