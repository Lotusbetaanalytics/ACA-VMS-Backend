const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please add name"],
    },
    title: {
      type: String,
      // required: [true, "Please add name"],
    },
    groupMembers: {
      type: Array,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    company: {
      type: String,
      required: [true, "Please add company"],
    },
    mobile: {
      type: String,
      maxlength: [, "Phone Number cannot be more than 20 characters"],
    },
    email: {
      type: String,
    },
    laptop: {
      type: String,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    purpose: {
      type: String,
      required: [true, "Please add purpose"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedOut: {
      type: Boolean,
      default: false,
    },

    photo: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", VisitorSchema);
