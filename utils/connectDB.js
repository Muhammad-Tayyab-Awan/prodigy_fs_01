const mongoose = require("mongoose");
const dbUri = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    return true;
  } catch (error) {
    return error;
  }
};

module.exports = connectDB;
