import { Link, useNavigate } from "react-router-dom";
import useNavMenu from "../hooks/useNavMenu";

function AdminHeader() {
  const navigate = useNavigate();
  const { menuOpen, closeMenu, toggleMenu } = useNavMenu();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/adminlogin");
    }
    closeMenu();
  };

  return (
    <>
      <header className="page-header">
        <Link to="/dashboard" className="logo-link" onClick={closeMenu}>
          <div className="logo">
            Role<span className="logo-accent">Nex</span>
          </div>
        </Link>

        <button type="button" className="hamburger-btn" onClick={toggleMenu} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="admin-navigation" >
          <span className={`hamburger-icon ${menuOpen ? "open" : ""}`} />
        </button>

        <nav id="admin-navigation" className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`} >
          <ul className="nav-links">
            <li className="nav-link">
              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            </li>
            <li className="nav-link">
              <Link to="/manageemployees" onClick={closeMenu}>Employees</Link>
            </li>
            <li className="nav-link">
              <Link to="/managejobseekers" onClick={closeMenu}>JobSeekers</Link>
            </li>
            <li className="nav-link">
              <Link to="/viewapplications" onClick={closeMenu}>Applications</Link>
            </li>
            <li className="nav-link">
              <Link to="/managecontact" onClick={closeMenu}>Contact Messages</Link>
            </li>
            <li className="nav-link">
              <Link to="/about" onClick={closeMenu}>About Us</Link>
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

export default AdminHeader;