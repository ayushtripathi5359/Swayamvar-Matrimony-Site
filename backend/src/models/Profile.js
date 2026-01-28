const mongoose = require("mongoose");

const siblingSchema = new mongoose.Schema(
  {
    name: { type: String },
    occupation: { type: String },
    companyName: { type: String },
    currentEducation: { type: String },
    otherOccupation: { type: String }
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: String },
    age: { type: String },
    aboutMe: { type: String },
    maritalStatus: { type: String },
    motherTongue: { type: String },
    height: { type: String },
    complexion: { type: String },
    bloodGroup: { type: String },
    highestEducation: { type: String },
    collegeUniversity: { type: String },
    occupation: { type: String },
    organization: { type: String },
    designation: { type: String },
    currentEducation: { type: String },
    otherOccupation: { type: String },
    annualIncome: { type: String },
    jobLocation: { type: String },
    fathersFullName: { type: String },
    fathersOccupation: { type: String },
    fathersBusinessName: { type: String },
    fathersBusinessLocation: { type: String },
    fathersDesignation: { type: String },
    fathersCompanyName: { type: String },
    fathersOtherOccupation: { type: String },
    mothersFullName: { type: String },
    mothersOccupation: { type: String },
    mothersBusinessName: { type: String },
    mothersBusinessLocation: { type: String },
    mothersDesignation: { type: String },
    mothersCompanyName: { type: String },
    mothersOtherOccupation: { type: String },
    brothers: { type: [siblingSchema], default: [] },
    sisters: { type: [siblingSchema], default: [] },
    whatsappNumber: { type: String },
    emailId: { type: String },
    linkedinHandle: { type: String },
    instagramHandle: { type: String },
    facebookHandle: { type: String },
    birthName: { type: String },
    birthTime: { type: String },
    birthPlace: { type: String },
    firstGotra: { type: String },
    secondGotra: { type: String },
    partnerAgeFrom: { type: String },
    partnerAgeTo: { type: String },
    partnerQualification: { type: [String], default: [] },
    preferredLocation: { type: [String], default: [] },
    minAnnualIncome: { type: String },
    profilePhotos: {
      western: { type: String },
      traditional: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
