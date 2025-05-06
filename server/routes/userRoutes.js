const express = require("express");
const {
  getDashboard,
  updatePaypalEmail,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/user/dashboard", authenticateToken, getDashboard);
router.post("/user/paypal", authenticateToken, updatePaypalEmail);

module.exports = router;
