import { Link } from "react-router-dom";
import useNavMenu from "../hooks/useNavMenu";

function Header() {
  const { menuOpen, closeMenu, toggleMenu } = useNavMenu();

  return (
    <>
      <header className="page-header">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <div className="logo">
            Role<span className="logo-accent">Nex</span>
          </div>
        </Link>

        <button type="button" className="hamburger-btn" onClick={toggleMenu} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="public-navigation" >
          <span className={`hamburger-icon ${menuOpen ? "open" : ""}`} />
        </button>

        <nav id="public-navigation" className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`} >
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
              <Link to="/about" onClick={closeMenu}>About Us</Link>
            </li>
            <li className="nav-link">
              <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
            </li>
            <li>
              <Link
                to="/jobseekerlogin"
                className="login-button"
                onClick={closeMenu}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </>
  );
}

export default Header;