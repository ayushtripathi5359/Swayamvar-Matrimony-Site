const mongoose = require("mongoose");

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/swayamvar";

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
