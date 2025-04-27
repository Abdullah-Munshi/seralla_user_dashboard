import jwt from "jsonwebtoken";
import JWT_SECRET from "../config/jwt.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired token",
      },
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Invalid or expired token",
        },
      });
    }

    // Add user data to request
    req.user = decoded;
    next();
  });
};

export default authenticateToken;
