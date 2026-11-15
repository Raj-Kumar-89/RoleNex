const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getStats,
  getAllEmployees,
  getLatestEmployees,
  getAllJobSeekers,
  getLatestJobSeekers,
  getAllJobs,
  getAllApplications,
  searchApplications,
  getApplicationsByDate,
  deleteEmployee,
  deleteJS,
  getAllContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/adminControllers");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

// Admin Login
router.post("/login", loginAdmin);

// Admin Dashboard Stats
router.get("/stats", verifyAdminToken, getStats);

// Get Latest Employees
router.get("/latestemployees", verifyAdminToken, getLatestEmployees);

// Get All Employees
router.get("/employees", verifyAdminToken, getAllEmployees);

// Get All JobSeekers
router.get("/jobseekers", verifyAdminToken, getAllJobSeekers);

// Get Latest JobSeekers
router.get("/latestjobseekers", verifyAdminToken, getLatestJobSeekers);

// Get All Jobs
router.get("/jobs", verifyAdminToken, getAllJobs);

// Get All Applications
router.get("/getallapplications", verifyAdminToken, getAllApplications);

// Search Applicaion based on company and job title
router.get("/applications/search", verifyAdminToken, searchApplications);

// Get Application by the date wise
router.get("/applications/datewise", verifyAdminToken, getApplicationsByDate);

// Delete Employees
router.delete("/employees/:id",verifyAdminToken, deleteEmployee);

// Delete Jobseekers
router.delete("/jobseekers/:id",verifyAdminToken, deleteJS);

// Get Contact Us Messages
router.get("/contactmessages", verifyAdminToken, getAllContactMessages);

// Update Contact Us Messages
router.put("/contactmessages/:id", verifyAdminToken, updateContactMessage);

// Delete Contact Us Messages
router.delete("/contactmessages/:id", verifyAdminToken, deleteContactMessage);


module.exports = router;