import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEye,FaEyeSlash } from "react-icons/fa6";

function JobSeekerLogin() {
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobseekers/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.data.token && res.data.jobseeker) {
        localStorage.setItem("jsToken", res.data.token);
        localStorage.setItem("jsData", JSON.stringify(res.data.jobseeker));
        navigate("/jobseekersprofile");
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

      <div className="jobseekerlogin-page-wrapper">
        {/* Info panel */}
        <div className="jobseekerlogin-page-info">
          <h1 className="jobseekerlogin-page-tagline">Find Your Dream Job Today</h1>
          <p className="jobseekerlogin-page-desc">
            Join thousands of job seekers who have landed their dream careers through RoleNex.
            Sign in to track your applications, discover new opportunities, and manage your profile.
          </p>
          <ul className="jobseekerlogin-page-features">
            <li><FaCheck /> Browse thousands of job listings</li>
            <li><FaCheck /> Apply with one click</li>
            <li><FaCheck /> Track your application status</li>
            <li><FaCheck /> Get notified about new matches</li>
          </ul>
        </div>

        <div className="jobseekerlogin-card">
          <div className="jobseekerlogin-card-header">
            <h2 className="jobseekerlogin-card-title">Welcome Back!</h2>
            <p className="jobseekerlogin-card-subtitle">Sign in to your Job Seeker account</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={handleLogin} className="jobseekerlogin-form">
            <div className="jobseekerlogin-form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>
            <div className="jobseekerlogin-form-group">
              <label htmlFor="password">Password</label>
              <div className="jobseeker-password-wrap">
                <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                <button
                  type="button"
                  className="jobseekerlogin-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="jobseekerlogin-forgot">
              <Link to="/jobseekerforgotpassword">Forgot your password?</Link>
            </div>

            <button type="submit" className="jobseekerlogin-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="jobseekerlogin-switch-text">
            Don't have an account?{" "}
            <Link to="/jobseekerregister" className="jobseekerlogin-switch-link">Create Account</Link>
          </p>

          <div className="auth-divider"><span>or</span></div>
          <p className="jobseekerlogin-employer-link">
            Are you an Employer?{" "}
            <Link to="/employeelogin">Login as Employer</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default JobSeekerLogin;