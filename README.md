# RoleNex – Online Job Portal System

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Academic%20Project-blue)

### Live Demo
[View Live Project](your_url)

### Source Code
[GitHub Repository](https://github.com/Raj-Kumar-89/RoleNex---Online-Job-Portal-System)

A modern **Online Job Portal System** developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The platform connects **Job Seekers**, **Employers**, and **Administrators** in a single application where recruiters can post jobs, candidates can apply for opportunities, and administrators can manage the entire system.

---

# Project Overview

RoleNex is a full-stack recruitment platform designed to simplify the hiring process.

The application provides three different user roles:

-  Employers
-  Job Seekers
-  Administrators

The project follows the **MVC Architecture**, exposes **RESTful APIs**, uses **JWT Authentication** for security, and stores application data in **MongoDB**.

---

# Features

## Job Seeker Module

- User Registration
- Secure Login & Logout
- Forgot Password
- Change Password
- JWT Authentication
- Profile Management
- Upload Profile Picture
- Upload Resume (PDF)
- Browse Jobs
- View Job Details
- Apply for Jobs
- View Applied Jobs
- Track Application Status

---

## Employer Module

- Employer Registration
- Secure Login & Logout
- Forgot Password
- Change Password
- Company Profile Management
- Upload Company Logo
- Post New Jobs
- Edit Jobs
- Delete Jobs
- View Posted Jobs
- View Applications
- Download Applicant Resumes
- View Applicant Profiles

---

## Administrator Module

- Secure Admin Login
- Dashboard
- Manage Employers
- Manage Job Seekers
- Manage Contact Messages
- View All Applications
- Platform Monitoring
- Logout

---

# Technologies Used

| Technology | Purpose |
|------------|----------|
| React.js | Frontend |
| JavaScript (ES6+) | Programming Language |
| Node.js | Backend Runtime |
| Express.js | REST API Development |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt.js | Password Encryption |
| Multer | File Upload |
| Axios | API Requests |
| React Router DOM | Routing |
| CSS3 | Styling |
| Vite | Frontend Build Tool |
| Nodemon | Development Server |

---

# Project Structure

```text
RoleNex/
│
├── client/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── default-avatar.png
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── EmpHeader.jsx
│   │   │   ├── Jsheader.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── Pages/
│   │   │   │
│   │   │   ├── Admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ManageContactUs.jsx
│   │   │   │   ├── ManageEmployee.jsx
│   │   │   │   ├── ManageJobSeeker.jsx
│   │   │   │   └── ViewApplications.jsx
│   │   │   │
│   │   │   ├── Employee/
│   │   │   │   ├── EmployeeRegister.jsx
│   │   │   │   ├── EmployeeLogin.jsx
│   │   │   │   ├── Empprofile.jsx
│   │   │   │   ├── PostingJobs.jsx
│   │   │   │   ├── PostedJobs.jsx
│   │   │   │   ├── ViewJobApplications.jsx
│   │   │   │   ├── HrViewEmp.jsx
│   │   │   │   ├── EmpForgotPwd.jsx
│   │   │   │   └── EmpChangePwd.jsx
│   │   │   │
│   │   │   └── JobSeekers/
│   │   │       ├── JobSeekerRegister.jsx
│   │   │       ├── JobSeekerLogin.jsx
│   │   │       ├── JSProfile.jsx
│   │   │       ├── ApplyJobs.jsx
│   │   │       ├── AppliedJobs.jsx
│   │   │       ├── JsForgotPwd.jsx
│   │   │       └── JsChangePwd.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── adminControllers.js
│   │   ├── contactController.js
│   │   ├── empControllers.js
│   │   ├── homeControllers.js
│   │   ├── jobController.js
│   │   └── jobseekerControllers.js
│   │
│   ├── middlewares/
│   │   ├── upload.js
│   │   └── verifyAdminToken.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Applications.js
│   │   ├── ContactMessages.js
│   │   ├── Emp.js
│   │   ├── Job.js
│   │   └── JobSeeker.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── empRoutes.js
│   │   ├── homeRoutes.js
│   │   ├── jobRoutes.js
│   │   └── jobseekerRoutes.js
│   │
│   ├── uploads/
│   │   ├── companies/
│   │   ├── employees/
│   │   ├── jobseekers/
│   │   └── resumes/
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Database Collections

The application stores data in the following MongoDB collections:

- Admin
- Employees
- JobSeekers
- Jobs
- Applications
- ContactMessages

MongoDB **ObjectIds** are used to establish relationships between users, jobs, and applications.

---

# Application Workflow

## Job Seeker

1. Register
2. Login
3. Complete Profile
4. Upload Resume
5. Browse Jobs
6. Apply for Jobs
7. Track Applications
8. Update Profile

---

## Employer

1. Register
2. Login
3. Post Jobs
4. Edit/Delete Jobs
5. View Applications
6. Download Resumes

---

## Administrator

1. Login
2. Dashboard
3. Manage Employers
4. Manage Job Seekers
5. Manage Contact Messages
6. View Applications
7. Monitor Platform

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/RajK-89/RoleNex---Online-Job-Portal-System-Using-MERN.git
```

---

## 2. Navigate to Project

```bash
cd RoleNex
```

---

## 3. Install Root Dependencies

```bash
npm install
```

## 4. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 5. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 6. Return to the Project Root

```bash
cd ..
```

# Environment Variables

## Server

Create **server/.env**

```env
PORT=your_port_number

MONGODB_URI=your_mongoDB_url

# JWT Secret for Admin
JWT_SECRET=your_super_secret_key

# JWT Secret for Jobseekers
JSSECRET_KEY=your_super_secret_key

# JWT Secret for Employees
EMPSECRET_KEY=your_super_secret_key

```
---

## Client

Create **client/.env**

```env
VITE_API_URL=your_backend_url
```
---

# Running the Project

After installing all dependencies and configuring the environment variables, start both the frontend and backend servers simultaneously from the project root.

```bash
npm run dev
```

This command uses **concurrently** to run both the React frontend and Express backend at the same time.

## Open in Browser

```
http://localhost:5173
```

---

# REST API Modules

## Authentication APIs

- Register
- Login
- Forgot Password
- Change Password
- JWT Authentication

---

## Job APIs

- Add Job
- Update Job
- Delete Job
- View Jobs
- Apply Job

---

## Employer APIs

- Company Profile
- Upload Logo
- Manage Jobs
- View Applications

---

## Job Seeker APIs

- Profile Management
- Upload Resume
- Apply Jobs
- Applied Jobs

---

## Admin APIs

- Dashboard
- Manage Employers
- Manage Job Seekers
- Contact Messages
- View Applications

---

# Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Authorization
- Input Validation
- Secure File Uploads
- Environment Variables
- MongoDB Validation

---

# Concepts Used

- MERN Stack
- MVC Architecture
- REST APIs
- CRUD Operations
- JWT Authentication
- Role-Based Access Control (RBAC)
- React Hooks
- React Router DOM
- MongoDB & Mongoose
- Multer File Upload
- Password Encryption
- Responsive Design

---

# Future Enhancements

- Email Verification
- OTP-Based Password Reset
- Resume Parsing
- AI Resume Screening
- Job Recommendation System
- Interview Scheduling
- Real-Time Notifications
- Saved Jobs
- Company Reviews
- Advanced Search Filters
- Chat System
- Video Interviews

---

# Learning Outcomes

This project helped strengthen my knowledge in:

- Full Stack MERN Development
- React.js
- Node.js
- Express.js
- MongoDB
- REST API Development
- JWT Authentication
- Password Encryption
- File Upload using Multer
- MVC Architecture
- CRUD Operations
- Role-Based Access Control
- State Management
- Git & GitHub

---

# Author

**Raj Kumar**

MERN Stack Developer

- GitHub: https://github.com/Raj-Kumar-89
- LinkedIn: https://www.linkedin.com/in/raj-kumar13/

---

## License

This project is intended for educational and portfolio purposes.
