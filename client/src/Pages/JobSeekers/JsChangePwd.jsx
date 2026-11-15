import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Jsheader from "../../components/Jsheader";
import Footer from "../../components/Footer";

function JsChangePwd() {
  const [form, setForm] = useState({ email: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmNewPwd, setShowConfirmNewPwd] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setMessage({ text: "", type: "" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      setMessage({ text: "New passwords do not match!", type: "error" }); return;
    }
    if (form.newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" }); return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobseekers/changepwd`, {
        email: form.email, currentPassword: form.currentPassword, newPassword: form.newPassword,
      });
      setMessage({ text: res.data.message || "Password changed successfully!", type: "success" });
      setForm({ email: "", currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setTimeout(() => navigate("/jobseekersprofile"), 1800);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error changing password.", type: "error" });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Jsheader />
      <div className="jobseekerchangepwd-page-wrapper">
        <div className="jobseekerchangepwd">
          <div className="jobseekerchangepwd-page-icon-wrap">
            <FaShieldAlt className="jobseekerchangepwd-page-icon" />
          </div>
          <h2 className="jobseekerchangepwd-page-title">Change Password</h2>
          <p className="jobseekerchangepwd-page-subtitle">Update your account password securely.</p>

          {message.text && (
            <div className={`pwd-alert ${message.type === "success" ? "pwd-alert-success" : "pwd-alert-error"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="jobseekerchangepwd-form">
            <div className="jobseekerchangepwd-form-group">
              <label><FiMail className="jobseekerchangepwd-icon" /> Email Address</label>
              <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="jobseekerchangepwd-form-group">
              <label><FaLock className="jobseekerchangepwd-icon" /> Current Password</label>
              <div className="jobseekerchangepwd-input-wrapper">
                <input name="currentPassword" type={showCurrentPwd ? "text" : "password"} placeholder="Current password" value={form.currentPassword} onChange={handleChange} required/>
              
                <span
                  className="jobseekerchangepwd-toggle-icon"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                >
                  {showCurrentPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="jobseekerchangepwd-form-group">
              <label><FaLock className="jobseekerchangepwd-icon" /> New Password</label>
              <div className="jobseekerchangepwd-input-wrapper">
                <input
                  name="newPassword"
                  type={showNewPwd ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              
                <span className="jobseekerchangepwd-toggle-icon" onClick={() => setShowNewPwd(!showNewPwd)} >
                  {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="jobseekerchangepwd-form-group">
              <label><FaLock className="jobseekerchangepwd-icon" /> Confirm New Password</label>
              <div className="jobseekerchangepwd-input-wrapper">
                <input
                  name="confirmNewPassword"
                  type={showConfirmNewPwd ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  required
                />
              
                <span className="jobseekerchangepwd-toggle-icon" onClick={() => setShowConfirmNewPwd(!showConfirmNewPwd)} >
                  {showConfirmNewPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="jobseekerchangepwd-submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default JsChangePwd;