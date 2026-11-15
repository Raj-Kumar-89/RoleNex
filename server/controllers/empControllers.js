const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Emp");
const Applications = require('../models/Applications');
const Job = require('../models/Job');
const SECRET_KEY = process.env.EMPSECRET_KEY;
// gets full URL
const getFileUrl = (req, folder, file) => {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${file.filename}`;
};

// Register employee
exports.registeremp = async (req, res) => {
  try {
    const { name, email, password, company, position, mobile } = req.body;

    if (!name || !email || !password || !company || !position || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Employee.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const company_logo = getFileUrl(req, 'companies', req.files?.company_logo?.[0]);
    const profile_pic = getFileUrl(req, 'employees', req.files?.profile_pic?.[0]);

    const newEmp = new Employee({
      name,
      email,
      password: hashedPassword,
      company,
      position,
      mobile,
      company_logo,
      profile_pic
    });

    await newEmp.save();

    const token = jwt.sign({ id: newEmp._id }, SECRET_KEY, { expiresIn: "1d" });

    res.status(201).json({
      message: "Registration successful",
      token,
      employee: {
        id: newEmp._id,
        name: newEmp.name,
        email: newEmp.email,
        company: newEmp.company,
        position: newEmp.position,
        mobile: newEmp.mobile,
        company_logo: newEmp.company_logo,
        profile_pic: newEmp.profile_pic
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login employee
exports.loginEmp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const emp = await Employee.findOne({ email });
    if (!emp) return res.status(400).json({ message: "Invalid Login credentials" });

    const isMatch = await bcrypt.compare(password, emp.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Login credentials" });

    const token = jwt.sign({ id: emp._id }, SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        id: emp._id,
        name: emp.name,
        email: emp.email,
        company: emp.company,
        position: emp.position,
        mobile: emp.mobile,
        company_logo: emp.company_logo,
        profile_pic: emp.profile_pic
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get top 10 companies
exports.getTopCompanies = async (req, res) => {
  try {
    const companies = await Employee.find().limit(10);
    res.status(200).json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

// Get employee profile
exports.getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest applications for jobs posted by employee
exports.getLatestApplications = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const jobs = await Job.find({ postedBy: employeeId }).select("_id title");

    if (!jobs.length) {
      return res.status(404).json({ message: "No jobs found for this employer" });
    }
    const jobIds = jobs.map((job) => job._id);
    const applications = await Applications.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching latest applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all applications for jobs posted by employee
exports.getAllApplications = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const loggedInEmp = await Employee.findById(employeeId);
    if (!loggedInEmp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    let jobs = [];

    const position = loggedInEmp.position?.toLowerCase();
    if (position === "hr" || position === "hr manager") {
      const companyEmployees = await Employee.find(
        { company: loggedInEmp.company },
        "_id"
      );
      const empIds = companyEmployees.map((emp) => emp._id);
      jobs = await Job.find({ postedBy: { $in: empIds } }).select("_id title");
    } else {
      jobs = await Job.find({ postedBy: employeeId }).select("_id title");
    }

    const jobIds = jobs.map((job) => job._id);

    const applications = await Applications.find({ jobId: { $in: jobIds } });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update employee profile
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const { name, email, mobile, company, position } = req.body;
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.company = company || employee.company;
    employee.position = position || employee.position;

    if (req.files?.profile_pic) employee.profile_pic = getFileUrl(req, 'employees', req.files.profile_pic[0]);
    if (req.files?.company_logo) employee.company_logo = getFileUrl(req, 'companies', req.files.company_logo[0]);

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get jobs posted by a specific employee
exports.getJobsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const jobs = await Job.find({ postedBy: employeeId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching employee jobs:", err);
    res.status(500).json({ message: "Server error fetching employee jobs" });
  }
};

// Change PWD
exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;
    await employee.save();

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
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword;
    await employee.save();

    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'Status is required' });

    const application = await Applications.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json(application);
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// HR View Employees
exports.hrViewEmployeesByCompany = async (req, res) => {
  try {
    const { company } = req.params;

    const employees = await Employee.find({ company });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found for this company" });
    }

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by company:", error);
    res.status(500).json({ message: "Server error" });
  }
};