const Profile = require("../models/Profile");

const fallbackMatches = [
  {
    id: "match-1",
    fullName: "Saiteja G",
    age: "27",
    location: "Aurangabad",
    occupation: "Mechanical Engineer",
    lastActive: "1 hour ago",
    profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "match-2",
    fullName: "Ananya Kulkarni",
    age: "26",
    location: "Bangalore",
    occupation: "Data Scientist",
    lastActive: "30 minutes ago",
    profilePhoto: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: "match-3",
    fullName: "Priya Desai",
    age: "28",
    location: "Pune",
    occupation: "Product Manager",
    lastActive: "2 hours ago",
    profilePhoto: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const listMatches = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ user: { $ne: req.user.userId } })
      .limit(9)
      .select("fullName age jobLocation occupation profilePhotos");

    if (!profiles.length) {
      return res.json({ matches: fallbackMatches });
    }

    const matches = profiles.map((profile) => ({
      id: profile._id,
      fullName: profile.fullName,
      age: profile.age || "",
      location: profile.jobLocation || "",
      occupation: profile.occupation || "",
      lastActive: "Recently",
      profilePhoto: profile.profilePhotos?.traditional || profile.profilePhotos?.western || "https://randomuser.me/api/portraits/women/44.jpg"
    }));

    return res.json({ matches });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listMatches };
