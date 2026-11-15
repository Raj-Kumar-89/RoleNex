const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JobSeekers = require("../models/JobSeeker");
const Applications=require("../models/Applications");
const SECRET_KEY = process.env.JSSECRET_KEY;

// Helper to get full URL
const getFileUrl = (req, folder, file) => {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${file.filename}`;
};

// Registration
exports.registerJobseeker = async (req, res) => {
  const { name, email, password, mobile, address, skills } = req.body;

  try {
    const existingUser = await JobSeekers.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newJobseeker = new JobSeekers({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      skills,
    });

    await newJobseeker.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login
exports.loginJobseeker = async (req, res) => {
  const { email, password } = req.body;

  try {
    const jobseeker = await JobSeekers.findOne({ email });
    if (!jobseeker) {
      return res.status(404).json({ message: "Invalid Login Credentials" });
    }

    const isMatch = await bcrypt.compare(password, jobseeker.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Login Credentials" });
    }

    const token = jwt.sign({ id: jobseeker._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      jobseeker: {
        id: jobseeker._id,
        name: jobseeker.name,
        email: jobseeker.email,
        mobile: jobseeker.mobile,
        address: jobseeker.address,
        skills: jobseeker.skills,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Change PWD
exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const jobseeker = await JobSeekers.findOne({ email });
    if (!jobseeker) return res.status(404).json({ message: "JobSeeker not found" });

    const isMatch = await bcrypt.compare(currentPassword, jobseeker.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    jobseeker.password = hashedPassword;
    await jobseeker.save();

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset PWD
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const jobseeker = await JobSeekers.findOne({ email });
    if (!jobseeker) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    jobseeker.password = hashedPassword;
    await jobseeker.save();

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Jobseeker profile
exports.updateJobseekerProfile = async (req, res) => {
  try {
    const jobseeker = await JobSeekers.findById(req.params.id);
    if (!jobseeker) return res.status(404).json({ message: 'JobSeeker not found' });

    const { name, email, mobile, skills, address } = req.body;
    jobseeker.name = name || jobseeker.name;
    jobseeker.email = email || jobseeker.email;
    jobseeker.mobile = mobile || jobseeker.mobile;
    jobseeker.skills = skills || jobseeker.skills;
    jobseeker.address = address || jobseeker.address;

    if (req.files?.jsprofile_pic) jobseeker.jsprofile_pic = getFileUrl(req, 'jobseekers', req.files.jsprofile_pic[0]);

    const updatedJobseeker = await jobseeker.save();
    res.json(updatedJobseeker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch jobseeker by ID
exports.getJobseekerById = async (req, res) => {
  try {
    const jobseeker = await JobSeekers.findById(req.params.id);
    if (!jobseeker) return res.status(404).json({ message: "JobSeeker not found" });
    res.json(jobseeker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Latest applied jobs for a specific jobseeker
exports.getLatestAppliedJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const jobseekerId = id;

    if (!jobseekerId) {
      return res.status(400).json({ message: "JobSeeker ID is required" });
    }

    const appliedJobs = await Applications.find({ jobseekerId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean()
      .limit(3);

    res.status(200).json(appliedJobs);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ message: "Server error while fetching applied jobs" });
  }
};

// Get All applied jobs for a specific jobseeker
exports.getAllAppliedJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const jobseekerId = id;

    if (!jobseekerId) {
      return res.status(400).json({ message: "JobSeeker ID is required" });
    }

    const appliedJobs = await Applications.find({ jobseekerId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    res.status(200).json(appliedJobs);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ message: "Server error while fetching applied jobs" });
  }
};