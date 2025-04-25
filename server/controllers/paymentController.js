const db = require("../config/db.js");
exports.requestPayment = async (req, res) => {
  try {
    if (!req.body.amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_AMOUNT",
          message: "Something went wrong! Please try again later.",
        },
      });
    }

    // Payment request status check
    const result = await db.getOne(
      "SELECT payment_request_status FROM users  WHERE id = ?",
      [req.user.userId]
    );

    if (result.payment_request_status === 1) {
      return res.status(200).json({
        success: true,
        data: {},
        message:
          "Your payment request under review. please wait till we process it.",
      });
    }

    // Telegram bot setup
    const botToken = process.env.BOT_TOKEN; // Your Telegram bot token
    if (!botToken) {
      return res.status(500).json({
        success: false,
        error: {
          code: "BOT_TOKEN_INVALID",
          message: "Something went wrong! please try again later.",
        },
      });
    }
    const chatId = process.env.TELEGRAM_CHAT_ID; // Your own Telegram user or group ID

    // Message to send
    const amount = req.body.amount;
    const message = `💸 Payment Request Received!\n\nUser: ${req.user.username}\nAmount: $${amount}`;

    // Send the Telegram message
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!telegramResponse.ok) {
      return res.status(telegramResponse.status).json({
        success: false,
        error: {
          code: "TELEGRAM_MESSAGE_FAILED",
          message: "Something went wrong! Please try again later.",
        },
      });
    }
    await db.query(
      "UPDATE users SET payment_request_status = ?, payment_requested_time = NOW() WHERE id = ?",
      [1, req.user.userId]
    );

    res.status(200).json({
      success: true,
      data: null,
      message: "Payment request successfull",
    });
  } catch (error) {
    console.error("Payment request error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "PAYMENT_REQUEST_FAILED",
        message: "Something went wrong! Please try again later.",
      },
    });
  }
};
