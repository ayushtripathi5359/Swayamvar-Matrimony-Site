const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  profile: Joi.object({
    fullName: Joi.string().required(),
    gender: Joi.string().optional(),
    dateOfBirth: Joi.string().optional(),
    age: Joi.string().optional(),
    aboutMe: Joi.string().optional(),
    maritalStatus: Joi.string().optional(),
    motherTongue: Joi.string().optional(),
    height: Joi.string().optional(),
    complexion: Joi.string().optional(),
    bloodGroup: Joi.string().optional(),
    highestEducation: Joi.string().optional(),
    collegeUniversity: Joi.string().optional(),
    occupation: Joi.string().optional(),
    organization: Joi.string().optional(),
    designation: Joi.string().optional(),
    currentEducation: Joi.string().optional(),
    otherOccupation: Joi.string().optional(),
    annualIncome: Joi.string().optional(),
    jobLocation: Joi.string().optional(),
    fathersFullName: Joi.string().optional(),
    fathersOccupation: Joi.string().optional(),
    fathersBusinessName: Joi.string().optional(),
    fathersBusinessLocation: Joi.string().optional(),
    fathersDesignation: Joi.string().optional(),
    fathersCompanyName: Joi.string().optional(),
    fathersOtherOccupation: Joi.string().optional(),
    mothersFullName: Joi.string().optional(),
    mothersOccupation: Joi.string().optional(),
    mothersBusinessName: Joi.string().optional(),
    mothersBusinessLocation: Joi.string().optional(),
    mothersDesignation: Joi.string().optional(),
    mothersCompanyName: Joi.string().optional(),
    mothersOtherOccupation: Joi.string().optional(),
    brothers: Joi.array().items(Joi.object()).optional(),
    sisters: Joi.array().items(Joi.object()).optional(),
    whatsappNumber: Joi.string().optional(),
    emailId: Joi.string().email().optional(),
    linkedinHandle: Joi.string().optional(),
    instagramHandle: Joi.string().optional(),
    facebookHandle: Joi.string().optional(),
    birthName: Joi.string().optional(),
    birthTime: Joi.string().optional(),
    birthPlace: Joi.string().optional(),
    firstGotra: Joi.string().optional(),
    secondGotra: Joi.string().optional(),
    partnerAgeFrom: Joi.string().optional(),
    partnerAgeTo: Joi.string().optional(),
    partnerQualification: Joi.array().items(Joi.string()).optional(),
    preferredLocation: Joi.array().items(Joi.string()).optional(),
    minAnnualIncome: Joi.string().optional(),
    profilePhotos: Joi.object({
      western: Joi.string().optional(),
      traditional: Joi.string().optional()
    }).optional()
  }).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const profileUpdateSchema = Joi.object({
  fullName: Joi.string().optional(),
  gender: Joi.string().optional(),
  dateOfBirth: Joi.string().optional(),
  age: Joi.string().optional(),
  aboutMe: Joi.string().optional(),
  maritalStatus: Joi.string().optional(),
  motherTongue: Joi.string().optional(),
  height: Joi.string().optional(),
  complexion: Joi.string().optional(),
  bloodGroup: Joi.string().optional(),
  highestEducation: Joi.string().optional(),
  collegeUniversity: Joi.string().optional(),
  occupation: Joi.string().optional(),
  organization: Joi.string().optional(),
  designation: Joi.string().optional(),
  currentEducation: Joi.string().optional(),
  otherOccupation: Joi.string().optional(),
  annualIncome: Joi.string().optional(),
  jobLocation: Joi.string().optional(),
  fathersFullName: Joi.string().optional(),
  fathersOccupation: Joi.string().optional(),
  fathersBusinessName: Joi.string().optional(),
  fathersBusinessLocation: Joi.string().optional(),
  fathersDesignation: Joi.string().optional(),
  fathersCompanyName: Joi.string().optional(),
  fathersOtherOccupation: Joi.string().optional(),
  mothersFullName: Joi.string().optional(),
  mothersOccupation: Joi.string().optional(),
  mothersBusinessName: Joi.string().optional(),
  mothersBusinessLocation: Joi.string().optional(),
  mothersDesignation: Joi.string().optional(),
  mothersCompanyName: Joi.string().optional(),
  mothersOtherOccupation: Joi.string().optional(),
  brothers: Joi.array().items(Joi.object()).optional(),
  sisters: Joi.array().items(Joi.object()).optional(),
  whatsappNumber: Joi.string().optional(),
  emailId: Joi.string().email().optional(),
  linkedinHandle: Joi.string().optional(),
  instagramHandle: Joi.string().optional(),
  facebookHandle: Joi.string().optional(),
  birthName: Joi.string().optional(),
  birthTime: Joi.string().optional(),
  birthPlace: Joi.string().optional(),
  firstGotra: Joi.string().optional(),
  secondGotra: Joi.string().optional(),
  partnerAgeFrom: Joi.string().optional(),
  partnerAgeTo: Joi.string().optional(),
  partnerQualification: Joi.array().items(Joi.string()).optional(),
  preferredLocation: Joi.array().items(Joi.string()).optional(),
  minAnnualIncome: Joi.string().optional(),
  profilePhotos: Joi.object({
    western: Joi.string().optional(),
    traditional: Joi.string().optional()
  }).optional()
});

const newsletterSchema = Joi.object({
  email: Joi.string().email().required()
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  newsletterSchema
};
