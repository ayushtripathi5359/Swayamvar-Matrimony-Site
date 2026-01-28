const NewsletterSubscriber = require("../models/NewsletterSubscriber");
const { newsletterSchema } = require("../utils/validation");

const subscribe = async (req, res, next) => {
  try {
    const { error, value } = newsletterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: "Validation failed", details: error.details });
    }

    const { email } = value;
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    await NewsletterSubscriber.create({ email });
    return res.status(201).json({ message: "Subscribed" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { subscribe };
