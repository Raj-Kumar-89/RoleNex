const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  registerJobseeker,
  loginJobseeker,
  changePassword,
  resetPassword,
  getJobseekerById,
  updateJobseekerProfile,
  getLatestAppliedJobs,
  getAllAppliedJobs
} = require("../controllers/jobseekerControllers");

// Jobseeker Register
router.post("/register", registerJobseeker);

// Jobseeker Login
router.post("/login", loginJobseeker);

// Change Password
router.post("/changepwd", changePassword);

// Forgot Password
router.post("/resetpwd", resetPassword);

// Get latest applied jobs for a jobseeker
router.get("/latestapplied/:id", getLatestAppliedJobs);

// Get all applied jobs for a jobseeker
router.get("/allapplied/:id", getAllAppliedJobs);

// Jobseeker Update Profile
router.put("/:id",
  upload.fields([
    { name: "jsprofile_pic", maxCount: 1 },
  ]),
  updateJobseekerProfile
);

// Get Jobseeker
router.get("/:id", getJobseekerById);



module.exports = router;