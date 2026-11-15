const Job = require('../models/Job');
const Applications = require("../models/Applications");

// POST new job
exports.postJob = async (req, res) => {
  try {
    const { title, desc,qualification, company, technology, positions, type, category, location, salary, contactemail, postedBy } = req.body;

    if (!title || !desc || !company || !technology || !positions || !type || !category || !location || !contactemail || !postedBy) {
      return res.status(400).json({ error: 'All required fields must be filled, including postedBy.' });
    }

    const newJob = new Job({
      title,
      desc,
      qualification,
      company,
      company_logo: req.file ? `/uploads/companies/${req.file.filename}` : null,
      technology,
      positions: parseInt(positions),
      type,
      category,
      location,
      salary,
      contactemail,
      postedBy 
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!', job: newJob });

  } catch (err) {
    console.error("Job Post Error:", err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};

// Search jobs by title
exports.searchJobs = async (req, res) => {
  try {
    const { title } = req.query;
    const jobs = await Job.find({ title: { $regex: title, $options: "i" } });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error searching jobs:", err);
    res.status(500).json({ error: "Search failed" });
  }
};

// Get latest jobs
exports.getLatestJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit);
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching latest jobs:", err);
    res.status(500).json({ error: "Failed to fetch latest jobs" });
  }
};

// GET all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching all jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Fetch a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Apply to a job
exports.applyJob = async (req, res) => {
  try {
    const {
      jobseekerId,
      empId,
      jobId,
      name,
      email,
      qualification,
      jobTitle,
      company,
      technology,
      positions,
      type,
      category,
      location,
      contactEmail,
      salary
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const newApplication = new Applications({
      jobseekerId,
      empId,
      jobId,
      name,
      email,
      qualification,
      resume: resumeUrl,
      jobTitle,
      company,
      technology,
      positions,
      type,
      category,
      location,
      contactEmail,
      salary,
      status: "Pending"
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({ message: "Server error while submitting application" });
  }
};