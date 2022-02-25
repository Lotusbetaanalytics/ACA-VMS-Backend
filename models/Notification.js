const { Schema, model } = require("mongoose");

const notifySchema = new Schema(
  {
    notify: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Notification", notifySchema);
