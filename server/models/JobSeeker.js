const mongoose = require("mongoose");

const jobseekerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, 'Please enter a valid email address']},
    password: { type: String, required: true },
    jsprofile_pic: { type: String, default: null },
    resume: { type: String, default: null },
    mobile: { type: String, required: true, trim: true, match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'] },
    address: { type: String, required: true, trim: true },
    skills: { type: String, trim: true },
  },
  { collection: "JobSeekers", timestamps: true }
);

module.exports = mongoose.model("JobSeekers", jobseekerSchema);