const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createAccessToken = (payload) => {
  const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret";
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || "15m";
  return jwt.sign(payload, secret, { expiresIn });
};

const createRefreshToken = (payload) => {
  const secret = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccessToken = (token) => {
  const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret";
  return jwt.verify(token, secret);
};

const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
  return jwt.verify(token, secret);
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken
};
