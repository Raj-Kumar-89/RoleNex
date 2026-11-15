import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaHome, FaInfoCircle, FaUsers, FaBriefcase, FaBuilding, FaUserTie, FaFileAlt, FaEnvelope, FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes } from "react-icons/fa";
import defaultAvatar from "../../assets/default-avatar.png";

function AdminDashboard() {
  const adminData = JSON.parse(localStorage.getItem("adminData")) || {};
  const adminName = adminData.username || adminData.name || "Admin";
  const token = localStorage.getItem("adminToken");

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    employees: 0,
    jobseekers: 0,
    applications: 0,
    unreadMessages: 0,
  });

  const [employeesList, setEmployeesList] = useState([]);
  const [jobseekersList, setJobseekersList] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingJobseekers, setLoadingJobseekers] = useState(true);
  const [loading, setLoading] = useState(true);

  const [errorEmployees, setErrorEmployees] = useState("");
  const [errorJobseekers, setErrorJobseekers] = useState("");

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const employeesCount = res.data.employeesCount || 0;
      const jobseekersCount = res.data.jobseekersCount || 0;
      const jobsCount = res.data.jobsCount || 0;
      const applicationsCount = res.data.applicationsCount || 0;
      const unreadMessagesCount = res.data.unreadMessagesCount || 0;

      setStats({
        users: employeesCount + jobseekersCount,
        employees: employeesCount,
        jobseekers: jobseekersCount,
        jobs: jobsCount,
        applications: applicationsCount,
        unreadMessages: unreadMessagesCount,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/latestemployees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployeesList(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setErrorEmployees("Failed to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchJobseekers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/latestjobseekers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobseekersList(res.data);
    } catch (err) {
      console.error("Failed to fetch jobseekers:", err);
      setErrorJobseekers("Failed to load jobseekers");
    } finally {
      setLoadingJobseekers(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/adminlogin");
      return;
    }

    fetchStats();
    fetchEmployees();
    fetchJobseekers();
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/contactmessages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const unread = res.data.filter((msg) => msg.status === "Unread").length;
        setUnreadCount(unread);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
      });
  }, [location.pathname]);

  // Close the mobile sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close the mobile sidebar with the Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/adminlogin");
    }
  };

  const navItems = [
    { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/", icon: <FaHome />, label: "Home" },
    { to: "/jobs", icon: <FaBriefcase />, label: "Jobs" },
    { to: "/companies", icon: <FaBuilding />, label: "Companies" },
    { to: "/manageemployees", icon: <FaUserTie />, label: "Employees" },
    { to: "/managejobseekers", icon: <FaUsers />, label: "JobSeekers" },
    { to: "/viewapplications", icon: <FaFileAlt />, label: "Applications" },
    { to: "/managecontact", icon: <FaEnvelope />, label: "Contact Messages", badge: unreadCount },
    { to: "/about", icon: <FaInfoCircle />, label: "About Us" },
  ];

  const statCards = [
    { icon: <FaUsers />, label: "Total Users", value: stats.users, color: "#3b82f6" },
    { icon: <FaBriefcase />, label: "Jobs", value: stats.jobs, color: "#8b5cf6" },
    { icon: <FaUserTie />, label: "Employees", value: stats.employees, color: "#06b6d4" },
    { icon: <FaBuilding />, label: "Job Seekers", value: stats.jobseekers, color: "#10b981" },
    { icon: <FaFileAlt />, label: "Applications", value: stats.applications, color: "#f59e0b" },
    { icon: <FaEnvelope />, label: "Unread Msgs", value: stats.unreadMessages, color: "#ef4444" },
  ];

  return (
    <section className="admin-dashboard">
      {/* Navbar */}
      <div className="admin-dashboard-navbar">
        <div className="admin-dashboard-navbar-left">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen} >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="admin-dashboard-title">{adminName}'s Dashboard</h1>
        </div>
        <div className="admin-dashboard-user-info">
          <span className="admin-dashboard-username">Hello, {adminName}</span>
          <button onClick={handleLogout} className="admin-dashboard-logout-button">
            <FaSignOutAlt /> <span className="admin-logout-text">Logout</span>
          </button>
        </div>
      </div>

      <div className="admin-dashboard-body">
        {/* Overlay behind the mobile sidebar */}
        <div
          className={`admin-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className={`admin-leftpanel ${sidebarOpen ? "open" : ""}`}>
          <img src={defaultAvatar} alt="Admin Avatar" className="admin-avatar" />
          <h2>{adminName}</h2>
          <div className="admin-navs">
            <ul className="admin-uplinks">
              {navItems.map(({ to, icon, label, badge }) => (
                <li key={to} className={location.pathname === to ? "active-nav" : ""}>
                  <Link to={to}>
                    <span className="admin-sidebar-icon">{icon}</span>
                    <span>{label}</span>
                    {badge > 0 && <span className="admin-sidebar-badge">{badge}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="admin-logout">
              <li onClick={handleLogout}>
                <FaSignOutAlt className="admin-sidebar-icon" /> <span>Logout</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="admin-rightpanel">
          {/* Stats Cards */}
          <div className="admin-cardspanel">
            {statCards.map(({ icon, label, value, color }) => (
              <div className="admin-card" key={label}>
                <div className="admin-card-header" style={{ color }}>
                  <span className="admin-card-icon" style={{ color }}>{icon}</span>
                  <h2>{label}</h2>
                </div>
                <hr />
                <div className="admin-card-body" style={{ color }}>
                  {loading ? "—" : value}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Employees List */}
          <div className="admin-user-details-card">
            <div className="admin-section-header">
              <h2 className="admin-card-header">Recent Employees</h2>
              <Link to="/manageemployees" className="admin-view-all">View All →</Link>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-users-table">
                <thead>
                  <tr><th>S.No</th><th>Name</th><th>Email</th><th>Company</th><th>Position</th><th>Mobile</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="admin-table-message">Loading...</td></tr>
                  ) : employeesList.length > 0 ? (
                    employeesList.map((emp, i) => (
                      <tr key={emp._id}>
                        <td>{i + 1}</td><td>{emp.name}</td><td>{emp.email}</td>
                        <td>{emp.company}</td><td>{emp.position}</td><td>{emp.mobile}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="admin-table-message">No employees found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent JobSeekers */}
          <div className="admin-user-details-card">
            <div className="admin-section-header">
              <h2 className="admin-card-header">Recent Job Seekers</h2>
              <Link to="/managejobseekers" className="admin-view-all">View All →</Link>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-users-table">
                <thead>
                  <tr><th>S.No</th><th>Name</th><th>Email</th><th>Mobile</th><th>Address</th><th>Skills</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="admin-table-message">Loading...</td></tr>
                  ) : jobseekersList.length > 0 ? (
                    jobseekersList.map((js, i) => (
                      <tr key={js._id}>
                        <td>{i + 1}</td><td>{js.name}</td><td>{js.email}</td>
                        <td>{js.mobile}</td><td>{js.address}</td><td>{js.skills}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="admin-table-message">No job seekers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;