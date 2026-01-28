const Profile = require("../models/Profile");
const { profileUpdateSchema } = require("../utils/validation");

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { error, value } = profileUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation failed", details: error.details });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { $set: value },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile
};
