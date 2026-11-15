const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  postJob,
  searchJobs,
  getLatestJobs,
  getAllJobs,
  getJobById,
  applyJob,
  deleteJob
} = require("../controllers/jobController");

// Multer storage for company logos
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/companies"),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});
const logoUpload = multer({ storage: logoStorage });

// Multer storage for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/resumes"),
  filename: (req, file, cb) =>
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)),
});
const resumeUpload = multer({ storage: resumeStorage });

// Post A Job 
router.post("/postjobs", logoUpload.single("company_logo"), postJob);

// Search The Job
router.get("/search", searchJobs);

// Latest Jobs
router.get("/latest", getLatestJobs);

// Get All Jobs
router.get("/", getAllJobs);

// Applied Jobs 
router.get("/:id", getJobById);

// DELETE job
router.delete("/:id", deleteJob);

// Apply Jobs
router.post("/applyjobs", resumeUpload.single("resume"), applyJob);

module.exports = router;