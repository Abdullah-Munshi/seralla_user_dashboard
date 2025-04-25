const db = require("../config/db.js"); // Assuming you have a db module to handle database operations
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "blackcat0";
exports.login = async (req, res) => {
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
};
