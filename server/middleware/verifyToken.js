// middleware/verifyToken.js

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      status: "failed",
      message: "No token provided. Access denied.",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1]; // Remove "Bearer " part

  // Verify the token
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "failed",
        message: "Failed to authenticate token. Access denied.",
      });
    }

    // Attach the decoded user information to the request object
    req.user = decoded; // This will allow access to `req.user` in your route handler
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;
