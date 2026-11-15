import React, { useState } from "react";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import EmpHeader from "../components/EmpHeader";
import JsHeader from "../components/Jsheader";
import Footer from "../components/Footer";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaClock, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";

function ContactUs() {
    
  const adminToken = localStorage.getItem("adminToken");
  const jsToken = localStorage.getItem("jsToken");
  const empToken = localStorage.getItem("empToken");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to send message.");
      } else {
        setSuccessMsg(data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      { adminToken ? ( <AdminHeader /> ) : jsToken ? ( <JsHeader /> ) : empToken ? ( <EmpHeader /> ) : ( <Header /> ) }

      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-intro">
          Have a question, feedback, or need help? We'd love to hear from you.
          Fill out the form and our team will get back to you as soon as possible.
        </p>

        <div className="contact-grid">
          {/* Contact Info Panel */}
          <div className="contact-info">
            <h2 className="contact-subtitle">Get in Touch</h2>

            <div className="contact-info-item">
              <span className="contact-info-icon"><MdEmail /></span>
              <div>
                <strong>Email</strong>
                <p><a href="#">support@RoleNex.com</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-icon"><FaPhoneAlt /></span>
              <div>
                <strong>Phone</strong>
                <p><a href="#">+91 1234567890</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-icon"><IoMdPin /></span>
              <div>
                <strong>Address</strong>
                <p>123 RoleNex Street, Tech City, India - 600001</p>
              </div>
            </div>

            <div className="contact-social">
              <p><strong>Follow Us</strong></p>
              <div className="contact-social-links">
                <a href="#" className="contact-social-btn"><FaLinkedin />LinkedIn</a>
                <a href="#" className="contact-social-btn"><FaTwitter />Twitter</a>
                <a href="#" className="contact-social-btn"><FaInstagram />Instagram</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2 className="contact-subtitle">Send a Message</h2>

            {successMsg && (
              <div className="contact-alert contact-alert-success">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="contact-alert contact-alert-error">
                {errorMsg}
              </div>
            )}

            <div className="contact-form">
              <div className="contact-form-group">
                <label htmlFor="name">Full Name <span className="required-star">*</span></label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email">Email Address <span className="required-star">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject <span className="required-star">*</span></label>
                <select id="subject" name="subject" required value={formData.subject} onChange={handleChange} >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Job Seeker Support">Job Seeker Support</option>
                  <option value="Employer / HR Support">Employer / HR Support</option>
                  <option value="Report a Bug">Report a Bug</option>
                  <option value="Account Issue">Account Issue</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Message <span className="required-star">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button className="contact-submit-btn" onClick={handleSubmit} disabled={loading} >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactUs;