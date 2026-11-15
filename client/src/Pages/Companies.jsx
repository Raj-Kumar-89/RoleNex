import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import EmpHeader from "../components/EmpHeader";
import JsHeader from "../components/Jsheader";
import Footer from "../components/Footer";
import { FaBriefcase, FaUser } from "react-icons/fa6";

function Companies() {  

  const adminToken = localStorage.getItem("adminToken");
  const jsToken = localStorage.getItem("jsToken");
  const empToken = localStorage.getItem("empToken");

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/home/companies`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCompanies(data);
        if (data.length > 0) setSelectedCompany(data[0]);
      } catch {
        setError("Failed to load companies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      { adminToken ? ( <AdminHeader /> ) : jsToken ? ( <JsHeader /> ) : empToken ? ( <EmpHeader /> ) : ( <Header /> ) }

      <div className="companies-page">
        {/* Page title */}
        <div className="companies-page-header">
          <div>
            <h2 className="companies-page-title">Explore Companies</h2>
            <p className="companies-page-sub">Discover top employers hiring on RoleNex</p>
          </div>
          <input
            type="text"
            className="companies-search-input"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p className="companies-loading">Loading companies...</p>}
        {error && <p className="companies-error">{error}</p>}

        {!loading && !error && (
          <div className="companies-split-layout">
            {/* LEFT: Company List */}
            <aside className="companies-list-panel">
              {filtered.length === 0 ? (
                <p className="companies-empty">No companies found.</p>
              ) : (
                filtered.map((company, idx) => (
                  <div
                    key={idx}
                    className={`company-list-item ${selectedCompany?.name === company.name ? "active" : ""}`}
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="company-list-logo-wrap">
                      {getImageUrl(company.image) ? (
                        <img
                          src={getImageUrl(company.image)}
                          alt={company.name}
                          className="company-list-logo"
                          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                        />
                      ) : null}
                      <div className="company-list-logo-fallback" style={{ display: getImageUrl(company.image) ? "none" : "flex" }}>
                        {company.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="company-list-info">
                      <h4 className="company-list-name">{company.name}</h4>
                      <p className="company-list-jobs">
                        {company.jobCount > 0
                          ? `${company.jobCount} open position${company.jobCount > 1 ? "s" : ""}`
                          : "No open positions"}
                      </p>
                    </div>
                    <span className={`company-list-badge ${company.jobCount > 0 ? "has-jobs" : ""}`}>
                      {company.jobCount}
                    </span>
                  </div>
                ))
              )}
            </aside>

            {/* RIGHT: Company Detail */}
            <main className="companies-detail-panel">
              {!selectedCompany ? (
                <div className="companies-detail-placeholder">
                  <p>Select a company to see details</p>
                </div>
              ) : (
                <div className="companies-detail-content">
                  {/* Company Header */}
                  <div className="company-detail-header">
                    <div className="company-detail-logo-wrap">
                      {getImageUrl(selectedCompany.image) ? (
                        <img
                          src={getImageUrl(selectedCompany.image)}
                          alt={selectedCompany.name}
                          className="company-detail-logo"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="company-detail-logo-fallback">
                          {selectedCompany.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="company-detail-title-area">
                      <h2 className="company-detail-name">{selectedCompany.name}</h2>
                      <div className="company-detail-stats">
                        <span className="company-stat-pill">
                          <FaUser/> {selectedCompany.employeeCount} HR/Employee(s)
                        </span>
                        <span className="company-stat-pill">
                          <FaBriefcase/> {selectedCompany.jobCount} Open Job(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="company-detail-section">
                    <h3 className="company-detail-section-title">About</h3>
                    <p className="company-detail-description">{selectedCompany.description}</p>
                  </div>

                  {/* Open Jobs */}
                  <div className="company-detail-section">
                    <h3 className="company-detail-section-title">
                      Open Positions
                      {selectedCompany.jobCount > 0 && (
                        <span className="company-jobs-count-badge">{selectedCompany.jobCount}</span>
                      )}
                    </h3>

                    {selectedCompany.openJobs && selectedCompany.openJobs.length > 0 ? (
                      <div className="company-detail-jobs-grid">
                        {selectedCompany.openJobs.map((job, i) => (
                          <div key={i} className="company-detail-job-card">
                            <h4 className="company-detail-job-title">{job.title}</h4>
                            <div className="company-detail-job-tags">
                              <span className="tag type">{job.type}</span>
                              <span className="tag">{job.location}</span>
                              {job.salary && <span className="tag salary">{job.salary}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="company-no-jobs-msg">
                        <p>No open positions at the moment. Check back later!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Companies;