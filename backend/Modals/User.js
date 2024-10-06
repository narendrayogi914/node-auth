const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String, // This will store the token for resetting the password
  },
  resetPasswordExpire: {
    type: Date, // This will store the expiry time of the token
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
