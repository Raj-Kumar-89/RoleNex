const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  qualification:{ type: String, required: true},
  company: { type: String, required: true },
  company_logo: { type: String },
  technology: { type: String, required: true },
  positions: { type: Number, required: true },
  type: { type: String, required: true, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'] },
  category: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  contactemail: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
}, { collection: "Jobs", timestamps: true });

module.exports = mongoose.model('Jobs', jobSchema);