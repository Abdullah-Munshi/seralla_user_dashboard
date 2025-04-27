import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "blackcat0";
const JWT_EXPIRES_IN = "1h";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
