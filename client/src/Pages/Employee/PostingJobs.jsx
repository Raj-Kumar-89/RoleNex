import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiMail, FiTag, FiEdit3, FiUsers, FiCpu, FiClock, FiImage } from 'react-icons/fi';
import { FaBriefcase, FaBuilding, FaRegPaperPlane } from 'react-icons/fa';
import Footer from '../../components/Footer';
import EmpHeader from '../../components/EmpHeader';

function PostingJobs() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [qualification,setQualification]=useState('');
  const [company, setCompany] = useState('');
  const [companylogo, setCompanylogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [technology, setTechnology] = useState('');
  const [positions, setPosition] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [contactemail, setContactemail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const empData = JSON.parse(localStorage.getItem("empData"));
    if (!empData || !empData.id) {
      alert("Employee ID not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("company", company);
    formData.append("qualification",qualification);
    if (companylogo) formData.append("company_logo", companylogo);
    formData.append("technology", technology);
    formData.append("positions", positions);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("salary", salary);
    formData.append("contactemail", contactemail);
    formData.append("postedBy", empData.id);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/postjobs`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Job posted successfully!");
      navigate("/employeeprofile");
    } catch (err) {
      console.error("Post Job Error:", err.response?.data || err);
      alert("Failed to post job.");
    }
  };


  return (
    <>
      <EmpHeader />
      <section className="postingjobs">
        <h1>Post A Job</h1>
        <div className="postingcontainer">
          <form id="jobPostForm" onSubmit={handleSubmit} encType="multipart/form-data">

            <label><FaBriefcase className="icon" /> Job Title <span className="required-star">*</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Frontend Developer" required />

            <label><FiEdit3 className="icon" /> Job Description <span className="required-star">*</span></label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the job role..." required></textarea>

            <label><FaBriefcase className="icon" />Required Qualification<span className="required-star">*</span></label>
            <input type="text" value={qualification} onChange={e =>setQualification(e.target.value)} placeholder="Ex: MCA" required />

            <label><FaBuilding className="icon" /> Company Name <span className="required-star">*</span></label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Ex: Tech Solutions Ltd." required />

            <label><FiImage className="icon" /> Company Logo</label>
            <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; setCompanylogo(file); setLogoPreview(file ? URL.createObjectURL(file) : null); }} />
            {logoPreview && <img src={logoPreview} alt="Company Logo Preview" width="100" />}

            <label><FiCpu className="icon" /> Technology Stack <span className="required-star">*</span> </label>
            <input type="text" value={technology} onChange={e => setTechnology(e.target.value)} placeholder="Ex: React, Node.js, MongoDB" required />

            <label><FiUsers className="icon" /> Number of Positions <span className="required-star">*</span></label>
            <input type="number" value={positions} onChange={e => setPosition(e.target.value)} min="1" placeholder="Ex: 2" required />

            <label><FiClock className="icon" /> Job Type <span className="required-star">*</span></label>
            <select value={type} onChange={e => setType(e.target.value)} required>
              <option value="" disabled>Select job type</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>

            <label><FiTag className="icon" /> Job Category <span className="required-star">*</span></label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Marketing" required />

            <label><FiMapPin className="icon" /> Location <span className="required-star">*</span></label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: New York, NY" required />

            <label><FiDollarSign className="icon" /> Salary (Optional)</label>
            <input type="text" value={salary} onChange={e => setSalary(e.target.value)} placeholder="Ex: Rs.50,000 - Rs.70,000" />
            <p className='note'>Note: No Need To Enter If Salary Is Negotiable</p>

            <label><FiMail className="icon" /> Contact Email <span className="required-star">*</span></label>
            <input type="email" value={contactemail} onChange={e => setContactemail(e.target.value)} placeholder="Ex: xyz@gmail.com" required />

            <button type="submit"><FaRegPaperPlane/> Post Job</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PostingJobs;