// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Secret key for JWT (store in environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || "blackcat0";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Add user data to request
    req.user = decoded;
    next();
  });
};

// 1. Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Query user with plain text password (not recommended for production)
    const user = await db.getOne(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // Don't send password back
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. User Content Route - Protected with JWT
app.get("/api/user/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Query content specific to this user
    const [userData] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: userData });
  } catch (error) {
    console.error("User content error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Save PayPal Email Route - Protected with JWT
app.post("/api/user/paypal-email", authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.userId;
    if (!email) {
      return res.status(400).json({ error: "PayPal email is required" });
    }

    // Update user's PayPal email
    await db.query("UPDATE users SET paypal_email = ? WHERE id = ?", [
      email,
      userId,
    ]);

    res.json({ success: true, message: "PayPal email updated successfully" });
  } catch (error) {
    console.error("PayPal email update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/user/kyc", authenticateToken, async (req, res) => {
  const token = btoa(
    `${process.env.SHUFTI_CLIENT_ID}:${process.env.SHUFTI_SECRET_KEY}`
  );

  const payload = {
    reference: `SP_${Math.floor(Math.random() * 900) + 1000}_${
      req.user.userId
    }`,
    callback_url: "https://serrala.globalsimguide.com/api/user/kyc-status",
    redirect_url: "https://serrala.globalsimguide.com/",
    document: {
      supported_types: ["id_card", "driving_license", "passport"],
      allow_offline: "1",
      allow_online: "1",
      fetch_enhanced_data: "1",
      verification_mode: "any",
      show_ocr_form: "1",
    },
  };

  try {
    const response = await fetch("https://api.shuftipro.com/", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + token, // if access token then replace "Basic" with "Bearer"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json("something wrong");
  }
});

app.post("/api/user/kyc-status", async (req, res) => {
  const result = req.body;
  const userId = parseInt(result.reference.split("_")[2]);

  if (result.event === "verification.accepted") {
    await db.query("UPDATE users SET kyc_status = ? WHERE id = ?", [1, userId]);
    res.status(200).json("User verified");
  } else {
    res.status(401).json("User not verified");
  }
});

app.post("/api/request-payment", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Payment request status check
    const [result] = await db.query(
      "SELECT payment_request_status FROM users  WHERE id = ?",
      [user.userId]
    );

    if (result.payment_request_status === 1) {
      res.status(200).json({
        message:
          "Your payment request under review. please wait till we process it.",
      });
      return;
    }

    // Telegram bot setup
    const botToken = process.env.BOT_TOKEN; // Your Telegram bot token
    if (!botToken) {
      return res.status(500).json({ error: "Telegram bot token not set" });
    }
    const chatId = process.env.TELEGRAM_CHAT_ID; // Your own Telegram user or group ID

    // Message to send
    const amount = req.body.amount;
    const message = `💸 Payment Request Received!\n\nUser: ${user.username}\nAmount: $${amount}`;

    // Send the Telegram message
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    await db.query(
      "UPDATE users SET payment_request_status = ?, payment_requested_time = NOW() WHERE id = ?",
      [1, user.userId]
    );
    res.status(200).json({ success: true, message: "Payment request sent" });
  } catch (error) {
    console.error("Payment request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
