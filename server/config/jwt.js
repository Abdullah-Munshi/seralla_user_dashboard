const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "blackcat0";
const JWT_EXPIRES_IN = "24h";

exports.generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
