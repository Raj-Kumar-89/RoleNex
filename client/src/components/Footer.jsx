import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Role<span className="logo-accent">Nex</span></span>
          <p className="footer-tagline">Connecting talent with opportunity.</p>
        </div>
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Job Seekers</h4>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/jobseekerlogin">Login</Link>
            <Link to="/jobseekerregister">Register</Link>
          </div>
          <div className="footer-col">
            <h4>Employers</h4>
            <Link to="/employeelogin">Employer Login</Link>
            <Link to="/employeeregister">Employer Register</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/companies">Companies</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 RoleNex. All rights reserved. | Designed by <Link to="/adminlogin" className="footer-link">RK</Link></p>
      </div>
    </footer>
  );
}

export default Footer;