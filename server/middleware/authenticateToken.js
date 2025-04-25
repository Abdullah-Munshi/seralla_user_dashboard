const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
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

module.exports = authenticateToken;
