import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./Pages/Home";
import Jobs from "./Pages/Jobs";
import Companies from "./Pages/Companies";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";

import AdminLogin from "./Pages/Admin/AdminLogin";
import Dashboard from "./Pages/Admin/Dashboard";
import ManageEmployee from "./Pages/Admin/ManageEmployee";
import ManageJobSeeker from "./Pages/Admin/ManageJobSeeker";
import ViewApplications from "./Pages/Admin/ViewApplications";
import ManageContactUs from "./Pages/Admin/ManageContactUs";

import EmployeeLogin from "./Pages/Employee/EmployeeLogin";
import EmployeeRegister from "./Pages/Employee/EmployeeRegister";
import Empprofile from "./Pages/Employee/Empprofile";
import PostingJobs from "./Pages/Employee/PostingJobs";
import PostedJobs from "./Pages/Employee/PostedJobs";
import EmpForgotPwd from "./Pages/Employee/EmpForgotPwd";
import EmpChangePwd from "./Pages/Employee/EmpChangePwd";
import ViewJobApplications from "./Pages/Employee/ViewJobApplications";
import HrViewEmp from "./Pages/Employee/HrViewEmp";

import JobSeekerLogin from "./Pages/JobSeekers/JobSeekerLogin";
import JobSeekerRegister from "./Pages/JobSeekers/JobSeekerRegister";
import JSProfile from "./Pages/JobSeekers/JSProfile";
import ApplyJobs from "./Pages/JobSeekers/ApplyJobs";
import JsForgotPwd from "./Pages/JobSeekers/JsForgotPwd";
import JsChangePwd from "./Pages/JobSeekers/JsChangePwd";
import AppliedJobs from "./Pages/JobSeekers/AppliedJobs";

export default function App() {
  return (
      <Routes>
                          {/* COMMON PAGES*/}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
                          
                          {/* ADMIN PAGES*/}
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/dashboard" element={
          <PrivateRoute tokenKey="adminToken">
            <Dashboard/>
          </PrivateRoute>
        }/>
        <Route path="/manageemployees" element={
          <PrivateRoute tokenKey="adminToken">
            <ManageEmployee/>
          </PrivateRoute>
        }/>
        <Route path="/managejobseekers" element={
          <PrivateRoute tokenKey="adminToken">
            <ManageJobSeeker/>
          </PrivateRoute>
        }/>
        <Route path="/viewapplications" element={
          <PrivateRoute tokenKey="adminToken">
            <ViewApplications/>
          </PrivateRoute>
        }/>
        <Route path="/managecontact" element={
          <PrivateRoute tokenKey="adminToken">
            <ManageContactUs />
          </PrivateRoute>
        }
      />
                          
                          {/* EMPLOYEES PAGES*/}
        <Route path="/employeelogin" element={<EmployeeLogin/>}/>
        <Route path="/employeeregister" element={<EmployeeRegister/>}/>
        <Route path="/employeeprofile" element={
          <PrivateRoute tokenKey="empToken">
            <Empprofile/>
          </PrivateRoute>
        }/>
        <Route path="/postingjobs" element={
          <PrivateRoute tokenKey="empToken">
            <PostingJobs/>
          </PrivateRoute>
        }/>
        <Route path="/postedjobs" element={
          <PrivateRoute tokenKey="empToken">
            <PostedJobs/>
          </PrivateRoute>
        }/>
        <Route path="/employeeforgotpassword" element={<EmpForgotPwd/>}/>
        <Route path="/empchangepassword" element={
          <PrivateRoute tokenKey="empToken">
            <EmpChangePwd/>
          </PrivateRoute>
        }/>
        <Route path="/employeeviewapplications" element={
          <PrivateRoute tokenKey="empToken">
            <ViewJobApplications/>
          </PrivateRoute>
        }/>
        <Route path="/hrviewemployee" element={
          <PrivateRoute tokenKey="empToken">
            <HrViewEmp/>
          </PrivateRoute>
        }/>
                          
                          {/* JOBSEEKERS PAGES*/}
        <Route path="/jobseekerlogin" element={<JobSeekerLogin/>}/>
        <Route path="/jobseekerregister" element={<JobSeekerRegister/>}/>
        <Route path="/jobseekerforgotpassword" element={<JsForgotPwd/>}/>
        <Route path="/jobseekersprofile" element={
          <PrivateRoute tokenKey="jsToken">
            <JSProfile/>
          </PrivateRoute>
        } />
        <Route path="/applyjobs/:id" element={<ApplyJobs />} />
        <Route path="/appliedjobs" element={
          <PrivateRoute tokenKey="jsToken">
            <AppliedJobs/>
          </PrivateRoute>
        } />
        <Route path="/jobseekerchangepassword" element={
          <PrivateRoute tokenKey="jsToken">
            <JsChangePwd/>
          </PrivateRoute>
        } />
      </Routes>
  );
}