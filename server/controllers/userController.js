const db = require("../config/db");
exports.getDashboard = async (req, res) => {
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
};

exports.updatePaypalEmail = async (req, res) => {
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
};
