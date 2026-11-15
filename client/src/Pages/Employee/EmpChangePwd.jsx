import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import EmpHeader from "../../components/EmpHeader";
import Footer from "../../components/Footer";

function EmpChangePwd() {
  const [form, setForm] = useState({ email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setMessage({ text: "", type: "" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "New passwords do not match!", type: "error" }); return;
    }
    if (form.newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters.", type: "error" }); return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/employees/changepwd`, {
        email: form.email, currentPassword: form.currentPassword, newPassword: form.newPassword,
      });
      setMessage({ text: res.data.message || "Password changed successfully!", type: "success" });
      setForm({ email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/employeeprofile"), 1800);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error changing password.", type: "error" });
    } finally { setLoading(false); }
  };

  return (
    <>
    <EmpHeader/>
    <section title="empChange Password">
      <div className="empchangepwd-page-wrapper">
        <div className="empchangepwd-page-card">
          <div className="empchangepwd-page-icon-wrap empchangepwd-icon-wrap">
            <FaShieldAlt className="empchangepwd-page-icon" />
          </div>
          <h2 className="empchangepwd-page-title">Change Password</h2>
          <p className="empchangepwd-page-subtitle">Update your account password securely.</p>

          {message.text && (
            <div className={`pwd-alert ${message.type === "success" ? "pwd-alert-success" : "pwd-alert-error"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="empchangepwd-form">
            <div className="empchangepwd-form-group">
              <label><FiMail className="empchangepwd-icon" /> Email Address</label>
              <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="empchangepwd-form-group">
              <label>
                <FaLock className="empchangepwd-icon" /> Current Password
              </label>

              <div className="empchangepwd-input-wrapper">
                <input
                  name="currentPassword"
                  type={showCurrentPwd ? "text" : "password"}
                  placeholder="Current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />

                <span className="empchangepwd-toggle-icon" onClick={() => setShowCurrentPwd(!showCurrentPwd)} >
                  {showCurrentPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="empchangepwd-form-group">
              <label>
                <FaLock className="empchangepwd-icon" />New Password
              </label>

              <div className="empchangepwd-input-wrapper">
                <input
                  name="newPassword"
                  type={showNewPwd ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />

                <span className="empchangepwd-toggle-icon" onClick={() => setShowNewPwd(!showNewPwd)} >
                  {showNewPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="empchangepwd-form-group">
              <label>
                <FaLock className="empchangepwd-icon" /> Confirm New Password
              </label>

              <div className="empchangepwd-input-wrapper">
                <input
                  name="confirmPassword"
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span className="empchangepwd-toggle-icon" onClick={() => setShowConfirmPwd(!showConfirmPwd)} >
                  {showConfirmPwd ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="empchangepwd-submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>

    <Footer/>
    </>
  );
}

export default EmpChangePwd;