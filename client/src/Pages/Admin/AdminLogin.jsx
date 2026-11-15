import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaShieldAlt, FaCheck } from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify({
        id: res.data.admin.id,
        email: res.data.admin.email,
        username: res.data.admin.username,
      }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally { setLoading(false); }
  };


  return (
    <>
      <Header />

      <div className="adminlogin-page-wrapper">
        
        {/* Left info panel */}
        <div className="adminlogin-page-info">
          <h2 className="adminlogin-page-tagline">Admin Control Panel</h2>
          <p className="adminlogin-page-desc">
            Access the RoleNex admin dashboard to oversee platform operations,
            manage users, review applications, and handle contact inquiries.
          </p>
          <ul className="adminlogin-page-features">
            <li><FaCheck /> Manage all employees and job seekers</li>
            <li><FaCheck /> View platform statistics at a glance</li>
            <li><FaCheck /> Review and filter all job applications</li>
            <li><FaCheck /> Handle contact form messages</li>
          </ul>
          <div className="adminlogin-security-note">
            <FaShieldAlt className="adminlogin-security-icon" />
            <span>This is a restricted area. Unauthorized access is prohibited.</span>
          </div>
        </div>

        {/* Right login card */}
        <div className="adminlogin-card">
          <div className="adminlogin-card-header">
            <h2 className="adminlogin-card-title">Administrator Login</h2>
            <p className="adminlogin-card-subtitle">Sign in with your admin credentials</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="adminlogin-form">
            <div className="adminlogin-form-group">
              <label htmlFor="admin-email">
                <FaUser style={{ marginRight: 6, color: "#64748b" }} /> Email Address
              </label>
              <input
                id="admin-email" type="email" placeholder="admin@RoleNex.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>

            <div className="adminlogin-form-group">
              <label htmlFor="admin-password">
                <FaLock style={{ marginRight: 6, color: "#64748b" }} /> Password
              </label>
              <div className="adminlogin-password-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password" >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="adminlogin-submit-btn admin-submit-btn"
              disabled={loading} >
              {loading ? "Signing in..." : "Sign In as Admin"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminLogin;