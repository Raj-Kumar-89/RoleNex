import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";

function ManageEmployee() {
  const [employeesList, setEmployeesList] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/employees`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployeesList(res.data);
      setLoadingEmployees(false);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      setErrorEmployees("Failed to load employees");
      setLoadingEmployees(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/employees/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployeesList(employeesList.filter((emp) => emp._id !== id));
      } catch (err) {
        console.error("Failed to delete employee:", err);
        alert("Failed to delete employee");
      }
    }
  };

  return (
  <>

    <AdminHeader/>

    <div className="admin-managejobseekerandemp-card">
      <h2 className="admin-managejobseekerandemp-card-header-title">Employees List</h2>
      <div className="admin-managejobseekerandemp-card-body">
        {loadingEmployees ? (
          <p>Loading employees...</p>
        ) : errorEmployees ? (
          <p className="admin-error">{errorEmployees}</p>
        ) : (
          <table className="admin-managejobseekerandemp-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Position</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employeesList.length > 0 ? (
                employeesList.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.company}</td>
                    <td>{emp.position}</td>
                    <td>{emp.mobile}</td>
                    <td><button className="delete-button" onClick={() => handleDelete(emp._id)}>Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Footer */}
    <Footer/>
    </>
  );
}

export default ManageEmployee;