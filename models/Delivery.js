const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },

    company: {
      type: String,
      required: [true, "Please add company"],
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

module.exports = mongoose.model("Delivery", DeliverySchema);
