const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobseekerId: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekers", required: true },
    empId: { type: mongoose.Schema.Types.ObjectId, ref: "Employees", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    qualification: { type: String },
    resume: { type: String, required: true },
    jobTitle: { type: String },
    company: { type: String },
    technology: { type: String },
    positions: { type: Number },
    type: { type: String },
    category: { type: String },
    location: { type: String },
    contactEmail: { type: String },
    salary: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { collection: "Applications", timestamps: true }
);

module.exports = mongoose.model("Applications", applicationSchema);