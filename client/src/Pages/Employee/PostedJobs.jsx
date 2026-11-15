import React, { useEffect, useState } from "react";
import { FiMapPin, FiDollarSign, FiTag, FiCalendar } from "react-icons/fi";
import EmpHeader from "../../components/EmpHeader";
import Footer from "../../components/Footer";

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const empData = JSON.parse(localStorage.getItem("empData"));
  const empId = empData?.id;
  const empName = empData?.name;

  useEffect(() => {
    if (!empId) {
      setError("Employee not found. Please login again.");
      setLoading(false);
      return;
    }

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/employees/postedjobs/${empId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      alert("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  return (
    <>
      <EmpHeader />

      <div className="postedjobs-container">
        <h2 className="postedjobs-title">
          Jobs Posted by {empName}
        </h2>

        {loading ? (
          <p className="postedjobs-message">Loading jobs...</p>
        ) : error ? (
          <p className="postedjobs-error">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="postedjobs-message">No jobs found for this employee.</p>
        ) : (
          <ul className="postedjobs-list">
            {jobs.map((job) => (
              <li className="postedjobs-item" key={job._id}>
                <button className="postedjobs-delete-btn" onClick={() => handleDelete(job._id)}>
                  Delete
                </button>

                <h3>{job.title}</h3>

                <p>
                  <FiMapPin />{" "}
                  <span>
                    {job.company} - {job.location}
                  </span>
                </p>

                <p>
                  <FiTag /> <span>{job.category}</span>
                </p>

                <p>
                  <FiDollarSign />{" "}
                  <span>{job.salary || "Not specified"}</span>
                </p>

                <small>
                  <FiCalendar /> Posted on{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Footer />
    </>
  );
}

export default PostedJobs;