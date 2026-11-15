import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiMail, FiTag, FiUsers, FiCpu, FiClock, FiUser } from 'react-icons/fi';
import { FaBuilding, FaFilePdf } from 'react-icons/fa';
import Jsheader from '../../components/Jsheader';
import Footer from '../../components/Footer';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ApplyJobs() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jsqualification:'',
    resume: null,
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.error(err));

    const jsData = localStorage.getItem("jsData");
    if (jsData) {
      const { name, email } = JSON.parse(jsData);
      setFormData(prev => ({ ...prev, name, email }));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      alert('Please fill all required fields and upload resume.');
      return;
    }

    const jobQuals = job?.qualification ?.split(",").map(q => q.trim().toLowerCase());
    const jsQual = formData.jsqualification.trim().toLowerCase();
    
    if ( jobQuals && jobQuals.length > 0 && !jobQuals.includes(jsQual)) {
      alert(
        `Your qualification (${formData.jsqualification}) does not match the job requirement (${job.qualification}).`
      );
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("qualification",formData.jsqualification);
    data.append("resume", formData.resume);
    data.append("jobId", job._id);
    data.append("jobseekerId", JSON.parse(localStorage.getItem("jsData")).id);
    data.append("empId", job.postedBy);

    data.append("jobTitle", job.title || "");
    data.append("company", job.company || "");
    data.append("technology", job.technology || "");
    data.append("positions", job.positions || 0);
    data.append("type", job.type || "");
    data.append("category", job.category || "");
    data.append("location", job.location || "");
    data.append("contactEmail", job.contactemail || "");
    data.append("salary", job.salary || "");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/applyjobs`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      setMessage("Application submitted successfully!");
      setFormData(prev => ({ ...prev, resume: null }));
      navigate("/jobseekersprofile");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit application. Please try again.");
    }
  };

  if (!job) {
    return <div className="apply-jobs-notfound">Job not found.</div>;
  }

  return (
    <>
      <Jsheader />

      <section className="apply-jobs-section">
        
        {message && (
          <p className={`submission-message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <h1 className="section-title">Apply for Job <span className="section-title-job">{job.title}</span></h1>
        <div className="apply-form-container">

          <h1 className="apply-info-title">Job Info</h1>
          <form className="apply-form">

            <label htmlFor="jobTitle"><FiBriefcase className="icon" /> Job Title</label>
            <input type="text" id="jobTitle" value={job.title || ''} disabled />

            <label htmlFor="jobDesc">Job Description</label>
            <textarea id="jobDesc" value={job.desc || ''} rows="1" disabled></textarea>

            <label htmlFor="jobQualification">Qualification</label>
            <input type="text" id="jobQualification" value={job.qualification || ''} disabled />

            <label htmlFor="company"><FaBuilding className="icon" /> Company Name</label>
            <input type="text" id="company" value={job.company || ''} disabled />

            <label htmlFor="technology"><FiCpu className="icon" /> Technology Stack</label>
            <input type="text" id="technology" value={job.technology || ''} disabled />

            <label htmlFor="positions"><FiUsers className="icon" /> Number of Positions</label>
            <input type="number" id="positions" value={job.positions || ''} disabled />

            <label htmlFor="type"><FiClock className="icon" /> Job Type</label>
            <input type="text" id="type" value={job.type || ''} disabled />

            <label htmlFor="jobCategory"><FiTag className="icon" /> Job Category</label>
            <input type="text" id="jobCategory" value={job.category || ''} disabled />

            <label htmlFor="location"><FiMapPin className="icon" /> Location</label>
            <input type="text" id="location" value={job.location || ''} disabled />

            <label htmlFor="contactEmail"><FiMail className="icon" /> Contact Email</label>
            <input type="email" id="contactEmail" value={job.contactemail || ''} disabled />

            <label htmlFor="salary"><FiDollarSign className="icon" /> Salary</label>
            <input type="text" id="salary" value={job.salary || ''} disabled />

          </form>

          <h1 className="apply-personal-title">Personal Info</h1>

          <form className="apply-form" onSubmit={handleSubmit}>

            <label htmlFor="name"><FiUser className="icon" /> Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

            <label htmlFor="jsqualification"><FiUser className="icon" /> Qualification</label>
            <input type="text" id="jsqualification" name="jsqualification" value={formData.jsqualification} onChange={handleChange} required />

            <label htmlFor="email"><FiMail className="icon" /> Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="resume"><FaFilePdf className="icon" /> Resume</label>
            <input type="file" id="resume" name="resume" accept="application/pdf" onChange={handleChange} required />

            <button type="submit" className='apply-btn'>Apply</button>

          </form>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default ApplyJobs;