const db = require("../config/db");
const { generateToken } = require("../config/jwt");
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CREDENTIALS",
          message: "Username and password are required",
        },
      });
    }

    // Query user with plain text password (not recommended for production)
    const user = await db.getOne(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    // Handle invalid credentials
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Username or password is incorrect",
        },
      });
    }

    // Generate token
    const token = generateToken({ userId: user.id, username: user.username }); // payload

    // Send response with token and user info
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          // Don't send password back
        },
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An internal server error occurred",
      },
    });
  }
};
