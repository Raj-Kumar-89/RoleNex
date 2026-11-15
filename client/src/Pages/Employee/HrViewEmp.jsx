import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmpHeader from "../../components/EmpHeader";
import Footer from "../../components/Footer";
import defaultAvatar from "../../assets/default-avatar.png";

function HrViewEmp() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Helper to show image
  const getFullUrl = (path) => {
    if (!path) return defaultAvatar;
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_URL}/${path}`;
  };

  useEffect(() => {
    const empData = localStorage.getItem("empData");

    if (!empData) {
      navigate("/employeelogin");
      return;
    }

    const emp = JSON.parse(empData);

    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employees/hrviewemployees/${emp.company}`
        );

        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Access denied or failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  return (
    <>
      <EmpHeader />

      <div className="hrviewemployees-container">
        <h1 className="hrviewemployees-title">
          All Employees from {employees[0]?.company || "Your Company"}
        </h1>

        {loading ? (
          <p className="hrviewemployees-loading">Loading employees...</p>
        ) : error ? (
          <p className="hrviewemployees-error">{error}</p>
        ) : employees.length === 0 ? (
          <p className="hrviewemployees-loading">
            No employees found for this company.
          </p>
        ) : (
          <div className="hrviewemployees-table-wrap">
            <table className="hrviewemployees-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Contact</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td data-label="Profile" className="hrviewemployees-pic-cell">
                      <img
                        src={getFullUrl(emp.profile_pic)}
                        alt="Profile"
                        className="hrviewemployees-profile-pic"
                      />
                    </td>
                    <td data-label="Name">{emp.name}</td>
                    <td data-label="Email">{emp.email}</td>
                    <td data-label="Company">{emp.company}</td>
                    <td data-label="Position">{emp.position}</td>
                    <td data-label="Contact">{emp.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default HrViewEmp;