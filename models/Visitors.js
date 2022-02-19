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
      unique: [true, "Email already exists"],
    },
    laptop: {
      type: String,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Please add host"],
    },
    purpose: {
      type: String,
      required: [true, "Please add purpose"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    photo: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", VisitorSchema);
