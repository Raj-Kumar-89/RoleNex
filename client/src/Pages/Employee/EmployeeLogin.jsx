import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa6";

function EmployeeLogin() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employees/login`,
        { email: loginEmail, password: loginPassword }
      );
      if (res.data.token && res.data.employee) {
        localStorage.setItem("empToken", res.data.token);
        localStorage.setItem("empData", JSON.stringify(res.data.employee));
        navigate("/employeeprofile");
      } else {
        setError("Login failed. Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="emp-page-wrapper">
        {/* Left info panel */}
        <div className="emp-page-info">
          <h1 className="emp-page-tagline">Hire the Best Talent</h1>
          <p className="emp-page-desc">
            Welcome back, Employer! Sign in to manage your job postings, review
            applications, and connect with top candidates actively seeking
            opportunities at companies like yours.
          </p>
          <ul className="emp-page-features">
            <li><FaCheck /> Post unlimited jobs</li>
            <li><FaCheck /> Review and manage applications</li>
            <li><FaCheck /> Update application statuses in real time</li>
            <li><FaCheck /> Build your company profile</li>
          </ul>
        </div>

        {/* Right card */}
        <div className="emp-card">
          <div className="emp-card-header">
            <h2 className="emp-card-title">Employer Sign In</h2>
            <p className="emp-card-subtitle">Access your employer / HR dashboard</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="emp-form">
            <div className="emp-form-group">
              <label htmlFor="emp-email">Email Address</label>
              <input id="emp-email" type="email" placeholder="work@company.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>
            <div className="emp-form-group">
              <label htmlFor="emp-password">Password</label>
              <input id="emp-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <span className="emplogin-toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
            </div>

            <div className="emp-forgotpwd-link">
              <Link to="/employeeforgotpassword">Forgot your password?</Link>
            </div>

            <button type="submit" className="emp-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="empregister-switch-text">
            Don't have an account?{" "}
            <Link to="/employeeregister" className="empregister-switch-link">
              Register as Employer
            </Link>
          </p>

          <div className="auth-divider"><span>or</span></div>
          <p className="emp-jobseekerlogin-link">
            Are you a Job Seeker?{" "}
            <Link to="/jobseekerlogin">Login as Job Seeker </Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EmployeeLogin;