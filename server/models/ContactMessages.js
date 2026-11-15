const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Unread", "Read", "Replied"],
      default: "Unread",
    },
    adminNote: { type: String, default: "" },
  },
  { collection: "ContactMessages", timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactUsSchema);