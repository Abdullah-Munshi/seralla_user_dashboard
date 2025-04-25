const db = require("../config/db.js");
exports.requestPayment = async (req, res) => {
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
};
