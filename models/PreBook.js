const mongoose = require("mongoose");

const preBookSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please add name"],
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please add email"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    date: {
      type: String,
      required: [true, "Please add expected date"],
    },
    time: {
      type: String,
      required: [true, "Please add expected time"],
    },

    purpose: {
      type: String,
      required: [true, "Please add purpose"],
    },

    token: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreBooked", preBookSchema);
