const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const generateToken = require("../helpers/generateToken");

const FrontdeskSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please add name"],
  },
  lastname: {
    type: String,
    required: [true, "Please add name"],
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },
  role: {
    type: String,
    enum: ["Building Frontdesk", "ACA Front Desk"],
    default: "ACA Front Desk",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Frontdesk", FrontdeskSchema);
