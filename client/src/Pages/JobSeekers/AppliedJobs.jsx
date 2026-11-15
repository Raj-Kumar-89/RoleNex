import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Jsheader from "../../components/Jsheader";
import Footer from "../../components/Footer";

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();

  const fetchAppliedJobs = async (jobseekerId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobseekers/allapplied/${jobseekerId}`
      );
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jsToken");
    const jsData = localStorage.getItem("jsData");

    if (!token || !jsData) {
      navigate("/jobseekerlogin");
      return;
    }

    const { id } = JSON.parse(jsData);
    fetchAppliedJobs(id);
  }, [navigate]);

  return (
    <>
      <Jsheader />

      <section className="js-applied-jobs-container">
        <h1 className="js-applied-jobs-title">Jobs Applied By You</h1>
        {appliedJobs.length > 0 && (
          <div className="js-applied-jobs-summary">
            You have applied to{" "}
            <strong className="js-applied-jobs-count">{appliedJobs.length}</strong>{" "}
            {appliedJobs.length === 1 ? "job" : "jobs"}.
          </div>
        )}

        <div className="js-job-appliedlist-container">
          {appliedJobs.length === 0 ? (
            <p>No jobs applied yet.</p>
          ) : (
            <table className="js-job-appliedlist-table">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Applied Job</th>
                  <th>Company</th>
                  <th>Salary</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Contact Email</th>
                </tr>
              </thead>

              <tbody>
                {appliedJobs.map((job, index) => (
                  <tr key={job._id}>
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Applied Job">{job.jobTitle}</td>
                    <td data-label="Company">{job.company}</td>
                    <td data-label="Salary">{job.salary}</td>
                    <td data-label="Applied">{new Date(job.createdAt).toLocaleDateString("en-GB")}</td>
                    <td data-label="Status"><span className={`js-status ${job.status?.toLowerCase()}`}>{job.status}</span></td>
                    <td data-label="Contact">{job.contactEmail}</td>
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

export default AppliedJobs;