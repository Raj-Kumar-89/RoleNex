import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import EmpHeader from "../components/EmpHeader";
import JsHeader from "../components/Jsheader";
import Footer from "../components/Footer";

function AboutUs() {
  
    const adminToken = localStorage.getItem("adminToken");
    const jsToken = localStorage.getItem("jsToken");
    const empToken = localStorage.getItem("empToken");

  return (
    <>
      {/* HEADER */}
      { adminToken ? ( <AdminHeader /> ) : jsToken ? ( <JsHeader /> ) : empToken ? ( <EmpHeader /> ) : ( <Header /> ) }

      {/* ABOUT US */}
      <div className="about-container">
        <h1 className="main-title">About Our Job Portal</h1>
        <p className="paragraph">Welcome to <span className="font-semibold">RoleNex</span>, your trusted platform for finding the perfect job and recruiting top talent.</p>
        <p className="paragraph mb-large">Our mission is to bridge the gap between job seekers and employers by providing an easy-to-use, reliable, and fast online job portal.</p>

        <h2 className="section-title">What We Offer</h2>
        <ul className="features-list">
          <li>Thousands of job listings across various industries.</li>
          <li>User-friendly job search with advanced filters.</li>
          <li>Easy application process with resume upload and tracking.</li>
          <li>Employer dashboard for posting jobs and managing applications.</li>
        </ul>

        <h2 className="section-title">Contact Us</h2>
        <p>Have questions? Reach out at <span className="contact-email">support@RoleNex.com</span></p>
      </div>

      {/* FOOTER */}
      <Footer/>
    </>
  );
}

export default AboutUs;
