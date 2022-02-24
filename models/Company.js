const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    office: {
      type: String,
      required: [true, "Please add name"],
      unique: [true, "Company name already exist"],
    },
    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    frontdesk: [
      {
        type: Schema.Types.ObjectId,
        ref: "Frontdesk",
      },
    ],
    visitor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
    logo: {
      type: String,
      default: "no-photo.jpg",
    },
  },
  { timestamps: true }
);

module.exports = model("Company", companySchema);
