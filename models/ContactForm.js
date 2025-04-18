const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactFormSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const ContactForm = mongoose.model("contactForm", contactFormSchema);

module.exports = ContactForm;
