const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobseekerRoutes = require("./routes/jobseekerRoutes");
const empRoutes = require("./routes/empRoutes");
const homeRoutes = require("./routes/homeRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (company logos, resumes, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employees",empRoutes)
app.use("/api/jobseekers", jobseekerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
