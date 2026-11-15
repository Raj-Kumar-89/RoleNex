const Job = require("../models/Job");
const Employee = require("../models/Emp");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Search jobs by title
exports.searchJobs = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title || !title.trim()) return res.status(200).json([]);

    const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    const jobs = await Job.find({
      title: { $regex: escapeRegex(title.trim()), $options: "i" },
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error searching jobs:", err);
    res.status(500).json({ error: "Search failed" });
  }
};


// Get latest jobs
exports.getLatestJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching latest jobs:", err);
    res.status(500).json({ error: "Could not fetch latest jobs" });
  }
};

// Get top companies
exports.getTopCompanies = async (req, res) => {
  try {
    const companies = await Employee.aggregate([
      {
        $group: {
          _id: "$company",
          company_logo: { $first: "$company_logo" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          company_logo: 1
        }
      },
      { $limit: 10 }
    ]);

    res.json(companies);
  } catch (error) {
    console.error("Error fetching top companies:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Jobs By Category
exports.getCategoryJobs=async (req, res) => {
  try {
    const { category } = req.query;
    const jobs = await Job.find({ category });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category jobs" });
  }
};

// Get all companies with full details (for Companies page)
exports.getCompanies = async (req, res) => {
  try {
    // Aggregate unique companies from Employee collection
    const companyGroups = await Employee.aggregate([
      {
        $group: {
          _id: "$company",
          name: { $first: "$company" },
          image: { $first: "$company_logo" },
          employeeCount: { $sum: 1 },
        },
      },
      { $sort: { name: 1 } },
    ]);

    // For each company, get open jobs
    const companiesWithDetails = await Promise.all(
      companyGroups.map(async (company) => {
        const jobs = await Job.find({ company: company.name })
          .select("title type location salary")
          .lean();

        return {
          name: company.name,
          image: company.image,
          employeeCount: company.employeeCount,
          jobCount: jobs.length,
          openJobs: jobs,
          description: `${company.name} currently has ${jobs.length} open job listing(s). They employ ${company.employeeCount} registered HR/employee(s) on our platform.`,
        };
      })
    );

    res.json(companiesWithDetails);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};