const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    verified: { type: Boolean, default: false },
    password: {
      type: String,
      required: true
    },
    role: { type: String, enum: ["admin", "user"], default: "user" }
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
