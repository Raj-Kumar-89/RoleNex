import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function EmpForgotPwd() {
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setMessage({ text: "", type: "" }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" }); return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/employees/resetpwd`, {
        email: form.email, newPassword: form.newPassword,
      });
      setMessage({ text: res.data.message || "Password reset successfully!", type: "success" });
      setForm({ email: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/employeelogin"), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error resetting password.", type: "error" });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <div className="empforgotpwd-page-wrapper">
        <div className="empforgotpwd-page-card">
          <div className="empforgotpwd-page-icon-wrap empforgotpwd-icon-wrap">
            <FaKey className="empforgotpwd-page-icon" />
          </div>
          <h2 className="empforgotpwd-page-title">Reset Password</h2>
          <p className="empforgotpwd-page-subtitle">Enter your registered email and set a new password.</p>

          {message.text && (
            <div className={`pwd-alert ${message.type === "success" ? "pwd-alert-success" : "pwd-alert-error"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="empforgotpwd-form">
            <div className="empforgotpwd-form-group">
              <label><FiMail className="empforgotpwd-icon" /> Registered Email</label>
              <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="empforgotpwd-form-group">
              <label>
                <FaLock className="empforgotpwd-icon" /> New Password
              </label>

              <div className="empforgotpwd-input-wrapper">
                <input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />

                <span className="empforgotpwd-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)} >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="empforgotpwd-form-group">
              <label>
                <FaLock className="empforgotpwd-icon" /> Confirm Password
              </label>

              <div className="empforgotpwd-input-wrapper">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span className="empforgotpwd-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="empforgotpwd-submit-btn emp-submit-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EmpForgotPwd;