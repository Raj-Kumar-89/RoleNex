import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa6";

function EmployeeRegister() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    company: "", position: "", mobile: "",
  });
  const [companyLogo, setCompanyLogo] = useState(null);
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
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("company", form.company);
      formData.append("position", form.position);
      formData.append("mobile", form.mobile);
      if (companyLogo) formData.append("company_logo", companyLogo);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employees/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/employeelogin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
          <h2 className="emp-page-tagline">Start Hiring Great Talent</h2>
          <p className="emp-page-desc">
            Register your company on RoleNex and get instant access to thousands of
            qualified job seekers. Post jobs, manage applications, and build your
            team - all in one place.
          </p>
          <ul className="emp-page-features">
            <li><FaCheck /> Free employer registration</li>
            <li><FaCheck /> Post jobs and get applicants fast</li>
            <li><FaCheck /> Manage all applications from one dashboard</li>
            <li><FaCheck /> Company profile visible to all job seekers</li>
          </ul>
        </div>

        {/* Right card */}
        <div className="emp-card emp-card-register">
          <div className="emp-card-header">
            <h2 className="emp-card-title">Create Employer Account</h2>
            <p className="emp-card-subtitle">Register your company on RoleNex — it's free!</p>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}

          <form onSubmit={handleRegister} className="emp-form">
            <div className="emp-form-row">
              <div className="emp-form-group">
                <label>Full Name <span className="required-star">*</span></label>
                <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="emp-form-group">
                <label>Mobile Number <span className="required-star">*</span></label>
                <input name="mobile" type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={handleChange} required />
              </div>
            </div>

            <div className="emp-form-group">
              <label>Work Email Address <span className="required-star">*</span></label>
              <input name="email" type="email" placeholder="work@company.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="emp-form-row">
              <div className="emp-form-group">
                <label>Password <span className="required-star">*</span></label>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                <span className="empregister-toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              <div className="emp-form-group">
                <label>Confirm Password <span className="required-star">*</span></label>
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />                
                <span className="empregister-toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
            </div>

            <div className="emp-form-row">
              <div className="emp-form-group">
                <label>Company Name <span className="required-star">*</span></label>
                <input name="company" type="text" placeholder="e.g. Tech Solutions Ltd." value={form.company} onChange={handleChange} required />
              </div>
              <div className="emp-form-group">
                <label>Your Position <span className="required-star">*</span></label>
                <input name="position" type="text" placeholder="e.g. HR Manager" value={form.position} onChange={handleChange} required />
              </div>
            </div>

            <div className="emp-form-group">
              <label>Company Logo (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setCompanyLogo(e.target.files[0])} className="emp-file-input" />
              <span className="emp-field-hint">PNG, JPG up to 2MB</span>
            </div>

            <button type="submit" className="emp-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Employer Account"}
            </button>
          </form>

          <p className="emplogin-switch-text">
            Already have an account?{" "}
            <Link to="/employeelogin" className="emplogin-switch-link">Sign In</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EmployeeRegister;