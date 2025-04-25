const db = require("../config/db");
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Query content specific to this user
    const userData = await db.getOne("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    // Format the response data to match frontend needs
    const dashboardData = {
      username: userData.username,
      mission: userData.mission,
      balance: userData.balance,
      paypalEmail: userData.paypal_email,
      kycStatus: userData.kyc_status,
      paymentRequestStatus: userData.payment_request_status,
      paymentRequestedTime: userData.payment_requested_time,
    };

    res.json({
      success: true,
      data: dashboardData,
      message: "User content retrieved successfully",
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred while retrieving dashboard data",
      },
    });
  }
};

exports.updatePaypalEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.userId;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: "EMAIL_REQUIRED",
          message: "PayPal email is required",
        },
      });
    }

    // Update user's PayPal email
    await db.query("UPDATE users SET paypal_email = ? WHERE id = ?", [
      email,
      userId,
    ]);

    res.json({ success: true, message: "PayPal email updated successfully" });
  } catch (error) {
    console.error("PayPal email update error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred while updating PayPal email",
      },
    });
  }
};
