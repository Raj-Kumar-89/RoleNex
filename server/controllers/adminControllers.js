const Admin = require("../models/Admin");
const Jobs = require("../models/Job");
const Employees = require("../models/Emp");
const Jobseekers = require("../models/JobSeeker");
const Applications = require("../models/Applications");
const ContactMessage = require("../models/ContactMessages");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.JWT_SECRET;


// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Login Credentials" });
    }

    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Stats
exports.getStats = async (req, res) => {
  try {
    const [jobsCount, employeesCount, jobseekersCount, applicationsCount, unreadMessagesCount] =
      await Promise.all([
        Jobs.countDocuments(),
        Employees.countDocuments(),
        Jobseekers.countDocuments(),
        Applications.countDocuments(),
        ContactMessage.countDocuments({ status: "Unread" }),
      ]);

    res.status(200).json({
      jobsCount,
      employeesCount,
      jobseekersCount,
      applicationsCount,
      unreadMessagesCount,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
      
// Fetch All Employee
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employees.find()
      .sort({ createdAt: -1 })
      .select("-password");

    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Fetch All JobSeekers
exports.getAllJobSeekers = async (req, res) => {
  try {
    const jobseekers = await Jobseekers.find()
    .sort({ createdAt: -1 })
    .select("-password");
    res.status(200).json(jobseekers);
  } catch (err) {
    console.error("Error fetching jobseekers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Latest Employees
exports.getLatestEmployees = async (req, res) => {
  try {
    const employees = await Employees.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("-password");

    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Fetch Latest JobSeekers
exports.getLatestJobSeekers = async (req, res) => {
  try {
    const jobseekers = await Jobseekers.find()
    .sort({ createdAt: -1 })
    .limit(2)
    .select("-password");
    res.status(200).json(jobseekers);
  } catch (err) {
    console.error("Error fetching jobseekers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find().populate("postedBy", "name email company");
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Applications.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search Applications by job title and company
exports.searchApplications = async (req, res) => {
  const { term } = req.query;
  if (!term) return res.json([]);

  try {
    const regex = new RegExp(term, "i");
    const apps = await Applications.find({
      $or: [{ jobTitle: regex }, { company: regex }],
    }).sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search applications" });
  }
};

// Get Application based on specific dates
exports.getApplicationsByDate = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to)
    return res.status(400).json({ message: "Both from and to dates required" });

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const apps = await Applications.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    }).sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    console.error("Error filtering applications by date:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employees.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Jobseeker
exports.deleteJS= async (req, res) => {
  try {
    const JobSeeker = await Jobseekers.findByIdAndDelete(req.params.id);
    if (!JobSeeker) {
      return res.status(404).json({ message: "JobSeeker not found" });
    }
    res.status(200).json({ message: "JobSeeker deleted successfully" });
  } catch (error) {
    console.error("Error deleting JobSeeker:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all contact messages
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update message status/note
exports.updateContactMessage = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!msg) return res.status(404).json({ message: "Message not found" });

    res.status(200).json(msg);
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete contact message
exports.deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error" });
  }
};