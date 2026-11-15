import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";

function ViewApplications() {
  const [applications, setApplications] = useState([]);
  const [displayedApps, setDisplayedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (token) fetchAllApplications();
  }, [token]);

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/getallapplications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
      setDisplayedApps(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setDisplayedApps(applications);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/applications/search?term=${encodeURIComponent(searchTerm)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisplayedApps(res.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to search applications!");
    }
  };

  const handleDateFilter = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/applications/datewise?from=${fromDate}&to=${toDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisplayedApps(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications by date:", error);
      alert("Failed to fetch applications!");
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setDisplayedApps(applications);
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-va-container">
        <h2 className="admin-va-title">View Applications</h2>

        <div className="admin-va-filters">
          <div className="admin-va-search-section">
            <input
              type="text"
              placeholder="Search by Job Title or Company"
              className="admin-va-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="admin-va-btn admin-va-btn-primary" onClick={handleSearch}>Search</button>
          </div>

          <div className="admin-va-date-section">
            <div className="admin-va-date-field">
              <label htmlFor="va-from">From:</label>
              <input id="va-from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="admin-va-date-field">
              <label htmlFor="va-to">To:</label>
              <input id="va-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            <div className="admin-va-date-buttons">
              <button className="admin-va-btn admin-va-btn-primary" onClick={handleDateFilter}>View</button>
              <button className="admin-va-btn admin-va-btn-danger" onClick={handleClearFilters}>Clear</button>
            </div>
          </div>
        </div>

        <div className="admin-va-table-wrapper">
          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="admin-va-error">{error}</p>
          ) : displayedApps.length > 0 ? (
            <table className="admin-va-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedApps.map((app, index) => (
                  <tr key={app._id}>
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Job Title">{app.jobTitle || "N/A"}</td>
                    <td data-label="Company">{app.company || "N/A"}</td>
                    <td data-label="Applicant">{app.name || "N/A"}</td>
                    <td data-label="Email">{app.email || "N/A"}</td>
                    <td data-label="Status">
                      <span className={`admin-va-status admin-va-${app.status?.toLowerCase()}`}>
                        {app.status || "Pending"}
                      </span>
                    </td>
                    <td data-label="Applied">{new Date(app.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applications found</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ViewApplications;