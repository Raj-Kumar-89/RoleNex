import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa6";

function JobSeekerRegister() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    mobile: "", address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobseekers/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        address: form.address,
      });
      navigate("/jobseekerlogin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="jobseekerregister-page-wrapper">
        {/* Info panel */}
        <div className="jobseekerregister-page-info">
          <h2 className="jobseekerregister-page-tagline">Start Your Career Journey</h2>
          <p className="jobseekerregister-page-desc">
            Create your free Job Seeker account and take the first step toward landing your dream job. 
            Join a growing community of professionals connecting with top companies.
          </p>
          <ul className="jobseekerregister-page-features">
            <li><FaCheck /> Free to join — always</li>
            <li><FaCheck /> Apply to unlimited jobs</li>
            <li><FaCheck /> Upload your resume</li>
            <li><FaCheck /> Get discovered by top recruiters</li>
          </ul>
        </div>

        <div className="jobseekerregister-card jobseeker-card-register">
          <div className="jobseekerregister-card-header">
            <h2 className="jobseekerregister-card-title">Create Your Account</h2>
            <p className="jobseekerregister-card-subtitle">Join RoleNex as a Job Seeker — it's free!</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={handleRegister} className="jobseekerregister-form">
            <div className="jobseekerregister-form-row">
              <div className="jobseekerregister-form-group">
                <label htmlFor="name">Full Name <span className="required-star">*</span></label>
                <input id="name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="jobseekerregister-form-group">
                <label htmlFor="mobile">Mobile Number <span className="required-star">*</span></label>
                <input id="mobile" name="mobile" type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={handleChange} required />
              </div>
            </div>

            <div className="jobseekerregister-form-group">
              <label htmlFor="email">Email Address <span className="required-star">*</span></label>
              <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="jobseekerregister-form-row">
              <div className="jobseekerregister-form-group">
                <label htmlFor="password">Password <span className="required-star">*</span></label>
                <div className="jobseeker-password-wrap">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                  <button
                    type="button"
                    className="jobseekerregister-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="jobseekerregister-form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required-star">*</span></label>
                <div className="jobseeker-password-wrap">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
                  <button type="button" className="jobseekerregister-toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="jobseekerregister-form-group">
              <label htmlFor="address">Address <span className="required-star">*</span></label>
              <input id="address" name="address" type="text" placeholder="Your city / address" value={form.address} onChange={handleChange} required />
            </div>

            <button type="submit" className="jobseekerregister-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="jobseekerregister-switch-text">
            Already have an account?{" "}
            <Link to="/jobseekerlogin" className="jobseekerregister-switch-link">Sign In</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default JobSeekerRegister;