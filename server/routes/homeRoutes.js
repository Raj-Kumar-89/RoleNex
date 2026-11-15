const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  searchJobs,
  getLatestJobs,
  getTopCompanies,
  getCategoryJobs,
  getCompanies,
} = require("../controllers/homeControllers");

// Get all jobs
router.get("/jobs", getAllJobs);

// Search jobs by title
router.get("/searchjobs", searchJobs);

// Get latest jobs
router.get("/latestjobs", getLatestJobs);

// fetch top companies
router.get("/topcompanies", getTopCompanies);

// Get all companies with details (for Companies page)
router.get("/companies", getCompanies);

// Get Jobs By Category
router.get("/categoryjobs",getCategoryJobs )

module.exports = router;