const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define upload directories
const uploadBase = path.join(__dirname, "../uploads");
const folders = {
  employee: path.join(uploadBase, "employees"),
  company: path.join(uploadBase, "companies"),
  jobseeker: path.join(uploadBase, "jobseekers"),
  resume: path.join(uploadBase, "resumes"),
};

// Ensure folders exist
Object.values(folders).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "profile_pic":
        cb(null, folders.employee);
        break;
      case "company_logo":
        cb(null, folders.company);
        break;
      case "jsprofile_pic":
        cb(null, folders.jobseeker);
        break;
      case "resume":
        cb(null, folders.resume);
        break;
      default:
        cb(null, uploadBase);
    }
  },

  filename: (req, file, cb) => {
    let prefix;

    switch (file.fieldname) {
      case "profile_pic":
        prefix = "employee";
        break;
      case "company_logo":
        prefix = "company";
        break;
      case "jsprofile_pic":
        prefix = "jobseeker";
        break;
      case "resume":
        prefix = "resume";
        break;
      default:
        prefix = "file";
    }

    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const resumeTypes = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);

  const isImage = imageTypes.test(ext);
  const isResume = resumeTypes.test(ext);

  if (file.fieldname === "resume" && isResume) {
    cb(null, true);
  } else if (file.fieldname !== "resume" && isImage) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: images (jpg, png, gif) or resumes (pdf, doc, docx)"));
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
