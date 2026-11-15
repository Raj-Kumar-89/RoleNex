const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  registeremp,
  loginEmp,
  getEmployeeProfile,
  getLatestApplications,
  updateEmployeeProfile,
  getTopCompanies,
  getJobsByEmployee,
  changePassword,
  resetPassword,
  updateApplicationStatus,
  getAllApplications,
  hrViewEmployeesByCompany
} = require('../controllers/empControllers');

// Register employee
router.post("/register",
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "profile_pic", maxCount: 1 }
  ]),
  registeremp
);

// Login
router.post("/login", loginEmp);

// Get top companies
router.get("/top/companies", getTopCompanies);

// Get Jobs By Employee
router.get("/postedjobs/:id", getJobsByEmployee);

// HR View Their Employees
router.get("/hrviewemployees/:company", hrViewEmployeesByCompany);

// Get Latest Applications
router.get("/:id/latestapplications", getLatestApplications);

// Get All Applications
router.get("/:id/viewallapplications", getAllApplications);

// Change PWD
router.post("/changepwd", changePassword);

// Forgot PWD
router.post("/resetpwd", resetPassword);

// Update Application Status
router.put('/applications/:id/status', updateApplicationStatus);

// Update employee profile
router.put("/:id",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "company_logo", maxCount: 1 }
  ]),
  updateEmployeeProfile
);

// Get employee profile
router.get("/:id", getEmployeeProfile);

module.exports = router;