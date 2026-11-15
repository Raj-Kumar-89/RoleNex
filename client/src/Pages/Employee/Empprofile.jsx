import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultAvatar from "../../assets/default-avatar.png"
import { FaPencilAlt } from "react-icons/fa";
import EmpHeader from '../../components/EmpHeader';
import Footer from "../../components/Footer";

function Empprofile() {
  const [employee, setEmployee] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const getFullUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}/${path}`;
  };

  const getFullResumeUrl = (path) => {
    if (!path) return null;
    const cleanedPath = path.startsWith('/') ? path.substring(1) : path;
    return `${import.meta.env.VITE_API_URL}/${cleanedPath}`;
  };

  useEffect(() => {
    const empData = localStorage.getItem('empData');
    const token = localStorage.getItem('empToken');

    if (!empData || !token) {
      navigate('/employeelogin');
      return;
    }

    const { id } = JSON.parse(empData);

    // Fetch employee profile
    axios.get(`${import.meta.env.VITE_API_URL}/api/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const data = res.data;
        setEmployee({
          id: data._id,
          profilePic: getFullUrl(data.profile_pic) || defaultAvatar,
          companyLogo: getFullUrl(data.company_logo),
          name: data.name,
          email: data.email,
          company: data.company,
          position: data.position,
          contact: data.mobile,
        });
        setEditData(data);
      })
      .catch((err) => {
        console.error('Error fetching employee:', err);
        setError('Failed to load profile');
      });

    // Fetch job applications
    axios.get(`${import.meta.env.VITE_API_URL}/api/employees/${id}/latestapplications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setApplications(res.data))
      .catch((err) => console.error('Error fetching applications:', err));
  }, [navigate]);

  // Close the edit modal with the Escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => e.key === 'Escape' && setIsModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setEditData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('empToken');
    const formData = new FormData();

    for (const key in editData) {
      formData.append(key, editData[key]);
    }

    axios.put(`${import.meta.env.VITE_API_URL}/api/employees/${employee.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        const data = res.data;
        setEmployee({
          ...employee,
          profilePic: getFullUrl(data.profile_pic) || defaultAvatar,
          companyLogo: getFullUrl(data.company_logo),
          name: data.name,
          email: data.email,
          company: data.company,
          position: data.position,
          contact: data.mobile,
        });
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('empData');
      localStorage.removeItem('empToken');
      navigate('/employeelogin');
    }
  };

  // update application status
  const handleStatusChange = async (applicationId, newStatus) => {
    const token = localStorage.getItem('empToken');
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/employees/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      alert('Application status updated successfully!');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update application status.');
    }
  };

  if (error) return <p className="empprofile-error">{error}</p>;
  if (!employee) return <p className="empprofile-loading">Loading profile...</p>;

  return (
    <>
      <EmpHeader />

      <div className="empprofile-container">
        <aside className="empprofile-sidebar">
          <div className="empprofile-profile-section">
            <div className="empprofile-profile-pic-wrapper">
              <img src={employee.profilePic} alt="Profile" className="empprofile-profile-pic" />
              <button
                type="button"
                className="empprofile-edit-icon"
                onClick={() => setIsModalOpen(true)}
                aria-label="Edit profile"
              >
                <FaPencilAlt />
              </button>
            </div>
            <h2 className="empprofile-profile-name">{employee.name}</h2>
          </div>

          <div className="empprofile-profile-details">
            <p className="empprofile-detail"><strong>Email:</strong> {employee.email}</p>
            <p className="empprofile-detail"><strong>Company:</strong> {employee.company}</p>
            <p className="empprofile-detail"><strong>Position:</strong> {employee.position}</p>
            <p className="empprofile-detail"><strong>Contact:</strong> {employee.contact}</p>
          </div>

          <ul className="empprofile-sidebar-links">
            <h2 className="empprofile-links-title">Links</h2>
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/">Home</Link></li>
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/postingjobs">Post Job</Link></li>
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/empprofile">My Profile</Link></li>
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/postedjobs">View Posted Jobs</Link></li>
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/employeeviewapplications">View Applications</Link></li>
            {(employee.position?.toLowerCase() === 'hr' || employee.position?.toLowerCase() === 'hr manager') && (
              <li className="empprofile-link-item"><Link className="empprofile-link" to="/hrviewemployee">View Employees</Link></li>
            )}
            <li className="empprofile-link-item"><Link className="empprofile-link" to="/empchangepassword">Change Password</Link></li>
            <li className="empprofile-link-item empprofile-logout-item">
              <button className="empprofile-logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </aside>

        <main className="empprofile-main-content">
          <h1 className="empprofile-welcome">Welcome, {employee.name}!</h1>
          <p className="empprofile-instruction">This is your employee dashboard. From here, you can post new jobs, view and manage posted jobs, view and manage applications, update your profile and change password.</p>

          <section className="empprofile-job-applications">
            <h2 className="empprofile-application-title">Manage Applications</h2>
            {applications.length === 0 ? (
              <p className="empprofile-no-apps">No applications yet.</p>
            ) : (
              <div className="empprofile-table-wrap">
                <table className="empprofile-table">
                  <thead className="empprofile-thead">
                    <tr className="empprofile-tr">
                      <th className="empprofile-th">Job Title</th>
                      <th className="empprofile-th">Applicant Name</th>
                      <th className="empprofile-th">Qualification</th>
                      <th className="empprofile-th">Email</th>
                      <th className="empprofile-th">Resume</th>
                      <th className="empprofile-th">Status</th>
                    </tr>
                  </thead>
                  <tbody className="empprofile-tbody">
                    {applications.map((app) => (
                      <tr key={app._id} className="empprofile-tr">
                        <td className="empprofile-td" data-label="Job Title">{app.jobTitle}</td>
                        <td className="empprofile-td" data-label="Applicant">{app.name}</td>
                        <td className="empprofile-td" data-label="Qualification">{app.qualification}</td>
                        <td className="empprofile-td" data-label="Email">{app.email}</td>
                        <td className="empprofile-td" data-label="Resume">
                          {app.resume ? (
                            <a href={getFullResumeUrl(app.resume)} target="_blank" rel="noreferrer" className="empprofile-resume-link">View Resume</a>
                          ) : 'N/A'}
                        </td>
                        <td className="empprofile-td" data-label="Status">
                          <select className="empprofile-status-select" value={app.status || 'Pending'} onChange={(e) => handleStatusChange(app._id, e.target.value)} disabled={app.status && app.status !== 'Pending'}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {isModalOpen && (
          <div className="empprofile-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="empprofile-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="empprofile-modal-title">Edit Profile</h2>

              <label className="empprofile-modal-label">Name:</label>
              <input className="empprofile-modal-input" type="text" name="name" value={editData.name || ''} onChange={handleInputChange} />

              <label className="empprofile-modal-label">Email:</label>
              <input className="empprofile-modal-input" type="email" name="email" value={editData.email || ''} onChange={handleInputChange} />

              <label className="empprofile-modal-label">Profile Picture:</label>
              <input className="empprofile-modal-input" type="file" name="profile_pic" onChange={handleInputChange} />

              <label className="empprofile-modal-label">Company:</label>
              <input className="empprofile-modal-input" type="text" name="company" value={editData.company || ''} onChange={handleInputChange} />

              <label className="empprofile-modal-label">Position:</label>
              <input className="empprofile-modal-input" type="text" name="position" value={editData.position || ''} onChange={handleInputChange} />

              <label className="empprofile-modal-label">Mobile:</label>
              <input className="empprofile-modal-input" type="text" name="mobile" value={editData.mobile || ''} onChange={handleInputChange} />

              <label className="empprofile-modal-label">Company Logo:</label>
              <input className="empprofile-modal-input" type="file" name="company_logo" onChange={handleInputChange} />

              <div className="empprofile-modal-buttons">
                <button className="empprofile-modal-update-btn" onClick={handleUpdate}>Update</button>
                <button className="empprofile-modal-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Empprofile;