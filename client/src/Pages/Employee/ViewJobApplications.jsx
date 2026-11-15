import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmpHeader from "../../components/EmpHeader";
import Footer from "../../components/Footer";

function ViewJobApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Helper to form full resume URL
  const getFullResumeUrl = (path) => {
    if (!path) return null;
    const cleanedPath = path.startsWith("/") ? path.substring(1) : path;
    return `${import.meta.env.VITE_API_URL}/${cleanedPath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("empToken");
    const empData = localStorage.getItem("empData");

    if (!token || !empData) {
      navigate("/employeelogin");
      return;
    }

    const { id } = JSON.parse(empData);

    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employees/${id}/viewallapplications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching job applications:", err);
        setError("Failed to load applications.");
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <>
      <EmpHeader />
      <section className="emp-applications-container">
        <h1 className="emp-applications-title">Job Applications Received</h1>

        {error && <p className="emp-applications-error">{error}</p>}

        {applications.length > 0 && (
          <div className="emp-applications-summary">
            You have received{" "}
            <strong className="emp-applications-count">{applications.length}</strong>{" "}
            {applications.length === 1 ? "application" : "applications"}.
          </div>
        )}

        <div className="emp-applications-table-container">
          {applications.length === 0 && !error ? (
            <p className="emp-applications-empty">No applications received yet.</p>
          ) : (
            <table className="emp-applications-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Job Title</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app._id}>
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Job Title">{app.jobTitle}</td>
                    <td data-label="Applicant">{app.name}</td>
                    <td data-label="Email">{app.email}</td>
                    <td data-label="Applied">
                      {new Date(app.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`emp-status ${app.status?.toLowerCase()}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td data-label="Resume">
                      {app.resume ? (
                        <a href={getFullResumeUrl(app.resume)} target="_blank" rel="noopener noreferrer" className="emp-resume-link">View</a>
                      ) : (
                        <span>Not Uploaded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ViewJobApplications;