import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";

function ManageJobSeeker() {
  const [jobseekersList, setJobseekersList] = useState([]);
  const [loadingJobseekers, setLoadingJobseekers] = useState(true);
  const [errorJobseekers, setErrorJobseekers] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchJobseekers();
  }, [token]);

  const fetchJobseekers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/jobseekers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobseekersList(res.data);
      setLoadingJobseekers(false);
    } catch (err) {
      console.error("Failed to fetch jobseekers:", err);
      setErrorJobseekers("Failed to load jobseekers");
      setLoadingJobseekers(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this jobseeker?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/jobseekers/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobseekersList(jobseekersList.filter((js) => js._id !== id));
      } catch (err) {
        console.error("Failed to delete jobseeker:", err);
        alert("Failed to delete jobseeker");
      }
    }
  };

  return (
    <>
        <AdminHeader/>

        <div className="admin-managejobseekerandemp-card">
          <h2 className="admin-managejobseekerandemp-card-header-title">JobSeekers List</h2>
          <div className="admin-managejobseekerandemp-card-body">
            {loadingJobseekers ? (
              <p>Loading jobseekers...</p>
            ) : errorJobseekers ? (
              <p className="admin-error">{errorJobseekers}</p>
            ) : (
              <table className="admin-managejobseekerandemp-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Skills</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobseekersList.length > 0 ? (
                    jobseekersList.map((js, index) => (
                      <tr key={js._id}>
                        <td>{index + 1}</td>
                        <td>{js.name}</td>
                        <td>{js.email}</td>
                        <td>{js.mobile}</td>
                        <td>{js.address}</td>
                        <td>{js.skills}</td>
                        <td><button className="delete-button" onClick={() => handleDelete(js._id)}>Delete</button></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">No jobseekers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <Footer/>
    </>
  );    
}

export default ManageJobSeeker;