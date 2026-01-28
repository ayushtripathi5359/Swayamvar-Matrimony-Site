const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { registerSchema, loginSchema } = require("../utils/validation");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  hashToken
} = require("../utils/token");

const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation failed", details: error.details });
    }

    const { email, password, profile } = value;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });

    const profileDoc = await Profile.create({
      ...profile,
      emailId: profile.emailId || email,
      user: user._id
    });

    const accessToken = createAccessToken({ userId: user._id, role: user.role });
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role });

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      profile: profileDoc
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation failed", details: error.details });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken({ userId: user._id, role: user.role });
    const refreshToken = createRefreshToken({ userId: user._id, role: user.role });

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = createAccessToken({ userId: user._id, role: user.role });
    const newRefreshToken = createRefreshToken({ userId: user._id, role: user.role });
    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.userId);
      if (user) {
        user.refreshTokenHash = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};
