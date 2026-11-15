import { Link, useNavigate } from "react-router-dom";
import useNavMenu from "../hooks/useNavMenu";

function EmpHeader() {
  const navigate = useNavigate();
  const { menuOpen, closeMenu, toggleMenu } = useNavMenu();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("empToken");
      localStorage.removeItem("empData");
      navigate("/employeelogin");
    }
    closeMenu();
  };

  return (
    <>
      <header className="page-header">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <div className="logo">
            Role<span className="logo-accent">Nex</span>
          </div>
        </Link>

        <button type="button" className="hamburger-btn" onClick={toggleMenu} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="employer-navigation" >
          <span className={`hamburger-icon ${menuOpen ? "open" : ""}`} />
        </button>

        <nav id="employer-navigation" className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`} >
          <ul className="nav-links">
            <li className="nav-link">
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-link">
              <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
            </li>
            <li className="nav-link">
              <Link to="/companies" onClick={closeMenu}>Companies</Link>
            </li>
            <li className="nav-link">
              <Link to="/postingjobs" onClick={closeMenu}>Post Job</Link>
            </li>
            <li className="nav-link">
              <Link to="/postedjobs" onClick={closeMenu}>Posted Jobs</Link>
            </li>
            <li className="nav-link">
              <Link to="/employeeviewapplications" onClick={closeMenu}>
                Applications
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/about" onClick={closeMenu}>About Us</Link>
            </li>
            <li className="nav-link">
              <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
            </li>
            <li className="nav-link">
              <Link to="/employeeprofile" onClick={closeMenu}>My Profile</Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </>
  );
}

export default EmpHeader;