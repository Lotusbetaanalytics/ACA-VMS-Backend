const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please add name"],
  },
  mobile: {
    type: String,
    maxlength: [20, "Phone Number cannot be more than 20 characters"],
    unique: true,
    required: [true, "Please add mobile number"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add email"],
  },
  visitor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
  ],
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
