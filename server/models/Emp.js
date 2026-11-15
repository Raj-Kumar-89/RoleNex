const mongoose = require("mongoose");

const EmpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid company or business email address'] },
    password: { type: String, required: true },
    profile_pic: { type: String, default: null },
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true, match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'] },
    company_logo: { type: String, default: null },
  },
  { collection: "Employees", timestamps: true }
);

module.exports = mongoose.model("Employees", EmpSchema);