import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import axios from "axios";
import defaultAvatar from "../../assets/default-avatar.png"
import Jsheader from "../../components/Jsheader";
import { FaPencilAlt } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";

function JobSeekerProfile() {
  const navigate = useNavigate();
  const [jobseeker, setJobseeker] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    skills: "",
    address: "",
    jsprofile_pic: null,
  });
  
  const getProfilePic = (url) => (url ? url : defaultAvatar);

  // Fetch applied jobs
  const fetchAppliedJobs = async (jobseekerId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobseekers/latestapplied/${jobseekerId}`
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

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/jobseekers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setJobseeker({
          id: data._id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          skills: data.skills,
          address: data.address,
          jsprofile_pic: getProfilePic(data.jsprofile_pic),
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        navigate("/jslogin");
      });

    fetchAppliedJobs(JSON.parse(jsData).id);
  }, [navigate]);

  // Close the edit modal with the Escape key
  useEffect(() => {
    if (!showEditModal) return;
    const onKey = (e) => e.key === "Escape" && setShowEditModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showEditModal]);

  // Toggle edit modal
  const toggleModal = () => {
    if (!showEditModal && jobseeker) {
      setEditData({
        name: jobseeker.name || "",
        email: jobseeker.email || "",
        mobile: jobseeker.mobile || "",
        skills: jobseeker.skills || "",
        address: jobseeker.address || "",
        jsprofile_pic: null,
      });
    }
    setShowEditModal(!showEditModal);
  };

  // Update Profile
  const handleUpdate = async () => {
    const token = localStorage.getItem("jsToken");
    const formData = new FormData();

    for (const key in editData) {
      if (key === "jsprofile_pic" && editData[key]) {
        formData.append("jsprofile_pic", editData[key]);
      } else if (key !== "jsprofile_pic") {
        formData.append(key, editData[key]);
      }
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/jobseekers/${jobseeker.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;
      setJobseeker({
        ...jobseeker,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        skills: data.skills,
        address: data.address,
        jsprofile_pic: getProfilePic(data.jsprofile_pic),
      });

      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (!jobseeker) return <div className="loading">Loading...</div>;

  const approvedJob = appliedJobs.find(job => job.status?.toLowerCase() === "approved");

  return (
    <>
      <Jsheader />
      <section className="jobseekerprofile-section">
        <div className="jsprofile-layout">
          {/* Applied Jobs */}
          <div className="jsapplied-jobs">
            <h3>Applied Jobs</h3>

            {/* Message for approved job*/}
            {approvedJob && (
              <div className="approved-message">
                <FaThumbsUp className="approved-message-icon" />You’re shortlisted for the job <strong>{approvedJob.jobTitle}</strong> at{" "}
                <strong>{approvedJob.company}</strong>!
              </div>
            )}
            

            {appliedJobs.length === 0 ? (
              <p>No jobs applied yet.</p>
            ) : (
              <ul>
                {appliedJobs.map((job) => (
                  <li key={job._id} className="job-item" data-status={job.status}>
                    <strong>{job.jobTitle}</strong>
                    <span>{job.company}</span>
                    <span className={`status ${job.status?.toLowerCase() || "pending"}`}>{job.status || "Pending"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>


          {/* Profile */}
          <div className="jsprofile-card">
            <div className="jsprofileavatar-container">
              <img src={jobseeker.jsprofile_pic} alt="Profile" className="profile-avatar" />
              <button className="jsprofile-edit-icon" onClick={toggleModal} aria-label="Edit profile"><FaPencilAlt /></button>
            </div>

            <h2><strong>Name:</strong> {jobseeker.name || "Jobseeker"}</h2>
            <p><strong>Email:</strong> {jobseeker.email}</p>
            <p><strong>Mobile:</strong> {jobseeker.mobile}</p>
            <p><strong>Skills:</strong> {jobseeker.skills}</p>
            <p><strong>Address:</strong> {jobseeker.address}</p>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="jsprofile-modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="jsprofile-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="jsprofile-modal-title">Edit Profile</h2>
              
              <label htmlFor="profilePicUpload" className="jsprofile-label">Profile Picture</label>
              <input
                type="file"
                id="profilePicUpload"
                accept="image/*"
                className="jsprofile-input"
                onChange={(e) =>
                  setEditData({ ...editData, jsprofile_pic: e.target.files[0] })
                }
              />

              <label className="jsprofile-label">Name</label>
              <input type="text" value={editData.name} className="jsprofile-input" onChange={(e) => setEditData({ ...editData, name: e.target.value })} />

              <label className="jsprofile-label">Email</label>
              <input type="email" value={editData.email} className="jsprofile-input" onChange={(e) => setEditData({ ...editData, email: e.target.value })} />

              <label className="jsprofile-label">Mobile</label>
              <input type="tel" value={editData.mobile} className="jsprofile-input" onChange={(e) => setEditData({ ...editData, mobile: e.target.value })} />

              <label className="jsprofile-label">Skills</label>
              <input type="text" value={editData.skills} className="jsprofile-input" onChange={(e) => setEditData({ ...editData, skills: e.target.value })} />

              <label className="jsprofile-label">Address</label>
              <textarea value={editData.address} className="jsprofile-textarea" onChange={(e) => setEditData({ ...editData, address: e.target.value })} />

              <div className="jsprofile-modal-buttons">
                <button className="jsprofile-save-btn" onClick={handleUpdate}>Save</button>
                <button className="jsprofile-cancel-btn" onClick={toggleModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default JobSeekerProfile;